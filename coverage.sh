#!/bin/bash

JS_COVERAGE_BIN=jscoverage-server
BROWSER=firefox

type ${JS_COVERAGE_BIN} >/dev/null 2>&1 \
    || { echo >&2 "I require ${JS_COVERAGE_BIN} but it's not installed. Aborting."; exit 1; }

set -o monitor

jscoverage-server --no-instrument=lib --no-instrument=test --encoding=utf-8 -v &
${BROWSER} 'http://localhost:8080/jscoverage.html?test/index.html'
fg