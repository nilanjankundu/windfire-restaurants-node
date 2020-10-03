FROM registry.access.redhat.com/ubi8/nodejs-12
LABEL author="Roberto Pozzi"
# Update libs
#RUN yum update \ 
#	&& yum -y upgrade \ 
#	&& yum -y autoclean \ 
#	&& yum -y autoremove  
#	&& rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
WORKDIR "/app"
# Copy application source files
COPY app/ /app/
# Install app dependencies
RUN cd /app; npm install; npm prune --production
EXPOSE 8082
CMD ["npm", "start"]
