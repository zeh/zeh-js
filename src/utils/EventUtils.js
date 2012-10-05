(function(){
	"use strict";

	// Event fixes and polyfills
	// http://ejohn.org/projects/flexible-javascript-events/

	// ================================================================================================================
	// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

	window.EventUtils = function() {
		// No constructor
	};

	EventUtils.prototype = {};
	EventUtils.prototype.constructor = EventUtils;

	// ================================================================================================================
	// STATIC INTERFACE -----------------------------------------------------------------------------------------------

	// Constants
	EventUtils.EVENT_CLICK = "click";
	EventUtils.EVENT_MOUSE_UP = "mouseup";
	EventUtils.EVENT_MOUSE_DOWN = "mousedown";
	EventUtils.EVENT_MOUSE_MOVE = "mousemove";
	EventUtils.EVENT_MOUSE_OVER = "mouseover";
	EventUtils.EVENT_MOUSE_OUT = "mouseout";
	EventUtils.EVENT_MOUSE_WHEEL = "mousewheel";

	EventUtils.removeRefs = {};

	EventUtils.addEvent = function(__obj, __type, __function, __scope) {
		if (__obj.attachEvent) {
			__obj['e' + __type + __function] = __function;
			__obj[__type + __function] = function() { __obj['e'+__type + __function].call(__scope, window.event); };
			__obj.attachEvent( 'on'+__type, __obj[__type + __function]);
		} else {
			if (__scope != null) {
				// Has a scope, must create a bind
				if (__function.bind) {
					// Browser supports binds
					var boundFunc = __function.bind(__scope);
					EventUtils.removeRefs[__type + __function + __scope] = boundFunc; // Problem: this won't allow repeat listeners to be added
					__obj.addEventListener(__type, boundFunc, false);
				} else {
					// Browser doesn't support binds (iOS, maybe others)
					__obj['e' + __type + __function] = __function;
					__obj['s' + __type + __function] = __scope;
					__obj[__type + __function] = function(e) { __obj['e'+__type + __function].call(__obj['s'+__type + __function], event); };
					__obj.addEventListener(__type, __obj[__type + __function], false);
				}
			} else {
				// No scope, no binding necessary
				__obj.addEventListener(__type, __function, false);
			}
		}
	};
	EventUtils.removeEvent = function(__obj, __type, __function, __scope) {
		if (__obj.detachEvent) {
			__obj.detachEvent('on'+__type, __obj[__type + __function]);
			__obj[__type + __function] = null;
		} else {
			if (__scope != null) {
				if (__function.bind) {
					// Browser supports binds
					var boundFunc = EventUtils.removeRefs[__type + __function + __scope];
					if (boundFunc != undefined) {
						__obj.removeEventListener(__type, boundFunc, false);
						delete EventUtils.removeRefs[__type + __function + __scope];
					}
				} else {
					// Browser doesn't support binds (iOS, maybe others)
					__obj.removeEventListener(__type, __obj[__type + __function], false);
				}
			} else {
				__obj.addEventListener(__type, __function, false);
			}
		}
	};

})();
