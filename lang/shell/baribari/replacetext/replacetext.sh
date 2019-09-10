#!/bin/zsh

SRC=$1
OLD=$2
NEW=$3

sed -i '' "s/$OLD/$NEW/g" $SRC
