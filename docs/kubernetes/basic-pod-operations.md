---
sidebar_position: 5
---

# Basic pod operations

Basic operations with pods

## Check pod status 

Check list of namespaces:

```shell
kubectl get namespaces
kubectl get ns
```

List pods in `default` namespace:

```shell
kubectl get pods
```

List pods in `kube-system` namespace:

```shell
kubectl get pods -n kube-system
kubectl get pods -n kube-system -o wide
```

List pods in all namespaces:

```shell
kubectl get pods -A
kubectl get pods -A -o wide
```

Check pod details:

```shell
kubectl describe pod -n kube-system kube-apiserver-cp1
```

## Create basic pod application

Create `app` namespace:

```shell
kubectl create ns app
```

Create basic pod in `app` namespace:

```shell
kubectl run -n app app --image=nginx:1.23.3
```

Check pod status and wait until it will have `Running` status:

```shell
kubectl get pod -n app app -o wide -w
``` 

Check logs of `app` pod container;

```shell
kubectl logs -n app app
```

Open terminal  to `app` pod container:

```shell
kubectl exec -n app -ti app -- sh
# ls
# exit
```

Cleanup `app` pod:

```shell
kubectl delete pod -n app app
kubectl delete ns app
```

## Generate pod template

Create new namespace:

```shell
kubectl create ns frontend
kubectl get ns
```

Generate `webapp` pod template:

```shell
kubectl run webapp -n frontend --image=nginx:1.22 --dry-run=client -o yaml
```

Save pod template as a `yaml` manifest:

```shell
kubectl run webapp -n frontend --image=nginx:1.22 --dry-run=client -o yaml > pod-webapp.yaml
```

Apply pod manifest to cluster:

```shell
kubectl apply -f pod-webapp.yaml
```

Verify operation on cluster"

```shell
kubectl get pods -n frontend -o wide
```

Cleanup environment 

```shell
kubectl delete namespace frontend
```
