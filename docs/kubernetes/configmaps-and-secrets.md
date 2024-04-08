---
sidebar_position: 8
---

# Create ConfigMap and Secret

Learn how to use `ConfigMap` and `Secret`

## Use ConfigMap as env variables

Check the list of Namespaces:

```shell
kubectl get ns
```

Create a new `myapp` Namespace for a Pod instance:

```shell
kubectl create ns myapp
```

Create a ConfigMap with application data:

```shell
kubectl create configmap -n myapp myapp \
        --from-literal=port="8083" \
        --from-literal=message="This is my own MyAPP message v2.X!" \
        --dry-run=client -o yaml > cm-myapp.yaml
```

Check the ConfigMap `myapp` manifest:

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

Apply the ConfigMap manifest:

```shell
kubectl apply -f cm-myapp.yaml
```

Create Deployment manifest for `myapp`:

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
        image: ghcr.io/go4clouds/myapp:v2.0
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

Apply the `deploy-myapp.yaml` Deployment manifest:

```shell
kubectl apply -f deploy-myapp.yaml
```

Check the Deploymnet, ReplicaSet and Pod status:

```shell
kubectl get deploy,rs,pods -n myapp -o wide
```

Open a tunnel connection to any Pod instance:

```shell
kubectl port-forward -n myapp pod/myapp-<POD_ID> 8083:8083
```

Check the application response in a new terminal:

```shell
curl http://127.0.0.1:8083
```

To clean up, remove the entire Namespace:

```shell
kubectl delete ns myapp
```

## Store configuration files as ConfigMap 

Check the list of Namespaces:

```shell
kubectl get ns
```

Create a new `webapp` Namespace for a web application:

```shell
kubectl create ns webapp
```

Create a virtual host configuration for NGINX server in `webapp.conf`: 

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

Create the `index.html` file for the web application:

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

Create ConfigMap with a vhost configuration and `index.html`:

```shell
kubectl create configmap -n webapp webapp-conf --from-file=webapp.conf
kubectl create configmap -n webapp webapp-html --from-file=index.html
```
<details>
<summary>See created ConfigMaps </summary>

webapp-conf.yaml:
```yaml title= webapp-conf.yaml"
apiVersion: v1
data:
  webapp.conf: |
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
kind: ConfigMap
metadata:
  creationTimestamp: null
  name: webapp-conf
  namespace: webapp
```

webapp-html.yaml
```yaml title= webapp-html.yaml"
apiVersion: v1
data:
  webapp.conf: |
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
kind: ConfigMap
metadata:
  creationTimestamp: null
  name: webapp-conf
  namespace: webapp1
```

</details>

Prepare the webapp Deployment manifest:

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
        image: docker.io/library/nginx:1.23.2
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

Create a webapp Deployment relies on the previous ConfigMaps:

```shell
kubectl apply -f deploy-webapp.yaml
```

Check the Deployment, ReplicaSet and Pod status:

```shell
kubectl get events --sort-by='.lastTimestamp' -n webapp
kubectl get deploy,rs,pods -n webapp -o wide
```

To test the webapp open a tunnel connection to it:

```shell
kubectl port-forward -n webapp pod/webapp-<POD_ID> 8080:80
```

Test the application in a new terminal:

```shell
curl http://127.0.0.1:8080
```

To clean up remove the `webapp` Namespace:

```shell
kubectl delete ns webapp
```

## Use Secret object

Create the `database` Namespace:

```bash
kubectl create namespace database
```

Create a Secret object that will store the MariaDB administrator's password.:

```shell
kubectl create secret -n database generic mariadb --from-literal=password="dbpassword"
```

<details>
<summary>See created Secret </summary>

```yaml
apiVersion: v1
data:
  password: ZGJwYXNzd29yZA==
kind: Secret
metadata:
  creationTimestamp: null
  name: mariadb
  namespace: database
```
> Please note that the password is not stored as plain text. The data within Kubernetes Secrets is encoded as base64 strings, which is a simple form of obfuscation but does not provide encryption.

</details>

Deploy the MariaDB instance which will use the administrator password:

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
      - image: docker.io/library/mariadb:10.10
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

Apply a manifest on a Kubernetes cluster:

```shell
kubectl apply -f deploy-mariadb.yaml
```

Check the Deployment status:

```shell
kubectl get deploy,rs,pods -n database
```

Open a terminal to a Pod container:

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
