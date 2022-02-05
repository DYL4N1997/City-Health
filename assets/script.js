var OP_KEY = "6ab359c87b61df5cbd8a7d7e8a717bc5";
var displayContainer = document.querySelector('#display_container');
var userForm = document.querySelector('#user-form')
var input = document.querySelector('#input')

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


  userForm.addEventListener('submit', formSubmitHandler);



  