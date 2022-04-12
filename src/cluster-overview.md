# Lab Exercises for basic commands

## Exercise 0 - Checking Kubernets cluster status

* Get Kubernetes cluster nodes list

```shell
kubectl get nodes
```

* Run once again previous command with new option `-o` and compare outputs

```shell
kubectl get nodes -o wide
```

* Check node description for k8s-master1

```shell
kubectl describe node k8s-master1
```

* Check node description for k8s-worker1

```shell
kubectl describe node k8s-worker1
```


## Exercise 1 - Change role description for nodes

* Show labels for nodes

```shell
kubectl get nodes --show-labels
```

* Change role name for worker nodes

```shell
kubectl label node k8s-worker1 node-role.kubernetes.io/worker=
kubectl label node k8s-worker2 node-role.kubernetes.io/worker=
```

or use some simple script

```shell
for SRV in k8s-worker1 k8s-worker2; do
kubectl label node $SRV node-role.kubernetes.io/worker=
done
```

* Check nodes labels

```shell
kubectl get nodes --show-labels
```

* Remove node labels

```shell
kubectl label node k8s-worker1 node-role.kubernetes.io/worker-
kubectl label node k8s-worker2 node-role.kubernetes.io/worker-
```


## Exercise 2 - Configure node taints

* Check node taints for cluster

```shell
kubectl describe nodes | grep Taints
```

* Disable k8s-worker1 from scheduling

```shell
kubectl taint node k8s-worker1 node-role.kubernetes.io/worker=:NoSchedule
```

* Check node taints once again
 
```shell
kubectl describe nodes | grep Taints
```

* Remove node taint from k8s-worker1

```shell
kubectl taint node k8s-worker1 node-role.kubernetes.io/worker-
```


## Exercise 3 - Annotate nodes 

* Add node annotation 

```shell
kubectl annotate node k8s-master1 description="This is Kubernetes MASTER1 node!"
``` 

* Check annotations section

```shell
kubectl describe node k8s-master1
```

* Remove annotation

```shell
kubectl annotate node k8s-master1 description-
```

## Exercise 4 - Install Metric Server

* Install Metric Server

```shell
kubectl apply -f metric-server.yaml
```

* Check Metric Server installation

```shell
kubectl get deploy -n kube-system metrics-server
```

* Check logs from Metric server

```shell
kubectl logs -n kube-system metrics-server-<Tab>
```

Output

```
I0721 08:46:41.123090       1 secure_serving.go:197] Serving securely on [::]:443
I0721 08:46:41.124273       1 dynamic_serving_content.go:130] Starting serving-cert::/tmp/apiserver.crt::/tmp/apiserver.key
I0721 08:46:41.124735       1 tlsconfig.go:240] Starting DynamicServingCertificateController
I0721 08:46:41.221247       1 shared_informer.go:247] Caches are synced for RequestHeaderAuthRequestController 
I0721 08:46:41.221714       1 shared_informer.go:247] Caches are synced for client-ca::kube-system::extension-apiserver-authentication::client-ca-file 
I0721 08:46:41.222167       1 shared_informer.go:247] Caches are synced for client-ca::kube-system::extension-apiserver-authentication::requestheader-client-ca-file
```
