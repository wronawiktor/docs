---
sidebar_position: 2
---

# Introduction to Kubernetes

Basic **Kubernetes** client commands to check first

## Basic commands for kubectl

Run `kubectl` basic commands:

```shell
kubectl cluster-info
kubectl get nodes
kubectl get nodes -o wide
kubectl describe nodes
kubectl get namespaces
kubectl get ns
kubectl get pods --namespace kube-system
kubectl get pods -n kube-system -o wide
kubectl get pods --all-namespaces
kubectl get pods -A -o wide
kubectl describe pods -n kube-system
kubectl get events --all-namespaces
kubectl get events --sort-by='.lastTimestamp' -A
kubectl api-resources
kubectl explain pod
kubectl explain pod --recursive
```

You will find more commands and options in the official `kubectl` [Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)

## Learn how to use labels

Check labels for nodes and add label roles:

```shell
kubectl get nodes --show-labels
kubectl label node worker2 disk=ssd
```

Show the labels once again and try to find the label `disk=ssd`:

```shell
kubectl get nodes --show-labels
```

Remove label from node:

```shell
kubectl label node worker2 disk-
```

## Learn how to generate example `yaml` manifests

Generate `yaml` template manifest for Pod:

```shell
kubectl run test --image=nginx --dry-run=client -o yaml
```

Generate `yaml` template manifest for Deployment:

```shell
kubectl create deployment nginx --image=nginx --dry-run=client -o yaml
```

Generate `yaml` template manifest for Service:

```shell
kubectl create service clusterip my-service --tcp=8080 --dry-run=client -o yaml
```

## How to dry run Pod containers

Start the example `busybox` Pod container from the command line:

```shell
kubectl run busybox --image=busybox --dry-run=client -- sleep 3600
```

Start the example `debian` Pod container from the command line:

```shell
kubectl run test --image=debian --dry-run=server -- sleep 3600
```
