# Lab Exercises for Ingress Controller


## Exercise 0 - Deploy NGINX Ingress Controller

Note: [NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/deploy)

* Install NGINX Ingress Controller

```shell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.47.0/deploy/static/provider/baremetal/deploy.yaml
```

* Patch NGINX Ingress Controller with `hostNetwork` true

```shell
kubectl patch deployment -n ingress-nginx ingress-nginx-controller --type='json' -p='[{"op":"add", "path": "/spec/template/spec/hostNetwork", "value":true}]'
```

* Verify installation

```shell
kubectl get pods -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx --watch
```

* Check installed version

```shell
POD_NAMESPACE=ingress-nginx
POD_NAME=$(kubectl get pods -n $POD_NAMESPACE -l app.kubernetes.io/name=ingress-nginx --field-selector=status.phase=Running -o jsonpath='{.items[0].metadata.name}')

kubectl exec -it $POD_NAME -n $POD_NAMESPACE -- /nginx-ingress-controller --version
```

Output should be similar to

```
-------------------------------------------------------------------------------
NGINX Ingress controller
  Release:       v0.46.0
  Build:         6348dde672588d5495f70ec77257c230dc8da134
  Repository:    https://github.com/kubernetes/ingress-nginx
  nginx version: nginx/1.19.6

-------------------------------------------------------------------------------
```

## Exercise 1 - [Deploy a hello, world app](https://kubernetes.io/docs/tasks/access-application-cluster/ingress-minikube/#enable-the-ingress-controller)


Create new namespace:

```shell
kubectl create namespace app
```

Create a Deployment using the following command:

```shell
kubectl create deployment -n app web --image=gcr.io/google-samples/hello-app:1.0
```

Output:

```
deployment.apps/web created
```

Expose the Deployment:

```shell
kubectl expose deployment -n app web --type=ClusterIP --port=8080
```

Output:

```
service/web exposed
```

Verify the Service is created and is available on a node port:

```shell
kubectl get service -n app web
```

Output:

```
NAME      TYPE       CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
web       ClusterIP  10.104.133.249   <none>        8080/TCP         12m
```

Create an Ingress resource

The following file is an Ingress resource that sends traffic to your Service via hello-world.info.

Create hello-ingress.yaml from the following file:

```shell
cat > hello-ingress.yaml <<EOF
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: hello-ingress
  namespace: app
  annotations:
    kubernetes.io/ingress.class: "nginx"
    nginx.ingress.kubernetes.io/rewrite-target: /$1
spec:
  rules:
    - host: hello-world.info
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: web
                port:
                  number: 8080
EOF
```

Create the Ingress resource by running the following command:

```shell
kubectl apply -f hello-ingress.yaml
```

Output:

```
ingress.networking.k8s.io/example-ingress created
```

Verify the IP address is set:

```shell
kubectl get ingress -n app
```

Note: This can take a couple of minutes.

```
NAME              CLASS    HOSTS              ADDRESS        PORTS   AGE
hello-ingress     <none>   hello-world.info   10.168.0.202   80      38s
```

Add the following line to the bottom of the /etc/hosts file.

Note: The IP address displayed within the ingress list will be the internal IP.
```
10.168.0.202 hello-world.info
```

```shell
sudo bash -c 'echo "10.168.0.202 hello-world.info" >> /etc/hosts'
```

Verify that the Ingress controller is directing traffic:

```shell
curl hello-world.info
```

or 

```shell
curl --header 'Host: hello-world.info' http://10.168.0.202
```

Output:

```
Hello, world!
Version: 1.0.0
Hostname: web-55b8c6998d-8k564
```

Create a second Deployment using the following command:

```shell
kubectl create deployment -n app web2 --image=gcr.io/google-samples/hello-app:2.0
```

Output:

```
deployment.apps/web2 created
```

Expose the Deployment:

```shell
kubectl expose deployment -n app web2 --port=8080 --type=ClusterIP
```

Output:

```
service/web2 exposed
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

Output:

```
ingress.networking/example-ingress configured
```

Test Your Ingress by accessing the 1st version of the Hello World app.

```shell
curl hello-world.info
```

Output:

```
Hello, world!
Version: 1.0.0
Hostname: web-55b8c6998d-8k564
```

Access the 2nd version of the Hello World app.

```shell
curl hello-world.info/v2
```

Output:

```
Hello, world!
Version: 2.0.0
Hostname: web2-75cd47646f-t8cjk
```

