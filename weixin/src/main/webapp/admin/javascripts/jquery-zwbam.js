/**
 * @author Ezios
 * @extends jquery-1.8.3
 * @version 0.2.9
 * @date 2015-3-4
 * @describe
 *     后台管理模块通用库
 *     1.侧边菜单生成器
 *     2.顶部菜单生成器
 *
 * @example
 *     1.菜单生成器
 *     $('.left-menu-list').zwbam('initMenu', data);
 *     data为json对象数组或后台API接口
 *     {
            "d": [{
                "name": "基本设置",
                "url": "#",
                "childs": [{
                    "name": "栏目管理",
                    "url": "#",
                    "childs": [{
                        "name": "用户组管理",
                        "url": "/usergroup/tolist.do"
                    }, {
                        "name": "用户管理",
                        "url": "/user/tolist.do"
                    }]
                }, {
                    "name": "用户组管理",
                    "url": "#",
                    "childs": [{
                        "name": "用户组管理",
                        "url": "/usergroup/tolist.do"
                    }]
                }]
            }]
        }
 */
(function ($) {
	//方法集
	var _methods = {
		//初始化
		init: function () {
			//console.log('call init()');
		},
		/**
		 * 设置顶部菜单选中状态，传合法参数，并且有规定值，否则默认选中首页按钮并跳转至首页
		 * @param {string} itemName 顶部应用中文名称或英文名称//TODO 考虑换成英文名称
		 */
		setTopMenu: function (itemName) {
			//changes 
			//存在 
			//var $aim = $('.header').find('[data-id=' + itemName + ']');
			var $aim = $('.header').find('[data-title=' + itemName + ']');

			if (typeof itemName === 'string' && $aim.length) {
				//存在
				$('.header').find('a.selected').removeClass('selected');
				$aim.find('a').addClass('selected');
				var iconList = $('#iconBar .icon-list');

				//知道分页数、及自已所在的位置页数，不出现动画
				//var selectedIndex = iconList.find("li").index(iconList.find("li[data-id=" + itemName + "]")) + 1;
				var selectedIndex = iconList.find("li").index(iconList.find("li[data-title=" + itemName + "]")) + 1;
				var nums = iconList.data('nums');
				var selectedPageNum = Math.ceil(selectedIndex / nums);
				//页数切换动画
				iconList.find(".icon-ul").css("marginLeft", '-' + iconList.width() * (selectedPageNum - 1) + 'px');

				//缓存页数数据：当前页
				iconList.data({
					page: selectedPageNum
				});

				if (iconList.data('pageNums') <= 4) {
					$('#iconBar .dots-list li.selected').removeClass('selected');
					$('#iconBar .dots-list li').eq(selectedPageNum - 1).addClass('selected');
				} else {
					$('#iconBar .cur-page').text(selectedPageNum);
				}
			} else {
				$('.header').find('a.selected').removeClass('selected');
				//$('.header').find('[data-id=index] a').addClass('selected');
				$('.header').find('[data-title]:first a').addClass('selected');
			}
		},

		getCurrentSelectedTopMenuUrl: function () {
			return $('.icon-bar').find('a.selected').attr("href");
		},

		//设置container-iframe框架页面地址
		setContainerUrl: function (url) {
			//TODO 链接存在且正确跳转，否则跳转到首页
			if (!url) {
				url = $('.icon-bar').find('a.selected').attr("href");
			}
			parent.frames["contentFrame"].location.href = url;
		},
		//changes 得到浏览器的URL地址传入的参数 格式：?jump=true&title=应用
		getUrlParams: function (searchString) {
			var params = {};

			var search = window.location.search;
			if (searchString) {
				search = searchString;
			}
			if (search && search.indexOf("?") > -1) {
				search = search.substring(search.indexOf("?") + 1, search.length);
				var tmps = search.split("&");
				for (var i = 0; i < tmps.length; i++) {
					var pair = tmps[i];
					var ttmps = pair.split("=");
					//可能会存在多值项，也可能不存在值，即ttmps<2
					//假如是转义过的字符串，则解码
					if (ttmps.length >= 2) {
						for (var j = 0; j < ttmps.length; j = j + 2) {
							if (ttmps[j + 1].indexOf('%') == 0) {
								params[ttmps[j]] = decodeURIComponent(ttmps[j + 1]);
							} else {
								params[ttmps[j]] = ttmps[j + 1];
							}
						}

					}
				}
			}
			return params;
		},
		//左侧菜单生成器
		initMenu: function (option) {
			//目标dom
			var $doms = $(this);
			//生成器
			var maker = function (item) {
				//一级菜单dom
				var $firstNodeDom = $('<div class="left-menu-first-node"><div class="first-children"></div></div>');
				//二级菜单dom
				var $secondNodeDom = $('<div class="left-menu-second-node"><div class="second-title"><i class="icon"></i></div></div>');
				//三级菜单dom
				var $thirdNodeDom = $('<ul class="menu-son"></ul>');

				//子项存在多少
				if (item.show == false || ($.type(item.show) == "function" && item.show() == false)) {
					return;
				}

				if (item.url === '#') {
					$firstNodeDom.prepend('<div class="first-title"><div class="text">' + item.name + '</div></div>');
				} else {
					$firstNodeDom.prepend('<a href="' + item.url + '" class="first-title text navigation" data-id="' + item.id + '" target="rightFrame"><div class="text">' + item.name + '</div></a>');
				}

				if (!$.isEmptyObject(item.childs)) {
					var secondNode = item.childs;


					for (var i = 0; i < secondNode.length; i++) {
						var $secondNodeDomClone = $secondNodeDom.clone();

						//默认为true自动显示，返回false时隐藏
						//判断url地址是否存在，如果存在，则子项生成
						//如果url不存在，且子项无，则不生成父菜单


						//子项存在多少
						if (secondNode[i].show == false || ($.type(secondNode[i].show) == "function" && secondNode[i].show() == false)) {
							continue;
						}

						//链接地址
						if (secondNode[i].url !== '#') {
							$secondNodeDomClone.find('.second-title').append('<a href="' + secondNode[i].url + '" class="text navigation" data-id="' + secondNode[i].id + '" target="rightFrame">' + secondNode[i].name + '</a>');
						} else {
							$secondNodeDomClone.find('.second-title').append('<span class="text">' + secondNode[i].name + '</span>');
						}

						var $thirdNodeDomClone = $thirdNodeDom.clone();
						//三级菜单
						if (!$.isEmptyObject(secondNode[i].childs)) {

							var thirdNode = secondNode[i].childs;

							//默认为true自动显示，返回false时隐藏

							//判断show的返回值

							for (var j = 0; j < thirdNode.length; j++) {

								if (thirdNode[j].show == false || ($.type(thirdNode[j].show) == "function" && thirdNode[j].show() == false)) {
									continue;
								}

								var $liclone = $('<li><i class="li-icon"></i><a href="' + thirdNode[j].url + '" class="navigation" data-id="' + thirdNode[j].id + '" target="rightFrame">' + thirdNode[j].name + '</a></li>');
								$thirdNodeDomClone.append($liclone);

							};

							$secondNodeDomClone.append($thirdNodeDomClone);

							if (secondNode[i].open === true) {
								$thirdNodeDomClone.show();
								$thirdNodeDomClone.prev().addClass("selected")
							}

						} else {
							$secondNodeDomClone.find(".icon").attr("class", "li-icon");
						}


						//判断三级是否有一项显示，如果有一项显示则不隐藏父级
						if ($.isEmptyObject(secondNode[i].childs) || ($thirdNodeDomClone.children().length > 0 || secondNode[i].url !== '#')) {
							//附加二级
							$firstNodeDom.find('.first-children').append($secondNodeDomClone);
						}

					};
				} else {
					$firstNodeDom.find('.first-children').remove();
				}

				if (item.open === true) {
					$firstNodeDom.find('.first-children').show();
					$firstNodeDom.find('.first-title').addClass("selected");
				}

				if ($.isEmptyObject(item.childs) || ($firstNodeDom.find('.first-children').children().length > 0 || item.url !== '#')) {
					$doms.append($firstNodeDom);

				}


			};
			//注册器
			var register = function ($aim, json) {
				var scroller = '';

				//快捷菜单点击
				$('.left-menu-top .navigation').bind('click', function (event) {
					$('.left-menu .active').removeClass('active');
					$(this).addClass('active');
				});
				//第一级菜单点击
				$aim.find('.first-title').bind('click', function (event) {

					var $children = $(this).nextAll('.first-children');

					/*$aim.find('.first-children:visible').slideUp();*/
					if ($children.is(':visible')) {
						$children.slideUp();
						$(this).removeClass("selected");
					} else {
						$children.slideDown();
						$(this).addClass("selected");

					}
				});
				//第二级菜单点击
				//假如没有第三级菜单
				$aim.find('.second-title').bind('click', function (event) {
					var $children = $(this).parent().find('.menu-son');

					/*$aim.find('.menu-son:visible').slideUp();*/
					//$('.left-menu .active').removeClass('active');
					if ($children.length > 0) {
						$aim.find('.second-title').removeClass('active');

						if ($children.is(':visible')) {
							$children.slideUp();
							$(this).removeClass('selected');
						} else {
							$children.slideDown();
							$(this).addClass('selected');
						}
					} else {
						$aim.find('.second-title').removeClass('active');
						$(this).addClass('active');
					}

				}).hover(function () {
					$(this).addClass('hover');
				}, function () {
					$aim.find('.second-title').removeClass('hover');
				});

				//第三级菜单点击
				$aim.find('.menu-son li').bind('click', function (event) {
					$('.left-menu .active').removeClass('active');
					$(this).addClass('active');
				}).hover(function () {
					$(this).addClass('hover');
				}, function () {
					$aim.find('.menu-son li').removeClass('hover');
				});
			};
			var init = function (json) {
				if (json.d && !$.isEmptyObject(json.d)) {
					json = $.extend({
						enablePlace: true
					}, json);

					$doms.html('');

					for (var i = 0; i < json.d.length; i++) {
						maker(json.d[i]);
					};

					register($doms, json);

					if (typeof option.onCompleted === 'function') {
						option.onCompleted();
					}
				} else {
					alert('菜单数据为空');
				}
			};
			//API接口
			if (option && typeof option.data === 'string') {
				$.ajax({
					url: option.data,
					cache: false,
					type: 'GET',
					dataType: 'json'
				}).success(function (json, textStatus) {
					if (!$.isEmptyObject(json)) {
						init(json);
					} else {
						alert('获取菜单数据失败');
					}
				});
				//数据对象
			} else if (option && typeof option.data === 'object') {
				if (!$.isEmptyObject(option.data)) {
					init(option.data);
				} else {
					alert('请检查菜单配置项');
				}
			}
		},
		//顶部菜单生成器
		initTopMenu: function (option) {
			var $me = this;
			var data = {};
			var pageData = [];
			var iconList = $me.find('.icon-list');
			//图标列表生成器
			var maker = function (data) {
				var list = $me.find('.icon-ul');

				list.html('');

				for (var i = 0; i < data.length; i++) {
					//list.append('<li data-id="' + data[i].topId + '"><a class="pngfix" href="' + data[i].url + '" target="contentFrame"><img src="' + data[i].imgUrl + '" alt="' + data[i].title + '" /><p title="' + data[i].title + '">' + data[i].title + '</p></a></li>');
					list.append('<li data-title="' + data[i].title + '"><a class="pngfix" href="' + data[i].url + '" target="contentFrame"><img src="' + data[i].imgUrl + '" alt="' + data[i].title + '" /><p title="' + data[i].title + '">' + data[i].title + '</p></a></li>');
					//生成纯文字列表
					$('#mini-list ul:first').append('<li data-title="' + data[i].title + '"><a href="' + data[i].url + '" target="contentFrame">' + data[i].title + '</a></li>');
					//$('#mini-list ul:first').append('<li data-id="' + data[i].title + '"><a href="' + data[i].url + '" target="contentFrame">' + data[i].title + '</a></li>');
				};


				//缓存页数数据-当前页为1
				iconList.data({
					page: 1
				});
			};
			//调整显示区域可容纳的图标数
			var changeList = function () {
				//图标可视区域宽度 顶部最上级div .header内部宽度 减去 logo区域宽度  网站标题区域宽度 用户中心区域宽度 减去 首页按钮所占区域宽度
				var width = $('.header').width() - $('.logo').outerWidth() - $('.web-title').outerWidth() - $('.icon-index').outerWidth() - $('.function-block').outerWidth();
				//取得图标可视区域中可显示的个数量（changes前提：图标尺寸不变，如经常变动则改为动态获取），减去1个，用来放置页数切换图标
				var nums = parseInt(width / 78) - 1;
				//分页数
				var pageNums = 0;
				//计数分页数，若有页数，新增1页放置
				var returnRemainder = function (dividend, divisor) {
					return (dividend / divisor) % parseInt(dividend / divisor) === 0 ? parseInt(dividend / divisor) : parseInt(dividend / divisor) + 1;
				};

				//个数小于0强制为1
				nums = nums === 0 ? 1 : nums;
				//个数超过7个强制为7个图标
				nums = nums > 7 ? 7 : nums;
				//取得分页数量
				pageNums = returnRemainder(data.length, nums);

				//设置图标区的宽度
				iconList.width(nums * 78);

				//判断当前高亮图标的位置，切换至高亮位置
				//取得高亮位置
				var selectedIndex = iconList.find("li a").index(iconList.find("li a.selected")) + 1;
				//切换到的指定页数
				var selectedPageNum = Math.ceil(selectedIndex / nums);
				//假如在不变动的首页菜单，则页数置为1
				selectedPageNum = selectedPageNum === 0 ? 1 : selectedPageNum;

				//页数切换动画
				iconList.find(".icon-ul").css("marginLeft", '-' + iconList.width() * (selectedPageNum - 1) + 'px');

				//缓存页数数据
				iconList.data({
					pageNums: pageNums,
					page: selectedPageNum,
					nums: nums,
					width: 78
				});
				//初始化第一页
				//loadPage(1);

				//当数据条数超过一页限制时显示下一页按钮
				if (data.length > nums) {
					//显示下一页按钮
					$me.find('.next-list').show();
					//如果分页数小于5条，显示圆点按钮
					if (pageNums <= 4) {
						//changes 
						$me.find('.nums-list').hide();
						$me.find('.dots-list').children().remove();
						for (var i = 0; i < pageNums; i++) {
							$('.dots-list').append('<li data-nums="' + (i + 1) + '"><a href="javascript:void(0);" title="第' + (i + 1) + '页"></a></li>');
						}
						$me.find('.dots-list').show();
						changeDot();
					} else {
						$me.find('.dots-list').hide();
						$me.find('.cur-page').text(selectedPageNum);
						$me.find('.total-page').text(pageNums);
						$me.find('.nums-list').show();
					}
				} else {
					$me.find('.next-list').hide();
				}

			};
			//changes 调整显示区域可容纳的文字导航
			var changeTextList = function () {
				//文字可视区域宽度  .header内部宽度 减去 logo区域宽度  网站标题区域宽度 用户中心区域宽度  更多列表（为更多列表直接设定一个宽度，不做自适应） 区域宽度
				var width = $('.header').width() - $('.mini-logo').outerWidth() - $('.mini-title').outerWidth() - $('.mini').outerWidth() - 100;


				//释放更多里的列表
				var moreList = $(".mini-list .more-list");
				moreList.find("li").appendTo(".mini-list ul");
				moreList.find("ul").empty();
				moreList.css("visibility", "hidden");

				//计算可供显示列表宽度
				var miniList = $(".mini-list ul:first li");
				var listWidth = 0;

				var showflag = miniList.length;
				for (var i = 0; i < miniList.length; i++) {
					listWidth += miniList.eq(i).outerWidth();
					if (listWidth > width) {
						showflag = i;
						break;
					}
				}

				//得出显示个数，为溢出可视视图的列表增加更多
				if (showflag < miniList.length) {
					moreList.css("visibility", "visible");
					for (var j = showflag; j < miniList.length; j++) {
						moreList.find("ul").append(miniList.eq(j));
					}
				}
			};

			var loadPage = function (nums) {
				nums = parseInt(nums);

				//假如传入的页数大于实际最大页数时，容错处理显示第1页
				if (nums > iconList.data('pageNums')) {
					nums = 1;
				}

				//页数切换动画
				$me.find('.icon-ul').animate({
					marginLeft: '-' + iconList.width() * (nums - 1) + 'px'
				}, 'fast');

				//缓存页数数据：当前页
				iconList.data({
					page: nums
				});

				if (iconList.data('pageNums') <= 4) {
					changeDot();
				} else {
					$me.find('.cur-page').text(nums);
				}
			};
			var changeDot = function () {
				$me.find('.dots-list li.selected').removeClass('selected');
				$me.find('.dots-list li').eq(iconList.data('page') - 1).addClass('selected');
			};
			var register = function () {
				//注册窗口大小变化事件
				$(window).resize(function () {
					changeList();
					changeTextList();
				});
				//下一页按钮点击事件
				$me.find('#next-btn').click(function () {
					loadPage(iconList.data('page') + 1);
				});
				//图标按钮和文字按钮同时点击事件
				$(".icon-bar .icon-index a,.icon-bar .icon-list a,.mini-list a").click(function () {

					$(".icon-bar .icon-index a.selected,.icon-bar .icon-list a.selected,.mini-list a.selected").removeClass("selected");
					//$(".icon-bar .icon-index a,.icon-bar .icon-list a,.mini-list a").parent().filter("[data-id='" + $(this).parent().attr("data-id") + "']").find("a").addClass('selected');
					$(".icon-bar .icon-index a,.icon-bar .icon-list a,.mini-list a").parent().filter("[data-title='" + $(this).parent().attr("data-title") + "']").find("a").addClass('selected');
				});

				//下一页圆点点按钮点击事件
				$me.find('.dots-list li').click(function () {
					loadPage($(this).attr('data-nums'));
				});

				$(".mini-list").delegate(".more-list", "mouseenter", function () {
					//框架增加高度
					window.parent.$('.top').height($(this).outerHeight());
					$(this).find(".more").css("visibility", "visible");
				}).delegate(".more-list", "mouseleave", function () {
					window.parent.$('.top').height(curAreaHeight);
					$(this).find(".more").css("visibility", "hidden");
				})
			};
			//初始化图标列表
			var init = function () {
				//生成图标列表
				maker(data);
				//修复IE6 PNG
				if (typeof fixpng !== 'undefined') {
					fixpng();
				}
				//显示图标区域图标列表展现方式
				changeList();
				changeTextList();
				//注册图标列表事件
				register();

				//changes 如果有回调函数，则执行
				if (typeof option.callback === 'function') {
					option.callback();
				}
			};

			//API接口
			if (typeof option === 'string') {
				$.ajax({
					url: option,
					cache: false,
					type: 'GET',
					dataType: 'json'
				}).success(function (json, textStatus) {
					if (!$.isEmptyObject(json)) {
						data = json.d;
						init();
					} else {
						alert('获取顶部菜单数据失败');
					}
				});
				//数据对象
			} else if (typeof option === 'object') {
				if (!$.isEmptyObject(option)) {
					data = option.d;
					init();

				} else {
					alert('请检查菜单配置项');
				}
			}
		}
	};

	$.fn.zwbam = function (method) {
		if (_methods[method]) { //调用_methods中的方法
			return _methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) { //当参数是对象时 初始化
			return _methods.init.apply(this, arguments);
		} else { //未找到参数指明的方法
			$.error('错误' + method + ' 该方法并未在zwbam中定义');
		}
	};
})(jQuery);