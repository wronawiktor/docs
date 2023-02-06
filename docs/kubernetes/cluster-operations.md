---
sidebar_position: 3
---

# Basic cluster operations

Basic **Kubernetes** cluster operations

## Check the **Kubernets** cluster status

Get the Kubernetes cluster nodes list:

```shell
kubectl get nodes
```

Run again the previous command with a new option `-o wide` and compare outputs:

```shell
kubectl get nodes -o wide
```

Check the node description for the control plane node `cp1`:

```shell
kubectl describe node cp1
```

Check the node description for `worker1`:

```shell
kubectl describe node worker1
```

## Change a role description for nodes

Show labels for nodes:

```shell
kubectl get nodes --show-labels
```

Change a role name for data plane nodes:

```shell
kubectl label node worker1 node-role.kubernetes.io/worker=
kubectl label node worker2 node-role.kubernetes.io/worker=
```

or use a simple script to do this change for all workers:

```shell
for SRV in worker{1,2,3}; do
kubectl label node $SRV node-role.kubernetes.io/worker=
done
```

Check nodes labels:

```shell
kubectl get nodes
kubectl get nodes --show-labels
```

## Configure node taints

Check node taints for a cluster:

```shell
kubectl describe nodes | grep Taints
```

Disable worker1 from scheduling:

```shell
kubectl taint node worker1 node-role.kubernetes.io/worker=:NoSchedule
```

Check node taints once again:
 
```shell
kubectl describe nodes | grep Taints
```

Check the cluster status:

```shell
kubectl get nodes
```

Remove the node taint from worker1:

```shell
kubectl taint node worker1 node-role.kubernetes.io/worker-
```

Repeat this opeation but this time use the `cordon` subcommand:

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

Check the annotations section:

```shell
kubectl describe node cp1
```

Remove the annotation:

```shell
kubectl annotate node cp1 description-
```