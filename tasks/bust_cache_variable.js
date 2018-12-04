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

  var crypto = require('crypto')
  var LineByLineReader = require('line-by-line');
  var options = {
    baseDir: './',
    filter: '',
    fileType: ''
  };

  grunt.file.defaultEncoding = options.encoding;

  grunt.registerMultiTask('bustCacheVariable', 'Bust static variable from the cache using content md5 hash', function() {

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
        var fileContents = markup.split('\n');
        var hash = crypto.createHash('md5').update(markup).digest("hex");
        var hashValue = '';
        var variableLine = '<c:set var="' + opts.filter + '"';
        fileContents.forEach(function(line) {
					line.includes(variableLine)
          if (line.includes(variableLine)) {
            var variableArr = line.split(variableLine);
            variableArr.forEach(function(vline) {
              if (vline.includes('value=')) {
                hashValue = vline.split('"');
                hashValue = hashValue[1];
              }
            });
          }
        });

				if(hashValue){
					markup = markup.replace(hashValue, hash);
					grunt.file.write(filepath, markup);
					grunt.log.writeln('Variable ' + opts.filter + ' was busted!');
				}else{
					grunt.fail.warn('Please add cache variable for ' + opts.filter + ' it is missing and the cache will not clear!!!');
				}
      });
    });
  });

};
