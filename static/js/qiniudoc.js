// Init sidebar
$(function() {
    if ($('body.content') && window.location) {

        var reg = /\/\/[^\/]+(\/.+)/g,
            docUrl = reg.exec(window.location.toString())
            if (docUrl) {
                var cleanDocUrl = docUrl[1].split('#')[0]
                var Urls = cleanDocUrl.split('/')
                first = Urls[1]
                last = Urls[Urls.length - 1]
                if (docUrl) {
                    $("#accordion2 .accordion-group .accordion-body .accordion-inner a").each(function() {
                        var url = $(this).attr('href').toString()
                        if (url.indexOf(first) == 1 && url.indexOf(last) >= 0) {
                            $(this).parent('li').addClass('disable')
                        }
                    })
                }
            }
    }
    $.scrollUp({
        scrollName: 'scrollUp',
        topDistance: '500',
        topSpeed: 300,
        animation: 'fade',
        animationInSpeed: 200,
        animationOutSpeed: 200,
        scrollText: '',
        activeOverlay: false
    });
});
