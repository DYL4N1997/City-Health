<<<<<<< HEAD
var AP_KEY = "fa9ea468bf86f98d5f74d1ee663cf459";
var displayContainer = document.querySelector('#display_container');
var userForm = document.querySelector('#user-form')
var input = document.querySelector('#input')


var getCoordinates = function (placeName) {
    var apiUrl = 'https://api.openweathermap.org/geo/1.0/direct?q='+placeName+',*&limit=3&appid='+AP_KEY;
    fetch(apiUrl)
    .then(function (response) {
      console.log('its ok')
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
    }
var formSubmitHandler = function (event) {
  event.preventDefault ();
  var getCoordinates = input.value.trim();
  if (getCoordinates) {
    placeName(getCoordinates)
    displayContainer.textContent='';}
  else {
    displayContainer.textContent='Please enter a place'
  }
  userForm.addEventListener('submit', formSubmitHandler);
  }

  /* needs naming changed
  for (var i = 0; i < possPlaces.length; i++) {
    var placeName = possPlaces[i].name + '  ' + possPlaces[i].country;
    var placeEl = document.createElement('li');
    placeEl.classList = 'list-item flex-row justify-space-between align-center';
    // Computer creates the choices as buttons so that the user can select one.
    var titleEl = document.createElement('button');
    titleEl.textContent = placeName;
    titleEl.name='choice';
    titleEl.id='choice'+i;
    titleEl.value=i;
    placeEl.appendChild(titleEl);
    specifyContainerEl.appendChild(placeEl);
  }
  */

 











=======
>>>>>>> 79f334110ad2f6f551ac5387dfd288e6c4b4e3b7
