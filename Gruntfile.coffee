module.exports = (grunt) ->
    # Constants
    ASSETS_PATH = 'static/'
    JS_PATH = ASSETS_PATH + 'js/'
    ADDON_PATH = ASSETS_PATH + 'add-on/'

    LESS_MAIN = ASSETS_PATH + 'css/less/main.less'
    CSS_MAIN = ASSETS_PATH + 'css/main.css'
    LESS_FILES = ASSETS_PATH + 'css/less/_*.less'

    CSS_MAIN_FILES = CSS_MAIN: [LESS_MAIN]

    # COFFEE_FILES = JS_PATH + '**/*.coffee'
    JS_FILE = JS_PATH + 'docs.js'

    JS_MAIN = JS_PATH + 'docs.min.js'
    JS_MAIN_COMBINE =  [
        JS_FILE
    ]

    JS_BOOTSTRAP_MAIN = ADDON_PATH + 'bootstrap/bootstrap.min.js'
    JS_BOOTSTRAP_COMBINE =  [
        ADDON_PATH + 'bootstrap/modal.js',
        ADDON_PATH + 'bootstrap/scrollspy.js',
        ADDON_PATH + 'bootstrap/dropdown.js'
    ]

    JS_ADDON_MAIN = ADDON_PATH + 'app.js'
    JS_ADDON_COMBINE =  [
        ADDON_PATH + 'bootstrap/bootstrap.min.js',
        ADDON_PATH + 'jquery-1.9.1.min.js',
        ADDON_PATH + 'jquery.plugin/jquery.autocomplete.js'
    ]

    JS_ADDON_LAST = ADDON_PATH + 'app.min.js'

    # Project configuration
    grunt.initConfig
        jshint:
            options:
                jshintrc: '.jshintrc'
                ignores: [JS_MAIN]
            all: [JS_FILE]

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

        useminPrepare:
            html: '_includes/footer.html'
            options:
              root: 'app'
              dest: 'static'

        concat:
            combine:
                options:
                    separator: ';'
                files: [
                    src:    JS_BOOTSTRAP_COMBINE
                    dest:  JS_BOOTSTRAP_MAIN
                ,
                    src:    JS_MAIN_COMBINE
                    dest:  JS_MAIN
                ,
                    src:    JS_ADDON_COMBINE
                    dest:  JS_ADDON_MAIN
                ]

        uglify:
            compress:
                options:
                    report: 'min'
                files: [
                    expand: true
                    src: [JS_MAIN]
                ,
                    expand: true
                    src: [JS_ADDON_LAST]
                ]



        usemin:
            html: '_includes/footer.html'
            options:
              dest: 'static'


    #    watch:
    #        options:
    #            livereload: true
    #            debounceDelay: 600
    #        less:
    #            files: LESS_FILES
    #            tasks: 'less:development'
    #        js:
    #            files: JS_FILE
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
    grunt.loadNpmTasks 'grunt-contrib-uglify'
    grunt.loadNpmTasks 'grunt-contrib-jshint'
    grunt.loadNpmTasks 'grunt-contrib-concat'
    grunt.loadNpmTasks 'grunt-contrib-csslint'
    grunt.loadNpmTasks 'grunt-usemin'
    # grunt.loadNpmTasks 'grunt-contrib-imagemin'

    # on watch events configure jshint:all to only run on changed file
    grunt.event.on 'watch', (action, filepath) ->
        grunt.config ['jshint', 'all'], filepath

    grunt.registerTask 'production', [
#        'coffee'
        'useminPrepare'
        'jshint'
        'uglify:compress'
        'less:production'
        'csslint:strict'
        'usemin'
    ]

    grunt.registerTask 'default', [
#        'coffee'
        'useminPrepare'
        'jshint'
        'less:development'
        'csslint:strict'
        'concat'
        'usemin'
    ]

