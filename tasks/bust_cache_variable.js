/*
 Based on https://github.com/hollandben/grunt-cache-bust by Ben Holland. Added options to filter which file gets updated.
 grunt-bust-my-cache
 
 https://github.com/victsant/grunt-bust-my-cache
 *
 * Copyright (c) 2017 Victor Santana
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    var fs      = require('fs');
    var path    = require('path');
    var crypto = require('crypto')
    
    var remoteRegex    = /http:|https:|\/\/|data:image/;
    var extensionRegex = /(\.[a-zA-Z]{2,4})(|\?.*)$/;

    var regexEscape = function(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    };

    var cheerioOptions = {
        ignoreWhitespace: true,
        lowerCaseTags: true
    };

    var options = {
        baseDir: './',
        filter: '',
        fileType : ''
    };
 
    grunt.file.defaultEncoding = options.encoding;

    grunt.registerMultiTask('bustCacheVariable', 'Bust static assets from the cache using content hashing', function() {

        var opts = grunt.util._.defaults(this.options(), options);

        this.files.forEach(function(f) {
            var src = f.src.filter(function(filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).map(function(filepath) {
                var markup = grunt.file.read(filepath);
                var hash = crypto.createHash('md5').update(markup).digest("hex")

                var variable = '?' + opts.filter;
                var index = markup.indexOf(variable);
                var length = index + opts.filter.length + 34;
                var cache = markup.substring(index, length);
                markup = markup.replace(cache, '?' + opts.filter + '=' + hash);
                
               grunt.file.write(filepath, markup);
                grunt.log.writeln('Variable ' + opts.filter + ' was busted!');
            });
        });
    });

};
