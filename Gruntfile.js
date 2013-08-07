module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');

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
      },
      view: {
        src: ['src/index-client.js'],
        dest: 'bin/hiraya-client.js'
      }
      //'bin/hiraya.js': 'src/index.js'
    },

    watch: {
      all: {
        files: ['src/**/*.js'],
        tasks: ['jshint', 'browserify', 'test', 'docs']
      },
      scripts: {
        files: ['src/**/*.js'],
        tasks: ['browserify']
      },
      docs: {
        files: ['src/**/*.js'],
        tasks: ['docs']
      },
      jshint: {
        files: ['src/**/*.js'],
        tasks: ['jshint']
      },
      tests: {
        files: ['src/**/*.js'],
        tasks: ['test']
      }
    },

    mochaTest: {
      simple: {
        src: ['tests/tests.js'],
        options: {
          reporter: 'spec'
        }
      },
      game: {
        src: ['tests/tests-game.js'],
        options: {
          reporter: 'spec'
        }
      },
      turnbased: {
        src: ['tests/tests-turn-based-game.js'],
        options: {
          reporter: 'spec'
        }
      }
    }

  });

  grunt.registerTask('server', 'connect:server');
  grunt.registerTask('develop', ['watch:all']);
  grunt.registerTask('default', ['jshint', 'browserify:main', 'uglify:build', 'yuidoc']);
  grunt.registerTask('docs', 'yuidoc');
  grunt.registerTask('test', ['mochaTest:simple', 'mochaTest:game', 'mochaTest:turnbased']);
};
