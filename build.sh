#!/bin/bash

SRC_DIR="src/static/*"
DST_DIR="dist"

mkdir -p $PWD/$DST_DIR
cp -rf $PWD/$SRC_DIR $PWD/$DST_DIR

cp -rf $PWD/src/index.html $PWD/$DST_DIR

webpack $PWD/webpack.config.js