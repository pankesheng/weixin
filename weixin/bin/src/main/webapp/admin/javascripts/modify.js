$(function() {
    $('form').submit(function(event) {
        event.preventDefault();
        var $me = $(this);

        if ($me.check()) {
            var post = $(this).serialize();

            $.post($me.find('#post-url').val(), post, function(data, textStatus, xhr) {
                if (data.s == 1) {
                    window.parent.parent.tip('操作成功', 'success');
                    if (window.parent.grid) {
                        window.parent.grid.reload();
                    }
                    if (window.parent.layer) {
                        window.parent.layer.closeAll();
                    }
                    if ($('#return-url').length) {
                        window.location.href = $('#return-url').val();
                    }
                } else {
                    window.parent.parent.tip(data.d, 'danger');
                }
            });
       }
    });
    $('.return-btn').bind('click', function(){
        if($(this).attr('data-href').length){
            window.location.href = $(this).attr('data-href');
        }
    });
});
