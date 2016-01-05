/* global moment */
function checkDates(date) {
	if (localStorage.getItem('date')) {
		var date = localStorage.getItem('date');
		if (moment(date).isBefore(moment(), 'day')) {
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