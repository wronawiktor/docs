---
sidebar_position: 1
---

# Tutorial Intro

Let's install **Kubernetes in less than 2 minutes**.

## Getting Started

Get started by **installing new Linux server**.

Read **cloud-infra** project description on **[README.md](https://github.com/go4clouds/cloud-infra)**.

## Connect to Linux server

Install `git-core` package:

```bash
apt-get install git-core
```

Clone **cloud-infra** repository:

```bash
git clone https://github.com/go4clouds/cloud-infra
```

Run the `configure.sh` script:

```bash
cd cloud-infra
bash configure.sh
```

Run Terraform and get your Kubernetes installed:

```bash
cd libvirt
terraform init
terraform plan
terraform apply
```

