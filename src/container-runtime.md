# Lab Exercises for container runtime

## Introduction to Docker

After installation add your account to docker group

```
usermod -a -G docker YOUR_USERNAME
```

Docker basic commands

```
docker version
docker info
docker images
docker ps
docker system df
docker system prune --volumes -a
```

Starting new containers

```
docker run -ti debian sh
    # apt-get update
    # apt-get install procps
    # ps faxuw
    # cat /proc/self/cgroup
    # exit
```

```
docker run -d --name=test busybox sleep 3600
docker ps -q -f name=test
docker inspect $(docker ps -q -f name=test)
```

Docker network namespaces are stored in `/var/run/docker/netns`

```
ln -Ts /var/run/docker/netns  /var/run/netns
ip netns list
```

## Exercise 0 - Build base image

Based on Debian based distribution build your own base image

```
apt-get install debootstrap
sudo debootstrap focal focal > /dev/null
sudo tar -C focal -c . | docker import - focal
docker run focal cat /etc/lsb-release
```

## Exercise 1 - Build hello-world web application

Create project directory

```
mkdir -p webapp/src
cd webapp
```

Create website `index.html`

```
cat > src/index.html << EOF
<h1>Hello world!</h1>
EOF
```

Prepare Dockerfile

```
cat > Dockerfile << EOF
FROM busybox
ADD src/index.html /www/index.html
EXPOSE 8080
CMD httpd -p 8080 -h /www; tail -f /dev/null
EOF
```

Build container image

```
docker build -f Dockerfile -t webapp .
```

Start container with website

```
docker run -d -p 80:8080 webapp
```

Test website using loopback

```
curl http://127.0.0.1:80
```

Update container image tag and add repository name 

```
docker tag webapp ttl.sh/webapp-1.0:8h
```

Push container image to ttl.sh

```
docker push ttl.sh/webapp-1.0:8h
```

## Exercise 2 - Develop python Flask application

Install required packages

```
apt install python3 python3-pip git-core
```

Create application directory

```
mkdir -p myapp/src
cd myapp
```

Write application source code

```
cat > src/main.py <<EOF
from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello from Python!"

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=8081)
EOF
```

Create file with requirements

```
cat > src/requirements.txt <<EOF
Flask
EOF
```

Install python required modules

```
pip3 install -r src/requirements.txt
```

Start application and test it locally

```
python3 src/main.py
```

In another terminal

```
curl http://0.0.0.0:8081
```

Create container file 

```
cat > Dockerfile <<EOF
FROM registry.opensuse.org/opensuse/leap:15.3

RUN zypper ref && zypper install -y python3 python3-pip

RUN mkdir /app
WORKDIR /app
COPY src/* /app/
RUN pip3 install -r requirements.txt

EXPOSE 8081
CMD ["python3", "/app/main.py"]
EOF
```

Create git repository and application files to it

```
git config --global user.email "you@example.com"
git config --global user.name "Your Name"

git init
git add Dockerfile src
git commit -m "Initial commit" -a
git log
```

Build cointainer image 

```
docker build -f Dockerfile -t myapp:v1.0 .
```

Launch container with application

```
docker run -p 8081:8081 myapp:v1.0
```

Update container image tag and add repository name 

```
docker tag myapp ttl.sh/myapp-v1.0:8h
```

Push container image to ttl.sh

```
docker push ttl.sh/myapp-v1.0:8h
```
