# predix-edge-opcua-simulator

The OPC simulator is mainly used by Demo Apps to create a flow of OPCUA data that a OPCUA Client can subscribe to.
It is typically used in the context of multi-container application.  

See the Edge Reference App for an example of how it used in a docker-compose.yml file.

https://github.com/PredixDev/predix-edge-ref-app/blob/master/docker-compose.yml


## Config

In the config directory is the config file. There are 3 simulation types

```bash
[
    {"browseName": "Simulator.Device1.FLOAT1", "frequency": 10, "random": {"dataType": "Double", "min": 0, "max": 0.5, "precision": 4}},
    {"browseName": "Simulator.Device1.FLOAT2", "frequency": 1000, "counter": {"dataType": "Double", "start": 1.10, "min": 1.10, "max": 4.40, "increment": 1.10 }}
]
```

- boolean - not documented - see the code
- counter - on the frequency (in milliseconds) create a value starting at the **start** value and each value uses the **increment** from **min** to **max**
- random - on the frequency (in milliseconds) create a random value between **min** to **max** using the **precision**

## Run the App Locally

```bash
node app.js
```

## Build the Docker Container

```bash
docker build -t predixadoption/predix-edge-opcua-simulator:latest .
```

If your build machine is behind a proxy you will need to specify the proxies as build arguments. You can pull in the proxy values from the environment variables on your machine.

```bash
docker build --build-arg http_proxy=$http_proxy --build-arg https_proxy=$https_proxy -t predixadoption/predix-edge-opcua-simulator:latest .
```

## Run the Container

```bash
docker run predixadoption/predix-edge-opcua-simulator:latest
```

[![Analytics](https://predix-beacon.appspot.com/UA-82773213-1/predix-edge-opcua-simulator/readme?pixel)](https://github.com/PredixDev)
