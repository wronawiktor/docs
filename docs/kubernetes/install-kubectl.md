---
sidebar_position: 1
---

# Install kubectl

Install the Kubernetes client `kubectl`

## Download the kubectl client

After installing the **Kubernetes** cluster, obtain a `kubectl` command line tool following the instructions from the [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl) documentation. 


## Get **KUBECONFIG** credentials file

After the `kubectl` installation get **KUBECONFIG** file:

```shell
mkdir $HOME/.kube
scp root@cp1:/etc/kubernetes/admin.conf $HOME/.kube/config
chown $(id -u):$(id -g) $HOME/.kube/config
```

Check the connection to **Kubernetes** cluster:

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

Next, let's configure the text editor that you will use for editing **Kubernetes** `yaml` manifests.

The `vim` text editor is a minimalist text editor that is often available even in bare-bones deployments, which is why we recommend it. However, it is often considered complicated and non-intuitive for developers fairly new to the command line. As an alternative to `vim`, you can consider the GNU `nano` text editor, which is described in the next section.

If you have chosen to stick with `vim`, create a **Vim** custom configuration file:

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
set number
```

## Configure the `nano` text editor

As an alternative to  `vim`, the GNU `nano` text editor is a lightweight and versatile terminal-based text editor. 

In order to use `nano` to edit **Kubernetes** `yaml` manifest, we need to edit the configuration file, located at `$HOME/.nanorc`:

```txt title="$HOME/.nanorc"
# Sets tabstop to 2 for working with YAML
set tabsize 2
# Sets tabs to spaces 
set tabstospaces
# Turn on line numbers for ease of reference
set linenumbers
```

This can also be done automatically using the pipe and tee operators in bash, by running the follwing commands:

```txt title="bash"
 echo "set tabsize 2" | tee -a ~/.nanorc
 echo "set tabstospaces" | tee -a ~/.nanorc
 echo "set linenumbers" | tee -a ~/.nanorc
```

### Adding syntax highlighting for YAML-files 

Additionally, syntax highlighting for `yaml` files can be useful. To achieve this, we first need a `.nanorc` file to instruct nano on how to handle `yaml` manifests.

Create a file in `$HOME/.nano/` named `yaml.nanorc` and paste the following:

```txt title="$HOME/.nano/yaml.nanorc"
syntax "YUM" "\.repo$|yum.*\.conf$"
color cyan "^[[:space:]]*[^=]*="
color brightmagenta "^[[:space:]]*\[.*\]$"
color brightyellow "\$(releasever|arch|basearch|uuid|YUM[0-9])"
color brightblack "(^|[[:space:]])#([^{].*)?$"
color ,green "[[:space:]]+$"
color ,red "	+ +| +	+"
```

Then, ensure that the config is included in the `$HOME/.nanorc` file by adding the following:
```txt title=$HOME/.nanorc
include "~/.nano/yaml.nanorc"
```

or by running the following command in bash:

```txt title="bash"
 echo "include '~/.nano/yaml.nanorc'" | tee -a ~/.nanorc
```

**Wohoo!** Your nano text editor should now be ready to go! 

## Check **KUBECONFIG** configuration

Check the current **KUBECONFIG** config:

```shell
kubectl config view
kubectl config get-clusters
kubectl config get-users
kubectl config get-contexts
kubectl config current-context
kubectl get pods
```

Set an example cluster adminstrator context:

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
