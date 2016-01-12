FROM node:4-onbuild

WORKDIR /home/app

RUN apt-get update -y
RUN apt-get install -y mercurial
RUN apt-get install -y git
RUN apt-get install -y python
RUN apt-get install -y curl
RUN apt-get install -y vim
RUN apt-get install -y strace
RUN apt-get install -y diffstat
RUN apt-get install -y pkg-config
RUN apt-get install -y cmake
RUN apt-get install -y build-essential
RUN apt-get install -y tcpdump
RUN apt-get install -y screen

RUN npm install -g grunt-cli  
RUN npm install -g bower
RUN npm install

ADD . /home/app

RUN npm install
RUN bower install --config.interactive=false --allow-root
# Install Mean.JS Prerequisites


# replace this with your application's default port
EXPOSE 8080
EXPOSE 27017

CMD ["grunt"]