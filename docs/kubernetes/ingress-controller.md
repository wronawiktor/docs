---
sidebar_position: 11
---

# Use an Ingress Controller


## Deploy the NGINX Ingress Controller

Note: [NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/deploy)

Add a Helm chart repository with the Ingress NGINX

```shell
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
```

Install the NGINX Ingress Controller:

```shell
helm install --create-namespace --namespace ingress-nginx ingress-nginx ingress-nginx/ingress-nginx
```

Update the NGINX Ingress Controller with `hostNetwork` true:

```shell
helm upgrade -n ingress-nginx ingress-nginx ingress-nginx/ingress-nginx --set controller.hostNetwork=true
```

Verify the Ingress NGINX installation:

```shell
kubectl get pods -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx
helm list -n ingress-nginx
```

Check installed Ingress NGINX version

```shell
POD_NAME=$(kubectl get pods -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx -o jsonpath='{.items[0].metadata.name}')
kubectl exec -n ingress-nginx -it $POD_NAME -- /nginx-ingress-controller --version
```

Output should be similar to:

```
-------------------------------------------------------------------------------
NGINX Ingress controller
  Release:       v1.5.1
  Build:         d003aae913cc25f375deb74f898c7f3c65c06f05
  Repository:    https://github.com/kubernetes/ingress-nginx
  nginx version: nginx/1.21.6

-------------------------------------------------------------------------------
```

## Deploy a hello-world app


Create a new Namespace:

```shell
kubectl create namespace webapp
```

Create a Deployment using the following command:

```shell
kubectl create deployment -n webapp hello-world --image=gcr.io/google-samples/hello-app:1.0 --replicas=3
```

Expose the Deployment:

```shell
kubectl expose deployment -n webapp hello-world --type=ClusterIP --port=8080
```

Verify if the Service is created and is available on a node port:

```shell
kubectl get service -n webapp hello-world
```

Output:

```
NAME      TYPE       CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
web       ClusterIP  10.104.133.249   <none>        8080/TCP         12m
```

Create an Ingress resource:

The following file is an Ingress resource that sends traffic to your Service via hello-world.nc.

Create the ingress-hello.yaml from the following file:

```yaml title="ingress-hello.yaml"
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-hello
  namespace: webapp
  annotations:
    kubernetes.io/ingress.class: "nginx"
spec:
  rules:
    - host: hello-world.nc
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: hello-world
                port:
                  number: 8080
```

Create the Ingress resource by running the following command:

```shell
kubectl apply -f ingress-hello.yaml
```

Verify on which node ingress-nginx is running:

```shell
kubectl get pods -n ingress-nginx -o wide
```

Use worker IP and then set /etc/hosts.

Add the following line to the bottom of the /etc/hosts file.

Note: The IP address displayed within the ingress list will be the internal IP.
```
IP_ADDRESS hello-world.nc
```

```shell
sudo bash -c 'echo "IP_ADDRESS hello-world.nc" >> /etc/hosts'
```

Verify if the Ingress controller is directing traffic:

```shell
curl http://hello-world.nc
```

or 

```shell
curl --header 'Host: hello-world.nc' http://IP_ADDRESS
```

Output:

```
Hello, world!
Version: 1.0.0
Hostname: hello-world-55b8c6998d-8k564
```

Create a second Deployment using the following command:

```shell
kubectl create deployment -n webapp hello-world2 --image=gcr.io/google-samples/hello-app:2.0
```

Expose the Deployment:

```shell
kubectl expose deployment -n webapp hello-world2 --port=8080 --type=ClusterIP
```

Edit the existing ingress-hello.yaml and add the following lines:

```
      - path: /v2
        pathType: Prefix
        backend:
          service:
            name: hello-world2
            port:
              number: 8080
```

Apply the changes:

```shell
kubectl apply -f ingress-hello.yaml
```

Test Your Ingress by accessing the 1st version of the Hello World app.

```shell
curl http://hello-world.nc
```

Output:

```
Hello, world!
Version: 1.0.0
Hostname: hello-world-55b8c6998d-8k564
```

Access the 2nd version of the Hello World app.

```shell
curl http://hello-world.info/v2
```

Output:

```
Hello, world!
Version: 2.0.0
Hostname: hello-world2-75cd47646f-t8cjk
```

## Install and use Certificate Manager

To secure HTTP connection to Ingress Controller we can use additional extension, which is [Certficate Manager](https://cert-manager.io/)

Add a Helm chart repository with the Certificate Manager

```shell
helm repo add jetstack https://charts.jetstack.io
helm repo update
```

Check available Certificate Manager versions:

```shell
helm search repo jetstack/cert-manager -l
```

Install the Certificate Manager:

```shell
helm install --create-namespace --namespace cert-manager cert-manager jetstack/cert-manager  \
            --version v1.10.2 --set installCRDs=true
```

Verify the Certificate Manager installation:

```shell
helm list -n cert-manager
helm status -n cert-manager cert-manager
helm history -n cert-manager cert-manager
```

Check if the Certificate Manager pods are running:

```shell
kubectl get pods -n cert-manager
```

Create certificate Issuers for webapp application:

We'll set up two issuers for Let's Encrypt in this example: staging and production

The Let's Encrypt production issuer has very strict rate limits. When you're experimenting and learning, it can be very easy to hit those limits. Because of that risk, we'll start with the Let's Encrypt staging issuer, and once we're happy that it's working we'll switch to the production issuer.

Note that you'll see a warning about untrusted certificates from the staging issuer, but that's totally expected.

Create this definition locally and update the email address to your own. This email is required by Let's Encrypt and used to notify you of certificate expiration and updates.

To learn more about it, go to official [Certificate Manager documentation](https://cert-manager.io/docs/tutorials/acme/nginx-ingress/#step-6---configure-a-lets-encrypt-issuer)

```yaml title="issuer-staging.yaml"
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: letsencrypt-staging
  namespace: webapp
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    email: example@your_domain.com
    privateKeySecretRef:
      name: letsencrypt-staging
    solvers:
    - http01:
        ingress:
          class:  nginx
```

```yaml title="issuer-production.yaml"
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: letsencrypt-production
  namespace: webapp
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: example@your_domain.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class:  nginx
```

Apply Issuer manifests onto Kubernetes:

```shell
kubectl apply -f issuer-staging.yaml
kubectl apply -f issuer-production.yaml
```

Both of these issuers are configured to use the `HTTP01` challenge provider.

Check on the status of the issuer after you create it:

```shell
kubectl describe -n webapp issuer letsencrypt-staging
```

Now we can tell Ingress NGINX to use Certificate Manager Issuer to secure communication:

```yaml title="ingress-hello.yaml"
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-hello
  namespace: webapp
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: letsencrypt-staging
spec:
  rules:
    - host: web<LAB_ID>.go4clouds.net
      http:
        paths:
          - path: /
...

  tls:
    - hosts:
      - web<LAB_ID>.go4clouds.net
```

Apply changes with Ingress to Kubernetes:

```shell
kubectl apply -f ingress-hello.yaml 
```

Now you should be able to open in your Web browser website `https://web<LAB_ID>.go4clouds.net`





