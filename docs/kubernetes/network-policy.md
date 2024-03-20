---
sidebar_position: 14
---

# Using Network Policy


## Simple Network Policy

Create test Namespace:

```shell
kubectl create namespace test
```

Create an nginx Deployment and expose it via a service:

```shell
kubectl create deployment -n test nginx --image=nginx:1.23 --replicas=3
```

Output:

```
deployment.apps/nginx created
```

Expose the Deployment through a Service called nginx:

```shell
kubectl expose deployment -n test nginx --port=8080 --target-port=80
```

Output:

```
service/nginx exposed
```

The above commands create a Deployment with an nginx Pod and expose the Deployment through a Service named nginx. The nginx Pod and Deployment are found in the default namespace.

```shell
kubectl get svc,pod -n test
```

Output:

```
NAME                        CLUSTER-IP    EXTERNAL-IP   PORT(S)    AGE
service/kubernetes          10.100.0.1    <none>        443/TCP    46m
service/nginx               10.100.0.16   <none>        8080/TCP     33s

NAME                        READY         STATUS        RESTARTS   AGE
pod/nginx-701339712-e0qfq   1/1           Running       0          35s
```

Test the service by accessing it from another Pod
You should be able to access the new nginx service from other Pods. To access the nginx Service from another Pod in the default namespace, start a busybox container:

```shell
kubectl run busybox -n test --rm -ti --image=k8s.gcr.io/busybox -- /bin/sh
```

In your shell, run the following command:

```shell
wget --spider --timeout=1 http://nginx:8080
```

Output:

```
Connecting to nginx:8080 (10.101.252.93:8080)
```

Limit access to the nginx service
To limit the access to the nginx service so that only Pods with the label `access: enabled` can query it, create a NetworkPolicy object as follows:

```yaml title="access-nginx.yaml"
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: access-nginx
spec:
  podSelector:
    matchLabels:
      app: nginx
  ingress:
  - from:
    - podSelector:
        matchLabels:
          access: enabled
```

The name of a NetworkPolicy object must be a valid DNS subdomain name.

Note: NetworkPolicy includes a podSelector which selects the grouping of Pods to which the policy applies. You can see this policy selects Pods with the label app=nginx. The label was automatically added to the Pod in the nginx Deployment. An empty podSelector selects all pods in the namespace.
Assign the policy to the service
Use kubectl to create a NetworkPolicy from the above access-nginx.yaml file:

```shell
kubectl apply -f access-nginx.yaml
```

Output:

```
networkpolicy.networking.k8s.io/access-nginx created
```

Test access to the service when access label is not defined
When you attempt to access the nginx Service from a Pod without the correct labels, the request times out:

```shell
kubectl run busybox -n test --rm -ti --image=k8s.gcr.io/busybox -- /bin/sh
```

In your shell, run the command:

```shell
wget --spider --timeout=1 http://nginx:8080
```

Output:

```
Connecting to nginx (10.100.0.16:80)
wget: download timed out
```

Define access label and test again
You can create a Pod with the correct labels to see that the request is allowed:

```shell
kubectl run busybox -n test --rm -ti --labels="access=enabled" --image=k8s.gcr.io/busybox -- /bin/sh
```

In your shell, run the command:

```shell
wget --spider --timeout=1 http://nginx:8080
```

Output:

```
Connecting to nginx (10.100.0.16:8080)
remote file exists
```

## Advanced Network Policy for guestbook with Redis and PHP


This task is based on documentation [example](https://kubernetes.io/docs/tutorials/stateless-application/guestbook/)


Create guestbook namespace:

```shell
kubectl create namespace guestbook
```

Deny all ingress and egress traffic for namespace `guestbook`:

```yaml title="guestbook-deny-all.yaml"
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: guestbook-deny-all
  namespace: guestbook
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
```

Apply deny all NetworkPolicy:

```shell
kubectl apply -f guestbook-deny-all.yaml
```

Allow DNS traffic for all pods in `guestbook` namespace:

``` yaml title="guestbook-allow-dns.yaml"
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: guestbook-allow-dns
  namespace: guestbook
spec:
  podSelector: {}
  policyTypes:
  - Egress
  egress:
  # allow DNS resolution
  - ports:
    - port: 53
      protocol: UDP
    - port: 53
      protocol: TCP
```

Apply DNS Network Policy rules:

```shell
kubectl apply -f guestbook-allow-dns.yaml
```

Create Redis leader service:

```yaml title="deploy-redis-leader.yaml"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis-leader
  namespace: guestbook
  labels:
    app: redis
    role: leader
    tier: backend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
        role: leader
        tier: backend
    spec:
      containers:
      - name: leader
        image: "redis:6.0.5"
        resources:
          requests:
            cpu: 100m
            memory: 100Mi
        ports:
        - containerPort: 6379
```

Apply readis-leader manifest:

```shell
kubectl apply -f deploy-redis-leader.yaml
```

Verify that Redis leader pod is running:

```shell
kubectl get pods -n guestbook
```

Output:

```
NAME                           READY     STATUS    RESTARTS   AGE
redis-leader-343230949-qfvrq   1/1       Running   0          43s
```

Check logs from Redis leader:

```shell
kubectl logs -n guestbook deployment/redis-leader
```

Output:

```
1:C 15 Jul 2021 14:23:25.535 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
1:C 15 Jul 2021 14:23:25.535 # Redis version=6.0.5, bits=64, commit=00000000, modified=0, pid=1, just started
1:C 15 Jul 2021 14:23:25.535 # Warning: no config file specified, using the default config. In order to specify a config file use redis-server /path/to/redis.conf
1:M 15 Jul 2021 14:23:25.536 * Running mode=standalone, port=6379.
1:M 15 Jul 2021 14:23:25.537 # WARNING: The TCP backlog setting of 511 cannot be enforced because /proc/sys/net/core/somaxconn is set to the lower value of 128.
1:M 15 Jul 2021 14:23:25.537 # Server initialized
1:M 15 Jul 2021 14:23:25.537 # WARNING you have Transparent Huge Pages (THP) support enabled in your kernel. This will create latency and memory usage issues with Redis. To fix this issue run the command 'echo never > /sys/kernel/mm/transparent_hugepage/enabled' as root, and add it to your /etc/rc.local in order to retain the setting after a reboot. Redis must be restarted after THP is disabled.
1:M 15 Jul 2021 14:23:25.537 * Ready to accept connections
```

Expose Redis leader:

```shell
kubectl expose deployment -n guestbook redis-leader --port=6379
```

Verify service:

```shell
kubectl get svc -n guestbook redis-leader
```

Output:

```
NAME           TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
redis-leader   ClusterIP   10.110.99.222   <none>        6379/TCP   20s
```

Define Redis followers:

```yaml title="deploy-redis-follower.yaml"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis-follower
  namespace: guestbook
  labels:
    app: redis
    role: follower
    tier: backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
        role: follower
        tier: backend
    spec:
      containers:
      - name: follower
        image: gcr.io/google_samples/gb-redis-follower:v2
        resources:
          requests:
            cpu: 100m
            memory: 100Mi
        ports:
        - containerPort: 6379
```

Create Redis follower deployment:

```shell
kubectl apply -f deploy-redis-follower.yaml
```

Check logs for Redis follower pods:

```shell
kubectl logs -n guestbook redis-follower-<Tab>
```

Output:

```
10:S 27 Jul 2021 10:15:23.836 * Ready to accept connections
10:S 27 Jul 2021 10:15:23.836 * Connecting to MASTER redis-leader:6379
10:S 27 Jul 2021 10:15:23.843 * MASTER <-> REPLICA sync started
10:S 27 Jul 2021 10:16:24.068 # Timeout connecting to the MASTER...
10:S 27 Jul 2021 10:16:24.068 * Connecting to MASTER redis-leader:6379
10:S 27 Jul 2021 10:16:24.069 * MASTER <-> REPLICA sync started
10:S 27 Jul 2021 10:17:25.313 # Timeout connecting to the MASTER...
```

Wait and look for:

```
# Timeout connecting to the MASTER...
```

Allow traffic from Redis follower to Redis leader:

```yaml title="guestbook-allow-redis-sync.yaml"
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: guestobook-allow-redis-sync
  namespace: guestbook
spec:
  podSelector:
    matchLabels:
      app: redis
      role: leader
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: guestbook
    - podSelector:
        matchLabels:
          app: redis
          role: follower
    ports:
    - protocol: TCP
      port: 6379
```

Check once again logs from Redis followers:

```shell
kubectl logs -n guestbook redis-follower-<Tab>
```

Output:

```
10:S 15 Jul 2021 14:53:07.966 * Connecting to MASTER redis-leader:6379
10:S 15 Jul 2021 14:53:07.970 * MASTER <-> REPLICA sync started
```

Expose Redis follower service:

```shell
kubectl expose deployment -n guestbook redis-follower --port=6379
```

Check list of services:

```shell
kubectl get svc -n guestbook
```

Output:

```
NAME             TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
redis-follower   ClusterIP   10.98.8.13      <none>        6379/TCP   53s
redis-leader     ClusterIP   10.110.99.222   <none>        6379/TCP   49m
```

Define frontend YAML manifest application:

```yaml title="deploy-frontend.yaml"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: guestbook
spec:
  replicas: 3
  selector:
    matchLabels:
        app: guestbook
        tier: frontend
  template:
    metadata:
      labels:
        app: guestbook
        tier: frontend
    spec:
      containers:
      - name: php-redis
        image: gcr.io/google_samples/gb-frontend:v5
        env:
        - name: GET_HOSTS_FROM
          value: "dns"
        resources:
          requests:
            cpu: 100m
            memory: 100Mi
        ports:
        - containerPort: 80
```

Apply YAML deployment:

```shell
kubectl apply -f deploy-frontend.yaml
```

Check pods status for frontend deployment:

```shell
kubectl get pods -l app=guestbook -l tier=frontend -n guestbook
```

Output:

```
NAME                        READY   STATUS    RESTARTS   AGE
frontend-85595f5bf9-2lmnb   1/1     Running   0          7m20s
frontend-85595f5bf9-bv9sx   1/1     Running   0          7m19s
frontend-85595f5bf9-p974r   1/1     Running   0          7m19s
```

Expose frontend application with LoadBalancer:

```shell
kubectl expose deployment -n guestbook frontend --port=80 --type=LoadBalancer
```

Check service:

```shell
kubectl get svc -n guestbook
```

Output:

```
NAME             TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
frontend         LoadBalancer   10.106.92.142   10.168.0.50   80:30547/TCP   7m22s
redis-follower   ClusterIP      10.98.8.13      <none>        6379/TCP       15h
redis-leader     ClusterIP      10.110.99.222   <none>        6379/TCP       16h
```

Use `EXTERNALIP` and try to connect:

```shell
EXTERNALIP=`kubectl get svc -n guestbook frontend -o jsonpath="{.status.loadBalancer.ingress[0].ip}"`
curl --connect-timeout 5 http://$EXTERNALIP
```

Output:

```
curl: (28) Connection timed out after 5001 milliseconds
```

Prepare Network Policy to allow connection to frontend:

```yaml title="allow-frontend.yaml"
kind: NetworkPolicy
apiVersion: networking.k8s.io/v1
metadata:
  name: allow-frontend
  namespace: guestbook
spec:
  podSelector:
    matchLabels:
      app: guestbook
      tier: frontend
  ingress:
  - ports:
    - port: 80
```

Apply frontend NetworkPolicy:

```shell
kubectl apply -f allow-frontend.yaml
```

Use `EXTERNALIP` and try to connect once again:

```shell
EXTERNALIP=`kubectl get svc -n guestbook frontend -o jsonpath="{.status.loadBalancer.ingress[0].ip}"`
curl --connect-timeout 5 http://$EXTERNALIP
```

Output:

```
<html ng-app="redis">
  <head>
    <title>Guestbook</title>
    <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.12/angular.min.js"></script>
    <script src="controllers.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.13.0/ui-bootstrap-tpls.js"></script>
  </head>
  <body ng-controller="RedisCtrl">
    <div style="width: 50%; margin-left: 20px">
      <h2>Guestbook</h2>
    <form>
    <fieldset>
    <input ng-model="msg" placeholder="Messages" class="form-control" type="text" name="input"><br>
    <button type="button" class="btn btn-primary" ng-click="controller.onRedis()">Submit</button>
    </fieldset>
    </form>
    <div>
      <div ng-repeat="msg in messages track by $index">
        {{msg}}
      </div>
    </div>
    </div>
  </body>
</html>
```

Last step is to allow connection from frontend application to redis instances:

```yaml title="allow-frontend-redis.yaml"
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend-redis
  namespace: guestbook
spec:
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: guestbook
    ports:
    - port: 6380
      protocol: TCP
    - port: 6379
      protocol: TCP
  podSelector:
    matchLabels:
      app: redis
  policyTypes:
  - Ingress
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-redis-frontend
  namespace: guestbook
spec:
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: redis
  - ports:
    - port: 6380
      protocol: TCP
    - port: 6379
      protocol: TCP
  podSelector:
    matchLabels:
      app: guestbook
  policyTypes:
  - Egress
```

Apply Network Policy:

```shell
kubectl apply -f allow-frontend-redis.yaml
```

Check connection using Web browser:

```
http://<EXTERNALIP>
```
