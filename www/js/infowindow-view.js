var Model = {
	init: function() {
		Model.getDate();
		Model.getMovies();
		$(document).ready(function(){
			$("#listToggle").click(function(){
				$("#mapListItems").toggle();
			});
			window.setTimeout(Model.loadMovies, 500);
		});
	},
	loadMovies: function(){
		for (i in movies.responseJSON) {
		showtimes.push(movies.responseJSON[i].title);
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
		movies = $.ajax("http://daBROKETHISTEMPORARILYta.tmsapi.com/v1.1/movies/showings?startDate=" +
			date + "&numDays=1&lat=39.708582&lng=-105.076251%radius=1&units=mi&api_key=5p8sgppbuvrcwt9h6szyjy3u", {
				error: function(){
					$showtimes.append("<br>There was a problem getting a list of films.<br> Visit the theater's site for information.");
				}
			});
		showtimes = ko.observableArray([]);
	},
};

var ViewModel = {
	init: function() {
		Model.init();
		View.init();
		ViewModel.markers();
		markerList = ViewModel.markers;
		listAdd = ViewModel.markerUpdate;
		ko.applyBindings({markerList, listAdd});
	},
	markerUpdate: function() {
		console.log("Updated!")
	},
	markers: ko.observableArray([
		{
			title: 'Belmar Library',
			id: 'library',
			url: 'http://www.jeffcolibrary.org/locations/belmar-library',
			address: '555 S. Allison Pkwy., Lakewood, CO 80226',
			blurb: 'The roof is shaped like an open book.',
			lat: 39.706475,
			lng: -105.084184
		},
		{
			title: 'Belmar Park playground',
			id: 'playground',
			url: 'http://www.lakewood.org/BelmarPark/',
			address: '801 S. Wadsworth Blvd., Lakewood, CO 80226',
			blurb: 'An unusual playground with faux rocks and ropes to climb and balance on.<br>' +
			'The rest of the park is cool, too.',
			lat: 39.706528,
			lng: -105.089693
		},
		{
			title: 'Caution Brewing Co.',
			id: 'caution',
			url: 'http://www.cautionbrewingco.com/',
			address: '1057 S. Wadsworth Blvd. #60, Lakewood, CO 80226',
			blurb: 'Really low-key, semi-garage brewery vibe.',
			lat: 39.698176,
			lng: -105.082173
		},
		{
			title: 'Century 16 Belmar',
			id: 'century',
			url: 'http://www.cinemark.com/theatre-detail.aspx?node_id=1683&',
			address: '440 S. Teller St., Lakewood, CO 80226',
			blurb: 'Located in the sprawling Belmar shopping center.',
			lat: 39.708582,
			lng: -105.076251,
			showtimes: true
		},
		{
			title: 'Dark Matter Games',
			id: 'darkmatter',
			url: 'http://dmgcolorado.com/',
			address: '1050 S. Wadsworth Blvd., Lakewood, CO 80226',
			blurb: 'Never been here, wonder how the selection is.',
			lat: 39.697449,
			lng: -105.080075
		}
	]),
	clickedMarkers: [''],
};

var View = {
	init: function(){
		$showtimes = $("#nowShowing");
	}
}

ViewModel.init();

