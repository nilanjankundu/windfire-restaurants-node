oc project windfire
kubectl create secret docker-registry dockerhub-secret \
                    --docker-server=https://index.docker.io/v1/ \
                    --docker-username=robipozzi \
                    --docker-password=Heron72a \
                    --docker-email=r.robipozzi@gmail.com
kubectl apply -f tekton-serviceaccount.yaml
kubectl apply -f nodejs-pipeline.yaml

tkn task describe build-push-image
tkn task describe deploy-image