/**
 * Renders a polyline on the map
 * @param opt
 * @constructor
 */
google.maps.Polyline = function(opt) {
	var coords,
		polyOpts = {pen: {}};

	this.polyline = null;

	//handling settings

	this.setValues(opt);

	if (this.path) {
		if (!(this.path instanceof google.maps.MVCArray)) {
			this.path = new google.maps.MVCArray(this.path);
		}

		coords = this._latLngMVCArrayToCoordsArray(this.path);
		if (!this.polyline) {
			if (this.strokeColor) polyOpts.pen.strokeColor = this.strokeOpacity ? nokia.maps.util.ColorHelper.getHex3(this.strokeColor) + nokia.maps.gfx.Color.byteOf(this.strokeOpacity) : this.strokeColor;
			if (this.strokeWidth) polyOpts.pen.lineWidth = this.strokeWidth;
			if (this.zIndex) polyOpts.zIndex = this.zIndex;
			if (this.visible) polyOpts.visible = this.visible;
			this.polyline = new nokia.maps.map.Polyline (coords, polyOpts);
		} else {
			this.polyline.set("path", coords);
			//todo: set options to polyline too
		}

	}

	if (this.map && this.polyline) {
		this.setMap(this.map);
	}
}

google.maps._subClass(google.maps.MVCObject, google.maps.Polyline);

/**
 * Returns if polyline is editable by user
 * @return {Boolean}
 */
google.maps.Polyline.prototype.getEditable = function() {
	return false;
};

/**
 * Returns map to which is shape attached
 * @return {google.maps.Map}
 */
google.maps.Polyline.prototype.getMap = function() {
	return this.map;
};

/**
 * Returns shape path
 * @return {MVCArray.<google.maps.LatLng>}
 */
google.maps.Polyline.prototype.getPath = function() {
	return this.path;
};

/**
 * Returns if polyline is visible
 * @return {Boolean}
 */
google.maps.Polyline.prototype.getVisible = function() {
	return this.polyline.isVisible();
};

/**
 * Set shape as user editable
 * @param {Boolean} editable
 * @todo: there is no easy way to support this attribute
 */
google.maps.Polyline.prototype.setEditable = function(editable) {};

/**
 * Attach shape to map
 * @param {google.maps.Map} map
 */
google.maps.Polyline.prototype.setMap = function(map) {
	if (this.map) {
		this.map.map.objects.remove(this.polyline);
	}

	if (map) {
		this.map = map;
		map.map.objects.add(this.polyline);
	}
};

/**
 * Sets options
 * @param {google.maps.PolylineOptions} options
 */
google.maps.Polyline.prototype.setOptions = function(options) {};

/**
 * Sets first path
 * @param  {google.maps.MVCArray<google.maps.LatLng>|Array<google.maps.LatLng>} path
 */
google.maps.Polyline.prototype.setPath = function(path) {

};

/**
 * Sets visibility of polyline
 * @param {Boolean} visible
 */
google.maps.Polyline.prototype.setVisible = function(visible) {
	this.polyline.set("visible", visible);
};

/**
 * Converts MVCArray to array of coordinates
 * @param {google.maps.MVCArray<google.maps.LatLng>} input
 * @return {Array<nokia.maps.geo.Coordinate>}
 * @private
 */
google.maps.Polyline.prototype._latLngMVCArrayToCoordsArray = function(input) {
	var a = [],
		i,
		len = input.getLength();

	for (i = 0; i < len; i++) {
		a.push(input.get(i).coordinate);
	}
	return a;
}