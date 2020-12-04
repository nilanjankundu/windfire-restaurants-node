oc project windfire
#oc create -f windfire-resources.yaml
oc create -f windfire-restaurants-backend-pipeline.yaml

tkn pipeline list
#tkn task describe build-push-image
#tkn task describe deploy-image