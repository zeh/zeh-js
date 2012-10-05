(function(){
	"use strict";

	// ================================================================================================================
	// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

	window.PageUtils = function() {
		// No constructor
	};

	PageUtils.prototype = {};
	PageUtils.prototype.constructor = PageUtils;


	// ================================================================================================================
	// STATIC INTERFACE -----------------------------------------------------------------------------------------------

	PageUtils.getQueryParameter = function(__name) {
		// http://stackoverflow.com/questions/901115/get-query-string-values-in-javascript
		__name = __name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regexS = "[\\?&]" + __name + "=([^&#]*)";
		var regex = new RegExp(regexS);
		var results = regex.exec(window.location.search);
		return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	};

})();
