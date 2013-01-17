/**
 * Main map class
 * @constructs
 * @param {HTMLElement} mapDiv
 * @param {google.maps.MapOptions} opts
 */
google.maps.Map = function(mapDiv, opts) {
	var options = {};
	//UI components
	options.components = [];

	//todo translate MapOptions to nokia opt
	//required
	options.center = opts.center ? google.maps.LatLng.toCoordinate(opts.center) : new nokia.maps.geo.Coordinate(0,0);
	options.baseMapType = google.maps.MapTypeId.constantToBaseMapType(opts.mapTypeId);
	options.zoomLevel = opts.zoom;
	//optional
	opts.backgroundColor && (mapDiv.style.backgroundColor = opts.backgroundColor);
	if (opts.draggable === undefined || opts.draggable) {
		options.components.push(new nokia.maps.map.component.Behavior());
	}
	if ((!opts.disableDefaultUI && opts.mapTypeControl === undefined) || opts.mapTypeControl) {
		options.components.push(new nokia.maps.map.component.TypeSelector());
	}
	if (opts.overviewMapControl) {
		options.components.push(new nokia.maps.map.component.Overview());
	}
	if (opts.scaleControl) {
		options.components.push(new nokia.maps.map.component.ScaleBar());
	}
	if ((!opts.disableDefaultUI && opts.zoomControl === undefined) || opts.zoomControl) {
		options.components.push(new nokia.maps.map.component.ZoomBar());
	}

	//push InfoBubbles component because this component is needed in InfoWindow
	options.components.push(new nokia.maps.map.component.InfoBubbles());

	/*
draggableCursor	string	The name or url of the cursor to display when mousing over a draggable map.
draggingCursor	string	The name or url of the cursor to display when the map is being dragged.
keyboardShortcuts	boolean	If false, prevents the map from being controlled by the keyboard. Keyboard shortcuts are enabled by default.
mapMaker	boolean	True if Map Maker tiles should be used instead of regular tiles.
maxZoom	number	The maximum zoom level which will be displayed on the map. If omitted, or set to null, the maximum zoom from the current map type is used instead.
minZoom	number	The minimum zoom level which will be displayed on the map. If omitted, or set to null, the minimum zoom from the current map type is used instead.
noClear	boolean	If true, do not clear the contents of the Map div.
panControl	boolean	The enabled/disabled state of the Pan control.
panControlOptions	PanControlOptions	The display options for the Pan control.
rotateControl	boolean	The enabled/disabled state of the Rotate control.
rotateControlOptions	RotateControlOptions	The display options for the Rotate control.
streetView	StreetViewPanorama	A StreetViewPanorama to display when the Street View pegman is dropped on the map. If no panorama is specified, a default StreetViewPanorama will be displayed in the map's div when the pegman is dropped.
streetViewControl	boolean	The initial enabled/disabled state of the Street View Pegman control. This control is part of the default UI, and should be set to false when displaying a map type on which the Street View road overlay should not appear (e.g. a non-Earth map type).
streetViewControlOptions	StreetViewControlOptions	The initial display options for the Street View Pegman control.
styles	Array.<MapTypeStyle>	Styles to apply to each of the default map types. Note that styles will apply only to the labels and geometry in Satellite/Hybrid and Terrain modes.
		*/

	this.div = mapDiv;
	this.map = new nokia.maps.map.Display(mapDiv, options);

	//removing double click/wheel zoom after map initialization is simplier than adding Behavior components one by one
	if (opts.disableDoubleClickZoom) {
		this.map.removeComponent(this.map.getComponentById("zoom.DoubleClick"));
	}
	if (opts.scrollWhell !== undefined && !opts.scrollWheel) {
		this.map.removeComponent(this.map.getComponentById("zoom.MouseWheel"));
	}
	//tilt and heading have to be set after map instantiation
	opts.tilt && map.set("tilt", opts.tilt);
	opts.heading && map.set("heading", opts.heading);

	//adding observers and listeners to propagate events
	this._mapViewChangeEndListener = this._mapViewChangeEndListener.bind(this);
	this.map.addListener("mapviewchangeend", this._mapViewChangeEndListener);

	this._basicObserver = this._basicObserver.bind(this);
	this.map.addObserver("zoomLevel", this._basicObserver);
	this.map.addObserver("tilt", this._basicObserver);
	this.map.addObserver("heading", this._basicObserver);
	this.map.addObserver("center", this._basicObserver);

	this._baseMapTypeObserver = this._baseMapTypeObserver.bind(this);
	this.map.addObserver("baseMapType", this._baseMapTypeObserver);

	this._resizeListener = this._resizeListener.bind(this);
	this.map.addListener("resize", this._resizeListener);

	this._domEventsListener = this._domEventsListener.bind(this);
	this.map.addListener("click", this._domEventsListener);
	this.map.addListener("dblclick", this._domEventsListener);
	this.map.addListener("drag", this._domEventsListener);
	this.map.addListener("dragend", this._domEventsListener);
	this.map.addListener("dragstart", this._domEventsListener);
	this.map.addListener("mousemove", this._domEventsListener);
	this.map.addListener("mouseout", this._domEventsListener);
	this.map.addListener("mouseover", this._domEventsListener);
	this.map.addListener("rightclick", this._domEventsListener);

	// Because Map is MVCObject its properties should be set by bindings, we have to observe itself to propagate
	// these changes to nokia map instance.
	this.addObserver("*", function(obj, key, value, oldValue) {
		switch (key) {
			case "center":
				obj.map.set("center", google.maps.LatLng.toCoordinate(value));
				break;
			case "zoom":
				obj.map.set("zoomLevel", value);
				break;
			case "tilt":
			case "heading":
				obj.map.set(key, value);
				break;
			case "mapTypeId":
				obj.map.set("baseMapType", google.maps.MapTypeId.constantToBaseMapType(value));
				break;
		}
	});
};

google.maps._subClass(google.maps.MVCObject, google.maps.Map);

/*********************************** PROPERTIES ***************************************/
/**
 * @type Array.<google.maps.MVCArray.<HTMLElement>>
 */
google.maps.Map.prototype.controls = [];

/**
 * @type google.maps.MapTypeRegistry
 */
google.maps.Map.prototype.mapTypes = null;

/**
 * @type google.maps.MVCArray.<google.maps.MapType>
 */
google.maps.Map.prototype.overlayMapTypes = [];


/*********************************** METHODS ***************************************/

/**
 *
 * @param {google.maps.LatLngBounds} bounds
 */
google.maps.Map.prototype.fitBounds = function(bounds) {
	this.map.zoomTo(bounds.boundingBox);
};

/**
 * @return {google.maps.LatLngBounds|null}
 */
google.maps.Map.prototype.getBounds = function() {
	return google.maps.LatLngBounds.fromBoundingBox(this.map.getViewBounds());
};

/**
 * @return {google.maps.LatLng}
 */
google.maps.Map.prototype.getCenter = function() {
	return google.maps.LatLng.fromCoordinate(this.map.center);
};

/**
 * @return {HTMLElement}
 */
google.maps.Map.prototype.getDiv = function() {return this.div;}

/**
 * Clockwise degree from north
 * @return {Number}
 */
google.maps.Map.prototype.getHeading = function() {
	return this.map.heading;
};

/**
 * @return {google.maps.MapTypeId|string}
 */
google.maps.Map.prototype.getMapTypeId = function() {
	return google.maps.MapTypeId.baseMapTypeToConstant(this.map.baseMapType);
};

/**
 * TODO returning projection
 * @return {google.maps.Projection|null}
 */
google.maps.Map.prototype.getProjection = function() {return null};

/**
 * TODO: this must be investigated
 * @return {google.maps.StreetViewPanorama}
 */
google.maps.Map.prototype.getStreetView = function() {return null};

/**
 * Default value is 0
 * @return {Number}
 */
google.maps.Map.prototype.getTilt = function() {
	return this.map.tilt;
};

/**
 * @return {Number}
 */
google.maps.Map.prototype.getZoom = function() {
	return this.map.zoomLevel;
};

/**
 * Small distances are animated
 * @param {Number} x
 * @param {Number} y
 */
google.maps.Map.prototype.panBy = function(x, y) {
	this.map.pan(0, 0, x, y, "default");
};

/**
 * Small distances are animated
 * @param {google.maps.LatLng} latLng
 */
google.maps.Map.prototype.panTo = function(latLng) {
	this.map.setCenter(google.maps.LatLng.toCoordinate(latLng), "default");
};

/**
 * Small distances in viewport are paned with animation
 * @param {google.maps.LatLngBounds} latLngBounds
 */
google.maps.Map.prototype.panToBounds = function(latLngBounds) {
	//todo if bounds are bigger than viewport show NW corner!
	this.map.setCenter(google.maps.LatLng.toCoordinate(latLngBounds.getCenter()), "default");
};

/**
 * @param {google.maps.LatLng} latlng
 */
google.maps.Map.prototype.setCenter = function(latLng) {
	this.map.setCenter(google.maps.LatLng.toCoordinate(latLng));
};

/**
 * 0 for north
 * @param {Number} heading
 */
google.maps.Map.prototype.setHeading = function(heading) {
	this.map.setHeading(heading);
};

/**
 * setBaseMapType
 * @param {google.maps.MapTypeId|String} mapTypeId
 */
google.maps.Map.prototype.setMapTypeId = function(mapTypeId) {
	this.map.setBaseMapType(google.maps.MapTypeId.constantToBaseMapType(mapTypeId));
};

/**
 * TODO set options = like setAttributs and others
 * @param {google.maps.MapOptions} options
 */
google.maps.Map.prototype.setOptions = function(options) {};

/**
 * TODO: when Nokia API with Panorama comes that this can be implemented
 * @param {google.maps.StreetViewPanorama} panorama
 */
google.maps.Map.prototype.setStreetView = function(panorama) {};

/**
 *
 * @param {Number} tilt
 */
google.maps.Map.prototype.setTilt = function(tilt) {
	this.map.setTilt(tilt);
};

/**
 * @param {Number} zoom
 */
google.maps.Map.prototype.setZoom = function(zoom) {
	this.map.setZoomLevel(zoom);
};

/*********************************** EVENTS ***************************************/

/**
 * Emits zoom_changed, tilt_changed and heading_changed, center_changed event
 */
google.maps.Map.prototype._basicObserver = function(obj, key, newValue, oldValue) {
	if (key === "zoomLevel") {
		this.zoom_changed && this.zoom_changed();
		google.maps.event.trigger(this, "zoom_changed");
	}
	if (key === "tilt") {
		this.tilt_changed && this.tilt_changed();
		google.maps.event.trigger(this, "tilt_changed");
	}
	if (key === "heading") {
		this.heading_changed && this.heading_changed();
		gooogle.maps.event.trigger(this, "heading_changed");
	}
	if (key === "center") {
		this.center_changed && this.center_changed();
		google.maps.event.trigger(this, "center_changed");
	}
};

/**
 * Emits idle event
 * @param event
 */
google.maps.Map.prototype._mapViewChangeEndListener = function(event) {
	if ((event.data & event.MAPVIEWCHANGE_CENTER) || (event.data & event.MAPVIEWCHANGE_ZOOM)) {
		google.maps.event.trigger(this, "idle");
	}
};

/**
 * Emits event resize and bounds_changed because we are not distinguishing them
 * @param event
 */
google.maps.Map.prototype._resizeListener = function(event) {
	google.maps.event.trigger(this, "resize");

	this.bounds_changed && this.bounds_changed();
	google.maps.event.trigger(this, "bounds_changed");

	//when user resize window original gMap is firing also center changed, even if center is not changed
	//that is because center is slightly moving because of rounding issues px->degree transformation.
};

/**
 * Emits all mouse and drag events, this event is "MouseEvent" which contains stop method
 * and also latLng property
 * @param {Event} event
 */
google.maps.Map.prototype._domEventsListener = function(event) {
	google.maps.event.trigger(this, event.type, google.maps.event._createCustomDomEvent(event));
};

/**
 * Emits maptypeid_changed event
 */
google.maps.Map.prototype._baseMapTypeObserver = function(obj, key, newValue, oldValue) {
	this.maptypeid_changed && this.maptypeid_changed();
	google.maps.event.trigger(this, "maptypeid_changed");
};

/*
projection_changed	None	This event is fired when the projection has changed.
tilesloaded	None	This event is fired when the visible tiles have finished loading.
*/