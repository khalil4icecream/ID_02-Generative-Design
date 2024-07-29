// 2D Water Ripples
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/102-2d-water-ripple.html
// https://youtu.be/BZUdGqeOD0w
// https://editor.p5js.org/codingtrain/sketches/tYXtzNSl

// Algorithm: https://web.archive.org/web/20160418004149/http://freespace.virgin.net/hugo.elias/graphics/x_water.htm
var weather;

let natureSound;
let rainfall = 0
let windDegree;
let windspd = 1000;
let temperature = 0;
let cols;
let rows;
let current; // = new float[cols][rows];
let previous; // = new float[cols][rows];
let maxpxh = 0;
let dampening = 0.99;
let raindropCounter = 0;
let raindropInterval = 60;


function setup() { 
  loadJSON('https://api.openweathermap.org/data/2.5/weather?lat=51.5&lon=10&appid=032aa9004062f7ba3b017dd0dc501518&units=metric', gotData);
  pixelDensity(1);
  createCanvas(600, 400);
  cols = width;
  rows = height;
  // The following line initializes a 2D cols-by-rows array with zeroes
  // in every array cell, and is equivalent to this Processing line:
  // current = new float[cols][rows];
  current = new Array(cols).fill(0).map(n => new Array(rows).fill(0));
  previous = new Array(cols).fill(0).map(n => new Array(rows).fill(0));
  frameRate(30 + temperature);  
}

function gotData(data) {
  weather = data
  console.log(weather)
}

function mouseDragged() {
  previous[mouseX][mouseY] = maxpxh + random(5000);
}

function draw() {
  background(0); 
  console.log(weather);
  
  if (weather) {
    temperature = weather.main.temp;
    dampening = 0.8 + (temperature * 0.003) + random(0.2);
    maxpxh = 5000 + (temperature * 80);
    windDegree = weather.wind.deg;
    windspd = weather.wind.speed;
    //defining values based on the weather location

  if (weather.rain) {
    rainfall = weather.rain['1h'];
    raindropInterval = max(1, 60 / rainfall); 
    } else {
      rainfall = 0;
      raindropInterval = 60; // default interval if no rain
    }            
  }  
  raindropCounter++;
    if (raindropCounter >= raindropInterval) {
    let randX = floor(random(width));
    let randY = floor(random(height));
      previous[randX][randY] = maxpxh + random(1000 * rainfall);
      raindropCounter = 0; // reset the counter
}


  
  print(temperature, dampening, maxpxh, windDegree, rainfall)
    
  loadPixels();
  for (let i = 1; i < cols - 1; i++) {
    for (let j = 1; j < rows - 1; j++) {      
      let contributionWest = 1
      let contributionEast = 1
      let contributionNorth = 1
      let contributionSouth = 1

      if (windDegree >= 337.5 || windDegree < 22.5) {
  // Wind is blowing from the north, reduce contribution from the south
  contributionSouth = 1 - windspd * 0.003;
        
        } else if (windDegree >= 22.5 && windDegree < 67.5) {
        // Wind is blowing from the Northeast, reduce contribution from the SouthWest
        contributionSouth = 1 - windspd * 0.003;
        contributionWest = 1 - windspd * 0.003;
  
        } else if (windDegree >= 67.5 && windDegree < 112.5) {
        // Wind is blowing from the East, reduce contribution from the West  
        contributionWest = 1 - windspd * 0.003;
  
        } else if (windDegree >= 112.5 && windDegree < 157.5) {
        // Wind is blowing from the Southeast, reduce contribution from the Northwest
        contributionNorth = 1 - windspd * 0.0015;
        contributionWest = 1 - windspd * 0.00;
  
        } else if (windDegree >= 157.5 && windDegree < 202.5) {
        // Wind is blowing from the south, reduce contribution from the north
        contributionNorth = 1 - windspd * 0.003;
  
        } else if (windDegree >= 202.5 && windDegree < 247.5) {
        // Wind is blowing from the Southwest, reduce contribution from the Northeast
        contributionNorth = 1 - windspd * 0.003;
        contributionEast = 1 - windspd * 0.003;
  
        } else if (windDegree >= 247.5 && windDegree < 292.5) {
        // Wind is blowing from the West, reduce contribution from the East
        contributionEast = 1 - windspd * 0.003;
  
        } else if (windDegree >= 292.5 && windDegree < 337.5) {
        // Wind is blowing from the Northwest, reduce contribution from the Southeast
        contributionEast = 1 - windspd * 0.003;
        contributionSouth = 1 - windspd * 0.003;
        } 
      
      current[i][j] =
        (previous[i - 1][j] * contributionWest +
         previous[i + 1][j] * contributionEast +
         previous[i][j - 1] * contributionNorth +
         previous[i][j + 1] * contributionSouth) / 2 - current[i][j];
      current[i][j] = current[i][j] * dampening;

      // Unlike in Processing, the pixels array in p5.js has 4 entries
      // for each pixel, so we have to multiply the index by 4 and then
      // set the entries for each color component separately.
      
      let index = (i + j * cols) * 4;
      pixels[index + 0] = 0;
      pixels[index + 1] = current[i][j] * 0.9;
      pixels[index + 2] = current[i][j];
    }
  }
  
  updatePixels();

  let temp = previous;
  previous = current;
  current = temp;
}
