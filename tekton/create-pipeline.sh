oc project windfire
kubectl apply -f tekton-serviceaccount.yaml
kubectl apply -f nodejs-pipeline.yaml

tkn task describe build-push-image
tkn task describe deploy-image