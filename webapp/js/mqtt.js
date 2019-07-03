var mqtt;
var reconnectTimeout = 2000;
var host="190.2.219.40";
var port=9001;

function onConnectMqtt() {
  console.log("Connected ");
  mqtt.subscribe("prueba");
  message = new Paho.MQTT.Message("Hello World");
  message.destinationName = "prueba";
  mqtt.send(message);
}

function onMessageArrivedMqtt(message) {
  console.log(message)
}

function connectMqtt() {
  console.log("connecting to "+ host +":"+ port);
  mqtt = new Paho.MQTT.Client(host,port,"clientjs");
  mqtt.onMessageArrived = onMessageArrivedMqtt;
  var options = {
    timeout: 5,
    onSuccess: onConnectMqtt,
  };
  try {
    mqtt.connect(options);
  } catch (err) {
    console.log("ERROR:", err)
  }

}
