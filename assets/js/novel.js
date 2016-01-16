var base_url = 'http://azsiaz.tech:3001/';
var novel = '';

$('button.fab').click(function(e) {
	e.preventDefault();
	history.back();
});

$(document).on('ready', function() {	
    novel = decodeURIComponent(getTitle(window.location.search))
	if (checkDates()) {
		localStorage.clear();
	}
	var config = JSON.parse(localStorage.getItem('config'));
	var data = JSON.parse(localStorage.getItem(novel + '_' + config.lang));
    console.log(data);
	$('#title').text(data.title.replace(/_/g, ' '))
	$('img#cover').attr('src', data.cover)
	$('#synopsis').text(data.synopsis)
})

function getTitle(url) {
	url = url.replace("?", '');
	var last = url.indexOf('&');
	return url.slice(6, last >=0 ? last:url.length);
}