FROM registry.access.redhat.com/ubi8/nodejs-12
LABEL author="Roberto Pozzi"
ENV WORKING_DIR="/opt/app-root/src"
# Copy application source files
COPY app/ $WORKING_DIR
# Install app dependencies
RUN cd $WORKING_DIR; npm install; npm prune --production
WORKDIR $WORKING_DIR
USER 1001
EXPOSE 8082
CMD ["npm", "start"]