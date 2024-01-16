# Vu-SoftwareContainerization
## Procedures to deploy this project
*NB: Unless specified, all the commands are executed in the main folder*
### Prerequisites
#### Build the images
Build frontend image: in frontend folder, execute
```
docker buildx build --platform linux/amd64,linux/arm64 -t tjm1999/xm0091-frontend:0.1 . --push
```

Build backend image: in backend folder, execute
```
docker buildx build --platform linux/amd64,linux/arm64 -t tjm1999/xm0091-backend:0.1 . --push
```


### Deployment 
### Step 1. Start a k8s cluster in minikube
```shell
minikube start
```
### Step 2. Mount a volume and Deploy a Mysql Database
This project requires an existing database. In reality, it is normal to have one centralized database seperated from the cloud services.

#### Step 2.1 Create a persistent volume
```shell
kubectl apply -f cluster-configuration/persistent_colume.yaml
```
#### Step 2.2 Create a mysql data
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

### Step3: Generate certificates signed by a self-made certificate authority
All the procedures in this step happens in cert/ folder
#### Step3.1 generate a self-made ca
```
openssl genrsa -out ca.key 2048
openssl req -new -key ca.key -out ca.csr
echo "subjectAltName=DNS:vegan.test,IP:127.0.0.1" > cert_extensions
openssl x509 -req -days 36500 -in ca.csr -signkey ca.key -extfile cert_extensions -out ca.crt
```

### Step2 Use OpenSSL to generate a self-made certificate 
```
openssl genrsa  -out server.key 2048 
openssl req -new -key server.key -out server.csr
openssl x509 -req -CA ca.crt -CAkey ca.key -CAcreateserial \
    -sha256 -days 3650 -extfile cert_extensions -in server.csr -out server.crt
```

Now we can see the server's key: server.key and the certificate: server.csr.
They will be encoded into base64 format and stored in the secret, which will be mounted on the ingress.
### Step4 Start the ingress controller
install the nginx ingress
```
minikube addons enable ingress 
```

create the tunnel to expose the ingress's endpoint
```
minikube tunnel 
```






