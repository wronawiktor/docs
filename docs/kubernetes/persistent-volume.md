---
sidebar_position: 9
---

# Create Persistent Volume

Learn how to use `PersistentVolume` with NFS as a backend

## Deploy and configure NFS server

:::note

Pay attention to which commands to execute on the host and which on each VM

:::

Install an NFS server on **cp1**:

```shell
sudo apt-get install -y nfs-kernel-server
```

Create an NFS export directory and set the correct permissions on **cp1**:

```shell
sudo mkdir /srv/share
sudo chmod 1777 /srv/share
echo "Hello World Simple Website" > /srv/share/index.html
```

Export the NFS directory to the Kubernetes cluster nodes on **cp1**:

```shell
sudo vim /etc/exports
/srv/share/ *(rw,sync,no_root_squash,subtree_check)
```

On **cp1**, trigger volume export to worker nodes:

```shell
sudo exportfs -ra
```

Install the `nfs-common` package on **all*** Kubernetes nodes:

```shell
for SRV in cp1 worker{1,2,3}; do
sudo ssh $SRV apt-get install nfs-common -y;
done
```

Check if nodes can connect to shares:

```shell
for SRV in cp1 worker{1,2,3}; do
sudo ssh $SRV showmount -e k8scp;
done
```

<details>
<summary>See expected output </summary>

```console
Export list for k8scp:
/srv/share *
Export list for k8scp:
/srv/share *
Export list for k8scp:
/srv/share *
Export list for k8scp:
/srv/share *
```

</details>

Prepare a YAML manifest for PersistentVolume:

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

Apply the PersistentVolume YAML manifest:

```shell
kubectl apply -f pv-nfs.yaml
```

Check the PersistentVolumes list in the cluster:

```shell
kubectl get pv
```

<details>
<summary>See output </summary>

```console
NAME     CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM   STORAGECLASS   REASON   AGE
pv-nfs   10Gi       RWX            Retain           Available                                   6s
```

</details>

Create a new Namespace for the service:

```shell
kubectl create namespace webapp
```

To use PersistentVolume, it is required to create a PersistentVolumeClaim YAML manifest:

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

Apply the PersistentVolumeClaim manifest:

```shell
kubectl apply -f pvc-nfs.yaml
```

Get the list of PersistentVolumeClaims:

```shell
kubectl get pvc -n webapp
```

<details>
<summary>See output </summary>

```console
NAME      STATUS   VOLUME   CAPACITY   ACCESS MODES   STORAGECLASS   AGE
pvc-nfs   Bound    pv-nfs   10Gi       RWX                           13s
```

</details>

Let's create a new application that will use the PVC:


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

Deploy a web application with an NFS volume mounted:

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

Get Pod description:

```shell
kubectl describe pod -n webapp webapp-<Tab>
```

Open a port tunnel to any Pod instance from the webapp Deployment:

```shell
kubectl port-forward -n webapp pod/webapp-<Tab> 8080:80 &
```

Check the webapp response on localhost:

```shell
curl http://127.0.0.1:8080
```

To cleanup, remove the `webapp` Namespace:

```shell
kubectl delete ns webapp
```
