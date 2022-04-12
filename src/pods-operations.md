# Lab Exercises for Pods


## Exercise 0 - Check list of namespaces


* List namespaces

```shell
kubectl get namespaces
```


## Exercise 1 - Pods basic operations


* List pods in `default` namespace

```shell
kubectl get pods
```

* List pods in `kube-system` namespace

```shell
kubectl get pods --namespace=kube-system
kubectl get pods -n kube-system
```

* List pods with `-o wide` option

```shell
kubectl get pods -n kube-system -o wide
```

* Check pod status

```shell
kubectl describe pod -n kube-system kube-apiserver-k8s-master1
```


## Exercise 2 - Create new pod

* Create new pod in `default` namespace

```shell
kubectl run test1 --image=registry.k8s:5000/nginx
```

* Check pod status and wait until it will be `Running`

```shell
kubectl get pod test1 -o wide -w
``` 

* Check logs test1

```shell
kubectl logs test1
```

* Connect to the terminal test1 pod

```shell
kubectl exec -ti test1 -- sh
# ls
# exit
```

* Cleanup test1 pod

```shell
kubectl delete pod test1
```

## Exercise 3 - Generate pod template

* Create new namespace and verify it

```shell
kubectl create namespace project1
kubectl get namespaces
```

* Generate pod template

```shell
kubectl run app1 -n project1 --image=debian --dry-run=client -o yaml
```

* Save pod template to file

```shell
kubectl run app1 -n project1 --image=registry.k8s:5000/ubuntu --dry-run=client -o yaml > pod-app1.yaml
```

* Apply pod manifest to cluster

```shell
kubectl apply -f pod-app1.yaml
```

* Verify operation on cluster

```shell
kubectl get pods -n project1 -o wide -w
```

* Cleanup environment 

```shell
kubectl delete namespace project1
```


## Exercise 4 - Start debugging container

* Create new namespace

```shell
kubectl create namespace debug
```

* Start any Linux distro container

```shell
kubectl run test -n debug --image=registry.k8s:5000/ubuntu -- sleep 3600
```

* Wait until it will be `Running`

```shell
kubectl get pods -n debug -o wide -w
```

* Connect to pod container terminal

```shell
kubectl exec -n debug -ti test -- bash
# apt-get update
# apt-get install tcpdump iproute2
# ip a
# tcpdump -i eth0
```

* Cleanup environment 

```shell
kubectl delete namespace debug
```


## Optional 0 - Write your own example application

* Install `Docker` and `python3-pip` packages

```shell
sudo apt-get install docker.io python3-pip
```

* Add user `tux` to `docker` group

```shell
sudo usermod -a -G docker tux
```

Note: To apply changes please logout and login once again

* Create directory for application

```shell
mkdir myapp
cd myapp
```

* Write `myapp` python application

```shell
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

* Prepate requirements file with `Flask`

```shell
cat > requirements.txt <<EOF
Flask
EOF
```

* Install python requirements

```shell
pip3 install -r requirements.txt
```

* Start application in terminal

```shell
python3 main.py
```

Output:

```
 * Serving Flask app 'main' (lazy loading)
 * Environment: production
   WARNING: This is a development server. Do not use it in a production deployment.
   Use a production WSGI server instead.
 * Debug mode: off
 * Running on all addresses.
   WARNING: This is a development server. Do not use it in a production deployment.
 * Running on http://172.16.4.253:8081/ (Press CTRL+C to quit)
```

* Open neww terminal and test application

```shell
curl http://0.0.0.0:8081
```

* Stop application and write `Dockerfile`

```shell
cat > Dockerfile <<EOF
FROM python:3.8

RUN mkdir /app
WORKDIR /app
ADD . /app/
RUN pip install -r requirements.txt

EXPOSE 8081
CMD ["python", "/app/main.py"]
EOF
```

* Build container with application

```shell
docker build -f Dockerfile -t myapp:1.0 .
```

Output:

```
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
Successfully tagged myapp:1.0
```

* Start locally `myapp` container and test it

```shell
docker run -p 8081:8081 myapp:1.0
```

On second terminal

```shell
http://0.0.0.0:8081
```

* Register on on Docker hub https://hub.docker.com/

* Login to your Docker Hub account

```shell
docker login
```

Output:

```Login with your Docker ID to push and pull images from Docker Hub. If you don't have a Docker ID, head over to https://hub.docker.com to create one.
Username: <YOUR_ACCOUNT>
Password: 
WARNING! Your password will be stored unencrypted in /home/tux/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store

Login Succeeded
```

* Change tag name for `myapp` container

```shell
docker tag myapp:1.0 <LOGIN>/myapp:1.0
```

* Push `myapp` on Docker hub

```shell
docker push <LOGIN>/myapp:1.0
```

* Deploy `myapp` on Kubernetes

```shell
kubectl run myapp --image=<LOIGN>/myapp:1.0
```

* Check if it is running

```shell
kubectl get pod myapp -w -o wide
```
