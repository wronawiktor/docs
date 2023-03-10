---
sidebar_position: 15
---

# Troubleshooting


## Debug any application

Create test Namespace:

```shell
kubectl create ns test
```

Deploy backend application:

```shell
kubectl create deployment -n test backend --image=k8s.gcr.io/pause:3.1 --replicas=3
```

Check application status:

```shell
kubectl get deploy,rs,pods -n test -o wide
```

Check Events in the Namespace test:

```shell
kubectl get events --sort-by=.metadata.creationTimestamp -n test
```

Expose test application with Service:

```shell
kubectl expose deployment -n test backend --port=80 --target-port=8080
```

Now we can start verify if test application works properly:

```shell
kubectl logs -n test -l app=backend
```

Try open terminal:

```shell
kubectl exec -n test -ti POD_NAME -- bash
kubectl exec -n test -ti POD_NAME -- sh
kubectl exec -n test -ti POD_NAME -- zsh
```

Try to open port and make test connection:

```shell
kubectl port-forward -n test pod/POD_NAME 8080:80 &
```

Test with curl:

```shell
curl http://127.0.0.1:8080
```

Because we have noticed that application doesn't work and we can't connect to it. We have to attach with our own debug container:

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