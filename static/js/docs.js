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
        $("#" + sdk).html($('.api-content ul :first'));


        addIndex = function(ul, idx) {
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

        addIndex($("#" + sdk + " ul :first"), "");

        //API具体页标志当前锚点功能
        if ($('body').scrollspy) {
            $('body').scrollspy({
                target: '#' + sdk
            });
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
        if (code == 13) { //Enter keycode
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
            $.getJSON('http://ss.qbox.me:9900/?query=' + val + '&callback=?', function(data) {
                console.log(data);
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
            });
        }
    };
    // 技术支持 模态窗口
    $('.js-initFeedBack').on('click', function() {
        QiniuFeedBack.show();
        return false;
    });


    //给API页面所有图片的父元素添加一个居中类
    $('.api-content img').each(function() {
        $(this).parent().addClass('center');
    })

    // API页固定侧边栏
    $('.container.api .side-bar').hcSticky({
        bottomEnd: -1,
        top: 0,
        followScroll: false
    });

    // API页侧边栏点击a后添加active样式
    $('.nav a').on('click', function() {
        $(this).parents('.nav').find('a').removeClass('active');
        $(this).addClass('active');
    });

    //调整API页面容器高度，若侧边栏超高，则调整.
    function adjustApiBoxHeight() {
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
                var scrollTop = $(window).scrollTop() - 70;
                var height = $('.panel-box').height();
                var mainHeight = $('.main').height();
                var dHeight = scrollTop + height - mainHeight;
                if (dHeight > 0) {
                    window.scrollTo($(window).scrollLeft(), $(window).scrollTop() - 1);
                    window.scrollTo($(window).scrollLeft(), $(window).scrollTop() + 1);
                }
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
        if (!$(this).children().length > 0) {
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
                } else {
                    $(this).parents('.panel-heading').siblings('.panel-body').show('fast', adjustApiBoxHeight);
                    $(this).addClass('active');
                    $(this).siblings('.off_2').removeClass('off_2').addClass('on_2');
                    if ($(this).siblings('.off_2').length > 0) {
                        $(this).siblings('.off_2').removeClass('off_2').addClass('on_2');
                    } else {
                        $(this).siblings('.off_1').removeClass('off_1').addClass('on_1');
                    }
                }
            }
        }
    });

    //API页面侧边栏---显示当前页的导航
    $('.panel-body a').each(function() {
        var href = $(this).attr('href').toLowerCase();
        if (url === href) {
            $(this).parents('.panel-body').siblings('.panel-heading').click();
            $(this).addClass('active');
            if ($(this).parents('.panel-heading').length > 0) {
                $(this).parents('.panel-heading').siblings('.panel-body').show('fast', adjustApiBoxHeight);
                $(this).siblings('.off_2').removeClass('off_2').addClass('on_2');
                $(this).siblings('.off_1').removeClass('off_1').addClass('on_1');
            } else {
                $(this).parents('.panel-body').show('fast', adjustApiBoxHeight);
                $(this).parents('.panel-body').siblings('.panel-heading').find('.off_2').removeClass('off_2').addClass('on_2');
                $(this).parents('.panel-body').siblings('.panel-heading').find('span:last').addClass('api_down2_sprited');
                $(this).parents('.panel-body').siblings('.panel-heading').find('a').addClass('active');
            }
        }
    });


    // API页高亮代码
    $('pre code').each(function(i, e) {
        hljs.highlightBlock(e);
    });

    // 资源下载页提交社区SDK/插件
    $('.js-add-resource').on('click', function() {
        var title = $.trim($(this).text());
        var type = title === '提交我的插件/工具' ? 'Plugin' : 'SDK';
        DocsAddResource.show(type);
        return false;
    });

    // 资源下载页，社区插件/社区SDK分页插件，暂时未用到 
    // $('.bxslider').bxSlider({
    //     controls: false
    // });





});
