/* global PouchDB */
/* global moment */
function checkDates(date) {
	if (localStorage.getItem('date')) {
		var date = localStorage.getItem('date');
		if (moment(new Date(date)).isBefore(moment(), 'day')) {
			return true;
		}
		else {
			return false;
		}
	}
	else {
		return false;
	}
}

function Data() {
    // var pouch = new PouchDB('mydb', {size: 100});
    var pouch = new PouchDB('mydb', {adapter: 'fruitdown'});
    
    Data.prototype.getItem = function getItem(key) {
        return new Promise(function(resolve, reject) {
            return pouch.get(key).then(function (doc) {
                resolve(doc)
            }).catch(function (err) {
                reject(err);
            });
        })
    }

    Data.prototype.setItem = function setItem(key, value) {
        return new Promise(function(resolve, reject) {
            return pouch.get(key).then(function(doc) {
                return pouch.put({
                    _id: key,
                    _rev: doc._rev,
                    val: value
                });
            }).then(function(response) {
                resolve(response)
            }).catch(function (err) {
                return pouch.put({
                        _id: key,
                        val: value
                }).then(function(response) {
                    resolve(response)
                }, function(err) {
                    reject(err)
                })
            })
        })
    }
    
    Data.prototype.removeItem = function removeItem(key) {
        return new Promise(function(resolve, reject) {
            return pouch.get(key).then(function(doc) {
                return pouch.remove(doc);
            }).then(function (result) {
                resolve(result);
            }).catch(function (err) {
                reject(err);
            });
        })
    }
    
    Data.prototype.destroyDatabase = function destroyDatabase() {
        pouch.destroy().then(function (response) {
            console.log('Database Deleted')
        }).catch(function (err) {
            console.log(err);
        });
    }
}