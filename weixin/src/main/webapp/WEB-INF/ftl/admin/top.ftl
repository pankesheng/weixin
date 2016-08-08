<!DOCTYPE html>
<html lang="zh-cn">


<head>
	<meta charset="UTF-8">
	<meta name="renderer" content="webkit">
	<meta http-equiv="X-UA-Compatible" content="IE=Edge">
	<title></title>
	<link rel="stylesheet" href="${contextPath}/admin/stylesheets/common.css?v=${sversion}" />
    <link rel="stylesheet" href="${contextPath}/admin/stylesheets/index.css?v=${sversion}" />
</head>

<body style="background-color:transparent;">
	<div class="header clearfix">
		<div class="logo"><#-- <img src='${contextPath}/admin/images/logo.jpg' /> --></div>
		<h1 class="web-title">掌网任务管理系统</h1>
		<div class="icon-bar clearfix" id="iconBar">
			<div class="icon-index" data-title="首页">
				<!-- TODO 不透露实际地址，隐式加载首页 -->
				<a class="pngfix" href="${contextPath}/index/container.do" target="contentFrame"><img src="${contextPath}/admin/images/icon/icon-index.png" alt="首页">
					<p title="首页">首页</p>
				</a>
			</div>
			<div class="icon-list clearfix">
				<ul class="icon-ul clearfix"></ul>
			</div>
			<div class="next-list">
				<a href="javascript:void(0);" class="next-btn" id="next-btn"></a>
				<ul class="dots-list clearfix"></ul>
				<div class="nums-list">
					<span class="cur-page">1</span>
					<span>/</span>
					<span class="total-page">4</span>
				</div>
			</div>
		</div>
		<div class="mini-list clearfix" id="mini-list">
			<!-- TODO 高亮显示选中项 -->
			<ul class="clearfix">
				<li data-title="首页"><a href="${contextPath}/index/container.do" target="contentFrame" class="mini-index">首页</a>
				</li>
			</ul>
			<!-- 点击更多，更改iframe的高度，以便列表可以显示 -->
			<div class="more-list">更多<span class="more-list-arrow"></span>
				<ul class="more">
				</ul>
			</div>

		</div>
	</div>
	<script type="text/javascript" src="${contextPath}/admin/ext/jquery/jquery-1.8.1.min.js"></script>
	<!--[if lt IE 8]>
    <script type="text/javascript" src="${contextPath}/admin/ext/jquery/jquery.pngFix.js"></script>
    <script>
        //修复IE6 PNG
        var fixpng = function(){
            $(document).pngFix();
        };
    </script>
    <![endif]-->
	<script type="text/javascript" src="${contextPath}/admin/javascripts/jquery-zwbam.js"></script>
	<script type="text/javascript">
		$(window).load(function () {
			/*顶部框架暴露对象*/
			Header = {
				//当前模式
				mode: 'normal',
				/*顶部迷你模式*/
				switchingMode: function () {
					if (this.mode === 'normal') {
						//切换为mini模式时重置图标菜单的页数
						var iconList = $("#iconBar").find('.icon-list');
						//重置图标菜单高亮的页数
						var selectedIndex = iconList.find("li a").index(iconList.find("li a.selected")) + 1;
						//切换到的指定页数
						var selectedPageNum = Math.ceil(selectedIndex / iconList.data("nums"));
						//假如在不变动的首页菜单，则页数置为1
						selectedPageNum = selectedPageNum === 0 ? 1 : selectedPageNum;
						//页数切换动画
						iconList.find(".icon-ul").css("marginLeft", '-' + iconList.data("width") * (selectedPageNum - 1) + 'px');
						//缓存页数数据
						iconList.data({
							page: selectedPageNum,
						});
						switchingMiniMode.call(this);
					} else if (this.mode === 'mini') {
						switchingNormalMode.call(this);
					}
				},
				/*根据标题设置图标*/
				setTopMenu: function (title) {
					$.fn.zwbam('setTopMenu', title);
				},

				setContainerUrl: function (url) {
					$.fn.zwbam('setContainerUrl', url);
				},
				/*老方法*/
				getSelectedUrl: function () {
					return $.fn.zwbam('getCurrentSelectedTopMenuUrl');
				}

			};
			//changes 取得当前框架父亲视图区的高度的值
			curAreaHeight = window.parent.$('.top').height();

			//根据链接参数配置窗口显示模式
			var paramobj = $.fn.zwbam('getUrlParams', parent.location.search);
			//减少创建图标按钮时的视觉显示冲突
			if (paramobj.mode && paramobj.mode === "mini") {
				switchingMiniMode();
			} else {
				switchingNormalMode();
			}

			//切换为折叠迷你模式
			function switchingMiniMode() {
				//缩小logo、名称、用户中心
				//隐藏图标应用列表、显示文字应用列表
				$('.logo').addClass('mini-logo').css("visibility", "visible");
				$('.web-title').addClass('mini-title').css("visibility", "visible");
				$('.function-block').addClass('mini').css("visibility", "visible");

				$('.icon-bar').hide();
				$('.mini-list').show();

				Header.mode = 'mini';
				//设置内容区高度
				$(".header").css("height", "36px");
				//设置父级顶部框架
				window.parent.$('.top').height(36);
				window.parent.$('.top').css("zIndex", "1000");

				//设置父级底部框架
				window.parent.$('#container').removeClass('top-iframe-margin');
				window.parent.$('#container').addClass("mini-iframe-margin");

				//设置折叠按钮样式
				window.parent.$('#top-collapse').show().attr('title', '展开').css({
					top: '36px', //CHANGES 原值为36，修正为0
					backgroundPosition: '-7px -29px'
				});

				//取得当前框架的显示高度，让下拉菜单能够正常判断显示器尺寸，进行适应
				curAreaHeight = window.parent.$('.top').height();

				//缩小logo、名称、用户中心
				//隐藏图标应用列表、显示文字应用列表
				$('.logo').addClass('mini-logo').css("visibility", "visible");
				$('.web-title').addClass('mini-title').css("visibility", "visible");
				$('.function-block').addClass('mini').css("visibility", "visible");

				$('.icon-bar').hide();
				$('.mini-list').show();
			}
			//切换为展开正常模式
			function switchingNormalMode() {
				$('.logo').removeClass('mini-logo').css("visibility", "visible");
				$('.web-title').removeClass('mini-title').css("visibility", "visible");
				$('.function-block').removeClass('mini').css("visibility", "visible");

				$('.icon-bar').show();
				$('.mini-list').hide();

				Header.mode = 'normal';
				//changes 设置高度
				$(".header").css("height", "88px");
				window.parent.$('.top').height(88);
				window.parent.$('.top').css("zIndex", "1000");

				//设置父级底部框架
				window.parent.$('#container').removeClass('mini-iframe-margin');
				window.parent.$('#container').addClass("top-iframe-margin")
					//设置折叠按钮样式

				window.parent.$('#top-collapse').show().attr('title', '折叠').css({
					top: '88px',
					backgroundPosition: '-7px -2px'
				});

				//changes 取得当前框架的显示高度
				curAreaHeight = window.parent.$('.top').height();


			}

			//TODO top页面内菜单按钮跳转：跳转并高亮目标按钮
			function _go(url, title) {
				Header.setTopMenu(title);
				parent.frames["contentFrame"].location.href = url;
			}


			//changes 当用户更改浏览器窗口大小时，重新对图片区进行计算，并排列图标
			//初次进入首页时，设置选中的顶部菜单：1.默认首页进入，选中首页，2.由未知链接跳转传入参数选定
			//$('#iconBar').zwbam('initTopMenu', '${contextPath}/index/menutop.ajax?t=<@z.z_now />');


			//右侧用户中心弹出框事件
			$("#action-user-nums").click(function () {
				removeTopList();
				removeTopStyle();
			})

			$('#btn-show-user-list').click(function () {
				if (!$('#user-top-list').is(":visible")) {
					removeTopList();
					removeTopStyle();
					showTopList.apply(this, [$('#user-top-list')]);
					$(this).find(".action-user").css("backgroundPosition", "0 -48px");
					$(this).css("color", "#00fff0");
				} else {
					removeTopList();
					removeTopStyle();
				}
			})
			$('#btn-show-more-list').click(function () {

				if (!$('#user-more-list').is(":visible")) {
					removeTopList();
					removeTopStyle();
					showTopList.apply(this, [$('#user-more-list')]);
					$(this).find(".action-more").css("backgroundPosition", "0 -48px");
					$(this).css("color", "#00fff0");
				} else {
					removeTopList();
					removeTopStyle();
				}
			});

			//FIXED 鼠标从用户中心移出事件，避免下方iframe用户无法点击
			$(".function-block").mouseleave(function () {
				removeTopList();
				removeTopStyle();
			});

			/**
			 * 显示用户中心下拉菜单
			 * @param {Object} $clone 传入要显示的下接列表选择器克隆对象
			 */
			function showTopList($clone) {
				var $this = $(this);
				//note 获得该对象的位置坐标值
				var position = $this.position();
				//note 克隆该对象
				var $clone = $clone.clone();
				//note 生成样式箭头
				var $arrow = $('<div class="top-list-arrow"></div>');
				var $body = $('body');

				//FIXED 将生成的对象附加到指定目标

				$body.find('.top-list-arrow').remove().end().find(".action-block").append("<div class='list-container'></div>").end().find(".list-container").append($arrow).append($clone);


				//FIX 根据下拉菜单的高度自适应设置当前框架父亲视图区的高度的值，再多增加10px，修正下拉菜单阴影显示问题
				window.parent.$('.top').height($clone.outerHeight() + curAreaHeight + 10);
				$clone.css({
					position: 'absolute',
					top: 10,
					//CHANGES 偏移当前父元素的位置
					right: $(".action-block").width() - position.left - $(this).width() - 10,
					width: 100,
					zIndex: 1
				}).show();

				$arrow.css({
					position: 'absolute',
					top: 5,
					right: $(".action-block").width() - position.left - $(this).width() / 2 - 4,
					zIndex: 2
				});

				//changes为弹出框外包框设置尺寸 再多增加10px，修正下拉菜单阴影显示问题
				$(".list-container").css("height", $clone.outerHeight() + $clone.position().top + 10);
			}

			function removeTopList() {
				//changes 去除已克隆的弹出箭头和列表页
				window.parent.$('.top').height(curAreaHeight);
				$('body').find('.list-container').remove();
			}

			function removeTopStyle() {
				//去除高亮
				$("#btn-show-more-list").find(".action-more").css("backgroundPosition", "0 0");
				$("#btn-show-user-list").find(".action-user").css("backgroundPosition", "0 0");
				$("#action-user-nums").find(".action-user-nums").css("backgroundPosition", "0 0");
				$("#btn-show-more-list,#btn-show-user-list,#action-user-nums").css("color", "#fff");
			}
		});
	</script>
</body>

</html>