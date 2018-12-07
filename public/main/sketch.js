let weather;
let font;

let weatherString;
let temperature;
let pressure;
let humidity;
let wind;
let windHeading;

let secondColor;
let minuteColor;
let hourColor;
let windColor;
let temperatureColor;
let humidityColor;

let time;
let previousTime;

let error = false;

let url;
let iconPath;

function preload() {
  font = loadFont("main/assets/monof56.ttf");
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  //url = "http://api.openweathermap.org/data/2.5/weather?id=27453456456101&APPID=9f688bf5892f3ed39090e5560a0dd092";
  angleMode(DEGREES);

  secondColor = color(151, 204, 4);
  minuteColor = color(57, 147, 221);
  hourColor = color(255, 89, 100);
  windColor = color(244, 93, 1);
  temperatureColor = color(193, 1, 22);
  humidityColor = color(57, 147, 221);

  navigator.geolocation.getCurrentPosition(function(location) {
    console.log(location.coords.latitude);
    console.log(location.coords.longitude);
    console.log(location.coords.accuracy);

    url = "http://api.openweathermap.org/data/2.5/weather?lat=" + location.coords.latitude + "&lon=" + location.coords.longitude + "&APPID=9f688bf5892f3ed39090e5560a0dd092";
    weather = loadJSON(url, onSuccess, onError);
  });

  previousTime = minute();
}

function draw() {
  frameRate(10);

  let y = year();
  let mo = month();
  let d = day();
  let h = hour() % 12;
  let mi = minute();
  let s = second();
  time = minute();
  if (time != previousTime) refresh();

  background(0);
  translate(width / 2, height * 0.67);
  fill(255);
  textAlign(CENTER);

  textFont(font, 50);
  text(weatherString, 0, -385);
  textFont(font, 25);
  text(temperature + " °C", 0, -365);
  text(pressure + " hPa", 0, -345);
  text(humidity + "%", 0, -325);
  push();
  textFont(font, 20);
  text(wind + " m/s @ " + windHeading + "°", 0, -305);
  pop();

  push();
  noFill();
  stroke(temperatureColor);
  strokeWeight(8);
  arc(0, -375, 225, 225, -90, map(temperature, -50, 50, 0, 360) - 90);
  stroke(humidityColor);
  arc(0, -375, 250, 250, -90, map(humidity, 0, 100, 0, 360) - 90);
  stroke(255);
  ellipse(0, -375, 275, 275);
  pop();

  //text(wind + " m/s", 0, 50);
  //text(windHeading + " degrees", 0, 70);


  // Clock
  push();
  stroke(255);
  strokeWeight(8);
  point(0, 0);
  noFill();

  ellipse(0, 0, 450, 450);

  // Second Hand
  let secondAngle = map(s, 0, 60, 0, 360);
  stroke(secondColor);
  arc(0, 0, 425, 425, -90, secondAngle - 90);
  push();
  stroke(secondColor);
  rotate(secondAngle);
  line(0, 0, 0, -175);
  pop();

  // Minute Hand
  let minuteAngle = map(mi + (s / 60), 0, 60, 0, 360);
  stroke(minuteColor);
  arc(0, 0, 400, 400, -90, minuteAngle - 90);
  push();
  stroke(minuteColor);
  rotate(minuteAngle);
  line(0, 0, 0, -150);
  pop();

  // Hour Hand
  let hourAngle = map(h + (mi / 60), 0, 12, 0, 360);
  stroke(hourColor);
  arc(0, 0, 375, 375, -90, hourAngle - 90);
  push();
  stroke(hourColor);
  rotate(hourAngle);
  line(0, 0, 0, -125);
  pop();

  push();
  rotate(windHeading);
  stroke(windColor);
  line(0, -100, 0, -150);
  noStroke();
  fill(windColor);
  //text(wind + " m/s", 0, -185);
  //text(windHeading + "°", 0, -160)
  pop();

  stroke(255);
  strokeWeight(12);
  point(0, 0);
  pop();

  if (error) {
    fill(255, 30, 0);
    textAlign(CENTER);
    textFont(font, 40);

    text("Error fetching weather", 0, -250);
  }

  push();
  noFill();
  strokeWeight(8);
  stroke(255, 255, 30);
  //ellipse(0, 0, 300, 300);

  /*
  hexagon(0, 0, 200);
  hexagon(300, 175, 200);
  hexagon(-300, 175, 200);
  hexagon(300, -175, 200);
  hexagon(-300, -175, 200);
  hexagon(0, -350, 200);
  hexagon(0, 350, 200);
  */
  pop();

  previousTime = time;
}

function onError(response) {
  print("Couldn't fetch weather data, try again later");
  weatherString = "______";
  temperature = "_";
  pressure = "_";
  humidity = "_";
  wind = "_";
  windHeading = "_";

  error = true;
}

function onSuccess(weather) {
  error = false;

  weatherString = weather.weather[0].main;
  temperature = nfc(weather.main.temp - 273.15, 1);
  pressure = nfc(weather.main.pressure, 1);
  humidity = nfc(weather.main.humidity);
  wind = nfc(weather.wind.speed);
  try {
    windHeading = nfc(weather.wind.deg);
  } catch(e) {
    windHeading = 0;
    print(e);
  }
  print(weather);

  print("Fetched weather data successfully");
}

function refresh() {
  weather = loadJSON(url, onSuccess, onError);
}
/*
function hexagon(x, y, radius) {
  var angle = TWO_PI / 6;
  beginShape();
  for (var a = 0; a < TWO_PI; a += angle) {
    var sx = x + cos(a) * radius;
    var sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}
*/
