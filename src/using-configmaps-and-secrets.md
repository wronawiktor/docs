# Lab Exercises for ConfigMaps and Secrets

## Exercise 0 - [Create ConfigMaps from files](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-files)

Create the local directory

```shell
mkdir -p configure-pod-container/configmap/
```

Download the sample files into `configure-pod-container/configmap/` directory

```shell
wget https://kubernetes.io/examples/configmap/game.properties -O configure-pod-container/configmap/game.properties
wget https://kubernetes.io/examples/configmap/ui.properties -O configure-pod-container/configmap/ui.properties
```

You can use kubectl create configmap to create a ConfigMap from an individual file, or from multiple files.

```shell
kubectl create configmap game-config --from-file=configure-pod-container/configmap/game.properties
```

Check new ConfigMap properties

```shell
kubectl describe configmaps game-config
```

You can pass in the `--from-file` argument multiple times to create a ConfigMap from multiple data sources.

```shell
kubectl create configmap game-config-multi --from-file=configure-pod-container/configmap/game.properties --from-file=configure-pod-container/configmap/ui.properties
```

You can display details of the game-config-multi ConfigMap using the following command:

```shell
kubectl describe configmaps game-config-multi
```

You can use kubectl create configmap with the `--from-literal` argument to define a literal value from the command line:

```shell
kubectl create configmap special-config --from-literal=special.how=very --from-literal=special.type=charm
```

You can pass in multiple key-value pairs. Each pair provided on the command line is represented as a separate entry in the data section of the ConfigMap.

```shell
kubectl get configmaps special-config -o yaml
```

## Exercise 1 - [Define container environment variables using ConfigMap data](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#define-a-container-environment-variable-with-data-from-a-single-configmap)

Define an environment variable as a key-value pair in a ConfigMap:

```shell
kubectl create configmap special-config --from-literal=special.how=very
```

Assign the special.how value defined in the ConfigMap to the SPECIAL_LEVEL_KEY environment variable in the Pod specification.

```
apiVersion: v1
kind: Pod
metadata:
  name: dapi-test-pod
spec:
  containers:
    - name: test-container
      image: k8s.gcr.io/busybox
      command: [ "/bin/sh", "-c", "env" ]
      env:
        # Define the environment variable
        - name: SPECIAL_LEVEL_KEY
          valueFrom:
            configMapKeyRef:
              # The ConfigMap containing the value you want to assign to SPECIAL_LEVEL_KEY
              name: special-config
              # Specify the key associated with the value
              key: special.how
  restartPolicy: Never
```

Create the Pod:

```shell
kubectl create -f https://kubernetes.io/examples/pods/pod-single-configmap-env-variable.yaml
```

Now, the Pod's output includes environment variable `SPECIAL_LEVEL_KEY=very`


## Exercise 2 - Create Secret object

* Create a secret named mysecret that has the following key=value pair
```
dbusername = MyDatabaseUser
dbpassword = MyDatabasePassword
```

```shell
kubectl create secret generic mysecret --from-literal=dbusername="MyDatabaseUser" --from-literal=dbpassword="MyDatabasePassword"
```

* Create a pod of your choice, such as nginx. Configure this Pod so that the underlying container has the the following environment variables set:

DBUSER from secret key dbusername
DBPASS from secret key dbpassword

```shell
apiVersion: v1
kind: Pod
metadata:
  name: nginx-secret
spec:
  containers:
  - name: nginx-secret
    image: nginx
    command: [ "/bin/sh", "-c", "env" ]
    env:
      - name: dbuser
        valueFrom:
          secretKeyRef:
            name: mysecret
            key: dbuser
      - name: dbpassword
        valueFrom:
          secretKeyRef:
            name: mysecret
            key: dbpassword
  restartPolicy: Never
``` 

Validate configuration with:

```shell
kubectl logs nginx-secret | grep db
```

Output should be:

```
dbuser=MyDatabaseUsername
dbpassword=MyDatabasePassword
```


