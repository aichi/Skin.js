google.maps.Marker = function(opts) {
	var coord = opts.position.coordinate,
		opt = {};



	this.marker = new nokia.maps.map.StandardMarker(coord, opt);
	this.map; //to which marker belongs to

	//attach to map if map is set
	if (opts.map) {
		this.setMap(opts.map);
	}
};

google.maps._subClass(google.maps.MVCObject, google.maps.Marker);

google.maps.Marker.MAX_ZINDEX = 1000000;

/**
 * @return {google.maps.Animation}
 */
google.maps.Marker.prototype.getAnimation = function ()	{
	return null;
};

/**
 * @return {Boolean}
 */
google.maps.Marker.prototype.getClickable = function ()	{};

/**
 * @return {String}
 */
google.maps.Marker.prototype.getCursor = function () {
	return "hand";
};

/**
 * @return {Boolean}
 */
google.maps.Marker.prototype.getDraggable = function () {
	return this.marker.draggable;
};

/**
 * There is no way to have marker with shadows
 * @return {Boolean}
 */
google.maps.Marker.prototype.getFlat = function () {
	return false;
};

/**
 * @return {String | google.maps.Icon | google.maps.Symbol}
 */
google.maps.Marker.prototype.getIcon = function () {
	return "";
};

/**
 * @return {google.map.Map | google.map.StreetViewPanorama}
 */
google.maps.Marker.prototype.getMap = function () {
	return this.map;
};

/**
 * @return {google.map.LatLng}
 */
google.maps.Marker.prototype.getPosition = function () {
	return google.maps.LatLng.fromCoordinate(this.marker.coordinate);
};

/**
 * There is no way to have marker with shadows
 * @return {String | google.map.Icon | google.map.Symbol}
 */
google.maps.Marker.prototype.getShadow = function () {
	return "";
};

/**
 * Returns the hitarea of marker
 * @return {google.map.MarkerShape}
 */
google.maps.Marker.prototype.getShape = function () {
	var hitArea = this.marker.hitArea;
	return {type: hitArea.type, coords: hitArea.values};
};

/**
 * Returns title
 * @return {String}
 */
google.maps.Marker.prototype.getTitle = function () {
	return this.marker.text;
};

/**
 * @return {Boolean}
 */
google.maps.Marker.prototype.getVisible = function () {
	return this.marker.isVisible();
};
/**
 * @return {Number}
 */
google.maps.Marker.prototype.getZIndex = function () {
	return this.marker.zIndex;
};

/**
 * Start an animation. Any ongoing animation will be cancelled. Currently supported animations are: BOUNCE, DROP.
 * Passing in null will cause any animation to stop.
 * @param {google.map.Animation} animation
 */
google.maps.Marker.prototype.setAnimation = function (animation) {};

/**
 * @param {Boolean} flag
 */
google.maps.Marker.prototype.setClickable = function (flag) {};

/**
 * @param {String} cursor
 */
google.maps.Marker.prototype.setCursor = function (cursor) {};

/**
 * @param {Boolean} flag
 */
google.maps.Marker.prototype.setDraggable = function (flag) {
	this.marker.set("draggable", flag);
};

/**
 * @param {Boolean} flag
 */
google.maps.Marker.prototype.setFlat = function (flag) {};

/**
 * @param {string | google.map.Icon | google.map.Symbol} icon
 */
google.maps.Marker.prototype.setIcon = function (icon) {};

/**
 * Renders the marker on the specified map or panorama. If map is set to null, the marker will be removed.
 * @param {google.map.Map|google.map.StreetViewPanorama} map
 */
google.maps.Marker.prototype.setMap = function (map) {
	if (this.map) {
		this.map.map.objects.remove(this.marker);
	}

	if (map) {
		this.map = map;
		map.map.objects.add(this.marker);
	}
};

/**
 * @param {google.maps.MarkerOptions} options
 */
google.maps.Marker.prototype.setOptions = function (options) {};

/**
 * @param {google.map.LatLng} latlng
 */
google.maps.Marker.prototype.setPosition = function (latlng) {
	this.marker.set("center", latlng.coordinate);
};

/**
 * @param {string | google.map.Icon | google.map.Symbol} shadow
 */
google.maps.Marker.prototype.setShadow = function (shadow) {};

/**
 * Set the hitarea
 * @param {google.map.MarkerShape} shape
 */
google.maps.Marker.prototype.setShape = function (shape) {
	this.marker.set("hitArea", {type: shape.type, values: shape.coords});
};

/**
 * @param {String} title
 */
google.maps.Marker.prototype.setTitle = function (title) {
	this.marker.set("title", title);
};

/**
 * @param {Boolean} visible
 */
google.maps.Marker.prototype.setVisible = function (visible) {
	this.marker.set("visible", visible);
};

/**
 * @param {Number} zIndex
 */
google.maps.Marker.prototype.setZIndex = function (zIndex) {
	this.marker.set("zIndex", zIndex);
};