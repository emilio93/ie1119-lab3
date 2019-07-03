var lineArr = [];
var MAX_LENGTH = 100;
var duration = 500;
var chart = realTimeLineChart();

function randomNumberBounds(min, max) {
  return Math.floor(Math.random() * max) + min;
}

function seedData() {
  var now = new Date();
  for (var i = 0; i < MAX_LENGTH; ++i) {
    lineArr.push({
      time: new Date(now.getTime() - ((MAX_LENGTH - i) * duration)),
      x: randomNumberBounds(0, 5),
      y: randomNumberBounds(0, 2.5),
      z: randomNumberBounds(0, 10)
    });
  }

}

function updateData() {
  var now = new Date();

  var lineData = {
    time: now,
    x: randomNumberBounds(0, 5),
    y: randomNumberBounds(0, 2.5),
    z: randomNumberBounds(0, 10)
  };
  lineArr.push(lineData);

  if (lineArr.length > 30) {
    lineArr.shift();
  }
  d3.select("#chart").datum(lineArr).call(chart);
}

function resize() {
  if (d3.select("#chart svg").empty()) {
    return;
  }
  chart.width(+d3.select("#chart").style("width").replace(/(px)/g, ""));
  d3.select("#chart").call(chart);
}

connectMqtt()

document.addEventListener("DOMContentLoaded", function() {
  seedData();
  window.setInterval(updateData, 500);
  d3.select("#chart").datum(lineArr).call(chart);
  d3.select(window).on('resize', resize);
});




led1State = document.querySelector("#estadoLed1");
led2State = document.querySelector("#estadoLed2");
led1StateButton = document.querySelector("#botonEstadoLed1");
led2StateButton = document.querySelector("#botonEstadoLed2");

function led1Click(event){
  led1StateButton.disabled = true;
  if (led1State.style.backgroundColor == "green") {
    led1State.style.backgroundColor = "red"
  } else {
    led1State.style.backgroundColor = "green"
  }
  setTimeout(()=>{
    led1StateButton.disabled = false;
    led1StateButton.onclick = led1Click;
  }, 500)
  console.log("led1 toggle.")
};

function led2Click(event){
  led2StateButton.disabled = true;
  if (led2State.style.backgroundColor == "green") {
    led2State.style.backgroundColor = "red"
  } else {
    led2State.style.backgroundColor = "green"
  }
  setTimeout(()=>{
    led2StateButton.disabled = false;
    led2StateButton.onclick = led2Click;
  }, 500)
  console.log("led2 toggle.")
};

led1StateButton.onclick = led1Click;
led2StateButton.onclick = led2Click;