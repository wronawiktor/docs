---
sidebar_position: 20
---

# Helm

Learn how to use Helm to install any application on Kubernetes


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


## Generate Helm chart template

Helm can be used also for generating charts templates.

```shell
helm create example
```

Check Helm chart package directory structure:

```shell
apt-get install tree
tree example
```

Output:

```shell
example/
├── charts
├── Chart.yaml
├── templates
│   ├── deployment.yaml
│   ├── _helpers.tpl
│   ├── hpa.yaml
│   ├── ingress.yaml
│   ├── NOTES.txt
│   ├── serviceaccount.yaml
│   ├── service.yaml
│   └── tests
│       └── test-connection.yaml
└── values.yaml

3 directories, 10 files
```

To get more info about Helm Chart Templates you go to [official documentation](https://helm.sh/docs/chart_template_guide/getting_started/)

Verify Helm lint for `example` package:

```shell
helm lint example/
```

Test example Helm Chart installation:

```shell
helm install --create-namespace --namespace test example ./example/ --dry-run --debug
```

Then we can try to install it on Kubernetes cluster:

```shell
helm install --create-namespace --namespace test example ./example/
```

Verify status example application on Kubernetes:

```shell
kubectl get deploy,rs,pods -n test
kubectl get svc -n test
```

Now we can check `example` application release using Helm:

```shell
helm list -n test
helm status -n test example
helm history -n test example
```

Because NGiNX image used in this example is outdated let's upgrade example app with new image:

```shell
helm upgrade -n test example ./example/ --set image.tag="1.23.2"
```

Let's verify once again application release:

```shell
helm list -n test
helm status -n test example
helm history -n test example
```

To check image version we can use:

```shell
kubectl get deploy,rs,pods -n test -o wide
```


## Develop simple Helm chart



