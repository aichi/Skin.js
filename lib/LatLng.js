/**
 * Coordinate class, by default wraps longitude to [-180, 180)
 * @constructs
 * @param {Number} lat
 * @param {Number} lng
 * @param {Boolean} noWrap
 */
google.maps.LatLng = function(lat, lng, noWrap){
	if (noWrap) {
		this.noWrap = true;
		this.longitude = lng;
		lng = -180 + google.maps._modulo(lng + 180, 360);
	}

	this.coordinate = new nokia.maps.geo.Coordinate(lat, lng);
};

/**
 *
 * @param {google.maps.LatLng} other
 * @return {Boolean}
 */
google.maps.LatLng.prototype.equals = function(other) {
	return this.coordinate.equals(other.coordinate) && this.longitude == other.longitude;
};

/**
 * @return {Number}
 */
google.maps.LatLng.prototype.lat = function() {return this.coordinate.latitude;};

/**
 * @return {Number}
 */
google.maps.LatLng.prototype.lng = function() {
	return this.noWrap ?
		this.longitude :
		this.coordinate.longitude;
};

/**
 * @return {String}
 */
google.maps.LatLng.prototype.toString = function() {
	return google.maps._toString(this.lat(), this.lng());
};

/**
 * TODO take in account precision
 * @param {Number=} [precision]
 * @return {String}
 */
google.maps.LatLng.prototype.toUrlValue = function(precision) {
	return this.lat() + "," + this.lng();
};

/**
 * Static method which returns LatLng from nokia.maps.geo.Coordinate
 * @param {nokia.maps.geo.Coordinate} coordinate
 * @return {google.maps.LatLng}
 */
google.maps.LatLng.fromCoordinate = function(coordinate) {
	return new google.maps.LatLng(coordinate.latitude, coordinate.longitude)
};

/**
 * Static method which returns Nokia Coordiante from given LatLng.
 * @param {google.maps.LatLng} latLng
 * @return {nokia.maps.geo.Coordinate} 
 */
google.maps.LatLng.toCoordinate = function(latLng) {
	return latLng.coordinate ? latLng.coordinate : new nokia.maps.geo.Coordinate(latLng.lat(), latLng.lng());
};