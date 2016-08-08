<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title></title>
	<link rel="stylesheet" href="${contextPath}/admin/stylesheets/common.css?v=${sversion}" />
	<link rel="stylesheet" href="${contextPath}/admin/stylesheets/index.css?v=${sversion}" />
</head>
<body>
    <div class="left-menu">
        <div class="left-menu-title">${(login_info.realname)!}</div>
        <div class="left-menu-list">
        </div>
    </div>
    <script type="text/javascript" src="${contextPath}/ext/jquery/jquery-1.8.1.min.js"></script>
    <script type="text/javascript" src="${contextPath}/admin/ext/jquery/jquery.nicescroll.min.js"></script>
    <!--[if lt IE 8]>
    <script type="text/javascript" src="${contextPath}/ext/DD_belatedPNG/DD_belatedPNG.js"></script>
    <script>
        DD_belatedPNG.fix('.first-icon, .right-arrow, background, background');
    </script>
    <![endif]-->
    <script type="text/javascript" src="${contextPath}/admin/javascripts/jquery-zwbam.js?v=${sversion}"></script>
    <script>
    	//add 新增，通过url参数初始化，mode显示默认的折叠模式,?mode=mini&title=智课&jump=true&go=good
        $(function(){
        	//滚动条初始化
			$('.left-menu').niceScroll({
				cursorcolor: '#7db7fb',
				cursorwidth: '6px',
				cursorborderradius: 2,
				autohidemode: true,
				background: '#d0d0d0',
				cursoropacitymin: 1,
				cursorborder: 'none',
				horizrailenabled: false
			});
            /*菜单生成
			 * $('.left-menu-list').zwbam('initMenu', 第二个参数)
			 * 第二个参数可以为 json对象 或 菜单json请求地址
			 */
			$('.left-menu-list').zwbam('initMenu', {
				//加载完毕后执行
				onCompleted: function () {

					//根据链接参数，设置左侧菜单高亮，且右侧框架跳转
					var paramobj = $.fn.zwbam('getUrlParams', parent.parent.location.search);
					if (paramobj.go) {
						var $a = $('.left-menu').find('a[data-id="' + paramobj.go + '"]');

						if ($a.length) {
							$a.trigger('click');
							window.parent.frames['rightFrame'].location.href = $a.attr('href');
							//展现左侧菜单到指定菜单项
							$a.parents(".menu-son").show().prev().addClass("selected").parents(".first-children").show().prev().addClass("selected");
						}
					}
				},
                data: '${contextPath}/index/menu.ajax?t=<@z.z_now />' 
            });
        });
    </script>
</body>
</html>