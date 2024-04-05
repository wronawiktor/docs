---
sidebar_position: 11
---

# Security concept

Learn the basics of Kubernetes security

## Understand client certificates

View **KUBECONFIG** for `Kubernetes-admin` user:

```shell
kubectl config view
```

Get `client-certificate-data` from `./kube/config` file and decode it with `base64`:

```shell
awk '/client-certificate-data/ {print $2}' $HOME/.kube/config | base64 -d
```

Now we can check client certificate details using **OpenSSL**:

```shell
awk '/client-certificate-data/ {print $2}' $HOME/.kube/config | base64 -d | openssl x509 -noout -text
```

Output:

```console
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number: 1752237598914016353 (0x185132cffd5a7461)
        Signature Algorithm: sha256WithRSAEncryption
        Issuer: CN = kubernetes
        Validity
            Not Before: Feb 27 17:38:48 2023 GMT
            Not After : Feb 27 17:38:51 2024 GMT
        Subject: O = system:masters, CN = kubernetes-admin
        ...
```

Organization / O field in Subject `O = system:masters` is Kubernetes Group name.
Common Name / CN field in Subject `CN = kubernetes-admin` is Kubernetes User name.

Now we can look on Kubernetes configuration of the ClusterRoleBinding or just RoleBinding with our User or Group Name:

```shell
kubectl get clusterrolebindings.rbac.authorization.k8s.io -o yaml | grep kubernetes-admin
kubectl get clusterrolebindings.rbac.authorization.k8s.io -o yaml | grep system:masters
```

At least for `system:masters`, there must be some findings. Open the details of ClusterRoleBindings with `less`:

```shell
kubectl get clusterrolebindings.rbac.authorization.k8s.io -o yaml | less
```

View details for `cluster-admin` ClusterRoleBinding name:

```shell
kubectl get clusterrolebindings.rbac.authorization.k8s.io cluster-admin -o yaml
```

Output:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  labels:
    kubernetes.io/bootstrapping: rbac-defaults
  name: cluster-admin
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: Group
  name: system:masters
```

Now we can look at the ClusterRole which was assigned to the group `system: masters`:

```shell
kubectl get clusterrole cluster-admin -o yaml
```

Output:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  annotations:
    rbac.authorization.kubernetes.io/autoupdate: "true"
  labels:
    kubernetes.io/bootstrapping: rbac-defaults
  name: cluster-admin
rules:
- apiGroups:
  - '*'
  resources:
  - '*'
  verbs:
  - '*'
- nonResourceURLs:
  - '*'
  verbs:
  - '*'
```


## Create ServiceAccount and RBAC role


Create a new Namespace:

```shell
kubectl create ns webapp
```

Create a new ServiceAccount in this Namespace:

```shell
kubectl create serviceaccount -n webapp webapp
```

Check permission for `webapp` ServiceAccount:

```shell
kubectl auth can-i -n webapp --as=system:serviceaccount:webapp:webapp get pods
```

Output:

```console
no
```

```shell
kubectl auth can-i -n webapp --as=system:serviceaccount:webapp:webapp delete pods
```

Output:
```console
no
```

Let's create a new Role with basic permissions for Pods:

```yaml title="role-webapp.yaml"
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: webapp
  namespace: webapp
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["list", "get", "watch"]
```

Apply the manifest with configuration:

```shell
kubectl apply -f role-webapp.yaml
```

Assign `webapp` Role to `webapp` ServiceAccount:

```shell
kubectl create rolebinding -n webapp webapp --role=webapp --serviceaccount=webapp:webapp --dry-run=client -o yaml > rolebinding-webapp.yaml
```

This RoleBinding should looks like:

```yaml title="rolebinding-webapp.yaml"
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  creationTimestamp: null
  name: webapp
  namespace: webapp
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: webapp
subjects:
- kind: ServiceAccount
  name: webapp
  namespace: webapp
```

Apply this RoleBinding configuration:

```shell
kubectl apply -f rolebinding-webapp.yaml
```

Let's test again privileges for `webapp` ServiceAccount:

```shell
kubectl auth can-i -n webapp --as=system:serviceaccount:webapp:webapp get pods
```

Output:

```console
yes
```

```shell
kubectl auth can-i -n webapp --as=system:serviceaccount:webapp:webapp watch pods
```

Output:

```console
yes
```

```shell
kubectl auth can-i -n webapp --as=system:serviceaccount:webapp:webapp create pods
```

Output:

```console
no
```

Create application Deployment with ServiceAccount:

```yaml title="deploy-webapp.yaml"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: webapp
  namespace: webapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: webapp
  template:
    metadata:
      labels:
        app: webapp
    spec:
      serviceAccount: webapp
      containers:
      - image: nginx:1.23.0-alpine
        name: nginx
```

Apply the `deploy-webapp.yaml` manifest:

```shell
kubectl apply -f deploy-webapp.yaml
```

Check the statuses of Deployment, ReplicaSet, and Pods:

```shell
kubectl get deploy,rs,pods -n webapp
```

Open a terminal session to any `webaapp` Pod instance:

```shell
kubectl exec -n webapp -ti webapp-<Tab> -- sh
```

In the opened terminal, execute the following commands:

```shell
# List /var/run/secrets/kubernetes.io/serviceaccount directory
ls /var/run/secrets/kubernetes.io/serviceaccount
# Point to the internal API server hostname
APISERVER=https://kubernetes.default.svc
# Path to ServiceAccount token
SERVICEACCOUNT=/var/run/secrets/kubernetes.io/serviceaccount
# Read this Pod's namespace
NAMESPACE=$(cat ${SERVICEACCOUNT}/namespace)
# Read the ServiceAccount bearer token
TOKEN=$(cat ${SERVICEACCOUNT}/token)
# Reference the internal certificate authority (CA)
CACERT=${SERVICEACCOUNT}/ca.crt

curl --cacert ${CACERT} --header "Authorization: Bearer ${TOKEN}" -X GET ${APISERVER}/api/v1/namespaces/webapp/pods
```

To clean up, remove the `webapp` namespace:

```shell
kubectl delete ns webapp
```
