/**
 * Created by Jamey McElveen on 9/4/16.
 */

var buble = require('rollup-plugin-buble');

module.exports = function(grunt) {

  ////////////////////////////////////////
  // region INIT CONFIG
  grunt.initConfig({

    ////////////////////////////////////////
    // region PUBLISH
    // Updates the version in package.json and the version tag
    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        updateConfigs: [],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json', 'bower.json'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'origin',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
        globalReplace: false,
        prereleaseName: false,
        metadata: '',
        regExp: false
      }
    },
    // endregion PUBLISH
    ////////////////////////////////////////

    ////////////////////////////////////////
    // region BUILD
    // validate scripts
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        esversion: 6,
        globals: {
          jQuery: true
        }
      }
    },
    // watch files for changes
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    },
    // rollup options
    rollup: {
      options: {
        moduleName: 'VueB',
        format: 'iife',
        plugins: [buble()]
      },
      files: {
        'dest': 'dist/vueb.js', 'src': 'src/vueb/main.js', // Only one source file is permitted
      },
    },
    // endregion BUILD
    ////////////////////////////////////////
  });
  // endregion INIT CONFIG
  ////////////////////////////////////////

  ////////////////////////////////////////
  // region INSTALL TASK
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-rollup');
  // endregion REGISTER TASK
  ////////////////////////////////////////

  ////////////////////////////////////////
  // region REGISTER TASK
  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', ['jshint', 'rollup']);
  grunt.registerTask('publish', ['build', 'bump'], function() {
    console.log('publish');
  });
  // endregion REGISTER TASK
  ////////////////////////////////////////

};


/*
 git config --global user.email "you@example.com"
 "2npm": "grunt publish",
 "2bower": "bower register vueb git://github.com/jameymcelveen/vueb.git",
 */
