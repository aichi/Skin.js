(function(){
	var UNDEF;

	google.maps.InfoWindow = function(opts) {
		this.infoBubbles; //info bubbles manager
		this.bubble; //currently visible bubble;
		this.map; //to which marker belongs to

		//set DOM Event listeners
		/*this._domEventsListener = this._domEventsListener.bind(this);
		this.marker.addListener("click", this._domEventsListener);
		this.marker.addListener("dblclick", this._domEventsListener);
		this.marker.addListener("drag", this._domEventsListener);
		this.marker.addListener("dragend", this._domEventsListener);
		this.marker.addListener("dragstart", this._domEventsListener);
		this.marker.addListener("mousedown", this._domEventsListener);
		this.marker.addListener("mouseout", this._domEventsListener);
		this.marker.addListener("mouseover", this._domEventsListener);
		this.marker.addListener("mouseup", this._domEventsListener);
		this.marker.addListener("rightclick", this._domEventsListener);  */

		// Because Marker is MVCObject properties observer should be set, see Map.
		this.addObserver("*", function(obj, key, value, oldValue) {
			switch (key) {
				case "content":
					break;
				case "position":
					break;
				case "disableAutoPan":
				case "maxWidth":
				case "pixelOffset":
				case "zIndex":
					//do nothing
					break;
				case "map":
					if (obj.map) {
						//remove info bubble
						obj.infoBubbles = null;
						obj.bubble && obj.bubble.close();
						obj.bubble = null;
					}

					if (value) {
						obj.map = value;
						//initialize manager, bubble is shown only after open() call
						obj.infoBubbles = value.map.getComponentById("InfoBubbles");
						obj.bubble = obj.infoBubbles.initBubble();
					}
					break;
			}
		});

		this.setOptions(opts);
		this.disableAutoPan == UNDEF && this.set("disableAutoPan", false);
	};

	google.maps._subClass(google.maps.MVCObject, google.maps.InfoWindow);

	/**
	 * Closes Infowindow
	 */
	google.maps.InfoWindow.prototype.close = function() {
		this.bubble.close();
	};

	/**
	 * Returns content of InfoWindow
	 * @returns {String|HTMLElement}
	 */
	google.maps.InfoWindow.prototype.getContent = function() {
		return this.content;
	};

	/**
	 * Returns the position of InfoBubble
	 * @return {google.maps.LatLng}
	 */
	google.maps.InfoWindow.prototype.getPosition = function() {
		return this.position;
	};

	/**
	 * @return {Number}
	 */
	google.maps.InfoWindow.prototype.getZIndex = function()	{
		return 0;
	};

	/**
	 * 	Opens InfoWindow on the given map and optionally anchored to given MVCObject - Marker.
	 * 	@param {google.maps.Map} [map]
	 * 	@param {google.maps.MVCObject} [anchor]
	 */
	google.maps.InfoWindow.prototype.open = function(map, anchor) {
		if (map) {
			this.set("map", map);
		}

		if (this.bubble) {
			this.bubble.update(this.content, anchor ? anchor.position.coordinate: this.position.coordinate);
			this.bubble.open();
		}
	};

	/**
	 * Sets the InfoWindow content
	 * @param {String | HTMLElement} content
	 */
	google.maps.InfoWindow.prototype.setContent = function(content)	{
		this.set("content", content);
	};

	/**
	 * Sets options
	 * @param {google.maps.InfoWindowOptions} options
	 */
	google.maps.InfoWindow.prototype.setOptions = function(options)	{
		//populate own properties
		this.setValues(options);
	};

	/**
	 * Sets the position of InfoWindow - tail end point
	 * @param {google.maps.LatLng} position
	 */
	google.maps.InfoWindow.prototype.setPosition = function(position) {
		this.set("position", position);
	};

	/**
	 * Sets the zIndex
	 * @todo this is useless in 2.2.3 of Nokia API is not possible to change zIndex of InfoBubbles
	 * @param {Number} zIndex
	 */
	google.maps.InfoWindow.prototype.setZIndex = function(zIndex) {
		this.set("zIndex", zIndex);
	};
}());