oc project windfire
kubectl delete -f nodejs-pipeline-run.yaml
# Also delete OpenShift objects related to windfire-restaurant-node application created by the pipeline
oc delete route windfire-restaurants-node
oc delete svc windfire-restaurants-node
oc delete imagestream windfire-restaurants-node
oc delete deployment windfire-restaurants-node