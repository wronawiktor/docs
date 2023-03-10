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

More commands and option you will find in official `kubectl` [Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)

## Learn how to use labels

Check labes for nodes and add label role:

```shell
kubectl get nodes --show-labels
kubectl label node worker2 disk=ssd
```

Show labels once again and try to find label `disk=ssd`:

```shell
kubectl get nodes --show-labels
```

Remove label from node:

```shell
kubectl label node worker2 disk-
```

## Learn how to generate example `yaml` manifests

Generate Pod `yaml` template manifest:

```shell
kubectl run test --image=nginx --dry-run -o yaml
```

Generate Deployment `yaml` template manifest:

```shell
kubectl create deployment nginx --image=nginx --dry-run -o yaml
```

Generate Service `yaml` template service manifest:

```shell
kubectl create service clusterip my-service --tcp=8080 --dry-run -o yaml
```

## How to dry run Pod containers

Start example `busybox` Pod container from command line:

```shell
kubectl run busybox --image=busybox --dry-run=client -- sleep 3600
```

Start example `debian` Pod container from command line:

```shell
kubectl run test --image=debian --dry-run=server -- sleep 3600
```
