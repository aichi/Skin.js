/**
 * MVCObject is just observable object with some specialities like automatic double binding between two
 * properties of two objects
 * http://blog.mridey.com/2010/03/maps-javascript-api-v3-more-about.html
 *
 * Also example of usage with simple code
 * https://developers.google.com/maps/articles/mvcfun#bindingproperties
 */
google.maps.MVCObject = function(){
	//nokia.maps.util.OObject.set method can set both one property or from object
	this.setValues = this.set;

	this._bindList = [];

	this.addObserver("*", function(obj, key, value, oldvalue) {
		obj.notify(key);
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

	var callback = function(obj, key, value, oldValue) {
			//debugger;
			target.set(targetKey, value);
			target.changed && target.changed(targetKey);
		};
	this.addObserver(key, callback);

	this._bindList.push({key: key, callback: callback});

	//actualize value immediately
	//debugger;
	this.set(key, target.get(targetKey));
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
	var i = this._bindList.length;

	this.changed && this.changed(key);
	google.maps.event.trigger(this, key + "_changed");

	while (i--) {
		if (this._bindList[i].key == key) {
			this._bindList[i].callback(this, key, this[key], this[key]);

		}
	}
};

/**
 * This is generic handler which can be overwritten and is informed that something is changed
 * @param {String} key
 */
google.maps.MVCObject.prototype.changed = function(key) {

};

//TEST
/*
var a = new google.maps.MVCObject();
a.changed = function(key){console.log("a."+key+" changed")}
google.maps.event.addListener(a, "level_changed", function(){
    console.log("a.level changed event")
});

a.set('level', 2);

var b = new google.maps.MVCObject();
b.changed = function(key){console.log("b."+key+" changed")}
google.maps.event.addListener(a, "index_changed", function(){
    console.log("a.index changed event")
});

console.log("bindTo")
b.bindTo('index', a, 'level');
console.log(b.get('index')); // Returns 2

b.set('index', 33)
console.log(a.get('level'))
*/

//Right output:

/**
a.level changed
a.level changed event
bindTo
b.index changed
2
a.level changed
b.index changed
a.level changed event
33
*/