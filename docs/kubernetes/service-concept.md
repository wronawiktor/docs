---
sidebar_position: 10
---

# Using Service concept

Exposing Kubernetes application

## Expose application Deployment

Create new namespace:

```shell
kubectl create namespace frontend
```

Deploy example frontend application:

```shell
kubectl create deployment web --image=nginx:1.23 -n frontend
```

<details>
<summary>See Deployment YAML </summary>

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  creationTimestamp: null
  labels:
    app: web
  name: web
  namespace: frontend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: web
  strategy: {}
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: web
    spec:
      containers:
      - image: nginx:1.23
        name: nginx
        resources: {}
status: {}

```

</details>

Check deployment status:

```shell
kubectl get deploy,rs,pods -n frontend -o wide
```

Scale up application to 3 replicas:

```shell
kubectl scale deployment -n frontend web --replicas=3
```

Expose application Deployment with Service:

```shell
kubectl expose deployment -n frontend web --type=ClusterIP --port=8080 --target-port=80
```

<details>
<summary>See Service YAML </summary>

```yaml
apiVersion: v1
kind: Service
metadata:
  creationTimestamp: null
  labels:
    app: web
  name: web
  namespace: frontend
spec:
  ports:
  - port: 8080
    protocol: TCP
    targetPort: 80
  selector:
    app: web
  type: ClusterIP
status:
  loadBalancer: {}

```

</details>

Check Service status:

```shell
kubectl get svc -n frontend web
```

Open a tunnel connection to the application Service:

```shell
kubectl port-forward -n frontend svc/web 8080:8080 &
```

Try to connect application on localhost:

```shell
curl http://127.0.0.1:8080
```

Try to connect application from cluster nodes:

```shell
for SRV in cp1 worker{1,2,3}; do
sudo ssh $SRV curl http://<ClusterIP>:8080;
done
```

Display Service Endpoints:

```shell
kubectl get endpoints -n frontend web
```

Scale up the application once again to 5 replicas:

```shell
kubectl scale deployment -n frontend web --replicas=5
```

Check list of Endpoints: 

```shell
kubectl get endpoints -n frontend web
```

Show the properties of Deployment for the web application:

```shell
kubectl get deploy,rs,pods -n frontend -o wide
```

Show labels of Deployment Pods:

```shell
kubectl get pods -n frontend --show-labels
```

Output:

```console
NAME                  READY   STATUS    RESTARTS   AGE     LABELS
web-96d5df5c8-7qqlb   1/1     Running   0          17s     app=web,pod-template-hash=96d5df5c8
web-96d5df5c8-b9kng   1/1     Running   0          6m42s   app=web,pod-template-hash=96d5df5c8
web-96d5df5c8-hwk9z   1/1     Running   0          17s     app=web,pod-template-hash=96d5df5c8
web-96d5df5c8-pzclb   1/1     Running   0          11m     app=web,pod-template-hash=96d5df5c8
web-96d5df5c8-qr26w   1/1     Running   0          6m42s   app=web,pod-template-hash=96d5df5c8
```

Remove the `app=web` Label from any Pod instance:

```shell
kubectl label pod -n frontend web-<Tab>-<Tab> app-
```

Check once again list of Pods:

```shell
kubectl get pods -n frontend --show-labels
```

List only pods with the Label `app=web`:

```shell
kubectl get pods -n frontend --selector="app=web" -o wide
```

Remove Service object:

```shell
kubectl delete service -n frontend web
```

Create the deployment Service once again, but with NodePort:

```shell
kubectl expose deployment -n frontend web --type=NodePort --port=80
```

<details>
<summary>See Deployment YAML</summary>

```yaml
apiVersion: v1
kind: Service
metadata:
  creationTimestamp: null
  labels:
    app: web
  name: web
  namespace: frontend
spec:
  ports:
  - port: 80
    protocol: TCP
    targetPort: 80
  selector:
    app: web
  type: NodePort
status:
  loadBalancer: {}

```

</details>

Check Service status:

```shell
kubectl get svc -n frontend web
```

Output:

```console
NAME   TYPE       CLUSTER-IP     EXTERNAL-IP   PORT(S)        AGE
web    NodePort   10.96.208.39   <none>        80:30237/TCP   10s
```

Use `ClusterIP` to connect to the Service from outside cluster:

```shell
NODEPORT=`kubectl get svc -n frontend web -o jsonpath="{.spec.ports[0].nodePort}"`
echo "NodePort for web service is $NODEPORT"
curl http://cp1:$NODEPORT
```

or on all nodes

```shell
NODEPORT=`kubectl get svc -n frontend web -o jsonpath="{.spec.ports[0].nodePort}"`
for SRV in cp1 worker{1,2,3}; do
sudo curl http://$SRV:$NODEPORT;
done
```

Let's clean up:

```shell
kubectl delete namespace frontend
```


## Use Port Forward to access Service applications

This task is based on documentation [example](https://kubernetes.io/docs/tasks/access-application-cluster/port-forward-access-application-cluster/#creating-mongodb-deployment-and-service)


Create Namespace for database:

```shell
kubectl create namespace database
```

Create a Deployment that runs MongoDB:

```yaml title="mongo-deployment.yaml"
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: mongo
  name: mongo
  namespace: database
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mongo
  template:
    metadata:
      labels:
        app: mongo
    spec:
      containers:
      - image: mongo
        name: mongo
        ports:
        - name: mongodbport
          containerPort: 27017
          protocol: TCP
```

Apply Kubernetes YAML manifest:

```shell
kubectl apply -f mongo-deployment.yaml
```

View the Pod status to check that it is ready:

```shell
kubectl get pods -n database
```

View the status of the Deployment:

```shell
kubectl get deploy,rs,pods -n database -o wide
```

Create a Service to expose MongoDB:

```shell
kubectl expose -n database deployment mongo --type=ClusterIP --port=27017
```

<details>
<summary>See created Service </summary>

```yaml
apiVersion: v1
kind: Service
metadata:
  creationTimestamp: null
  labels:
    app: mongo
  name: mongo
  namespace: database
spec:
  ports:
  - port: 27017
    protocol: TCP
    targetPort: 27017
  selector:
    app: mongo
  type: ClusterIP
status:
  loadBalancer: {}

```

</details>

Check the Service created:

```shell
kubectl get service mongo -n database
```

Output:

```console
NAME    TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)     AGE
mongo   ClusterIP   10.96.41.183   <none>        27017/TCP   11s
```

Verify that the MongoDB server is running in the Pod, and listening on port 27017:

```shell
kubectl get -n database pod mongo-<Tab> --template='{{(index (index .spec.containers 0).ports 0).containerPort}}{{"\n"}}'
```

The output displays the MongoDB port in that Pod:

```shell
27017
```

Forward a local port to a port on the Pod:

```shell
kubectl port-forward -n database pod/mongo-<Tab> 28015:27017 &
```

or

```shell
kubectl port-forward -n database deployment/mongo 28015:27017 &
```

or

```shell
kubectl port-forward -n database replicaset/mongo-<Tab> 28015:27017 &
```

or

```shell
kubectl port-forward -n database service/mongo 28015:27017 &
```

Any of the above commands works. The output is similar to this:

```console
Forwarding from 127.0.0.1:28015 -> 27017
Forwarding from [::1]:28015 -> 27017
```

:::note Change terminal

`kubectl port-forward` does not return. To continue with the exercises, you will need to open another terminal.

:::

Install `mongodb` client package:

```shell
sudo apt-get install mongodb-clients -y
```

Start the MongoDB command line interface:

```shell
mongo --port 28015
```

At the MongoDB command line prompt, enter the ping command:

```shell
db.runCommand( { ping: 1 } )
```

A successful ping request returns:

```shell
{ ok: 1 }
```

Optionally let kubectl choose the local port.
If you don't need a specific local port, you can let kubectl choose and allocate the local port and thus relieve you from having to manage local port conflicts, with the slightly simpler syntax:

```shell
kubectl port-forward -n database deployment/mongo :27017 &
```

The kubectl tool finds a local port number that is not in use (avoiding low ports numbers, because these might be used by other applications). The output is similar to:

```shell
Forwarding from 127.0.0.1:63753 -> 27017
Forwarding from [::1]:63753 -> 27017
```

Clean up the environment: 

```shell
kubectl delete namespace database
```


## Using kubectl proxy

This task is based on documentation [example](https://kubernetes.io/docs/tasks/access-application-cluster/access-cluster/#using-kubectl-proxy).

The following command runs kubectl in a mode where it acts as a reverse proxy. It handles locating the apiserver and authenticating. Run it like this:

```shell
kubectl proxy --port=8080
```

See kubectl proxy for more details.

Then you can explore the API with curl, wget, or a browser, replacing localhost with [::1] for IPv6, like so:

```shell
curl http://localhost:8080/api/
```

The output is similar to this:

```json
{
  "kind": "APIVersions",
  "versions": [
    "v1"
  ],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "10.0.1.149:443"
    }
  ]
}
```

Without kubectl proxy

Use kubectl describe secret... to get the token for the default service account with grep/cut:

```shell
APISERVER=$(kubectl config view --minify | grep server | cut -f 2- -d ":" | tr -d " ")
SECRET_NAME=$(kubectl get secrets | grep ^default | cut -f1 -d ' ')
TOKEN=$(kubectl describe secret $SECRET_NAME | grep -E '^token' | cut -f2 -d':' | tr -d " ")

curl $APISERVER/api --header "Authorization: Bearer $TOKEN" --insecure
```

The output is similar to this:

```json
{
  "kind": "APIVersions",
  "versions": [
    "v1"
  ],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "10.0.1.149:443"
    }
  ]
}
```
