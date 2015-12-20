###Neighborhood web app###
######originally created for Udacity coursework######

To run the app, clone or download the repository and 
open `index.html` in your browser.

You can customize it for your neighborhood by changing out the 
`masterList` objects for places near you, along with the default 
start location of the map and the theater chosen for the movie
listings. 

####Set the map's location####

Change the latitude and longitude of the map's default location:

```
function initMap() {

	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 39.706901, lng: -105.084055},
		zoom: 15
	});
```

####Choose a different movie theater####

You will need to get an API key from [Gracenote](http://developer.tmsapi.com/docs/read/data_v1_1/movies/Theatre_showtimes).

Set the latitude and longitude of the theater search:

```
	getMovies: function() {
		movies = $.ajax("http://data.tmsapi.com/v1.1/movies/showings?startDate=" +
			date + "&numDays=1&lat=39.708582&lng=-105.076251%radius=1&units=mi&api_key=YOURAPIKEY", {
```

(You can also change the radius in miles. I have it set to 1, so it only collect's one theater's data.)
