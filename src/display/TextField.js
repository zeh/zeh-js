(function(){
	"use strict";

	// ================================================================================================================
	// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

	DNP.TextField = function() {
		DNP.DisplayObjectContainer.call(this);
	};

	DNP.TextField.prototype = new DNP.DisplayObjectContainer();
	DNP.TextField.prototype.constructor = DNP.DisplayObjectContainer;


	// ================================================================================================================
	// STATIC INTERFACE -----------------------------------------------------------------------------------------------

	// Constants
	//DNP.PatchViewer.CANVAS_MARGIN = 1000;


	// ================================================================================================================
	// INTERNAL INTERFACE ---------------------------------------------------------------------------------------------

	DNP.TextField.prototype.setDefaultProperties = function () {
		DNP.DisplayObjectContainer.prototype.setDefaultProperties.call(this);

		this.text = "";
		this.textElement = null;
		this.bold = false;
		this.wordWrap = false;
		this.autoHeight = true;
	};

	DNP.TextField.prototype.createElement = function () {
		DNP.DisplayObjectContainer.prototype.createElement.call(this);

		this.addClassToElement("dnp-text-field");

		this.textElement = document.createElement("div");
		this.element.appendChild(this.textElement);

		this.updateTextParameters();
	};

	DNP.TextField.prototype.updateTextParameters = function() {
		// Updates other text parameters
		this.element.style.fontWeight = this.bold ? "bold" : "";

		if (this.autoHeight) this.fixHeight();
	};

	//DNP.TextField.prototype.redrawElements = function() {
	//	DNP.DisplayObjectContainer.prototype.redrawElements.call(this);
	//};

	DNP.TextField.prototype.setSize = function(__width, __height) {
		if (!isNaN(__height) && this.autoHeight) this.autoHeight = false;
		DNP.DisplayObjectContainer.prototype.setSize.call(this, __width, __height);
	};

	DNP.TextField.prototype.fixHeight = function() {
		// Finds the correct height
		if (this.autoHeight) {
			// This only works properly once the text element is added to the display list
			this.height = this.getElement().clientHeight;
//			var rect = this.getElement().childNodes[0].getBoundingClientRect();
//			if (this.height != rect.height) {
//				this.height = rect.height;
//			}
		}
	};

	// ================================================================================================================
	// INJECTED EVENT INTERFACE ---------------------------------------------------------------------------------------

	//DNP.TextField.prototype.onAddedToParent = function() {
		//DNP.DisplayObjectContainer.prototype.onAddedToParent.call(this);
		//DNP.log("==");
		//this.fixHeight();
		//DNP.log(this.autoHeight + "=" + this.textElement.innerHTML);
	//};


	// ================================================================================================================
	// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

	DNP.TextField.prototype.toString = function() {
		return "[TextField]";
	};


	// ================================================================================================================
	// ACCESSOR INTERFACE ---------------------------------------------------------------------------------------------

	DNP.TextField.prototype.setText = function(__text) {
		if (__text == undefined) __text = "";
		if (__text != this.text) {
			this.text = __text;
			this.textElement.innerHTML = "<div>" + __text.split("\r\n").join("\n").split("\r").join("\n").split("\n").join("</div><div style=\"margin-top:1em;\">") + "</div>";
			this.updateTextParameters();
		}
	};

	DNP.TextField.prototype.setFontName = function(__fonts) {
		this.element.style.fontFamily = __fonts;
		this.updateTextParameters();
	};

	DNP.TextField.prototype.setColor = function(__color) {
		// Accepts: ints (e.g. 0xff0000)
		this.element.style.color = Color.fromRRGGBB(__color).toHTMLStringRRGGBB();
	};

	DNP.TextField.prototype.setFontSize = function(__size) {
		// Accepts: floats for pixel sizes
		this.element.style.fontSize = __size + "px";
		this.updateTextParameters();
	};

	DNP.TextField.prototype.setLineHeight = function(__lineHeight) {
		// Accepts: floats for pixel sizes
		this.element.style.lineHeight = __lineHeight + "px";
		this.updateTextParameters();
	};

	DNP.TextField.prototype.setLineHeightMultiplier = function(__lineHeight) {
		// Accepts: floats for multipliers
		this.element.style.lineHeight = __lineHeight;
		this.updateTextParameters();
	};

	DNP.TextField.prototype.setLetterSpacing = function(__letterSpacing) {
		// Accepts: floats for pt sizes (maybe only integers?)
		this.element.style.letterSpacing = __letterSpacing + "pt";
		this.updateTextParameters();
	};

	DNP.TextField.prototype.setMargins = function(__left, __top, __right, __bottom) {
		// Accepts: ints
		if (__left != undefined)   this.textElement.style.marginLeft = __left + "px";
		if (__top != undefined)    this.textElement.style.marginTop = __top + "px";
		if (__right != undefined)  this.textElement.style.marginRight = __right + "px";
		if (__bottom != undefined) this.textElement.style.marginBottom = __bottom + "px";
		this.updateTextParameters();
	};

	DNP.TextField.prototype.setBold = function(__isBold) {
		if (this.bold != __isBold) {
			this.bold = __isBold;
			this.updateTextParameters();
		}
	};

	DNP.TextField.prototype.setWordWrap = function(__wordWrap) {
		if (this.wordWrap != __wordWrap) {
			this.wordWrap = __wordWrap;
			this.redrawElements();
		}
	};

})();
