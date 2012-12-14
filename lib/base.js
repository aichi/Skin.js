// not rewrite main namespace
window.google = window.google || {};
// rewrite maps namespace with our own
window.google.maps = {
	/**
	 * Basic method which serializes arguments to string (arg1, arg2,..., argN)
	 * @return {String}
	 */
	_toString: function() {
		return "(" + Array.prototype.slice.call(arguments).join(", ") + ")";
	},

	/**
	 * Function which can compute MOD for negative numbers,
	 * {@link http://www.yourdailygeekery.com/2011/06/28/modulo-of-negative-numbers.html}
	 *
	 * @param {Number} a
	 * @param {Number} b
	 * @return {Number}
	 */
	_modulo: function (a, b) {
		return ((a % b) + b) % b;
	},

	/**
	 * Subclassing of super class
	 * @param {Function} sup
	 * @param {Object} sub
	 */
	_subClass: function(sup, sub){
		sub.prototype = new sup();
		sub.prototype.super = sub.prototype.constructor;
		sub.prototype.constructor = sub;
		return sub;
	}
};

