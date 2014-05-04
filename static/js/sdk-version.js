var maps = {
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

function getVesion(res) {
    var tarball_url = res.data[0] && res.data[0].tarball_url;
    if (!tarball_url) {
        return false;
    }
    var sdk = tarball_url.split('/');
    var pos_of_sdk = 5;
    var version = res.data[0].name;
    $('#sdk_' + maps[sdk[pos_of_sdk]]).find('.version').text('版本：' + version);

}

function getUpdateDate(res) {
    var url = res.data[0] && res.data[0].url;
    if (!url) {
        return false;
    }
    var sdk = res.data[0].url.split('/');
    var pos_of_sdk = 5;
    var date = res.data[0].updated_at.substr(0, 10);
    $('#sdk_' + maps[sdk[pos_of_sdk]]).find('.update-date').text('更新：' + date);
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
    for (var i = 0, len = sdk.length; i < len; i++) {
        $script_version[i] = $('<script/>');
        $('head').append($script_version[i]);
        $script_version[i].on('load', self_remove);
        $script_version[i].attr('src', sdk[i].url + 'tags?callback=getVesion');
    }
    var $script_date = [];
    for (i = 0; i < len; i++) {
        $script_date[i] = $('<script/>');
        $('head').append($script_date[i]);
        $script_date[i].on('load', self_remove);
        $script_date[i].attr('src', sdk[i].url + 'issues?state=closed&&callback=getUpdateDate');
    }
});
