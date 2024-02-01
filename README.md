# Vu-SoftwareContainerization
## 1.Illustration of the project structure
T.B.D

## 2.Procedures to deploy this project
*NB: Unless specified, all the commands are executed in the main folder*
### 2.1 Prerequisites
#### Build the images
Build frontend image: in frontend folder, execute
```
docker buildx build --platform linux/amd64,linux/arm64 -t tjm1999/xm0091-frontend:0.1 . --push
```

Build backend image: in backend folder, execute
```
docker buildx build --platform linux/amd64,linux/arm64 -t tjm1999/xm0091-backend:0.1 . --push
```

### 2.2 Deployment 
### Step 1. Start a k8s cluster in minikube
```shell
minikube start
```
### Step 2. Mount a volume and Deploy a Mysql Database
This project requires an existing database. In reality, it is normal to have one centralized database seperated from the cloud services.

#### Step 2.1 Create a persistent volume
```shell
kubectl apply -f cluster-configuration/persistent_volume.yaml
```
#### Step 2.2 Create a mysql database
- cluster-configuration/mysql/config_map.yaml is the ConfigMap resource which specified the mysqld configuration file, and will be mounted to the container.
- cluster-configuration/mysql/pvc.yaml is a PersistentVolumeClain resource which apply a persistent volume for the database.
- cluster-configuration/mysql/secret.yaml contains the mysql account and password. The default username is `root`, and the password is `123456`. 
- mysql.yaml contains the Deployment and Service.

```shell
 kubectl apply -f cluster-configuration/mysql/config_map.yaml \
    -f cluster-configuration/mysql/secret.yaml \
    -f  cluster-configuration/mysql/pvc.yaml  \
    -f cluster-configuration/mysql/mysql.yaml \
```

After that, connect to this DB and create a database called 'vegan'.

```
kubectl get pods
```
Get the name of mysql pod.
```
kubectl exec -it <mysql-pod-name> -- /bin/bash

```
Enter mysql pod


```
mysql -u root -p
```
Enter the password


```
CREATE DATABASE vegan;
```
Execute this command to build a database named vegan

```
exit;
```
Exit MySQL client

```
exit
```
Exit the pod


### Step3 Create users for the k8s cluster

First, we are going to create a user called 'viewer' as an example illustrating what command we used in this assignment. In the helm charts, this user will be mounted with the role "viewer".

*All the commands in this step should be executed in the cluster-configuration/auth*


```
openssl genrsa -out myuser.key 2048
openssl req -new -key viewer.key -out viewer.csr -subj "/CN=viewer"
cat viewer.csr | base64 | tr -d "\n"
```
Then put the base64 encoded csr into the spec.request field of the viewer_csr.yaml
```
kubectl apply -f viewer_csr.yaml  
```

Then sign the request in the k8s cluster and export the certificate.
```
kubectl  certificate approve viewer 
kubectl get csr viewer -o jsonpath='{.status.certificate}'| base64 -d > viewer.crt                              
```

Finally create the context for this user in KUBECONFIG
```
 kubectl config set-credentials viewer --client-key=viewer.key --client-certificate=viewer.crt --embed-certs=true

 kubectl config set-context viewer --cluster=minikube --user=viewer # set the cluster name accordingly

```

### Step4: Generate certificates signed by a self-made certificate authority
All the procedures in this step happens in cert/ folder
#### Step4.1 generate a self-made ca
```
openssl genrsa -out ca.key 2048
openssl req -new -key ca.key -out ca.csr
echo "subjectAltName=DNS:vegan.test,IP:127.0.0.1" > cert_extensions
openssl x509 -req -days 36500 -in ca.csr -signkey ca.key -extfile cert_extensions -out ca.crt
```

### Step4.2 Use OpenSSL to generate a self-made certificate 
```
openssl genrsa  -out server.key 2048 
openssl req -new -key server.key -out server.csr
openssl x509 -req -CA ca.crt -CAkey ca.key -CAcreateserial \
    -sha256 -days 3650 -extfile cert_extensions -in server.csr -out server.crt
```

Now we can see the server's key: server.key and the certificate: server.csr.
They will be encoded into base64 format and stored in the secret, which will be mounted on the ingress.
### Step4.3 Start the ingress controller
install the nginx ingress addons
```
minikube addons enable ingress 
```

When we want to visit this ingress later, we need tocreate the tunnel to expose the ingress's endpoint
```
minikube tunnel 
```

### Step 5: Use Helm to install
The helm chart is in helm/vegan.
- Execute `helm install vegan helm/vegan` to directly install it
- Execute `helm uninstall vegan` to directly uninstall it
- Modify values in values.yaml and then execute `helm upgrade vegan helm/vegan` to upgrade is. (You may want to set autoscaling.enabled=true in values.yaml)
- Execute `helm template vegan ./helm/vegan  --debug   > test.yaml` to see the k8s config rendered by helm

## 3. Security
### 3.1 Network policies
Please check helm/vegan/templates/network_policy_allowall.yaml, helm/vegan/templates/network_policy_blacklist.yaml, helm/vegan/templates/deny_all.yaml and helm/vegan/templates/white_list.yaml

### 3.2 RBAC
Please check helm/vegan/templates/roles.yaml and helm/vegan/templates/rolebinding.yaml.


## 4. GCP 
Deploy to GCP is quite similar to local deployment. Connect to Google Cloud Shell terminal and git pull this repository, then execute everything above except commands related to  minikube. 



