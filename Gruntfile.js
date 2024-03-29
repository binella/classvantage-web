// Generated on 2013-09-25 using generator-angular 0.4.0
'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT });
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);
	
	grunt.loadNpmTasks('grunt-ng-constant');
	
	// FOR NOW
	grunt.loadNpmTasks('grunt-inline-angular-templates');


	grunt.registerTask('beep', function () {
		var path = require('path');		
		var filepath = 'dist/views/something.html';
		var templateUrl = path.join('', path.relative('dist', filepath)).replace(/\\/g, '/');
		grunt.log.writeln(templateUrl);
		/*
		var con = grunt.config(['concat','<%= yeoman.dist %>/scripts/scripts.js'])
		grunt.log.write(con);
		
		var locator = function (p) { return grunt.file.expand({filter: 'isFile'}, p); };
		var RevvedFinder = require(require('path').resolve('node_modules/grunt-usemin/lib/revvedfinder'));
		var revvedfinder = new RevvedFinder(locator);
		grunt.log.subhead('WRITING: --- ');
		grunt.log.writeln(grunt.config('yeoman').dist);
		var newname = revvedfinder.find('scripts.js', grunt.config('beep').dest + '/scripts');
		grunt.config('templateHelperScriptsFile', newname);
		grunt.log.writeln(newname);
		*/
	});

  // configurable paths
  var yeomanConfig = {
    app: 'app',
    dist: 'dist'
  };

  try {
    yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
  } catch (e) {}

  grunt.initConfig({
		// ENV variables
		ngconstant: {
			dev: {
				dest: '<%= yeoman.app %>/scripts/environment.js',
				name: 'env',
				constants: {
					'ENV': {
						baseURL: 'http://localhost:3000/v1/',
						oAuth: {
							endPoint: 'http://localhost:3000/oauth/token',
							clientId: '20100c70466699968233062227f148840238540ecf511a92e8d5d6748f0149de',
							clientSecret: '9a13e2fd0a71494c87681b462213d416a3b8b503ca6ed13690bfe3de4ce0ee29'
						}
					}
				}
			},
			test: {
				dest: '<%= yeoman.app %>/scripts/environment.js',
				name: 'env',
				constants: {
					'ENV': {
						baseURL: 'http://com-classvantage-test.herokuapp.com/v1/',
						oAuth: {
							endPoint: 'http://com-classvantage-test.herokuapp.com/oauth/token',
							clientId: '20100c70466699968233062227f148840238540ecf511a92e8d5d6748f0149de',
							clientSecret: '9a13e2fd0a71494c87681b462213d416a3b8b503ca6ed13690bfe3de4ce0ee29'
						}
					}
				}
			},
			staging: {
				dest: '<%= yeoman.app %>/scripts/environment.js',
				name: 'env',
				constants: {
					'ENV': {
						baseURL: 'http://api-staging.classvantage.com/v1/',
						oAuth: {
							endPoint: 'http://api-staging.classvantage.com/oauth/token',
							clientId: '20100c70466699968233062227f148840238540ecf511a92e8d5d6748f0149de',
							clientSecret: '9a13e2fd0a71494c87681b462213d416a3b8b503ca6ed13690bfe3de4ce0ee29'
						}
					}
				}
			},
			production: {
				dest: '<%= yeoman.app %>/scripts/environment.js',
				name: 'env',
				constants: {
					'ENV': {
						baseURL: 'http://api.classvantage.com/v1/',
						oAuth: {
							endPoint: 'http://api.classvantage.com/oauth/token',
							clientId: '20100c70466699968233062227f148840238540ecf511a92e8d5d6748f0149de',
							clientSecret: '9a13e2fd0a71494c87681b462213d416a3b8b503ca6ed13690bfe3de4ce0ee29'
						}
					}
				}
			}
		},
		inline_angular_templates: {
			dist: {
				options: {
					base: 'dist'
				},
				files: {
					'dist/index.html': ['dist/views/*.html']
				}
			}
		},
		beep: {
			dest: '<%= yeoman.dist %>'
		},
    yeoman: yeomanConfig,
    watch: {
      coffee: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.coffee'],
        tasks: ['coffee:dist']
      },
      coffeeTest: {
        files: ['test/spec/{,*/}*.coffee'],
        tasks: ['coffee:test']
      },
      compass: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:server', 'autoprefixer']
      },
      styles: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
        tasks: ['copy:styles', 'autoprefixer']
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT,
					nospawn: false
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },
    autoprefixer: {
      options: ['last 1 version'],
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, yeomanConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'test')
            ];
          }
        }
      },
      dist: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, yeomanConfig.dist)
            ];
          }
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= connect.options.port %>'
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js'
      ]
    },
    coffee: {
      options: {
        sourceMap: true,
        sourceRoot: ''
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/scripts',
          src: '{,*/}*.coffee',
          dest: '.tmp/scripts',
          ext: '.js'
        }]
      },
      test: {
        files: [{
          expand: true,
          cwd: 'test/spec',
          src: '{,*/}*.coffee',
          dest: '.tmp/spec',
          ext: '.js'
        }]
      }
    },
    compass: {
      options: {
        sassDir: '<%= yeoman.app %>/styles',
        cssDir: '.tmp/styles',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: '<%= yeoman.app %>/images',
        javascriptsDir: '<%= yeoman.app %>/scripts',
        fontsDir: '<%= yeoman.app %>/styles/fonts',
        importPath: '<%= yeoman.app %>/bower_components',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/styles/fonts',
        relativeAssets: false
      },
      dist: {},
      server: {
        options: {
          debugInfo: true
        }
      }
    },
    // not used since Uglify task does concat,
    // but still available if needed
    /*concat: {
      dist: {}
    },*/
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/styles/{,*/}*.css',
            '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.dist %>/styles/fonts/*'
          ]
        }
      }
    },
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%= yeoman.dist %>']
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    cssmin: {
      // By default, your `index.html` <!-- Usemin Block --> will take care of
      // minification. This option is pre-configured if you do not wish to use
      // Usemin blocks.
      // dist: {
      //   files: {
      //     '<%= yeoman.dist %>/styles/main.css': [
      //       '.tmp/styles/{,*/}*.css',
      //       '<%= yeoman.app %>/styles/{,*/}*.css'
      //     ]
      //   }
      // }
    },
    htmlmin: {
      dist: {
        options: {
          /*removeCommentsFromCDATA: true,
          // https://github.com/yeoman/grunt-usemin/issues/44
          //collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true*/
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: ['*.html', 'views/*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    // Put files not handled in other tasks here
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'bower_components/**/*',
            'images/{,*/}*.{gif,webp}',
            'styles/fonts/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: [
            'generated/*'
          ]
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },
    concurrent: {
      server: [
        'coffee:dist',
        'compass:server',
        'copy:styles'
      ],
      test: [
        'coffee',
        'compass',
        'copy:styles'
      ],
      dist: [
        'coffee',
        'compass:dist',
        'copy:styles',
        'imagemin',
        'svgmin',
        'htmlmin'
      ]
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>/scripts',
          src: '*.js',
          dest: '<%= yeoman.dist %>/scripts'
        }]
      }
    },
    uglify: {
      dist: {
        files: {
          '<%= yeoman.dist %>/scripts/scripts.js': [
            '<%= yeoman.dist %>/scripts/scripts.js'
          ]
        }
      }
    }
  });

  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
			'ngconstant:dev',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

	grunt.registerTask('build', function (target) {
		target = target || 'test'; // FOR NOW
			
		grunt.task.run([
			'clean:dist',
	    'useminPrepare',
	    'concurrent:dist',
	    'autoprefixer',
			'ngconstant:' + target,
	    'concat',
	    'copy:dist',
	    'cdnify',
	    'ngmin',
	    'cssmin',
	    'uglify',
			'inline_angular_templates',
	    'rev',
	    'usemin'
		]);
	});

  grunt.registerTask('default', [
    'jshint',
    'test',
    'build'
  ]);
};
