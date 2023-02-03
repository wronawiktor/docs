---
sidebar_position: 3
---

# Basic cluster operations

Basic **Kubernetes** cluster operations

## Check **Kubernets** cluster status

Get Kubernetes cluster nodes list:

```shell
kubectl get nodes
```

Run again previous command with new option `-o wide` and compare outputs:

```shell
kubectl get nodes -o wide
```

Check node description for control plane node `cp1`:

```shell
kubectl describe node cp1
```

Check node description for `worker1`:

```shell
kubectl describe node worker1
```

## Change role description for nodes

Show labels for nodes:

```shell
kubectl get nodes --show-labels
```

Change role name for data plane nodes:

```shell
kubectl label node worker1 node-role.kubernetes.io/worker=
kubectl label node worker2 node-role.kubernetes.io/worker=
```

or use simple script to do this change for all workers:

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

Check node taints for cluster:

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

Check cluster status:

```shell
kubectl get nodes
```

Remove node taint from worker1:

```shell
kubectl taint node worker1 node-role.kubernetes.io/worker-
```

Repeat this opeation but this time use `cordon` subcommand:

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

Annotate `cp1` node:

```shell
kubectl annotate node cp1 description="This is Kubernetes control plane node!"
``` 

Check annotations section:

```shell
kubectl describe node cp1
```

Remove annotation:

```shell
kubectl annotate node cp1 description-
```