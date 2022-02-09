var OP_KEY = "6ab359c87b61df5cbd8a7d7e8a717bc5";
var displayContainer = document.querySelector('#display_container');
var userForm = document.querySelector('#user-form');
var input = document.querySelector('#input');
var airQualityEl = document.querySelector('#air-pollution');
// locBtn is an object that will hold my selected place and its latitude and longitude.
// an is a variable that contains many values
var locBtn = new Object()
// PcApi will be the url for finding region data for the COVID-19 app
var pcApi="";
// covidApi will be the url for COVID-19 statistics
var covidApi= "";
// dataReg is the regional data fetched from PcApi
var dataReg="";
// dataCovR is the COVID-19 data  that contains the transmission rates in the searched area
var dataCovR="";
// dataCov is the number of COVID-19 cases in the searched area.
var dataCov="";
// dataCovHosp is the number of people in the searched area's hospitals at the time.
var dataCovHosp="";

//this moment is needed for covidAPI in this layout format for: dataCovHosp and dataCov
var now=moment().subtract(1, 'day').format('YYYY-MM-DD');
//this moment is needed for covidAPI in this layout format for: dataCovR as to access the information the date has to be the previous Friday.
var prevFri=moment().day(-2).format('YYYY-MM-DD');

// Form for user to submit of which place name they would like to see the COVID-19 and air pollution statistics.
var formSubmitHandler = function (event) {
  event.preventDefault ();
  var placeName = input.value.trim();
  if (placeName) {
    getCoordinates(placeName)
    displayContainer.textContent='';}
    // If the user does submits a blank location the computer prompts them to submit a name of a location.
  else {
    displayContainer.textContent='Please enter a place'
  }
  };

// Computer selects upto three possible places that correspond to the user's input.
// Computer uses the GEO API from openweathermap
// Computer restricts places to Great Britain
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

// Computer creates a list of upto three possible places for the user to choose from.
var displayPlaces = function (possibleOptions){
    if (possibleOptions.length===0){
      // If computer can not find any places to match the user's input within Great Britain then the message below is displayed on the webpage.
      displayContainer.textContent = 'Please Choose a Place in Great Britain';
        return;
      }
      var placeGroup=document.querySelector("#place_group")
      placeGroup.textContent="Please select the desired place:";
      placeGroup.classList = 'font-semibold p-3 text-xl text-center text-green-900 '
      // Computer generates the list to be visible to the user on the webpage.
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

    // Computer finds all of the buttons when clicked on extracts the related id and puts the place and its latitude and longitude in locBtn.
    $("button[name='choice']").on('click',function() {
      var j=parseInt($(this).val());
      console.log(j+ "j")
      //storing properties of selected location so that you can now access name, lat and long 
      locBtn.place=possibleOptions[j].name; 
      locBtn.lat=possibleOptions[j].lat; 
      locBtn.lon=possibleOptions[j].lon;
      document.querySelector("#Area").innerHTML = locBtn.place
       // Computer calls the open weather air quality API
      getCityAirQuality(locBtn);
      
      // this API find the local authority (it associates the lat and lon with local gov region needed for covid nhs api)
      
      pcApi = 'https://findthatpostcode.uk/points/'+locBtn.lat+'%2C'+locBtn.lon+'.json'
      
  getRegion(pcApi)}
      );
  };
  
// pcApi is a necessary to be able to use the gov COVID-19 statistics because of how the statistics are grouped
// It also means you can search areas that are under local authority to the larger NHS regions 
// they are all classified by the office for National statistics geographical codes
// National statistics geographical codes begin with an e and followed by a series of digits
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
                  covidApi='https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=utla;areaCode='+placeCode+';date='+now+'&structure={"name":"areaName","areaCode":"areaCode","date":"date","dailyCases": "newCasesByPublishDate"}&latestBy:"newCasesByPublishDate"';
                  covidApiHosp='https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=nhsRegion;areaCode='+regionCode+';date='+now+'&structure={"name":"areaName","areaCode":"areaCode","date":"date","hospitalCases":"hospitalCases","transmissionRateMax":"transmissionRateMax"}&latestBy:"newCasesByPublishDate"';
                  covidApiR='https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=nhsRegion;areaCode='+regionCode+';date='+prevFri+'&structure={"name":"areaName","areaCode":"areaCode","date":"date","hospitalCases":"hospitalCases","transmissionRateMax":"transmissionRateMax"}&latestBy:"newCasesByPublishDate"';
                  // getCovidCases pulls the data from covidApi
                 getCovidCases(covidApi);
                 // getCovidHospital  pulls the data from covidApiHosp
                 getCovidHospital(covidApiHosp);
                 // getCovidR pulls the data from covidApiR
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
              dataCov=data
              // COVID-19 cases are shown inside the id of: covid-cases in the HTML
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
              // COVID-19 hospital cases are shown inside the id of: hospital-occupancy in the HTML
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
              // COVID-19 transmission rate is shown inside the id of: r-rate in the HTML
              document.querySelector("#r-rate").innerHTML="R rate: "+ dataCovR.data[0].transmissionRateMax;
            });
        } 
      });
    };

// Computer gets the air quality data for the selected place by using locBtn
function getCityAirQuality (locBtn) {
  // /apiAQUrl will be the url for finding the air quality 
  var apiAQUrl = 'https://api.openweathermap.org/data/2.5/air_pollution?lat='+locBtn.lat+'&lon='+locBtn.lon+'&appid='+OP_KEY;
  fetch(apiAQUrl)
  .then(function (res) {
    if (res.ok) {
      res.json().then(function (data) {
        dataAQ=data
      displayAirQuality(dataAQ)
    });
  }
})
};

function displayAirQuality(dataAQ) {
  // if computer finds no related air pollution statistics than it tells the user this
if (dataAQ.list[0].components.length === 0) {
   airQualityEl.textContent = 'No pollution stats found.';
   return;
}
else{
  // if the computer finds related air pollution statistics it then extracts from dataAQ the dataGas components
  var  dataGas=dataAQ.list[0].components

// computer forms a list of air quality statistics with the html
document.querySelector("#Air-Quality").innerHTML="Air Quality Index: "+dataAQ.list[0].main.aqi
var airQuality = document.querySelector("#Air-Quality")
airQuality.classList = "shadow-lg text-center text-green-100 bg-green-700 p-6  font-semibold text-xl "
document.querySelector("#index").innerHTML="Good = 1 Fair = 2 Moderate = 3 Poor = 4 Very Poor = 5 "
var airQualityI = document.querySelector('#index')
airQualityI.classList= " text-green-900 bg-green-300 text-l shadow-lg text-center font-semibold"
document.querySelector("#Fine-Particles").innerHTML="Fine Particles : "+dataAQ.list[0].components.pm2_5+"μg/m<sup> 3</sup>"
var fineParticles = document.querySelector("#Fine-Particles")
fineParticles.classList="m-4 text-green-900 shadow-lg text-center mx-6 my-3 bg-green-100 rounded-xl p-4 font-semibold text-xl border-2 border-green-200";
document.querySelector("#CO").innerHTML="Carbon Monoxide: "+dataAQ.list[0].components.co+"μg/m<sup> 3</sup>"
var carbonMonoxide = document.querySelector("#CO")
carbonMonoxide.classList="m-4 text-green-900 shadow-lg text-center mx-6 my-3 bg-green-100 rounded-xl p-4 font-semibold text-xl border-2 border-green-200"
document.querySelector("#ozone").innerHTML="Ozone: "+dataAQ.list[0].components.o3+"μg/m<sup> 3</sup>"
var ozone = document.querySelector("#ozone")
ozone.classList="m-4 shadow-lg text-green-900 text-center mx-6 my-3 bg-green-100 rounded-xl p-4 font-semibold text-xl border-2 border-green-200"
document.querySelector("#NO").innerHTML="Nitrogen Monoxide: "+dataAQ.list[0].components.no+"μg/m<sup> 3</sup>"
var nitrogenMonoxide = document.querySelector("#NO")
nitrogenMonoxide.classList="m-4 text-green-900 shadow-lg text-center mx-6 my-3 bg-green-100 rounded-xl p-4 font-semibold text-xl border-2 border-green-200"
document.querySelector("#NO2").innerHTML="Nitrogen Dioxide: "+dataAQ.list[0].components.no2+"μg/m<sup> 3</sup>"
var nitrogenDioxide = document.querySelector("#NO2")
nitrogenDioxide.classList="m-4 text-green-900 shadow-lg text-center mx-6 my-3 bg-green-100 rounded-xl p-4 font-semibold text-xl border-2 border-green-200"
document.querySelector("#SO2").innerHTML="Sulfur Dioxide: "+dataAQ.list[0].components.so2+"μg/m<sup> 3</sup>"
var sulfurDioxide = document.querySelector("#SO2")
sulfurDioxide.classList="m-4 text-green-900 shadow-lg text-center mx-6 my-3 bg-green-100 rounded-xl p-4 font-semibold text-xl border-2 border-green-200"
document.querySelector("#NH3").innerHTML="Ammonia: "+dataAQ.list[0].components.nh3+"μg/m<sup> 3</sup>"
var ammonia = document.querySelector("#NH3")
ammonia.classList="m-4 text-green-900 shadow-lg text-center mx-6 my-3 bg-green-100 rounded-xl p-4 font-semibold text-xl border-2 border-green-200"
}
}

userForm.addEventListener('submit', formSubmitHandler);
