---
sidebar_position: 12
---

# Use an Ingress Controller


## Deploy the NGINX Ingress Controller


:::tip Check documentation

[NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/deploy)

:::

Add a Helm chart repository with the Ingress NGINX:

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

Check the installed version of NGINX Ingress:

```shell
POD_NAME=$(kubectl get pods -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx -o jsonpath='{.items[0].metadata.name}')
kubectl exec -n ingress-nginx -it $POD_NAME -- /nginx-ingress-controller --version
```

Output should be similar to:

```console
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

<details>
<summary>See created Deployment </summary>

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  creationTimestamp: null
  labels:
    app: hello-world
  name: hello-world
  namespace: webapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: hello-world
  strategy: {}
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: hello-world
    spec:
      containers:
      - image: gcr.io/google-samples/hello-app:1.0
        name: hello-app
        resources: {}
status: {}

```

</details>

Expose the Deployment:

```shell
kubectl expose deployment -n webapp hello-world --type=ClusterIP --port=8080
```

<details>
<summary>See created Service </summary>

```yaml
apiVersion: v1
kind: Service
metadata:
  creationTimestamp: null
  labels:
    app: hello-world
  name: hello-world
  namespace: webapp
spec:
  ports:
  - port: 8080
    protocol: TCP
    targetPort: 8080
  selector:
    app: hello-world
  type: ClusterIP
status:
  loadBalancer: {}

```

</details>

Verify if the Service is created and is available on a node port:

```shell
kubectl get service -n webapp hello-world
```

Output:

```console
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
spec:
  ingressClassName: "nginx"
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

Verify on which node Ingress-Nginx is running:

```shell
kubectl get pods -n ingress-nginx -o wide
```

Use the worker IP, then set /etc/hosts.

Add the following line to the bottom of the /etc/hosts file.

:::note

The IP address displayed within the ingress list will be the internal IP.

:::

```console
IP_ADDRESS hello-world.nc
```

```shell
sudo bash -c 'echo "IP_ADDRESS hello-world.nc" >> /etc/hosts'
```

Check if the Ingress controller is directing traffic:

```shell
curl http://hello-world.nc
```

or

```shell
curl --header 'Host: hello-world.nc' http://IP_ADDRESS
```

Output:

```console
Hello, world!
Version: 1.0.0
Hostname: hello-world-55b8c6998d-8k564
```

### Create a second Deployment
Create a second Deployment using the following command:

```shell
kubectl create deployment -n webapp hello-world2 --image=gcr.io/google-samples/hello-app:2.0
```

<details>
<summary>See created Deployment </summary>

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  creationTimestamp: null
  labels:
    app: hello-world2
  name: hello-world2
  namespace: webapp
spec:
  replicas: 1
  selector:
    matchLabels:
      app: hello-world2
  strategy: {}
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: hello-world2
    spec:
      containers:
      - image: gcr.io/google-samples/hello-app:2.0
        name: hello-app
        resources: {}
status: {}

```

</details>

Expose the Deployment:

```shell
kubectl expose deployment -n webapp hello-world2 --port=8080 --type=ClusterIP
```

<details>
<summary>See created Service </summary>

```yaml
apiVersion: v1
kind: Service
metadata:
  creationTimestamp: null
  labels:
    app: hello-world2
  name: hello-world2
  namespace: webapp
spec:
  ports:
  - port: 8080
    protocol: TCP
    targetPort: 8080
  selector:
    app: hello-world2
  type: ClusterIP
status:
  loadBalancer: {}

```

</details>

Edit the existing ingress-hello.yaml and add the following lines:

```yaml
      - path: /v2
        pathType: Prefix
        backend:
          service:
            name: hello-world2
            port:
              number: 8080
```
<details>
<summary>See finall Ingress </summary>

```yaml title= ingress-hello.yaml"
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-hello
  namespace: webapp
spec:
  ingressClassName: "nginx"
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
          - path: /v2 
            pathType: Prefix
            backend:
              service:
                name: hello-world2
                port:
                  number: 8080
```
</details>

Apply the changes:

```shell
kubectl apply -f ingress-hello.yaml
```

Test your Ingress by accessing the 1st version of the Hello World app.

```shell
curl http://hello-world.nc
```

Output:

```console
Hello, world!
Version: 1.0.0
Hostname: hello-world-55b8c6998d-8k564
```

Access the 2nd version of the Hello World app.

```shell
curl http://hello-world.nc/v2
```

Output:

```console
Hello, world!
Version: 2.0.0
Hostname: hello-world2-75cd47646f-t8cjk
```

## Install and use Certificate Manager

To secure HTTP connection to the Ingress Controller we can use an additional extension, which is [Certficate Manager](https://cert-manager.io/)

Add a Helm chart repository with the Certificate Manager:

```shell
helm repo add jetstack https://charts.jetstack.io
helm repo update
```

Check available versions of Certificate Manager:

```shell
helm search repo jetstack/cert-manager -l
```

Install the Certificate Manager:

```shell
helm install --create-namespace --namespace cert-manager cert-manager jetstack/cert-manager  \
            --version v1.12.6 --set installCRDs=true
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

Create Certificate Issuers for the WebApp application:

We'll set up two issuers for Let's Encrypt in this example: staging and production.

The Let's Encrypt production issuer has very strict rate limits. When you're experimenting and learning, it can be very easy to hit those limits. Because of that risk, we'll start with the Let's Encrypt staging issuer, and once we're happy that it's working we'll switch to the production issuer.

:::note

You'll see a warning about untrusted certificates from the staging issuer, but that's totally expected.

:::

Create this definition locally and update the email address to your own. This email is required by Let's Encrypt and used to notify you of certificate expiration and updates.

:::tip To learn more

To learn more about it, go to official [Certificate Manager documentation](https://cert-manager.io/docs/tutorials/acme/nginx-ingress/#step-6---configure-a-lets-encrypt-issuer)


:::

```yaml title="issuer-staging.yaml"
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-staging
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    email: example@your_domain.com
    privateKeySecretRef:
      name: letsencrypt-staging
    solvers:
    - http01:
        ingress:
          class: nginx
```

```yaml title="issuer-production.yaml"
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-production
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: example@your_domain.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
```

Apply Issuer manifests onto Kubernetes:

```shell
kubectl apply -f issuer-staging.yaml
kubectl apply -f issuer-production.yaml
```

Both of these issuers are configured to use the `HTTP01` challenge provider.

Check on the status of the clusterissuer after you create it:

```shell
kubectl describe -n webapp clusterissuer letsencrypt-staging
```

Now we can tell Ingress NGINX to use Certificate Manager Issuer to secure communication:

```yaml title="ingress-hello.yaml"
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-hello
  namespace: webapp
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-staging
spec:
  ingressClassName: "nginx"
  rules:
    - host: web<LAB_ID>.go4clouds.net
      http:
        paths:
          - path: /
...

  tls:
    - hosts:
      - web<LAB_ID>.go4clouds.net
      secretName: web-go4clouds-net-tls
```

Apply changes to Kubernetes with Ingress:

```shell
kubectl apply -f ingress-hello.yaml
```

Now, you should be able to open the website `https://web<LAB_ID>.go4clouds.net` in your web browser.

Clean up:

```shell
kubectl delete ns webapp
```
