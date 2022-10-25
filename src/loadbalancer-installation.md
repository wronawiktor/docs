# Lab Exercises for Load Balancer


## Exercise 0 - Install bare-metal Load Balancer service

Note: [Bare-metal ingress controller consideration](https://kubernetes.github.io/ingress-nginx/deploy/baremetal/)

Note: [Metallb concept](https://metallb.universe.tf/concepts/)


* Install `metallb` as Load Balancer service

```shell
kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.10.2/manifests/namespace.yaml
kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.10.2/manifests/metallb.yaml
```

* Prepare Load Balancer network configuration 

```shell
cat > cm-metallb.yaml <<EOF
apiVersion: v1
kind: ConfigMap
metadata:
  namespace: metallb-system
  name: config
data:
  config: |
    address-pools:
    - name: default
      protocol: layer2
      addresses:
      - 10.168.0.50-10.168.0.80
EOF      
```

* Apply Load Balancer configuration

```shell
kubectl apply -f cm-metallb.yaml
```

* Verify `metallb` deployment installation

```shell
kubectl get -n metallb-system pods
kubectl logs -n metallb-system controller-<Tab>
```

* Create new application in specific namespace

```shell
kubectl create namespace front-web
kubectl create deployment -n front-web web-app --image=nginx
```

* Scale up application deployment

```shell
kubectl scale deployment -n front-web web-app --replicas=5
```

* Check deployment status

```shell
kubectl get deploy,rs,pods -o wide -n front-web
```

* Expose fronted application with service in mode `LoadBalancer`

```shell
kubectl expose deployment -n front-web web-app --port=80 --type=LoadBalancer
```

* Check service status

```shell
kubectl get svc -n front-web web-app
```

Output:

```
NAME      TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
web-app   LoadBalancer   10.106.220.243   10.168.0.52   80:32586/TCP   7s
```

* Try to connect from remote host

```shell
curl http://10.168.0.52
```


## Exercise 1 - Intergrate metallb with NGINX Ingress Controller

Note: [Bare-metal consideration](https://kubernetes.github.io/ingress-nginx/deploy/baremetal)


* Patch Ingress Controller and remove `hostNetwork` capability

```shell
kubectl patch deployment -n ingress-nginx ingress-nginx-controller --type='json' -p='[{"op":"remove", "path": "/spec/template/spec/hostNetwork"}]'
```

Output:

```
deployment.apps/ingress-nginx-controller patched
```

* Tell NGINX Ingress Controller to use LoadBalancer

```shell
kubectl patch svc -n ingress-nginx ingress-nginx-controller --type='json' -p='[{"op":"replace","path":"/spec/type", "value": "LoadBalancer" }]'
```

Output:

```
service/ingress-nginx-controller patched
```

* Delete LoadBalancer service 

```shell
kubectl delete service -n front-web web-app
```

* Expose once again `web-app` with `ClusterIP`

```shell
kubectl expose deployment -n front-web web-app --type=ClusterIP --port=80
```

* Check service object

```shell
kubectl get svc -n front-web
```

* Configure Ingress Controller service

```shell
cat > front-web.yaml <<EOF
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: frontend-ingress
  namespace: front-web
  annotations:
    kubernetes.io/ingress.class: "nginx"
    nginx.ingress.kubernetes.io/rewrite-target: /$1
spec:
  rules:
    - host: front-web.info
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: web-app
                port:
                  number: 80
EOF
```

* Apply ingress configuration

```shell
kubectl apply -f front-web.yaml
```

* Check `EXTERNAL-IP` for NGINX Ingress Controller

```shell
kubectl get svc -n ingress-nginx ingress-nginx-controller
```

Output:

```
NAME                       TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)                      AGE
ingress-nginx-controller   LoadBalancer   10.109.139.127   10.168.0.52   80:31801/TCP,443:31942/TCP   3h16m
```

* Check connection to `web-app`

```shell
curl -D- http://10.168.0.52 -H 'Host: front-web.info'
```

* Clean up

```shell
kubectl delete namespace front-web
```
