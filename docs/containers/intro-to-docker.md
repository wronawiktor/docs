---
sidebar_position: 1
---

# Introduction to Docker

## Basic `docker` commands to learn first

*For Docker installation guide, visit: https://docs.docker.com/engine/install/*

After `docker` installation add your account to a docker group

```shell
usermod -a -G docker YOUR_USERNAME
```

First `docker` commands to test:

```shell
docker version
docker info
docker images
docker ps
docker system df
docker system prune --volumes -a
```

To start a new container with a terminal and in interactive mode:

```shell
docker run -ti debian sh
    # apt-get update
    # apt-get install procps
    # ps faxuw
    # cat /proc/self/cgroup
    # exit
```

To start the new container in dettached mode

```shell
docker run -d --name=test busybox sleep 3600
```

Inspect already running containers

```shell
docker ps -q -f name=test
docker inspect $(docker ps -q -f name=test)
```

Docker network namespaces are stored in `/var/run/docker/netns`. We can make the Docker network namespaces visible by creating a symbolic link in `/var/run/netns`

```shell
ln -Ts /var/run/docker/netns  /var/run/netns
ip netns list
```