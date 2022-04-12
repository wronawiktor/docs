# Lab Exercises for Kubernetes introduction


Visit following websites:
- https://kubernetes.io/docs/
- https://kubernetes.io/blog/
- https://github.com/kubernetes/
- https://www.cncf.io/


## Exercise 0 - Login and prepare lab environment

* Lab environment description 

```
       virtualization: KVM with libvirt / virt-manager
       virtual network: 10.168.0.1/24
       virtual machines:
                        * master1 k8s-master1 - 10.168.0.101
                        * master2 k8s-master2 - 10.168.0.102
                        * master3 k8s-master3 - 10.168.0.103
                        * worker1 k8s-worker1 - 10.168.0.201
                        * worker2 k8s-worker2 - 10.168.0.202
```

* Start virtual machines, on k8s-host run:

```shell
virsh list --all
virsh start k8s-master1
virsh start k8s-master2
virsh start k8s-master3
virsh start k8s-worker1
virsh start k8s-worker2
```

or

```shell
for SRV in k8s-master1 k8s-master2 k8s-master3 k8s-worker1 k8s-worker2; do virsh start $SRV; done
```

Note: All exercises please run `k8s-host`

## Exercise 1 - Install Kubernetes client

* Install `kubectl` package

```shell
sudo apt-get install kubectl
kubectl version
```


## Exercise 2 - Configure KUBECONFIG file

* Download KUBECONfIG file

```shell
mkdir $HOME/.kube
scp root@master1:/etc/kubernetes/admin.conf $HOME/
cp $HOME/admin.conf $HOME/.kube/config
chown $(id -u):$(id -g) $HOME/.kube/config
```

* Check cluster connection

```shell
kubectl cluster-info
```
Output

```
Kubernetes control plane is running at https://k8smaster:6443
CoreDNS is running at https://k8smaster:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

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


## Exercise 3 - Check and configure KUBECONFIG config

* Check current cluster config

```shell
kubectl config view
kubectl config get-clusters
kubectl config get-users
kubectl config get-contexts
kubectl config current-context
kubectl get pods
```

* Set admin context

```shell
kubectl config set-context kube-system-admin --cluster=kubernetes  --user=kubernetes-admin --namespace=kube-system
kubectl config get-contexts
kubectl config use-context kube-system-admin
kubectl get pods
```

* Use local context

```shell
kubectl config use-context kubernetes-admin@kubernetes
```

## Exercise 4 - Setup bash auto-completion

* Configure Kubernetes bash auto-completion

```shell
sudo apt-get install bash-completion
source <(kubectl completion bash)
echo "source <(kubectl completion bash)" >> $HOME/.bashrc
```

* Test bash auto-completion

```shell
kubec<Tab> cl<Tab>
```

## Optional 1 - Setup text editor

* Prepare text editor for editing Kubernetes yaml manifests

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
