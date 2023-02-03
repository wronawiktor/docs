---
sidebar_position: 4
---

# Install cluster extension

Install Kubernetes cluster extension **Metrics-server**

As first Kubernetes cluster extension we will install [metrics-server](https://github.com/kubernetes-sigs/metrics-server). The easiest way to get it working is to use helm project.

## Install Helm

Install **Helm** client on your workstation

Every **Helm** [release](https://github.com/helm/helm/releases) provides command line binary for any operating system. These versions can be manually downloaded and installed.

Get your desired [latest](https://github.com/helm/helm/releases) version of Helm:

```shell
wget https://get.helm.sh/helm-v3.10.3-linux-amd64.tar.gz
```

Extract tarball archive to your local filesystem:

```shell
tar -xvzf helm-v3.10.3-linux-amd64.tar.gz
```

Install `helm` client in `/usr/local/bin`:

```shell
sudo install -m 755 linux-amd64/helm /usr/local/bin/helm
```

Check `helm` command:

```shell
helm version
```

Output:

```shell
version.BuildInfo{Version:"v3.10.3", GitCommit:"835b7334cfe2e5e27870ab3ed4135f136eecc704", GitTreeState:"clean", GoVersion:"go1.18.9"}
```

As the last step add autocompletion bash functions to your shell:

```shell
helm completion bash
source <(helm completion bash)
echo "source <(helm completion bash)" >> ~/.bashrc
```

## Install metrics-server

After `helm` command is working we can finally install [metrics-server](https://github.com/kubernetes-sigs/metrics-server) on **Kubernetes** cluster.

First add Helm chart repository:

```shell
helm repo add metrics-server https://kubernetes-sigs.github.io/metrics-server/
helm repo update
```

Install the chart on **Kubernetes** cluster:

```shell
helm install --create-namespace -n metrics-server \
                metrics-server \
                metrics-server/metrics-server \
                --set args={--kubelet-insecure-tls}
```

Wait few seconds until `helm install` finish and then check status:

```shell
helm list -n metrics-server
helm status -n metrics-server metrics-server
```

Now, you can observer **Kubernetes** cluster resources usage in a real-time:

```shell
kubectl top nodes
kubectl top pods -n metrics-server
kubectl top pods -n kube-system
kubectl top pods -A
```


