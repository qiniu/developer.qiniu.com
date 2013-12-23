var Qiniu = {};

Qiniu.maxRepeatNum = 5;
Qiniu.defaultRepeatNum = 2;
Qiniu.zendeskEmail = zendeskEmail;

/*------------------------------------------------------------

判断浏览器类型，目前只有Firefox、IE、Opera，有需要可以添加。

------------------------------------------------------------*/
Qiniu.browser = {
    msie: function() {
        if (window.navigator.userAgent.indexOf("MSIE") >= 1) {
            return true;
        } else {
            return false;
        }
    }(),
    mozilla: function() {
        if (window.navigator.userAgent.indexOf("Firefox") >= 1) {
            return true;
        } else {
            return false;
        }
    }(),
    opera: function() {
        if (window.navigator.userAgent.indexOf("OPR") >= 1) {
            return true;
        } else {
            return false;
        }
    }()
};

Qiniu.spiltStr = function(str, symbol) {
    var splitFlag, spiltedOb;
    if ((typeof(str) === 'string') && symbol) {
        splitFlag = str.indexOf(symbol);
        if (splitFlag !== -1) {
            spiltedOb = {
                before: str.slice(0, splitFlag),
                behind: str.slice(splitFlag, str.length)
            };
        } else {
            spiltedOb = {
                before: str,
                behind: ''
            };
        }
    } else {
        spiltedOb = {
            before: '',
            behind: ''
        };
    }
    return spiltedOb;
};

Qiniu.isPositiveInteger = function(num) {
    return /^[1-9]\d*$/.test(num);
};

Qiniu.log = function() {
    if (!window.console) {
        return true;
    }
    if (!console.log.apply) {
        for (var i = 0, l = arguments.length; i < l; i++) {
            console.log(arguments[i]);
        }
        return true;
    }
    return loadFromLocal('allowLog', 'log') && console.log.apply(console, arguments);
};

Qiniu.isNumber = function(num) {
    return !isNaN(parseFloat(num)) && isFinite(num);
};

Qiniu.saveToLocal = function(key, value, nameSpace) {
    if (!window.localStorage) {
        return false;
    }
    if (typeof key !== 'string') {
        return false;
    }
    if (nameSpace) {
        key = nameSpace + '$' + key;
    }

    value = JSON.stringify(value);

    window.localStorage[key] = value;
    return true;
};

Qiniu.loadFromLocal = function(key, nameSpace) {
    if (!window.localStorage) {
        return false;
    }
    if (typeof key !== 'string') {
        return false;
    }
    if (nameSpace) {
        key = nameSpace + '$' + key;
    }

    var value = window.localStorage[key];

    if (value) {
        return $.parseJSON(value);
    }

    return null;
};

Qiniu.removeFromLocal = function(key, nameSpace) {
    if (typeof key !== 'string') {
        return false;
    }
    if (nameSpace) {
        key = nameSpace + '$' + key;
    }

    return localStorage.removeItem(key);
};

Qiniu.toggleLog = function() {
    if (loadFromLocal('allowLog', 'log')) {
        removeFromLocal('allowLog', 'log');
        return '已禁用log';
    } else {
        saveToLocal('allowLog', true, 'log');
        return '开启log';
    }
};

Qiniu.getNavigator = function() {
    var userAgent = navigator.userAgent.toLowerCase(),
        s, o = {};
    var browser = {
        version: parseInt(userAgent.match(/(?:firefox|opera|safari|chrome|msie)[\/: ]([\d.]+)/)[1], 10),
        safari: /version.+safari/.test(userAgent),
        chrome: /chrome/.test(userAgent),
        firefox: /firefox/.test(userAgent),
        ie: /msie/.test(userAgent),
        opera: /opera/.test(userAgent)
    };
    return browser;
};

Qiniu.format = function(num, hex, units, dec) {
    num = num || 0;
    dec = dec || 0;
    var level = 0;
    while (num >= hex) {
        num /= hex;
        level++;
    }

    if (level === 0) {
        dec = 0;
    }

    return {
        'base': num.toFixed(dec),
        'unit': units[level],
        'format': function(sep) {
            sep = sep || '';
            return this.base + sep + this.unit;
        }
    };
};

Qiniu.numFormat = function(num, n) {
    if (typeof n !== 'number' || n < 1) {
        n = 1;
    }
    var s = num.toFixed(n);
    var pattern1 = /[0]+$/;
    var pattern2 = /\.$/;
    return s.replace(pattern1, '').replace(pattern2, '');
};

Qiniu.random = function(min, max) {
    min = min || 0;
    max = max || 100;
    var r = Math.random() * (max - min);
    return Math.floor(r + min);
};

Qiniu.utf8_encode = function(argString) {
    // http://kevin.vanzonneveld.net
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: sowberry
    // +    tweaked by: Jack
    // +   bugfixed by: Onno Marsman
    // +   improved by: Yves Sucaet
    // +   bugfixed by: Onno Marsman
    // +   bugfixed by: Ulrich
    // +   bugfixed by: Rafal Kukawski
    // +   improved by: kirilloid
    // +   bugfixed by: kirilloid
    // *     example 1: utf8_encode('Kevin van Zonneveld');
    // *     returns 1: 'Kevin van Zonneveld'

    if (argString === null || typeof argString === 'undefined') {
        return '';
    }

    var string = (argString + ''); // .replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    var utftext = '',
        start, end, stringl = 0;

    start = end = 0;
    stringl = string.length;
    for (var n = 0; n < stringl; n++) {
        var c1 = string.charCodeAt(n);
        var enc = null;

        if (c1 < 128) {
            end++;
        } else if (c1 > 127 && c1 < 2048) {
            enc = String.fromCharCode(
                (c1 >> 6) | 192, (c1 & 63) | 128
            );
        } else if (c1 & 0xF800 ^ 0xD800 > 0) {
            enc = String.fromCharCode(
                (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
            );
        } else { // surrogate pairs
            if (c1 & 0xFC00 ^ 0xD800 > 0) {
                throw new RangeError('Unmatched trail surrogate at ' + n);
            }
            var c2 = string.charCodeAt(++n);
            if (c2 & 0xFC00 ^ 0xDC00 > 0) {
                throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
            }
            c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
            enc = String.fromCharCode(
                (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
            );
        }
        if (enc !== null) {
            if (end > start) {
                utftext += string.slice(start, end);
            }
            utftext += enc;
            start = end = n + 1;
        }
    }

    if (end > start) {
        utftext += string.slice(start, stringl);
    }

    return utftext;
};

Qiniu.base64_encode = function(data) {
    // http://kevin.vanzonneveld.net
    // +   original by: Tyler Akins (http://rumkin.com)
    // +   improved by: Bayron Guevara
    // +   improved by: Thunder.m
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Pellentesque Malesuada
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // -    depends on: utf8_encode
    // *     example 1: base64_encode('Kevin van Zonneveld');
    // *     returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
    // mozilla has this native
    // - but breaks in 2.0.0.12!
    //if (typeof this.window['atob'] == 'function') {
    //    return atob(data);
    //}
    var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
        ac = 0,
        enc = '',
        tmp_arr = [];

    if (!data) {
        return data;
    }

    data = utf8_encode(data + '');

    do { // pack three octets into four hexets
        o1 = data.charCodeAt(i++);
        o2 = data.charCodeAt(i++);
        o3 = data.charCodeAt(i++);

        bits = o1 << 16 | o2 << 8 | o3;

        h1 = bits >> 18 & 0x3f;
        h2 = bits >> 12 & 0x3f;
        h3 = bits >> 6 & 0x3f;
        h4 = bits & 0x3f;

        // use hexets to index into b64, and append result to encoded string
        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    } while (i < data.length);

    enc = tmp_arr.join('');

    switch (data.length % 3) {
        case 1:
            enc = enc.slice(0, -2) + '==';
            break;
        case 2:
            enc = enc.slice(0, -1) + '=';
            break;
    }

    return enc;
};

Qiniu.URLSafeBase64Encode = function(v) {
    v = base64_encode(v);
    return v.replace(/\//g, '_').replace(/\+/g, '-');
};

//UTF-8 decoding
Qiniu.utf8_decode = function(str_data) {
    // http://kevin.vanzonneveld.net
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // +      input by: Aman Gupta
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Norman "zEh" Fuchs
    // +   bugfixed by: hitwork
    // +   bugfixed by: Onno Marsman
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: kirilloid
    // *     example 1: utf8_decode('Kevin van Zonneveld');
    // *     returns 1: 'Kevin van Zonneveld'

    var tmp_arr = [],
        i = 0,
        ac = 0,
        c1 = 0,
        c2 = 0,
        c3 = 0,
        c4 = 0;

    str_data += '';

    while (i < str_data.length) {
        c1 = str_data.charCodeAt(i);
        if (c1 <= 191) {
            tmp_arr[ac++] = String.fromCharCode(c1);
            i++;
        } else if (c1 <= 223) {
            c2 = str_data.charCodeAt(i + 1);
            tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
            i += 2;
        } else if (c1 <= 239) {
            // http://en.wikipedia.org/wiki/UTF-8#Codepage_layout
            c2 = str_data.charCodeAt(i + 1);
            c3 = str_data.charCodeAt(i + 2);
            tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        } else {
            c2 = str_data.charCodeAt(i + 1);
            c3 = str_data.charCodeAt(i + 2);
            c4 = str_data.charCodeAt(i + 3);
            c1 = ((c1 & 7) << 18) | ((c2 & 63) << 12) | ((c3 & 63) << 6) | (c4 & 63);
            c1 -= 0x10000;
            tmp_arr[ac++] = String.fromCharCode(0xD800 | ((c1 >> 10) & 0x3FF));
            tmp_arr[ac++] = String.fromCharCode(0xDC00 | (c1 & 0x3FF));
            i += 4;
        }
    }

    return tmp_arr.join('');
};

Qiniu.base64_decode = function(input) {
    var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    if (!input) {
        return input;
    }
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

    while (i < input.length) {

        enc1 = b64.indexOf(input.charAt(i++));
        enc2 = b64.indexOf(input.charAt(i++));
        enc3 = b64.indexOf(input.charAt(i++));
        enc4 = b64.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 !== 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 !== 64) {
            output = output + String.fromCharCode(chr3);
        }

    }

    output = Qiniu.utf8_decode(output);

    return output;
};

Qiniu.URLSafeBase64Decode = function(v) {
    if (typeof v !== 'string') {
        return null;
    }
    v = v.replace(/_/g, '/').replace(/\-/g, '+');
    return base64_decode(v);
};



Qiniu.getDayObj = function(offset, t) {
    offset = offset || 'now';

    if (!t) {
        t = new Date(phpjs.strtotime(offset) * 1000);
    }

    return {
        y: t.getFullYear(),
        m: t.getMonth() + 1,
        d: t.getDate(),
        value: t.valueOf()
    };
};

Qiniu.dateFormat = function(y, m, d, sep) {
    sep = sep || '';
    var f = '';
    if (y) {
        f += (y < 10 ? '0' + y : '' + y) + sep;
    }
    if (m) {
        f += (m < 10 ? '0' + m : '' + m) + sep;
    }
    if (d) {
        f += (d < 10 ? '0' + d : '' + d);
    }
    return f;
};

Qiniu.formatMoney = function(m) {
    return "￥" + (m / 10000).toFixed(2);
};

Qiniu.getYear = function(offset) {
    var t = getDayObj(offset);

    return dateFormat(t.y);
};

Qiniu.getMonth = function(offset) {
    var t = getDayObj(offset);

    return dateFormat(t.y, t.m);
};

Qiniu.getDay = function(offset, tt) {
    var t = getDayObj(offset, tt);
    return dateFormat(t.y, t.m, t.d);
};

Qiniu.getSecond = function(offset, tt, sep) {
    var t = getDayObj(offset, tt);
    var d = new Date(t.value);
    return dateFormat(t.y, t.m, t.d, sep) + ' ' + dateFormat(d.getHours(), d.getMinutes(), d.getSeconds(), ':');
};

Qiniu.postData = function(data, url, success, fail, repeat) {
    //if(typeof repeat === 'undefined') repeat = defaultRepeatNum;
    $.ajax(url, {
        data: data,
        type: 'post',
        dataType: 'json',
        success: success,
        //返回XMLHttpRequest 对象，包含readyState,  status, statusText(例如: 4, 200, ok)
        error: function(ajaxObj, textStatus, errorThrown) {
            if (fail) {
                fail(ajaxObj, textStatus, errorThrown);
            }
            if (typeof repeat === 'number' && repeat > 0) {
                repeat--;
            }
            if (repeat === true) {
                repeat = maxRepeatNum;
            }
            if (repeat) {
                postData(data, url, success, fail, repeat);
            }
        }
    });
};

Qiniu.getData = function(url, success, fail, repeat) {
    if (typeof repeat === 'undefined') {
        repeat = defaultRepeatNum;
    }
    postData('', url, success, fail, repeat);
};

Qiniu.testBottom = function() {
    var getScrollTop = function() {
        if (document.documentElement && document.documentElement.scrollTop) {
            return document.documentElement.scrollTop;
        } else if (document.body) {
            return document.body.scrollTop;
        }
    };

    var getClientHeight = function() {
        if (document.body.clientHeight && document.documentElement.clientHeight) {
            return (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
        } else {
            return (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
        }
    };

    var getScrollHeight = function() {
        return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    };
    return getScrollTop() + getClientHeight() >= getScrollHeight();
};

Qiniu.showPwd = function(handles) {
    handles.each(function() {
        var handle = $(this);
        var pwd_in = handle.siblings('input[type=password]');
        handle.mousedown(function() {
            pwd_in.attr('type', 'text');
        }).mouseup(function() {
            pwd_in.attr('type', 'password');
        }).mouseout(function() {
            pwd_in.attr('type', 'password');
        });
    });
};
Qiniu.checkZendeskForm = function(zendeskContent, zendeskEmail) {
    var funcReturn = false;
    var emailRule = /^(?:\w+\.?)*\w+@(?:\w+\.)+\w+$/i;

    if (zendeskContent === "") {
        $(".js-zendesk-content").addClass("need");
        $(".js-zendesk-content").siblings("label").children(".js-tips").text("内容必须填写");
        funcReturn = true;
    } else if (zendeskContent.length > 30000) {
        $(".js-zendesk-content").addClass("need");
        $(".js-zendesk-content").siblings("label").children(".js-tips").text("内容请勿超过30000个字");
        funcReturn = true;
    }

    if (zendeskEmail === "") {
        $(".js-zendesk-email").addClass("need");
        $(".js-zendesk-email").siblings("label").children(".js-tips").text("电子邮件地址必须填写");
        funcReturn = true;
    } else if (!emailRule.test(zendeskEmail)) {
        $(".js-zendesk-email").addClass("need");
        $(".js-zendesk-email").siblings("label").children(".js-tips").text("电子邮件地址有误");
        funcReturn = true;
    }
    if (funcReturn) {
        return false;
    }

    return true;
};
Qiniu.initZendesk = function() {
    if (Qiniu.zendeskEmail) {
        Qiniu.postData({
                email: Qiniu.zendeskEmail
            },
            "/api/biz/developer/get",
            function(res) {
                $(".js-zendesk").data("name", res.fullname);
                $(".js-zendesk").data("email", res.email);
            }
        );
    }

    $(window).keydown(function(event) {
        if (event.keyCode === 27 && $(".js-zendesk").is(":visible")) {
            $(".js-zendesk").hide();
        }
    });

    $(".js-zendesk-content, .js-zendesk-email").keydown(function(event) {
        if ($(this).hasClass("need")) {
            $(this).removeClass("need");
            $(this).siblings("label").children(".js-tips").text("");
        }
        if ((event.keyCode === 10 || event.keyCode === 13) && event.ctrlKey) {
            $(".js-zendesk-submit").click();
        }
    });

    $(".js-zendesk").bindCurtainSwitches(
        [$(".js-zendesk-tab")], [$(".js-zendesk-close").eq(0), $(".js-zendesk-close").eq(1), $(".js-zendesk-submit")],
        function(self, res) {
            window.scrollTo(0, 0);
        },
        null,
        function(self, res) {
            $(".js-zendesk-tag").val($(this).children().eq(0).val());
            $(".js-zendesk-tag").children().eq(0).attr("selected", true);
            $(".js-zendesk-content").val("");
            $(".js-zendesk-email").val("");
            if ($(".js-zendesk").data("email")) {
                $(".js-zendesk-email").val($(".js-zendesk").data("email"));
                $(".js-zendesk-email").parent().addClass("hidden");
            }
            $(".js-zendesk-submit").text("提交");
            $(".js-zendesk-submit").attr("disabled", false);
            $(".js-zendesk-mask, .js-zendesk-loading, .js-zendesk-ok, .js-zendesk-timeout, .js-zendesk-error").hide();
            res(true);
        },
        function(self, res) {
            if (self.hasClass("js-zendesk-submit")) {
                var zendeskTag = $(".js-zendesk-tag").val(),
                    zendeskTitle,
                    zendeskContent = $(".js-zendesk-content").val(),
                    zendeskName,
                    zendeskEmail = $(".js-zendesk-email").val();

                if (!Qiniu.checkZendeskForm(zendeskContent, zendeskEmail)) {
                    return;
                }

                if (zendeskContent.length > 10) {
                    zendeskTitle = zendeskContent.slice(0, 9) + "...";
                } else {
                    zendeskTitle = zendeskContent;
                }

                if ($(".js-zendesk").data("name")) {
                    zendeskName = $(".js-zendesk").data("name");
                } else {
                    zendeskName = "匿名访客";
                }

                $(".js-zendesk-submit").attr("disabled", true);
                $(".js-zendesk-ok, .js-zendesk-timeout, .js-zendesk-error").hide();
                $(".js-zendesk-loading").show();
                $(".js-zendesk-mask").fadeIn();

                var postData = 'title=' + zendeskTitle +
                    '&content=' + zendeskContent +
                    '&name=' + zendeskName +
                    '&email=' + zendeskEmail +
                    '&tag=' + zendeskTag;

                Qiniu.postData(
                    postData,
                    "/zendesk/",
                    function() {
                        $(".js-zendesk-loading").fadeOut();
                        $(".js-zendesk-ok").fadeIn();
                        setTimeout(function() {
                            $(".js-zendesk").curtainHide();
                        }, 3000);
                    },
                    function(ajaxObj, textStatus, errorThrown) {
                        $(".js-zendesk-loading").fadeOut();
                        if (ajaxObj.status === 504) {
                            $(".js-zendesk-timeout").fadeIn();
                        } else {
                            $(".js-zendesk-error").fadeIn();
                        }
                        setTimeout(function() {
                            $(".js-zendesk-mask").fadeOut();
                            $(".js-zendesk-submit").text("重试");
                            $(".js-zendesk-submit").attr("disabled", false);
                        }, 3000);
                    },
                    0
                );
            } else {
                res(true);
            }
        }
    );
};
Qiniu.showNotification = function() {
    if ($('.resource-index').length === 0) { // 内容管理页面布局特殊，不显示
        var $notification = $('#notification-msg').html();
        if ($notification) {
            $('.right-cnt').prepend($notification);
        }
    }
};
//------------------------------------------------------------------------------
/*
 * these part are out of date
 * please use global namespace Qiniu like Qiniu.spiltStr
 */
var spiltStr = Qiniu.spiltStr;
var log = Qiniu.log;
var saveToLocal = Qiniu.saveToLocal;
var loadFromLocal = Qiniu.loadFromLocal;
var removeFromLocal = Qiniu.removeFromLocal;
var toggleLog = Qiniu.toggleLog;
var getNavigator = Qiniu.getNavigator;
var format = Qiniu.format;
var numFormat = Qiniu.numFormat;
var random = Qiniu.random;
var utf8_encode = Qiniu.utf8_encode;
var base64_encode = Qiniu.base64_encode;
var base64_decode = Qiniu.base64_decode;
var URLSafeBase64Encode = Qiniu.URLSafeBase64Encode;
var getDayObj = Qiniu.getDayObj;
var dateFormat = Qiniu.dateFormat;
var getYear = Qiniu.getYear;
var getMonth = Qiniu.getMonth;
var getDay = Qiniu.getDay;
var getSecond = Qiniu.getSecond;
var maxRepeatNum = Qiniu.maxRepeatNum;
var defaultRepeatNum = Qiniu.defaultRepeatNum;
var postData = Qiniu.postData;
var getData = Qiniu.getData;
var testBottom = Qiniu.testBottom;
var showPwd = Qiniu.showPwd;
//------------------------------------------------------------------------------


$.extend({
    getTemplates: function() {
        var self = this;

        if (!self.templates) {
            self.templates = {};
            $.getJSON('/static/theme/default/templates/preload-list.json', function(list) {
                $.each(list, function(i, name) {
                    $.get('/static/theme/default/templates/' + name + '.html', function(template) {
                        self.templates[name] = template;
                    });
                });
            });
        }
    },
    renderTemplate: function(name, values) {
        if (!this.templates || !this.templates[name]) {
            return '';
        }
        var template = this.templates[name];
        $.each(values, function(key, value) {
            template = template.replace('$$' + key, value);
        });
        return $(template);
    },
    alert: function(word, callback) {
        word = typeof word === 'string' ? word : JSON.stringify(word);
        var values = {
            title: '注意',
            word: word
        };
        var box = $.renderTemplate('alert-box', values);
        box.appendTo('body').boxShow();

        box.find('#box-confirm, .close-box').on('click', function() {
            box.boxHide().remove();

            callback && callback();
        });
    },
    prompt: function(word, value, callback) {
        word = typeof word === 'string' ? word : JSON.stringify(word);
        value = value ? value : '';
        if (typeof value === 'function') {
            callback = value;
            value = '';
        }
        callback = callback || function(a) {
            log(a);
        };

        var values = {
            title: '填写信息',
            word: word,
            value: value
        };
        var box = $.renderTemplate('prompt-box', values);
        box.appendTo('body').boxShow();

        box.find('#box-submit').on('click', function() {
            var value = box.find('#box-in').val();
            box.boxHide().remove();

            callback && callback(value);
        });
        box.find('#box-cancel, .close-box').on('click', function() {
            box.boxHide().remove();

            callback && callback(false);
        });
    },
    confirm: function(word, callback) {
        var res = $.Deferred();
        word = typeof word === 'string' ? word : JSON.stringify(word);
        callback = callback || function(a) {
            log(a);
        };

        var values = {
            title: '确认信息',
            word: word
        };
        var box = $.renderTemplate('confirm-box', values);
        box.appendTo('body').boxShow();

        box.find('#box-confirm').on('click', function() {
            box.boxHide().remove();

            callback && callback(true);
            res.resolve(true);
        });
        box.find('#box-cancel, .close-box').on('click', function() {
            box.boxHide().remove();

            callback && callback(false);
            res.reject(false);
        });
        return res.promise();
    }
});

$.fn.extend({
    checkout: function(cnt, index, activeClass, event) {
        event = event || 'click';
        var handle = this;
        var current = index || 0;
        activeClass = activeClass || 'current';

        var active = function(i) {
            handle.eq(i).addClass(activeClass);
            cnt.eq(i).show();
        };

        var disactive = function(i) {
            handle.eq(i).removeClass(activeClass);
            cnt.eq(i).hide();
        };

        handle.on(event, function() {
            var i = handle.index($(this));
            if (current !== i) {
                disactive(current);
                current = i;
                active(i);
            }
        });

        handle.checkoutIndex = function(i) {
            if (current !== i) {
                disactive(current);
                current = i;
                active(i);
            }
        };

        cnt.hide();
        active(current);

        return handle;
    },
    setActive: function(activeClass) {
        activeClass = activeClass || 'active';

        var ops = this;
        var loc = location.href;
        var L_loc = loc.length;

        var isAcceptable = function(i) {
            var acceptArray = ['/', '?', '#', undefined];

            return acceptArray.indexOf(i) >= 0;
        };

        ops.each(function(i) {
            var op = $(this);
            var href = op.attr('href').split('?')[0];

            var L_href = href.length;
            var pos = loc.indexOf(href);

            if (pos >= 0 && (isAcceptable(loc[pos + L_href]) || isAcceptable(href[L_href - 1]))) {
                op.addClass(activeClass);
                return true;
            }
        });
    },
    bindClick: function() {
        $(this).each(function() {
            var btn = $(this);
            var closeAccOp = function() {
                btn.removeClass('active');
            };
            btn.on('click', function(e) {
                btn.toggleClass('active');
            });

            btn.on('mouseleave', function() {
                if (btn.hasClass('active')) {
                    $('body').on('click', closeAccOp);
                }
            });

            btn.on('mouseenter', function() {
                $('body').off('click', closeAccOp);
            });
        });

        return $(this);
    },
    bindCurtainSwitches: function(on, off, afterOn, afterOff, beforeOn, beforeOff) {
        var obj = this;
        for (var i = 0, l = on.length; i < l; i++) {
            on[i].on('click', function() {
                //if(beforeOn && !beforeOn($(this))) return false;
                var exec = function() {
                    obj.show();
                    $('#curtain-bg').show();
                    window.scrollTo(0, 50);
                    if (afterOn) {
                        afterOn();
                    }
                };
                if (beforeOn) {
                    beforeOn($(this), function(res) {
                        if (res) {
                            exec();
                        }
                    });
                } else {
                    exec();
                }

                return false;
            });
        }

        for (var i = 0, l = off.length; i < l; i++) {
            off[i].on('click', function() {
                var exec = function() {
                    obj.hide();
                    $('#curtain-bg').hide();
                    if (afterOff) {
                        afterOff();
                    }
                };
                if (beforeOff) {
                    beforeOff($(this), function(res) {
                        if (res) {
                            exec();
                        }
                    });
                } else {
                    exec();
                }

                /*if(beforeOff && !beforeOff($(this))) return false;
                obj.hide();
                $('#curtain-bg').hide();
                if(afterOff) afterOff();*/
                return false;
            });
        }

        return obj;
    },
    curtainShow: function() {
        var box = $(this);
        $('#curtain-bg').show();
        window.scrollTo(0, 50);
        box.show().find('input').first().focus();
        return box;
    },
    curtainHide: function() {
        $('#curtain-bg').hide();
        return $(this).hide();
    },
    boxShow: function() {
        var box = $(this);
        $('#box-bg').show();
        box.show().find('input').first().focus();
        return box;
    },
    boxHide: function() {
        $('#box-bg').hide();
        return $(this).hide();
    },
    bindRadio: function(values, defaultIndex, activeClass, after, before) {
        activeClass = activeClass || 'active';
        var setters = this;
        defaultIndex = typeof(defaultIndex) === 'number' ? defaultIndex : 0;
        var index = defaultIndex;

        var checkout = function(setter) {
            var val = setter.attr('value');

            setters.removeClass(activeClass);
            setter.addClass(activeClass);

            valuer = values.filter('[value=' + val + ']');
            valuer[0].checked = true;
            index = setters.index(setter);

            valuer.trigger('change');
        };

        var setOpt = function(setter) {
            if (!setter.hasClass(activeClass)) {
                checkout(setter);
            }
        };

        var set = function(i) {
            var setter = setters.eq(i);

            setOpt(setter);
        };

        var init = function() {
            set(defaultIndex);
        };

        var get = function() {
            return index;
        };
        var setVal = function(val) {
            if (typeof val !== 'string') {
                return init();
            }
            setOpt(setters.filter('[value=' + val + ']'));
        };
        var getVal = function() {
            return values.eq(index).attr('value');
        };

        setters.on('click', function() {
            var setter = $(this);

            if (setter.hasClass(activeClass)) {
                return false;
            }

            if (before) {
                before(setters.index(setter), setter, function(res) {
                    if (res) {
                        checkout(setter);
                        if (after) {
                            after(setters.index(setter), setter);
                        }
                    }
                });
            } else {
                checkout(setter);
                if (after) {
                    after(setters.index(setter), setter);
                }
            }

            return true;
        });

        init();

        return {
            'init': init,
            'set': set,
            'get': get,
            'setVal': setVal,
            'getVal': getVal
        };
    },
    live: function(selector, event, handler, context) {
        context = context || 'body';
        $(context).on(event, selector, handler);
    },
    check: function() {
        if (arguments.length === 0) {
            return this.checkVal();
        } else {
            var ret = this.checkVal.apply(this, arguments);
            this.trigger('change');
            return ret;
        }
    },
    checkVal: function() {
        var self = this;

        if (arguments.length === 0) {
            return self[0].checked;
        }

        var val = arguments[0] ? true : false;
        self.each(function() {
            $(this)[0].checked = val;
        });
        return val;
    },
    setable: function(val) {
        val = val ? true : false;
        var withDisableAttrEles = ['SELECT', 'INPUT', 'BUTTON'];
        $(this).each(function() {
            if (withDisableAttrEles.indexOf(this.tagName) >= 0) {
                this.disabled = !val;
            } else {
                if (val) $(this).removeClass('disabled');
                else $(this).addClass('disabled');
            }
        });
        return $(this);
    },
    disable: function() {
        return $(this).setable(false);
    },
    enable: function() {
        return $(this).setable(true);
    },
    resetInput: function() {
        $(this).find('input[type=text]').val('');
        $(this).find('input[type=password]').val('');
        $(this).find('input[type=checkbox]').checkVal(false);

        return $(this);
    },
    simulateScroll: function(items, step, limit, reachBtm, leaveBtm) {
        var wrapper = $(this);
        /*if(!items){
            wrapper.css('max-height','none');
            return wrapper;
        }*/

        var current = 0;

        wrapper.css('max-height', step * limit + 1 + 'px');

        wrapper.getCurrent = function() {
            return current;
        };

        wrapper.scroll = function(change) {
            var scroller = items.eq(0);
            var num = items.length;
            var newVal = current + change;
            if (newVal > 0 || newVal + (num - limit) < 0) return false;

            current = newVal;
            if (current + (num - limit) === 0) {
                reachBtm();
            }
            if (current + (num - limit) === 1 && change === 1) {
                leaveBtm();
            }

            scroller.animate({
                marginTop: step * current
            }, 0);
            return false;
        };

        wrapper.on('mousewheel', function(event) {
            var up = event.originalEvent.wheelDelta;
            var change = up > 0 ? 1 : -1;

            return wrapper.scroll(change);
        });

        wrapper.on('DOMMouseScroll', function(event) {
            var up = -event.originalEvent.detail;
            var change = up > 0 ? 1 : -1;

            return wrapper.scroll(change);
        });

        wrapper.on('keyup', function(event) {
            if (event.keyCode) {
                var cmd = event.keyCode;
                return false;
            }
        });

        return wrapper;
    },
    autoScrollX: function(speed) {
        speed = speed || 1;
        var period = 100; //ms
        var scroller = $(this);
        var wrapper = scroller.parent();
        var outWidth = wrapper.width();
        var inWidth = scroller.width();

        if (outWidth > inWidth) return false;

        var gap = inWidth - outWidth;
        var left = 0;
        var intervalTimer, timeoutTimer;

        scroller.css({
            position: 'relative'
        });

        var set = function(nleft) {
            left = nleft;
            scroller.css({
                left: -nleft + 'px'
            });
        };

        wrapper.startScroll = function(s) {
            set(0);
            if (s) speed = s;
            intervalTimer = setInterval(function() {
                if (left >= gap) {
                    wrapper.pauseScroll();
                    timeoutTimer = setTimeout(function() {
                        wrapper.startScroll(speed);
                    }, 1000);
                } else {
                    set((left + speed) % (gap + 20));
                }
            }, period);
        };

        wrapper.pauseScroll = function() {
            clearInterval(intervalTimer);
            clearTimeout(timeoutTimer);
        };

        wrapper.stopScroll = function() {
            wrapper.pauseScroll();
            set(0);
        };

        return wrapper;
    }
});


//----------------- Todo (event model) -------------------------

function Todo() {
    this.list = {};
}

Todo.prototype.Register = function(trigger, handle) {
    if (typeof(trigger) !== 'string') {
        return false;
    }


    if (typeof(this.list[trigger]) !== 'object') this.list[trigger] = [];

    this.list[trigger].push(handle);
    return true;
};

Todo.prototype.Trigger = function(trigger, obj) {

    var args = [];
    for (var i = 0, l1 = arguments.length, l2 = this.Trigger.length; i < l1; i++) {
        if (i >= l2) {
            args.push(arguments[i]);
        }
    }

    if (typeof(this.list[trigger]) !== 'object') return true;

    var li = this.list[trigger];
    for (var i = 0, l = li.length; i < l; i++) {
        li[i].apply(obj, args);
    }
    //this.list[trigger] = [];

    return true;
};

// ---------------------------- view model ---------------------------------

var defaultObj = {
    base: '...',
    unit: 'MB'
};
var defaultVal = '...';
var defaultArray = [];

var defaultPageNum = 10;
var defaultNumInPage = 10;
var defaultGetPageDeviation = 2;

var storageUnits = ['B', 'KB', 'MB', 'GB', 'TB'];
var storageHex = 1024;

var numUnits = ['次', '万次', '亿次'];
var numHex = 10000;

var maxLoadBucketNum = 5;

var level2_domain_pattern = /^([a-zA-Z][a-zA-Z0-9\+\-]*.qiniudn.com)|([a-zA-Z\d][a-zA-Z\d\+\-]*.qbox.me)$/;

function Bucket(b) {
    this.name = ko.observable(b.name ? b.name : defaultVal);
    this.storage = ko.observable(defaultObj);
    this.download = ko.observable(defaultObj);
    this.apiQuery = ko.observable(defaultObj);
    var permanent_domain_pattern = /^[0-9]+.qiniudn.com$/;
    var permanent_domain = this.name() + '.qiniudn.com';
    this.anti_leech_mode = ko.observable(b.anti_leech_mode);
    var domains = b.bind_domains;
    var new_domains = {
        permanent: [],
        level2: [],
        customs: []
    };
    if (domains) {
        for (var i = 0, l = domains.length; i < l; i++) {
            var domain = domains[i];
            if (permanent_domain_pattern.test(domain) || domain === permanent_domain) {
                new_domains['permanent'].push(domain);
                continue;
            }
            if (level2_domain_pattern.test(domain)) {
                new_domains['level2'].push(domain);
                continue;
            }
            new_domains['customs'].push(domain);
        }
    }
    this.bind_domains = ko.observable(new_domains);

    this.expires = ko.observable(b.expires);
    this.host = ko.observable(b.host);
    this.private = ko.observable(b.private);
    this.protected = ko.observable(b.protected == 1);

    this.refer_bl = ko.observableArray(b.refer_bl);
    this.refer_wl = ko.observableArray(b.refer_wl);
    this.visit_ctr = ko.observable(b.refer_wl ? 1 : (b.refer_bl ? 2 : 0));

    this.refresh_time = ko.observable(b.refresh_time);
    this.separator = ko.observableArray((b.separator || '').split(''));
    this.source = ko.observable(b.source);

    this.styles = ko.observableArray([]);
    for (var name in b.styles) {
        /*        var rules = b.styles[name].split('/');

        for (var i = 0, l = rules.length; i < l;) {
            if (rules[i] === 'imageMogr' || rules[i] === 'auto-orient') {
                i++;
            } else {
                style[rules[i]] = rules[i + 1];
                i += 2;
            }
        }*/
        if (b.styles.hasOwnProperty(name)) {
            var style = {
                name: name,
                cnt: b.styles[name]
            };
            var ruleArr = b.styles[name].split('|');
            for (var i = 0, len = ruleArr.length; i < len; i++) {
                rules = ruleArr[i].split('/');
                for (var j = 0, l = rules.length; j < l;) {
                    if (rules[j] === 'imageMogr' || rules[j] === 'auto-orient') {
                        j++;
                    } else {
                        style[rules[j]] = rules[j + 1];
                        j += 2;
                    }
                }
            }
            this.styles.push(style);
        }
    }

    this.formData = {};
}

function File(f, url, bucketType) {
    var self = this;
    self.bucketPrivateOrProtected = ko.observable(bucketType === 'private' || bucketType === 'protected');
    self.name = ko.observable(f.key || '');
    self.token = ko.observable(f.download_token);

    if (url !== '') {
        self.url = ko.computed(function() {
            var publicUrl = 'http://' + url + '/' + encodeURIComponent(self.name());
            if (bucketType === 'private' || bucketType === 'protected') {
                return publicUrl + '?token=' + self.token();
            }
            return publicUrl;
        });
    } else {
        self.url = ko.observable('');
    }

    var t = phpjs.dateFormat('Y-m-d H:i:s', f.putTime / 10000000);
    self.lastModifiedTime = ko.observable(t);

    var temp = format(f.fsize, storageHex, storageUnits, 0);
    self.size = ko.observable({
        base: temp.base,
        unit: temp.unit
    });

    self.type = ko.observable(f.mimeType);
    self.hash = ko.observable(f.hash);
}

function UserViewModel() {
    var self = this;

    self.todo = new Todo();

    //----------------- members -------------------------
    self.mail = ko.observable(_mail || defaultVal);

    self.balance = ko.observable({});
    self.storage = ko.observable(defaultObj);
    self.download = ko.observable(defaultObj);
    self.apiQuery = ko.observable(defaultObj);

    self.noticeNum = ko.observable(defaultVal);

    self.bucketsName = ko.observableArray(defaultArray);
    self.reportBucketsName = ko.observableArray(defaultArray);
    self.buckets = ko.observableArray(defaultArray);
    self.appInfo = ko.observable({
        key: []
    });

    self.currentBucketsNum = 0;
    var Status = function() {
        var ready = {};

        return {
            setStatus: function(data, status) {
                ready[data] = status;

                var args = [data + 'Ready', null];
                for (var i = 0, l1 = arguments.length, l2 = this.setStatus.length; i < l1; i++) {
                    if (i >= l2) {
                        args.push(arguments[i]);
                    }
                }
                if (status) {
                    self.todo.Trigger.apply(self.todo, args);
                }
            },
            getStatus: function(data) {
                return ready[data] || false;
            }
        };
    };
    self.status = Status();

    self.numInPage = ko.observable(10);

    self.certainBucket = ko.observable(new Bucket({}));
    self.certainFileNum = ko.observable(0);
    self.certainFiles = ko.observableArray([
        []
    ]);
    self.certainMarker = ko.observable('');
    self.certainPageIndex = ko.observable(0);
    self.certainPageRange = ko.observable({});

    self.certainBucketHasMore = ko.observable(true);


    //----------------- functions -------------------------

    self.getBalance = function(callback) {
        self.status.setStatus('balance', false);
        getData('/api/wallet/info', function(result) {
            if (result) {
                self.balance({
                    amount: Qiniu.formatMoney(result.amount),
                    amountValue: result.amount,
                    cash: Qiniu.formatMoney(result.cash),
                    coupon: Qiniu.formatMoney(result.coupon)
                });
            }
            self.status.setStatus('balance', true, self.balance());
            if (callback) callback();
        });
    };

    self.getAccountInfo = function(callback) {
        self.status.setStatus('accountInfo', false);

        postData({
            'timezone': '+08:00',
            'month': getMonth()
        }, '/api/stats/info', function(result) {
            var temp;
            if (typeof(result.apicall_get) === 'number' && typeof(result.apicall_put) === 'number') {
                temp = format(result.apicall_get + result.apicall_put, numHex, numUnits, 2);
                self.apiQuery({
                    base: temp.base,
                    unit: temp.unit
                });
            }

            if (typeof(result.space) === 'number') {
                if (result.space < 0) {
                    result.space = 0;
                }
                temp = format(result.space, storageHex, storageUnits, 2);
                self.storage({
                    base: temp.base,
                    unit: temp.unit
                });
            }

            if (typeof(result.transfer) === 'number') {
                temp = format(result.transfer, storageHex, storageUnits, 2);
                self.download({
                    base: temp.base,
                    unit: temp.unit
                });
            }

            self.status.setStatus('accountInfo', true);
            if (callback) callback(result);
        });
    };

    self.getAppInfo = function(callback) {
        self.status.setStatus('appInfo', false);
        postData({
            app: 'default'
        }, '/api/uc/appInfo', function(result) {
            if (result) {
                if (result.key) {
                    var appInfo = {
                        'key': [],
                        'appId': result.appId,
                        'utype': result.utype
                    };
                    appInfo.key.push({
                        'accessKey': result.key,
                        'secretKey': result.secret,
                        'state': result.state || 0
                    });

                    if (result.key2) {
                        appInfo.key.push({
                            'accessKey': result.key2,
                            'secretKey': result.secret2,
                            'state': result.state2 || 0
                        });
                    }
                    // sort --- sort()not reliable in ie8-
                    if (appInfo.key.length > 1) {
                        if (appInfo.key[0].accessKey > appInfo.key[1].accessKey) {
                            var tmp = appInfo.key[0];
                            appInfo.key[0] = appInfo.key[1];
                            appInfo.key[1] = tmp;
                        }
                    }
                    self.appInfo(appInfo);
                    self.status.setStatus('appInfo', true, appInfo);
                }
            }
            if (callback) callback(result);
        });
    };

    self.getBucketsName = function(callback) {
        self.status.setStatus('bucketsName', false);

        getData('/api/rs/buckets', function(buckets) {
            if (buckets) self.bucketsName(buckets);

            self.status.setStatus('bucketsName', true, self.bucketsName());
            if (callback) callback();
        });
    };

    self.saveBucketsName = function() {
        var bucketsName = self.bucketsName();
        //return saveToLocal('bucketsName', bucketsName);
    };

    self.loadBucketsName = function() {
        self.status.setStatus('bucketsName', false);
        var bucketsName = loadFromLocal('bucketsName');

        if (bucketsName) {
            self.bucketsName(bucketsName);

            self.status.setStatus('bucketsName', true);

            return true;
        } else {
            return false;
        }
    };

    self.getBucketInfo = function(bucketName, callback) {
        self.status.setStatus('bucketInfo', false);
        var getStat = function(result) {
            result = result || {};
            result.name = bucketName;
            var newBucket = new Bucket(result);

            postData({
                'timezone': '+08:00',
                'bucket': bucketName,
                'month': getMonth()
            }, '/api/stats/info', function(result) {
                var temp, baseObj;

                if (typeof(result.apicall_get) === 'number' && typeof(result.apicall_put) === 'number') {
                    temp = format(result.apicall_get + result.apicall_put, numHex, numUnits, 2);
                    newBucket.apiQuery({
                        base: temp.base,
                        unit: temp.unit
                    });
                }

                if (typeof(result.space) === 'number') {
                    if (result.space < 0) {
                        result.space = 0;
                    }
                    temp = format(result.space, storageHex, storageUnits, 2);
                    baseObj = Qiniu.spiltStr(temp.base, '.');
                    newBucket.storage({
                        base: temp.base,
                        base_int: baseObj.before,
                        base_dot: baseObj.behind,
                        unit: temp.unit
                    });
                }

                if (typeof(result.transfer) === 'number') {
                    temp = format(result.transfer, storageHex, storageUnits, 2);
                    baseObj = Qiniu.spiltStr(temp.base, '.');
                    newBucket.download({
                        base: temp.base,
                        base_int: baseObj.before,
                        base_dot: baseObj.behind,
                        unit: temp.unit
                    });
                }

                self.status.setStatus('bucketInfo', true, newBucket);

                if (callback) {
                    callback(newBucket);
                }
            }, function() {
                if (callback) {
                    callback(newBucket);
                }
            });
        };
        postData({
            bucket: bucketName
        }, '/api/uc/bucketInfo', getStat, getStat);
    };

    self.getBucketFormData = function(bucket, type, from, to, p, callback) {
        self.status.setStatus('bucketFormData' + type, false);
        if (typeof bucket === 'string' || !bucket) {
            var name = bucket;
            bucket = {
                name: function() {
                    return name;
                },
                formData: {}
            };
        }
        p = p || 'day';
        if (from === to && type !== 'space') {
            p = '5min';
        }

        postData({
            'bucket': bucket.name(),
            'from': from,
            'to': to,
            'p': p
        }, '/api/stats/select/' + type, function(result) {
            bucket.formData[type] = result;
            self.status.setStatus('bucketFormData' + type, true, result);
            if (callback) callback(result);
        }, function(err) {});
    };

    self.getBucketApiCallFormData = function(bucket, from, to, p, callback) {
        self.status.setStatus('bucketApiCallFormData', false);
        if (typeof bucket === 'string' || !bucket) {
            var name = bucket;
            bucket = {
                name: function() {
                    return name;
                },
                formData: {}
            };
        }
        p = p || 'day';
        if (from === to) {
            p = '5min';
        }

        postData({
            'bucket': bucket.name(),
            'type': 'get',
            'from': from,
            'to': to,
            'p': p
        }, '/api/stats/select/apicall', function(result1) {
            bucket.formData['apicall'] = {};
            bucket.formData['apicall']['get'] = result1;

            postData({
                'bucket': bucket.name(),
                'type': 'put',
                'from': from,
                'to': to,
                'p': p
            }, '/api/stats/select/apicall', function(result2) {
                bucket.formData['apicall']['put'] = result2;
                self.status.setStatus('bucketApiCallFormData', true, result1, result2);
                if (callback) {
                    callback(result1, result2);
                }
            }, function(err) {});
        }, function(err) {});
    };

    self.getCertainBucket = function(bucketName, callback) {
        self.status.setStatus('certainBucket', false);

        self.getBucketInfo(bucketName, function(bucket) {
            self.certainBucket(bucket);

            self.status.setStatus('certainBucket', true, bucket);
            if (callback) callback(bucket);
        });
    };

    self.getCertainFiles = function(bucketName, prefix, pageNum, callback, fail, refresh) {
        self.status.setStatus('certainFiles', false);

        var clearCurrent = function() {
            self.certainFiles([]);
            self.certainFileNum(0);
            self.certainMarker('');
            return true;
        };
        refresh && clearCurrent();

        marker = self.certainMarker() || '';
        prefix = prefix || '';
        var numInPage = self.numInPage() || defaultNumInPage;
        pageNum = pageNum || defaultPageNum;
        var num = numInPage * pageNum;
        Qiniu.getData('/bucket/list?bucket=' + bucketName + '&marker=' + marker + '&limit=' + num + '&prefix=' + prefix, function(result) {
            if (result) {
                refresh && clearCurrent(); //clean again incase too frequent request causing unclean
                var items = result.items || [];
                var l = items.length;

                self.certainBucketHasMore(l >= num);

                self.certainFileNum(self.certainFileNum() + l);

                var currentLastPage = [];
                if (self.certainFiles()) {
                    currentLastPage = self.certainFiles()[self.certainFiles().length - 1];
                }


                var pageFiles = [];
                var dn_url = _downloadInfo ? _downloadInfo.url : '';
                for (var i = 0; i < l; i++) {
                    if (currentLastPage && currentLastPage.length < numInPage) {
                        currentLastPage.push(new File(items[i]), dn_url, result.bucketType);
                    } else {
                        if (pageFiles.push(new File(items[i], dn_url, result.bucketType)) >= numInPage) {
                            self.certainFiles.push(pageFiles);
                            pageFiles = [];
                        }
                    }

                }
                if (pageFiles.length > 0) {
                    self.certainFiles.push(pageFiles);
                }
                self.certainMarker(result.marker);

                self.status.setStatus('certainFiles', true);
            }
            if (callback) callback(self.certainFiles(), marker);
        }, function(err) {
            Qiniu.log('getCertainFiles Error: ', err);
            if (fail) {
                fail(err);
            }
        });
    };

    self.getBuckets = function(num, callback) {
        self.status.setStatus('buckets', false);
        num = num || maxLoadBucketNum;

        var bucketsName = self.bucketsName();

        var l = bucketsName.length;
        var currentBucketsNum = self.currentBucketsNum;
        var i, buckets = [];
        if (l > num + currentBucketsNum) l = num + currentBucketsNum;
        for (i = currentBucketsNum; i < l; i++) {
            var bucketName = bucketsName[i];

            var f = (function() {
                var index = i; // use closure to ensure the sequence of each bucket (as it is in the bucketNames)
                return function(bucket) {
                    self.buckets()[index] = bucket;
                    self.buckets.splice(0, 0); // to trigger
                    self.currentBucketsNum++;
                    if (self.currentBucketsNum === l) {
                        /*for(var j=self.currentBucketsNum;j<buckets.length;j++){
                            self.buckets.push(buckets[j]);
                            self.currentBucketsNum++;
                        }*/
                        self.status.setStatus('buckets', true, self.buckets());
                        if (callback) callback();
                    }
                };
            })();

            self.getBucketInfo(bucketName, f);
        }
    };
}

var model = new UserViewModel();

var shortCuts = {
    // ESC
    '27': function(event) {
        $('.curtain').curtainHide();
        $('.mkbucket-curtain').curtainHide();
    }
};

var checkBucketName = function() {
    var bucketName_pattern = /^[a-zA-Z][a-zA-Z0-9\-]{3,62}$/,
        $bucketError = $('#mkbucket-prev p.error'),
        $bucketNameIn = $('#bucketname-in'),
        bucketName = $bucketNameIn.val(),
        bucketName_len = bucketName.length;
    if (bucketName_len <= 0) {
        $bucketError.text('请输入空间名称。').show();
        $bucketNameIn.focus().addClass('error');
        return false;
    }
    if (!(bucketName_len > 3 && bucketName_len < 64)) {
        $bucketError.text('空间名字长度最小为4个字符，最大63个字符。').show();
        $bucketNameIn.focus().addClass('error');
        return false;
    }

    if (!bucketName_pattern.test(bucketName)) {
        $bucketError.text('空间名由数字、字母、-(减号)组成，且不以数字、-(减号)开头,请尝试其他名称。').show();
        $bucketNameIn.focus().addClass('error');
        return false;
    }
    $bucketNameIn.removeClass('error');
    return true;
};

var mkbucket = function() {
    if (!checkBucketName()) {
        return false;
    }

    var bucketName = $('#bucketname-in').val();
    var bucketType = $('#bucket-curtain input:radio[name="attr-type"]:checked').val();
    $.ajax('/bucket/create', {
        data: {
            'bucketName': bucketName,
            'public': bucketType
        },
        type: 'post',
        async: false,
        dataType: 'json',

        success: function(result) {
            $('#mkbucket-prev').hide();
            $('#mkbucket-next').show();
            if (result.bucketType === 1) { // public bucket
                $('#bucket-public').show();
                $('#bucket-private').hide();
            } else { // pirvate bucket
                $('#bucket-public').hide();
                $('#bucket-private').show();
            }

            $("#bucket-name").text("空间名称：" + result.bucketName).show();
            $("#creat-time").text("创建时间：" + result.createTime).show();
            $("#config-bucket").attr("href", "/bucket/setting/basic?bucket=" + result.bucketName);
        },

        error: function(error) {
            var errStr;
            if (error.responseText !== undefined) {
                // remove the double quotation marks from the head and tail.
                errStr = error.responseText;
                $('#mkbucket-prev p.error').text(errStr.substring(1, errStr.length - 1)).show();
            }
        }
    });
};

/*------------------------------------------------------------

如需页面加载完毕时执行的代码，请在此函数下编写。

------------------------------------------------------------*/
$(window).load(function() {
    $(window).resize(function() {
        $("#curtain-bg").height($(this).height());
    });
    $(window).resize();
});

// ajax monitor
// -----------------------------------------------------------
(function() {
    var ajaxMonitor = $('#ajax-monitor');
    var ajaxErrCount = 0;
    var monitorProcess;
    var closeEl = $('<i class="ajax-monitor-closer">&times;</i>'); // 关闭按钮, &times; === '×'
    $(document).ajaxStart(function() {
        // 加载状态延迟显示, 保存 Timer 对象以便请求完成时间 < 1s 时不显示加载状态
        monitorProcess = setTimeout(function() {
            ajaxMonitor.text('正在加载...');
            ajaxMonitor.fadeIn();
        }, 1000);
    }).ajaxError(function(err) {
        ajaxErrCount += 1;
    }).ajaxStop(function() {
        // 清除延迟显示的 Timer, 加载时间 < 1s 时不显示加载状态
        clearTimeout(monitorProcess);
        ajaxMonitor.text('加载完成');

        // 有请求加载失败时显示失败信息
        if (ajaxErrCount > 0) {
            if (!ajaxMonitor.is(':visible')) {
                ajaxMonitor.fadeIn();
            }
            ajaxMonitor.html('部分内容加载失败，请 ' +
                '<a class="normal-link" href="javascript:window.location.reload();">刷新</a>' + ' 后重试。');
            if (ajaxMonitor.has(closeEl).length === 0) { // 防止重复添加关闭按钮
                closeEl.on('click', function() {
                    ajaxErrCount = 0;
                    ajaxMonitor.fadeOut();
                }).appendTo(ajaxMonitor);
            }
        } else {
            // 延迟关闭成功信息
            setTimeout(function() {
                ajaxMonitor.fadeOut();
            }, 800);
        }
    });
})();
// -----------------------------------------------------------

$(function() {
    $.getTemplates();

    $('.op', '#box-right-ops').setActive('current');
    if (location.pathname !== '/') {
        $('#box-right-ops').find('[href="/"]').removeClass('current');
    }

    $('html').on('keyup', function(e) {
        if (e.keyCode) {
            var cmd = e.keyCode.toString();
            shortCuts[cmd] && shortCuts[cmd]();
        }
    });

    $('.choices > .choice', '.box').setActive('current');

    $('#account-ops').bindClick();

    showPwd($('.show-pwd'));

    ko.applyBindings(model);

    model.todo.Register('bucketsNameReady', function() {
        var bucketMoreTip = $('#bucket-more-tip');
        var initialWord = bucketMoreTip.text();
        var endWord = '没有更多';
        var scroller = $('#bucket-ops').simulateScroll($('#bucket-ops > a'), 41, 6, function() {
            bucketMoreTip.text(endWord);
        }, function() {
            bucketMoreTip.text(initialWord);
        });

        if (typeof _bucketName !== 'undefined') {
            if (model.bucketsName().indexOf(_bucketName) < 0) {
                //Go back to '/' if this bucket does not exist
                location.href = location.origin;
            }
        }

        $('#bucket-ops .bucket-op>span').each(function() {
            var t = $(this);
            $(this).on('mouseenter', function() {
                t = $(this).autoScrollX();
                t && t.startScroll(4);
            }).on('mouseleave', function() {
                t && t.stopScroll();
            });
        });
    });

    $('input').first().focus();

    //-----------------------------------------------------------------------------------------------------
    var $curtain = $('#bucket-curtain');
    // before pop up a new window, clear the history state.
    var clearState = function() {
        var $curtain = $('#bucket-curtain');
        $curtain.find('#bucketname-in').removeClass('error').val('');
        $curtain.find('#mkbucket-prev .error').hide();
        $curtain.find('#current-length').text('0').show().removeClass('length-ok').addClass('number-left');
        $curtain.find('#mkbucket-next').hide();
        $curtain.find('#mkbucket-prev').show();
    };
    var arr_mkbucket = [$('#mkbucket-close-btn'), $curtain.find('.cancel')];
    $curtain.bindCurtainSwitches([$('#mkbucket')], arr_mkbucket, clearState);
    $curtain.bindCurtainSwitches([$('.js-new-bucket-btn')], arr_mkbucket, clearState);

    $('#bucketname-in').on('keyup', function() {
        var $this = $(this),
            $error = $('#mkbucket-prev p.error'),
            $current_length = $('#current-length'),
            currentInput_len = $this.val().length;

        $current_length.show().text(currentInput_len);

        if (currentInput_len > 3 && currentInput_len < 64) {
            $current_length.removeClass('number-left').addClass('length-ok');
            $error.hide();
        } else {
            $current_length.removeClass('length-ok').addClass('number-left');
            if (currentInput_len <= 0) {
                $this.removeClass('error');
                $error.hide();
            }
        }
    });

    $('#bucketname-in').on('blur', function() {
        checkBucketName();
    });

    $('#mkbucket-prev .attribute label').on('click', function() {
        $(this).removeClass('default').addClass('checked').siblings('label').addClass('default').removeClass('checked');
    });

    $('#submit-btn').on('click', function() {
        return mkbucket();
    });

    Qiniu.initZendesk();
    Qiniu.showNotification();
    /**
     * Tip
     */
    //console.log('Hi~如果遇到异常，使用toggleLog()打开或关闭log，方便发现问题并反馈给我们。');
});
