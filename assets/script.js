var AP_KEY = "fa9ea468bf86f98d5f74d1ee663cf459";


var getCoordiantes = function (placeName) {
    var apiUrl = 'https://api.openweathermap.org/geo/1.0/direct?q='+placeName+',*&limit=3&appid='+AP_KEY;
    fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayPlaces(data);
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
};

