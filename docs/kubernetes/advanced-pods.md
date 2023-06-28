---
sidebar_position: 6
---

# Advanced Pod operations

Advanced operations with pods

## Adding resource requests and limits 

Check the list of namespaces:

```shell
kubectl get ns
```

Create a new `benchmark` Namespace for Pod instance:

```shell
kubectl create ns benchmark
```

Create a Pod template manifest with a stress tool in it: 

```shell
kubectl run -n benchmark stress --image=vish/stress --dry-run=client -o yaml \
                                -- -cpus 1 -mem-total 350Mi -mem-alloc-size 100Mi -mem-alloc-sleep 5s > pod-stress.yaml
```

Edit the `pod-stress.yaml` manifest to get:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: stress
  namespace: benchmark
spec:
  containers:
  - name: stress
    args: 
    - -cpus
    - "1"
    - -mem-total
    - "350Mi"
    - -mem-alloc-size
    - "100Mi" 
    - -mem-alloc-sleep
    - "5s"
    image: vish/stress
    resources:
      requests:
        cpu: "500m"
        memory: "100Mi"
      limits:
        cpu: "1"
        memory: "300Mi"
```

Apply the Pod manifest and create it:

```shell
kubectl apply -f pod-stress.yaml
```

View detailed information about the Pod:

```shell
kubectl get pod -n benchmark stress -o wide
```

After a few seconds check resource usage:

```shell
kubectl top pods -n benchmark
```

Check the Pod status:

```shell
kubectl get pods -n benchmark
```

Output:

```shell
NAME     READY   STATUS    RESTARTS      AGE
stress   1/1     Running   1 (25s ago)   95s
```

Now check Pod details and try to find out why it was restarted:

```shell
kubectl describe pod -n benchmark stress
```

Output:

```shell
Name:         stress
Namespace:    benchmark

...

    State:          Running
      Started:      Wed, 28 Dec 2022 12:12:52 +0000
    Last State:     Terminated
      Reason:       OOMKilled
      Exit Code:    1
      Started:      Wed, 28 Dec 2022 12:11:42 +0000
      Finished:     Wed, 28 Dec 2022 12:12:50 +0000

...

```


Cleanup the environment:

```shell
kubectl delete ns benchmark
```

## Add a named port to Pod

Add a named port for the container in Pod manifests:

Create the `myapp` namespace:

```shell
kubectl create ns myapp
```

Create the `myapp` Pod manifest:

```yaml title="pod-myapp.yaml"
apiVersion: v1
kind: Pod
metadata:
  name: myapp
  namespace: myapp
spec:
  containers:
  - name: myapp
    image: ghcr.io/go4clouds/myapp:v1.0
    resources:
      limits:
        cpu: "500m"
        memory: "200Mi"
      requests:
        cpu: "150m"
        memory: "100Mi"
    ports:
    - name: http
      containerPort: 8081
      protocol: TCP
```

Apply the `myapp` Pod manfiest to the cluster:

```shell
kubectl apply -f pod-myapp.yaml
```

Check the Pod status and wait until the status changes to `Running`:

```shell
kubectl get pod -n myapp myapp -o wide
``` 

Check logs of the `myapp` pod container;

```shell
kubectl logs -n myapp myapp
```

Open a tunnel connection to the `myapp` pod container:

```shell
kubectl port-forward -n myapp pod/myapp 8081:8081
```

In another terminal test the connection:

```shell
curl http://127.0.0.1:8081
```

## Add liveness and readiness probes

We would like to extend the previous example and add liveness and readiness probes to it.

Update the `myapp` Pod manifest example with liveness probe:

```yaml title="pod-myapp.yaml"
apiVersion: v1
kind: Pod
metadata:
  name: myapp
  namespace: myapp
spec:
  containers:
  - name: myapp
    image: ghcr.io/go4clouds/myapp:v1.0
    resources:
      limits:
        cpu: "500m"
        memory: "200Mi"
      requests:
        cpu: "150m"
        memory: "100Mi"
    ports:
    - name: http
      containerPort: 8081
      protocol: TCP
    livenessProbe:
      httpGet:
          path: /
          port: 8080
      failureThreshold: 1
      initialDelaySeconds: 3
      periodSeconds: 5
```

Save the changes and clenup the already running Pod instance:

```shell
kubectl delete -f pod-myapp.yaml
```

Apply the changes and start a new Pod:

```shell
kubectl apply -f pod-myapp.yaml
```

Wait a few seconds and check the Pod status:

```shell
kubectl describe pod -n myapp myapp
```

Output:

```shell

...

Events:
  Type     Reason     Age                From               Message
  ----     ------     ----               ----               -------
  Normal   Scheduled  52s                default-scheduler  Successfully assigned myapp/myapp to worker1
  Normal   Pulled     17s (x2 over 51s)  kubelet            Container image "ghcr.io/go4clouds/myapp:v1.0" already present on machine
  Normal   Created    17s (x2 over 51s)  kubelet            Created container myapp
  Normal   Started    17s (x2 over 51s)  kubelet            Started container myapp
  Warning  Unhealthy  12s (x2 over 47s)  kubelet            Liveness probe failed: Get "http://192.168.235.155:8080/": dial tcp 192.168.235.155:8080: connect: connection refused
  Normal   Killing    12s (x2 over 47s)  kubelet            Container myapp failed liveness probe, will be restarted
```

The Pod was restarted because the check couldn't succeed as the application is listening on port `8081`.

Let's fix the configuration:

```yaml title="pod-myapp.yaml"
apiVersion: v1
kind: Pod
metadata:
  name: myapp
  namespace: myapp
spec:
  containers:
  - name: myapp
    image: ghcr.io/go4clouds/myapp:v1.0
    resources:
      limits:
        cpu: "500m"
        memory: "200Mi"
      requests:
        cpu: "150m"
        memory: "100Mi"
    ports:
    - name: http
      containerPort: 8081
      protocol: TCP
    livenessProbe:
      httpGet:
          path: /
          port: http
      failureThreshold: 1
      initialDelaySeconds: 3
      periodSeconds: 5
```

Save the changes and clenup the already running Pod instance:

```shell
kubectl delete -f pod-myapp.yaml
```

Apply the changes and start a new Pod:

```shell
kubectl apply -f pod-myapp.yaml
```

Now check the Pod status:

```shell
kubectl get pods -n myapp
kubectl describe pod -n myapp myapp
```

Cleanup the `myapp` Pod:

```shell
kubectl delete ns myapp
```


