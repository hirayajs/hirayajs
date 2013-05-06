module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        url: '<%= pkg.homepage %>',
        options: {
          paths: 'src/',
          outdir: 'docs/',
          "themedir" : 'yuidoc-themes/yuidoc-bootstrap-theme',
          "helpers" : [ 'yuidoc-themes/yuidoc-bootstrap-theme/helpers/helpers.js' ]
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 8081,
          base: 'bin',
          keepalive: true
        }
      }
    },

    uglify: {
      build: {
        files: {
          'bin/hiraya.min.js': 'bin/hiraya.js'
        }
      }
    },
    browserify: {
      'bin/hiraya.js': 'src/index.js'
    },

    watch: {
      scripts: {
        files: ['src/**/*.js'],
        tasks: ['dev']
      },
      docs: {
        files: ['src/**/*.js'],
        tasks: ['docs']
      }
    },

  });
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');


  grunt.registerTask('default', 'connect:server');
  grunt.registerTask('compile', 'browserify', 'uglify:build');
  grunt.registerTask('dev', 'browserify');
  grunt.registerTask('docs', 'yuidoc');
};
