//
// LEDS
//
led1State = document.querySelector('#estadoLed1');
led2State = document.querySelector('#estadoLed2');
led1StateButton = document.querySelector('#botonEstadoLed1');
led2StateButton = document.querySelector('#botonEstadoLed2');

//
//  D3
//
//
//
//
var lineArr = [];
var MAX_LENGTH = 100;
var duration = 500;
var chart = realTimeLineChart();

function resize() {
  if (d3.select('#chart svg').empty()) {
    return;
  }
  chart.width(+d3.select('#chart').style('width').replace(/(px)/g, ''));
  d3.select('#chart').call(chart);
}

//
//  MQTT
//
//
//
//
var mqtt;
reconnectTimeout = 2000;
host="190.2.219.40";
port=9001;

inputChannel = "prueba";

function onConnectMqtt() {
  console.log("MQTT Connected.");
  mqtt.subscribe(inputChannel);
  console.log("MQTT subscribed to '"+inputChannel+"'.");
}

var onMessageArrivedMqttFree = true;
var onMessageArrivedMqttFirst = true;

function onMessageArrivedMqtt(message) {
  console.log('message.payloadString');
  console.log(message.payloadString);
  if (onMessageArrivedMqttFree && message.payloadString.length > 0){
    var now = new Date();

    // decrypt
    payload = message.payload.split("\t");
    // accel: \t X: \t inX
    var inX = payload[2];
    var inZ = payload[4];
    var inY = payload[6];

    var led1 = payload[8];
    var led2 = payload[10];

    if (led1) {
      led1State.style.backgroundColor = 'green'
    } else {
      led1State.style.backgroundColor = 'red'
    }

    if (led12) {
      led2State.style.backgroundColor = 'green'
    } else {
      led2State.style.backgroundColor = 'red'
    }

    if (onMessageArrivedMqttFirst) {
      onMessageArrivedMqttFirst = false;
      document.addEventListener('DOMContentLoaded', function() {
        for (var i = 0; i < MAX_LENGTH; ++i) {
          lineArr.push({
            time: new Date(now.getTime() - ((MAX_LENGTH - i) * duration)),
            x: inputX,
            y: inputY,
            z: inputZ
          });
        }
        d3.select('#chart').datum(lineArr).call(chart);
        d3.select(window).on('resize', resize);
      });
    } else {
      var lineData = {time: now, x: inX, y: inY, z: inZ};
      lineArr.push(lineData);
      if (lineArr.length > 30) {
        lineArr.shift();
      }
      d3.select('#chart').datum(lineArr).call(chart);
    }
    onMessageArrivedMqttFree = false;
    window.setTimeout(()=>{
      onMessageArrivedMqttFree = true;
    },250);
  }
};

function connectMqtt() {
  mqtt = new Paho.MQTT.Client(host,port,"clientjs");
  console.log("Connecting to "+ host +":"+ port);
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


connectMqtt()

//
//
// LEDS
//
//
var outputChanel = "canal2"
function led1Click(event) {
  led1StateButton.disabled = true;
  message = new Paho.MQTT.Message("toggleLed1");
  message.destinationName = outputChanel;
  try {
    mqtt.send(message);
  } catch (err) {
    console.log(err)
  }
  window.setTimeout(() => {
    led1StateButton.disabled = false;
    led1StateButton.onclick = led1Click;
  }, 500)
  console.log('MQTT led1 toggle message sent.')
};

function led2Click(event) {
  led2StateButton.disabled = true;
  message = new Paho.MQTT.Message("toggleLed2");
  message.destinationName = outputChanel;
  try {
    mqtt.send(message);
  } catch (err) {
    console.log(err)
  }
  window.setTimeout(() => {
    led2StateButton.disabled = false;
    led2StateButton.onclick = led2Click;
  }, 500)
  console.log('MQTT led1 toggle message sent.')
};

led1StateButton.onclick = led1Click;
led2StateButton.onclick = led2Click;