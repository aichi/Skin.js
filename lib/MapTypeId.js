
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
};