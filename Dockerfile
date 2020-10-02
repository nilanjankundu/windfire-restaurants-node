FROM registry.access.redhat.com/openshift3/node 
LABEL author="Roberto Pozzi"
# Update libs
#RUN apt-get update \ 
#	&& apt-get -y upgrade \ 
#	&& apt-get -y autoclean \ 
#	&& apt-get -y autoremove \ 
#	&& rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
WORKDIR "/app"
# Copy application source files
COPY app/ /app/
# Install app dependencies
RUN cd /app; npm install; npm prune --production
EXPOSE 8082
CMD ["npm", "start"]
