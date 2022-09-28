# Lab Exercises for Advanced Pods Operations


## Exercise 0 - [Specify a memory request and a memory limit](https://kubernetes.io/docs/tasks/configure-pod-container/assign-memory-resource/#specify-a-memory-request-and-a-memory-limit)


Create a namespace so that the resources you create in this exercise are isolated from the rest of your cluster

```shell
kubectl create namespace mem-example
```

Create Pod that has one Container. The Container has a memory request of 100 MiB and a memory limit of 200 MiB. Here's the configuration file for the Pod:

```shell
cat > memory-request-limit.yaml <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: memory-demo
  namespace: mem-example
spec:
  containers:
  - name: memory-demo-ctr
    image: polinux/stress
    resources:
      limits:
        memory: "200Mi"
      requests:
        memory: "100Mi"
    command: ["stress"]
    args: ["--vm", "1", "--vm-bytes", "150M", "--vm-hang", "1"]
EOF
```

The args section in the configuration file provides arguments for the Container when it starts. The `--vm-bytes`, `150M` arguments tell the Container to attempt to allocate 150 MiB of memory.

Create the Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/memory-request-limit.yaml --namespace=mem-example
```

Verify that the Pod Container is running:

```shell
kubectl get pod memory-demo --namespace=mem-example
```

View detailed information about the Pod:

```shell
kubectl get pod memory-demo --output=yaml --namespace=mem-example
```

The output shows that the one Container in the Pod has a memory request of 100 MiB and a memory limit of 200 MiB.

```
resources:
  limits:
    memory: 200Mi
  requests:
    memory: 100Mi
```

Run kubectl top to fetch the metrics for the pod:

```shell
kubectl top pod memory-demo --namespace=mem-example
```

The output shows that the Pod is using about 162,900,000 bytes of memory, which is about 150 MiB. This is greater than the Pod's 100 MiB request, but within the Pod's 200 MiB limit.

```shell
NAME                        CPU(cores)   MEMORY(bytes)
memory-demo                 <something>  162856960
```

Delete your Pod:

```shell
kubectl delete pod memory-demo --namespace=mem-example
```

## Exercise 1 - [Exceed a Container's memory limit](https://kubernetes.io/docs/tasks/configure-pod-container/assign-memory-resource/#exceed-a-container-s-memory-limit)

A Container can exceed its memory request if the Node has memory available. But a Container is not allowed to use more than its memory limit. If a Container allocates more memory than its limit, the Container becomes a candidate for termination. If the Container continues to consume memory beyond its limit, the Container is terminated. If a terminated Container can be restarted, the kubelet restarts it, as with any other type of runtime failure.

In this exercise, you create a Pod that attempts to allocate more memory than its limit. Here is the configuration file for a Pod that has one Container with a memory request of 50 MiB and a memory limit of 100 MiB:

```
cat > memory-request-limit-2.yaml <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: memory-demo-2
  namespace: mem-example
spec:
  containers:
  - name: memory-demo-2-ctr
    image: polinux/stress
    resources:
      requests:
        memory: "50Mi"
      limits:
        memory: "100Mi"
    command: ["stress"]
    args: ["--vm", "1", "--vm-bytes", "250M", "--vm-hang", "1"]
EOF
```

In the args section of the configuration file, you can see that the Container will attempt to allocate 250 MiB of memory, which is well above the 100 MiB limit.

Create the Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/memory-request-limit-2.yaml --namespace=mem-example
```

View detailed information about the Pod:

```shell
kubectl get pod memory-demo-2 --namespace=mem-example
```

At this point, the Container might be running or killed. Repeat the preceding command until the Container is killed:

```shell
NAME            READY     STATUS      RESTARTS   AGE
memory-demo-2   0/1       OOMKilled   1          24s
```

Get a more detailed view of the Container status:

```shell
kubectl get pod memory-demo-2 --output=yaml --namespace=mem-example
```

The output shows that the Container was killed because it is out of memory (OOM):

```
lastState:
   terminated:
     containerID: docker://65183c1877aaec2e8427bc95609cc52677a454b56fcb24340dbd22917c23b10f
     exitCode: 137
     finishedAt: 2017-06-20T20:52:19Z
     reason: OOMKilled
     startedAt: null
```

The Container in this exercise can be restarted, so the kubelet restarts it. Repeat this command several times to see that the Container is repeatedly killed and restarted:

```shell
kubectl get pod memory-demo-2 --namespace=mem-example
```

The output shows that the Container is killed, restarted, killed again, restarted again, and so on:

```shell
kubectl get pod memory-demo-2 --namespace=mem-example
NAME            READY     STATUS      RESTARTS   AGE
memory-demo-2   0/1       OOMKilled   1          37s
```

```shell
kubectl get pod memory-demo-2 --namespace=mem-example
NAME            READY     STATUS    RESTARTS   AGE
memory-demo-2   1/1       Running   2          40s
```

View detailed information about the Pod history:

```shell
kubectl describe pod memory-demo-2 --namespace=mem-example
```

The output shows that the Container starts and fails repeatedly:

```
... Normal  Created   Created container with id 66a3a20aa7980e61be4922780bf9d24d1a1d8b7395c09861225b0eba1b1f8511
... Warning BackOff   Back-off restarting failed container
```

View detailed information about your cluster's Nodes:

```shell
kubectl describe nodes
```

The output includes a record of the Container being killed because of an out-of-memory condition:

```
Warning OOMKilling Memory cgroup out of memory: Kill process 4481 (stress) score 1994 or sacrifice child
```

Delete your Pod:

```shell
kubectl delete pod memory-demo-2 --namespace=mem-example
```

Delete your namespace. This deletes all the Pods that you created for this task:

```shell
kubectl delete namespace mem-example
```


## Exercise 2 - [Specify a CPU request and a CPU limit](https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/#specify-a-cpu-request-and-a-cpu-limit)

Create a Namespace so that the resources you create in this exercise are isolated from the rest of your cluster.

```shell
kubectl create namespace cpu-example
```

In this exercise, you create a Pod that has one container. The container has a request of 0.5 CPU and a limit of 1 CPU. Here is the configuration file for the Pod:

```
cat > cpu-request-limit.yaml <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: cpu-demo
  namespace: cpu-example
spec:
  containers:
  - name: cpu-demo-ctr
    image: polinux/stress
    resources:
      limits:
        cpu: "1"
      requests:
        cpu: "0.5"
    args:
    - -cpus
    - "2"
EOF
```

The args section of the configuration file provides arguments for the container when it starts. The -cpus "2" argument tells the Container to attempt to use 2 CPUs.

Create the Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/cpu-request-limit.yaml --namespace=cpu-example
```

Verify that the Pod is running:

```shell
kubectl get pod cpu-demo --namespace=cpu-example
```

View detailed information about the Pod:

```shell
kubectl get pod cpu-demo --output=yaml --namespace=cpu-example
```

The output shows that the one container in the Pod has a CPU request of 500 milliCPU and a CPU limit of 1 CPU.

```
resources:
  limits:
    cpu: "1"
  requests:
    cpu: 500m
```

Use kubectl top to fetch the metrics for the pod:

```shell
kubectl top pod cpu-demo --namespace=cpu-example
```

This example output shows that the Pod is using 974 milliCPU, which is slightly less than the limit of 1 CPU specified in the Pod configuration.

```
NAME                        CPU(cores)   MEMORY(bytes)
cpu-demo                    974m         <something>
```

## Exercise 3 - [Scheduling pod on specific node](https://kubernetes.io/docs/tasks/configure-pod-container/assign-pods-nodes/)


Add a label to a node
List the nodes in your cluster, along with their labels:

```shell
kubectl get nodes --show-labels
```

The output is similar to this:

```
NAME          STATUS   ROLES                  AGE     VERSION   LABELS
k8s-master1   Ready    control-plane,master   7h58m   v1.20.9   beta.kubernetes.io/arch=amd64,beta.kubernetes.io/os=linux,kubernetes.io/arch=amd64,kubernetes.io/hostname=k8s-master1,kubernetes.io/os=linux,node-role.kubernetes.io/control-plane=,node-role.kubernetes.io/master=
k8s-master2   Ready    control-plane,master   7h56m   v1.20.9   beta.kubernetes.io/arch=amd64,beta.kubernetes.io/os=linux,kubernetes.io/arch=amd64,kubernetes.io/hostname=k8s-master2,kubernetes.io/os=linux,node-role.kubernetes.io/control-plane=,node-role.kubernetes.io/master=
k8s-master3   Ready    control-plane,master   7h55m   v1.20.9   beta.kubernetes.io/arch=amd64,beta.kubernetes.io/os=linux,kubernetes.io/arch=amd64,kubernetes.io/hostname=k8s-master3,kubernetes.io/os=linux,node-role.kubernetes.io/control-plane=,node-role.kubernetes.io/master=
k8s-worker1   Ready    <none>                 7h54m   v1.20.9   beta.kubernetes.io/arch=amd64,beta.kubernetes.io/os=linux,kubernetes.io/arch=amd64,kubernetes.io/hostname=k8s-worker1,kubernetes.io/os=linux
k8s-worker2   Ready    <none>                 7h54m   v1.20.9   beta.kubernetes.io/arch=amd64,beta.kubernetes.io/os=linux,kubernetes.io/arch=amd64,kubernetes.io/hostname=k8s-worker2,kubernetes.io/os=linux
```

Chose one of your nodes, and add a label to it:

```shell
kubectl label nodes k8s-worker1 disktype=ssd
```
where k8s-worker1 is the name of your chosen node.

Verify that your chosen node has a `disktype=ssd` label:

```shell
kubectl get nodes --show-labels
```

The output is similar to this:

```
NAME          STATUS    ROLES    AGE     VERSION        LABELS
...
k8s-worker1   Ready     <none>   1d      v1.20.9        ...,disktype=ssd,kubernetes.io/hostname=k8s-worker1
k8s-worker2   Ready     <none>   1d      v1.20.9        ...,kubernetes.io/hostname=k8s-worker2
```

In the preceding output, you can see that the worker0 node has a `disktype=ssd` label.

Create a pod that gets scheduled to your chosen node
This pod configuration file describes a pod that has a node selector, disktype: ssd. This means that the pod will get scheduled on a node that has a disktype=ssd label.

```
cat > pod-nginx.yaml <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    env: test
spec:
  containers:
  - name: nginx
    image: nginx
    imagePullPolicy: IfNotPresent
  nodeSelector:
    disktype: ssd
EOF
```

Use the configuration file to create a pod that will get scheduled on your chosen node:

```shell
kubectl apply -f https://k8s.io/examples/pods/pod-nginx.yaml
```

Verify that the pod is running on your chosen node:

```shell
kubectl get pods --output=wide
```

The output is similar to this:

```
NAME      READY   STATUS    RESTARTS   AGE    IP               NODE          NOMINATED NODE   READINESS
nginx     1/1     Running   0          4d2h   192.168.126.10   k8s-worker1   <none>           <none>
```

Chose one of your nodes, and add a label to it:

```shell
kubectl label nodes <your-node-name> disktype=ssd
```
where <your-node-name> is the name of your chosen node.

Verify that your chosen node has a disktype=ssd label:

```shell
kubectl get nodes --show-labels
```

The output is similar to this:

```
NAME          STATUS    ROLES    AGE     VERSION        LABELS
k8s-worker1   Ready     <none>   1d      v1.13.0        ...,disktype=ssd,kubernetes.io/hostname=k8s-worker1
k8s-worker2   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=k8s-worker2
```

In the preceding output, you can see that the worker0 node has a `disktype=ssd` label.

Create a pod that gets scheduled to your chosen node
This pod configuration file describes a pod that has a node selector, disktype: ssd. This means that the pod will get scheduled on a node that has a disktype=ssd label.

```
cat > pod-nginx.yaml <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    env: test
spec:
  containers:
  - name: nginx
    image: nginx
    imagePullPolicy: IfNotPresent
  nodeSelector:
    disktype: ssd
EOF
```

Use the configuration file to create a pod that will get scheduled on your chosen node:

```shell
kubectl apply -f https://k8s.io/examples/pods/pod-nginx.yaml
```

Verify that the pod is running on your chosen node:

```shell
kubectl get pods --output=wide
```

The output is similar to this:

```
NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
nginx    1/1       Running   0          13s    10.200.0.4   k8s-worker1
```
