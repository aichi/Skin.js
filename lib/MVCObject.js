(function(){
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


		this.addObserver("*", function(obj, key, value, oldValue) {
			//invoke binding on 'key' attribute if there is any
			var observer = obj._checkBindingByObjKey(obj, key),
				callback = observer && obj._getObserverCallback(observer);
			callback && callback(obj, key, value, oldValue); //not notify on bindTo, only on set()

			//notify on every itself change
			that == obj && obj.notify(key);
		});
	};

	google.maps._subClass(nokia.maps.util.OObject, google.maps.MVCObject);

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
			//todo: observer.bindings = a.merge(b);
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



		if (noNotify) return;

		//actualize value immediately
		//debugger;
		this.set(key, target.get(targetKey));
	};

	/**
	 * Returns observer callback which has access to "observer" parameter
	 * @return {Function}
	 * @private
	 */
	google.maps.MVCObject.prototype._getObserverCallback = function(observer) {
		return function(obj, key, value, oldValue) {
				var bindings = observer.bindings,
					i = bindings.length,
					binding,
					bObj,
					bKey;
				while (i--) {
					binding = bindings[i];
					bObj = binding[0];
					bKey = binding[1];
					if (bObj !== obj && bKey !== key) {
						bObj.set(bKey, value);
						bObj.changed && bObj.changed(bKey);
					}
				}
			};
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
		var i = this._bindList.length;

		while (i--) {
			if (this._bindList[i].key == key) {
				this.removeObserver(key, this._bindList[i].callback);
			}
		}
	};

	google.maps.MVCObject.prototype.unbindAll = function() {
		var i = this._bindList.length;

		while (i--) {
			this.removeObserver(key, this._bindList[i].callback);
		}
	};

	/**
	 * Notify this object and also target objects
	 * @param {String} key
	 */
	google.maps.MVCObject.prototype.notify = function(key) {
		var i = observers.length,
			j,
			binding;

		this.changed && this.changed(key);
		google.maps.event.trigger(this, key + "_changed");

		/*while (i--) {
			j = observers[i].bindings.length;
			while(j--) {
				binding = observers[i].bindings[j];
				if (binding[0] == this && binding[1] == key) {
					//it is in this array, so we have to go through it from beginning and call callbacks
					//this._bindList[i].callback(this, key, this[key], this[key]);
				}
			}
		} */
	};

	/**
	 * This is generic handler which can be overwritten and is informed that something is changed
	 * @param {String} key
	 */
	google.maps.MVCObject.prototype.changed = function(key) {

	};

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