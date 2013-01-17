@echo off
SET SRC_DIR=..\lib\
SET OUT_DIR=..\out\
SET OUT_FNAME=payload.js
SET OUT_PATH=%OUT_DIR%%OUT_FNAME%

REM Create output dir if not present
IF NOT EXIST "%OUT_DIR%" (
	mkdir %OUT_DIR%
)

ECHO Output to: %OUT_PATH%
copy /b %SRC_DIR%base.js + ^
%SRC_DIR%event.js + ^
%SRC_DIR%LatLng.js + ^
%SRC_DIR%LatLngBounds.js + ^
%SRC_DIR%Point.js + ^
%SRC_DIR%Size.js + ^
%SRC_DIR%MapTypeId.js + ^
%SRC_DIR%MVCObject.js + ^
%SRC_DIR%MVCArray.js + ^
%SRC_DIR%Marker.js + ^
%SRC_DIR%Geocoder.js + ^
%SRC_DIR%InfoWindow.js + ^
%SRC_DIR%Map.js ^
%OUT_PATH%