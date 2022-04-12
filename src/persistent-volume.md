# Lab Exercises for Persistent volume

## Exercise 0 - Create Persistent NFS Volume

* Deploy and configure NFS server 

```shell
sudo apt-get install -y nfs-kernel-server
```

* Create NFS export directory and set proper perimissions

```shell
sudo mkdir /srv/share
sudo chmod 1777 /srv/share
echo "Hello World" > /srv/share/index.html
```

* Export NFS directory to Kubernetes cluster nodes

```shell
sudo vim /etc/exports
/srv/share/ *(rw,sync,no_root_squash,subtree_check)
```

* Check /etc/exports

```shell
sudo exportfs -ra
```

* On all Kubernetes nodes install `nfs-common` package

```shell
for SRV in master1 master2 master3 worker1 worker2; do
ssh root@$SRV apt-get install nfs-common -y
done
```

* Check if nodes see shares

```shell
for SRV in master1 master2 master3 worker1 worker2; do
ssh root@$SRV showmount -e 10.168.0.1
done
```

* Prepare PersistentVolume YAML manifest

```shell
cat > pv-nfs.yaml <<EOF
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
    server: 10.168.0.1
    readOnly: false
EOF
```

* Apply PersistentVolume YAML manifest

```shell
kubectl apply -f pv-nfs.yaml
```

* Check list PersistentVolumes

```shell
kubectl get pv
```

* To use PersisentVolume it is required create Persistent Volume Claim YAML manifest

```shell
cat > pvc-nfs.yaml <<EOF
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc-nfs
spec:
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 1Gi
EOF
```

* Apply Persistent Volume Claim 

```shell
kubectl apply -f pvc-nfs.yaml
```

* Get list of Persistent Volume Claims

```shell
kubectl get pvc
```

* Let's create new pod which will use the PVC

```
cat > app-nfs.yaml <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: app-nfs
  name: app-nfs
spec:
  replicas: 1
  selector:
    matchLabels:
      app: app-nfs
  template:
    metadata:
      labels:
        app: app-nfs
    spec:
      containers:
      - image: registry.k8s:5000/nginx
        name: nginx
        volumeMounts:
          - mountPath: "/usr/share/nginx/html"
            name: vol-nfs
      volumes:
        - name: vol-nfs
          persistentVolumeClaim:
            claimName: pvc-nfs
```

* Start application with nfs volume mounted

```shell
kubectl apply -f app-nfs.yaml
```

* Check pod status

```shell
kubectl get pods
```

* Verify PersistentVolume and PersisentVolumeClaim

```shell
kubectl get pvc,pv
```

* Get pod description 

```shell
kubectl describe pod app-nfs-<Tab>
```

* Check application response

```shell
curl http://POD_IP
```
