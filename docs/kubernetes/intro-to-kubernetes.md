---
sidebar_position: 2
---

# Introduction to Kubernetes

Basic **Kubernetes** client commands to check first

## `kubectl` basic commands

Run `Kubernetes` basic commands:

```shell
kubectl cluster-info
kubectl get nodes
kubectl get nodes -o wide
kubectl describe nodes
kubectl get ns
kubectl get pods --namespace kube-system
kubectl get pods --namespace kube-system -o wide
kubectl get pods --all-namespaces
kubectl get pods -A -o wide
kubectl describe pods
kubectl get events
kubectl get events --sort-by='.lastTimestamp' -A
kubectl api-resources
kubectl explain pod
kubectl explain pod --recursive
```

More commands and option you will find in official `kubectl` [Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)

## Learn how to use labels

Check labes for nodes and add label role:

```shell
kubectl get nodes --show-labels
kubectl label node worker2 disk=ssd
```

Remove label from node:

```shell
kubectl label node worker2 disk-
```

## Learn how to generate example `yaml` manifests

Generate pod `yaml` template manifest:

```shell
kubectl run test --image=nginx --dry-run -o yaml
```

Generate deployment `yaml` template manifest:

```shell
kubectl create deployment nginx --image=nginx --dry-run -o yaml
```

Generate service `yaml` template service manifest:

```shell
kubectl create service clusterip my-service --tcp=8080 --dry-run -o yaml
```

## Start first pod containers

Start example `busybox` pod container from command line:

```shell
kubectl run busybox --image=busybox -- sleep 3600
```

Start example `debian` pod container command line:

```shell
kubectl run test --image=debian -- sleep 3600
```