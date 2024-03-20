---
sidebar_position: 4
---

# Create base image

## Create a simple base image with a minimal Linux installation:

Install `debootstrap` package:

```shell
sudo apt-get install debootstrap
```

Check [Debian Release](https://www.debian.org/releases/) and [Ubuntu Release](https://wiki.ubuntu.com/Releases) names and choose your favorite release.

Install Debian or Ubuntu in the `chroot` directory using the terminal:

```shell
sudo debootstrap bullseye bullseye
```

After the installation is finished, check its status:

```shell
cd bullseye
ls -ltrah
cd ..
```

Now, we can load Debian Bullseye as Docker image:

```shell
sudo tar -C bullseye -c . | docker import - bullseye
```

Check the list of Docker images:

```shell
docker images
```

Now, we can start Debian Bullseye container image:

```shell
docker run -d --name bullseye bullseye sleep 3600
docker exec -ti bullseye bash
```
