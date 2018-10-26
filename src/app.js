const opcua = require("node-opcua");
const config_file = "./config-simulator.json";
const config = require(config_file);

const server = new opcua.OPCUAServer({
    port: 4334,
    resourcePath: "UA/PredixEdge",
     buildInfo : {
        productName: "Predix Edge OPC-UA Simulator",
        buildNumber: "1000",
        buildDate: new Date()
    }
});

function addCounterVariable (namespace, device, item){

        let opcuaType = opcua.DataType.Double;

        if (item.counter.dataType === "Integer")
        {
            opcuaType = opcua.DataType.Int32;
        }

        let variable = item.counter.start;
        
        setInterval(function() {
            if((variable + item.counter.increment) > item.counter.max) {
                variable = item.counter.min
            } 
            else {
                variable += item.counter.increment; 
            }
        }, item.frequency);
        
        namespace.addVariable({
            componentOf: device,
            nodeId: "ns=" + namespace.index + ";s=" + item.browseName,
            browseName: item.browseName,
            dataType: item.counter.dataType,
            value: {
                get: function () {
                    return new opcua.Variant({dataType: opcuaType, value: variable });
                }
            }
        });
}

function addBooleanVariable (namespace, device, item){

    let opcuaType = opcua.DataType.Boolean;

    let variable = item.boolean.start;
    
    setInterval(function() {
        variable = !variable;
    }, item.frequency);
    
    namespace.addVariable({
        componentOf: device,
        nodeId: "ns=" + namespace.index + ";s=" + item.browseName,
        browseName: item.browseName,
        dataType: "Boolean",
        value: {
            get: function () {
                return new opcua.Variant({dataType: opcuaType, value: variable });
            }
        }
    });
}

function addRandomVariable (namespace, device, item){

    let opcuaType = opcua.DataType.Double;

    if (item.random.dataType === "Integer")
    {
        opcuaType = opcua.DataType.Int32;
    }

    let variable = 0;
    
    setInterval(function() {
        variable = (Math.random() * (item.random.max - item.random.min) + item.random.min).toFixed(item.random.precision);
    }, item.frequency);
    
    namespace.addVariable({
        componentOf: device,
        nodeId: "ns=" + namespace.index + ";s=" + item.browseName,
        browseName: item.browseName,
        dataType: item.random.dataType,
        value: {
            get: function () {
                return new opcua.Variant({dataType: opcuaType, value: variable });
            }
        }
    });
}

function post_initialize() {

    function construct_my_address_space(server) {
    
        const addressSpace = server.engine.addressSpace;
        const namespace = addressSpace.getOwnNamespace();
        
        // declare a new object
        const device = namespace.addObject({
            organizedBy: addressSpace.rootFolder.objects,
            browseName: "Simulator"
        });
        
        config.forEach(function(item) {
            
            if (item.counter)
            {
                addCounterVariable (namespace, device, item);
            }
            else if (item.random){
                addRandomVariable (namespace, device, item);
            }
            else if (item.boolean){
                addBooleanVariable (namespace, device, item);
            }
        });
    }

    construct_my_address_space(server);

    server.start(function() {
        console.log("Server is now listening on port ", server.endpoints[0].port);
        const endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
        console.log("the server endpoint url is ", endpointUrl );
    });
}
server.initialize(post_initialize);
