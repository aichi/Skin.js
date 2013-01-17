(function(){
	//trick to get reference to icon of StandardMarker which can be used if user don't specify its own icon
	var _marker = new nokia.maps.map.Marker(new nokia.maps.geo.Coordinate(0,0)),
		icon = _marker.icon,
		anchor = _marker.anchor;
		UNDEF = undefined;

	google.maps.Marker = function(opts) {
		var coord = google.maps.LatLng.toCoordinate(opts.position),
			opt = {icon: icon},
			x = anchor.x,
			y = anchor.y;
		
		this.marker = nokia.maps.dom.EventTarget(new nokia.maps.map.Marker(coord, opt));
		this.map; //to which marker belongs to
		this.origin = new google.maps.Point(0, 0); //default value
		this.clickable; //if marker catch mouse/touch events. Default = true;
		this._iconImage;//store for Image object which has always with and height

		//set DOM Event listeners
		this._domEventsListener = this._domEventsListener.bind(this);
		this.marker.addListener("click", this._domEventsListener);
		this.marker.addListener("dblclick", this._domEventsListener);
		this.marker.addListener("drag", this._domEventsListener);
		this.marker.addListener("dragend", this._domEventsListener);
		this.marker.addListener("dragstart", this._domEventsListener);
		this.marker.addListener("mousedown", this._domEventsListener);
		this.marker.addListener("mouseout", this._domEventsListener);
		this.marker.addListener("mouseover", this._domEventsListener);
		this.marker.addListener("mouseup", this._domEventsListener);
		this.marker.addListener("rightclick", this._domEventsListener);

		// Because Marker is MVCObject properties observer should be set, see Map.
		this.addObserver("*", function(obj, key, value, oldValue) {
			switch (key) {
				case "position":
					obj.marker.set("coordinate", google.maps.LatLng.toCoordinate(value));
					break;
				case "draggable":
				case "zIndex":
					obj.marker.set(key, value);
					break;
				case "visible":
					//obj.marker.set("visibility", value);
					//todo: how to set visibility?
					break;
				case "icon":
					var icon;
					if (value.url && !value.height) {  //google.maps.Icon
						icon = new nokia.maps.gfx.BitmapImage(
							value.url,
							document,
							value.size ? value.size.width : UNDEF,   //this is wrong, because we need crop from origin to size, which should be async and more complex
							value.size ? value.size.height : UNDEF,
							value.origin ? value.origin.width : UNDEF,
							value.origin ? value.origin.height : UNDEF);
						value.origin && (obj.origin = value.origin);
						//todo: scaling is not supported in 2.2.3 version
						obj._iconImage = icon;
					} else if (value.path) { //google.maps.Symbol
						//todo: support  Symbol
					} else {
						icon = new nokia.maps.gfx.BitmapImage(
							value,
							document
						);
						obj._iconImage = icon;
					}
					obj._iconImage.prepare(function(){
						obj.marker.set("anchor", new nokia.maps.util.Point(this._iconImage.width/2, this._iconImage.height));
						obj.marker.set("icon", obj._iconImage);
					}, obj);
					
					break;
				case "anchorPoint":
					//obj.marker.set("anchor", new nokia.maps.util.Point(value.x, value.y));
					break;
				case "shape":
					obj.marker.set("hitArea", obj._prepareHitArea(value));
					break;
				case "clickable":
					break;
				case "map":
					if (obj.map) {
						obj.map.map.objects.remove(obj.marker);
					}

					if (value) {
						obj.map = value;
						obj.marker && obj.map.map.objects.add(obj.marker);
					}
					break;
			}
		});

		this.setOptions(opts);
		this.clickable == UNDEF && this.set("clickable", true);
		if (this.anchorPoint == UNDEF) {
			//marker is made by another image
			if (this.marker && this.marker.icon !== icon) {
				if (this.marker.icon.width) {
					x = this.marker.icon.width;
					y = this.marker.icon.height;
				}
				//todo: can be improved by onload handler when string or not loaded Image to get propper size
			}
			//todo: there is wrong assumptions that anchorPoint is same like anchor in nAPI!!! split them!!!
			this.set("anchorPoint", new google.maps.Point(x, y));
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
	google.maps.Marker.prototype.getClickable = function ()	{
		return this.clickable;
	};

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
	google.maps.Marker.prototype.setAnimation = function (animation) {
		this.set("animation", animation);
	};

	/**
	 * @param {Boolean} flag
	 */
	google.maps.Marker.prototype.setClickable = function (flag) {
		this.set("clickable", flag);
	};

	/**
	 * @param {String} cursor
	 */
	google.maps.Marker.prototype.setCursor = function (cursor) {
		this.set("cursor", cursor);
	};

	/**
	 * @param {Boolean} flag
	 */
	google.maps.Marker.prototype.setDraggable = function (flag) {
		this.set("draggable", flag);
	};

	/**
	 * @param {Boolean} flag
	 */
	google.maps.Marker.prototype.setFlat = function (flag) {
		this.set("flat", flag);
	};

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
		this.set("map", map);
	};

	/**
	 * @param {google.maps.MarkerOptions} options
	 */
	google.maps.Marker.prototype.setOptions = function (options) {
		//populate own properties
		this.setValues(options);
		/*
		options.draggable && this.setDraggable(options.draggable);
		options.icon && this.setIcon(options.icon); //todo: convert from Icon/Symbol to gfx.Image, now working only with strings
		options.shape && this.setShape(options.shape);
		options.visible !== undefined && this.setVisible(options.visible);
		options.zIndex && this.setZIndex(options.zIndex);
		options.position && this.setPosition(options.position);

		//attach to map if map is set
		options.map && this.setMap(options.map); */
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
	google.maps.Marker.prototype.setShadow = function (shadow) {
		this.set("shadow", shadow);
	};

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
		this.marker.set("title", title);
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

	/**
	 * Emits all mouse and drag events, this event is "MouseEvent" which contains stop method
	 * and also latLng property
	 * @param {Event} event
	 */
	google.maps.Marker.prototype._domEventsListener = function(event) {
		this.clickable && google.maps.event.trigger(this, event.type, google.maps.event._createCustomDomEvent(event));
	};

}());

/**
 * google.maps.Icon is literal object with properties:
 * anchor	Point	The position at which to anchor an image in correspondance to the location of the marker on the map. By default, the anchor is located along the center point of the bottom of the image.
 * origin	Point	The position of the image within a sprite, if any. By default, the origin is located at the top left corner of the image (0, 0).
 * scaledSize	Size	The size of the entire image after scaling, if any. Use this property to stretch/shrink an image or a sprite.
 * size	Size	The display size of the sprite or image. When using sprites, you must specify the sprite size. If the size is not provided, it will be set when the image loads.
 * url	string	The URL of the image or sprite sheet.
 */