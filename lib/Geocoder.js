
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
*/