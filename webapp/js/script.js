//
// LEDS
//
led1State = document.querySelector('#estadoLed1');
led2State = document.querySelector('#estadoLed2');
randDataButton = document.querySelector('#randData');
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
var mqttout;
reconnectTimeout = 2000;
host="190.2.219.40";
port=9001;

inputChannel = "prueba";

function onConnectMqtt() {
  console.log("MQTT Connected.");
  led1StateButton.disabled = false;
  led2StateButton.disabled = false;
  mqtt.subscribe(inputChannel);
  console.log("MQTT subscribed to '"+inputChannel+"'.");
}

var onMessageArrivedMqttFree = true;
var onMessageArrivedMqttFirst = true;

function onMessageArrivedMqtt(message) {
  //  Message example
  //  AccelValues:	X:8231	Y:8297	Z:11463	L1:1	L2:0
  //
  //  AccelValues:\tX:\d{1,5}\tY:\d{1,5}\tZ:\d{1,5}\tL1:([01])\tL2:([01])

  var messageRegex = /AccelValues:\tX:(\d{1,5})\tY:(\d{1,5})\tZ:(\d{1,5})\tL1:([01])\tL2:([01])/g;
  var match = messageRegex.exec(message.payloadString);

  if (onMessageArrivedMqttFree &&
    message.payloadString.length > 0){
      var now = new Date();

    // accel: \t X: \t inX
    var inX = match[1]/5000;
    var inZ = match[2]/5000;
    var inY = match[3]/5000;

    var led1 = match[4] == "1";
    var led2 = match[5] == "1";

    if (led1) {
      led1State.style.backgroundColor = 'green'
    } else {
      led1State.style.backgroundColor = 'red'
    }

    if (led2) {
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
            x: inX,
            y: inY,
            z: inZ
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


//
//
// LEDS
//
//
var outputChanel = "prueba"
function led1Click(event) {
  led1StateButton.disabled = true;
  message = new Paho.MQTT.Message("toggleLed1");
  message.destinationName = outputChanel;
  var hasConnect = true;
  while (1) {
    try {
      if (!hasConnect) {
        mqtt.connect({timeout:5, onSuccess: ()=>{
          mqtt.subscribe(inputChannel);
          mqtt.send(message);
          console.log('MQTT led1 toggle message sent.');
          led1StateButton.disabled = false;
          led1StateButton.onclick = led1Click;
        }});
      } else{
        mqtt.send(message);
        console.log('MQTT led1 toggle message sent.');
        led1StateButton.disabled = false;
        led1StateButton.onclick = led1Click;
      }
      break;
    } catch (err) {
      if (hasConnect) {
        hasConnect=false;
        continue;
      }
      console.log(err);
      led1StateButton.disabled = false;
      led1StateButton.onclick = led1Click;
      break;
    }
  }
};

function led2Click(event) {
  led2StateButton.disabled = true;
  message = new Paho.MQTT.Message("toggleLed2");
  message.destinationName = outputChanel;
  var hasConnect = true;
  while (1) {
    try {
      if (!hasConnect) {
        mqtt.connect({timeout:5, onSuccess: ()=>{
          mqtt.subscribe(inputChannel);
          mqtt.send(message);
          console.log('MQTT led2 toggle message sent.');
          led2StateButton.disabled = false;
          led2StateButton.onclick = led2Click;
      }});
      } else{
        mqtt.send(message);
        console.log('MQTT led2 toggle message sent.');
        led2StateButton.disabled = false;
        led2StateButton.onclick = led2Click;
      }
      break;
    } catch (err) {
      if (hasConnect) {
        hasConnect=false;
        continue;
      }
      console.log(err);
      led2StateButton.disabled = false;
      led2StateButton.onclick = led2Click;
      break;
    }
  }
};

function randDataHandler(event) {
  randDataButton.disabled = true;
  var xrand = Math.floor(Math.random() * 8000) + 4000;
  var yrand = Math.floor(Math.random() * 8000) + 4000;
  var zrand = Math.floor(Math.random() * 8000) + 4000;
  message = new Paho.MQTT.Message(
    `AccelValues:	X:${xrand}	Y:${yrand}	Z:${zrand}	L1:${Math.round(Math.random())}	L2:${Math.round(Math.random())}`);
  message.destinationName = outputChanel;
  var hasConnect = true;
  while (1) {
    try {
      if (!hasConnect) {
        mqtt.connect({timeout:5, onSuccess: ()=>{
          mqtt.subscribe(inputChannel);
          mqtt.send(message);
          randDataButton.disabled = false;
          randDataButton.onclick = randDataHandler;
      }});
      } else{
        mqtt.subscribe(inputChannel);
        mqtt.send(message);
        randDataButton.disabled = false;
        randDataButton.onclick = randDataHandler;
      }
      break;
    } catch (err) {
      if (hasConnect) {
        hasConnect=false;
        continue;
      }
      console.log(err);
      randDataButton.disabled = false;
      randDataButton.onclick = randDataHandler;
      break;
    }
  }
};




connectMqtt();
led1StateButton.onclick = led1Click;
led2StateButton.onclick = led2Click;
randDataButton.onclick = randDataHandler;