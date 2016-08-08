/**
 * @author lisfan
 * @extends jquery-1.8.3
 * @version 1.0
 * @date 2015-11-05
 * @describe 常用小工具
 *     1.获取URL地址参数，返回参数分割对象
 *     2.文本域<textarea> 实时字数统计
 *     3.独立分页插件
 */
(function ($) {
	//通用工具方法集
	var _methods = {

		/**
		 * 取得浏览器URL地址传入的参数，格式：?jump=true&title=应用
		 * @param   {String} searchString 参数格式
		 * @returns {object} 返回分隔开的参数属性/值对
		 */
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

		/**
		 * 文本框输入字数实时统计
		 * 1.可不传入参数，通过在表单元素上增加属性[maxlength=100]启用字数统计
		 * 2.也可直接传入最大值参数给函数
		 * 3.优先使用自定义maxlength参数
		 * @param {number} maxlength 最大数值参数，数值类型和文本类型均可
		 * @example 
		 * 一、单个
		 *   $("textarea").tools("wordCount",可直接传入数值);
		 * 二、多个
		 *     $("textarea").each(function () {
		 * 			$(this).tools("wordCount")
		 * 		});
		 */
		wordCount: function (maxlength) {

			//参数校验
			if (maxlength && parseInt(maxlength) > 0) {
				maxlength = parseInt(maxlength);
				$(this).attr("maxlength", maxlength)
			} else {
				maxlength = $(this).attr("maxlength");
			}

			//能知道限制时才出现以下，否则不创建统计数区域
			if (maxlength || maxlength > 0) {
				//创建统计数对象
				var countHtml = $("<span>0/" + maxlength + "</span>").insertAfter($(this));
				//将目标框之后的所有内容包裹，
				$(this).nextAll().wrapAll("<div style='position:relative;display:inline-block;vertical-align:top;margin-left:4px;height:" + $(this).outerHeight() + "px;'></div>");
				countHtml.css({
					position: "absolute",
					left: 0,
					bottom: 0,
					color: "#d9534f"
				});

				//判断字数,在键盘按下之时，内容输出之前
				$(this).keyup(function () {
					var nowLength = $(this).val().length;
					//显示到P里
					countHtml.text(nowLength + "/" + maxlength);
				});
			}

		},
		/**
		 * 分页插件，通过url传入参数方法分页，可自定义配置参数
		 * @version 1.0;
		 * @author lisfan
		 * @param {Object} pagingParams required 配置对象参数，参数中必须传入一个总数
		 */
		paginationUrl: function (pagingParams) {

			//默认配置
			//console.log(pagingParams)
			var defaults = {
				total: null, //总数未传入时，只显示第一页
				limit: 10, //每页显示个数
				offset: 1, //起始页数为1
				count: 7, //中间显示个数，不能超过pagingTotal，设置为单数最好
				//TODO 未针对小屏幕尺寸，更改样式分页显示，因此注意conut的数值，显示的个数
				firstPageTitle: "首页", //默认按钮名称
				prevPageTitle: "前页",
				nextPageTitle: "后页",
				lastPageTitle: "尾页",
				styles: { //默认颜色
					buttonBgColor: "#f5f5f5", //页数按钮的颜色
					buttonBorderColor: "#ccc",
					buttonTextColor: "#333",
					buttonFontSize: "12px",
					buttonPadding: "0 0",
					currentBgColor: "#fff", //当前页数按钮的颜色
					currentBorderColor: "#366dd1",
					currentTextColor: "#366dd1",
					currentFontSize: "12px",
					currentPadding: "0 0",
					pageBgColor: "#366dd1", //上下页按钮的颜色
					pageBorderColor: "#366dd1",
					pageTextColor: "#fff",
					pageFontSize: "12px",
					pagePadding: "0 10px"
				},
				//回调函数，回调函数 ,that表示调用该方法的对象,this表示本对象，
				//可控制样式，如按钮颜色等
				callback: function (that) {
					//console.log(that)
					//console.log(this)
				}

			}

			//覆盖自定义配置项
			var config = $.extend({}, defaults, pagingParams);

			//将得到的字符串转换为数字
			config.total = parseInt(config.total)
			config.limit = parseInt(config.limit)
			config.offset = parseInt(config.offset)
			config.count = parseInt(config.count)

			//各种验证
			//1.总数不存在时,直接返回
			if (!config.total) {
				//console.log("Error：未传入总数值total，请检查")
				return false;
			}
			//console.log("最大数config.total:" + config.total);

			//2.每页显示个数，大于总数时，重置为1
			if (config.limit > config.total) {
				config.limit = 10;
			}
			//console.log("起始页config.limit:" + config.limit)

			//得出分页数值-余数向上浮动
			var pagingTotal = Math.ceil(config.total / config.limit);
			//console.log("分页数值pagingTotal:" + pagingTotal)
			//3.得出分页后的各种处理
			//只有1个分页的时候？
			//少于5个的时候？

			//4.起始页数大于分页数值，重置为1
			if (config.offset > pagingTotal) {
				config.offset = 1;
			}
			//console.log("起始位置config.offset:" + config.offset)

			//5.显示的个数大于分页数值时，重置为5
			if (config.count > pagingTotal) {
				config.count = 5;
			}
			//console.log("总数config.count:" + config.count)


			//只有1个分页的时候？
			//少于5个的时候？
			//假设是在第一页(offset=1)，则不显示 首页和前页
			//假设在最后一页(offset=pagingTotal)，则不显示 尾页和后页

			//文章不多时，起始为1，分页数值也为1，
			//文章多时，分页数值，正好在显示个数5个内时
			//文章多时，分页数值，超过显示个数5个时
			//起始页数为首页(offset为1)时，不显示‘首页’和‘前页’，count显示后面的数
			//起始页数为尾页(offset为pagingTotal)时
			//起始页数为在中间值时


			//设置各种页码值，以offset为基准
			//为1时，
			var prevNumber = config.offset - 1 > 0 ? config.offset - 1 : 1;
			var nextNumber = config.offset + 1 < pagingTotal ? config.offset + 1 : pagingTotal;

			//console.log("前页prevNumber:" + prevNumber)
			//console.log("后页nextNumber:" + nextNumber)

			var firstUrl = '?total=' + config.total + '&limit=' + config.limit + '&offset=1';
			var prevUrl = '?total=' + config.total + '&limit=' + config.limit + '&offset=' + prevNumber;
			var nextUrl = '?total=' + config.total + '&limit=' + config.limit + '&offset=' + nextNumber;
			var lastUrl = '?total=' + config.total + '&limit=' + config.limit + '&offset=' + pagingTotal;

			var currentUrl = '?total=' + config.total + '&limit=' + config.limit + '&offset=' + config.offset;

			//console.log("首页" + firstUrl)
			//console.log("前页" + prevUrl)
			//console.log("后页" + nextUrl)
			//console.log("尾页" + lastUrl)
			//console.log("当前页" + currentUrl)

			//主体索引页：如果前面没有数值，则显示后几个，如果前面有，则置于中间，如果是末尾则显示前几个
			//主体索引标记
			var mainPrevFlag = 0;
			var mainNextFlag = 0;
			var mainRemainder = 0;
			var halfCount = Math.floor(config.count / 2);
			var mainPagePrevHtml = '';
			var mainPageNextHtml = '';

			//向前计算
			for (var i = halfCount; i > 0; i--) {
				var mainPagePrevNumber = config.offset - i;
				if (mainPagePrevNumber > 0) {
					mainPrevFlag++;
					var mainPagePrevUrl = '?total=' + config.total + '&limit=' + config.limit + '&offset=' + mainPagePrevNumber;
					mainPagePrevHtml += '<a class="num-page" href="' + mainPagePrevUrl + '">' + mainPagePrevNumber + '</a>';
				}
			}
			//console.log("mainPrevFlag:" + mainPrevFlag + "-" + mainPagePrevHtml)
			//向后
			for (var i = 1; i <= halfCount; i++) {
				var mainPageNextNumber = config.offset + i;
				if (mainPageNextNumber <= pagingTotal) {
					mainNextFlag++;
					//前XX页
					var mainPageNextUrl = '?total=' + config.total + '&limit=' + config.limit + '&offset=' + mainPageNextNumber;
					mainPageNextHtml += '<a class="num-page" href="' + mainPageNextUrl + '">' + mainPageNextNumber + '</a>';
				}
			}
			//console.log("mainNextFlag:" + mainNextFlag + "-" + mainPageNextHtml)

			var mainRemainder = config.count - 1 - mainPrevFlag - mainNextFlag

			//console.log("mainRemainder:" + mainRemainder);
			//如果有余数
			if (mainRemainder && pagingTotal >= config.count) {

				//前少后加
				if (mainPrevFlag < halfCount) {
					for (var i = 1; i <= mainRemainder; i++) {
						var mainPageNextNumber = config.offset + mainNextFlag + i;

						var mainPageNextUrl = '?total=' + config.total + '&limit=' + config.limit + '&offset=' + mainPageNextNumber;
						mainPageNextHtml += '<a class="num-page" href="' + mainPageNextUrl + '">' + mainPageNextNumber + '</a>';

					}
				} else if (mainNextFlag < halfCount) {
					for (var i = 1; i <= mainRemainder; i++) {
						var mainPagePrevNumber = config.offset - mainPrevFlag - i;

						var mainPagePrevUrl = '?total=' + config.total + '&limit=' + config.limit + '&offset=' + mainPagePrevNumber;
						mainPagePrevHtml = '<a class="num-page" href="' + mainPagePrevUrl + '">' + mainPagePrevNumber + '</a>' + mainPagePrevHtml;

					}
				}
			}

			//生成各页码html代码

			//console.log("halfCount:" + halfCount)
			//console.log(config.offset == 1 || mainPrevFlag < halfCount)
			//满足下列要求就不显示：
			//1.只要起始位置是1 
			//2.或者 mainPrevFlag小于halfCount就不显示首页
			//3.或者 config.count>=pagingTotal 
			var firstPageHtml = (config.offset == 1 || mainPrevFlag < halfCount || config.count >= pagingTotal) ? "" : '<a class="num-page first-page" href="' + firstUrl + '">' + config.firstPageTitle + '</a>';
			//只要起始位置不是1就显示前页
			var prevPageHtml = (config.offset == 1 || config.count >= pagingTotal) ? "" : '<a class="num-page prev-page" href="' + prevUrl + '">' + config.prevPageTitle + '</a>';

			//只要起始位置不是分页最大数就显示后页

			var nextPageHtml = (config.offset == pagingTotal || config.count >= pagingTotal) ? "" : '<a class="num-page next-page" href="' + nextUrl + '">' + config.nextPageTitle + '</a>';

			var lastPageHtml = (config.offset == pagingTotal || mainNextFlag < halfCount || config.count >= pagingTotal) ? "" : '<a class="num-page next-page" href="' + lastUrl + '">' + config.lastPageTitle + '</a>';
			var currentPageHtml = '<a class="num-page on" href="' + currentUrl + '">' + config.offset + '</a>';

			//console.log(firstPageHtml)
			//console.log(prevPageHtml)
			//console.log(nextPageHtml)
			//console.log(lastPageHtml)
			//console.log(currentPageHtml)

			//生成页数模板
			var pagingtemplete = firstPageHtml + prevPageHtml + mainPagePrevHtml + currentPageHtml + mainPageNextHtml + nextPageHtml + lastPageHtml + '<span class="jump-container">跳到<input type="text" class="jump-page" name="jump-page"  maxlength="' + pagingTotal.toString().length + '" value="' + config.offset + '" />/&nbsp;' + pagingTotal + '页</span>'

			$(this).append(pagingtemplete);
			//附加DOM

			//设置样式
			var Button = $(this).find(".num-page").not(".first-page,.last-page,.next-page,.prev-page");
			Button.css({
				"backgroundColor": config.styles.buttonBgColor,
				"borderColor": config.styles.buttonBorderColor,
				"color": config.styles.buttonTextColor,
				"fontSize": config.styles.buttonFontSize,
				"padding": config.styles.buttonPadding,
			});

			var pageButton = $(this).find(".first-page,.last-page,.next-page,.prev-page");
			pageButton.css({
				"backgroundColor": config.styles.pageBgColor,
				"borderColor": config.styles.pageBorderColor,
				"color": config.styles.pageTextColor,
				"fontSize": config.styles.pageFontSize,
				"padding": config.styles.pagePadding,
			});
			var currentOn = $(this).find(".on");
			currentOn.css({
				"backgroundColor": config.styles.currentBgColor,
				"borderColor": config.styles.currentBorderColor,
				"color": config.styles.currentTextColor,
				"fontSize": config.styles.currentFontSize,
				"padding": config.styles.currentPadding,
			});

			//为跳转添加事件
			$(this).find(".jump-page").keypress(function () {
				if (event.keyCode == 13) {
					window.location.href = '?total=' + config.total + '&limit=' + config.limit + '&offset=' + $(event.target).val();
				}
			});

			//回调函数
			if (config.callback) {
				config.callback(this);
			}
		},

		/**
		 * 分页插件，通过AJAX方式传入参数方法分页，可自定义配置参数
		 * @version 1.0;
		 * @author lisfan
		 * @param {Object} pagingParams required 配置对象参数，参数中必须传入一个总数
		 */
		paginationAJAX: function (pagingParams) {

			
		}

	};

	$.fn.tools = function (method) {
		if (_methods[method]) { //调用_methods中的方法
			return _methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else { //未找到参数指明的方法
			$.error('错误' + method + ' 该方法不存在');
		}
	};
})(jQuery);