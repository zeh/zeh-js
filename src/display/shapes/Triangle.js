(function(){
	"use strict";

	// ================================================================================================================
	// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

	DNP.Triangle = function(__width, __height, __direction, __color) {
		this.width = __width;
		this.height = __height;
		this.color = __color;
		this.direction = __direction;

		DNP.DisplayObjectContainer.call(this);
	};

	DNP.Triangle.prototype = new DNP.DisplayObjectContainer();
	DNP.Triangle.prototype.constructor = DNP.Triangle;


	// ================================================================================================================
	// STATIC INTERFACE -----------------------------------------------------------------------------------------------

	DNP.Triangle.DIRECTION_RIGHT = "right";
	DNP.Triangle.DIRECTION_LEFT = "left";
	DNP.Triangle.DIRECTION_UP = "up";
	DNP.Triangle.DIRECTION_DOWN = "down";


	// ================================================================================================================
	// INTERNAL INTERFACE ---------------------------------------------------------------------------------------------

	DNP.Triangle.prototype.createElement = function() {
		DNP.DisplayObjectContainer.prototype.createElement.call(this);
	};

	DNP.Triangle.prototype.redrawElements = function() {
		DNP.DisplayObjectContainer.prototype.redrawElements.call(this);

		this.updateColor();
	};

	DNP.Triangle.prototype.updateColor = function() {
		var color = Color.fromRRGGBB(this.color).toHTMLStringRRGGBB();

		if (this.direction == DNP.Triangle.DIRECTION_RIGHT) {
			// Pointing right
			this.element.style.borderTopStyle = "solid";
			this.element.style.borderTopColor = "transparent";
			this.element.style.borderTopWidth = (this.height / 2) + "px";

			this.element.style.borderBottomStyle = "solid";
			this.element.style.borderBottomColor = "transparent";
			this.element.style.borderBottomWidth = (this.height / 2) + "px";

			this.element.style.borderLeftStyle = "solid";
			this.element.style.borderLeftColor = color;
			this.element.style.borderLeftWidth = this.width + "px";

			this.element.style.borderRight = "";
		} else if (this.direction == DNP.Triangle.DIRECTION_DOWN) {
			// Pointing down
			this.element.style.borderTopStyle = "solid";
			this.element.style.borderTopColor = color;
			this.element.style.borderTopWidth = this.height + "px";

			this.element.style.borderBottom = "";

			this.element.style.borderLeftStyle = "solid";
			this.element.style.borderLeftColor = "transparent";
			this.element.style.borderLeftWidth = (this.width / 2) + "px";

			this.element.style.borderRightStyle = "solid";
			this.element.style.borderRightColor = "transparent";
			this.element.style.borderRightWidth = (this.width / 2) + "px";
		} else if (this.direction == DNP.Triangle.DIRECTION_UP) {
			// Pointing up
			this.element.style.borderTop = "";

			this.element.style.borderBottomStyle = "solid";
			this.element.style.borderBottomColor = color;
			this.element.style.borderBottomWidth = this.height + "px";

			this.element.style.borderLeftStyle = "solid";
			this.element.style.borderLeftColor = "transparent";
			this.element.style.borderLeftWidth = (this.width / 2) + "px";

			this.element.style.borderRightStyle = "solid";
			this.element.style.borderRightColor = "transparent";
			this.element.style.borderRightWidth = (this.width / 2) + "px";
		} else if (this.direction == DNP.Triangle.DIRECTION_LEFT) {
			// Pointing left
			this.element.style.borderTopStyle = "solid";
			this.element.style.borderTopColor = "transparent";
			this.element.style.borderTopWidth = (this.height / 2) + "px";

			this.element.style.borderBottomStyle = "solid";
			this.element.style.borderBottomColor = "transparent";
			this.element.style.borderBottomWidth = (this.height / 2) + "px";

			this.element.style.borderLeft = "";

			this.element.style.borderRightStyle = "solid";
			this.element.style.borderRightColor = color;
			this.element.style.borderRightWidth = this.width + "px";
		}
	};

	DNP.Triangle.prototype.updateElementSize = function() {
		// Never applies the size
		this.element.style.width = "0px";
		this.element.style.height = "0px";

		this.redrawElements();
	};

	// ================================================================================================================
	// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

	DNP.Triangle.prototype.setColor = function(__color) {
		if (this.color != __color) {
			this.color = __color;
			this.updateColor();
		}
	};

	DNP.Triangle.prototype.toString = function() {
		return "[Triangle]";
	};

})();
