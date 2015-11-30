$(function () {
	$("#map").css("height", $(window).height());
});

function initMap() {

	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 39.706901, lng: -105.084055},
		zoom: 15
	});

	// Create the search box and link it to the UI element.
	var input = document.getElementById('pac-input');
	var searchBox = new google.maps.places.SearchBox(input);

	// Bias the SearchBox results towards current map's viewport.
	map.addListener('bounds_changed', function() {
		searchBox.setBounds(map.getBounds());
	});

	var markers = [];
	// [START region_getplaces]
	// Listen for the event fired when the user selects a prediction and retrieve
	// more details for that place.
	searchBox.addListener('places_changed', function() {
		var places = searchBox.getPlaces();

		if (places.length === 0) {
		  return;
		}

		// Clear out the old markers.

		if (typeof Model.newMarkers != "undefined") {
			for (var i = 0, len = Model.newMarkers.length; i < len; i++) {
				Model.newMarkers[i].marker.setMap(null);
			}
		}

		// For each place, get the icon, name and location.
		var bounds = new google.maps.LatLngBounds();

		places.forEach(function(place) {
			var icon = {
				url: place.icon,
				size: new google.maps.Size(71, 71),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(17, 34),
				scaledSize: new google.maps.Size(25, 25)
			};

			var newMarker = {
				title: place.name,
				lat: place.geometry.location.lat(),
				lng: place.geometry.location.lng(),
				address: place.formatted_address,
				icon: icon,
				visibility: ko.observable(true),
				markerIndex: (function(indexCopy){
					return indexCopy;
				})(counter)
			};

			Model.newMarkers.push(newMarker);

			if (place.geometry.viewport) {
				// Only geocodes have viewport.
				bounds.union(place.geometry.viewport);
			} else {
				bounds.extend(place.geometry.location);
			}
		});
		addMarkers(Model.newMarkers);
		map.fitBounds(bounds);
		window.onresize = function() {
			map.fitBounds(bounds);
		}
	});
	// [END region_getplaces]
	addMarkers(Model.masterList);
};

var Model = {
	init: function() {
		Model.getDate();
		Model.getMovies();
		$(document).ready(function(){
			window.setTimeout(Model.loadMoviesArray, 900);
		});
	},
	checkStorage: function(){
		if (localStorage.getItem('savedList')) {
			var saveArray = JSON.parse(localStorage.savedList);
			viewModel.marks = saveArray;
		}
	},
	loadMarkerCount: function(){
		for (var i = 0, len = Model.masterList.length; i < len; i++) {
			Model.masterList[i].markerIndex = i;
		}
	},
	loadMoviesArray: function(){
		for (i in movies.responseJSON) {
			viewModel.movies.push({
				"title": movies.responseJSON[i].title,
				"url": movies.responseJSON[i].officialUrl
			})
		};
	},
	getDate: function() {
		var today = new Date();
		var yyyy = today.getFullYear();
		var mm = today.getMonth() + 1;
		var dd = today.getDate();
		date = yyyy + "-" + mm + "-"+ dd;
	},
	getMovies: function() {
		movies = $.ajax("http://data.tmsapi.com/v1.1/movies/showings?startDate=" +
			date + "&numDays=1&lat=39.708582&lng=-105.076251%radius=1&units=mi&api_key=5p8sgppbuvrcwt9h6szyjy3u", {
				error: function(){
					$("#movieListItems").append('<li>There was a problem<br> loading the film list.</li>')
				}
			});
	},
	masterList: [
		{
			title: 'Belmar Library',
			id: 'library',
			url: 'http://www.jeffcolibrary.org/locations/belmar-library',
			address: '555 S. Allison Pkwy., Lakewood, CO 80226',
			blurb: 'The roof is shaped like an open book.',
			lat: 39.706475,
			lng: -105.084184,
			visibility: ko.observable(true)
		},
		{
			title: 'Belmar Park playground',
			id: 'playground',
			url: 'http://www.lakewood.org/BelmarPark/',
			address: '801 S. Wadsworth Blvd., Lakewood, CO 80226',
			blurb: 'An unusual playground with faux rocks and ropes to climb and balance on.<br> The rest of the park is cool, too.',
			lat: 39.706528,
			lng: -105.089693,
			visibility: ko.observable(true)
		},
		{
			title: 'Caution Brewing Co.',
			id: 'caution',
			url: 'http://www.cautionbrewingco.com/',
			address: '1057 S. Wadsworth Blvd. #60, Lakewood, CO 80226',
			blurb: 'Really low-key, semi-garage brewery vibe.',
			lat: 39.698176,
			lng: -105.082173,
			visibility: ko.observable(true)
		},
		{
			title: 'Century 16 Belmar',
			id: 'century',
			url: 'http://www.cinemark.com/theatre-detail.aspx?node_id=1683&',
			address: '440 S. Teller St., Lakewood, CO 80226',
			blurb: 'Located in the sprawling Belmar shopping center.<br> See what\'s showing by clicking \"Movies\" in the nav.',
			lat: 39.708582,
			lng: -105.076251,
			visibility: ko.observable(true)
		},
		{
			title: 'Dark Matter Games',
			id: 'darkmatter',
			url: 'http://dmgcolorado.com/',
			address: '1050 S. Wadsworth Blvd., Lakewood, CO 80226',
			blurb: 'Never been here, wonder how the selection is.',
			lat: 39.698142,
			lng: -105.080060,
			visibility: ko.observable(true)
		}
	],
	newMarkers: [],
	deleteItem: function(list, markerIndex) {
		// we know what the hardcoded marker index is, need to find
		// where it actually is in the array
		var findIndex = function() {
			for (var i = 0, len = list().length; i < len; i++) {
			if (list()[i].markerIndex == markerIndex) return i;
			}
		};
		var foundIndex = findIndex(markerIndex);
		viewModel.marks()[markerIndex].marker.setMap(null);
		list.splice(foundIndex, 1);
		//localStorage["savedList"] = ko.toJSON(Model.masterList);
	},
	pushItem: function(list, markerIndex) {
		// we know what the hardcoded marker index is, need to find
		// where it actually is in the array
		var findIndex = function() {
			for (var i = 0, len = list().length; i < len; i++) {
				if (list()[i].marker.markerIndex == markerIndex) return i;
			}
		};
		var foundIndex = findIndex(markerIndex);
		var here = list()[foundIndex];
		here.title = window.prompt("Please enter a title for this entry", here.title);
		here.marker.setIcon("https://maps.gstatic.com/mapfiles/ms2/micons/red-pushpin.png");
		viewModel.marks.push(here);
		viewModel.addListeners(here.marker, here.infowindow, here.markerIndex);
		//localStorage["savedList"] = ko.toJSON(Model.masterList);
	}
};

var prevWindow;
var prevMarker;
var counter = 0;
// this function gets called once the map has been loaded
var addMarkers = function(list){
	for (var i = 0, len = list.length; i < len; i++) {
		var here = list[i];
		here.marker = new google.maps.Marker({
			position: {lat: here.lat, lng: here.lng},
			map: map,
			title: here.title,
			icon: here.icon,
			markerIndex: (function(indexCopy){
				return indexCopy;
			})(counter)
		});
		// do a few things for items added by the user
		var ifAdd = "";
		if (!here.blurb) {
			here.blurb = "";
			// event listener uses double-click on marker to call pushItem
			google.maps.event.addListener(here.marker, 'dblclick', function() {
			Model.pushItem(viewModel.addedMarks, this.markerIndex);
			});
			ifAdd = "<p class='windowTip'>Double-tap the icon to save to your map</p>";
		};
		// build the default infoWindows
		here.infowindow = new google.maps.InfoWindow({
			content: "<h2>" + here.title + "</h2><p class='infoText'>" + here.blurb + "</p>" +
				"<p class='infoDetails'>" + here.address + "</p><p><a href='#'" +
				" onClick='Model.deleteItem(viewModel.marks," + here.markerIndex + ")'>delete</a></p>" + ifAdd
		});
		if (here.url) {
			here.infowindow.content = here.infowindow.content + "<p class='infoWebsite'><a href='" + here.url + "'>website</a></p>";
		}
		viewModel.addListeners(here.marker, here.infowindow, here.markerIndex);
		counter++;
	}
};

var viewModel = {
    marks: ko.observableArray(Model.masterList),
    addedMarks: ko.observableArray(Model.newMarkers),
	movies: ko.observableArray([]),
    filterQuery: ko.observable(''),
    addListeners: function(marker, infowindow, index) {
    			// IIFE for click listeners
		(function(markerCopy, infoWindowCopy, indexCopy){
				// click listener for marker pins
				markerCopy.addListener('click', function(){
					infoWindowCopy.open(map, markerCopy);
					if (prevWindow) {
						prevWindow.close();
					};
					prevWindow = infoWindowCopy;
					if (prevMarker) {
						prevMarker.setAnimation(null);
					};
					markerCopy.setAnimation(google.maps.Animation.BOUNCE);
					prevMarker = markerCopy;
				});
				infoWindowCopy.addListener('closeclick', function(){
					markerCopy.setAnimation(null);
				})
				// click listener for list of places
				$("#" + indexCopy).click(function(){
					infoWindowCopy.open(map, markerCopy);
					if (prevWindow) {
						prevWindow.close();
					};
					prevWindow = infoWindowCopy;
					if (prevMarker) {
						prevMarker.setAnimation(null);
					};
					markerCopy.setAnimation(google.maps.Animation.BOUNCE);
					prevMarker = markerCopy;
				});
			})(marker, infowindow, index);
		},
    search: function(value) {
        for(var x in Model.masterList) {
        	// hide list items and markers and close any open infowindows
        	var here = Model.masterList[x];
        	here.visibility(false);
        	here.marker.setVisible(false);
        	here.infowindow.close();
        	// if the user enters something in the search field that matches
        	// something in either the title or blurb of one of the objects,
        	// that object's list item and marker are added back to the map
        	if(here.title.toLowerCase().indexOf(value.toLowerCase()) >= 0 || here.blurb.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
            	here.visibility(true);
            	here.marker.setVisible(true);
        	}
        }
    },

    };

viewModel.filterQuery.subscribe(viewModel.search);
Model.loadMarkerCount();
ko.applyBindings(viewModel);

var View = {
	init: function(){
		$("#about").popover({
			"trigger": "hover | focus"
		})
	},
}

View.init();
Model.init();