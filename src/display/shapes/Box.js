(function(){
	"use strict";

	// ================================================================================================================
	// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

	DNP.Box = function(__width, __height, __color, __borderRadius) {
		this.width = __width;
		this.height = __height;
		this.color = __color;
		this.borderRadius = __borderRadius == undefined ? 0 : __borderRadius;

		DNP.DisplayObjectContainer.call(this);
	};

	DNP.Box.prototype = new DNP.DisplayObjectContainer();
	DNP.Box.prototype.constructor = DNP.Box;


	// ================================================================================================================
	// INTERNAL INTERFACE ---------------------------------------------------------------------------------------------

	DNP.Box.prototype.createElement = function() {
		DNP.DisplayObjectContainer.prototype.createElement.call(this);

		this.updateColor();
		this.updateBorder();
	};

	DNP.Box.prototype.updateColor = function() {
		this.element.style.backgroundColor = Color.fromRRGGBB(this.color).toHTMLStringRRGGBB();
	};

	DNP.Box.prototype.updateBorder = function() {
		this.element.style.borderRadius = ((this.borderRadius == undefined && this.borderRadius > 0) ? "" : this.borderRadius + "px");
	};


	// ================================================================================================================
	// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

	DNP.Box.prototype.setColor = function(__value) {
		if (this.color != __value) {
			this.color = __value;
			this.updateColor();
		}
	};

	DNP.Box.prototype.toString = function() {
		return "[Box]";
	};

})();
