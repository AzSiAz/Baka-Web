/* global checkDate */
var base_url = 'http://azsiaz.tech:3001/';
var data = new Data();

$(document).on('ready', function() {
	getDataReady();
	
	window.onresize = resize;
	
	window.onorientationchange = orientationchange;
	
	$('form').submit(function(e) {
		e.preventDefault();
	})
	
	$('#force').click(function(e) {
		e.preventDefault();
		if ($('#force').hasClass('click')) {
			$('div#data').html('');
			$('#force').removeClass('click');
			if (window.innerWidth >= 767) {
				$('form.form-inline').animate({'margin-top': '150px'}, 'fast');
			}
		}
		else {
			if (window.innerWidth >= 767) {
				$('form.form-inline').animate({'margin-top': '10px'}, 'fast', function() {
					$('#force').addClass('click');
					$('div#data').html('');
					displayWheel(true);
					bootstrapCard();
					displayWheel(false);
				});
			}
			else {
				$('#force').addClass('click');
				$('div#data').html('');
				displayWheel(true);
				bootstrapCard();
				displayWheel(false);
			}
		}
	})
	
  	$('#input').keyup(function(e) {
		if ($('#input').val().length == 0 && window.innerWidth >= 767) {
			$('div#data').html('');
			if (!$('#force').hasClass('click')) {
				$('form.form-inline').animate({'margin-top': '150px'}, 'fast');	
			}
		}
		else if ($('#input').val().length == 0 && window.innerWidth < 767) {
			$('div#data').html('');
		}
		
		if($('#input').val().length >= 1 && window.innerWidth >= 767 || $('#force').hasClass('click')) {
			$('form.form-inline').animate({'margin-top': '10px'}, 'fast', function() {
				$('div#data').html('');
				displayWheel(true);
				bootstrapCard();
				displayWheel(false);
			});
		}
		else if ($('#input').val().length >= 1 && window.innerWidth < 767 || $('#force').hasClass('click')) {
			$('div#data').html('');
			displayWheel(true);
			bootstrapCard();
			displayWheel(false);
		}
  	});
	
	$('select#type').on('change', function(e) {
		e.preventDefault();
		changeConfig('type', $('select#type').val());
		getTypeByVal();
		getNovelList().then(function(res) {
			if ($('#input').val().length >= 1 || $('#force').hasClass('click')) {
				$('div#data').html('');
				bootstrapCard();	
			}
		})
	})
	
	$('select#lang').on('change', function(e) {
		e.preventDefault();
		changeConfig('lang', $('select#lang').val());
		getNovelList().then(function(res) {
			if ($('#input').val().length >= 1 || $('#force').hasClass('click')) {
				$('div#data').html('');
				bootstrapCard();
			}
		})
	})
})

function getDataReady() {
    if (checkDates()) {
		localStorage.clear();
	}
	if (localStorage.getItem('config')) {
		getTypeByVal();
		getNovelList();
	}
	else {
		localStorage.setItem('date', moment());
		localStorage.setItem('config', JSON.stringify({
			'type': 'Light_novel',
			'lang': 'English'
		}))
		getTypeByVal();
		getNovelList();
	}
}

function displayWheel(param) {
	if (param) {
		$('div.loading').css('display', 'inline-block');
	}
	else {
		$('div.loading').css('display', 'none');
	}
}

function disabledSelect(param) {
	if (param) {
		$('select').attr('disabled', 'disabled');
	} else {
		$('select').removeAttr('disabled');
	}
}

function getNovelList() {
	return new Promise(function(resolve, reject) {
		displayWheel(true);
		disabledSelect(true);
		var config = JSON.parse(localStorage.getItem('config'));
		switch (config.type) {
			case 'Light_novel':
				if (localStorage.getItem('novelList_' + config.type + '_' + config.lang)) {
					displayWheel(false);
					disabledSelect(false);
					resolve(true);
				}
				else {
					$.get(base_url + 'ln/' + config.lang, function(res) {
						localStorage.setItem('novelList_' + config.type + '_' + config.lang, JSON.stringify(res));
						makeSelect(JSON.parse(localStorage.getItem('typeAndLang')), config);
						displayWheel(false);
						disabledSelect(false);
						resolve(true);
					});
				}
				break;
			case 'Teaser':
				if (localStorage.getItem('novelList_' + config.type + '_' + config.lang)) {
					displayWheel(false);
					disabledSelect(false);
					resolve(true);
				}
				else {
					$.get(base_url + 'teaser/' + config.lang, function(res) {
						localStorage.setItem('novelList_' + config.type + '_' + config.lang, JSON.stringify(res));
						makeSelect(JSON.parse(localStorage.getItem('typeAndLang')), config);
						displayWheel(false);
						disabledSelect(false);
						resolve(true);
					});
				}
				break;
			case 'Web_novel':
				if (localStorage.getItem('novelList_' + config.type + '_' + config.lang)) {
					displayWheel(false);
					disabledSelect(false);
					resolve(true);
				}
				else {
					$.get(base_url + 'wln/' + config.lang, function(res) {
						localStorage.setItem('novelList_' + config.type + '_' + config.lang, JSON.stringify(res));
						makeSelect(JSON.parse(localStorage.getItem('typeAndLang')), config);
						displayWheel(false);
						disabledSelect(false);
						resolve(true);
					});
				}
				break;
			default:
				displayWheel(false);
				disabledSelect(false);
				console.log('Not Found');
				reject(false);
				break;
		}
	})
}

function getTypeByVal() {
	displayWheel(true);
	disabledSelect(true);
	if (localStorage.getItem('typeAndLang')) {
		var res = JSON.parse(localStorage.getItem('typeAndLang'));
		makeSelect(res, JSON.parse(localStorage.getItem('config')));
		displayWheel(false);
		disabledSelect(false);
	}
	else {
		$.get(base_url + 'list/types/', function(res) {
			localStorage.setItem('typeAndLang', JSON.stringify(res));
			makeSelect(res, JSON.parse(localStorage.getItem('config')));
			displayWheel(false);
			disabledSelect(false);
		});
	}
}

function createCard(data) {
	var orientation = (window.orientation == '90' || window.orientation == '-90') ? 'col-xs-6' : '';
	$('div#data').append('<div class="col-sm-3 col-md-3 ' + orientation + '">\
							 <div class="thumbnail" title="' + data.title + '">\
								<img id="' + data.page + '" class="lazy" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjQyIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDI0MiAyMDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjwhLS0KU291cmNlIFVSTDogaG9sZGVyLmpzLzEwMCV4MjAwCkNyZWF0ZWQgd2l0aCBIb2xkZXIuanMgMi42LjAuCkxlYXJuIG1vcmUgYXQgaHR0cDovL2hvbGRlcmpzLmNvbQooYykgMjAxMi0yMDE1IEl2YW4gTWFsb3BpbnNreSAtIGh0dHA6Ly9pbXNreS5jbwotLT48ZGVmcz48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwhW0NEQVRBWyNob2xkZXJfMTUxNjIyYTM1MzAgdGV4dCB7IGZpbGw6I0FBQUFBQTtmb250LXdlaWdodDpib2xkO2ZvbnQtZmFtaWx5OkFyaWFsLCBIZWx2ZXRpY2EsIE9wZW4gU2Fucywgc2Fucy1zZXJpZiwgbW9ub3NwYWNlO2ZvbnQtc2l6ZToxMnB0IH0gXV0+PC9zdHlsZT48L2RlZnM+PGcgaWQ9ImhvbGRlcl8xNTE2MjJhMzUzMCI+PHJlY3Qgd2lkdGg9IjI0MiIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFRUVFRUUiLz48Zz48dGV4dCB4PSI4OS44NTE1NjI1IiB5PSIxMDUuMzYyNSI+MjQyeDIwMDwvdGV4dD48L2c+PC9nPjwvc3ZnPg==" alt="Placeholder">\
								<div class="caption">\
									<p class="text-center title">' + smartTrim(data.title, 35, ' ', '...') + '</p>\
									<br>\
									<p class="text-center">\
									<a href="novel.html?title=' + encodeURIComponent(data.page) + '" class="btn btn-primary" role="button">Details</a>\
									<a href="https://www.baka-tsuki.org/project/index.php?title=' + data.page + '" target="_blank" class="btn btn-primary" role="button">Baka-Tsuki</a>\
									</p>\
								</div>\
							  </div>\
							</div>\
	');
}

function getCover(id, config) {
    data.getItem(id + '_' + config.lang).then(function(res) {
        if (res.val) {
            $('img[id="' + id + '"]').attr('src', res.val.cover);
        }
        else {
            $('img[id="' + id + '"]').attr('src', 'assets/img/not_found.jpg');
        }
    }, function(err) {
        $.get(base_url + 'title/query/?title=' + id, function(res) {
            data.setItem(id + '_' + config.lang, res)
            $('img[id="' + id + '"]').attr('src', res.cover);
        })
    })
}

function bootstrapCard() {
	var config = JSON.parse(localStorage.getItem('config'));
	var data = JSON.parse(localStorage.getItem('novelList_' + config.type + '_' + config.lang));
	data.titles.forEach(function(element) {
		if (element.title.toLowerCase().indexOf($('#input').val().toLowerCase()) > - 1) {
			createCard(element);
			getCover(element.page, config);
		}
	}, this);
	if ($('div#data').children().length == 0) {
		$('div#data').html('<h1 class="text-center">Sorry, novel not found on BT</h1>');
	}
}

function makeSelect(res, config) {
	$('select#type').html('');
	$('select#lang').html('');
	res.forEach(function(element) {
		if (element.types == config.type || element.types == 'Light_novel') {
			$('select#type').append('<option value="' + element.types + '" selected>' + element.types.replace(/_/g, " ") + '</option>');
		}
		else {
			$('select#type').append('<option value="' + element.types + '">' + element.types.replace(/_/g, " ") + '</option>');
		}
		if (element.types == config.type) {
			var position = element.language.indexOf(config.lang);
			element.language.forEach(function(element2) {
				if (position !== -1) {
					if (element2 == config.lang) {
						$('select#lang').append('<option value="' + element2 + '" selected>' + element2.replace(/_/g, " ") + '</option>');
					}
					else {
						$('select#lang').append('<option value="' + element2 + '">' + element2.replace(/_/g, " ") + '</option>');
					}
				}
				else {
					if (element2 == 'English') {
						changeConfig('lang', 'English');
						$('select#lang').append('<option value="' + element2 + '" selected>' + element2.replace(/_/g, " ") + '</option>');
					}
					else {
						$('select#lang').append('<option value="' + element2 + '">' + element2.replace(/_/g, " ") + '</option>');
					}
				}
			}, this);
		}
	}, this);
}

function changeConfig(key, value) {
	var configObj = JSON.parse(localStorage.getItem('config'));
	configObj[key] = value;
	localStorage.setItem('config', JSON.stringify(configObj));
}

function smartTrim(str, length, delim, appendix) {
    if (str.length <= length) return str;

    var trimmedStr = str.substr(0, length+delim.length);

    var lastDelimIndex = trimmedStr.lastIndexOf(delim);
    if (lastDelimIndex >= 0) trimmedStr = trimmedStr.substr(0, lastDelimIndex);

    if (trimmedStr) trimmedStr += appendix;
    return trimmedStr;
}

function resize() {
	if (window.innerWidth >= 767 && $('#force').hasClass('click')) {
		$('form.form-inline').css('margin-top', '10px');
	}
	else if(window.innerWidth >= 767 && !$('#force').hasClass('click') && $('div#data').children().length == 0) {
		$('form.form-inline').css('margin-top', '150px');
	}
	else if(window.innerHeight < 767) {
		$('form.form-inline').css('margin-top', '10px');
	}
}

function orientationchange() {
	// console.log(window.orientation);
	if (window.innerWidth < 768 && $('#force').hasClass('click') && (window.orientation == '90' || window.orientation == '-90')) {
		$('div.thumbnail').map(function(i, element) {
			$(element).parent().addClass('col-xs-6');
		})
	}
	if (window.innerWidth < 768 && $('#force').hasClass('click') && window.orientation == '0') {
		$('div.thumbnail').map(function(i, element) {
			$(element).parent().removeClass('col-xs-6');
		})
	}
}