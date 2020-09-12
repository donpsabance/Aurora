//GLOBAL VARIABLES
var week_type = [];
var week_temp = [];
var week_pop = [];
var week_sunset = [];
var loaded_weather_info = false;

$(document).ready(function () {

	document.getElementById('input').onkeyup = function() {
	  if (this.value.length === 0) {
	    hideWeather();
	  }
	}

	setInterval(initializeClock, 1000);
	hideWeather();
   	google.maps.event.addDomListener(window, 'load', initializeAutoComplete);
   	document.getElementById('location_form_id').addEventListener('submit', function(e) {
   		e.preventDefault();
   		getWeatherData();
   	}, false);
});

function initializeClock(){
	var date = new Date();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();

	if(minutes < 10) minutes = "0" + minutes;
	if(seconds < 10) seconds = "0" + seconds;

	var clock = hours + ":" + minutes + ":" + seconds;
	document.getElementById("clock_time").innerHTML = clock;
}

function initializeAutoComplete(){

	// var options = {types: ['(cities']};
	var input = document.getElementById('input');
	var autoComplete = new google.maps.places.Autocomplete(input);
}

function initializeVideo(){

	var video = document.getElementById("background");
	var video_list = ["videos/clouds.mp4", "videos/falls.mp4", "videos/sea.mp4"];
	video.src = video_list[Math.floor(Math.random() * 4)];
	video.load();
}

function getWeatherData(){

	loaded_weather_info = false;
	var weather_req = new XMLHttpRequest();
	var google_req = new XMLHttpRequest();

	var google_req = new XMLHttpRequest();
	var geocode_url = "https://maps.googleapis.com/maps/api/geocode/json?address=";
	var geo_loc = document.getElementById('input').value;
	var google_api_key = "&key=AIzaSyAU2t8ce0Pu76GO3Pet5oSlAEYXRIbMEYI";
	var geocode_req_url = geocode_url + geo_loc + google_api_key;

	const promise = new Promise(function(resolve, reject){

		if(geo_loc.trim() != ''){

			google_req.open('GET', geocode_req_url, true);
			google_req.onreadystatechange = function(){
			 	if(this.readyState == 4 && this.status == 200){

					var data = JSON.parse(this.response);

					if([data.results[0].geometry.location.lat] != null && [data.results[0].geometry.location.lng] != null){
						resolve([data.results[0].geometry.location.lat, data.results[0].geometry.location.lng]);
					} else {
						hideWeather();
						loaded_weather_info = false;
					}
				}
			};
			google_req.send();	
		}
	});

	promise.then((value) => {

		var lat = value[0];
		var lng = value[1];

		week_type = [];
	 	week_temp = [];
	 	week_pop = [];
		week_sunset = [];

		url_1 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lng + "&exclude=hourly,minutely";
		url_2 = "&APPID=9a8d381120a94168102f65b0b3849164&units=metric";
		request_url = url_1.concat(url_2);

		weather_req.open('GET', request_url, true);
		weather_req.onreadystatechange = function(){
			 if(this.readyState == 4 && this.status == 200){

			 	var data = JSON.parse(this.response);
			 	var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
			 	var buttons = ["day_1", "day_2", "day_3", "day_4", "day_5", "day_6", "day_7", "day_8"];
		
				document.getElementById([buttons[0]]).innerHTML = "Today";
				week_type.push(data.current.weather[0].main);
				week_temp.push(data.current.temp);
				week_pop.push(data.daily[0].pop * 100);
				week_sunset.push(data.current.sunset);

			 	for(i = 1; i < 8; i++){

			 		var date = new Date(data.daily[i].dt * 1000);
			 		document.getElementById([buttons[i]]).innerHTML = days[date.getDay()];

			 		week_type.push(data.daily[i].weather[0].main);
			 		week_temp.push(data.daily[i].temp.day);
			 		week_pop.push(data.daily[i].pop * 100);
			 		week_sunset.push(data.daily[i].sunset);
			 		
			 	}
			}
		};
		weather_req.send();
	});

	loaded_weather_info = true;
}

function displayWeather(day){

	if(loaded_weather_info){
		var div = document.getElementById('info_div');
		div.style.visibility = "initial";

		document.getElementById("weather_type").innerHTML = week_type[day];
		document.getElementById("weather_rain_chance").innerHTML = Math.round(week_pop[day] * 10) / 10+ "%";
		document.getElementById("weather_temp").innerHTML = week_temp[day] + "℃";
		document.getElementById("weather_sunset").innerHTML = epochToHumanReadable(week_sunset[day]);

	}	
}

function hideWeather(){

	if(document.getElementById('input').value.trim() == ''){

		var div = document.getElementById('info_div');
		div.style.visibility = "hidden";

		loaded_weather_info = false;
		hideButtons();

	}
}

function hideButtons(){

	var buttons = ["day_1", "day_2", "day_3", "day_4", "day_5", "day_6", "day_7", "day_8"];
	for(i = 0; i < 8; i++){
		document.getElementById(buttons[i]).innerHTML = '';
	}

}

function epochToHumanReadable(epoch){

	var date = new Date(epoch * 1000);
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var time = " " + hours + ":" + minutes;

	return time;
}

