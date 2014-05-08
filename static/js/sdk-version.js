var sdk_map = {
    'ios-sdk': 'ios',
    'android-sdk': 'android',
    'java-sdk': 'java',
    'php-sdk': 'php',
    'python-sdk': 'python',
    'ruby-sdk': 'ruby',
    'nodejs-sdk': 'nodejs',
    'csharp-sdk': 'csharp',
    'c-sdk': 'c',
    'api': 'go',
    'qiniu-js-sdk': 'javascript'
};

function getSdkInfo(res) {
    var data = res.data[0];
    var tarball_url = data && data.tarball_url;
    if (!tarball_url) {
        return false;
    }
    var pos_of_sdk = 5; // the index of repo name
    // tarball_url looks like https://api.github.com/repos/qiniupd/qiniu-js-sdk/tarball/v1.0.1-beta
    var sdk_key = tarball_url.split('/')[pos_of_sdk];
    var version = data.tag_name;
    var date = data.created_at.substr(0, 10);
    $('#sdk_' + sdk_map[sdk_key]).find('.version').text('版本：' + version);
    $('#sdk_' + sdk_map[sdk_key]).find('.update-date').text('更新：' + date);

}

$(function() {
    var sdk = [{
        "name": "ios",
        "url": "https://api.github.com/repos/qiniu/ios-sdk/"
    }, {
        "name": "android",
        "url": "https://api.github.com/repos/qiniu/android-sdk/"
    }, {
        "name": "java",
        "url": "https://api.github.com/repos/qiniu/java-sdk/"
    }, {
        "name": "php",
        "url": "https://api.github.com/repos/qiniu/php-sdk/"
    }, {
        "name": "python",
        "url": "https://api.github.com/repos/qiniu/python-sdk/"
    }, {
        "name": "ruby",
        "url": "https://api.github.com/repos/qiniu/ruby-sdk/"
    }, {
        "name": "nodejs",
        "url": "https://api.github.com/repos/qiniu/nodejs-sdk/"
    }, {
        "name": "csharp",
        "url": "https://api.github.com/repos/qiniu/csharp-sdk/"
    }, {
        "name": "c",
        "url": "https://api.github.com/repos/qiniu/c-sdk/"
    }, {
        "name": "go",
        "url": "https://api.github.com/repos/qiniu/api/"
    }, {
        "name": "javascript",
        "url": "https://api.github.com/repos/qiniupd/qiniu-js-sdk/"
    }];


    var self_remove = function() {
        $(this).remove();
    };
    var $script_version = [];
    var $script_date = [];
    for (var i = 0, len = sdk.length; i < len; i++) {
        $script_version[i] = $('<script/>');
        $('head').append($script_version[i]);
        $script_version[i].on('load', self_remove);
        $script_version[i].attr('src', sdk[i].url + 'releases?callback=getSdkInfo');
    }
});
