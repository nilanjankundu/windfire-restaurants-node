oc project default
kubectl delete secret docker-registry-cred
kubectl delete -f tekton-serviceaccount.yaml
kubectl delete -f tekton-deploy.yaml