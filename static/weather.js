

url1 = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(SELECT%20woeid%20FROM%20geo.places%20WHERE%20text%3D%22(";
url2 ="%2C";
url3 = ")%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";


function getWeather(url) {

  $.getJSON(url, function(data){
    var city = data.query.results.channel.location.city;
    var state = data.query.results.channel.location.region;
    var temp = data.query.results.channel.item.condition.temp;
    var title = data.query.results.channel.item.title;
    var condition1 = data.query.results.channel.item.condition.text;
    var condition = condition1.toLowerCase();
    var high = data.query.results.channel.item.forecast[0].high;
    var low = data.query.results.channel.item.forecast[0].low;
    var sunrise = data.query.results.channel.astronomy.sunrise;
    var sunset = data.query.results.channel.astronomy.sunset;
    // $('#humidity').html('Humidty: ' + data.query.results.channel.atmosphere.humidity);
    $('#title').html(title);
    $('#current').html("Currently it's " + temp + "&deg;F and " + condition + " in " + city + ", " + state);
    $('#additional').html("High: " + high + "&deg;F <span id='space'></span> Low: " + low + "&deg;F <span id='space'></span> Sunrise: " + sunrise + " <span id='space'></span> Sunset: " + sunset);


    // <p id="current">Currently it's 28&deg;F and Cloudy in Logan, UT.</p>
    // <p id="additional">High: 32c  <span id="space"></span>

  });
}

$( document ).ready(function getLocation() {
  setBackground();
  console.log("Get Location");
  var x = document.getElementById("userLocation");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}
);

function showPosition(position) {
  var x = document.getElementById("userLocation");
  lat = position.coords.latitude;
  long = position.coords.longitude;
    //x.innerHTML = "Latitude: " + lat + "<br>Longitude: " + long;
  getWeather(url1+lat+url2+long+url3);
};

function setBackground(){
  var d = new Date();
  var n = d.getMonth() + 1;
  var hour = d.getHours() + 1;
  var daytime = true;
  if (hour >= 17) {
    daytime = false;
  }
  console.log("Set Background " + n);
  if (n < 3 || n > 11) { // winter
    if (daytime) {
      $('#bg').css({backgroundImage: "url('../static/winterDay.jpg')"});
    }
    else {
      $('#bg').css({backgroundImage: "url('../static/winterNight.jpg')"});
    }
    console.log("winter");
  }
  else if (n <= 5){ //spring
    if (daytime) {
      $('#bg').css({backgroundImage: "url('../static/springDay.jpg')"});
    }
    else {
      $('#bg').css({backgroundImage: "url('../static/springNight.jpg')"});
    }
    console.log("spring");
  }
  else if (n <= 8){ // summer
    if (daytime) {
      $('#bg').css({backgroundImage: "url('../static/summerDay.jpg')"});
    }
    else {
      $('#bg').css({backgroundImage: "url('../static/summerNight.jpg')"});
    }
    console.log("summer");
  }
  else if (n <= 11){ // fall
    if (daytime) {
      $('#bg').css({backgroundImage: "url('../static/fallDay.jpg')"});
    }
    else {
      $('#bg').css({backgroundImage: "url('../static/fallNight.jpg')"});
    }
    console.log("fall");
  }
}
