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
cat $SRC_DIR* > $OUT_PATH