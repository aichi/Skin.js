/**
 * gMap projection is weird because it is returning point from 0,0 to 256, 256 so for zoomLevel 0.
 * Problem is also that it returns weird numbers for latitude +-90
 */
google.maps.Projection = {
	/**
	 *
	 * @param {google.maps.LatLng} latLng
	 * @param {google.maps.Point} [point]
	 */
	fromLatLngToPoint: function(latLng, point) {},
	/**
	 *
	 * @param {google.maps.Point} pixel
	 * @param {Boolean} [nowrap]
	 */
    fromPointToLatLng: function(pixel, nowrap) {}
};