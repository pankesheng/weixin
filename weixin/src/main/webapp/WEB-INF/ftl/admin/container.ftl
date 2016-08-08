<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
    <link rel="stylesheet" href="${contextPath}/admin/stylesheets/common.css?v=${sversion}" />
	<link rel="stylesheet" href="${contextPath}/admin/stylesheets/index.css?v=${sversion}" />
</head>
<body>
    <iframe class="left-iframe" src="${contextPath}/index/left.do" scrolling="yes" noresize="noresize" frameborder="0"></iframe>
    <div class="main">
        <!-- 没有面包屑时添加 no-place -->
        <div class="content-wrap">
            <iframe class="content" src="${contextPath}/menubutton/tolist.do" name="rightFrame" id="rightFrame" frameborder="0" title="rightFrame" ></iframe>
        </div>
        <!-- 左侧折叠按钮 不需要请删除 -->
        <a class="left-collapse" id="left-collapse" href="javascript:void(0);" title="折叠"></a>
    </div>
    <script type="text/javascript" src="${contextPath}/ext/jquery/jquery-1.8.1.min.js"></script>
    <script>
        /*内容框架对象*/
        var Container = {
            setPlaceHistory: function(html){
                $('#place-list').html(html);
            },
            enablePlace: function(){
                $('.place').show();
            },
            disablePlace: function(){
                $('.place').remove();
                $('.content-wrap').addClass('no-place');
            },
            /*获取地址栏参数*/
            getUrlParams: function(){
                var url = window.location.search;
                var obj = '';
                var json = new Array();

                if(url){
                    url = url.replace('?', '').split('&');

                    for(var i = 0, len = url.length; i < len; i++){
                        obj = url[i].split('=');

                        if(obj[0] != 'n'){
                            json[i] = '"' + obj[0] + '":"' + decodeURI(obj[1]) + '"';
                        }
                    }

                    if(json.length > 0){
                        json = '{' + json.join(',') + '}';
                        return $.parseJSON(json);
                    }
                }
            }
        };
        $(function(){
            /*左侧折叠按钮*/
            if($('#left-collapse').length){
                $('#left-collapse').toggle(function() {
                    leftCollapse.call(this);
                }, function() {
                    leftExpanding.call(this);                   
                });
            }
        });
        /*收缩左侧菜单*/
        function leftCollapse () {
            $('.left').width(0);
            $('.main').css({
                left: '0',
                width: '100%'
            });
            $(this).attr('title', '展开').css({
                left: '0',
                top: '50%',
                backgroundPosition: '-31px -71px'
            });
        }
        /*展开左侧菜单*/
        function leftExpanding () {
            $('.left').width(187);
            $('.main').attr('style', '').css({
                left: '187px'
            });
            $(this).attr('title', '折叠').css({
                left: '0',
                top: '50%',
                backgroundPosition: '-31px -10px'
            });
        }
    </script>
</body>
</html>