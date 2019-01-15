# The instruction below defines what image we want to build FROM

FROM node:7

# RUN is the Docker instruction for command execution during the image creation. 
# Create the directory for the server app
# and define the working directory

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# COPY the package.json to the working directory
# and install the npm packages

COPY package.json /usr/src/app
RUN npm install

# COPY all the other files

COPY . /usr/src/app

# EXPOSE the server port to the host

EXPOSE 8080

# Then define the CMD to be executed when running the image

CMD ["npm", "start"]
