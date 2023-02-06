---
sidebar_position: 4
---

# Create base image

Create a simple base image with a minimal Linux installation

Create a project work directory:

```shell
mkdir -p webapp/src
cd webapp
```

Create an index website at `src/index.html`:

```html title="src/index.html"
<h1>Hello world!</h1>
```

Create a `Dockerfile` manifest:

```docker title="./Dockerfile"
FROM busybox

ADD src/index.html /www/index.html

EXPOSE 8080

CMD httpd -p 8080 -h /www; tail -f /dev/null
```

Build a container image:

```shell
docker build -f Dockerfile -t webapp .
```

Start the container with the `hello-world` website:

```shell
docker run -d -p 80:8080 webapp
```

Test the `hello-world` website using `curl` command:

```shell
curl http://127.0.0.1
```

The `hello-world` page is now available at [http://127.0.0.1](http://127.0.0.1)