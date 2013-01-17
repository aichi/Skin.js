/**
 * Bounding box defined by two coordinates SouthWest and NorthEast
 * @constructs
 * @param {google.maps.LatLng} [sw]
 * @param {google.maps.LatLng} [ne]
 */
google.maps.LatLngBounds = function(sw, ne) {
	var topLeft,
		bottomRight;

	if (sw) {
		topLeft = sw;
		bottomRight = sw;

		if (ne) {
			topLeft = new nokia.maps.geo.Coordinate(ne.lat(), sw.lng());
			bottomRight = new nokia.maps.geo.Coordinate(sw.lat(), ne.lng());
		}
	} else {
		//values comes from Google Maps API
		topLeft = new nokia.maps.geo.Coordinate(1, 180);
		bottomRight = new nokia.maps.geo.Coordinate(-1,-180);
	}

	this.boundingBox = new nokia.maps.geo.BoundingBox(topLeft, bottomRight);
};

/**
 *
 * @param {google.maps.LatLng} latLng
 * @return {Boolean}
 */
google.maps.LatLngBounds.prototype.contains = function(latLng) {
	return this.boundingBox.contains(google.maps.LatLng.toCoordinate(latLng));
};

/**
 *
 * @param {google.maps.LatLngBounds} other
 * @return {Boolean}
 */
google.maps.LatLngBounds.prototype.equals = function(other) {
	return	this.boundingBox.topLeft.latitude == other.boundingBox.topLeft.latitude &&
			this.boundingBox.topLeft.longitude == other.boundingBox.topLeft.longitude &&
			this.boundingBox.bottomRight.latitude == other.boundingBox.bottomRight.latitude &&
			this.boundingBox.bottomRight.longitude == other.boundingBox.bottomRight.longitude;

};

/**
 *
 * @param {google.maps.LatLng} point
 * @return {google.maps.LatLngBounds}
 */
google.maps.LatLngBounds.prototype.extend = function(point) {
	return this.boundingBox.merge(new nokia.maps.geo.BoundingBox(point));
};

/**
 * @return {google.maps.LatLng}
 */
google.maps.LatLngBounds.prototype.getCenter = function() {
	return google.maps.LatLng.fromCoordinate(this.boundingBox.getCenter());
};

/**
 * @return {google.maps.LatLng}
 */
google.maps.LatLngBounds.prototype.getNorthEast = function() {
	return new google.maps.LatLng(
		this.boundingBox.topLeft.latitude,
		this.boundingBox.bottomRight.longitude
	);
};

/**
 * @return {google.maps.LatLng}
 */
google.maps.LatLngBounds.prototype.getSouthWest = function() {
	return new google.maps.LatLng(
		this.boundingBox.bottomRight.latitude,
		this.boundingBox.topLeft.longitude
	);
};

/**
 * @param {google.maps.LatLngBounds} other
 * @return {Boolean}
 */
google.maps.LatLngBounds.prototype.intersects = function(other) {
	return this.boundingBox.intersects(other.boundingBox);
};

/**
 * @return {Boolean}
 */
google.maps.LatLngBounds.prototype.isEmpty = function()	{
	return this.boundingBox.isEmpty();
};

/**
 * return {google.maps.LatLng}
 */
google.maps.LatLngBounds.prototype.toSpan = function() {
	return new google.maps.LatLng(
		this.boundingBox.getHeight(),
		this.boundingBox.getWidth()
	);
};
google.maps.LatLngBounds.prototype.toString = function() {
	return google.maps._toString(
		google.maps._toString(
			this.boundingBox.bottomRight.latitude,
			this.boundingBox.topLeft.longitude
		),
		google.maps._toString(
			this.boundingBox.topLeft.latitude,
			this.boundingBox.bottomRight.longitude
		)
	);
};

/**
 * "lat_lo,lng_lo,lat_hi,lng_hi"
 * @param {Number} precision
 * {String}
 */
google.maps.LatLngBounds.prototype.toUrlValue = function(precision) {
	return	this.boundingBox.bottomRight.latitude + "," +
			this.boundingBox.topLeft.longitude + "," +
			this.boundingBox.topLeft.latitude + "," +
			this.boundingBox.bottomRight.longitude;
};

/**
 *
 * @param {google.maps.LatLngBounds} other
 * @return {google.maps.LatLngBounds}
 */
google.maps.LatLngBounds.prototype.union = function(other) {
	var newBB = this.boundingBox.merge(other.boundingBox);

	return new google.maps.LatLngBounds(
		new google.maps.LatLng(
			newBB.bottomRight.latitude,
			newBB.topLeft.longitude
		),
		new google.maps.LatLng(
			newBB.topLeft.latitude,
			newBB.bottomRight.longitude
		)
	);
};

/**
 * Static method which returns LatLngBounds from nokia.maps.geo.BoundingBox
 * @param {nokia.maps.geo.BoundingBox} boundingBox
 * @return {google.maps.LatLngBounds}
 */
google.maps.LatLngBounds.fromBoundingBox = function(boundingBox) {
	var sw = new google.maps.LatLng(boundingBox.bottomRight.latitude, boundingBox.topLeft.longitude),
		ne = new google.maps.LatLng(boundingBox.topLeft.latitude, boundingBox.bottomRight.longitude);
	return new google.maps.LatLngBounds(sw, ne);
};