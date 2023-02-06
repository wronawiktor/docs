---
sidebar_position: 1
---

# Install kubectl

Install the Kubernetes client `kubectl`

## Download the kubectl client

After **Kubernetes** cluster installation, get a `kubectl` command line tool based on instructions from the documentation [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl).


## Get the **KUBECONFIG** credentials file

After the `kubectl` installation get the **KUBECONFIG** file:

```shell
mkdir $HOME/.kube
scp root@cp1:/etc/kubernetes/admin.conf $HOME/.kube/config
chown $(id -u):$(id -g) $HOME/.kube/config
```

Check the connection to the **Kubernetes** cluster:

```shell
kubectl cluster-info
```

Expected output:

```shell
Kubernetes control plane is running at https://cp1:6443
CoreDNS is running at https://cp1:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
```

Alternative ways to provide **KUBECONFIG** for `kubectl`:

```shell
export KUBECONFIG=$HOME/.kube/config
kubectl cluster-info
```

or

```shell
kubectl --kubeconfig=$HOME/.kube/config cluster-info
```

## Configure `kubectl` client

Configure Bash autocompletion for `kubectl`:

```shell
kubectl completion bash
echo "source <(kubectl completion bash)" >> ~/.bashrc       
source <(kubectl completion bash)
```

## Configure the `vim` text editor

As the next operation can be configuration of the text editor, which you will be using for editting **Kubenetes** `yaml` manifests.

Create a **Vim** custom configuration file:

```txt title="$HOME/.vimrc"
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
```

## Check the **KUBECONFIG** configuration

Check the current **KUBECONFIG** config:

```shell
kubectl config view
kubectl config get-clusters
kubectl config get-users
kubectl config get-contexts
kubectl config current-context
kubectl get pods
```

Set example cluster adminstrator context:

```shell
kubectl config set-context kube-system-admin --cluster=kubernetes  --user=kubernetes-admin --namespace=kube-system
kubectl config get-contexts
kubectl config use-context kube-system-admin
kubectl get pods
```

Switch back to the previous context:

```shell
kubectl config use-context kubernetes-admin@kubernetes
kubectl config current-context
```