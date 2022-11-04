# Lab Exercises for Kubernetes CNI

Notes: [Container Network Interface (CNI) Specification](https://github.com/containernetworking/cni/blob/master/SPEC.md)

Notes: [Calico achitecture](https://docs.projectcalico.org/reference/architecture/overview)

## Exercise 0 - Examine installed Kubernetes Network Plugin

* SSH on cp1 and check Kubernetes CNI plugin

```shell
ssh root@cp1 cat /etc/cni/net.d/10-calico.conflist
ssh root@cp1 cat /etc/cni/net.d/calico-kubeconfig
```

* Check Calico controller and agents

```shell
kubectl get deployment -n kube-system calico-kube-controllers
kubectl get ds,pod -n kube-system -l k8s-app=calico-node -o wide
```

* Download Calico YAML manifest

```shell
wget https://docs.projectcalico.org/manifests/calico.yaml
less calico.yaml
```

Find configuration section for POD IPs

```
...
            # The default IPv4 pool to create on startup if none exists. Pod IPs will be
            # chosen from this range. Changing this value after installation will have
            # no effect. This should fall within `--cluster-cidr`.
            # - name: CALICO_IPV4POOL_CIDR
            #   value: "192.168.0.0/16"
...
```

* Check Calico configuration

```shell
kubectl get -o yaml ClusterInformation 
kubectl get -o yaml KubeControllersConfiguration
```

* Install Calico client

```shell
kubectl apply -f https://docs.projectcalico.org/manifests/calicoctl.yaml
```

* Make alias to calicoctl

```shell
alias calicoctl="kubectl exec -i -n kube-system calicoctl -- /calicoctl"
```

* Check Calico configuration

```shell
calicoctl get ipPool
calicoctl get node
calicoctl get workloadEndpoint --all-namespaces
calicoctl get profile
```

## Exercise 1 - [Configure new IP pool](https://docs.projectcalico.org/getting-started/kubernetes/hardway/configure-ip-pools)

* Define new IP pool configuration

```shell
cat > test-pool.yaml <<EOF
apiVersion: crd.projectcalico.org/v1
kind: IPPool
metadata:
  name: test-pool
spec:
  blockSize: 26
  cidr: 172.19.0.0/16
  ipipMode: Always
  natOutgoing: true
  nodeSelector: all()
  vxlanMode: Never
EOF
```

* Apply `test-pool` YAML manifest

```shell
kubectl apply -f test-pool.yaml
```

* Check configuration with kubectl and calicoctl

```shell
kubectl get ipPool test-pool -o yaml
calicoctl get ippools
```


## Exercise 2 - [Test Network CNI](https://docs.projectcalico.org/getting-started/kubernetes/hardway/test-networking)

* Create three `busybox` instances

```shell
kubectl create deployment pingtest --image=k8s.gcr.io/busybox --replicas=3 -- sleep 3600
```

Check their IP addresses

```shell
kubectl get pods --selector=app=pingtest --output=wide
```

Output

```
NAME                        READY   STATUS    RESTARTS   AGE   IP               NODE          NOMINATED NODE   READINESS GATES
pingtest-64f9cb6b84-qh5zj   1/1     Running   0          9s    192.168.194.84   worker1       <none>           <none>
pingtest-64f9cb6b84-snl62   1/1     Running   0          9s    192.168.194.85   worker1       <none>           <none>
pingtest-64f9cb6b84-x46vd   1/1     Running   0          9s    192.168.126.10   worker2       <none>           <none>
```

Note the IP addresses of the second two pods, then exec into the first one. For example

```shell
kubectl exec -ti pingtest-64f9cb6b84-qh5zj -- sh
```

From inside the pod, ping the other two pod IP addresses. For example

```
ping  -c 4 192.168.126.10
```

Result

```
PING 192.168.126.10 (192.168.126.10): 56 data bytes
64 bytes from 192.168.126.10: seq=0 ttl=62 time=1.847 ms
64 bytes from 192.168.126.10: seq=1 ttl=62 time=0.684 ms
64 bytes from 192.168.126.10: seq=2 ttl=62 time=0.488 ms
64 bytes from 192.168.126.10: seq=3 ttl=62 time=0.442 ms

--- 192.168.126.10 ping statistics ---
4 packets transmitted, 4 packets received, 0% packet loss
round-trip min/avg/max = 0.442/0.865/1.847 ms
```

Check routes
From one of the nodes, verify that routes exist to each of the pingtest pods’ IP addresses. For example

```shell
ssh worker1 ip route get 192.168.126.10
```

Result

```
192.168.126.10 via 10.168.0.202 dev tunl0 src 192.168.194.64 uid 1000 
    cache expires 495sec mtu 1480
```


The via 10.168.0.202 in this example indicates the next-hop for this pod IP, which matches the IP address of the node the pod is scheduled on, as expected.

IPAM allocations from different pools
Recall that we created two IP pools, but left one disabled.

```shell
calicoctl get ippools -o wide
```

Result

```
NAME                  CIDR             NAT    IPIPMODE   VXLANMODE   DISABLED   SELECTOR   
default-ipv4-ippool   192.168.0.0/16   true   Always     Never       false      all()      
test-pool             172.19.0.0/16    true   Always     Never       false      all() 
```

Create a pod, explicitly requesting an address from pool2

```shell
kubectl apply -f - <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: pingtest-pool2
  annotations:
    cni.projectcalico.org/ipv4pools: "[\"test-pool\"]"
spec:
  containers:
  - args:
    - sleep
    - "3600"
    image: k8s.gcr.io/busybox
    imagePullPolicy: Always
    name: pingtest
EOF
```

Verify it has an IP address from test-pool

```shell
kubectl get pod pingtest-pool2 -o wide
```

Result

```
NAME             READY   STATUS    RESTARTS   AGE    IP             NODE          NOMINATED NODE   READINESS GATES
pingtest-pool2   1/1     Running   0          3d5h   172.18.126.0   worker2       <none>           <none>
```

From one of the original pingtest pods, ping the IP address.

```shell
ssh worker1 ping 172.18.126.0 -c 4
ssh cp3 ping 172.18.126.0 -c 4
```

Result

```
PING 172.18.126.0 (172.18.126.0) 56(84) bytes of data.
64 bytes from 172.18.126.0: icmp_seq=1 ttl=63 time=0.391 ms
64 bytes from 172.18.126.0: icmp_seq=2 ttl=63 time=0.784 ms
64 bytes from 172.18.126.0: icmp_seq=3 ttl=63 time=0.294 ms
64 bytes from 172.18.126.0: icmp_seq=4 ttl=63 time=0.414 ms

--- 172.18.126.0 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3045ms
rtt min/avg/max/mdev = 0.294/0.470/0.784/0.188 ms

```

Clean up

```
kubectl delete deployments.apps pingtest
kubectl delete pod pingtest-pool2
```

## Optional 0 - Create Linux Namespaces with IP

Please `cp3` as `root`

* Create Linux network namespace for container1

```shell
ip netns add container1
```

* Create veth pair network interfaces

```shell
ip link add veth0c1 type veth peer name veth1c1
```

* Associate the non `br-` side with the namespace

```shell
ip link set veth0c1 netns container1
```

* Give namespace-side veth ip addresses

```shell
ip netns exec container1 ip addr add 172.20.1.5/24 dev veth0c1
```

* Create a bridge device naming it `bridge1` and set it up

```shell
ip link add name bridge1 type bridge
```

* Check bridge list

```shell
brctl show
```

* Turn up the bridge

```shell
ip link set bridge1 up
```

* Set the bridge veth from the default namespace up

```shell
ip link set veth1c1 up
```

* Set the veth from the namespace up too

```shell
ip netns exec container1 ip link set veth0c1 up
```

* Add the veth1c1 interface to the bridge by setting the bridge device as their master

```shell
ip link set veth1c1 master bridge1
```

* Set the address of the `bridge1` interface (bridge device) to 172.20.1.1/24 and also set the broadcast address to 172.20.1.255 (the `+` symbol sets  the host bits to 255).

```shell
ip addr add 172.20.1.1/24 brd + dev bridge1
```

* Create Linux network namespace for container2

```shell
ip netns add container2
```

* Create veth pair network interfaces

```shell
ip link add veth0c2 type veth peer name veth1c2
```

* Associate the non `br-` side with the namespace

```shell
ip link set veth0c2 netns container2
```

* Give namespace-side veth ip addresses

```shell
ip netns exec container2 ip addr add 172.20.1.6/24 dev veth0c2
```

* Set the bridge veth from the default namespace up

```shell
ip link set veth1c2 up
```

* Set the veth from the namespace up too

```shell
ip netns exec container2 ip link set veth0c2 up
```

* Add the veth1c2 interface to the bridge by setting the bridge device as their master

```shell
ip link set veth1c2 master bridge1
```

* Check `bridge` list

```shell
brctl show
```

* Ping connection to `conainter1` and `container2`

```shell
ping -c 4 172.20.1.1
ping -c 4 172.20.1.5
ping -c 4 172.20.1.6
```


============================= PLEASE STOP HERE ===================================


Note: Steps below this line probably will brake your connection to your server

* Add the physical interface to the bridge

```shell
ip link set ens4 master bridge1
```

* Add the default gateway in all the network namespace

```shell
ip netns exec namespace1 ip route add default via 172.20.1.1
```

* Set us up to have responses from the network

```
# -t specifies the table to which the commands should be directed to. By default, it's `filter`.
# -A specifies that we're appending a rule to the chain that we tell the name after it.
# -s specifies a source address (with a mask in this case).
# -j specifies the target to jump to (what action to take).
```

```shell
iptables -t nat -A POSTROUTING -s 172.20.1.0/24 -j MASQUERADE
sysctl -w net.ipv4.ip_forward=1
```


## Optional 1 - Make Kubernetes container namespaces visible

* SSH on `worker2`

```shell
ln -s /var/run/docker/netns  /var/run/netns
```

* Then check list of namespaces

```shell
ip netns list
```

* Try to run some commands inside of containers

```shell
ip netns exec <NAMESPACE_NAME> ip a 
```
