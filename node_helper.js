/* Magic Mirror
 * Module: HH-LocalTransport
 *
 * By Martin Schaef
 * Adopted from Georg Peters (https://lane6.de)
 * based on a Script from Benjamin Angst http://www.beny.ch
 * MIT Licensed.
 */

const NodeHelper = require("node_helper");
const Mta = require('mta-gtfs');

module.exports = NodeHelper.create({

		start: function () {
	    	this.started = false;			
	  	},


		/* updateTimetable(transports)
		 * Calls processTrains on succesfull response.
		 */
		updateTimetable: function() {			
			var mta = new Mta({
					key: this.config.apiKey,
					feed_id: this.config.feedId
			});
			this.trains = [];
			for (var i in this.config.stations) {
				var station = this.config.stations[i];
				var current = this;
				mta.schedule(station.stopId).then(function (result) {
					var trains = current.parseData(result, station);
					current.loaded = true;
					current.sendSocketNotification("TRAINS", trains);
				});
			}
		},


		parseData: function(result, station) {
			var data = []
			var mtatrains = result['schedule'][station.stopId][station.direction];
			console.log(mtatrains);
			for (var j in mtatrains) {
				var t = mtatrains[j];
				if (station.trains.toString().includes(t.routeId)) {
					var now = (+ new Date())/1000;
					var scheduled = t['departureTime'];
				    var sec_num = parseInt(scheduled-now, 10); // don't forget the second param
				    var hours   = Math.floor(sec_num / 3600);
				    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);							
					var train = {
						departureTimestamp: minutes,
						delay: t.delay,
						name: t.routeId,
					};
					data.push(train);
				}
			}
			return data;
		},

		/* scheduleUpdate()
		 * Schedule next update.
		 * argument delay number - Millis econds before next update. If empty, this.config.updateInterval is used.
		 */
		scheduleUpdate: function(delay) {
			var nextLoad = this.config.updateInterval;
			if (typeof delay !== "undefined" && delay >= 0) {
				nextLoad = delay;
			}

			var self = this;
			clearTimeout(this.updateTimer);
			this.updateTimer = setTimeout(function() {
				self.updateTimetable();
			}, nextLoad);
		},

		socketNotificationReceived: function(notification, payload) {
		  const self = this;
		  if (notification === 'CONFIG' && this.started == false) {
		    this.config = payload;	     
		    this.started = true;		    
		    self.scheduleUpdate(this.config.initialLoadDelay);
		    };
		  }
});
