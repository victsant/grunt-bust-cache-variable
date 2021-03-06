/*
 * grunt-bust-my-cache
 * https://github.com/victsant/grunt-bust-cache-variable
 *
 * Copyright (c) 2019 Victor Santana
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.initConfig({

    clean: {
      tmp: 'tmp'
    },

    jshint: {
      all: [
        'Gruntfile.js', 'tasks/*.js', '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: 'test/fixtures',
            src: ['**'],
            dest: 'tmp/'
          }
        ]
      }
    },

    bustCacheVariable: {
      base: {
        options: {
          filter: 'base'
        },
        files: {
          'tmp/default.html': 'tmp/default.html'
        }
      },
      filterTest: {
				options: {
          filter: 'filterTest'
        },
        files: {
          'tmp/default.html': 'tmp/default.html'
        }
      }
    },

    nodeunit: {
      tests: ['test/*_test.js']
    },

    watch: {
      task: {
        files: 'tasks/bust_my_cache.js',
        tasks: 'nodeunit'
      }
    }

  });

  // Load this plugins tasks
  grunt.loadTasks('tasks');

	require('load-grunt-tasks')(grunt, {
		pattern: ['grunt-contrib-*'],
    config: './package.json',
    scope: 'devDependencies',
		requireResolution: true
	});

  // grunt.registerTask('default', ['clean', 'copy', 'bustCacheVariable:filterTest']);

  grunt.registerTask('bust-base', ['clean', 'copy', 'bustCacheVariable:base']);
  grunt.registerTask('bust-filter', ['clean', 'copy', 'bustCacheVariable:filterTest']);

  grunt.registerTask('test', ['clean', 'copy', 'bustCacheVariable:base', 'nodeunit']);

  // Travis CI task.
  grunt.registerTask('travis', ['clean', 'copy', 'bustCacheVariable', 'nodeunit']);
};