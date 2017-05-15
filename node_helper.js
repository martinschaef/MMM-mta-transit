/* Magic Mirror
 * Module: HH-LocalTransport
 *
 * By Martin Schaef
 * Adopted from Georg Peters (https://lane6.de)
 * based on a Script from Benjamin Angst http://www.beny.ch
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var Mta = require('mta-gtfs');

module.exports = NodeHelper.create({

	start: function () {
    	this.started = false;			
  	},


	/* updateTimetable(transports)
	 * Calls processTrains on succesfull response.
	 */
	updateTimetable: function() {			
		var self = this;
		var mta = new Mta({
				key: self.config.apiKey,
				feed_id: self.config.feedId
		});
		
		mta.status('subway').then(function (result) {
			self.sendSocketNotification("STATUS", result);
		});
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
	  console.log("Notification: " + notification);
	  if (notification === 'CONFIG' && this.started == false) {
	    this.config = payload;	     
	    this.started = true;		    
	    self.scheduleUpdate(this.config.initialLoadDelay);
	    };
	  }
});
