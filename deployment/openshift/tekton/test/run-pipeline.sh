oc project windfire
#tkn pipeline start build-and-deploy -r git-repo=windfire-restaurants-node-git -r image=windfire-restaurants-node-image -p deployment-name=test -p IMAGE=image-registry.openshift-image-registry.svc:5000/windfire/windfire-restaurants-node:2.0
#tkn pipeline start build-and-deploy -p deployment-name=test -p git-url=https://github.com/robipozzi/windfire-restaurants-node -p IMAGE=image-registry.openshift-image-registry.svc:5000/windfire/windfire-restaurants-node:2.0
oc create -f windfire-restaurants-backend-pipelinerun.yaml