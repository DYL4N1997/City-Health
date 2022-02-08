var OP_KEY = "6ab359c87b61df5cbd8a7d7e8a717bc5";
var displayContainer = document.querySelector('#display_container');
var userForm = document.querySelector('#user-form');
var input = document.querySelector('#input');
var airQualityEl = document.querySelector('#air-pollution');
// locBtn is an object that will hold my selected place and its latitude and longitude.
// an is a variable that contains many values
var locBtn = new Object()
var pcApi="";
var dataReg="";
var covidApi= "";
var dataCov="";

//this moment is needed for covid API in this layout
now = moment().format('YYYY-MM-DD');
var prevFri=moment().day(-2).format('YYYY-MM-DD');

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
    var apiUrl = 'https://api.openweathermap.org/geo/1.0/direct?q='+placeName+',*,GB&limit=3&appid='+OP_KEY;
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
      displayContainer.textContent = 'Please Choose a Place in Great Britain';
        return;
      }
      var placeGroup=document.querySelector("#place_group")
      placeGroup.textContent="Please select the desired place:";
      placeGroup.classList = 'font-semibold p-3 text-xl text-center text-green-900 '
     for (var i = 0; i < possibleOptions.length; i++) {
        var placeName = possibleOptions[i].name + '  ' + possibleOptions[i].country;
        var place = document.createElement('ul');
        // Computer creates the choices as buttons so that the user can select one.
        place.classList = 'text-xl mx-4 text-center rounded-xl text-green-100 p-6 bg-green-700 shadow-lg hover:bg-green-600'
        var title = document.createElement('button');
        title.textContent = placeName;
        title.name='choice';
        title.id='choice'+i;
        title.value=i;
        place.appendChild(title);
        displayContainer.appendChild(place);
      }
    

    // when the user clicks on the place they want to select it extracts the related id and puts the place plus its lat and long in locBtn
    $("button[name='choice']").on('click',function() {
      // parse int changes string to an integer
      // in this case the integer (in this case it can be 0,1,2 depending on which button the user clicks)
      // we change it to an integer so that the computer knows which place you chose and thus which information to come up with.
      var j=parseInt($(this).val());
      console.log(j+ "j")
      //storing properties of selected location so that you can now access name, lat and long 
      locBtn.place=possibleOptions[j].name; 
      locBtn.lat=possibleOptions[j].lat; 
      locBtn.lon=possibleOptions[j].lon;
      document.querySelector("#Area").innerHTML = locBtn.place
      
      // this API find the local authority (it associates the lat and lon with local gov region needed for covid nhs api)
      pcApi =   'https://findthatpostcode.uk/points/'+locBtn.lat+'%2C'+locBtn.lon+'.json'
      
  getRegion(pcApi)}
      );
      //make sure inside the bracket that opens at the possible options function
  };
  
  var getRegion = function (pcApi) {
      fetch(pcApi)
        .then(function (response) {
          if (response.ok) {
            response.json().then(function (data) {
                dataReg=data;
                //to match the covid database we need to find the geographical code that corresponds to 'laua' 
                //https://findthatpostcode.uk/areatypes/laua.html local authority. 
                //Depending on the type of geography this is in either the second or third line. 
                // the else is for more rural places
                if(dataReg.included[3].relationships.areatype.data.id=="laua"){
                  placeCode=dataReg.included[3].id;regionCode=dataReg.included[6].id}
                  else{placeCode=dataReg.included[2].id;regionCode=dataReg.included[5].id};
                //
                  covidApi='https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=utla;areaCode='+placeCode+';date='+now+'&structure={"name":"areaName","areaCode":"areaCode","date":"date","dailyCases": "newCasesByPublishDate"}&latestBy:"newCasesByPublishDate"';
                  covidApiHosp='https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=nhsRegion;areaCode='+regionCode+';date='+now+'&structure={"name":"areaName","areaCode":"areaCode","date":"date","hospitalCases":"hospitalCases","transmissionRateMax":"transmissionRateMax"}&latestBy:"newCasesByPublishDate"';
                  covidApiR='https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=nhsRegion;areaCode='+regionCode+';date='+prevFri+'&structure={"name":"areaName","areaCode":"areaCode","date":"date","hospitalCases":"hospitalCases","transmissionRateMax":"transmissionRateMax"}&latestBy:"newCasesByPublishDate"';
                 getCovidCases(covidApi);
                 getCovidHospital(covidApiHosp);
                 getCovidR(covidApiR);
            });
          } 
        });
    };
  

var getCovidCases = function (covidApi) {
      fetch(covidApi)
        .then(function (response) {
          if (response.ok) {
            response.json().then(function (data) {
              // today's data from the Gov about COVID stats for the selected place
              dataCov=data;
              console.log("area "+ dataCov.data[0].name + " daily cases "+ dataCov.data[0].dailyCases)
              document.querySelector("#covid-cases").innerHTML= " Daily Cases: "+ dataCov.data[0].dailyCases;
            });
        } 
      });
    };
  
var getCovidHospital = function (covidApiHosp) {
      fetch(covidApiHosp)
        .then(function (response) {
          if (response.ok) {
            response.json().then(function (data) {
              // today's data from the Gov about COVID stats for the selected place
              dataCovHosp=data;
              console.log(dataCovHosp);
              console.log("area "+ dataCov.data[0].name + " daily cases "+ dataCovHosp.data[0].dailyCases)
              document.querySelector("#hospital-occupancy").innerHTML= " Hospital Occupancies: "+ dataCovHosp.data[0].hospitalCases;
            });
        } 
      });
    };

var getCovidR = function (covidApiR) {
      fetch(covidApiR)
        .then(function (response) {
          if (response.ok) {
            response.json().then(function (data) {
              // today's data from the Gov about COVID stats for the selected place
              dataCovR=data;
              console.log(dataCovR);
              console.log("area "+ dataCov.data[0].name + " daily cases "+ dataCovHosp.data[0].dailyCases)
              document.querySelector("#r-rate").innerHTML="R rate: "+ dataCovR.data[0].transmissionRateMax;
            });
        } 
      });
    };




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
};

// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}


userForm.addEventListener('submit', formSubmitHandler);

// airQualityEl.textContent = data.lon.lat;
// for (let i = 0; i < 1; i++) {
//   var lon = data.coord[i].lon;
//   var lat = data.coord[i].lat;
//   var date = data.list[i].dt;
//   var aqi = data.list[i].main.aqi;
//   var carbonM = data.components[i].co;
//   var nitrogenM = data.components[i].no;
//   var nitrogenD = data.components[i].no2;
//   var ozone = data.components[i].o3;
//   var sulphurD = data.components[i].so2;
//   var concPM = data.components[i].pm2_5;
//   var Conc = data.components[i].pm10;
//   var ammonia = data.components[i].nh3;}