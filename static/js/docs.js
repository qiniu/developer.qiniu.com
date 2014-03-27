/* global hljs */
var DocsAddResource;
var DocsFeedback;

var _IE = (function() {
    var v = 3,
        div = document.createElement('div'),
        all = div.getElementsByTagName('i');
    while (
        div.innerHTML = '<!--[if gt IE ' + v + ']><i></i><![endif]-->',
        all[0]
    ) {
        ++v;
    }
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
    var self = this;
    this.show = function(type) {
        var l = location.href.split('#')[0];
        self.type = type;
        if (self.type) {
            self.iframe.attr('src', self.url + '?type=' + self.type + '#' + l);
            self.iframeHide.attr('src', self.url + '?type=' + self.type + '#' + l);
        } else {
            self.iframe.attr('src', self.url + '#' + l);
            self.iframeHide.attr('src', self.url + '#' + l);
        }
        self.obj.fadeIn().removeClass('hide').show();
        var dx = $(window).height() - self.minHeight;
        var half = dx / 2;
        self.iframe.fadeIn().css({
            'margin-top': half + $(window).scrollTop() + 'px'

        });
        return false;
    };
    this.hide = function() {
        self.obj.fadeOut().addClass('hide');
        self.iframe.fadeOut();
    };
    this.init = function() {
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

$(function() {

    var url = window.location.pathname.toLowerCase();

    if ((url.indexOf("/docs/v6/sdk/") === 0) || (url.indexOf("/docs/v6/tools/") === 0)) {

        //通过js移动文档导行到右边索引边栏
        //first level
        $(".api-content ul :first").attr("class", "panel-list  level-two nav");
        $('.api-content ul :first').children().each(function() {
            //li
            //second level
            $(this).children("ul").each(function() {
                //ul
                $(this).attr("class", "panel-list level-three nav");
            });
        });
        var href = url;
        var shref = href.split("/");
        var sdk = shref[shref.length - 1];
        sdk = sdk.substring(0, sdk.length - 5);
        var addIndex = function(ul, idx) {
            $(ul).children("li").each(function(i) {
                i = i + 1;
                var ii;
                if (idx) {
                    ii = idx + "." + i++;
                } else {
                    ii = i++;
                }
                var a = $(this).children("a");
                var nhref = a.attr("href");
                nhref = nhref.substring(1);
                var nhtml = $('a[name="' + nhref + '"]').parent().next();
                nhtml.html(ii + "." + a.html());
                a.html(ii + ". " + a.html());
                $(this).children("ul").each(function(o, oo) {
                    addIndex(oo, ii);
                });
            });
        };

        if (sdk !== '') {
            $("#" + sdk).html($('.api-content ul :first'));
            addIndex($("#" + sdk + " ul :first"), "");
            //API具体页标志当前锚点功能
            //Todo 暂时隐藏,后续需要自己整合
            // if ($('body').scrollspy) {
            //     $('body').scrollspy({
            //         target: '#' + sdk
            //     });
            // }
        }
    }

    //顶部栏样式
    $('.nav-home a').each(function() {
        var path = url.split('/')[1];
        var href = $(this).attr('href').toLowerCase();
        var pathname = href.split('/')[1];
        if (pathname === path) {
            $(this).addClass('active').siblings().removeClass('active');
        }
        if (path === 'brand') {
            $('.download').addClass('active').siblings().removeClass('active');
        }
    });

    //顶部搜索框
    $('#search').on('focus', function() {
        $(this).attr('placeholder', '');
        $(this).next().removeClass('global_search_default_sprited').addClass('global_search_active_sprited');
    }).on('blur', function() {
        $(this).attr('placeholder', '全站搜索');
        $(this).next().addClass('global_search_default_sprited').removeClass('global_search_active_sprited');
    }).on('keypress', function(e) {
        var code = e.keyCode || e.which;
        if (code === 13) { //Enter keycode
            //Do something
            var val = encodeURIComponent($(this).val());
            search(val);
        }
    });
    $('.search span').on('click', function() {
        var val = encodeURIComponent($(this).siblings('input').val());
        search(val);
    });

    function search(val) {
        if (val !== '' && val !== undefined) {
            $('#myModal').modal();
            $('#myModal').find('p').html('正在搜索中，请耐心等待。');
            $('#myModal').find('.result-line').html('');
            $.getJSON('http://183.60.175.38:9988?query=' + val + '&callback=?', function(data) {
                if (data.items.length > 0) {
                    var markup = '';
                    for (var i = 0, len = data.items.length; i < len; i++) {
                        var tData = data.items[i];
                        markup += '<div class="ops-line ">' +
                            ' <h5><a href=' + tData.url + ' target="_blank">' + tData.title + '</a></h5>' +
                            ' <div class="url">' +
                            '<a  href=' + tData.url + ' target="_blank">' + tData.display_url + '</a>' +
                            '</div>' +
                            '<div class="content">' + tData.description + '</div > ' +
                            ' </div> ';
                    }
                    $('#myModal').find('p').html('为您找到了如下结果，感谢您对七牛的支持。');
                    $('#myModal').find('.result-line').html('').append(markup);
                } else {
                    $('#myModal').find('p').html('感谢您对七牛的支持。');
                    $('#myModal').find('.result-line').html('很抱歉，没有找到相关结果。');
                }
            }).fail(function() {
                $('#myModal').find('p').html('搜索失败，请稍后重试。');
            });
        }
    }



    //给API页面所有图片的父元素添加一个居中类
    $('.api-content img').each(function() {
        $(this).parent().addClass('center');
    });

    //todo 用模块化思维整合line 232 至 line 517
    //todo ie8 下侧边栏滚动，再滚动主内容，侧边栏的top又为0了

    // API页侧边栏
    var $sidebar = $('.container.fixed-sibebar .side-bar');
    var $sidebarParent = $sidebar.parent();
    if ($sidebar.length > 0) {

        var sidebarY = $sidebar.offset().top;
        var lastSidebarHeight = $sidebar.height() + 2;
        var footerY = $('footer').offset().top - parseInt($('footer').css('margin-top'), 10);
        var lastScrollTop = $(window).scrollTop();
        $(window).on('scroll', function(e) {
            var scrollY = $(window).scrollTop();
            var sidebarHeight = $sidebar.height() + 2;
            var top = getSidebarTop();
            var top2;
            if (!$sidebar.hasClass('scrolling')) {
                if (scrollY > sidebarY) {
                    if (scrollY + top + sidebarHeight < footerY) {
                        if (lastScrollTop - scrollY < 0) {
                            top = top < 0 ? top : 0;
                        } else {
                            top2 = footerY - sidebarHeight - scrollY;
                            top = top2 <= 0 ? top2 : 0;
                        }
                        $sidebar.css({
                            position: 'fixed',
                            top: top
                        });
                        $sidebarParent.css({
                            height: $sidebar.height()
                        });
                    } else {
                        top2 = footerY - sidebarHeight - scrollY;
                        top = top > top2 ? top : top2;
                        if (scrollY - sidebarHeight + top > 0) {
                            top = top2;
                        }
                        $sidebar.css({
                            position: 'fixed',
                            top: top
                        });
                    }
                    if (isTaller()) {
                        $sidebar.on('mouseenter.scrolling', function() {
                            var scrollY = $(window).scrollTop();
                            // var sidebarHeight = $sidebar.height() + 2;
                            if (scrollY > sidebarY) {
                                $(this).addClass('scrolling');

                            } else {
                                $(this).removeClass('scrolling');
                            }

                        }).on('mouseleave.scrolling', function() {
                            $(this).removeClass('scrolling');
                        });
                    }
                } else {
                    unBindScroll();
                    $sidebar.css({
                        position: '',
                        top: ''
                    });
                }
                if ($sidebar.hasClass('in')) {
                    if (isTaller()) {
                        $sidebar.trigger('mouseenter.scrolling');
                    } else {
                        unBindScroll();
                    }
                }
            }
            if (scrollY + sidebarHeight + top > footerY) {
                $sidebar.css({
                    position: 'fixed',
                    top: footerY - scrollY - sidebarHeight
                });
            }
            lastScrollTop = scrollY;
            lastSidebarHeight = sidebarHeight;
        });
        $sidebar.on('mouseenter', function() {
            $(this).addClass('in');
        }).on('mouseleave', function() {
            $(this).removeClass('in').removeClass('scrolling');
        });

        $('body').on({
            'mousewheel': function(e) {
                if ($sidebar.hasClass('scrolling')) {
                    var direction = e.originalEvent.wheelDelta > 0 ? 'up' : 'down';
                    var top = getSidebarTop();
                    var scrollY = $(window).scrollTop();
                    var sidebarHeight = $sidebar.height() + 2;
                    if ((scrollY + top + sidebarHeight < footerY) || isTaller()) {
                        changeSidebarPos(direction);
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }
            },
            'DOMMouseScroll': function(e) {
                if ($sidebar.hasClass('scrolling')) {
                    var direction = -e.originalEvent.detail > 0 ? 'up' : 'down';
                    changeSidebarPos(direction);
                    e.preventDefault();
                    e.stopPropagation();
                }
            },
        });
    }

    var isTaller = function() {
        return $sidebar.height() + getSidebarTop() > $(window).height();
    };
    var unBindScroll = function() {
        $sidebar.off('mouseenter.scrolling').off('mouseleave.scrolling');
    };

    var changeSidebarPos = function(direction) {
        var top = getSidebarTop();
        var scrollY = $(window).scrollTop();
        // var sidebarHeight = $sidebar.height() + 2;
        if (direction === 'up') {
            if (scrollY + $(window).height() < footerY) {
                top = top + 40;
                top = top >= 0 ? 0 : top;
                $sidebar.css({
                    top: top + 'px'
                });
                return true;
            } else {
                return false;
            }

        } else {
            if (isTaller()) {
                top = top - 40;
                $sidebar.css({
                    top: top + 'px'
                });
                return true;
            } else {
                return false;
            }
        }
    };

    var getSidebarTop = function() {
        return parseInt($sidebar.css('top'), 10) || 0;
    };

    // API页侧边栏点击a后添加active样式
    $('.nav a').on('click', function() {
        $(this).parents('.nav').find('a').removeClass('active');
        $(this).addClass('active');
    });

    //调整API页面容器高度，若侧边栏超高，则调整.
    function adjustApiBoxHeight() {
        var flag = false;
        if ($sidebar.hasClass('scrolling')) {
            $sidebar.removeClass('scrolling');
            flag = true;
        }
        $(window).trigger('scroll');
        if (flag) {
            $sidebar.addClass('scrolling');
        }

        var sidebarHeight = $('.side-bar.pull-left').height();
        var contentHeight = $('.api-content').height();
        if (sidebarHeight > contentHeight) {
            var height = sidebarHeight - 1;
            $('.api-content').height(height);
        }
    }
    adjustApiBoxHeight();

    //API页面侧边栏操作 --  一级导航点击
    $('.panel-default > .panel-heading').on('click', function() {
        var $next = $(this).next('.panel-body');
        var $siblings = $(this).parents('.panel').siblings('.panel');
        if ($next.is(':visible')) {
            $next.hide('fast', adjustApiBoxHeight);
            $(this).find('span.api_down').removeClass('api_down').addClass('api_default');
            $(this).find('a').removeClass('active');
        } else {
            $next.show('fast', function() {
                // var scrollTop = $(window).scrollTop() - 70;
                // var height = $('.panel-box').height();
                // var mainHeight = $('.main').height();
                // var dHeight = scrollTop + height - mainHeight;
                adjustApiBoxHeight();
            });
            $(this).find('span.api_default').removeClass('api_default').addClass('api_down');
            $(this).find('a').addClass('active');
            $siblings.children('.panel-heading').find('.icon').removeClass('api_down').addClass('api_default');
            $siblings.children('.panel-heading').find('a').removeClass('active');
            $siblings.children('.panel-body').hide('fast', adjustApiBoxHeight);
        }
        return false;
    });

    $('.panel-status').each(function() {
        if ($(this).children().length === 0) {
            $(this).siblings('.panel-heading').find('.off_2').removeClass('off_2').addClass('off_1');
        }
    });

    $('.panel-body .link').on('click', function() {
        var params = url.split('/');
        var path = params[2];
        var fileName = params[params.length - 1];
        var href = $(this).attr('href').toLowerCase();
        if (url !== '/docs/v6/') {
            //api index page jump direct
            if (href.indexOf(path) >= 0 && href.indexOf(fileName) >= 0) {
                var $panelBody = $(this).parents('.panel-heading').siblings('.panel-body');
                if ($panelBody.is(':visible')) {
                    $panelBody.hide('fast', adjustApiBoxHeight);
                    $(this).removeClass('active');
                    if ($(this).siblings('.on_2').length > 0) {
                        $(this).siblings('.on_2').removeClass('on_2').addClass('off_2');
                    } else {
                        $(this).siblings('.on_1').removeClass('on_1').addClass('off_1');
                    }
                    $(this).parents('.panel-heading').find('.menu_down').hide();
                } else {
                    $(this).parents('.panel-heading').siblings('.panel-body').show(adjustApiBoxHeight);
                    $(this).addClass('active');
                    $(this).siblings('.off_2').removeClass('off_2').addClass('on_2');
                    if ($(this).siblings('.off_2').length > 0) {
                        $(this).siblings('.off_2').removeClass('off_2').addClass('on_2');
                    } else {
                        $(this).siblings('.off_1').removeClass('off_1').addClass('on_1');
                    }
                    $(this).parents('.panel-heading').find('.menu_down').show();
                }
            }
        }
    });

    //API页面侧边栏---显示当前页的导航
    $('.panel-body a').each(function() {
        var href = $(this).attr('href').toLowerCase();
        if (url === href) {
            $(this).addClass('active');
            var $panelBody = $(this).parents('.panel-body');
            var $panelHeading = $(this).parents('.panel-heading');

            $panelBody.siblings('.panel-heading').find('span.api_default').removeClass('api_default').addClass('api_down');
            $panelBody.siblings('.panel-heading').find('a').addClass('active');

            if ($panelHeading.length > 0) {
                $(this).siblings('.off_2').removeClass('off_2').addClass('on_2');
                $(this).siblings('.off_1').removeClass('off_1').addClass('on_1');
            } else {
                $panelBody.siblings('.panel-heading').find('.off_2').removeClass('off_2').addClass('on_2');
                $panelBody.siblings('.panel-heading').find('a').addClass('active');
            }
        }
    });
    // API页高亮代码
    $('pre code').each(function(i, e) {
        hljs.highlightBlock(e);
    });

    $('h5.panel-title').on('click', function() {
        var href = $(this).find('a').attr('href').toLowerCase();
        if (url === href) {
            return false;
        }
    });
    $('.menu_down').on('click', function(e) {
        $(this).siblings('a').trigger('click');
        e.stopPropagation();
    });
    // 资源下载页提交社区SDK/插件

    DocsAddResource = new Zendesk({
        'width': 740,
        'minHeight': 866,
        'frameId': 'AddDocsResource',
        'hideFrameId': 'AddDocsResourceHide',
        'url': 'https://portal.qiniu.com/zendesk/docs',
    });
    if (window.location.hash === '#hide_docs') {
        window.parent.DocsAddResource.hide();
    } else {
        DocsAddResource.init();
    }
    $('.js-add-resource').on('click', function() {
        var title = $.trim($(this).text());
        var type = title === '提交我的插件/工具' ? 'Plugin' : 'SDK';
        DocsAddResource.show(type);
        return false;
    });

    //技术支持模态窗口

    DocsFeedback = new Zendesk({
        'width': 740,
        'minHeight': 740,
        'frameId': 'feedbackFrame',
        'hideFrameId': 'feedbackFrameHide',
        'url': 'https://portal.qiniu.com/zendesk/docs-feedback',
    });
    if (window.location.hash === '#hide_feedback') {
        window.parent.DocsFeedback.hide();
    } else {
        DocsFeedback.init();
    }
    $('.js-zendesk').on('click', function() {
        DocsFeedback.show();
        return false;
    });

    // 资源下载页，社区插件/社区SDK分页插件，暂时未用到
    // $('.bxslider').bxSlider({
    //     controls: false
    // });

    // 更新日志页面JS，暂时未用到
    // $('.changelog .side-bar a').on('click', function() {
    //     var cClass = $(this).attr('class');
    //     console.log(cClass);
    //     $('.changelog .main .cell').each(function() {
    //         if ($(this).data('log') === cClass) {
    //             $(this).show();
    //         } else {
    //             $(this).hide();
    //         };
    //     });
    //     return false;
    // });
    // $('.changelog .side-bar a').eq(0).trigger('click');

    // 返回顶部JS，暂时未用到
    // $.scrollUp({
    //     scrollName: 'scrollUp',
    //     topDistance: '500',
    //     topSpeed: 300,
    //     animation: 'fade',
    //     animationInSpeed: 200,
    //     animationOutSpeed: 200,
    //     scrollText: '',
    //     activeOverlay: false
    // });

    $('.container.docs .main .sdk ul li:last-child').hide();
    //hack in api=index.html

});
