/**
 * Created by zeh on 10:12 AM, 9/19/12
 */
(function(){
	"use strict";

	// ================================================================================================================
	// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

	DNP.ImageContainer = function(__width, __height, __backgroundColor) {
		if (__width != undefined) this.width = __width;
		if (__height != undefined) this.height = __height;
		this.backgroundColor = __backgroundColor || undefined;

		DNP.DisplayObjectContainer.call(this);
	};

	DNP.ImageContainer.prototype = new DNP.DisplayObjectContainer();
	DNP.ImageContainer.prototype.constructor = DNP.DisplayObjectContainer;


	// ================================================================================================================
	// STATIC INTERFACE -----------------------------------------------------------------------------------------------

	// Constants
	DNP.ImageContainer.SCALE_MODE_NO_SCALE = "no-scale";


	// ================================================================================================================
	// INTERNAL INTERFACE ---------------------------------------------------------------------------------------------

	DNP.ImageContainer.prototype.setDefaultProperties = function () {
		DNP.DisplayObjectContainer.prototype.setDefaultProperties.call(this);

		this.scaleMode = DNP.ImageContainer.SCALE_MODE_NO_SCALE;
		this.scrollX = 0;
		this.scrollY = 0;

		this.isLoaded = false;
		this.isLoading = false;

		this.image = null;		// Image
		this.url = "";

		this.onError = new SimpleSignal();
		this.onComplete = new SimpleSignal();
	};

	DNP.ImageContainer.prototype.createElement = function () {
		DNP.DisplayObjectContainer.prototype.createElement.call(this);

		this.addClassToElement("dnp-image-container");

		//this.textElement = document.createElement("div");
		//this.element.appendChild(this.textElement);

		//this.updateTextParameters();
	};

	/*
	DNP.TextField.prototype.updateTextParameters = function() {
		// Updates other text parameters
		this.element.style.fontWeight = this.bold ? "bold" : "";

		if (this.autoHeight) this.fixHeight();
	};
	*/

	DNP.ImageContainer.prototype.redrawElements = function() {
		DNP.DisplayObjectContainer.prototype.redrawElements.call(this);


		if (this.isLoaded) {
			// TODO: this is only for non-scaled images! consider the other scaling methods!
			var minX = 0;
			var maxX = this.width - this.image.width;
			var minY = 0;
			var maxY = this.height - this.image.height;

			this.image.style.position = "relative";
			this.image.style.left = Math.round(MathUtils.map(this.scrollX, -1, 1, minX, maxX)) + "px";
			this.image.style.top = Math.round(MathUtils.map(this.scrollY, -1, 1, minY, maxY)) + "px";
		}
	};

	DNP.ImageContainer.prototype.destroyImage = function() {
		this.image.onload = undefined;
		this.image.onerror = undefined;
		this.image = null;
	};

		// ================================================================================================================
	// EVENT INTERFACE ------------------------------------------------------------------------------------------------

	DNP.ImageContainer.prototype.onImageLoadComplete = function() {
		this.element.appendChild(this.image)
		this.isLoading = false;
		this.isLoaded = true;

		this.redrawElements();

		this.onComplete.dispatch();
	};

	DNP.ImageContainer.prototype.onImageLoadError = function() {
		DNP.warn("Error when trying to load image from url" + this.url + "!");
		this.destroyImage();

		this.onError.dispatch();
	};

	// ================================================================================================================
	// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

	DNP.ImageContainer.prototype.unload = function() {
		if (this.isLoaded) {
			this.element.removeChild(this.image);
			this.destroyImage();
			this.isLoaded = false;
		} else if (this.isLoading) {
			// Stop loading the image
			this.destroyImage();
			this.isLoading = false;
		}
	};

	DNP.ImageContainer.prototype.dispose = function() {
		this.unload();
	};

	DNP.ImageContainer.prototype.load = function(__url) {
		this.unload();

		this.url = __url;

		this.image = new Image();
		this.image.onload = this.onImageLoadComplete.bind(this);
		this.image.onerror = this.onImageLoadError.bind(this);
		this.image.src = this.url;
	};

	DNP.ImageContainer.prototype.toString = function() {
		return "[ImageContainer]";
	};


	// ================================================================================================================
	// ACCESSOR INTERFACE ---------------------------------------------------------------------------------------------

	DNP.ImageContainer.prototype.setScaleMode = function(__value) {
		if (this.scaleMode != __value) {
			this.scaleMode = __value;
			this.redrawElements();
		}
	};

	DNP.ImageContainer.prototype.setScroll = function(__scrollX, __scrollY) {
		var changed = false;
		if (!isNaN(__scrollX) && this.scrollX != __scrollX) {
			changed = true;
			this.scrollX = __scrollX;
		}
		if (!isNaN(__scrollY) && this.scrollY != __scrollY) {
			changed = true;
			this.scrollY = __scrollY;
		}
		if (changed) this.redrawElements();
	};

	DNP.ImageContainer.prototype.getImage = function() {
		// Ugh... getter created so one can set the image's styles
		return this.image;
	};

		/*
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
		 this.textElement.style.marginLeft = __left + "px";
		 this.textElement.style.marginTop = __top + "px";
		 this.textElement.style.marginRight = __right + "px";
		 this.textElement.style.marginBottom = __bottom + "px";
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
	 */

})();
