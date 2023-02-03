---
sidebar_position: 6
---

# Advanced pod operations

Advanced operations with pods

## Adding resources requests and limits 

Check list of namespaces:

```shell
kubectl get ns
```

Create new `benchmark` namespace for pod instance:

```shell
kubectl create ns benchmark
```

Create Pod template manifest with stress tool in it: 

```shell
kubectl run -n benchmark stress --image=polinux/stress --dry-run=client -o yaml \
                                -- stress --vm 1 --vm-bytes 150M --vm-hang 1 > pod-stress.yaml
```

Edit `pod-stress.yaml` manifest to get:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: stress
  namespace: benchmark
spec:
  containers:
  - name: stress
    image: polinux/stress
    resources:
      requests:
        cpu: "500m"
        memory: "100Mi"
      limits:
        cpu: "1"
        memory: "200Mi"
      requests:
        memory: "100Mi"
    command: ["stress"]
    args: ["--vm", "1", "--vm-bytes", "150M", "--vm-hang", "1"]
```

Apply the Pod manifest and create it:

```shell
kubectl apply -f pod-stress.yaml
```

View detailed information about the Pod:

```shell
kubectl get pod -n bechmark stress -o wide
```

After few seconds check resources usage:

```shell
kubectl top pods -n benchmark
```

Try to run another `stress` application intance inside container to test resources limits:

```shell
kubectl exec -ti stress -n benchmark -- stress --vm 1 --vm-bytes 100M
```

Check Pod status:

```shell
kubectl get pods -n benchmark
```

Output:

```shell
NAME     READY   STATUS    RESTARTS      AGE
stress   1/1     Running   1 (25s ago)   95s
```

Now check Pod details and try to find why it was restarted:

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


Cleanup environment:

```shell
kubectl delete ns benchmark
```

## Add named port to Pod

Add named port for Container in Pod manifests

Create `myapp` namespace:

```shell
kubectl create ns myapp
```

Create `myapp` Pod manifest:

```yaml title="pod-myapp.yaml"
apiVersion: v1
kind: Pod
metadata:
  name: myapp
  namespace: myapp
spec:
  containers:
  - name: myapp
    image: ghcr.io/mjura/myapp:v1.0
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

Apply `myapp` Pod manfiest to the Cluster:

```shell
kubectl apply -f pod-myapp.yaml
```

Check pod status and wait until it will have `Running` status:

```shell
kubectl get pod -n myapp myapp -o wide
``` 

Check logs of `myapp` pod container;

```shell
kubectl logs -n myapp myapp
```

Open tunnel connection to `myapp` pod container:

```shell
kubectl port-forward -n myapp pod/myapp 8081:8081
```

In another terminal do test connection:

```shell
curl http://127.0.0.1:8081
```

## Add liveness and readiness probes

We would like to extend previous example and add liveness and readiness probes to it.

Update `myapp` Pod manifest example with liveness probe:

```yaml title="pod-myapp.yaml"
apiVersion: v1
kind: Pod
metadata:
  name: myapp
  namespace: myapp
spec:
  containers:
  - name: myapp
    image: ghcr.io/mjura/myapp:v1.0
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

Save changes clenup already running Pod instance:

```shell
kubectl delete -f pod-myapp.yaml
```

Apply changes and start new Pod:

```shell
kubectl apply -f pod-myapp.yaml
```

Wait few seconds and check pod status:

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
  Normal   Pulled     17s (x2 over 51s)  kubelet            Container image "ghcr.io/mjura/myapp:v1.0" already present on machine
  Normal   Created    17s (x2 over 51s)  kubelet            Created container myapp
  Normal   Started    17s (x2 over 51s)  kubelet            Started container myapp
  Warning  Unhealthy  12s (x2 over 47s)  kubelet            Liveness probe failed: Get "http://192.168.235.155:8080/": dial tcp 192.168.235.155:8080: connect: connection refused
  Normal   Killing    12s (x2 over 47s)  kubelet            Container myapp failed liveness probe, will be restarted
```

Pod was restarted because check couldn't success, because application is listening on port `8081`.

Let's fix configuration:

```yaml title="pod-myapp.yaml"
apiVersion: v1
kind: Pod
metadata:
  name: myapp
  namespace: myapp
spec:
  containers:
  - name: myapp
    image: ghcr.io/mjura/myapp:v1.0
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

Save changes clenup already running Pod instance:

```shell
kubectl delete -f pod-myapp.yaml
```

Apply changes and start new Pod:

```shell
kubectl apply -f pod-myapp.yaml
```

Now check Pod status:

```shell
kubectl get pods -n myapp
kubectl describe pod -n myapp myapp
```

Cleanup `myapp` pod:

```shell
kubectl delete ns myapp
```


