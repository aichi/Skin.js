#!/bin/bash

#ENV VARS
SRC_DIR=../lib/
OUT_DIR=../out/
OUT_FNAME=payload.js
OUT_PATH=$OUT_DIR$OUT_FNAME

# Enable error reporting in case script fails
set -e

# Create output dir if not present
if [ ! -d $OUT_DIR ]; then
	mkdir $OUT_DIR
fi

#ls "$SRC_DIR\*.js"
echo "Output to: $OUT_PATH"
#cat $SRC_DIR* > $OUT_PATH
cat "$SRC_DIR"base.js \
	"$SRC_DIR"event.js \
	"$SRC_DIR"LatLng.js \
	"$SRC_DIR"LatLngBounds.js \
	"$SRC_DIR"Point.js \
	"$SRC_DIR"Size.js \
	"$SRC_DIR"MapTypeId.js \
	"$SRC_DIR"MVCObject.js \
	"$SRC_DIR"MVCArray.js \
	"$SRC_DIR"Marker.js \
	"$SRC_DIR"Geocoder.js \
	"$SRC_DIR"InfoWindow.js \
	"$SRC_DIR"Map.js \
> $OUT_PATH