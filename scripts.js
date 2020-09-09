$(document).ready(function () {
   google.maps.event.addDomListener(window, 'load', initializeAutoComplete);
});

function initializeAutoComplete(){

	var options = {types: ['(cities']};
	var input = document.getElementById('input');
	var autoComplete = new google.maps.places.Autocomplete(input);
}
google.maps.event.addDomListener(window, 'load', initializeAutoComplete);
