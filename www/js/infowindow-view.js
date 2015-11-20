var Model = {
	init: function() {
		Model.getDate();
		Model.getMovies();
		$(document).ready(function(){
			$("#listToggle").click(function(){
				$("#movieList").toggle();
			});
			window.setTimeout(Model.loadMovies, 900);
		});
	},
	loadMovies: function(){
		for (i in movies.responseJSON) {
		viewModel.showtimes.push(movies.responseJSON[i].title);
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
					$showtimes.append("<br>There was a problem getting a list of films.<br> Visit the theater's site for information.");
				}
			});
	},


};

var masterList = [
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
			blurb: 'Located in the sprawling Belmar shopping center.',
			lat: 39.708582,
			lng: -105.076251,
			showtimes: true,
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
	];

var addMarkers = function(){
	var counter = 0;
	for (i in masterList) {
		var here = masterList[i];
		here.marker = new google.maps.Marker({
			position: {lat: here.lat, lng: here.lng},
			map: map,
			title: here.title
		});
		here.infowindow = new google.maps.InfoWindow({
			content: "<h2>" + here.title + "</h2><p class='infoText'>" + here.blurb + "</p>" +
				"<p class='infoDetails'><a href='" + here.url + "'>website</a> | " + here.address +  "</p>",
		});
		(function(markerCopy, infoWindowCopy, counterCopy){
				// click listener for marker pins
				markerCopy.addListener('click', function(){
					infoWindowCopy.open(map, markerCopy);
					markerCopy.setAnimation(google.maps.Animation.BOUNCE);
				});
				infoWindowCopy.addListener('closeclick', function(){
					markerCopy.setAnimation(null);
				})
				// click listener for list of places
				$("#" + counterCopy).click(function(){
					infoWindowCopy.open(map, markerCopy);
					markerCopy.setAnimation(google.maps.Animation.BOUNCE);
				});
			})(here.marker, here.infowindow, counter);
		counter++
	}
};

var viewModel = {
    marks: ko.observableArray(masterList),
	showtimes: ko.observableArray([]),

    filterQuery: ko.observable(''),

    search: function(value) {
        for(var x in masterList) {
        	masterList[x].visibility(false);
        	masterList[x].marker.setVisible(false);
        	masterList[x].infowindow.close();
        	if(masterList[x].title.toLowerCase().indexOf(value.toLowerCase()) >= 0 || masterList[x].blurb.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
            	masterList[x].visibility(true);
            	masterList[x].marker.setVisible(true);
        	}
        }
    },

    };
viewModel.filterQuery.subscribe(viewModel.search);

ko.applyBindings(viewModel);

var View = {
	init: function(){
		$showtimes = $("#nowShowing");
	}
}


View.init();
Model.init();
