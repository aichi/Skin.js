google.maps.Marker = function(opts) {
	var opt = {},
		coord = opts.position.coordinate;
	this.marker = new nokia.maps.map.StandardMarker(coord, opt);
	this.map; //to which marker belongs to

	this.setOptions(opts);

	// Because Marker is MVCObject properties observer should be set, see Map.
	this.addObserver("*", function(obj, key, value, oldValue) {
		switch (key) {
			case "position":
				obj.marker.set("coordinate", value.coordinate);
				break;
			case "draggable":
			case "zIndex":
				obj.marker.set(key, value);
				break;
			case "visible":
				//obj.marker.set("visibility", value);
				//todo: how to set visibility?
			case "icon":
				//todo: icon other than string
				obj.marker.set("icon", value);
				break;
			case "shape":
				obj.marker.set("hitArea", obj._prepareHitArea(value));
				break;
		}
	});
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
	this.set("draggable", flag);
};

/**
 * @param {Boolean} flag
 */
google.maps.Marker.prototype.setFlat = function (flag) {};

/**
 * @param {string | google.map.Icon | google.map.Symbol} icon
 */
google.maps.Marker.prototype.setIcon = function (icon) {
	this.set("icon", icon);
};

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
google.maps.Marker.prototype.setOptions = function (options) {
	//populate own properties
	this.setValues(options);

	options.draggable && this.setDraggable(options.draggable);
	options.icon && this.setIcon(options.icon); //todo: convert from Icon/Symbol to gfx.Image, now working only with strings
	options.shape && this.setShape(options.shape);
	options.visible !== undefined && this.setVisible(options.visible);
	options.zIndex && this.setZIndex(options.zIndex);
	options.position && this.setPosition(options.position);

	//attach to map if map is set
	options.map && this.setMap(options.map);
};

/**
 * @param {google.map.LatLng} latlng
 */
google.maps.Marker.prototype.setPosition = function (latlng) {
	this.set("position", latlng);
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
	this.set("shape", shape);
};

/**
 * Prepares HitArea from google.maps.Shape
 * @param shape
 * @return {nokia.maps.map.IHitArea}
 * @private
 */
google.maps.Marker.prototype._prepareHitArea = function(shape) {
	return {type: shape.type, values: shape.coords};
};

/**
 * Title is shown on mouse hover
 * @param {String} title
 */
google.maps.Marker.prototype.setTitle = function (title) {
	//this.marker.set("title", title);
};

/**
 * @param {Boolean} visible
 */
google.maps.Marker.prototype.setVisible = function (visible) {
	this.set("visible", visible);
};

/**
 * @param {Number} zIndex
 */
google.maps.Marker.prototype.setZIndex = function (zIndex) {
	this.set("zIndex", zIndex);
};