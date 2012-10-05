/**
 * Created by zeh on 8:51 PM, 9/24/12
 */

if (("01").substr(-1, 1) != "1") {
	// Ugly fix for IE 8
	if (window.console && window.console.log) window.console.log("No String.substr(-n, n) function available; creating shim");
	String.prototype.substr = function(__start, __length) {
		if (__start < 0) {
			return this.substr(this.length + __start, __length);
		} else {
			if (isNaN(__length)) {
				return this.substring(__start);
			} else {
				return this.substring(__start, __start + __length);
			}
		}
	};
}
