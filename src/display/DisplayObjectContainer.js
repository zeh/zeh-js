(function(){
	"use strict";

	DNP.DisplayObjectContainer = function() {
		// Set initial properties
		this.setDefaultProperties();

		// Create stuff
		this.createElement();

		// Final visual update
		this.updateElementAlpha();
		this.updateMouseEnabled();
		this.updateElementPosition();
		this.updateElementSize();
	};

	DNP.DisplayObjectContainer.prototype = {};
	DNP.DisplayObjectContainer.prototype.constructor = DNP.DisplayObjectContainer;


	// ================================================================================================================
	// STATIC INTERFACE -----------------------------------------------------------------------------------------------

	// Constants
	//DNP.PatchViewer.CANVAS_MARGIN = 1000;

	DNP.DisplayObjectContainer.addClassToElement = function(__element, __className) {
		if (__element.classList == undefined) {
			// MSIE
			__element.className = __element.className.split(__className).join("") + " " + __className;
		} else {
			// All other browsers
			__element.classList.add(__className);
		}
	};

	DNP.DisplayObjectContainer.removeClassFromElement = function(__element, __className) {
		if (__element.classList == undefined) {
			// MSIE
			__element.className = __element.className.split(__className).join("");
		} else {
			// All other browsers
			__element.classList.remove(__className);
		}
	};

	DNP.DisplayObjectContainer.calculateElementOffsetX = function(__element) {
		var px = 0;
		while (__element.offsetParent) {
			px += __element.offsetLeft;
			__element = __element.offsetParent;
		}
		return px;
	};

	DNP.DisplayObjectContainer.calculateElementOffsetY = function(__element) {
		var px = 0;
		while (__element.offsetParent) {
			px += __element.offsetTop;
			__element = __element.offsetParent;
		}
		return px;
	};

	// ================================================================================================================
	// INTERNAL INTERFACE ---------------------------------------------------------------------------------------------

	DNP.DisplayObjectContainer.prototype.getElementOffsetX = function () {
		return DNP.DisplayObjectContainer.calculateElementOffsetX(this.element);
	};

	DNP.DisplayObjectContainer.prototype.getElementOffsetY = function () {
		return DNP.DisplayObjectContainer.calculateElementOffsetY(this.element);
	};

	DNP.DisplayObjectContainer.prototype.setDefaultProperties = function () {
		this.element = null;
		this.useInnerElement = false;
		this.mouseEnabled = false;
		this.mouseChildren = true;					// If false, NO CHILDREN gets events
		this.useHandCursor = false;

		this.autoHorizontalSize = false;
		this.autoVerticalSize = false;

		this.parent = null;

		this.alpha = 1;
		this.visible = true;
		this.previousDisplayMode = "";		// So it can swap between visible and hidden
		this.autoHide = true;						// If true, auto-hides when alpha is set to 0

		this.children = [];							// [DisplayObjectContainer]
		this.rotation = 0;

		// Signals
		this.onClick = new SimpleSignal();
		this.onMouseOver = new SimpleSignal();
		this.onMouseOut = new SimpleSignal();

		this.hasMouseEventsAttached = false;

		this.IEFilter = {};							// Filters for Microsoft's shitty CSS

		this.mouseIsOver = false;

		if (isNaN(this.x)) this.x = 0;
		if (isNaN(this.y)) this.y = 0;
		if (isNaN(this.width)) this.width = 100;
		if (isNaN(this.height)) this.height = 100;
	};

	DNP.DisplayObjectContainer.prototype.createElement = function () {
		// Creates the element container

		// Create document element
		this.element = document.createElement("div");
		this.addClassToElement("dnp-display-object-container");
		this.element.style.position = "absolute";
		this.element.style.overflow = "hidden";
	};

	DNP.DisplayObjectContainer.prototype.createInnerElement = function () {
		// Creates the inner element container
		if (!this.useInnerElement) {
			this.innerElement = document.createElement("div");
			this.addClassToInnerElement("dnp-display-object-container-inner");
			this.innerElement.style.overflow = "hidden";
			this.element.appendChild(this.innerElement);
			this.useInnerElement = true;
		}
	};

	DNP.DisplayObjectContainer.prototype.removeInnerElement = function () {
		// Removes the inner element container
		if (this.useInnerElement) {
			this.element.removeChild(this.innerElement);
			this.innerElement = null;
			this.useInnerElement = false;
		}
	};

	DNP.DisplayObjectContainer.prototype.updateMouseEnabled = function () {
		// Attach proper events
		if (this.mouseEnabled) {
			if (!this.hasMouseEventsAttached) {
				EventUtils.addEvent(this.element, EventUtils.EVENT_CLICK, this.onElementClick, this);
				EventUtils.addEvent(this.element, EventUtils.EVENT_MOUSE_OVER, this.onElementMouseOver, this);
				EventUtils.addEvent(this.element, EventUtils.EVENT_MOUSE_OUT, this.onElementMouseOut, this);
				this.hasMouseEventsAttached = true;
			}
		} else {
			if (this.hasMouseEventsAttached) {
				EventUtils.removeEvent(this.element, EventUtils.EVENT_CLICK, this.onElementClick, this);
				EventUtils.removeEvent(this.element, EventUtils.EVENT_MOUSE_OVER, this.onElementMouseOver, this);
				EventUtils.removeEvent(this.element, EventUtils.EVENT_MOUSE_OUT, this.onElementMouseOut, this);
				this.hasMouseEventsAttached = false;
			}
		}
	};

	DNP.DisplayObjectContainer.prototype.updateElementPosition = function() {
		this.element.style.left = this.x + "px";
		this.element.style.top = this.y + "px";
	};

	DNP.DisplayObjectContainer.prototype.updateElementSize = function(__skipRedrawElements) {
		if (this.width < 0) this.width = 0;
		this.element.style.width = (this.autoHorizontalSize || isNaN(this.width)) ? "" : this.width + "px";
		this.element.style.height = (this.autoVerticalSize || isNaN(this.height)) ? "" : this.height + "px";

		if (this.useInnerElement) {
			this.innerElement.style.width = (this.autoHorizontalSize || isNaN(this.width)) ? "" : this.width + "px";
			this.innerElement.style.height = (this.autoVerticalSize || isNaN(this.height)) ? "" : this.height + "px";
		}

		if (!__skipRedrawElements) this.redrawElements();
	};

	DNP.DisplayObjectContainer.prototype.updateElementAlpha = function() {
		// Applies .alpha to the element

		if (!this.visible) {
			if (this.element.style.display != "none") {
				this.previousDisplayMode = this.element.style.display;
			}
			this.element.style.display = "none";
			this.element.style.visibility = "visible";
		} else {
			this.element.style.display = this.previousDisplayMode;

			//var text = "";

			// IE 7
			if (SystemUtils.getBrowser() == SystemUtils.BROWSER_MSIE && SystemUtils.getBrowserVersion() == 7) this.addIEFilter("alpha7", "alpha(opacity="+Math.round(this.alpha*100)+")");
			//text += "filter: ;

			// IE 8+
			if (SystemUtils.getBrowser() == SystemUtils.BROWSER_MSIE && SystemUtils.getBrowserVersion() != 7) this.addIEFilter("alpha8", "progid:DXImageTransform.Microsoft.Alpha(Opacity="+Math.round(this.alpha*100)+")");
			//text += "-ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity="+Math.round(this.alpha*100)+")\";";
			//text += "progid:DXImageTransform.Microsoft.Alpha(Opacity="+Math.round(this.alpha*100)+");";

			// Actual standard
			//text += "opacity: "+this.alpha+";"

			//this.addStyleToElement(text);
			this.element.style.opacity = this.alpha;

			if (this.autoHide) {
				if (this.alpha == 0) {
					this.element.style.visibility = "hidden";
				} else {
					this.element.style.visibility = "visible";
				}
			}
		}

	};
	DNP.DisplayObjectContainer.prototype.updateElementRotation = function() {
		// Applies .rotation to the element

		var text = "";

		// IE x-8
		text += "filter:progid:DXImageTransform.Microsoft.BasicImage(rotation="+(this.rotation / 90)+");\n";

		// IE 9+
		text += "-ms-transform:rotate(" + this.rotation + "deg);\n";

		// Opera
		text += "-o-transform:rotate(" + this.rotation + "deg);\n";

		// Chrome, Safari
		text += "-webkit-transform:rotate(" + this.rotation + "deg);\n";

		// Firefox
		text += "-moz-transform:rotate(" + this.rotation + "deg);\n";

		// Actual standard
		text += "transform: rotate(" + this.rotation + "deg);\n";

		this.addStyleToElement(text);
	};

	DNP.DisplayObjectContainer.prototype.redrawElements = function() {
		// Extend
	};

	DNP.DisplayObjectContainer.prototype.addIEFilter = function(__key, __value) {
		// Add the value to the list
		this.IEFilter[__key] = __value;

		// To maker it quick, skips adding stuff to the stylesheet if it's not MSIE
		if (SystemUtils.getBrowser() != SystemUtils.BROWSER_MSIE) return;

		// Update the current style
		var filters = "";
		for (var i in this.IEFilter) {
			if (filters.length > 0) filters += " ";
			filters += this.IEFilter[i];
		}

		this.element.style.filter = filters;

		//var styleText = "";

		// IE 6, 7, 9
		//styleText += " filter: \"" + filters + "\"; ";

		// IE 8
		//styleText += " -ms-filter: \"" + filters + "\"; ";

		//this.addStyleToElement(styleText);
		// If you use addStyleToElement() on IE8, each call removes the last property of the existing CSS (needed to add ";" first?)
	};


	// ================================================================================================================
	// EVENT INTERFACE ------------------------------------------------------------------------------------------------

	// DON'T extend these!

	DNP.DisplayObjectContainer.prototype.onElementClick = function(__event) {
		if (this.mouseEnabled) {
			this.onClick.dispatch();
			if (__event.stopPropagation) __event.stopPropagation();
		}
	};

	DNP.DisplayObjectContainer.prototype.onElementMouseOver = function(__event) {
		if (this.mouseEnabled) {
			if (!this.mouseIsOver) {
				this.mouseIsOver = true;
				this.onMouseOver.dispatch();
				//__event.stopPropagation();
			}
		}
	};

	DNP.DisplayObjectContainer.prototype.onElementMouseOut = function(__event) {
		if (this.mouseEnabled) {
			// .toElement works in chrome; relatedTarge works in Firefox
			var toElement = __event.toElement || __event.relatedTarget;

			// Ignores if it's a rollover to other sub-element
			if (toElement == null || !DocumentUtils.isElementDescendant(this.element, toElement)) {
				this.mouseIsOver = false;
				this.onMouseOut.dispatch();
				//__event.stopPropagation();
			}
		}
	};


	// ================================================================================================================
	// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

	DNP.DisplayObjectContainer.prototype.addStyleToElement = function(__style) {
		// Add to .cssText
		//DNP.log("1=> " + this.element.style.cssText);
		//DNP.log("++> " + __style);
		this.element.style.cssText += "; " + __style;
		//DNP.log("2=> " + this.element.style.cssText);
	};

	DNP.DisplayObjectContainer.prototype.addStyleToInnerElement = function(__style) {
		// Add to .cssText
		this.innerElement.style.cssText += " " + __style;
	};

	DNP.DisplayObjectContainer.prototype.addClassToElement = function(__className) {
		DNP.DisplayObjectContainer.addClassToElement(this.element, __className);
	};

	DNP.DisplayObjectContainer.prototype.removeClassFromElement = function(__className) {
		DNP.DisplayObjectContainer.removeClassFromElement(this.element, __className);
	};

	DNP.DisplayObjectContainer.prototype.addClassToInnerElement = function(__className) {
		DNP.DisplayObjectContainer.addClassToElement(this.innerElement, __className);
	};

	DNP.DisplayObjectContainer.prototype.removeClassFromInnerElement = function(__className) {
		DNP.DisplayObjectContainer.removeClassFromElement(this.innerElement, __className);
	};

	DNP.DisplayObjectContainer.prototype.setUseInnerElement = function(__useInnerElement) {
		if (__useInnerElement) {
			this.createInnerElement();
		} else {
			this.removeInnerElement();
		}
	};

	DNP.DisplayObjectContainer.prototype.bringChildToFront = function(__child) {
		// Brings a child to front
		this.element.appendChild(__child.getElement());
	};

	DNP.DisplayObjectContainer.prototype.setChildIndex = function(__child, __index) {
		// Sets the z-depth of a child
		// TODO: use a single child list where the position corresponds to the index?
		DNP.warn("TODO");
	};

	DNP.DisplayObjectContainer.prototype.setPosition = function(__x, __y) {
		var changed = false;
		if (!isNaN(__x) && this.x != __x) {
			changed = true;
			this.x = __x;
		}
		if (!isNaN(__y) && this.y != __y) {
			changed = true;
			this.y = __y;
		}
		if (changed) this.updateElementPosition();
	};

	DNP.DisplayObjectContainer.prototype.setSize = function(__width, __height) {
		var changed = false;
		if (!isNaN(__width) && this.width != __width) {
			changed = true;
			this.width = __width;
		}
		if (!isNaN(__height) && this.height != __height) {
			changed = true;
			this.height = __height;
		}
		if (changed) this.updateElementSize();
	};

	DNP.DisplayObjectContainer.prototype.setAlpha = function(__alpha) {
		// Set transparency, from 0 (transparent) to 1 (opaque)
		if (this.alpha != __alpha) {
			this.alpha = __alpha;
			this.updateElementAlpha();
		}
	};

	DNP.DisplayObjectContainer.prototype.setVisible = function(__visible) {
		if (this.visible != __visible) {
			this.visible = __visible;
			this.updateElementAlpha();
		}
	};

	DNP.DisplayObjectContainer.prototype.setUseHandCursor = function(__useHandCursor) {
		this.element.style.cursor = __useHandCursor ? "pointer" : "";
	};

	DNP.DisplayObjectContainer.prototype.setUseArrowCursor = function(__useArrowCursor) {
		this.element.style.cursor = __useArrowCursor ? "default" : "";
	};

	DNP.DisplayObjectContainer.prototype.setMouseEnabled = function(__mouseEnabled) {
		if (this.mouseEnabled != __mouseEnabled) {
			this.mouseEnabled = __mouseEnabled;
			this.updateMouseEnabled();
		}
	};

	DNP.DisplayObjectContainer.prototype.setMouseChildren = function(__mouseChildren) {
		if (this.mouseEnabled != __mouseChildren) {
			this.mouseChildren = __mouseChildren;
			for (var i = 0; i < this.children.length; i++) {
				this.children[i].setMouseEnabledAsAChild(this.mouseChildren);
			}
		}
	};

	DNP.DisplayObjectContainer.prototype.setMouseEnabledAsAChild = function(__mouseEnabled) {
		this.element.style.pointerEvents = __mouseEnabled ? "" : "none";
	};

	DNP.DisplayObjectContainer.prototype.addChildAt = function(__displayObjectContainer, __order) {
		if (__displayObjectContainer.parent != null) __displayObjectContainer.parent.removeChild(__displayObjectContainer);
		var el = (this.useInnerElement ? this.innerElement : this.element);
		if (__order < this.element.childNodes.length) {
			// Insert at this position
			this.children.splice(__order, 0, __displayObjectContainer);
			el.insertBefore(__displayObjectContainer.getElement(), this.element.childNodes[__order]);
		} else {
			// Number is out of bounds, just add it
			this.children.push(__displayObjectContainer);
			el.appendChild(__displayObjectContainer.getElement());
		}

		__displayObjectContainer.parent = this;
		__displayObjectContainer.onAddedToParent();
		__displayObjectContainer.redrawElements(); // Needed? This makes everything 50% slower...
		__displayObjectContainer.setMouseEnabledAsAChild(this.mouseChildren);
	};

	DNP.DisplayObjectContainer.prototype.addChild = function(__displayObjectContainer) {
		//this.setChildIndex(__displayObjectContainer, this.lastChildIndex++);
		this.addChildAt(__displayObjectContainer, this.children.length);
	};

	DNP.DisplayObjectContainer.prototype.removeChild = function(__displayObjectContainer) {
		var i = this.children.indexOf(__displayObjectContainer);
		if (i > -1) {
			this.children.splice(i, 1);
			(this.useInnerElement ? this.innerElement : this.element).removeChild(__displayObjectContainer.getElement());
			__displayObjectContainer.onRemovedFromParent();
			__displayObjectContainer.parent = null;
		}
	};

	DNP.DisplayObjectContainer.prototype.getElement = function() {
		return this.element;
	};

	DNP.DisplayObjectContainer.prototype.setMargins = function(__left, __top, __right, __bottom) {
		// Accepts: ints
		if (__left != undefined) this.element.style.marginLeft = __left + "px";
		if (__top != undefined) this.element.style.marginTop = __top + "px";
		if (__right != undefined) this.element.style.marginRight = __right + "px";
		if (__bottom != undefined) this.element.style.marginBottom = __bottom + "px";
	};

	DNP.DisplayObjectContainer.prototype.toString = function() {
		return "[DisplayObjectContainer]";
	};


	// ================================================================================================================
	// INJECTED EVENT INTERFACE ---------------------------------------------------------------------------------------

	DNP.DisplayObjectContainer.prototype.onAddedToParent = function() {
		// Cascade the addition event
		for (var i = 0; i < this.children.length; i++) this.children[i].onAddedToParent();
	};

	DNP.DisplayObjectContainer.prototype.onRemovedFromParent = function() {
		// Cascade the removal event
		for (var i = 0; i < this.children.length; i++) this.children[i].onRemovedFromParent();
	};


	// ================================================================================================================
	// ACCESSOR INTERFACE ---------------------------------------------------------------------------------------------

	DNP.DisplayObjectContainer.prototype.setAutoHorizontalSize = function(__value) {
		if (this.autoHorizontalSize != __value) {
			this.autoHorizontalSize = __value;
			this.updateElementSize();
		}
	};

	DNP.DisplayObjectContainer.prototype.setAutoVerticalSize = function(__value) {
		if (this.autoVerticalSize != __value) {
			this.autoVerticalSize = __value;
			this.updateElementSize();
		}
	};

	DNP.DisplayObjectContainer.prototype.setRotation = function(__value) {
		if (this.rotation != __value) {
			this.rotation = __value;
			this.updateElementRotation();
		}
	};

})();
