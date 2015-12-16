var base_url = 'https://azsiaz.tech:3003/';
var novel = '';

$('button.fab').click(function(e) {
	e.preventDefault();
	history.back();
});

$(document).on('ready', function() {	
	
	novel = getTitle(window.location.search)
	var config = JSON.parse(localStorage.getItem('config'));
	// console.log(config);
	// console.log(novel);
	var data = JSON.parse(localStorage.getItem(novel+ '_' + config.lang));
	console.log(data);
	$('img#cover').attr('src', (data.cover == undefined) ? '/img/not_found.jpg':data.cover)
	$('#synopsis').text(data.synopsis)
})

function getTitle(url) {
	url = url.replace("?", '');
	var last = url.indexOf('&');
	return url.slice(6, last >=0 ? last:url.length);
}