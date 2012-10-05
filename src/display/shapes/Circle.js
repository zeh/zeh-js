/**
 * Created by zeh on 2:41 PM, 9/19/12
 */
(function(){
	"use strict";

	// ================================================================================================================
	// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

	DNP.Circle = function(__radius, __color) {
		this.width = __radius * 2;
		this.height = __radius * 2;
		this.color = __color;

		DNP.DisplayObjectContainer.call(this);
	};

	DNP.Circle.prototype = new DNP.DisplayObjectContainer();
	DNP.Circle.prototype.constructor = DNP.Circle;


	// ================================================================================================================
	// INTERNAL INTERFACE ---------------------------------------------------------------------------------------------

	DNP.Circle.prototype.createElement = function() {
		DNP.DisplayObjectContainer.prototype.createElement.call(this);
		// this.element.style.borderRadius = "50%"; // Borders with % units don't work on Android 2.3
		this.updateColor();
	};

	DNP.Circle.prototype.updateColor = function() {
		this.element.style.backgroundColor = Color.fromRRGGBB(this.color).toHTMLStringRRGGBB();
	};

	DNP.Circle.prototype.updateElementPosition = function() {
		this.element.style.left = (this.x - (this.width * 0.5)) + "px";
		this.element.style.top = (this.y - (this.height * 0.5)) + "px";
	};

	DNP.Circle.prototype.updateElementSize = function() {
		DNP.DisplayObjectContainer.prototype.updateElementSize.call(this);
		this.element.style.borderRadius = (this.width * 0.5) + "px";
	};

	// ================================================================================================================
	// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

	DNP.Circle.prototype.setColor = function(__value) {
		if (this.color != __value) {
			this.color = __value;
			this.updateColor();
		}
	};

	DNP.Circle.prototype.toString = function() {
		return "[Circle]";
	};

})();
