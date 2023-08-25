
# Domain name for local development with localdev.me 
I used to reach for the /etc/hosts file when I needed dns for development but when I learned about localdev.me I switched over to using this for local development. localdev.me DNS is served through amazon. The domain name and any subdomains point to 127.0.0.1.

You can see this in action here: https://kubernetes.github.io/ingress-nginx/deploy/ or see ingress.yaml where this is used.

# Build Images and run containers in Docker Compose
docker-compose up --build

# Build Images only
docker-compose build

# Load images from local into kind
```
kind load docker-image samplefrontend && kind load docker-image samplebackend
```

```
minikube image load samplefrontend && minikube image load samplebackend
```

Now go back into minikube context $(minikube docker-env). Do a docker images and you will see
the docker images there.

TODO add docs about image pull policy never/if not present in dockerfile

# Expose ingress-nginx
To configure ingress-nginx there are steps to configure ingress-nginx in another readme. By default k8s has no ingress configured where you must 
pick an ingress and then configure. 

Leave this command running in a terminal
```
kubectl port-forward --namespace=ingress-nginx service/ingress-nginx-controller 80:80
kubectl port-forward --namespace=ingress-nginx service/ingress-nginx-controller 8080:80
```

# Sample Network Design
ingress-nginx

# Enable sample ingress-nginx
Below are steps to implement configuration of samplefrontend, samplebackend ingress configuration 
- samplefrontend `/` path with host `samplefrontend.localdev.me` to samplefrontend service running on port 3000
- samplefrontend path `/api/` to send all requests for `/api/` to samplebackend service running on port 3001
- samplebackend host `samplebackend.localdev.me` with path `/api/` to samplebackend service running on port 3001

We enable this and then access our services can be accessed by their hostname specified within ingress configuration. See ingress.yaml host
- Sample Frontend UI - https://samplefrontend.localdev.me/ <-- TLS/secure port 443

```
kubectl apply -f sample/k8s/local/ingress-nginx/ingress.yaml
```

# Access Sample Frontend
```
Sample Frontend UI - https://samplefrontend.localdev.me/

GET https://samplefrontend.localdev.me/api/users
```

# How do I view the ingress-nginx logs?

## Make a GET request to the api directly
https://samplefrontend.localdev.me/api/users

kubectl logs deploy/ingress-nginx-controller -n ingress-nginx

kubectl krew install ingress-nginx

kubectl ingress-nginx backends -n ingress-nginx

# TLS Termination
todo
- enable TLS in ingress-nginx

# Create/Delete k8s Backend Service/Deployment
```
kubectl apply -f sample/k8s/local/samplebackend/backend.yaml
kubectl delete -f sample/k8s/local/samplebackend/backend.yml
```

# Create/Delete k8s Frontend Service/Deployment
```
kubectl apply -f sample/k8s/local/samplefrontend/frontend.yaml
kubectl delete -f sample/k8s/local/samplefrontend/frontend.yaml
```

# View logs for a deployment
`kubectl logs deploy/samplebackend`
`kubectl logs deploy/samplefrontend`

`kubectl logs deploy/proxy`


# Allow access to Backend Service during Development - Type port-forward

```
kubectl port-forward service/samplebackend 44001:3001
```


# Allow access to Frontend Service during Development - Type port-forward
```
kubectl port-forward service/samplefrontend 44002:3000
```

# Troubleshooting
When I access the proxy server I get 502 bad gateway? How do I troubleshoot this?
- check the logs in nginx proxy to see what the logs are saying `kubectl logs deploy/proxy`
- Next see if the you can directly access the service. So if its the api then access
one of the api endpoints but first you need to setup port-forward as there is no
access to the api

# shell into a pod
kubectl exec --stdin --tty shell-demo -- /bin/bash

# Enable Traefik Dashboard with Port Forward to Traefik 
 kubectl port-forward pod/traefik-77f8d8ff7-dvq7c 9001:9000

# Access Traefik Dashboard
http://localhost:9001/dashboard/#/


kubectl apply -f infrastructure/sample/k8s/local/samplefrontend/
kubectl apply -f infrastructure/sample/k8s/local/samplebackend/

# Review the svc 
kubectl get svc

# Make sure its running on the port you want

# Test samplefrontend-service to make sure the container/pod is working properly
kubectl port-forward service/samplefrontend-service 40000:4000

kubectl port-forward service/samplefrontend-service 30000:3000

# Enable Traefik Ingress
kubectl apply -f infrastructure/sample/k8s/local/sampletraefik/ingress-samplefrontend.yaml
kubectl delete -f infrastructure/sample/k8s/local/sampletraefik/ingress-samplefrontend.yaml

kubectl apply -f infrastructure/sample/k8s/local/sampletraefik/ingress-samplebackend.yaml


Kong ingress
https://minikube.sigs.k8s.io/docs/handbook/addons/kong-ingress/

In powershell minikube service -n kong kong-proxy --url
Take the first value and go to a bash window
export PROXY_IP=http://127.0.0.1:57585
curl -i $PROXY_IP you should get no route matched those values

HOST=$(kubectl get svc --namespace default kong-1691796151-kong-proxy -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
PORT=$(kubectl get svc --namespace default kong-1691796151-kong-proxy -o jsonpath='{.spec.ports[0].port}')
export PROXY_IP=${HOST}:${PORT}
curl $PROXY_IP

Part of what we need to do to enable kong admin api
kubectl port-forward deployment/ingress-kong -n kong 8444:8444