---
sidebar_position: 7
---

# Use ReplicaSet and Deployment

Orchestrating applications with ReplicaSet and Deployment mechanisms

## Use ReplicaSet to start application 

Check list of namespaces:

```shell
kubectl get ns
```

Create new `myapp` namespace for Pod instance:

```shell
kubectl create ns myapp
```

Create a ReplicaSet template manifest for `myapp`: 

```yaml title="rs-myapp.yaml"
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: myapp
  namespace: myapp
spec:
  selector:
    matchLabels:
      app: myapp
  replicas: 1
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp
        image: ghcr.io/go4clouds/myapp:v1.0
        ports:
        - name: http
          containerPort: 8081
          protocol: TCP
```

Apply ReplicaSet manifest:

```shell
kubectl apply -f rs-myapp.yaml
```

Check ReplicaSet and Pod status:

```shell
kubectl get replicaset,pods -n myapp -o wide
```

Scale up the number of replicas:

```shell
kubectl scale -n myapp replicaset myapp --replicas=3
```

Check ReplicaSet and Pod status:

```shell
kubectl get rs,pods -n myapp -o wide
```

To clean up, remove the entire namespace:

```shell
kubectl delete ns myapp
```

## Use Deployment to start application 

Check list of namespaces:

```shell
kubectl get ns
```

Create a new `myapp` namespace for the Pod instance:

```shell
kubectl create ns myapp
```

Create a Deployment template manifest for 'myapp': 

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
        image: ghcr.io/go4clouds/myapp:v1.0
        ports:
        - name: http
          containerPort: 8081
          protocol: TCP
```

Apply the Deployment manifest:

```shell
kubectl apply -f deploy-myapp.yaml
```

Check Deployment, ReplicaSet and Pod status:

```shell
kubectl get events --sort-by='.lastTimestamp' -n myapp
kubectl get deploy,rs,pods -n myapp -o wide
```

Scale up the number of replicas:

```shell
kubectl scale -n myapp deployment myapp --replicas=5
```

Check the status of Deployment, ReplicaSet, and Pod:

```shell
kubectl get events --sort-by='.lastTimestamp' -n myapp
kubectl get deploy,rs,pods -n myapp -o wide
```

To clean up, remove the `myapp` namespace:

```shell
kubectl delete ns myapp
```

## Testing rolling update deployment

Create `webapp` Deployment:

```shell
kubectl create namespace webapp
kubectl create deployment -n webapp webapp --image=docker.io/library/nginx:1.16.1
```
<details>
<summary>See `deploy-webapp.yaml` </summary>

```yaml title= deploy-webapp.yaml"
apiVersion: apps/v1
kind: Deployment
metadata:
  creationTimestamp: null
  labels:
    app: webapp
  name: webapp
  namespace: webapp
spec:
  replicas: 1
  selector:
    matchLabels:
      app: webapp
  strategy: {}
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: webapp
    spec:
      containers:
      - image: docker.io/library/nginx:1.16.1
        name: nginx
        resources: {}
status: {}
```
</details>

Check the status of Deployment:

```shell
kubectl get deploy,rs,pods -n webapp
kubectl rollout history deployment -n webapp webapp
```

Change number of replicas:

```shell
kubectl scale deployment -n webapp webapp --replicas=3
```

Annotate changes:

```shell
kubectl annotate deployment -n webapp webapp kubernetes.io/change-cause="scale up from 1 to 3 replicas"
```
        
Check the status of Deployment:

```shell
kubectl get deploy,rs,pods -n webapp
```

Update Deployment configuration:

```shell
export CONTAINER_NAME=$(kubectl get deployment -n webapp webapp -o jsonpath="{...name}" | cut -d " " -f2)
kubectl set image deployment -n webapp webapp $CONTAINER_NAME=docker.io/library/nginx:1.20.2
```

Annotate changes:

```shell
kubectl annotate deployment -n webapp webapp kubernetes.io/change-cause="$CONTAINER_NAME=docker.io/library/nginx:1.20.2"
```

Check the status of Deployment:

```shell
kubectl get deploy,rs,pods -n webapp
```

Check the history of Deployment rollout:

```shell
kubectl rollout history --revision=2 -n webapp deployment webapp
```

Change resource limits:

```shell
kubectl set resources -n webapp deployment webapp --containers=$CONTAINER_NAME --limits=cpu=200m,memory=512Mi
```

Annotate changes:

```shell
kubectl annotate deployment -n webapp webapp kubernetes.io/change-cause="changed limits to 200m for cpu and 512Mi for memory"
```

Try to break the Deployment and use a broken container image:

```shell
kubectl rollout history deployment -n webapp webapp
kubectl set image deployment -n webapp webapp $CONTAINER_NAME=docker.io/library/nginx:1.24.3-NON-EXISTING
```

Annotate changes:

```shell
kubectl annotate deployment -n webapp webapp kubernetes.io/change-cause="changed Nginx to a non-existing version"
```

Check the status of Deployment:

```shell
kubectl get deploy,rs,pods -n webapp
kubectl get events --sort-by='.lastTimestamp' -n webapp
```

Roll back changes for the Deployment because the previous update is broken due to the non-existing image `nginx:1.24.3-NON-EXISTING`:

```shell
kubectl rollout undo deployment -n webapp webapp 
```

## Enable autoscaling

As a continuation of the previous step, we can enable **HorizontalPodAutoscaler**.

Enable Horizontal Pod Autoscaler for `webapp` deployment:

```shell
kubectl autoscale deployment -n webapp webapp --min=1 --max=5 --cpu-percent=60
```
<details>
<summary>See `autoscale.yaml` </summary>

```yaml title= autoscale.yaml"
apiVersion: autoscaling/v1
kind: HorizontalPodAutoscaler
metadata:
  creationTimestamp: null
  name: webapp
spec:
  maxReplicas: 5
  minReplicas: 1
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: webapp
  targetCPUUtilizationPercentage: 60
status:
  currentReplicas: 0
  desiredReplicas: 0
```
</details>

Check the status of HPA:

```shell
kubectl get hpa webapp -n webapp
```

Output:

```
NAME    REFERENCE          TARGETS   MINPODS   MAXPODS   REPLICAS   AGE
nginx   Deployment/nginx   0%/60%    1         5         1          36m
```

Check HPA event logs:

```shell
kubectl describe hpa -n webapp webapp
```

To clean up:

```shell
kubectl delete namespace webapp 
```


