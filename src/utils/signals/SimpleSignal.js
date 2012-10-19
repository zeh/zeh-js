(function(){
	"use strict";

	// Super-simple signals class inspired by Robert Penner's AS3Signals:
	// http://github.com/robertpenner/as3-signals

	// ================================================================================================================
	// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

	window.SimpleSignal = function() {
		// Properties
		this.functions = [];				// [Function]
		this.scopes = [];					// []
		this.params = [];					// Misc parameters
	};

	SimpleSignal.prototype = {};
	SimpleSignal.prototype.constructor = SimpleSignal;


	// ================================================================================================================
	// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

	SimpleSignal.prototype.add = function(__function, __scope, __params) {
		// TODO: this check is not entirely correct (will fail if there's the same function, and the same scope, added to the list before the correct function+scope combination)
		if (this.functions.indexOf(__function) == -1 || this.scopes.indexOf(__scope) == -1 || this.functions.indexOf(__function) != this.scopes.indexOf(__scope)) {
			this.functions.push(__function);
			this.scopes.push(__scope);
			this.params.push(__params);
			return true;
		}
		return false;
	};

	SimpleSignal.prototype.remove = function(__function, __scope, __params) {
		var fp = this.functions.indexOf(__function);
		var removedAny = false;
		while (fp > -1) {
			if (this.scopes[fp] == __scope) {
				this.functions.splice(fp, 1);
				this.scopes.splice(fp, 1);
				this.params.splice(fp, 1);
				removedAny = true;
				fp -= 1;
			}
			fp = this.functions.indexOf(__function, fp+1);
		}
		return removedAny;
	};

	SimpleSignal.prototype.dispatch = function() {
		// Clone the arrays so it can work correctly even if a dispatched function removes a callback
		var fu = this.functions.slice(0);
		var sc = this.scopes.slice(0);
		var pa = this.params.slice(0);
		var l = fu.length;
		for (var i = 0; i < l; i++) {
			//fu[i].apply(sc[i], pa[i]);
			fu[i].apply(sc[i], pa[i] == undefined ? [] : pa[i]); // On IE 8, can't pass undefined as the second param
		}
	};

})();
