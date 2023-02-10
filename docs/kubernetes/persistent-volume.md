---
sidebar_position: 9
---

# Create Persistent Volume

Learn how to use `PersistentVolume` with NFS as a backend

## Deploy and configure NFS server

Install NFS server on **cp1**:

```shell
sudo apt-get install -y nfs-kernel-server
```

Create NFS export directory and set proper perimissions on **cp1**:

```shell
sudo mkdir /srv/share
sudo chmod 1777 /srv/share
echo "Hello World Simple Website" > /srv/share/index.html
```

Export NFS directory to Kubernetes cluster nodes on **cp1**:

```shell
sudo vim /etc/exports
/srv/share/ *(rw,sync,no_root_squash,subtree_check)
```

On **cp1** trigger volume export to worker nodes:

```shell
sudo exportfs -ra
```

On **all*** Kubernetes nodes install `nfs-common` package:

```shell
for SRV in cp{1,2,3} worker{1,2,3} ; do
ssh root@$SRV apt-get install nfs-common -y
done
```

Check if nodes can connect to shares:

```shell
for SRV in cp{1,2,3} worker{1,2,3}; do
ssh root@$SRV showmount -e k8scp
done
```

Prepare PersistentVolume YAML manifest:

```yaml title="pv-nfs.yaml"
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-nfs
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteMany
  persistentVolumeReclaimPolicy: Retain
  nfs:
    path: /srv/share
    server: k8scp
    readOnly: false
```

Apply PersistentVolume YAML manifest:

```shell
kubectl apply -f pv-nfs.yaml
```

Check list PersistentVolumes in the cluster:

```shell
kubectl get pv
```

Create new Namespace for service:

```shell
kubectl create namespace webapp
```

To use PersisentVolume it is required create PersistentVolumeClaim YAML manifest:

```yaml title="pvc-nfs.yaml"
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc-nfs
  namespace: webapp
spec:
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 1Gi
```

Apply PersistentVolumeClaim manifest:

```shell
kubectl apply -f pvc-nfs.yaml
```

Get list of PersistentVolumeClaims:

```shell
kubectl get pvc -n webapp
```

Let's create new applica which will use the PVC:


```yaml title="deploy-webapp-nfs.yaml"
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: webapp-nfs
  name: webapp
  namespace: webapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: webapp-nfs
  template:
    metadata:
      labels:
        app: webapp-nfs
    spec:
      containers:
      - image: nginx:1.23.2
        name: nginx
        volumeMounts:
          - mountPath: "/usr/share/nginx/html"
            name: vol-nfs
      volumes:
        - name: vol-nfs
          persistentVolumeClaim:
            claimName: pvc-nfs
```

Deploy web application with nfs volume mounted:

```shell
kubectl apply -f deploy-webapp-nfs.yaml
```

Check Deployment status:

```shell
kubectl get deploy,rs,pods -n webapp
```

Verify PersistentVolume and PersisentVolumeClaim:

```shell
kubectl get pvc,pv -n webapp
```

Get Events messages from Namespace:

```shell
kubectl get events --sort-by='.lastTimestamp' -n webapp
```

Get pod description:

```shell
kubectl describe pod -n webapp webapp-nfs-<Tab>
```

Open port tunnel to any Pod instance from webapp Deployment:

```shell
kubectl port-forward -n webapp pod/webapp-<Tab> 8080:80 &
```

Check webapp response on localhost:

```shell
curl http://1270.0.0.1:8080
```

To cleanup remove `webapp` Namespace:

```shell
kubectl delete namespace webapp
```
