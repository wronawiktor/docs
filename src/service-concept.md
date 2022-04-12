# Lab Exercises for Service Concept

Notes: [Kubernetes services](https://docs.projectcalico.org/about/about-kubernetes-services)

## Exercise 0 - Exposing application deployment

* Create new namespace

```shell
kubectl create namespace frontend
```

* Deploy example application

```shell
kubectl create deployment web --image=nginx -n frontend
```

* Check deployment status

```shell
kubectl get deploy,rs,pods -n frontend -o wide
```

* Scale application 

```shell
kubectl scale deployment -n frontend web --replicas=2
```

* Expose application deployment with service

```shell
kubectl expose deployment -n frontend web --port=80
```

* Check service status

```shell
kubectl get svc -n frontend web
```

* Try to connect application using `ClusterIP`

```shell
curl http://<ClusterIP>
```

* Try to connect application from cluster nodes

```shell
for SRV in master1 master2 master3 worker1 worker2; do
ssh $SRV curl http://<ClusterIP>
done
```

* Display service endpoints

```shell
kubectl get endpoints -n frontend web
```

* Scale up application once again

```shell
kubectl scale deployment -n frontend web --replicas=5
```

* Check list of endpoints 

```shell
kubectl get endpoints -n frontend web
```

* Show deployment properties

```shell
kubectl get deploy,rs,pods -n frontend -o wide
```

* Show deployment pods labels

```shell
kubectl get pods -n frontend --show-labels
NAME                  READY   STATUS    RESTARTS   AGE     LABELS
web-96d5df5c8-7qqlb   1/1     Running   0          17s     app=web,pod-template-hash=96d5df5c8
web-96d5df5c8-b9kng   1/1     Running   0          6m42s   app=web,pod-template-hash=96d5df5c8
web-96d5df5c8-hwk9z   1/1     Running   0          17s     app=web,pod-template-hash=96d5df5c8
web-96d5df5c8-pzclb   1/1     Running   0          11m     app=web,pod-template-hash=96d5df5c8
web-96d5df5c8-qr26w   1/1     Running   0          6m42s   app=web,pod-template-hash=96d5df5c8
```

* Remove pod `app=web` label

```shell
kubectl label pod -n frontend web-<Tab>-<Tab> app-
```

* Check once again pod lists

```shell
kubectl get pods -n frontend --show-labels
```

* List pods only with label `app=web`

```shell
kubectl get pods -n frontend --selector="app=web" -o wide
```

* Remove service object

```shell
kubectl delete service -n frontend web
```

* Create once again deployment service but with another mode

```shell
kubectl expose deployment -n frontend web --type=NodePort --port=80
```

* Check service status

```
kubectl get svc -n frontend web
```

Output should looks similar to:

```
NAME   TYPE       CLUSTER-IP     EXTERNAL-IP   PORT(S)        AGE
web    NodePort   10.96.208.39   <none>        80:30237/TCP   10s
```

* Use `ClusterIP` to connect to service from outside cluster

```shell
NODEPORT=`kubectl get svc -n frontend web -o jsonpath="{.spec.ports[0].nodePort}"`
echo "NodePort for web service is $NODEPORT"
curl http://k8s-master1:$NODEPORT
```

or on all nodes

```shell
NODEPORT=`kubectl get svc -n frontend web -o jsonpath="{.spec.ports[0].nodePort}"`
for SRV in k8s-master1 k8s-master2 k8s-master3 k8s-worker1 k8s-worker2; do
curl http://$SRV:$NODEPORT
done
```

* Let's do clean up

```shell
kubectl delete namespace frontend
```


## Exercise 1 - [Use Port Forwarding to Access Applications](https://kubernetes.io/docs/tasks/access-application-cluster/port-forward-access-application-cluster/#creating-mongodb-deployment-and-service)


Create a Deployment that runs MongoDB:

```shell
cat > mongo-deployment.yaml <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: mongo
  name: mongo
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
EOF
```

Apply YAML manifest

```shell
kubectl apply -f mongo-deployment.yaml
```


The output of a successful command verifies that the deployment was created:

```
deployment.apps/mongo created
```

View the pod status to check that it is ready:

```shell
kubectl get pods
```

The output displays the pod created:

```
NAME                     READY   STATUS    RESTARTS   AGE
mongo-75f59d57f4-4nd6q   1/1     Running   0          2m4s
```

View the Deployment's status:

```shell
kubectl get deployment
```

The output displays that the Deployment was created:

```
NAME    READY   UP-TO-DATE   AVAILABLE   AGE
mongo   1/1     1            1           2m21s
```

The Deployment automatically manages a ReplicaSet. View the ReplicaSet status using:

```
kubectl get replicaset
```

The output displays that the ReplicaSet was created:

```
NAME               DESIRED   CURRENT   READY   AGE
mongo-75f59d57f4   1         1         1       3m12s
```

Create a Service to expose MongoDB on the network:

```shell
kubectl expose deployment mongo --port=27017
```

The output of a successful command verifies that the Service was created:

```
service/mongo created
```

Check the Service created:

```shell
kubectl get service mongo
```

The output displays the service created:

```
NAME    TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)     AGE
mongo   ClusterIP   10.96.41.183   <none>        27017/TCP   11s
```

Verify that the MongoDB server is running in the Pod, and listening on port 27017:

(Change mongo-75f59d57f4-4nd6q to the name of the Pod)

```shell
kubectl get pod mongo-75f59d57f4-4nd6q --template='{{(index (index .spec.containers 0).ports 0).containerPort}}{{"\n"}}'
```

The output displays the port for MongoDB in that Pod:

```
27017
```

(this is the TCP port allocated to MongoDB on the internet).

Forward a local port to a port on the Pod
kubectl port-forward allows using resource name, such as a pod name, to select a matching pod to port forward to.

(Change mongo-75f59d57f4-4nd6q to the name of the Pod)

```shell
kubectl port-forward mongo-75f59d57f4-4nd6q 28015:27017
```

which is the same as

```shell
kubectl port-forward pods/mongo-75f59d57f4-4nd6q 28015:27017
```

or

```shell
kubectl port-forward deployment/mongo 28015:27017
```

or

```shell
kubectl port-forward replicaset/mongo-75f59d57f4 28015:27017
```

or

```shell
kubectl port-forward service/mongo 28015:27017
```

Any of the above commands works. The output is similar to this:

```
Forwarding from 127.0.0.1:28015 -> 27017
Forwarding from [::1]:28015 -> 27017
```

Note: kubectl port-forward does not return. To continue with the exercises, you will need to open another terminal.

Install mongodb client package

```shell
sudo apt-get install mongodb-clients -y
```

Start the MongoDB command line interface:

```shell
mongo --port 28015
```

At the MongoDB command line prompt, enter the ping command:

```
db.runCommand( { ping: 1 } )
```

A successful ping request returns:

```
{ ok: 1 }
```

Optionally let kubectl choose the local port
If you don't need a specific local port, you can let kubectl choose and allocate the local port and thus relieve you from having to manage local port conflicts, with the slightly simpler syntax:

```shell
kubectl port-forward deployment/mongo :27017
```

The kubectl tool finds a local port number that is not in use (avoiding low ports numbers, because these might be used by other applications). The output is similar to:

```
Forwarding from 127.0.0.1:63753 -> 27017
Forwarding from [::1]:63753 -> 27017
```


## Exercise 2 - [Using kubectl proxy](https://kubernetes.io/docs/tasks/access-application-cluster/access-cluster/#using-kubectl-proxy)

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

```
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

```
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
