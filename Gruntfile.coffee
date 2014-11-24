module.exports = (grunt) ->
    # Constants

    require('load-grunt-tasks')(grunt)

    grunt.initConfig
        jshint:
            options:
                jshintrc: '.jshintrc'
            all: ['_src/js/docs.js','_src/js/sdk-version.js']

        less:
            development:
                options:
                    dumpLineNumbers: 'comments'
                files: [{
                    src: '_src/css/less/main.less'
                    dest: 'dist/css/main.css'
                }]
            production:
                options:
                    yuicompress: true
                files: [{
                    src: '_src/css/less/main.less'
                    dest: 'dist/css/main.css'
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
                src: '_src/html/footer.html'
                dest: '_footer.html'
            js:
                src: '_src/js/sdk-version.js'
                dest: 'dist/js/sdk-version.js'
            image:
                src: '_src/image/**'
                dest: 'dist/image/**'
            header:
                src: '_src/html/header.html'
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
            js:
                src: ['dist/js/docs.js', 'dist/add-on/app.js']
            css:
                src: ['dist/css/main.css']

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
        'copy:header'
        'copy:footer'
        'copy:js'
        'copy:image'
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
        'copy:header'
        'copy:footer'
        'copy:js'
        'copy:image'
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

