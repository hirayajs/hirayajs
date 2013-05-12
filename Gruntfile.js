module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');


  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['src/**/*.js']
    },
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
      main: {
        src: ['src/index.js'],
        dest: 'bin/hiraya.js'
      }
      //'bin/hiraya.js': 'src/index.js'
    },

    watch: {
      scripts: {
        files: ['src/**/*.js'],
        tasks: ['dev']
      },
      docs: {
        files: ['src/**/*.js'],
        tasks: ['docs']
      },
      jshint: {
        files: ['src/**/*.js'],
        tasks: ['jshint']
      }
    },

  });
  grunt.registerTask('server', 'connect:server');
  grunt.registerTask('default', ['dev', 'uglify:build', 'yuidoc']);
  grunt.registerTask('dev', 'browserify');
  grunt.registerTask('docs', 'yuidoc');
};
