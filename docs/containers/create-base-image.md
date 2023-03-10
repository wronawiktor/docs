---
sidebar_position: 4
---

# Create base image

Create a simple base image with a minimal Linux installation

Install `debootstrap` package:

```shell
sudo apt-get install debootstrap
```

Check [Debian Release](https://www.debian.org/releases/) and [Ubuntu Release](https://wiki.ubuntu.com/Releases) names and choose your favorite release.

In terminal install Debian or Ubuntu in chroot directory

```shell
sudo debootstrap bullseye bullseye
```

After installation will finish, check status of it:

```shell
cd bullseye
ls -ltrah
cd ..
```

Now we can load Debian Bullseye as Docker image:

```shell
sudo tar -C bullseye -c . | docker import - bullseye
```

Check list of Docker images:

```shell
docker images
```

Now we can start Debian Bullseye container image:

```shell
docker run -d --name bullseye bullseye sleep 3600
docker exec -ti bullseye bash
```
