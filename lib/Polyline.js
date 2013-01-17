(function(){
	var UNDEF;

	/**
	 * Renders a polyline on the map
	 * @param opt
	 * @constructor
	 */
	google.maps.Polyline = function(opt) {
		var coords;

		this.strokeOpacity = 1;
		this.strokeColor = "#000";
		this.strokeWidth = 4;
		this.polyline = new nokia.maps.map.Polyline([], {pen: {strokeColor: this.strokeColor, lineWidth: this.strokeWidth}});

		//set DOM Event listeners
		this._domEventsListener = this._domEventsListener.bind(this);
		this.marker.addListener("click", this._domEventsListener);
		this.marker.addListener("dblclick", this._domEventsListener);
		this.marker.addListener("mousedown", this._domEventsListener);
		this.marker.addListener("mouseout", this._domEventsListener);
		this.marker.addListener("mousemove", this._domEventsListener);
		this.marker.addListener("mouseover", this._domEventsListener);
		this.marker.addListener("mouseup", this._domEventsListener);
		this.marker.addListener("rightclick", this._domEventsListener);

		// Because Polyline is MVCObject properties observer should be set, see Map.
		this.addObserver("*", function(obj, key, value, oldValue) {
			switch (key) {
				case "clickable":
				case "editable":
				case "geodesic":
				case "icons":
					break;
				case "map":
					obj.polyline.path.getLength() && obj._attachToMap(value);
					break;
				case "path":
					if (!(obj.path instanceof google.maps.MVCArray)) {
						obj.path = new google.maps.MVCArray(obj.path);
					}

					//observing path to modify internal polyline path
					obj.path.addObserver(obj._pathObserver, obj);
					oldValue && oldValue.removeObserver(obj._pathObserver, obj);

					coords = obj._latLngMVCArrayToCoordsArray(obj.path);
					obj.polyline.set("path", coords);

					obj.map && !obj.polyline.getDisplays().length && obj._attachToMap(obj.map);

					break;
				case "strokeColor":
				case "strokeOpacity":
					obj.polyline.set("pen", new nokia.maps.util.Pen({
						strokeColor: nokia.maps.util.ColorHelper.getHex3(obj.strokeColor) + nokia.maps.gfx.Color.byteOf(obj.strokeOpacity)
					}, obj.polyline.pen));
					break;
				case "strokeWeight":
					obj.polyline.set("pen", new nokia.maps.util.Pen({
						lineWidth: obj.strokeWidth
					}));
					break;
				case "zIndex":
					obj.polyline.set(key, value);
					break;
				case "visible":
					obj.polyline.set("visibility", obj.visible);
					break;

			}
		});

		this.visible = true;
		this.editable = false;
		this.geodesic = false;

		this.setOptions(opt);
		this.clickable == UNDEF && this.set("clickable", true);
	};

	google.maps._subClass(google.maps.MVCObject, google.maps.Polyline);

	/**
	 * Internal method which attach polyline to map
	 * @param {google.maps.Map} value
	 * @private
	 */
	google.maps.Polyline.prototype._attachToMap = function(value) {
		if (this.map) {
			this.map.map.objects.remove(this.polyline);
		}

		if (value) {
			this.map = value;
			map.map.objects.add(this.polyline);
		}
	};

	/**
	 * Path observer which propagates changes to internal nokia polyline path
	 * @param {nokia.maps.util.OList} obj path
	 * @param {String} operation add or remove
	 * @param {google.maps.Coordinate} element
	 * @param {Number} index
	 * @private
	 */
	google.maps.Polyline.prototype._pathObserver = function(obj, operation, element, index) {
		if (operation == "add")
			this.polyline.path.add(google.maps.LatLng.toCoordinate(element), index);
		else if (operation == "remove")
			this.polyline.path.removeAt(index);
	};

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
	google.maps.Polyline.prototype.setEditable = function(editable) {
		this.set("editable", editable);
	};

	/**
	 * Attach shape to map
	 * @param {google.maps.Map} map
	 */
	google.maps.Polyline.prototype.setMap = function(map) {
		this.set("map", map);
	};

	/**
	 * Sets options
	 * @param {google.maps.PolylineOptions} options
	 */
	google.maps.Polyline.prototype.setOptions = function(options) {
		//populate own properties
		this.setValues(options);

		/*options.clickable && this.set("clickable", options.clickable);
		options.editable && this.set("editable", options.editable);
		options.geodesic && this.set("geodesic", options.geodesic);
		options.icons && this.set("icons", options.icons);
		options.map && this.set("map", options.map);
		options.path && this.set("path", options.path);
		options.strokeColor && this.set("strokeColor", options.strokeColor);
		options.strokeOpacity && this.set("strokeOpacity", options.strokeOpacity);
		options.strokeWeight && this.set("strokeWeight", options.strokeWeight);
		options.visible && this.set("visible", options.visible);
		options.zIndex && this.set("zIndex", options.zIndex); */
	};

	/**
	 * Sets first path
	 * @param  {google.maps.MVCArray<google.maps.LatLng>|Array<google.maps.LatLng>} path
	 */
	google.maps.Polyline.prototype.setPath = function(path) {
		this.set("path", path);
	};

	/**
	 * Sets visibility of polyline
	 * @param {Boolean} visible
	 */
	google.maps.Polyline.prototype.setVisible = function(visible) {
		this.set("visible", visible);
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
			a.push(google.maps.LatLng.toCoordinate(input.get(i)));
		}
		return a;
	};

	/**
	 * Emits all mouse events, this event is "PolyMouseEvent" which extends MouseEvent and has
	 * edge, vertex, path properties
	 * @param {Event} event
	 */
	google.maps.Polyline.prototype._domEventsListener = function(event) {
		var polyEvent,
			nearestPoint;
		if (this.clickable) {
			polyEvent = google.maps.event._createCustomDomEvent(event);

			nearestPoint = this.polyline.getNearestIndex(google.maps.LatLng.toCoordinate(polyEvent.latLng));
			polyEvent.edge = nearestPoint == this.polyline.path.getLength() ? nearestPoint - 1 : nearestPoint;
			polyEvent.path = 0; //todo: seems that polylines can be made from more than one path, we now support only one path

			//if vertex and this.editable == true
			//polyEvent.vertex = number;

			google.maps.event.trigger(this, event.type, polyEvent);
		}
	};
}())