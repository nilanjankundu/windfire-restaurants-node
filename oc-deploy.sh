oc project windfire

kubectl create secret docker-registry docker-registry-cred \
                    --docker-server=https://index.docker.io/v1/ \
                    --docker-username=robipozzi \
                    --docker-password=Heron72a \
                    --docker-email=r.robipozzi@gmail.com

kubectl apply -f tekton-serviceaccount.yaml

kubectl apply -f tekton-deploy.yaml

tkn task describe build-docker-image-from-git-source
tkn taskrun describe build-docker-image-from-git-source-task-run
tkn taskrun logs build-docker-image-from-git-source-task-run