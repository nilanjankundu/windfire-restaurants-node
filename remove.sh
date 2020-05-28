oc project default
kubectl delete secret docker-registry-cred
kubectl delete -f tekton-serviceaccount.yaml
kubectl delete -f docker-build-and-push.yaml