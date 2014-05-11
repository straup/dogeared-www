#!/bin/sh

MANIFEST=$1

perl -i -lpe 'BEGIN { sub inc { my ($num) = @_; ++$num } } s/(# v)(\d+)/$1 . (inc($2))/eg' ${MANIFEST}
