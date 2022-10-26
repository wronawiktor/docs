# Lab Exercises for Application Deployment

## Exercise 0 - [Run Application Using a Deployment](https://kubernetes.io/docs/tasks/run-application/run-stateless-application-deployment/#creating-and-exploring-an-nginx-deployment)

Creating and exploring an nginx deployment
You can run an application by creating a Kubernetes Deployment object, and you can describe a Deployment in a YAML file. For example, this YAML file describes a Deployment that runs the `nginx:1.14.2` Docker image:

```
cat > deployment.yaml <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  selector:
    matchLabels:
      app: nginx
  replicas: 2 # tells deployment to run 2 pods matching the template
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
EOF
```

Create a Deployment based on the YAML file:

```shell
kubectl apply -f https://k8s.io/examples/application/deployment.yaml
```

Display information about the Deployment:

```shell
kubectl describe deployment nginx-deployment
```

The output is similar to this:

```
 Name:     nginx-deployment
 Namespace:    default
 CreationTimestamp:  Tue, 30 Aug 2016 18:11:37 -0700
 Labels:     app=nginx
 Annotations:    deployment.kubernetes.io/revision=1
 Selector:   app=nginx
 Replicas:   2 desired | 2 updated | 2 total | 2 available | 0 unavailable
 StrategyType:   RollingUpdate
 MinReadySeconds:  0
 RollingUpdateStrategy:  1 max unavailable, 1 max surge
 Pod Template:
   Labels:       app=nginx
   Containers:
    nginx:
     Image:              nginx:1.14.2
     Port:               80/TCP
     Environment:        <none>
     Mounts:             <none>
   Volumes:              <none>
 Conditions:
   Type          Status  Reason
   ----          ------  ------
   Available     True    MinimumReplicasAvailable
   Progressing   True    NewReplicaSetAvailable
 OldReplicaSets:   <none>
 NewReplicaSet:    nginx-deployment-1771418926 (2/2 replicas created)
 No events.
```

List the Pods created by the deployment:

```shell
 kubectl get pods -l app=nginx
```

The output is similar to this:

```
 NAME                                READY     STATUS    RESTARTS   AGE
 nginx-deployment-1771418926-7o5ns   1/1       Running   0          16h
 nginx-deployment-1771418926-r18az   1/1       Running   0          16h
```

Display information about a Pod:

```shell
 kubectl describe pod <pod-name>
```

where <pod-name> is the name of one of your Pods.

Updating the deployment
You can update the deployment by applying a new YAML file. This YAML file specifies that the deployment should be updated to use nginx 1.16.1.

```
cat > deployment-update.yaml <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  selector:
    matchLabels:
      app: nginx
  replicas: 2
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.16.1 # Update the version of nginx from 1.14.2 to 1.16.1
        ports:
        - containerPort: 80
EOF
```

Apply the new YAML file:

```shell
  kubectl apply -f https://k8s.io/examples/application/deployment-update.yaml
```

Watch the deployment create pods with new names and delete the old pods:

```shell
  kubectl get pods -l app=nginx
```

Scaling the application by increasing the replica count
You can increase the number of Pods in your Deployment by applying a new YAML file. This YAML file sets replicas to 4, which specifies that the Deployment should have four Pods:

```
cat > deployment-scale.yaml <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  selector:
    matchLabels:
      app: nginx
  replicas: 4 # Update the replicas from 2 to 4
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
EOF
```

Apply the new YAML file:

```shell
kubectl apply -f https://k8s.io/examples/application/deployment-scale.yaml
```

Verify that the Deployment has four Pods:

```shell
kubectl get pods -l app=nginx
```

The output is similar to this:

```
 NAME                               READY     STATUS    RESTARTS   AGE
 nginx-deployment-148880595-4zdqq   1/1       Running   0          25s
 nginx-deployment-148880595-6zgi1   1/1       Running   0          25s
 nginx-deployment-148880595-fxcez   1/1       Running   0          2m
 nginx-deployment-148880595-rwovn   1/1       Running   0          2m
```

Delete the deployment by name:

```shell
kubectl delete deployment nginx-deployment
```


## Exercise 1 - Testing rolling update deployment

* Create test deployment

```shell
kubectl create namespace webapp
kubectl create deployment -n webapp test --image=nginx:1.14.2
```

* Check deployment status

```shell
kubectl get deploy,rs,pods -n webapp
kubectl rollout history deployment -n webapp test
```

* Change number of replicas

```shell
kubectl scale deployment -n webapp test --replicas=3 --record
```
        
* Check deployment status

```shell
kubectl get deploy,rs,pods -n webapp
```

* Update deployment

```shell
export CONTAINER_NAME=$(kubectl get deployment -n webapp test -o jsonpath="{...name}" | cut -d " " -f2)
kubectl set image deployment -n webapp test $CONTAINER_NAME=nginx:1.20.2 --record
```

* Check deployment status 

```shell
kubectl get deploy,rs,pods -n webapp
```

* Check deployment rollout history

```shell
kubectl rollout history --revision=2 -n webapp deployment test
```

* Change resource limits 

```shell
kubectl set resources -n webapp deployment test --containers=nginx --limits=cpu=200m,memory=512Mi --record
```

* Mess up deployment

```shell
kubectl rollout history deployment -n webapp test
kubectl set image deployment -n webapp test $CONTAINER_NAME=nginx:1.173-NON-EXISTING --record 
```

* Check the status

```shell
kubectl get deploy,rs,pods -n webapp
kubectl rollout status deployment -n webapp test
```

* Deployment rollback

```shell
kubectl rollout undo deployment -n webapp test
```


## Exercise 2 - Enable autoscaling

* Deploy latest metrics-server

```shell
wget https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

Add `--kubelet-insecure-tls` to `components.yaml`

```
                ...
        spec:
            containers:
                - args:
                  - --cert-dir=/tmp
                  - --secure-port=4443
                  - --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname
                  - --kubelet-use-node-status-port
                  - --metric-resolution=15s

               # Add Line number 136

                - --kubelet-insecure-tls
```

* Deploy metric server

```shell
kubectl apply -f components.yaml
kubectl get deploy -n kube-system metrics-server
```
Wait at least 1 minute and try to use:

```shell
kubectl top nodes
kubectl top pods -n webapp
```

* Update nginx deployment and add resources requests CPU `200m`

```shell
kubectl patch deployment -n webapp test --type='json' -p='[{"op":"add", "path":"/spec/template/spec/containers/0/resources/requests", "value":{"cpu":"200m"}}]'
```

* Enable Horizontal Pod Autoscaler for `test` deployment

```shell
kubectl autoscale deployment -n webapp test --min=1 --max=5 --cpu-percent=60
```

* Check HPA staus

```shell
kubectl get hpa test -n webapp
```

Output:

```
NAME    REFERENCE          TARGETS   MINPODS   MAXPODS   REPLICAS   AGE
nginx   Deployment/nginx   0%/60%    1         5         1          36m
```

* Check HPA event logs

```shell
kubectl describe hpa -n webapp test
```

* Clean up

```shell
kubectl delete namespace webapp 
```
