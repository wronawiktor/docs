---
sidebar_position: 3
---

# Basic cluster operations

Basic **Kubernetes** cluster operations

## Check the **Kubernets** cluster status

Get a list of Kubernetes cluster nodes:

```shell
kubectl get nodes
```

Run the previous command again with a new `-o wide` option and compare the outputs:

```shell
kubectl get nodes -o wide
```

Check the description of the control plane node `cp1`:

```shell
kubectl describe node cp1
```

Check the description for the node `worker1`:

```shell
kubectl describe node worker1
```

## Change a role description for nodes

Show labels for nodes:

```shell
kubectl get nodes --show-labels
```

Change the role name for data plane nodes:

```shell
kubectl label node worker1 node-role.kubernetes.io/worker=
kubectl label node worker2 node-role.kubernetes.io/worker=
```

> or use a simple script to make this change for all workers:
>
>```shell
>for SRV in worker{1,2,3}; do
>kubectl label node $SRV node-role.kubernetes.io/worker=
>done
>```

Check nodes labels:

```shell
kubectl get nodes
kubectl get nodes --show-labels
```

## Configure node taints and cordons

Check node taints for a cluster:

```shell
kubectl describe nodes | grep Taints
```

Disable scheduling for `worker1`:

```shell
kubectl taint node worker1 node-role.kubernetes.io/worker=:NoSchedule
```

Check the node taints once again:
 
```shell
kubectl describe nodes | grep Taints
```

Check the cluster status:

```shell
kubectl get nodes
```

Remove the node taint from `worker1`:

```shell
kubectl taint node worker1 node-role.kubernetes.io/worker-
```

Repeat this operation, but this time use the `cordon` subcommand:

```shell
kubectl cordon worker1
kubectl describe nodes | grep Taints
kubectl get nodes
```

Revert changes:

```shell
kubectl uncordon worker1
```

## Annotate nodes 

Annotate the `cp1` node:

```shell
kubectl annotate node cp1 description="This is Kubernetes control plane node!"
``` 

Check the section of annotations:

```shell
kubectl describe node cp1
```

Remove the annotation:

```shell
kubectl annotate node cp1 description-
```