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
                'footer.html'
                'header.html'
            ]
            options:
                dest: '.'

        copy:
            main:
                files: [
                  # makes all src relative to cwd
                  {expand: true, cwd: '_src/image/', src: ['**'], dest: 'dist/image/'},
                  {expand: true, cwd: '_src/html/', src: ['**'], dest: '.'},
                  {expand: true, cwd: '_src/add-on/highlight/', src: ['highlight.js'], dest: 'dist/add-on/'},
                  {expand: true, cwd: '_src/add-on/jquery.plugin/jquery.bxslider/', src: ['jquery.bxslider.min.js'], dest: 'dist/add-on/'},
                  {expand: true, cwd: '_src/add-on/', src: ['html5.js'], dest: 'dist/add-on/'},
                  {expand: true, cwd: '_src/js/', src: ['sdk-version.js'], dest: 'dist/js/'}
                ]
            back:
                files :[
                    {expand: true, cwd: '.', src: ['*.html'], dest: '_includes'}
                ]

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
                'footer.html'
                'header.html'
            ]

        clean:[
            'footer.html'
            'header.html'
        ]


    grunt.registerTask 'production', [
        'copy:main'
        'less:production'
        'useminPrepare'
        'jshint'
        'concat'
        'uglify'
        'filerev'
        'usemin'
        'copy:back'
        'clean'
    ]

    grunt.registerTask 'default', [
        'copy:main'
        'less:development'
        'useminPrepare'
        'jshint'
        'concat'
        'uglify'
        'filerev'
        'usemin'
        'copy:back'
        'clean'
    ]

