#! /bin/bash

set -o monitor

jscoverage-server --no-instrument=lib --no-instrument=test --encoding=utf-8 -v &
firefox http://localhost:8080/jscoverage.html?test/index.html
fg