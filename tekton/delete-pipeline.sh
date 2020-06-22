oc project windfire
kubectl delete secret dockerhub-secret
kubectl delete -f tekton-serviceaccount.yaml
kubectl delete -f nodejs-pipeline.yaml