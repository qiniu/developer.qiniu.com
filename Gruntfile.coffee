module.exports = (grunt) ->
    # Constants
    BIN_PATH = 'bin/'
    ASSETS_PATH = 'static/'
    JS_PATH = ASSETS_PATH + 'js/'
    # ADDON_PATH = ASSETS_PATH + 'add-on/'

    LESS_MAIN = ASSETS_PATH + 'css/less/main.less'
    CSS_MAIN = ASSETS_PATH + 'css/main.css'
    LESS_FILES = ASSETS_PATH + 'css/less/_*.less'

    CSS_MAIN_FILES = CSS_MAIN: [LESS_MAIN]

    # COFFEE_FILES = JS_PATH + '**/*.coffee'
    JS_FILES = JS_PATH + 'docs.js'

    JS_MAIN = JS_PATH + 'boot.min.js'
    JS_COMBINE = [
        JS_PATH + 'highlight/highlight.js',
        JS_PATH + 'jquery-1.9.1.min.js',
        JS_PATH + 'jquery.autocomplete.js',
        JS_PATH + 'jquery.scrollUp.min.js',
        JS_PATH + 'modal.js',
        JS_PATH + 'scrollspy.js'
        JS_PATH + 'dropdown.js'
    ]

    # Project configuration
    grunt.initConfig
        jshint:
            options:
                jshintrc: '.jshintrc'
                ignores: [JS_MAIN]
            all: [JS_FILES]

        csslint:
            options:
                csslintrc: '.csslintrc'
            strict:
                src: [CSS_MAIN]

        less:
            development:
                options:
                    dumpLineNumbers: 'comments'
                files: [{
                    src: LESS_MAIN
                    dest: CSS_MAIN
                }]
            production:
                options:
                    yuicompress: true
                files: [{
                    src: LESS_MAIN
                    dest: CSS_MAIN
                }]

    #    coffee:
    #        compile:
    #            options:
    #                bare: true
    #                join: false
    #            files: [{
    #                expand: true
    #                ext: '.js'
    #                src: [COFFEE_FILES]
    #            }]

        concat:
            combine:
                options:
                    separator: ';'
                files: [{
                    src: JS_COMBINE
                    dest: JS_MAIN
                }]

    #     uglify:
    #         compress:
    #            options:
    #                report: 'min'
    #            files: [{
    #                expand: true
    #                src: [JS_FILES, 'src/qiniu.com/portal/!public/**/*.min.js']
    #            }]

    #    watch:
    #        options:
    #            livereload: true
    #            debounceDelay: 600
    #        less:
    #            files: LESS_FILES
    #            tasks: 'less:development'
    #        js:
    #            files: JS_FILES
    #            tasks: 'jshint'
    #            options:
    #                spawn:false
    #        concat:
    #            files: [JS_PATH + 'global/_*.js']
    #            tasks: 'concat'
    #        csslint:
    #            files: CSS_MAIN
    #            tasks: 'csslint:strict'
    #        coffee:
    #            files: COFFEE_FILES
    #            tasks: 'coffee'

    # Dependencies
    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-contrib-clean'
    grunt.loadNpmTasks 'grunt-contrib-watch'
    grunt.loadNpmTasks 'grunt-contrib-less'
    # grunt.loadNpmTasks 'grunt-contrib-uglify'
    grunt.loadNpmTasks 'grunt-contrib-jshint'
    grunt.loadNpmTasks 'grunt-contrib-concat'
    grunt.loadNpmTasks 'grunt-contrib-csslint'
    # grunt.loadNpmTasks 'grunt-contrib-imagemin'

    # on watch events configure jshint:all to only run on changed file
    grunt.event.on 'watch', (action, filepath) ->
        grunt.config ['jshint', 'all'], filepath

    grunt.registerTask 'production', [
#        'coffee'
        'jshint'
#        'uglify:compress'
        'less:production'
        'csslint:strict'
    ]

    grunt.registerTask 'default', [
#        'coffee'
        'jshint'
        'less:development'
        'csslint:strict'
        'concat'
    ]

