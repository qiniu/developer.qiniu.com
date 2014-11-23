module.exports = (grunt) ->
    # Constants

    require('load-grunt-tasks')(grunt)

    JS_PATH = 'static/js/'
    LESS_MAIN =  'static/css/less/main.less'
    CSS_MAIN = 'static/css/main.css'
    JS_FILE = JS_PATH + 'docs.js'

    grunt.initConfig
        jshint:
            options:
                jshintrc: '.jshintrc'
            all: [JS_FILE]

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

        useminPrepare:
            html: [
                '_footer.html'
                '_header.html'
            ]
            options:
                dest: '.'

        copy:
            footer:
                src: '_includes/footer_template.html'
                dest: '_footer.html'
            header:
                src: '_includes/header_template.html'
                dest: '_header.html'
            back_footer:
                src: '_footer.html'
                dest: '_includes/footer.html'
            back_header:
                src: '_header.html'
                dest: '_includes/header.html'
        filerev:
            options:
                algorithm: 'md5'
                length: 8
            images:
                src: ['static/image/logo-download.png', 'static/image/logo.png', 'static/image/qiniu_logo_small.png']
                dest: '.tmp'
            js:
                src: ['static/js/docs.min.js', 'static/js/app.js']
            css:
                src: ['static/css/main.css']

        usemin:
            html: [
                '_footer.html'
                '_header.html'
            ]

        clean:[
            '_footer.html'
            '_header.html'
        ]


    grunt.registerTask 'production', [
#        'coffee'
        'copy:header'
        'copy:footer'
        'less:production'
        'useminPrepare'
        'jshint'
        'uglify'
        'concat'
        'filerev'
        'usemin'
        'copy:back_footer'
        'copy:back_header'
    ]

    grunt.registerTask 'default', [
#        'coffee'
        'copy:header'
        'copy:footer'
        'less:development'
        'useminPrepare'
        'jshint'
        'uglify'
        'concat'
        'filerev'
        'usemin'
        'copy:back_footer'
        'copy:back_header'
        'clean'
    ]

