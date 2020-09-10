$(document).ready(function () {
   google.maps.event.addDomListener(window, 'load', initializeAutoComplete);
   document.getElementById('location_form_id').addEventListener('submit', function(e) {
   		e.preventDefault();
   		getWeatherData();
   	}, false);
});

function initializeAutoComplete(){

	// var options = {types: ['(cities']};
	var input = document.getElementById('input');
	var autoComplete = new google.maps.places.Autocomplete(input);
}

function getWeatherData(){
	// document.getElementById('location_form_id').addEventListener('submit', function(e) {

	// 	e.preventDefault();

		var request = new XMLHttpRequest();
		var url_1 = "http://api.openweathermap.org/data/2.5/weather?q=";
		var url_3 = "&APPID=9a8d381120a94168102f65b0b3849164&units=metric";
		var temp1 = url_1.concat(document.getElementById('input').value);
		var request_url = temp1.concat(url_3);

		request.onreadystatechange = function(){
			 if(this.readyState == 4 && this.status == 200){

				var data = JSON.parse(this.response);
				var temp = data.main.temp;
				var sunset = data.sys.sunset;

				var date = new Date(sunset * 1000);
				var hours = date.getHours();
				var minutes = date.getMinutes();
				var time = " " + hours + ":" + minutes;



				document.getElementById("weather_temp").innerHTML = temp;
				document.getElementById("weather_sunset").innerHTML = time;
			}
		};

		request.open('GET', request_url, true);
		request.send();
	// }, false);
}

// function changeBackground(videoId, videoSrc){

// 	var vid = document.getElementById(videoId).src = videoSrc;
// 	vid.load();
// }
