---
sidebar_position: 5
---

# Basic Pods operations

Basic operations with Pods

## Check Pods status 

Check the list of Namespaces:

```shell
kubectl get namespaces
kubectl get ns
```

List Pods in the `default` Namespace:

```shell
kubectl get pods
```

List Pods in the `kube-system` Namespace:

```shell
kubectl get pods -n kube-system
kubectl get pods -n kube-system -o wide
```

List Pods in all Namespaces:

```shell
kubectl get pods -A
kubectl get pods -A -o wide
```

Check Pod details:

```shell
kubectl describe pod -n kube-system kube-apiserver-cp1
```

## Create a basic Pod application

Create the `app` Namespace:

```shell
kubectl create ns app
```

Create a basic Pod in the `app` Namespace:

```shell
kubectl run -n app app --image=nginx:1.23.3
```

Check the Pod status and wait until the status changes to `Running`:

```shell
kubectl get pod -n app app -o wide -w
``` 

Check logs of the `app` Pod container;

```shell
kubectl logs -n app app
```

Open the terminal to the `app` Pod container:

```shell
kubectl exec -n app -ti app -- sh
# ls
# exit
```

Cleanup the `app` Pod:

```shell
kubectl delete pod -n app app
kubectl delete ns app
```

## Generate a Pod template

Create a new Namespace:

```shell
kubectl create ns frontend
kubectl get ns
```

Generate the `webapp` Pod template:

```shell
kubectl run webapp -n frontend --image=nginx:1.22 --dry-run=client -o yaml
```

Save the Pod template as the `yaml` manifest:

```shell
kubectl run webapp -n frontend --image=nginx:1.22 --dry-run=client -o yaml > pod-webapp.yaml
```

Apply the Pod manifest to a cluster:

```shell
kubectl apply -f pod-webapp.yaml
```

Verify the operation on the cluster:

```shell
kubectl get pods -n frontend -o wide
```

Get logs from `webapp` Pod container:

```shell
kubectl logs -n frontend webapp
```

Cleanup the environment 

```shell
kubectl delete namespace frontend
```
