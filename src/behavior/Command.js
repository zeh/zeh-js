(function(){
	"use strict";

	// Command delayer... based on Francis' Command (more or less same syntax())

	// ================================================================================================================
	// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

	DNP.Command = function(__function, __scope, __params) {
		// Properties
		this.func = __function;
		this.scope = __scope;
		this.params = __params;				// Misc parameters, as array

		this.timeStarted = 0;				// In ms
		this.timePaused = 0;				// In ms
		this.isExecuting = false;
		this.isPaused = false;
		this.timeoutId = null;

		this.delaySet = 0;					// In ms
	};

	DNP.Command.prototype = {};
	DNP.Command.prototype.constructor = DNP.Command;


	// ================================================================================================================
	// INTERNAL INTERFACE -----------------------------------------------------------------------------------------------

	DNP.Command.prototype.createTimeout = function(__delay) {
		this.delaySet = __delay;
		this.timeStarted = DNP.getTimer();
		if (this.executeNow.bind) {
			this.timeoutId = window.setTimeout(this.executeNow.bind(this), this.delaySet);
		} else {
			// Browser does not support binding
			var __obj = this;
			this.timeoutId =  window.setTimeout(function() { __obj.executeNow.call(__obj); });
		}
	};

	DNP.Command.prototype.executeNow = function() {
		this.func.apply(this.scope, this.params);
		this.cancel();
	};


	// ================================================================================================================
	// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

	DNP.Command.prototype.execute = function(__delay) {
		// delay is in seconds
		if (__delay == undefined) __delay = 0;
		this.cancel();
		this.createTimeout(__delay * 1000);
		this.isExecuting = true;
	};

	DNP.Command.prototype.cancel = function() {
		if (this.isExecuting) {
			window.clearTimeout(this.timeoutId);
			this.timeoutId = null;
			this.isExecuting = false;
			this.isPaused = false;
		}
	};

	DNP.Command.prototype.pause = function() {
		if (this.isExecuting && !this.isPaused) {
			this.timePaused = DNP.getTimer();
			this.isPaused = true;
		}
	};

	DNP.Command.prototype.resume = function() {
		if (this.isExecuting && this.isPaused) {
			this.timePassed = this.timePaused - this.timeStarted;
			this.createTimeout(this.delaySet - this.timePassed);
			this.isPaused = false;
		}
	};

})();
