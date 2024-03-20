---
sidebar_position: 3
---

# Create python application

## Create a simple Python application with Flask


Install required packages:

```shell
apt install python3 python3-pip git-core
```

Set the working directory for an application:

```shell
mkdir -p myapp/src
cd myapp
```

Write the main application into the file `main.py`:

```python title="src/main.py"
from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello from my application v1.0 !!!"

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=8081)
```

Create a requirements file that includes all necessary dependencies in `src/requirements.txt`:

```txt title="src/requirements.txt"
Flask
```

Install Python required modules:

```shell
pip3 install -r src/requirements.txt
```

Start the application and then test it locally:

```shell
python3 src/main.py
```
<details>
<summary>Output</summary>

```shell
 * Serving Flask app 'main' (lazy loading)
 * Environment: production
   WARNING: This is a development server. Do not use it in a production deployment.
   Use a production WSGI server instead.
 * Debug mode: off
 * Running on all addresses.
   WARNING: This is a development server. Do not use it in a production deployment.
 * Running on http://172.16.4.253:8081/ (Press CTRL+C to quit)
```
</details>
<br>

In another terminal, test the HTTP response of the application:

```shell
curl http://0.0.0.0:8081
```
## Create a simple container that includes your application

Create a container file manifest in the `myapp` directory.:

```Dockerfile title="./Dockerfile"
FROM registry.opensuse.org/opensuse/leap:15.3

RUN zypper ref && zypper install -y python3 python3-pip

RUN mkdir /app
WORKDIR /app
COPY src/* /app/
RUN pip3 install -r requirements.txt

EXPOSE 8081
CMD ["python3", "/app/main.py"]
```

Initialize a git repository and add application files to it:

```shell
git config --global user.email "your@example-email.com"
git config --global user.name "Your Name"

git init
git add Dockerfile src
git commit -m "Initial commit" -a
git log
```

Finally, build a cointainer image:

```shell
docker build -f Dockerfile -t myapp:v1.0 .
```

<details>
  <summary>Output</summary>

```shell
Sending build context to Docker daemon  4.096kB
Step 1/7 : FROM python:3.8
3.8: Pulling from library/python
0bc3020d05f1: Pull complete 
a110e5871660: Pull complete 
83d3c0fa203a: Pull complete 
a8fd09c11b02: Pull complete 
14feb89c4a52: Pull complete 
70752631d778: Pull complete 
2273412836af: Pull complete 
5f59e94255df: Pull complete 
c95f8c6e2e3a: Pull complete 
Digest: sha256:83d2246349a8b864288bf9c0b193ce640b08889c14961b1925b47a9e5c9911b4
Status: Downloaded newer image for python:3.8
 ---> b716d5a96fde
Step 2/7 : RUN mkdir /app
 ---> Running in 6fda343c0718
Removing intermediate container 6fda343c0718
 ---> 8557623c2a88
Step 3/7 : WORKDIR /app
 ---> Running in 5e718f2b7448
Removing intermediate container 5e718f2b7448
 ---> d0856bab751c
Step 4/7 : ADD . /app/
 ---> 404b1b40ef8f
Step 5/7 : RUN pip install -r requirements.txt
 ---> Running in e7d57084bfda
Collecting Flask
  Downloading Flask-2.0.1-py3-none-any.whl (94 kB)
Collecting click>=7.1.2
  Downloading click-8.0.1-py3-none-any.whl (97 kB)
Collecting Werkzeug>=2.0
  Downloading Werkzeug-2.0.1-py3-none-any.whl (288 kB)
Collecting itsdangerous>=2.0
  Downloading itsdangerous-2.0.1-py3-none-any.whl (18 kB)
Collecting Jinja2>=3.0
  Downloading Jinja2-3.0.1-py3-none-any.whl (133 kB)
Collecting MarkupSafe>=2.0
  Downloading MarkupSafe-2.0.1-cp38-cp38-manylinux2010_x86_64.whl (30 kB)
Installing collected packages: MarkupSafe, Werkzeug, Jinja2, itsdangerous, click, Flask
Successfully installed Flask-2.0.1 Jinja2-3.0.1 MarkupSafe-2.0.1 Werkzeug-2.0.1 click-8.0.1 itsdangerous-2.0.1
WARNING: Running pip as the 'root' user can result in broken permissions and conflicting behaviour with the system package manager. It is recommended to use a virtual environment instead: https://pip.pypa.io/warnings/venv
Removing intermediate container e7d57084bfda
 ---> 79909887eefe
Step 6/7 : EXPOSE 8081
 ---> Running in 83423f716ff5
Removing intermediate container 83423f716ff5
 ---> 51a186e4dc5b
Step 7/7 : CMD ["python", "/app/main.py"]
 ---> Running in 16e8e13f9a28
Removing intermediate container 16e8e13f9a28
 ---> 14303156d868
Successfully built 14303156d868
Successfully tagged myapp:v1.0
```
</details>

## Running the container

Start the container that has the Python application:

```shell
docker run -p 8081:8081 myapp:v1.0
```

## Publish the image of the container

Prepare the container image for publishing by updating its tag and adding a repository name:

```shell
docker tag myapp:v1.0 ttl.sh/myapp-v1.0:8h
```

Push the container image to [ttl.sh](https://ttl.sh), which is an anonymous container registry:

```shell
docker push ttl.sh/myapp-v1.0:8h
```

Now that the container image has been published, it can be used anywhere. The container can be started with the following command:

```shell
docker run ttl.sh/myapp-v1.0:8h
```