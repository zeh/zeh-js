(function(){
	"use strict";

	// ================================================================================================================
	// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

	DNP.GradientBox = function(__width, __height, __orientation, __colors, __alphas, __ratios, __baseColor) {
		this.width = __width;
		this.height = __height;
		this.orientation = __orientation;
		this.colors = __colors;
		this.alphas = __alphas;
		this.ratios = __ratios;
		this.baseColor = __baseColor || 0x000000;

		DNP.DisplayObjectContainer.call(this);

		//gradient = new GradientBox(100, 29, 90, [0x000000, 0x000000, 0x000000], [0.01, 0, 0.1], [0, 127, 255]);
	};

	DNP.GradientBox.prototype = new DNP.DisplayObjectContainer();
	DNP.GradientBox.prototype.constructor = DNP.GradientBox;


	// ================================================================================================================
	// STATIC INTERFACE ---------------------------------------------------------------------------------------------

	// Constants
	DNP.GradientBox.ORIENTATION_LEFT_TO_RIGHT = "left";
	DNP.GradientBox.ORIENTATION_TOP_TO_BOTTOM = "top";
	DNP.GradientBox.ORIENTATION_TOP_LEFT_TO_BOTTOM_RIGHT = "-45deg";
	DNP.GradientBox.ORIENTATION_BOTTOM_LEFT_TO_TOP_RIGHT = "-45deg";

	DNP.GradientBox.getBackgroundStyleForGradient = function(__colors, __alphas, __ratios, __baseColor, __isInternetExplorer) {
		// Returns text CSS style for a specific kind of gradient

		if (__isInternetExplorer == undefined) __isInternetExplorer = false;
		if (isNaN(__baseColor)) __baseColor = 0x000000;

		// Because some browsers (err, IE) cannot support transparent colors, builds the gradient colors flattened
		// TODO: allow other angles!!!!
		// Reference: http://www.colorzilla.com/gradient-editor/

		// Example:
		/* background: rgb(0,0,0); /* Old browsers */
		/* background: -moz-linear-gradient(top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,1) 100%); */  /* FF3.6+ */
		/* background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(0,0,0,1)), color-stop(50%,rgba(0,0,0,1)), color-stop(100%,rgba(0,0,0,1))); */  /* Chrome,Safari4+ */
		/* background: -webkit-linear-gradient(top, rgba(0,0,0,1) 0%,rgba(0,0,0,1) 50%,rgba(0,0,0,1) 100%);  */ /* Chrome10+,Safari5.1+ */
		/* background: -o-linear-gradient(top, rgba(0,0,0,1) 0%,rgba(0,0,0,1) 50%,rgba(0,0,0,1) 100%);  */ /* Opera 11.10+ */
		/* background: -ms-linear-gradient(top, rgba(0,0,0,1) 0%,rgba(0,0,0,1) 50%,rgba(0,0,0,1) 100%); */  /* IE10+ */
		/* background: linear-gradient(to bottom, rgba(0,0,0,1) 0%,rgba(0,0,0,1) 50%,rgba(0,0,0,1) 100%);  */ /* W3C */
		/* filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#000000', endColorstr='#000000',GradientType=0 ); */ /* IE6-9 */

		var i;
		var colorString;

		var actualBaseColor = Color.fromRRGGBB(__baseColor);

		// Build list of pre-multiplied colors
		var actualColors = [];
		for (i = 0; i < __colors.length; i++) {
			// Add to list
			actualColors.push(Color.interpolate(Color.fromRRGGBB(__colors[i]), actualBaseColor, __alphas[i]));
		}

		if (__isInternetExplorer) {
			// IE
			return "progid:DXImageTransform.Microsoft.gradient(startColorstr='" + actualColors[0].toHTMLStringRRGGBB() + "', endColorstr='" + actualColors[actualColors.length - 1].toHTMLStringRRGGBB() + "', GradientType=0)";
		}

		var styleText = "";

		// Old browsers
		styleText += "background: " + actualBaseColor.toHTMLStringRGBFunction() + "; ";

		// Chrome, Safari 4+
		colorString = "";
		for (i = 0; i < __colors.length; i++) {
			if (i > 0) colorString += ", ";
			colorString += "color-stop(" + Math.round((__ratios[i]/255)*100) + ", " + actualColors[i].toHTMLStringRRGGBB() + ")";
		}
		styleText += "background: -webkit-gradient(linear, left top, left bottom, " + colorString + ");\n";

		// Basic browser order
		colorString = "";
		for (i = 0; i < __colors.length; i++) {
			if (i > 0) colorString += ", ";
			colorString += actualColors[i].toHTMLStringRRGGBB() + " " + Math.round((__ratios[i]/255)*100) + "%";
		}

		// FF 3.6+
		styleText += "background: -moz-linear-gradient(top, " + colorString + "); ";

		// Chrome 11+, Safari 5.1+
		styleText += "background: -webkit-linear-gradient(top, " + colorString + "); ";

		// Opera 11.10+
		styleText += "background: -o-linear-gradient(top, " + colorString + "); ";

		// IE 10+
		styleText += "background: -ms-linear-gradient(top, " + colorString + "); ";

		// Actual W3C standard
		styleText += "background: linear-gradient(to bottom, " + colorString + "); ";

		return styleText;
	};


	// ================================================================================================================
	// INTERNAL INTERFACE ---------------------------------------------------------------------------------------------

	DNP.GradientBox.prototype.createElement = function() {
		DNP.DisplayObjectContainer.prototype.createElement.call(this);

		this.addStyleToElement(DNP.GradientBox.getBackgroundStyleForGradient(this.colors, this.alphas, this.ratios, this.baseColor, false));
		this.addIEFilter("gradient", DNP.GradientBox.getBackgroundStyleForGradient(this.colors, this.alphas, this.ratios, this.baseColor, true));
	};


	// ================================================================================================================
	// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

	DNP.GradientBox.prototype.toString = function() {
		return "[GradientBox]";
	};

})();
