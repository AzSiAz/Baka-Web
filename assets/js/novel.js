var base_url = 'https://api.azsiaz.tech/';
var novel = '';
var data = new Data();

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
    data.getItem(novel + '_' + config.lang).then(function(res) {
        $('#title').text(res.val.title.replace(/_/g, ' '))
        $('img#cover').attr('src', res.val.cover)
        $('#synopsis').text(res.val.synopsis)
    }, function(err) {
        console.log('Error')
    })
})

function getTitle(url) {
	url = url.replace("?", '');
	var last = url.indexOf('&');
	return url.slice(6, last >=0 ? last:url.length);
}
