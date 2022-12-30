FROM ubuntu:14.04.3

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# make sure apt is up to date



RUN apt-get update --fix-missing
RUN apt-get install dialog apt-utils -y
RUN apt-get install -y curl
# BUILD TOOLS
RUN apt-get install -y build-essential libssl-dev
RUN apt-get install -y build-essential python2.7
# 
RUN apt-get install apt-transport-https ca-certificates
# RUN apt-get install -y memcached && service memcached restart

# Following installation instructions from http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/
#RUN sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10 \
#  && echo "deb http://downloads-distro.mongodb.org/repo/debian-sysvinit dist 10gen" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list 


ENV NVM_DIR /usr/local/nvm
RUN mkdir /usr/local/nvm
ENV NODE_VERSION 10.23.3

# Install nvm with node and npm
RUN curl https://raw.githubusercontent.com/creationix/nvm/v0.30.1/install.sh | bash \
    && source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

RUN mkdir /usr/app
RUN mkdir /usr/app/log

WORKDIR /usr/app

# log dir
VOLUME /usr/app/log

# Bundle app source
COPY . /usr/app
# Install app dependencies
#RUN npm install

EXPOSE  3000
CMD ["npm", "start"]
