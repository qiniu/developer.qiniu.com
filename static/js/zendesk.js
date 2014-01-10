var _IE = (function() {
    var v = 3,
        div = document.createElement('div'),
        all = div.getElementsByTagName('i');
    while (
        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
        all[0]
    );
    return v > 4 ? v : false;
}());

function Zendesk(initObj) {
    this.url = initObj.url;
    this.width = initObj.width;
    this.minHeight = initObj.minHeight;
    this.defaultUnit = initObj.defaultUnit;
    this.type = initObj.type;
    this.frameId = initObj.frameId;
    this.hideFrameId = initObj.hideFrameId;
    this.selector = initObj.selector;
    this.type = '';
    this.obj = '';
    //this.self = this;
    var self = this;
    this.show = function(type) {
        var l = location.href.split('#')[0];
        self.type = type;
        //正式环境
        //this.iframe.attr('src', 'https://portal.qiniu.com/zendesk/docs?type=' + type + '#' + l);
        //this.iframeHide.attr('src', 'https://portal.qiniu.com/zendesk/docs?type=' + type + '#' + l);
        //本地测试
        if (self.type) {
            self.iframe.attr('src', self.url + '?type=' + self.type + '#' + l);
            self.iframeHide.attr('src', self.url + '?type=' + self.type + '#' + l);
        } else {
            self.iframe.attr('src', self.url + '#' + l);
            self.iframeHide.attr('src', self.url + '#' + l);
        }
        //线上测试
        //  self.iframe.attr('src', 'https://portal-feature.qiniu.io/zendesk/docs?type=' + type + '#' + l);
        // self.iframeHide.attr('src', 'https://portal-feature.qiniu.io/zendesk/docs?type=' + type + '#' + l);
        self.obj.fadeIn().removeClass('hide').show();
        var dx = $(window).height() - self.minHeight;
        var half = dx / 2;
        self.iframe.fadeIn().css({
            'margin-top': half + $(window).scrollTop() + 'px'

        });
        return false;
    };
    this.hide = function() {
        //var self = this;
        self.obj.fadeOut().addClass('hide');
        self.iframe.fadeOut();
    };
    this.init = function() {
        //var self = this;
        self.obj = self.obj || $('<div></div>');
        self.iframe = self.iframe || $('<iframe></iframe>');
        self.iframeHide = self.iframeHide || $('<iframe></iframe>');
        self.obj.css({
            'position': 'fixed',
            'left': '0px',
            'top': '0px',
            'width': $(window).width(),
            'height': $(document).height(),
            'z-index': 10000,
            'background': 'rgba(0, 0, 0, 0.2)',
        }).hide().appendTo('body');

        if (_IE) {
            if (_IE <= 8) {
                self.obj.css({
                    'background': 'url(transparent)',
                    'filter': 'progid:DXImageTransform.Microsoft.gradient(enabled=true,startColorstr=#000000,endColorstr=#00000000)'
                });
            }
        }
        self.iframe.attr({
            'allowTransparency': 'true',
            'frameBorder': '0',
            'scrolling': 'no',
            'id': this.frameId,
            'name': this.frameId
        }).css({
            'position': 'absolute',
            'left': '50%',
            'top': '0',
            'background': 'none',
            'width': this.width + 'px',
            'min-height': this.minHeight + 'px',
            'z-index': 10001,
            'margin-left': -this.width / 2 + 'px'
        }).hide().appendTo('body');

        self.iframeHide.attr({
            'id': this.hideFrameId,
            'name': this.hideFrameId
        }).css({
            'width': '10px',
            'height': '10px',
            'opacity': '0'
        }).appendTo(self.obj);

        $(window).on('resize', function() {
            self.obj.width($(window).width());
            self.obj.height($(document).height());
            var dx = $(window).height() - this.minHeight;
            var half = dx / 2;
            self.iframe.css({
                'margin-top': half + $(window).scrollTop() + 'px'
            });
        });
    };
}
