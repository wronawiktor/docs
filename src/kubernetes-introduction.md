# Lab Exercises for Kubernetes introduction

Visit following websites:
[Official documentation](https://kubernetes.io/docs/)
[Github repository](https://github.com/kubernetes/)
[CNCF website](https://www.cncf.io/)


## Introduction to Kubernetes

Kubernetes basic commands

```
kubectl cluster-info
kubectl get nodes
kubectl get nodes -o wide
kubectl describe node worker2
kubectl get ns
kubectl get pods --namespace kube-system
kubectl get pods --namespace kube-system -o wide
kubectl get pods --all-namespaces
kubectl get pods -A
kubectl describe pods
kubectl get events
kubectl api-resources
kubectl api-versions
kubectl explain pod
kubectl explain pod --recursive
```

Install kubectl bash autocompletion

```
kubectl completion bash
echo "source <(kubectl completion bash)" >> ~/.bashrc       
source <(kubectl completion bash)
```

Check labes for nodes and add label role

```
kubectl get nodes --show-labels
kubectl label node worker2 node-role.kubernetes.io/worker=
```

Remove label from node

```
kubectl label node worker2 node-role.kubernetes.io/worker-
```

Check node taints

```
kubectl describe nodes | grep Taints
```

Add `NoSchedule` taint effect to worker1

```
kubectl taint node worker1 node-role.kubernetes.io/worker=:NoSchedule
```

Remove node taint

```
kubectl taint node k8s-worker1 node-role.kubernetes.io/worker-
```

How to create a template pod manifest

```
kubectl run test --image=nginx --dry-run -o yaml
```

How to create a template deployment manifest

```
kubectl create deployment nginx --image=nginx --dry-run -o yaml
```

How to create a template service manifest

```
kubectl create service clusterip my-service --tcp=8080 --dry-run -o yaml
```

Start busybox pod container

```
kubectl run busybox --image=busybox -- sleep 3600
```

Start debian pod container
```
kubectl run test --image=debian -- sleep 3600
```

Create tunnel to service in Kubernetes cluster from Local Dev Machine
```
kubectl port-forward -n demo service/<SERVICE_NAME> <LOCAL_PORT>:<SERVICE_PORT>
```

## Exercise 0 - Configure KUBECONFIG file

Download KUBECONfIG file

```shell
mkdir $HOME/.kube
scp root@cp1:/etc/kubernetes/admin.conf $HOME/
cp $HOME/admin.conf $HOME/.kube/config
chown $(id -u):$(id -g) $HOME/.kube/config
```

Check cluster connection

```shell
kubectl cluster-info
```
Output

```
Kubernetes control plane is running at https://cp1:6443
CoreDNS is running at https://cp1:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
```

Alternative ways to use KUBECONFIG

```shell
export KUBECONFIG=$HOME/admin.conf
kubectl cluster-info
```

or

```shell
kubectl --kubeconfig=$HOME/admin.conf cluster-info
```


## Exercise 1 - Check and configure KUBECONFIG config

Check current cluster config

```shell
kubectl config view
kubectl config get-clusters
kubectl config get-users
kubectl config get-contexts
kubectl config current-context
kubectl get pods
```

Set admin context

```shell
kubectl config set-context kube-system-admin --cluster=kubernetes  --user=kubernetes-admin --namespace=kube-system
kubectl config get-contexts
kubectl config use-context kube-system-admin
kubectl get pods
```

Use local context

```shell
kubectl config use-context kubernetes-admin@kubernetes
```

## Optional 1 - Setup text editor

Prepare text editor for editing Kubernetes yaml manifests

```shell
cat << EOF > ~/.vimrc
" Sets tabstop to 2 for working with YAML
set ts=2
" Sets softtabstop makes spaces feel like tabs
set sts=2
" Sets the shift width to 2, making shift operations (<< or >>)               
set sw=2
" Expands new tabs to spaces               
set expandtab
" Convert all existing tabs to spaces     
retab                      
" Enable syntax highlighting
syntax on               
" For certain filetypes, enable automatic indenting
filetype indent plugin on 
" Show column and line number   
set ruler                 
EOF
```