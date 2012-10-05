(function(){
	"use strict";

	window.ZTween = window.ZTween || {
		version: "1.0"
	};

	// ================================================================================================================
	// SHIMS ----------------------------------------------------------------------------------------------------------

	// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	(function() {
		var lastTime = 0;
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
			window.cancelRequestAnimationFrame = window[vendors[x]+'CancelRequestAnimationFrame'];
		}

		if (!window.requestAnimationFrame) {
			if (window.console && window.console.log) window.console.log("No window.requestAnimationFrame() function available; creating shim");
			window.requestAnimationFrame = function(callback, element) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(16, 16 - (currTime - lastTime)); // Forces 20fps
				//var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = window.setTimeout(function() { callback(currTime + timeToCall); },
				  timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};
		}

		if (!window.cancelAnimationFrame) {
			window.cancelAnimationFrame = function(id) {
				clearTimeout(id);
			};
		}
	}())

	// ================================================================================================================
	// EQUATIONS ------------------------------------------------------------------------------------------------------

	window.Equations = function() {};

	// Static constants

	Equations.HALF_PI = Math.PI / 2;
	Equations.TWO_PI = Math. PI * 2,

	// Static functions
	Equations.none = function(t) {
		return t;
	};
	Equations.quadIn = function(t) {
		return t*t;
	};
	Equations.quadOut = function(t) {
		return -t * (t-2);
	};
	Equations.quadInOut = function(t) {
		return ((t *= 2) < 1) ? t * t * 0.5 : -0.5 * (--t * (t-2) - 1);
	};

	Equations.quintIn = function(t) {
		return t*t*t*t*t;
	};
	Equations.quintOut = function(t) {
		t--;
		return t*t*t*t*t + 1;
	};
	Equations.quintInOut = function(t) {
		return (t *= 2) < 1 ? quintIn(t)/2 : quintOut(t-1)/2+0.5; // TODO: redo with in-line calculation?
	};

	Equations.expoIn = function(t) {
		return (t==0) ? 0 : Math.pow(2, 10 * (t - 1)) - 0.001;
	};
	Equations.expoOut = function(t) {
		return (t==1) ? 1 : 1.001 * (-Math.pow(2, -10 * t) + 1);
	};
	Equations.expoInOut = function(t) {
		return (t *= 2) < 1 ? expoIn(t)/2 : expoOut(t-1)/2+0.5;
	};

	// ================================================================================================================
	// STATIC INTERFACE -----------------------------------------------------------------------------------------------

	// Methods
	ZTween.init = function() {

		// JavaScript properties
		ZTween.hasEngine = false;

		// Static properties
		ZTween.currentTime = ZTween.getTimer();
		ZTween.currentTimeFrame = 0;

		ZTween.tweens = [];

		// Temp vars
		ZTween.i = 0;
		ZTween.l = 0;

		ZTween.onFrameTick = new SimpleSignal();

		if (!this.hasEngine) {
			this.hasEngine = true;
			this.frameTick();
		}
	};

	ZTween.getTimer = function () {
		return new Date().getTime();
	};

	ZTween.updateTweens = function() {
		this.l = this.tweens.length;
		for (this.i = 0; this.i < this.l; this.i++) { // ++i had no impact, must test more
			if (this.tweens[this.i] == null || !this.tweens[this.i].update(this.currentTime, this.currentTimeFrame)) {
				this.tweens.splice(this.i, 1);
				this.i--;
				this.l--;
			}
		}
	};

	ZTween.frameTick = function() {
		// Request frame
		window.requestAnimationFrame(ZTween.frameTick);

		// Update time
		ZTween.currentTime = ZTween.getTimer();

		// Update frame
		ZTween.currentTimeFrame++;

		// Update all tweens
		ZTween.updateTweens();

		ZTween.onFrameTick.dispatch();
	};

	ZTween.tweenValue = function(__target, __properties, __parameters) {
		var t = new ZTween.Tween(__target, __properties, __parameters);
		this.tweens.push(t);
		return t;
	};

	ZTween.tweenFunction = function(__target, __properties, __parameters) {
		var t = new ZTween.FunctionTween(__target, __properties, __parameters);
		this.tweens.push(t);
		return t;
	};

	ZTween.remove = function(__target, __properties, __parameters) {
		// TODO: this is used to remove FunctionTweens too.. create a separate function?
		var tl = [];

		var l = this.tweens.length;
		var i;
		var j;

		for (i = 0; i < l; i++) {
			if (this.tweens[i] != undefined && this.tweens[i].target == __target) {
				if (__properties != undefined && __properties.length > 0) {
					for (j = 0; j < this.tweens[i].properties.length; j++) {
						if (__properties.indexOf(this.tweens[i].properties[j].name) > -1) {
							this.tweens[i].properties.splice(j, 1);
							j--;
						}
					}
					if (this.tweens[i].properties.length == 0) tl.push(this.tweens[i]);
				} else {
					tl.push(this.tweens[i]);
				}
			}
		}

		var removedAny = false;

		l = tl.length;

		for (i = 0; i < l; i++) {
			j = this.tweens.indexOf(tl[i]);
			this.removeTweenByIndex(j);
			removedAny = true;
		}

		return removedAny;
	};

	ZTween.removeTweenByIndex = function(__i) {
		this.tweens[__i] = null;
	};

	// ================================================================================================================
	// INSTANCES INTERFACE --------------------------------------------------------------------------------------------

	// ----------------------------------------------------------------------------------------------------------------
	// TWEEN ----------------------------------------------------------------------------------------------------------

	ZTween.Tween = function(__target, __properties, __parameters) {

		// Instance properties
		this.target = __target;
		this.numProps = 0;

		this.timeStart = ZTween.currentTime;
		this.timeDuration = 0;
		this.transition = Equations.none;

		this.timePaused = 0;
		this.started = false;

		this.onStart = new SimpleSignal();
		this.onUpdate = new SimpleSignal();
		this.onComplete = new SimpleSignal();

		this.onStartScope = null;
		this.onUpdateScope = null;
		this.onCompleteScope = null;

		this.onStartParams = null;
		this.onUpdateParams = null;
		this.onCompleteParams = null;

		// External properties
		this._paused = false;
		this._useFrames = false;

		// Temporary variables to avoid disposal
		this.t = 0;
		this.tProperty = {};
		this.pv = 0;
		this.i = 0;
		this.cTime = 0;

		this.readTweenProperties(__properties);

		// Read parameters
		if (__parameters != undefined) {
			this.pv = __parameters.time;
			if (!isNaN(this.pv)) this.timeDuration = this.pv * 1000;

			this.pv = __parameters.delay;
			if (!isNaN(this.pv)) this.timeStart += this.pv * 1000;

			if (__parameters.transition != undefined) this.transition = __parameters.transition;
			if (__parameters.onStart != undefined) this.onStart.add(__parameters.onStart, __parameters.onStartScope, __parameters.onStartParams);
			if (__parameters.onUpdate != undefined) this.onUpdate.add(__parameters.onUpdate, __parameters.onUpdateScope, __parameters.onUpdateParams);
			if (__parameters.onComplete != undefined) this.onComplete.add(__parameters.onComplete, __parameters.onCompleteScope, __parameters.onCompleteParams);
		}

		this.timeComplete = this.timeStart + this.timeDuration;

	}

	ZTween.Tween.prototype = {};
	ZTween.Tween.prototype.constructor = ZTween.Tween;

	ZTween.Tween.prototype.readTweenProperties = function(__properties) {
		// Creates a list of all tweenable properties based on the list of properties passed as an object
		this.properties = [];
		for (var pname in __properties) {
			this.properties.push(new ZTween.TweenProperty(pname, 0, __properties[pname]));
		}
		this.numProps = this.properties.length;
	};

	ZTween.Tween.prototype.update = function(currentTime, currentTimeFrame) {

		if (this._paused) return true;

		this.cTime = this._useFrames ? currentTimeFrame : currentTime;

		if (this.started || this.cTime >= this.timeStart) {
			if (!this.started) {
				this.onStart.dispatch();

				for (this.i = 0; this.i < this.properties.length; this.i++) {
					// Property value not initialized yet
					this.tProperty = this.properties[this.i];

					// Directly read property
					this.pv = parseFloat(this.target[this.tProperty.name]);

					this.tProperty.valueStart = isNaN(this.pv) ? this.tProperty.valueComplete : this.pv; // If the property has no value, use the final value as the default
					this.tProperty.valueChange = this.tProperty.valueComplete - this.tProperty.valueStart;
				}
				this.started = true;
			}

			if (this.cTime >= this.timeComplete) {
				// Tweening time has finished, just set it to the final value
				for (this.i = 0; this.i < this.properties.length; this.i++) {
					this.tProperty = this.properties[this.i];
					this.target[this.tProperty.name] = this.tProperty.valueComplete + this.tProperty.unit;
				}

				this.onUpdate.dispatch();

				this.onComplete.dispatch();

				return false;

			} else {
				//console.log("tween :: normal update");

				// Tweening must continue
				this.t = this.transition((this.cTime - this.timeStart) / this.timeDuration);
				for (this.i = 0; this.i < this.numProps; this.i++) {
					this.tProperty = this.properties[this.i];
					this.target[this.tProperty.name] = Math.round(this.tProperty.valueStart + this.t * this.tProperty.valueChange) + this.tProperty.unit;
					//console.log("start ==> "+ this.tProperty.valueStart);
				}

				this.onUpdate.dispatch();
			}

		}

		return true;
	};

	// ----------------------------------------------------------------------------------------------------------------
	// FUNCTION TWEEN -------------------------------------------------------------------------------------------------

	ZTween.FunctionTween = function(__target, __properties, __parameters) {
		ZTween.Tween.call(this, __target, __properties, __parameters);

		//ZTween.tweenFunction(__item, {function:"setMouseFocused", to:1, from:__item.mouseFocused}, {time:DNP.MenuItemList.TIME_ITEM_ROLLOVER, transition:Equations.expoOut});
	};

	ZTween.FunctionTween.prototype = new ZTween.Tween();
	ZTween.FunctionTween.prototype.constructor = ZTween.FunctionTween;

	ZTween.FunctionTween.prototype.readTweenProperties = function(__properties) {
		//ZTween.FunctionTween.prototype.readTweenProperties.call(this, __properties);
		// Creates a list of all tweenable properties based on the list of properties passed as an object
		this.properties = [];
		this.properties.push(new ZTween.TweenProperty(__properties.setter, __properties.from, __properties.to));
		this.numProps = this.properties.length;
	};

	ZTween.FunctionTween.prototype.update = function(currentTime, currentTimeFrame) {

		if (this._paused) return true;

		this.cTime = this._useFrames ? currentTimeFrame : currentTime;

		if (this.started || this.cTime >= this.timeStart) {
			if (!this.started) {
				this.onStart.dispatch();

				this.started = true;
			}

			if (this.cTime >= this.timeComplete) {
				// Tweening time has finished, just set it to the final value
				for (this.i = 0; this.i < this.properties.length; this.i++) {
					this.tProperty = this.properties[this.i];
					this.target[this.tProperty.name](this.tProperty.valueComplete + this.tProperty.unit);
				}

				this.onUpdate.dispatch();

				this.onComplete.dispatch();

				return false;

			} else {
				//console.log("tween :: normal update");

				// Tweening must continue
				this.t = this.transition((this.cTime - this.timeStart) / this.timeDuration);
				for (this.i = 0; this.i < this.numProps; this.i++) {
					this.tProperty = this.properties[this.i];
					this.target[this.tProperty.name](this.tProperty.valueStart + this.t * this.tProperty.valueChange);
					//console.log("start ==> "+ this.tProperty.valueStart);
				}

				this.onUpdate.dispatch();
			}

		}

		return true;
	};

	// ----------------------------------------------------------------------------------------------------------------
	// TWEEN PROPERTY -------------------------------------------------------------------------------------------------

	ZTween.TweenProperty = function(__name, __valueStart, __valueComplete) {
		this.name = __name;
		this.valueStart = parseFloat(__valueStart);
		this.valueComplete = parseFloat(__valueComplete);
		this.unit = "";

		this.valueChange = __valueComplete - __valueStart;

		if (__valueComplete.length > 2 && __valueComplete.substr(-2, 2) == "px") this.unit = ZTween.TweenProperty.UNIT_PIXELS;
		if (__valueComplete.length > 1 && __valueComplete.substr(-1, 1) == "%") this.unit = ZTween.TweenProperty.UNIT_PERCENT;

	};
	ZTween.TweenProperty.prototype = {};
	ZTween.TweenProperty.prototype.constructor = ZTween.TweenProperty;

	ZTween.TweenProperty.UNIT_PERCENT = "%";
	ZTween.TweenProperty.UNIT_PIXELS = "px";

	// ================================================================================================================
	// END ------------------------------------------------------------------------------------------------------------

	ZTween.init();

})();
