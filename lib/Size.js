/**
 * Size class
 * @param {Number} width
 * @param {Number} height
 * @param {String} [widthUnit]
 * @param {String} [heightUnit]
 * @constructor
 */
google.maps.Size = function(width, height, widthUnit, heightUnit) {
	this.width = width;
	this.height = height;
	this.widthUnit = widthUnit;
	this.heightUnit = heightUnit;
};

/**
 * Compare two Sizes
 * @param {google.maps.Size} other
 * @return {Boolean}
 */
google.maps.Size.prototype.equals = function(other) {
	return this.width == other.width && this.height == other.height;
};

/**
 * @return {String}
 */
google.maps.Size.prototype.toString = function() {
	return google.maps._toString(this.width, this.height);
};
