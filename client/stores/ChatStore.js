var _ = require('lodash');
var Store = require('store-prototype');
var request = require('superagent');

var ChatStore = new Store();

var loaded = false;
var rooms = {};

var REFRESH_INTERVAL = 5000; // 5 seconds

var refreshTimeout = null;
function cancelRefresh() {
	clearTimeout(refreshTimeout);
}

ChatStore.extend({

	getRooms: function() {
		return rooms;
	},

	isLoaded: function() {
		return loaded ? true : false;
	},

	getRoomData: function(callback) {
		// ensure any scheduled refresh is stopped,
		// in case this was called directly
		cancelRefresh();
		// request the update from the API
		request
			.get('/api/chats/' )
			.end(function(err, res) {
				if (err) {
					console.log('Error with the AJAX request: ', err)
				}
				if (!err && res.body) {
					loaded = true;
					rooms = res.body.rooms;
					ChatStore.notifyChange();
				}
				ChatStore.queueRefresh();
				return callback && callback(err, res.body);
			});
	},

	queueRefresh: function() {
		refreshTimeout = setTimeout(ChatStore.getRoomData, REFRESH_INTERVAL);
	}

});

ChatStore.getRoomData();
module.exports = ChatStore;
