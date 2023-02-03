---
sidebar_position: 2
---

# Create first application

Create simple hello-world application

Create project work directory:

```shell
mkdir -p webapp/src
cd webapp
```

Create index website at `src/index.html`:

```html title="src/index.html"
<h1>Hello world!</h1>
```

Create `Dockerfile` manifest:

```docker title="./Dockerfile"
FROM busybox

ADD src/index.html /www/index.html

EXPOSE 8080

CMD httpd -p 8080 -h /www; tail -f /dev/null
```

Build container image:

```shell
docker build -f Dockerfile -t webapp .
```

Start container with `hello-world` website:

```shell
docker run -d -p 80:8080 webapp
```

Test `hello-world` website using `curl` command:

```shell
curl http://127.0.0.1
```

`hello-world` page is now available at [http://127.0.0.1](http://127.0.0.1)