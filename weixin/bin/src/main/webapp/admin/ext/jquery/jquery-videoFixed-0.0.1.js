(function($){
    $.fn.videoFixed = function(){
        var isIE=!!window.ActiveXObject; 
        var isIE6=isIE&&!window.XMLHttpRequest; 
        var isIE8=isIE&&!!document.documentMode; 
        var isIE7=isIE&&!isIE6&&!isIE8; 

        if(isIE6 || isIE7){
            return false;
        }

        var $me = this;
        var width = $me.width();
        var height = $me.height();
        var offset = $me.offset().top + height;
        var originStyle = $me.attr('style');

        $me.prepend('<div class="video-fixed-title">正在播放<span class="close-btn">×</span></div>')
        $(window).bind('scroll', function() {
            if($(document).scrollTop() > offset){
                if(!$me.hasClass('video-fixed')){
                    $me.find('.video-fixed-title').show();
                    $me.addClass('video-fixed').attr('style', '').css({
                        width: '310px',
                        height: '175px'
                    });
                }
            }else{
                if($me.hasClass('video-fixed')){
                    $me.removeClass('video-fixed').attr('style', originStyle);
                    $me.find('.video-fixed-title').hide();
                }
            }
        });
        $me.find('.close-btn').click(function(){
            $me.removeClass('video-fixed').css({
                width: width,
                height: height
            });
            $me.find('.video-fixed-title').remove();
            $(window).unbind('scroll');
        });
    };
    
})(jQuery);