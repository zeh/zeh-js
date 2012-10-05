(function(){
	"use strict";

	// ================================================================================================================
	// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

	window.DocumentUtils = function() {
		// No constructor
	};

	DocumentUtils.prototype = {};
	DocumentUtils.prototype.constructor = DocumentUtils;


	// ================================================================================================================
	// STATIC INTERFACE -----------------------------------------------------------------------------------------------

	DocumentUtils.isElementDescendant = function(__parent, __child) {
		var node = __child.parentNode;
		while (node != null) {
			if (node == __parent) {
				return true;
			}
			node = node.parentNode;
		}
		return false;
	};

})();
