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
*/