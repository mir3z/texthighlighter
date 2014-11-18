/* global module, require  */
module.exports = function (grunt) {
    'use strict';

    var SRC_DIR = 'src/',
        SRC_FILES = [
            SRC_DIR + 'jquery.textHighlighter.js'
        ],
        TEST_DIR = 'test/',
        SPEC_FILES = [
            TEST_DIR + 'specs/highlighting.spec.js',
            TEST_DIR + 'specs/flattening.spec.js',
            TEST_DIR + 'specs/merging.spec.js',
            TEST_DIR + 'specs/normalization.spec',
            TEST_DIR + 'specs/removing.spec.js',
            TEST_DIR + 'specs/serialization.spec.js',
            TEST_DIR + 'specs/callbacks.spec.js'
        ],
        BUILD_DIR = 'build/',
        BUILD_TARGET = 'jquery.textHighlighter.min.js';

    grunt.initConfig({
        _TARGET: BUILD_DIR + BUILD_TARGET,

        closurecompiler: {
            minify: {
                files: {
                    "<%= _TARGET %>": SRC_FILES
                },
                options: {
                    "compilation_level": "SIMPLE_OPTIMIZATIONS",
                    "banner": '/*\n' + require('fs').readFileSync('LICENSE', { encoding: 'utf8' }) + '*/'
                }
            }
        },

        jshint: {
            src: [ 'gruntfile.js', SRC_FILES, SPEC_FILES ],
            options: {
                jshintrc: true
            }
        },

        clean: [ BUILD_DIR ]
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-closurecompiler');

    grunt.registerTask('build', ['closurecompiler:minify']);
    grunt.registerTask('default', ['build']);
};