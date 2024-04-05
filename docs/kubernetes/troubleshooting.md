---
sidebar_position: 15
---

# Troubleshooting


## Debug any application

Create test Namespace:

```shell
kubectl create ns test
```

Deploy the backend application:

```shell
kubectl create deployment -n test backend --image=k8s.gcr.io/pause:3.1 --replicas=3
```

<details>
<summary>See created Deployment </summary>

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  creationTimestamp: null
  labels:
    app: backend
  name: backend
  namespace: test
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  strategy: {}
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: backend
    spec:
      containers:
      - image: k8s.gcr.io/pause:3.1
        name: pause
        resources: {}
status: {}
```

</details>

Check the application status:

```shell
kubectl get deploy,rs,pods -n test -o wide
```

Check the Events in the test Namespace:

```shell
kubectl get events --sort-by=.metadata.creationTimestamp -n test
```

Expose test application with Service:

```shell
kubectl expose deployment -n test backend --port=80 --target-port=8080
```

<details>
<summary>See created Service </summary>

```yaml
apiVersion: v1
kind: Service
metadata:
  creationTimestamp: null
  labels:
    app: backend
  name: backend
  namespace: test
spec:
  ports:
  - port: 80
    protocol: TCP
    targetPort: 8080
  selector:
    app: backend
status:
  loadBalancer: {}

```

</details>

Now we can start verifying if the test application works properly:

```shell
kubectl logs -n test -l app=backend
```

Try open the terminal:

```shell
kubectl exec -n test -ti POD_NAME -- bash
kubectl exec -n test -ti POD_NAME -- sh
kubectl exec -n test -ti POD_NAME -- zsh
```

Try to open the port and make a test connection:

```shell
kubectl port-forward -n test pod/POD_NAME 8080:80 &
```

Test with curl:

```shell
curl http://127.0.0.1:8080
```

Since we've observed that the application isn't working, and we can't connect to it, we need to attach our own debug container:

```shell
kubectl debug -n test -ti --image=debian POD_NAME --target=pause -- bash
# apt update
# apt install procps iproute2 dnsutils
# ps faxuw
# ip a
# ip r
# cat /etc/resolv.conf
# nslookup backend 10.96.0.10
# cd /proc/1/root
# ls
```

Clean up

```shell
kubectl delete ns test
```