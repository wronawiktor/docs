---
sidebar_position: 8
---

# Create ConfigMap and Secret

Learn how to use `ConfigMap` and `Secret`

## Use ConfigMap as env variables

Check list of namespaces:

```shell
kubectl get ns
```

Create new `myapp` namespace for pod instance:

```shell
kubectl create ns myapp
```

Create ConfigMap with application data:

```shell
kubectl create configmap -n myapp myapp \
        --from-literal=port="8083" \
        --from-literal=message="This is my own MyAPP message v2.X!" \
        --dry-run -o yaml > cm-myapp.yaml
```

Check ConfigMap `myapp` manifest:

```yaml title="cm-myapp.yaml"
apiVersion: v1
kind: ConfigMap
metadata:
  name: myapp
  namespace: myapp
data:
  port: "8083"
  message: This is my own MyAPP message v2.X!
```

Apply ConfigMap manifest:

```shell
kubectl apply -f cm-myapp.yaml
```

Generate `myapp` Deployment:

```shell
kubectl create deployment -n myapp myapp \
        --image=ghcr.io/mjura/myapp:v2.0 \
        --replicas=3 --dry-run -o yaml > deploy-myapp.yaml
```

Edit Deployment template manifest for `myapp`: 

```yaml title="deploy-myapp.yaml"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  namespace: myapp
spec:
  selector:
    matchLabels:
      app: myapp
  replicas: 3
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp
        image: ghcr.io/mjura/myapp:v2.0
        env:
        - name: MYAPP_PORT
          valueFrom:
            configMapKeyRef:
              name: myapp
              key: port
        - name: MYAPP_MESSAGE
          valueFrom:
            configMapKeyRef:
              name: myapp
              key: message
```

Apply Deployment `deploy-myapp.yaml` manifest:

```shell
kubectl apply -f deploy-myapp.yaml
```

Check Deploymnet,ReplicaSet and Pod status:

```shell
kubectl get deploy,rs,pods -n myapp -o wide
```

Open tunnel connection to any Pod instance:

```shell
kubectl port-forward -n myapp pod/myapp-<POD_ID> 8083:8083
```

In new terminal check application response:

```shell
curl http://127.0.0.1:8083
```

To cleanup remove whole namespace:

```shell
kubectl delete ns myapp
```

## Store configuration files as ConfigMap 

Check list of namespaces:

```shell
kubectl get ns
```

Create new `webapp` namespace for web application:

```shell
kubectl create ns webapp
```

Create virtual host configuration for NGINX server: 

```conf title="webapp.conf"
server {
    listen 80 default_server;

    root /srv/webapp;
    index index.html;

    server_name _;

    access_log /var/log/nginx/webapp.access_log main;
    error_log /var/log/nginx/webapp.error_log;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

Create `index.html` file for web application:

```html title="index.html"
<html>
    <head>
        <title>Welcome to WebAPP!</title>
    </head>
    <body>
        <h1>Success! The WebAPP application is working!</h1>
    </body>
</html>
```

Create ConfigMap with vhost configuration and `index.html`:

```shell
kubectl create configmap -n webapp webapp-conf --from-file=webapp.conf
kubectl create configmap -n webapp webapp-html --from-file=index.html
```

Prepare webapp Deployment manifest:

```yaml title="deploy-webapp.yaml"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: webapp
  namespace: webapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: webapp
  template:
    metadata:
      labels:
        app: webapp
    spec:
      containers:
      - name: nginx
        image: nginx:1.23.2
        ports:
        - containerPort: 80
        volumeMounts:
        - mountPath: /etc/nginx/conf.d
          readOnly: true
          name: webapp-conf
        - mountPath: /srv/webapp
          readOnly: true
          name: webapp-html
        - mountPath: /var/log/nginx
          name: nginx-log
      volumes:
      - name: webapp-conf
        configMap:
          name: webapp-conf
      - name: webapp-html
        configMap:
          name: webapp-html
      - name: nginx-log
        emptyDir: {}
```

Create webapp Deployment which is relying on previous ConfigMap's:

```shell
kubectl apply -f deploy-webapp.yaml
```

Check Deployment, ReplicaSet and Pod status:

```shell
kubectl get events --sort-by='.lastTimestamp' -n myapp
kubectl get deploy,rs,pods -n myapp -o wide
```

To test webapp open tunnel connection to it:

```shell
kubectl port-forward -n webapp pod/webapp-<POD_ID> 8080:80
```

In new terminal test application:

```shell
curl http://127.0.0.1:8080
```

To cleanup remove `myapp` namespace:

```shell
kubectl delete ns myapp
```

## Use Secret object

Create `database` namespace:

```bash
kubectl create namespace database
```

Create Secret object which will store MariaDB administrator password:

```shell
kubectl create secret -n database generic mariadb --from-literal=password="dbpassword"
```

Deploy MariaDB instance which will use administrator password:

```yaml title="deploy-mariadb.yaml"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mariadb
  namespace: database
  labels:
    app: mariadb
spec:
  selector:
    matchLabels:
      app: mariadb
  template:
    metadata:
      labels:
        app: mariadb
    spec:
      containers:
      - image: mariadb:10.10
        name: mariadb
        env:
        - name: MYSQL_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mariadb
              key: password
        ports:
        - containerPort: 3306
          name: mysql
        volumeMounts:
        - name: var-lib-mysql
          mountPath: /var/lib/mysql
      volumes:
      - name: var-lib-mysql
        emptyDir: {}
```

Apply manifest on Kubernetes cluster:

```shell
kubectl apply -f deploy-mariadb.yaml
```

Check Deployment status:

```shell
kubectl get deploy,rs,pods -n database
```

Open terminal to Pod container:

```shell
kubectl exec -ti -n database mariadb-<POD_ID> -- bash
  # env
  # echo $MYSQL_ROOT_PASSWORD
  # mysql -u root -p$MYSQL_ROOT_PASSWORD
```

Output:

```console
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 7
Server version: 10.10.2-MariaDB-1:10.10.2+maria~ubu2204 mariadb.org binary distribution

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [(none)]> 
```

Clean up:

```shell
kubectl delete ns database
```