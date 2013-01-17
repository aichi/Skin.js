// not rewrite main namespace
window.google = window.google || {};
// rewrite maps namespace with our own
window.google.maps = {
	/**
	 * Basic method which serializes arguments to string (arg1, arg2,..., argN)
	 * @return {String}
	 */
	_toString: function() {
		return "(" + Array.prototype.slice.call(arguments).join(", ") + ")";
	},

	/**
	 * Function which can compute MOD for negative numbers,
	 * {@link http://www.yourdailygeekery.com/2011/06/28/modulo-of-negative-numbers.html}
	 *
	 * @param {Number} a
	 * @param {Number} b
	 * @return {Number}
	 */
	_modulo: function (a, b) {
		return ((a % b) + b) % b;
	},

	/**
	 * Subclassing of super class
	 * @param {Function} sup
	 * @param {Object} sub
	 */
	_subClass: function(sup, sub){
		sub.prototype = new sup();
		sub.prototype.super = sub.prototype.constructor;
		sub.prototype.constructor = sub;
		return sub;
	}
};

(function(ns) {
	var registerDomEvents = [],
		registerInstanceEvents = [],
		event = ns.event = {};

//nokia.maps.dom.Event.prototype.stop = nokia.maps.dom.Event.prototype.stopPropagation;

/**
 * Attach DOM event handler
 * @param instance
 * @param eventName
 * @param handler
 * @param capture
 */
event.addDomListener = function(instance, eventName, handler, capture){
	var mapsViewListener = event._createDomMapsViewListenerObject(instance, eventName, handler, capture);

	event._addDomListener(mapsViewListener);
	return mapsViewListener;
};

/**
 * Attach DOM event handler which is called only once
 * @param instance
 * @param eventName
 * @param handler
 * @param capture
 */
event.addDomListenerOnce = function(instance, eventName, handler, capture) {
	var mapsViewListener = event._createDomMapsViewListenerObject(instance, eventName, handler, capture),
		onceFunc = function() {
			handler.apply(null, arguments);

			event.removeListener(mapsViewListener);
		};

	mapsViewListener.handler = onceFunc;
	event._addDomListener(mapsViewListener);
	return mapsViewListener;
};

/**
 * Creates MapsEventListener object for DOM listeners
 * @param instance
 * @param eventName
 * @param handler
 * @param capture
 * @return {google.maps.event.MapsEventListener}
 */
event._createDomMapsViewListenerObject = function(instance, eventName, handler, capture) {
	return {instance: instance, eventName: eventName, handler: handler, capture: capture};
};

/**
 * Private method which attach DOM listeners
 * @param {google.maps.event.MapsEventListener} listener
 */
event._addDomListener = function(listener) {
	var instance = nokia.maps.dom.EventTarget(instance);
	instance.addListener(listener.eventName, listener.handler, listener.capture);

	registerDomEvents.push(listener);
};

/**
 * Attach object event handler
 * @param instance
 * @param eventName
 * @param handler
 */
event.addListener = function(instance, eventName, handler) {
	var mapsViewListener = event._createInstanceMapsViewListenerObject(instance, eventName, handler);

	event._addInstanceListener(mapsViewListener);
	return mapsViewListener;
};

/**
 * Attach object event handler which is called only once
 * @param instance
 * @param eventName
 * @param handler
 */
event.addListenerOnce = function(instance, eventName, handler) {
	var mapsViewListener = event._createDomMapsViewListenerObject(instance, eventName, handler),
		onceFunc = function() {
			handler.apply(null, arguments);

			event.removeListener(mapsViewListener);
		};

	mapsViewListener.handler = onceFunc;
	event._addInstanceListener(mapsViewListener);
	return mapsViewListener;
};

/**
 * Creates MapsEventListener object for DOM listeners
 * @param instance
 * @param eventName
 * @param handler
 * @return {google.maps.event.MapsEventListener}
 */
event._createInstanceMapsViewListenerObject = function(instance, eventName, handler) {
	return {instance: instance, eventName: eventName, handler: handler};
};

/**
 * Private method which attach DOM listeners
 * @param {google.maps.event.MapsEventListener} listener
 */
event._addInstanceListener = function(listener) {
	var instance = nokia.maps.dom.EventTarget(instance);
	instance.addListener(listener.eventName, listener.handler);

	registerInstanceEvents.push(listener);
};

/**
 * Remove all event handlers from given DOM/object instance
 * @param instance
 */
event.clearInstanceListeners = function(instance) {
	var length = registerDomEvents.length;
	while(length--) {
		if (registerDomEvents[length].instance == instance) {
			registerDomEvents.splice(length, 1);
		}
	}

	length = registerInstanceEvents.length;
	while(length--) {
		if (registerInstanceEvents[length].instance == instance) {
			registerInstanceEvents.splice(length, 1);
		}
	}
};

/**
 * Remove all listeners from DOM/object instance which listen on particular event name
 * @param instance
 * @param eventName
 */
event.clearListeners = function(instance, eventName) {
	var length = registerDomEvents.length;

	while(length--) {
		if (registerDomEvents[length].instance == instance && registerDomEvents[length].eventName == eventName) {
			registerDomEvents.splice(length, 1);
		}
	}

	length = registerInstanceEvents.length;

	while(length--) {
		if (registerInstanceEvents[length].instance == instance && registerInstanceEvents[length].eventName == eventName) {
			registerInstanceEvents.splice(length, 1);
		}
	}
};

/**
 * Remove listener by listener reference
 * @param {google.maps.event.MapsEventListener} listener
 */
event.removeListener = function(listener) {
	var length = registerDomEvents.length;

	while(length--) {
		if (registerDomEvents[length] == listener) {
			registerDomEvents.splice(length, 1);
			return;
		}
	}

	length = registerInstanceEvents.length;

	while(length--) {
		if (registerInstanceEvents[length] == listener) {
			registerInstanceEvents.splice(length, 1);
			return;
		}
	}
};

/**
 * Trigger event on instance with given event name and optional arguments
 * @param instance
 * @param eventName
 */
event.trigger = function(instance, eventName) {
	var length = registerDomEvents.length,
		event;

	while(length--) {
		event = registerDomEvents[length];
		if (event.instance == instance && event.eventName == eventName) {
			event.handler.apply(null, Array.prototype.slice.call(arguments).splice(2));
		}
	}

	length = registerInstanceEvents.length;

	while(length--) {
		event = registerInstanceEvents[length];
		if (event.instance == instance && event.eventName == eventName) {
			event.handler.apply(null, Array.prototype.slice.call(arguments).splice(2));
		}
	}
};

/**
 * Prepare custom event {see: google.maps.MouseEvent}
 * @param {Event} event
 * @return {google.maps.MouseEvent}
 * @private
 */
event._createCustomDomEvent = function(event) {
	var x = event.displayX || event.clientX,
		y = event.displayY || event.clientY,
		customEvent = {
			event: event,
			stop: function() {event.stopPropagation()},
		    latLng: (x !== undefined && y !== undefined) && google.maps.LatLng.fromCoordinate(event.display.pixelToGeo(x, y)),
			pixel: new google.maps.Point(event.displayX, event.displayY)
		};

	return customEvent;
};


}(google.maps));

/*
	addDomListener(instance:Object, eventName:string, handler:Function, capture?:boolean)	MapsEventListener	Cross browser event handler registration. This listener is removed by calling removeListener(handle) for the handle that is returned by this function.
	addDomListenerOnce(instance:Object, eventName:string, handler:Function, capture?:boolean)	MapsEventListener	Wrapper around addDomListener that removes the listener after the first event.
	addListener(instance:Object, eventName:string, handler:Function)	MapsEventListener	Adds the given listener function to the given event name for the given object instance. Returns an identifier for this listener that can be used with removeListener().
	addListenerOnce(instance:Object, eventName:string, handler:Function)	MapsEventListener	Like addListener, but the handler removes itself after handling the first event.
	clearInstanceListeners(instance:Object)	None	Removes all listeners for all events for the given instance.
	clearListeners(instance:Object, eventName:string)	None	Removes all listeners for the given event for the given instance.
	removeListener(listener:MapsEventListener)	None	Removes the given listener, which should have been returned by addListener above.
	trigger(instance:Object, eventName:string, var_args:*)	None	Triggers the given event. All arguments after eventName are passed as arguments to the listeners.
*//**
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
};/**
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
};/**
 * Basic clas represening point, it is so simple so there is no need to mimic it with nokia.maps.util.Point
 * @param {Number} x
 * @param {Number} y
 */
google.maps.Point = function(x, y) {
	this.x = x;
	this.y = y;
};

/**
 * Return if both points are equal
 * @param {goole.maps.Point} other
 * @return {Boolean}
 */
google.maps.Point.prototype.equals = function(other) {
	return this.x == other.x && this.y == other.y;
};

/**
 * Returns string representation
 * @return {String}
 */
google.maps.Point.prototype.toString = function() {
	return google.maps._toString(this.x, this.y);
};

/**
 * Transformation of Nokia point to gMap point
 * @param {nokia.maps.util.Point} point
 * @return {google.maps.Point}
 */
google.maps.Point.fromPoint = function(point) {
	return new google.maps.Point(point.x, point.y);
};

/**
 * Transformation from gMap point to Nokia point
 * @param {google.maps.Point} point
 * @return {nokia.maps.util.Point}
 */
google.maps.Point.toPoint = function(point) {
	return new nokia.maps.util.Point(point.x, point.y);
};/**
 * Size class
 * @param {Number} width
 * @param {Number} height
 * @param {String} [widthUnit]
 * @param {String} [heightUnit]
 * @constructor
 */
google.maps.Size = function(width, height, widthUnit, heightUnit) {
	this.width = width;
	this.height = height;
	this.widthUnit = widthUnit;
	this.heightUnit = heightUnit;
};

/**
 * Compare two Sizes
 * @param {google.maps.Size} other
 * @return {Boolean}
 */
google.maps.Size.prototype.equals = function(other) {
	return this.width == other.width && this.height == other.height;
};

/**
 * @return {String}
 */
google.maps.Size.prototype.toString = function() {
	return google.maps._toString(this.width, this.height);
};

google.maps.MapTypeId = {
	HYBRID: "hybrid",
	ROADMAP: "roadmap",
	SATELLITE: "satellite",
	TERRAIN: "terrain"
};

/**
 * Coversion from gMaps string types to Nokia maps providers
 * @param {google.maps.MapTypeId|String} type
 * @return {nokia.maps.map.provider.Provider}
 */
google.maps.MapTypeId.constantToBaseMapType = function(type) {
	var baseMapType;
	switch(type) {
		case google.maps.MapTypeId.HYBRID:
			baseMapType = nokia.maps.map.Display.HYBRID;
			break;
		case google.maps.MapTypeId.ROADMAP:
			baseMapType = nokia.maps.map.Display.NORMAL;
			break;
		case google.maps.MapTypeId.SATELLITE:
			baseMapType = nokia.maps.map.Display.SATELLITE;
			break;
		case google.maps.MapTypeId.TERRAIN:
			baseMapType = nokia.maps.map.Display.TERRAIN
			break;
	}
	return baseMapType;
};

/**
 * Conversion from nokia base map type providers to gMaps string types
 * @param {nokia.maps.map.provider.Provider} baseMapType
 * @return {google.maps.MapTypeId|String}
 */
google.maps.MapTypeId.baseMapTypeToConstant = function(baseMapType) {
	if (baseMapType == nokia.maps.map.Display.HYBRID) return google.maps.MapTypeId.HYBRID;
	if (baseMapType == nokia.maps.map.Display.NORMAL) return google.maps.MapTypeId.ROADMAP;
	if (baseMapType == nokia.maps.map.Display.SATELLITE) return google.maps.MapTypeId.SATELLITE;
	if (baseMapType == nokia.maps.map.Display.TERRAIN) return google.maps.MapTypeId.TERRAIN;
};(function(){
	var observers = [];

	/**
	 * MVCObject is just observable object with some specialities like automatic double binding between two
	 * properties of two objects
	 * http://blog.mridey.com/2010/03/maps-javascript-api-v3-more-about.html
	 *
	 * Also example of usage with simple code
	 * https://developers.google.com/maps/articles/mvcfun#bindingproperties
	 */
	google.maps.MVCObject = function(){
		var that = this;
		//nokia.maps.util.OObject.set method can set both one property or from object
		this.setValues = this.set;

		this.addObserver("*", function(obj, key, value, oldValue) { //debugger;
			//invoke binding on 'key' attribute if there is any
			var observer = obj._checkBindingByObjKey(obj, key),
				bindings = observer ? observer.bindings : [],
				i = bindings.length,
				binding,
				bObj,
				bKey;

			if (observer) {
				if(observer._suppressCallback) {
					return;
				} else {
					observer._suppressCallback = true;
				}
			}

			while (i--) {
				binding = bindings[i];
				bObj = binding[0];
				bKey = binding[1];
				if (bObj !== obj && bKey !== key) {
					bObj.set(bKey, value);
				}
			}

			if (observer) {
				observer._suppressCallback = false;
			}

			//notify on every itself change - fire key_changed event
			obj.notify(key);
		});
	};

	google.maps._subClass(nokia.maps.util.OObject, google.maps.MVCObject);

	/**
	 * Shortcut to google.maps.event.addListener
	 * @param {String} eventName
	 * @param {Function} handler
	 * @return {google.maps.MapsEventListener}
	 */
	google.maps.MVCObject.prototype.addListener = function(eventName, handler) {
		return google.maps.event.addListener(this, eventName, handler);
	};

	/**
	 * when key property is changed than bind target object property is automatically changed
	 * @param {String} key
	 * @param {google.maps.MVCObject} target
	 * @param {String} [targetKey]
	 * @param {Boolean} [noNotify] Not to call observers on target, TODO there is no way how to do it on OObject now.
	 */
	google.maps.MVCObject.prototype.bindTo = function(key, target, targetKey, noNotify) {
		targetKey = targetKey || key;


		var thisBindings = this._checkBindingByObjKey(this, key),
			targetBindings = this._checkBindingByObjKey(target, targetKey),
			observer,
			callback,
			i;

		//actualize value immediately before bindings are merged because only merged observers should be notified not 'ours'
		this.set(key, target.get(targetKey));

		//no binding, creates new one
		if (!thisBindings && !targetBindings) {
			observer = {bindings:[[this, key], [target, targetKey]]};
			observers.push(observer);

		//checks if this[key] is already in binding or
		//checks if target[targetKey] is already in binding

		} else if (!thisBindings || !targetBindings) {
			if (thisBindings && !targetBindings) {
				observer = thisBindings;
				observer.bindings.push([target, targetKey]);
			}
			if (!thisBindings && targetBindings) {
				observer = targetBindings;
				observer.bindings.push([this, key]);
			}
			observers.push(observer);
		//there are bindings in both this and target properties so than we have to merge these two bindings and
		} else {
			//merge two list of observers and make new reference to observer object
			observer = {bindings:[]};
			//todo: simplify to: observer.bindings = a.merge(b);
			i = thisBindings.bindings.length;
			while (i--) {
				observer.bindings.push(thisBindings.bindings[i]);
			}
			i = targetBindings.bindings.length;
			while (i--) {
				observer.bindings.push(targetBindings.bindings[i]);
			}

			observers.splice(observers.indexOf(thisBindings), 1);
			observers.splice(observers.indexOf(targetBindings), 1);
			observers.push(observer);
		}
	};

	/**
	 * Returns if object has bound observer to given property name
	 * @param {Object} obj
	 * @param {String} key
	 * @return {Object}
	 * @private
	 */
	google.maps.MVCObject.prototype._checkBindingByObjKey = function(obj, key) {
		var i = observers.length,
			observer,
			bindings,
			j;

		while (i--) {
			observer = observers[i];
			j = observer.bindings.length;
			while (j--) {
				bindings = observer.bindings[j];
				if (bindings[0] == obj && bindings[1] == key) {
					return observer;
				}
			}
		}
		return null;
	};


	/**
	 *
	 * @param {String} key
	 */
	google.maps.MVCObject.prototype.unbind = function(key) {
		var observers = this._checkBindingByObjKey(this, key),
			bindings = this.observers.bindings,
			i = bindings.length;

		while (i--) {
			if (bindings[i][0] == this && bindings[i][1] == key) {
				bindings.splice(i, 1);
				break;
			}
		}
	};

	google.maps.MVCObject.prototype.unbindAll = function() {
		var i = observers.length,
			observer,
			bindings,
			j;

		while (i--) {
			observer = observers[i];
			j = observer.bindings.length;
			while (j--) {
				bindings = observer.bindings[j];
				if (bindings[0] == obj && bindings[1] == key) {
					observers.splice(i, 1);
					break;
				}
			}
		}
	};

	/**
	 * Notify this object and also target objects
	 * @param {String} key
	 */
	google.maps.MVCObject.prototype.notify = function(key) {
		var observer = this._checkBindingByObjKey(this, key),
			bindings = observer ? observer.bindings : [],
			i = bindings.length,
			binding,
			bObj,
			bKey;

		while (i--) {
			binding = bindings[i];
			bObj = binding[0];
			bKey = binding[1];
			if (bObj !== this && bKey !== key) {
				bObj.changed && bObj.changed(bKey);
			}
		}

		this.changed && this.changed(key);
		this[key+"_changed"] && this[key+"_changed"]();

		if (bindings.length == 0) {//no bindings (setting Marker property have to trigger event firing)
			google.maps.event.trigger(this, key + "_changed");
		}

		i = bindings.length;
		while (i--) {
			binding = bindings[i];
			bObj = binding[0];
			bKey = binding[1];
			if (bObj !== this && bKey !== key) {
				google.maps.event.trigger(bObj, bKey + "_changed");
			}
		}
	};

	/**
	 * This is generic handler which can be overwritten and is informed that something is changed
	 * @param {String} key
	 */
	google.maps.MVCObject.prototype.changed = function(key) {};

}());

//TEST
/*
var a = new google.maps.MVCObject();
a.changed = function(key){console.log("a."+key+" changed")}
google.maps.event.addListener(a, "level_changed", function(){
    console.log("a.level changed event")
});
console.log("a.level = 2");
a.set('level', 2);
console.log("was set.");

var b = new google.maps.MVCObject();
b.changed = function(key){console.log("b."+key+" changed")}
google.maps.event.addListener(a, "index_changed", function(){
    console.log("a.index changed event")
});

console.log("bindTo")
b.bindTo('index', a, 'level');
console.log(b.get('index')); // Returns 2


console.log("b.index = 33");
b.set('index', 33);
console.log("was set.");

console.log(a.get('level'))
*/

//Right output:

/**
a.level = 2
a.level changed
a.level changed event
was set.
bindTo
b.index changed
2
b.index = 33
a.level changed
b.index changed
a.level changed event
was set.
33
*/

/**
 nokia.maps.util.OObject sets first than observers are triggered with new and old value (sync).
 *//**
 * MVCArray is observable mutable array and is made by nokia.maps.util.OList
 * @constructor
 * @param {Variant[]} array
 */

google.maps.MVCArray = function(array) {
	//nokia.maps.util.OList.removeAt method is same like in MVCArray but there is event triggered
	this._removeAtOriginal = this.removeAt;

	this.addAll(array);
};

google.maps._subClass(nokia.maps.util.OList, google.maps.MVCArray);


/**
 * Removes last item from array
 */
google.maps.MVCArray.prototype.pop = function() {
	this.removeAt(this.getLength() - 1);
};

/**
 * Push one element to the end of array
 * @param {Variant} elem
 * @return {Number}
 */
google.maps.MVCArray.prototype.push = function(elem) {
	this.set(elem, this.getLength() - 1);
	return this.getLength();
};

/**
 * Sets element on specific index, if index is out of bounds than array is extended
 * @param {Number} i
 * @param {Variant} elem
 */
google.maps.MVCArray.prototype.setAt = function(i, elem) {
	var length = this.getLength(),
		j;
	//extend array out of range
	if (length < i) {
		for (j = length; j < i; j++) {
			this.add(undefined, j);
		}
	}
	this.add(elem, i);

	google.maps.event.trigger(this, "set_at", i, elem);
};

/**
 * Replace element on specific index
 * @param {Number} i
 * @param {Variant} elem
 */
google.maps.MVCArray.prototype.insertAt = function(i, elem) {
	this.add(elem, i);
	google.maps.event.trigger(this, "insert_at", i);
};

/**
 * Returns content of MVCArray as array
 * @return {Variant[]}
 */
google.maps.MVCArray.prototype.getArray = function() {
	return this.asArray();
};

/**
 * Returns object by index
 * @param {Number} i
 * @return {Variant}
 */
google.maps.MVCArray.prototype.getAt = function(i) {
	return this.get(i);
};

/**
 * Executes callback on all elements
 * @param {Function(Variant, Number)} callback
 */
google.maps.MVCArray.prototype.forEach = function(callback) {
	var length = this.getLength(),
		i;

	for (i = 0; i < length; i++) {
		callback(this.get(i), i);
	}
};

google.maps.MVCArray.prototype.removeAt = function(i) {
	var elm = this.get(i);
	this._removeAtOriginal(i);
	google.maps.event.trigger(this, "remove_at", i, elm);
};

/**
 * Methods which are same in both APIs:
 * clear()
 * removeAt()
 * getLength()
 *
 */
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
google.maps.Geocoder = function() {
	this.geocoder = nokia.places.search.manager;

};

//basic translation between our and their address types
google.maps.Geocoder.addressTranslator = {
	houseNumber: "street_number",
	street: "route",
	district: "sublocality", //also political
	city: "locality", //also political
	county: "administrative_area_level_2", //also political
	country: "country", //also political
	postalCode: "postal_code"
};


/**
 * @param {google.maps.GeocoderRequest} request
 * @param {Function} callback function(Array.<GeocoderResult>, GeocoderStatus))
 */
google.maps.Geocoder.prototype.geocode = function(request, callback) {
	var that = this;

	that.geocoder.geoCode({
		searchTerm: request.address ? request.address + (request.region ? ", " + request.region : "") : request.location.toString(),
		onComplete: function(data, requestStatus, requestId) {
			var response = [];
			if (requestStatus == "OK") {
				var locations = data.results ? data.results.items : [data.location],
					i,
					k,
					latLng,
					addressComponents;

				if (locations.length > 0) {
					for (i = 0; i < locations.length; i++) {
						addressComponents = [];
						if (locations[i].address) {
							for (k in locations[i].address) {
								addressComponents.push({
									long_name: locations[i].address[k],
									short_name: locations[i].address[k],
									types: [google.maps.Geocoder.addressTranslator[k] ? google.maps.Geocoder.addressTranslator[k] : k]
								});
							}
						}

						latLng = google.maps.LatLng.fromCoordinate(locations[i].position);

						response.push({
							address_components: addressComponents,
							formated_address: locations[i].name,
							geometry: {
								bounds: null,
								location: latLng,
								location_type: "ROOFTOP",
								viewport: new google.maps.LatLngBounds(latLng, latLng)
							},
							type: ["street_address"] //todo 'lowest' common denominator
						});
					}
				}
			}
			//status is compatible. nokia.places has status string OK or ERROR
			callback(response, requestStatus);
		}
	});

};

google.maps.GeocoderStatus = {
	ERROR : "ERROR",
	INVALID_REQUEST: "INVALID_REQUEST",
	OK: "OK",
	OVER_QUERY_LIMIT: "OVER_QUERY_LIMIT",
	REQUEST_DENIED: "REQUEST_DENIED",
	UNKNOWN_ERROR: "UNKNOWN_ERROR",
	ZERO_RESULTS: "ZERO_RESULTS"
};

/*
GeocoderRequest:

address	string	Address. Optional.
bounds	LatLngBounds	LatLngBounds within which to search. Optional.
location	LatLng	LatLng about which to search. Optional.
region	string	Country code used to bias the search, specified as a Unicode region subtag / CLDR identifier. Optional.
*/(function(){
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
}());/**
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