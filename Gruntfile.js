module.exports = function (grunt) {
    require('time-grunt')(grunt);

    var path = require('path');

    grunt.initConfig({
        meta: {
            sass: {
                files: {
                    'resources/public/assets/css/app.css': 'src/scss/app/**/app.scss'
                }
            },
            app_js: {
                src: [
                    'src/polyfill/*.js',
                    'src/components/**/module.js',
                    'src/app/**/module.js',
                    'src/components/**/*.js',
                    'src/components/*.js',
                    'src/app/**/*.js',
                    'src/app/*.js',
                    '!src/components/config/**'
                ],
                files: {
                    'resources/public/assets/js/app.min.js': [
                        'build/src/**/module.*js',
                        'build/src/**/*.js',
                    ]
                }
            }
        },

        environment: {
            default: 'dev',
            environments: ['dev', 'prod'],
            version: function(){
                return grunt.file.readJSON('package.json')['version']
            }
        },

        clean: {
            build: ['build']
        },

        copy: {
            fonts: {
                files: [
                    {
                        expand: true,
                        cwd: 'bower_components/bootstrap/dist/',
                        src: ['fonts/*'],
                        dest: 'resources/public/assets/'
                    },
                ]
            },
            html: {
                files: [
                    {expand: true, cwd: 'src/app/', src: ['**/*.html'], dest: 'resources/public/'},
                    {expand: true, cwd: 'src/components/', src: ['**/*.html'], dest: 'resources/public/'},
                ],
            },
            skins: {
                files: [
                    {expand: true, cwd: 'src/', src: ['skins/**'], dest: 'resources/public/'},
                ],
            },
        },

        "regex-replace": {
            "livereload": {
                src: ['resources/public/index.html'],
                actions: [
                    {
                        name: 'insert-livereload',
                        search: '</body>',
                        replace: '<script src="//localhost:35729/livereload.js"></script></body>'
                    }
                ]
            }
        },

        ngAnnotate: {
            options: {
                singleQuotes: true,
            },
            app: {
                files: [
                    {
                        expand: true,
                        src: '<%= meta.app_js.src %>',
                        dest: 'build',
                        ext: '.annotated.js', // Dest filepaths will have this extension.
                        extDot: 'last',       // Extensions in filenames begin after the last dot
                    },
                ],
            },
        },

        uglify: {
            app_dev: {
                options: {
                    mangle: true,
                    beautify: true,
                    sourceMap: true
                },
                files: '<%= meta.app_js.files %>',
            },
            app_prod: {
                options: {
                    mangle: true
                },
                files: '<%= meta.app_js.files %>',
            },
            config: {
                options: {
                    mangle: true
                },
                files: {
                    'resources/public/assets/js/config.min.js': [
                        'src/components/config/module.js',
                        'src/components/config/Config.<%= environment.env %>.js'
                    ]
                }
            },
            lib: {
                options: {
                    mangle: false
                },
                files: {
                    'resources/public/assets/js/lib.min.js': [
                        'bower_components/angular/angular.js',
                        'bower_components/angular-resource/angular-resource.min.js',
                        'bower_components/angular-route/angular-route.min.js',
                        'bower_components/angular-ui-router/release/angular-ui-router.min.js'
                    ]
                }
            }
        },

        sass: {
            sass_dev: {
                files: '<%= meta.sass.files %>',
                options: {
                    sourceMap: true
                }
            },
            sass_prod: {
                files: '<%= meta.sass.files %>'
            }
        },

        sasslint: {
            target: ['src/scss/app/**.scss']
        },

        concat: {
            css: {
                src: [
                    'src/scss/vendor/**/*.css'
                ],
                dest: 'resources/public/assets/css/lib.css',
            },
        },

        watch: {
            src: {
                files: ['src/**/*'],
                tasks: ['compile-dev'],
                options: {
                    atBegin: true,
                    livereload: true,
                    spawn: false,
                },
            }
        },

        karma: {
            options: {
                configFile: 'src/test/karma.conf.js'
            },
            unit: {
                singleRun: false
            },
            ci: {
                configFile: 'src/test/karma.ci.js'
            }
        },

        'http-server': {
            dev: {
                // the server root directory
                root: 'public',
                // the server port
                // can also be written as a function, e.g.
                // port: function() { return 8282; }
                port: 11080,

                // the host ip address
                // If specified to, for example, "127.0.0.1" the server will
                // only be available on that ip.
                // Specify "0.0.0.0" to be available everywhere
                host: "0.0.0.0",

                // run in parallel with other tasks
                runInBackground: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-environment');
    grunt.loadNpmTasks('grunt-http-server');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-regex-replace');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-sass-lint');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('dev', ['concurrent:target']);
    grunt.registerTask('compile-dev', ['environment:dev', 'compile', 'uglify:app_dev', 'copy:html', 'sasslint', 'sass:sass_dev', 'regex-replace:livereload']);
    grunt.registerTask('compile-prod', ['environment:prod', 'compile', 'clean:build']);
    grunt.registerTask('compile', ['clean:build', 'newer:copy', 'ngAnnotate', 'newer:uglify:lib', 'uglify:app_prod', 'uglify:config', 'newer:concat', 'newer:sass:sass_prod']);

    grunt.registerTask('test:unit', ['karma:ci']);
    grunt.registerTask('test', ['test:unit']);

    grunt.registerTask('default', ['watch']);
};
