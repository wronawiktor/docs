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

* Check the installed version

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

Create the hello-ingress.yaml from the following file:

```yaml title="hello-ingress.yaml"
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: hello-ingress
  namespace: webapp
  annotations:
    kubernetes.io/ingress.class: "nginx"
    nginx.ingress.kubernetes.io/rewrite-target: /$1
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
kubectl apply -f hello-ingress.yaml
```

Verify if the IP address is set:

```shell
kubectl get ingress -n webapp
```

Note: This can take a couple of minutes.

```
NAME              CLASS    HOSTS              ADDRESS        PORTS   AGE
hello-ingress     <none>   hello-world.nc     IP_ADDRESS     80      38s
```

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

Edit the existing hello-ingress.yaml and add the following lines:

```
      - path: /v2
        pathType: Prefix
        backend:
          service:
            name: web2
            port:
              number: 8080
```

Apply the changes:

```shell
kubectl apply -f hello-ingress.yaml
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