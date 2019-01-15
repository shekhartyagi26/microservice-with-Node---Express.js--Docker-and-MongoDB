# How to create a microservice with Node + Express.js, Docker and MongoDB

This example contains a simplified version of a `Product` object `CRUD` running on a Node + Express.js API server. 

For development and testing purpose the repository is `ForeRunnerDB`.

The `Dockerfile` defines the instructions for building the server image and its process is documented step by step. Open it to read all the commands.

## Dockerizing the microservice
### A brief introduction to the Docker platform

After installing Docker, a new host's network stack is created with the name `docker0`. 
Using the command `ifconfig` you find it among the others current network interfaces.

On the next bash lines you can see the assigned IP address `172.17.0.1` to the `docker0` network.

```
docker0   Link encap:Ethernet  HWaddr 02:42:40:0e:9d:2d  
          inet addr:172.17.0.1  Bcast:0.0.0.0  Mask:255.255.0.0
          inet6 addr: fe80::42:40ff:fe0e:9d2d/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:1701 errors:0 dropped:0 overruns:0 frame:0
          TX packets:1801 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:0 
          RX bytes:345486 (345.4 KB)  TX bytes:279213 (279.2 KB)
```

Containers are connected by default using this interface called `bridge` and can communicate with each other using their IP addresses.

In order to connect two containers the Docker `run` command has the `--link` option.

Your application and their databases can then be decoupled and managed in two different Docker containers.

For this example the app container image will be generated from a `node 7` image and the database container will be created directly from a `mongo 3.4` image. 

First of all download the images for mongo and node with the following two commands:  

```
sudo docker pull mongo:3.4
sudo docker pull node:7
```

After downloading them, use the command below if you want to watch their informations:

```
sudo docker images
```

For mongo you just need to create an instance of the downloaded image.
Using the Docker `run` command you can start it:

```
sudo docker run -d -p 28018:27017 --name MongoDB mongo:3.4
```

The `-d` option daemonizes the container process which has the `MongoDB` name. The exposed port `27017` will be explicitly mapped to the host `28018` port.  

Now it's time to use the `Dockerfile` to build the server image. From the server folder then give the following command:

```
sudo docker build -t claclacla/microservice .
```

After building, you can run a daemonized claclacla/microservice container using the `-d` option with the name `Microservice`. Map the exposed port `8080` to the host port `4000` and finally connect it to the mongo container with the `--link` option. 

```
sudo docker run -d -p 4000:8080 --link=MongoDB:MongoDB --name Microservice claclacla/microservice
```

If you want to watch the result of these commands, connect to the running container in interactive mode using the command below: 

```
sudo docker exec -it Microservice /bin/bash
```

Read the container hosts file with the next command:

```
cat /etc/hosts
```

You should have an output similar to the following:

```
127.0.0.1	localhost
::1	localhost ip6-localhost ip6-loopback
fe00::0	ip6-localnet
ff00::0	ip6-mcastprefix
ff02::1	ip6-allnodes
ff02::2	ip6-allrouters
172.17.0.2	MongoDB e2eb0c886f9e
172.17.0.4	d2954b3fa17c
```

Note the MongoDB mapped address.

During the containers linking Docker also creates environment variables.
With the command below:

```
env | grep MONGODB
```

You should find the following two defined variables:

```
MONGODB_PORT_27017_TCP_PORT=27017
MONGODB_PORT_27017_TCP_ADDR=172.17.0.2
```

--------------------------------------------------------------------------------

### Prerequisites

What things you need to install the software

```
Docker 17.0+
```

--------------------------------------------------------------------------------

### Installing

The easiest way to get started is to clone the repository.

```
# Get the latest snapshot
git clone https://github.com/shekhartyagi26/microservice-with-Node---Express.js--Docker-and-MongoDB.git

# Change directory
cd microservice-with-Node---Express.js--Docker-and-MongoDB

# Install NPM dependencies
npm i

# Download mongo and node images
sudo docker pull mongo:3.4
sudo docker pull node:7

# Run a mongo container
sudo docker run -d -p 28018:27017 --name MongoDB mongo:3.4

# Build a server image
sudo docker build -t claclacla/microservice .

# Run a server container
sudo docker run -d -p 4000:8080 --link=MongoDB:MongoDB --name Microservice claclacla/microservice
```

--------------------------------------------------------------------------------

### Usage

```
# Change directory
cd How-to-create-a-microservice-with-Node-+-Express.js,-Docker-and-MongoDB

# Test it using...

npm run e2e-test
# ...to test the collections API
```

## Acknowledgments

- [Docker container networking](https://docs.docker.com/engine/userguide/networking/)

- [Dockerizing a Node.js web app](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)