/* global moment */
function checkDate(date) {
	var now = moment()
	if (localStorage.getItem('date')) {
		var date = localStorage.getItem('date');
		if (moment().isBefore(date, 'day')) {
			return true;
		}
		else {
			return false;
		}
	}
	else {
		return false;
	}
;}