---
sidebar_position: 7
---

# Use ReplicaSet and Deployment

Orchestrating application with ReplicaSet and Deployment mechanism

## Use ReplicaSet to start application 

Check list of namespaces:

```shell
kubectl get ns
```

Create new `myapp` namespace for pod instance:

```shell
kubectl create ns myapp
```

Create ReplicaSet template manifest for `myapp`: 

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

Scale up number of replicas:

```shell
kubectl scale -n myapp replicaset myapp --replicas=3
```

Check ReplicaSet and Pod status:

```shell
kubectl get rs,pods -n myapp -o wide
```

To cleanup remove whole namespace:

```shell
kubectl delete ns myapp
```

## Use Deployment to start application 

Check list of namespaces:

```shell
kubectl get ns
```

Create new `myapp` namespace for pod instance:

```shell
kubectl create ns myapp
```

Create Deployment template manifest for `myapp`: 

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

Apply Deployment manifest:

```shell
kubectl apply -f deploy-myapp.yaml
```

Check Deployment, ReplicaSet and Pod status:

```shell
kubectl get events --sort-by='.lastTimestamp' -n myapp
kubectl get deploy,rs,pods -n myapp -o wide
```

Scale up number of replicas:

```shell
kubectl scale -n myapp deployment myapp --replicas=5
```

Check Deployment, ReplicaSet and Pod status:

```shell
kubectl get events --sort-by='.lastTimestamp' -n myapp
kubectl get deploy,rs,pods -n myapp -o wide
```

To cleanup remove `myapp` namespace:

```shell
kubectl delete ns myapp
```

## Testing rolling update deployment

Create `webapp` Deployment:

```shell
kubectl create namespace webapp
kubectl create deployment -n webapp webapp --image=docker.io/library/nginx:1.16.1
```

Check Deployment status:

```shell
kubectl get deploy,rs,pods -n webapp
kubectl rollout history deployment -n webapp webapp
```

Change number of replicas:

```shell
kubectl scale deployment -n webapp webapp --replicas=3 --record
```
        
Check Deployment status:

```shell
kubectl get deploy,rs,pods -n webapp
```

Update Deployment configuration:

```shell
export CONTAINER_NAME=$(kubectl get deployment -n webapp webapp -o jsonpath="{...name}" | cut -d " " -f2)
kubectl set image deployment -n webapp webapp $CONTAINER_NAME=docker.io/library/nginx:1.20.2 --record
```

Check Deployment status:

```shell
kubectl get deploy,rs,pods -n webapp
```

Check Deployment rollout history:

```shell
kubectl rollout history --revision=2 -n webapp deployment webapp
```

Change resource limits:

```shell
kubectl set resources -n webapp deployment webapp --containers=$CONTAINER_NAME --limits=cpu=200m,memory=512Mi --record
```

Try to break Deployment and use broken container image:

```shell
kubectl rollout history deployment -n webapp webapp
kubectl set image deployment -n webapp webapp $CONTAINER_NAME=docker.io/library/nginx:1.24.3-NON-EXISTING --record 
```

Check Deployment status:

```shell
kubectl get deploy,rs,pods -n webapp
kubectl rollout status deployment -n webapp webapp
```

Rollback changes for Deployment:

```shell
kubectl rollout undo deployment -n webapp webapp
```

## Enable autoscaling

As continuation to previous step we can enable HorizontalPodAutoscaler

Enable Horizontal Pod Autoscaler for `webapp` deployment:

```shell
kubectl autoscale deployment -n webapp webapp --min=1 --max=5 --cpu-percent=60
```

 Check HPA status:

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


