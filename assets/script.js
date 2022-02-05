var OP_KEY = "6ab359c87b61df5cbd8a7d7e8a717bc5";
var displayContainer = document.querySelector('#display_container');
var userForm = document.querySelector('#user-form')
var input = document.querySelector('#input')
var airQualityEl = document.querySelector('#air-pollution')

var formSubmitHandler = function (event) {
  event.preventDefault ();
  var placeName = input.value.trim();
  if (placeName) {
    getCoordinates(placeName)
    displayContainer.textContent='';}
  else {
    displayContainer.textContent='Please enter a place'
  }
  };

var getCoordinates = function (placeName) {
    var apiUrl = 'https://api.openweathermap.org/geo/1.0/direct?q='+placeName+',*&limit=3&appid='+OP_KEY;
    fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayPlaces(data);
      });
    }
  })
};

var displayPlaces = function (possibleOptions){
    if (possibleOptions.length===0){
      displayContainer.textContent = 'No place matches your search';
        return;
      }
    
     for (var i = 0; i < possibleOptions.length; i++) {
        var placeName = possibleOptions[i].name + '  ' + possibleOptions[i].country;
        var place = document.createElement('li');
        // Computer creates the choices as buttons so that the user can select one.
        var title = document.createElement('button');
        title.textContent = placeName;
        title.name='choice';
        title.id='choice'+i;
        title.value=i;
        place.appendChild(title);
        displayContainer.appendChild(place);
      }
    }


var getCityAirQuality = function (lon, lat) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/air_pollution?lat=' + lon + '&lon=' + lat + '&' + OP_KEY;
    fetch(apiUrl)
    .then(function (res) {
      if (res.ok) {
        res.json().then(function (data) {
          displayAirQuality(lon, lat, data);
      });
    }
  })
  lonlat.push(lon, lat);
  saveSearch();
  prevSearch(lon, lat);
};

function displayAirQuality(data) {
  if (data.list.length === 0) {
    airQualityEl.textContent = 'No pollution stats found.';
    return;
  }
}

airQualityEl.textContent = data.lon.lat;
for (let i = 0; i < 1; i++) {
  var lon = data.coord[i].lon;
  var lat = data.coord[i].lat;
  var date = data.list[i].dt;
  var aqi = data.list[i].main.aqi;
  var carbonM = data.components[i].co;
  var nitrogenM = data.components[i].no;
  var nitrogenD = data.components[i].no2;
  var ozone = data.components[i].o3;
  var sulphurD = data.components[i].so2;
  var concPM = data.components[i].pm2_5;
  var Conc = data.components[i].pm10;
  var ammonia = data.components[i].nh3;


  userForm.addEventListener('submit', formSubmitHandler);
