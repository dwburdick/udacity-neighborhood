var ViewModel = function() {	setMarkers = [
			{
				title: 'Belmar Library',
				url: 'http://www.jeffcolibrary.org/locations/belmar-library',
				address: '555 S. Allison Pkwy., Lakewood, CO 80226',
				blurb: 'The roof is shaped like an open book.',
				lat: 39.706475,
				lng: -105.084184
			},
			{
				title: 'Caution Brewing Co.',
				url: 'http://www.cautionbrewingco.com/',
				address: '1057 S. Wadsworth Blvd. #60, Lakewood, CO 80226',
				blurb: 'Really low-key, semi-garage brewery vibe.',
				lat: 39.698176,
				lng: -105.082173
			},
			{
				title: 'Century 16 Belmar',
				url: 'http://www.cinemark.com/theatre-detail.aspx?node_id=1683&',
				address: '440 S. Teller St., Lakewood, CO 80226',
				blurb: 'Located in the sprawling Belmar shopping center.',
				lat: 39.708582,
				lng: -105.076251,
				showtimes: true
			},
			{
				title: 'Dark Matter Games',
				url: 'http://dmgcolorado.com/',
				address: '1050 S. Wadsworth Blvd., Lakewood, CO 80226',
				blurb: 'Never been here, wonder how the selection is.',
				lat: 39.698142,
				lng: -105.080060
			}
		]

	var today = new Date();
	var yyyy = today.getFullYear();
	var mm = today.getMonth() + 1;
	var dd = today.getDate();
	movies = $.ajax("http://data.tmsapi.com/v1.1/movies/showings?startDate=" + yyyy + "-" + mm + "-"+ dd + "&numDays=1&lat=39.708582&lng=-105.076251%radius=1&units=mi&api_key=5p8sgppbuvrcwt9h6szyjy3u");
	showtimes = ko.observableArray([]);
}

ViewModel();

ko.applyBindings(new ViewModel);

var loadShowtimes = function(){
	for (i in movies.responseJSON) {
	showtimes.push(movies.responseJSON[i].title);
	};
};

$(document).ready(function(){
	$("#listToggle").click(function(){
		console.log("CLICK");
		$("#mapListItems").toggle();
	});
	window.setTimeout(loadShowtimes, 1500);
});