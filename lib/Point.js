/**
 * Basic clas represening point, it is so simple so there is no need to mimic it with nokia.maps.util.Point
 * @param {Number} x
 * @param {Number} y
 */
google.maps.Point = function(x, y) {
	this.x = x;
	this.y = y;
};

/**
 * Return if both points are equal
 * @param {goole.maps.Point} other
 * @return {Boolean}
 */
google.maps.Point.prototype.equals = function(other) {
	return this.x == other.x && this.y == other.y;
};

/**
 * Returns string representation
 * @return {String}
 */
google.maps.Point.prototype.toString = function() {
	return google.maps._toString(this.x, this.y);
};

/**
 * Transformation of Nokia point to gMap point
 * @param {nokia.maps.util.Point} point
 * @return {google.maps.Point}
 */
google.maps.Point.fromPoint = function(point) {
	return new google.maps.Point(point.x, point.y);
};