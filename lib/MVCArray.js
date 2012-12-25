/**
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
