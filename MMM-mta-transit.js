/* MTA module for Magic Mirror 
 *
 */

Module.register("MMM-mta-transit",{

	// Define module defaults
	defaults: {
		updateInterval: 30 * 60 * 1000, // Update 30 minutes.
		initialLoadDelay: 0,
		apiKey: "",		
		trainStatus: ['Q'], //the trains for which status should be displayed
		statusId: ['DELAYS', 'SERVICE CHANGE'], //or PLANNED WORK    	
	},

	start: function() {
		Log.info("Starting module: " + this.name);		
		this.sendSocketNotification('CONFIG', this.config);
        this.servicsStatus = []
		this.updateTimer = null;
	},

	// Define styles.
	getStyles: function() {
		return ["MMM-mta-transit.css"];
	},
	
	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");

		if (!this.config.apiKey) {
			wrapper.innerHTML = "Set MTA Api key in config ...";
			wrapper.className = "dimmed light small";
			return wrapper;			
		}

		if (!this.loaded) {
			wrapper.innerHTML = "Loading MTA status ...";
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		wrapper.innerHTML = this.servicsStatus;
		// var table = document.createElement("table");
		// table.className = "small";

		return wrapper;
	},

	socketNotificationReceived: function(notification, payload) {		
		if (notification === "STATUS"){			
			Log.info("Status update received");
			this.servicsStatus = "";
			for (var k in payload) {
				var status = payload[k];
				var relevant = false;
				for (var i in this.config.trainStatus) {
					var trainChar = this.config.trainStatus[i];

					if (status["name"].toString().includes(trainChar)) {
						for (var j in this.config.statusId) {
							var sid = this.config.statusId[j];							
							if (sid === status['status']) {
								relevant = true;
								console.log(status);
								this.servicsStatus += "<span class=\"TrainName\" >"+ trainChar +" Train </span>\n"+status['text'];
								break;
							}
							if (relevant == true) { break; }
						}
					}
				}
			}
			if (this.servicsStatus.length==0) {
				this.servicsStatus = "<span class=\"TrainName\" > Trains look good :) </span>\n"			
			}
			this.loaded = true;
		 	this.updateDom();
		}
	}
});


