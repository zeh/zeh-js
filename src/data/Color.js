(function(){
	"use strict";

	// ================================================================================================================
	// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

	window.Color = function() {
		// Properties

		this.r = 0;
		this.g = 0;
		this.b = 0;
		this.a = 0;

		this.h = 0;		// for hue preservation when desaturated
	};

	Color.prototype = {};
	Color.prototype.constructor = Color;


	// ================================================================================================================
	// STATIC functions -----------------------------------------------------------------------------------------------

	Color.getRFromNumber = function(__color, __max) {
		return ((__color >> 16 & 0xff) / 255) * __max;
	}

	Color.getGFromNumber = function(__color, __max) {
		return ((__color >> 8 & 0xff) / 255) * __max;
	}

	Color.getBFromNumber = function(__color, __max) {
		return ((__color & 0xff) / 255) * __max;
	}

	Color.getAFromNumber = function(__color, __max) {
		return ((__color >> 24 & 0xff) / 255) * __max;
	}

	/**
	 * Creates a new Color object from a number in the RRGGBB format (for example: 0x000000 for black, or 0xffffff for white). The color's alpha property is set to 1 (totally opaque).
	 * @return	The new color object.
	 */
	Color.fromRRGGBB = function(__value) {
		var newColor = new Color();
		newColor.r = Color.getRFromNumber(__value, 1);
		newColor.g = Color.getGFromNumber(__value, 1);
		newColor.b = Color.getBFromNumber(__value, 1);
		newColor.a = 1;

		return newColor;
	};

	/**
	 * Creates a new Color object from a number in the AARRGGBB format (for example: 0x00ffffff for transparent white, or 0xffffffff for opaque white).
	 * @return	The new color object.
	 */
	Color.fromAARRGGBB = function(__value) {
		var newColor = Color.fromRRGGBB(__value);
		newColor.a = getAFromNumber(__value, 1);
		return newColor;
	};

	/**
	 * Creates a new Color object from a combination of the Red, Green, Blue and Alpha values in the 0-1 range.
	 * @return	The new color object.
	 */
	Color.fromRGB = function(__r, __g, __b, __a) {
		var newColor = new Color();
		newColor.r = __r;
		newColor.g = __g;
		newColor.b = __b;
		newColor.a = isNaN(a) ? 1 : a;
		return newColor;
	};

	/**
	 * Creates a new Color object from the desired Hue (0-360), Saturation (0-1), and Value (0-1) values.
	 * @see http://en.wikipedia.org/wiki/HSL_color_space
	 * @return	The new color object.
	 */
	Color.fromHSV = function(__h, __s, __v, __a) {
		var newColor = new Color();
		newColor.v = __v;
		newColor.s = __s;
		newColor.h = __h;
		newColor.a = isNaN(a) ? 1 : a;
		return newColor;
	};

	Color.fromString = function(__value) {
		// Based on any HTML/CSS compatible string value, returns the corresponding color

		var newColor = new Color();

		__value = String(__value).toLowerCase().split(" ").join("");

		if (__value.substr(0, 1) == "#") {
			// Hexadecimal color
			var $colorValue = __value.substr(1);
			if ($colorValue.length == 6) {
				// Usual #RRGGBB
				newColor.r = parseInt($colorValue.substr(0, 2), 16) / 255;
				newColor.g = parseInt($colorValue.substr(2, 2), 16) / 255;
				newColor.b = parseInt($colorValue.substr(4, 2), 16) / 255;
				newColor.a = 1;
			} else if ($colorValue.length == 8) {
				// #AARRGGBB
				newColor.r = parseInt($colorValue.substr(2, 2), 16) / 255;
				newColor.g = parseInt($colorValue.substr(4, 2), 16) / 255;
				newColor.b = parseInt($colorValue.substr(6, 2), 16) / 255;
				newColor.a = parseInt($colorValue.substr(0, 2), 16) / 255;
			} else if ($colorValue.length == 3) {
				// #RGB that turns into #RRGGBB
				newColor.r = parseInt($colorValue.substr(0, 1) + $colorValue.substr(0, 1), 16) / 255;
				newColor.g = parseInt($colorValue.substr(1, 1) + $colorValue.substr(1, 1), 16) / 255;
				newColor.b = parseInt($colorValue.substr(2, 1) + $colorValue.substr(2, 1), 16) / 255;
				newColor.a = 1;
			} else if ($colorValue.length == 4) {
				// #ARGB that turns into #AARRGGBB
				newColor.r = parseInt($colorValue.substr(1, 1) + $colorValue.substr(1, 1), 16) / 255;
				newColor.g = parseInt($colorValue.substr(2, 1) + $colorValue.substr(2, 1), 16) / 255;
				newColor.b = parseInt($colorValue.substr(3, 1) + $colorValue.substr(3, 1), 16) / 255;
				newColor.a = parseInt($colorValue.substr(0, 1) + $colorValue.substr(0, 1), 16) / 255;
			} else {
				// Wrong type!
				console.error("ERROR! Wrong number of atributes in color number");
			}
		} else if (__value.substr(0, 4) == "rgb(" && __value.substr(-1, 1) == ")") {
			// rgb() function
			var $colorValues = __value.substr(4, __value.length - 5).split(",");
			if ($colorValues.length == 3) {
				// R,G,B
				newColor.r = getColorFunctionNumber($colorValues[0], 1);
				newColor.g = getColorFunctionNumber($colorValues[1], 1);
				newColor.b = getColorFunctionNumber($colorValues[2], 1);
				newColor.a = 1;
			} else if ($colorValues.length == 4) {
				// R,G,B,A
				newColor.r = getColorFunctionNumber($colorValues[0], 1);
				newColor.g = getColorFunctionNumber($colorValues[1], 1);
				newColor.b = getColorFunctionNumber($colorValues[2], 1);
				newColor.a = getColorFunctionNumber($colorValues[3], 1);
			} else {
				trace ("ERROR! Wrong number of parameter in color function");
			}
		} else {
			// Must be a named color
			var builtInColorNames = 	["aqua",	"black",	"blue",		"fuchsia",	"gray",		"green",	"lime",		"maroon",	"navy",		"olive",	"purple",	"red",		"silver",	"teal",		"white",	"yellow"];
			var builtInColorValues = ["#0000ff",	"#ffffff",	"#0000ff",	"#ff00ff",	"#808080",	"#008000",	"#00ff00",	"#800000",	"#000080",	"#808000",	"#800080",	"#ff0000",	"#c0c0c0",	"#008080",	"#ffffff",	"#ffff00"];
			var u = 0;
			var i;
			for (i = 0; i < builtInColorNames.length; i++) {
				if (__value == builtInColorNames[i]) {
					// Found the color
					return Color.fromString(builtInColorValues[i]);
				}
			}
			console.error("ERROR! Impossible to parse color name [" + __value + "]");
		}

		return newColor;
	};

	Color.interpolate = function(__c1, __c2, __f) {
		// Linear RGB interpolation between two colors
		var newColor = new Color();
		var nf = 1 - __f;
		newColor.r = __c1.r * __f + __c2.r * nf;
		newColor.g = __c1.g * __f + __c2.g * nf;
		newColor.b = __c1.b * __f + __c2.b * nf;
		newColor.a = __c1.a * __f + __c2.a * nf;
		return newColor;
	};

	Color.interpolateRRGGBB = function(__c1, __c2, __f) {
		return Color.interpolate(Color.fromRRGGBB(__c1), Color.fromRRGGBB(__c2), __f).toRRGGBB();
	};

	Color.interpolateHSV = function(__c1, __c2, __f) {
		// Linear HSL interpolation between two colors
		var newColor = new Color();
		var nf = 1 - __f;
		newColor.v = __c1.v * __f + __c2.v * nf;
		newColor.s = __c1.s * __f + __c2.s * nf;
		if (__c1.h - __c2.h > 180) {
			newColor.h = (__c1.h - 360) * __f + __c2.h * nf;
		} else if (__c2.h - __c1.h > 180) {
			newColor.h = __c1.h * __f + (__c2.h - 360) * nf;
		} else {
			newColor.h = __c1.h * __f + __c2.h * nf;
		}
		newColor.a = __c1.a * __f + __c2.a * nf;
		return newColor;
	};

	Color.getColorFunctionNumber = function(__value, __max) {
		// Based on a HTML/CSS string value, returns the correct color number (0-255)
		// Examples:
		// 0 -> 0
		// 200 -> 200 - 0.7843...
		// 100% -> 255 -> 1
		// 256 -> 255 -> 1
		// 156.7 -> 0.614...

		var finalValue;

		__value = String(__value).toLowerCase().split(" ").join("");
		if (__value.substr(-1,1) == "%") {
			// Percentage
			finalValue = parseFloat(__value.substr(0, __value.length-1)) / 100;
		} else {
			// Normal value
			finalValue = parseFloat(__value) / 255;
		}

		return finalValue * __max;
	};


	// ================================================================================================================
	// INTERNAL INTERFACE -----------------------------------------------------------------------------------------------

	Color.prototype.setHSV = function(__h, __s, __v) {
		//var hi:Number = Math.floor(__h/60) % 6;
		var hi = MathUtils.rangeMod(Math.floor(__h/60), 0, 6);
		var f = __h/60 - Math.floor(__h/60);
		var p = __v * (1 - __s);
		var q = __v * (1 - f * __s);
		var t = __v * (1 - (1 - f) * __s);
		switch (hi) {
			case 0:
				this.r = __v;
				this.g = t;
				this.b = p;
				break;
			case 1:
				this.r = q;
				this.g = __v;
				this.b = p;
				break;
			case 2:
				this.r = p;
				this.g = __v;
				this.b = t;
				break;
			case 3:
				this.r = p;
				this.g = q;
				this.b = __v;
				break;
			case 4:
				this.r = t;
				this.g = p;
				this.b = __v;
				break;
			case 5:
				this.r = __v;
				this.g = p;
				this.b = q;
				break;
			default:
				console.log("ERROR!" + hi);
		}
	};


	// ================================================================================================================
	// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

	/**
	 * Converts this color to an integer number in the AARRGGBB format (for example: 0xff000000 for opaque black).
	 */
	Color.prototype.toAARRGGBB = function() {
		return Math.round(this.a * 255) << 24 | this.toRRGGBB();
	};

	/**
	 * Converts this color to an integer number in the RRGGBB format, ignoring its alpha (for example: 0x000000 for black).
	 */
	Color.prototype.toRRGGBB = function() {
		return Math.round(this.r * 255) << 16 | Math.round(this.g * 255) << 8 | Math.round(this.b * 255);
	};

	/**
	 * Converts this color to a readable string.
	 * @return	A string describing this color.
	 */
	Color.prototype.toString = function() {
		var txt  = "";
		txt += "[";
		txt += "r=" + this.r.toString(10);
		txt += ",";
		txt += "g=" + this.g.toString(10);
		txt += ",";
		txt += "b=" + this.b.toString(10);
		txt += ",";
		txt += "a=" + this.a.toString(10);
		txt += "]";

		return txt;
	};

	Color.prototype.toHTMLStringRRGGBB = function() {
		return "#" + ("000000"+(this.toRRGGBB().toString(16))).substr(-6, 6);
	};

	Color.prototype.toHTMLStringRGBFunction = function() {
		return "rgb(" + Math.round(this.r * 255) + "," + Math.round(this.g * 255) + "," + Math.round(this.b * 255) + ")";
	};

	Color.prototype.toHTMLStringRGBAFunction = function() {
		return "rgba(" + Math.round(this.r * 255) + "," + Math.round(this.g * 255) + "," + Math.round(this.b * 255) + "," + this.a + ")";
	};

	Color.prototype.clone = function() {
		var cc = new Color();
		cc.r = this.r;
		cc.g = this.g;
		cc.b = this.b;
		cc.a = this.a;
		return cc;
	};


	/*
	public function get h(): Number {
		// Return Hue (0-360)
		var max:Number = Math.max(_r, _g, _b);
		var min:Number = Math.min(_r, _g, _b);
		if (max == min) {
			return _h;
		} else if (_r == max) {
			return (60 * ((_g - _b) / (max - min))) % 360;
		} else if (_g == max) {
			return 60 * ((_b - _r) / (max - min)) + 120;
		} else {
			return 60 * ((_r - _g) / (max - min)) + 240;
		}
	}
	public function set h(__value:Number): void {
		// Set Hue (0-360)
		_h = MathUtils.rangeMod(__value, 0, 360);
		setHSV(_h, s, v);
	}

	public function get s(): Number {
		// Return HSV-compliant Saturation (0-1)
		var max:Number = Math.max(_r, _g, _b);
		var min:Number = Math.min(_r, _g, _b);
		if (max == min) {
			return 0;
		} else {
			return 1 - (min/max);
		}
	}
	public function set s(__value:Number): void {
		// Set HSV-style saturation (0-1)
		setHSV(h, MathUtils.clamp(__value), v);
	}

	public function get v(): Number {
		// Return Value (0-1)
		var max:Number = Math.max(_r, _g, _b);
		return max;
	}

	public function set v(__value:Number): void {
		// Set lightness (0-1)
		setHSV(h, s, MathUtils.clamp(__value));
	}

	/*
	HSL:
	public function get h(): Number {
		// Return Hue (0-360)
		var __r:Number = MathUtils.map(_r, 0, 255);
		var __g:Number = MathUtils.map(_g, 0, 255);
		var __b:Number = MathUtils.map(_b, 0, 255);
		var max:Number = Math.max(__r, __g, __b);
		var min:Number = Math.min(__r, __g, __b);
		if (max == min) {
			return _h;
		} else if (__r == max) {
			return (60 * ((__g - __b) / (max - min))) % 360;
		} else if (__g == max) {
			return 60 * ((__b - __r) / (max - min)) + 120;
		} else {
			return 60 * ((__r - __g) / (max - min)) + 240;
		}
	}
	public function set h(__value:Number): void {
		// Set Hue (0-360)
		_h = MathUtils.roundClamp(__value, 0, 360);
		setHSL(_h, s, l);
	}

	public function get s(): Number {
		// Return HSL-style Saturation (0-1)
		var __r:Number = MathUtils.map(_r, 0, 255);
		var __g:Number = MathUtils.map(_g, 0, 255);
		var __b:Number = MathUtils.map(_b, 0, 255);
		var max:Number = Math.max(__r, __g, __b);
		var min:Number = Math.min(__r, __g, __b);
		var __l:Number = (max+min) / 2;
		if (max == min) {
			return 0;
		} else if (__l < 0.5) {
			return (max-min) / (2 * l);
		} else {
			return (max-min) / (2 - (2 * l));
		}
	}
	public function set s(__value:Number): void {
		// Set HSL-style saturation (0-1)
		setHSL(h, MathUtils.clamp(__value), l);
	}

	public function get l(): Number {
		// Return Lightness (0-1)
		var __r:Number = MathUtils.map(_r, 0, 255);
		var __g:Number = MathUtils.map(_g, 0, 255);
		var __b:Number = MathUtils.map(_b, 0, 255);
		var max:Number = Math.max(__r, __g, __b);
		var min:Number = Math.min(__r, __g, __b);
		return (max+min) / 2;
	}

	public function set l(__value:Number): void {
		// Set lightness (0-1)
		setHSL(h, s, MathUtils.clamp(__value));
	}
	*/

})();
