# Lab Exercises for containerized applications

Add your regular user to docker group

```
usermod -a -G docker YOUR_USERNAME
```

## Exercise 0 - Build hello-world web application

* Create project directory

```
mkdir -p webapp/app
cd webapp
```

* Create application source code

```
cat > app/index.html << EOF
<h1>Hello world!</h1>
EOF
```

* Define container building recipe

```
cat > Dockerfile << EOF
FROM busybox
ADD app/index.html /www/index.html
EXPOSE 8005
CMD httpd -p 8005 -h /www; tail -f /dev/null
EOF
```

* Build container image localy

```
docker build -t hello-world .
```

* Start and test application

```
docker run -d -p 80:8005 hello-world
```

* Test web application locally 

```
curl http://127.0.0.1:80
```

* Change tag container image and provide repository name 

```
docker tag hello-world ttl.sh/hello-world:8h
```

## Exercise 1 - Build python Flask application

* Install required packages

```
apt install python3 python3-pip git-core
```

* Create application directory

```
mkdir -p myapp/src
cd myapp/src
```

* Write application source code

```
cat > main.py <<EOF
from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello from Python!"

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=8081)
EOF
```

* Create requirements file

```
cat > src/requirements.txt <<EOF
Flask
EOF
```

* Install python required modules

```
pip3 install -r src/requirements.txt
```

* Start application and test it locally

```
python3 src/main.py
```

In other terminal

```
curl http://0.0.0.0:8081
```

* Create container file 

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

* Create git repository and application files to it

```
git config --global user.email "you@example.com"
git config --global user.name "Your Name"

git init
git add Dockerfile src
git commit -m "Initial commit" -a
git log
```

* Build cointainer image 

```
docker build -f Dockerfile -t myapp:v1.0 .
```

* Launch application container

```
docker run -p 8081:8081 myapp:v1.0
```
