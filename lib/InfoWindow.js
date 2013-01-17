(function(){
	var UNDEF;

	google.maps.InfoWindow = function(opts) {
		this.infoBubbles; //info bubbles manager
		this.bubble; //currently visible bubble;
		this.map; //to which marker belongs to

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
						//because gMap does not support bubble alignment and is always shown up right than:
						obj.infoBubbles.options.set("defaultXAligment", obj.infoBubbles.ALIGMENT_RIGHT);
						obj.infoBubbles.options.set("defaultYAligment", obj.infoBubbles.ALIGMENT_ABOVE);
						obj.bubble = obj.infoBubbles.initBubble(function(){
							//this is onUserClose handler
							google.maps.event.trigger(obj, "closeclick");
						});
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

		if (anchor) {
			this.set("position", anchor.position);
			if (anchor.anchorPoint) {
				this.set("anchorPoint", anchor.anchorPoint);
			}
		}
		
		if (this.bubble) {
			this.bubble.update(this.content, google.maps.LatLng.toCoordinate(this.position));
			this.bubble.open();
			
			if (!this.disableAutoPan) {
				this._autoPan();
			}
			
			//emits "domready" event when content DIV is attached to DOM (it is when bubble is opened)
			google.maps.event.trigger(this, "domready");
		}
	};
	
	/**
	 * Automatically pans the map when bubble didn't fit into display.
	 */
	google.maps.InfoWindow.prototype._autoPan = function() {
		var map = this.map.map,
			bubble = this.bubble,
			infoBubbles = this.infoBubbles,
			mapWidth = map.width,
			mapHeight = map.height,
			bubbleWidth = bubble.node.clientWidth + 50,
			bubbleHeight = bubble.node.clientHeight + 50,
			bubblePosition = map.geoToPixel(google.maps.LatLng.toCoordinate(this.position)),
			panX = 0,
			panY = 0;
	
		if (bubble.xAlignment == infoBubbles.ALIGNMENT_RIGHT) {
			panX = Math.min(0, mapWidth - bubblePosition.x - bubbleWidth);
		} else {
			panX = - Math.min(0, bubblePosition.x - bubbleWidth);
		}
		
		if (bubble.xAlignment == infoBubbles.ALIGNMENT_BELOW) {
			panY = Math.min(0, mapHeight - bubblePosition.y - bubbleHeight);
		} else {
			panY = - Math.min(0, bubblePosition.y - bubbleHeight);
		}
		
		if (panX || panY) {
			map.pan(panX, panY, 0, 0, "default");
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