(function(){
	"use strict";

	// ================================================================================================================
	// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

	window.MathUtils = function() {
		// No constructor
	};

	MathUtils.prototype = {};
	MathUtils.prototype.constructor = MathUtils;


	// ================================================================================================================
	// STATIC INTERFACE -----------------------------------------------------------------------------------------------

	/**
	 * Clamps a number to a range, by restricting it to a minimum and maximum values: if the passed value is lower than the minimum value, it's replaced by the minimum; if it's higher than the maximum value, it's replaced by the maximum; if not, it's unchanged.
	 * @param __value	The value to be clamped.
	 * @param __min		Minimum value allowed.
	 * @param __max		Maximum value allowed.
	 * @return			The newly clamped value.
	 */
	MathUtils.clamp = function(__value, __min, __max) {
		if (__min == undefined) __min = 0;
		if (__max == undefined) __max = 1;
		return __value < __min ? __min : __value > __max ? __max : __value;
	};

	/**
	 * Clamps a value to a range, by restricting it to a minimum and maximum values but folding the value to the range instead of simply resetting to the minimum and maximum. It works like a more powerful Modulo function.
	 * @param __value	The value to be clamped.
	 * @param __min		Minimum value allowed.
	 * @param __max		Maximum value allowed.
	 * @return			The newly clamped value.
	 * @example Some examples:
	 * <listing version="3.0">
	 * 	trace(MathUtils.roundClamp(14, 0, 10));
	 * 	// Result: 4
	 *
	 * 	trace(MathUtils.roundClamp(360, 0, 360));
	 * 	// Result: 0
	 *
	 * 	trace(MathUtils.roundClamp(360, -180, 180));
	 * 	// Result: 0
	 *
	 * 	trace(MathUtils.roundClamp(21, 0, 10));
	 * 	// Result: 1
	 *
	 * 	trace(MathUtils.roundClamp(-98, 0, 100));
	 * 	// Result: 2
	 * </listing>
	 */
	// Need a better name?
	MathUtils.rangeMod = function(__value, __min, __pseudoMax) {
		var range = __pseudoMax - __min;
		__value = (__value - __min) % range;
		if (__value < 0) __value = range - (-__value % range);
		__value += __min;
		return __value;
	};

	/**
	 * Maps a value from a range, determined by old minimum and maximum values, to a new range, determined by new minimum and maximum values. These minimum and maximum values are referential; the new value is not clamped by them.
	 * @param __value	The value to be re-mapped.
	 * @param __oldMin	The previous minimum value.
	 * @param __oldMax	The previous maximum value.
	 * @param __newMin	The new minimum value.
	 * @param __newMax	The new maximum value.
	 * @return			The new value, mapped to the new range.
	 */
	MathUtils.map = function(__value, __oldMin, __oldMax, __newMin, __newMax, __clamp) {
		if (__newMin == undefined) __newMin = 0;
		if (__newMax == undefined) __newMax = 0;
		if (__clamp == undefined) __clamp = false;
		if (__oldMin == __oldMax) return __newMin;
		var p = ((__value-__oldMin) / (__oldMax-__oldMin) * (__newMax-__newMin)) + __newMin;
		if (__clamp) p = __newMin < __newMax ? MathUtils.clamp(p, __newMin, __newMax) : MathUtils.clamp(p, __newMax, __newMin);
		return p;
	};

	/*

	public static function random(__min:Number, __maxExcluded:Number, __rounded:Boolean = false):Number {
		var n:Number = __min + (Math.random() * (__maxExcluded - __min));
		return __rounded ? Math.floor(n) : n;
	}
	*/

})();
