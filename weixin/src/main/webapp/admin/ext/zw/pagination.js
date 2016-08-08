/**
 * @author lisfan
 * @class Pagination
 * @extends jquery-1.8.3
 * @markdown
 * #分页插件
 * 版本 1.0 日期 2015-10-04
 * 
 */
(function ($) {
	"use strict";

	/**
	 * 
	 * @param   {jobject|string}   id     直接传入jquery对象，或者传入id字符串名，id字符串前面需要加'#'号，容错处理，如果不包含#号会自动添加#号
	 * @param   {JSON}   config  配置项
	 * @returns {[[Type]]} [[Description]]
	 */
	var Pagination = function (id, config) {

		
		var $me=$(id);
		//默认配置
		console.log(config)
		var defaults = {
			total: null, //总数未传入时，只显示第一页
			offset: null, //起始位置
			pagingTotal: null, //分页总数
			limit: 10, //默认每页显示个数
			pagenum: 1, //默认起始页数为1，页数由可由起始位置 offset/limit+1
			count: 7, //默认分页显示个数，不能超过pagingTotal，设置为单数最好
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
				console.log(that)
				console.log(this)
			}
		};

		//自定义配置项
		var config = $.extend({}, defaults, config);

		//数据验证器：数据各种验证
		var validator = function () {

			//将得到的字符串转换为数字
			config.total = parseInt(config.total);
			config.offset = parseInt(config.offset);
			config.limit = parseInt(config.limit)
			config.pagenum = parseInt(config.pagenum)
			config.count = parseInt(config.count)

			//1.总数不存在时,直接返回
			if (!config.total) {
				console.log("Error：未传入总数值total，请检查")
				return false;
			}
			console.log("最大数config.total:" + config.total);

			//2.每页显示个数，大于总数时，重置为1
			if (config.limit > config.total) {
				config.limit = 10;
			}
			console.log("起始页config.limit:" + config.limit)

			//得出分页数值-余数向上浮动
			config.pagingTotal = Math.ceil(config.total / config.limit);
			console.log("分页数值config.pagingTotal:" + config.pagingTotal)
			//3.得出分页后的各种处理
			//只有1个分页的时候？
			//少于5个的时候？

			//4.起始页数大于分页数值，重置为1
			if (config.pagenum > config.pagingTotal) {
				config.pagenum = 1;
			}
			console.log("起始位置config.pagenum:" + config.pagenum)

			//5.显示的个数大于分页数值时，重置为5
			if (config.count > config.pagingTotal) {
				config.count = 5;
			}
			console.log("总数config.count:" + config.count)
			//6.offset的值大于total时，重置为0
			if (config.offset > config.total) {
				config.offset = 0;
			}

			//假如存在offset的值，是以offset为基准，无视pagenum的原先值
			//当offset大于等于total时，重置为1

			if (config.offset >= 0 && config.offset < 800) {
				config.pagenum = Math.floor(config.offset / config.limit) + 1;
			} else if (config.offset >= 800) {
				config.offset = 0;
				config.pagenum = Math.floor(config.offset / config.limit) + 1;
			}
			console.log(config.pagenum)
		}

		//结构生成器：生成dom结构
		var generateDom = function () {
			//只有1个分页的时候？
			//少于5个的时候？
			//假设是在第一页(pagenum=1)，则不显示 首页和前页
			//假设在最后一页(pagenum=config.pagingTotal)，则不显示 尾页和后页

			//文章不多时，起始为1，分页数值也为1，
			//文章多时，分页数值，正好在显示个数5个内时
			//文章多时，分页数值，超过显示个数5个时
			//起始页数为首页(pagenum为1)时，不显示‘首页’和‘前页’，count显示后面的数
			//起始页数为尾页(pagenum为config.pagingTotal)时
			//起始页数为在中间值时


			//设置各种页码值，以pagenum为基准
			//为1时，
			var prevNumber = config.pagenum - 1 > 0 ? config.pagenum - 1 : 1;
			var nextNumber = config.pagenum + 1 < config.pagingTotal ? config.pagenum + 1 : config.pagingTotal;

			console.log("前页prevNumber:" + prevNumber)
			console.log("后页nextNumber:" + nextNumber)

			/*var firstUrl = '?total=' + config.total + '&limit=' + config.limit + '&pagenum=1';
			var prevUrl = '?total=' + config.total + '&limit=' + config.limit + '&pagenum=' + prevNumber;
			var nextUrl = '?total=' + config.total + '&limit=' + config.limit + '&pagenum=' + nextNumber;
			var lastUrl = '?total=' + config.total + '&limit=' + config.limit + '&pagenum=' + config.pagingTotal;

			var currentUrl = '?total=' + config.total + '&limit=' + config.limit + '&pagenum=' + config.pagenum;*/

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
				var mainPagePrevNumber = config.pagenum - i;
				if (mainPagePrevNumber > 0) {
					mainPrevFlag++;
					//var mainPagePrevUrl = '?total=' + config.total + '&limit=' + config.limit + '&pagenum=' + mainPagePrevNumber;
					mainPagePrevHtml += '<a data-pagenum="' + mainPagePrevNumber + '" class="num-page" href="javascript:void(0);">' + mainPagePrevNumber + '</a>';
				}
			}
			console.log("mainPrevFlag:" + mainPrevFlag + "-" + mainPagePrevHtml)
			//向后
			for (var i = 1; i <= halfCount; i++) {
				var mainPageNextNumber = config.pagenum + i;
				if (mainPageNextNumber <= config.pagingTotal) {
					mainNextFlag++;
					//前XX页
					//var mainPageNextUrl = '?total=' + config.total + '&limit=' + config.limit + '&pagenum=' + mainPageNextNumber;
					mainPageNextHtml += '<a data-pagenum="' + mainPageNextNumber + '"  class="num-page" href="javascript:void(0);">' + mainPageNextNumber + '</a>';
				}
			}
			console.log("mainNextFlag:" + mainNextFlag + "-" + mainPageNextHtml)

			var mainRemainder = config.count - 1 - mainPrevFlag - mainNextFlag

			console.log("mainRemainder:" + mainRemainder);
			//如果有余数
			if (mainRemainder && config.pagingTotal >= config.count) {

				//前少后加
				if (mainPrevFlag < halfCount) {
					for (var i = 1; i <= mainRemainder; i++) {
						var mainPageNextNumber = config.pagenum + mainNextFlag + i;

						//var mainPageNextUrl = '?total=' + config.total + '&limit=' + config.limit + '&pagenum=' + mainPageNextNumber;
						mainPageNextHtml += '<a data-pagenum="' + mainPageNextNumber + '" class="num-page" href="javascript:void(0);">' + mainPageNextNumber + '</a>';

					}
				} else if (mainNextFlag < halfCount) {
					for (var i = 1; i <= mainRemainder; i++) {
						var mainPagePrevNumber = config.pagenum - mainPrevFlag - i;

						//var mainPagePrevUrl = '?total=' + config.total + '&limit=' + config.limit + '&pagenum=' + mainPagePrevNumber;
						mainPagePrevHtml = '<a data-pagenum="' + mainPagePrevNumber + '" class="num-page" href="javascript:void(0);">' + mainPagePrevNumber + '</a>' + mainPagePrevHtml;

					}
				}
			}

			//生成各页码html代码

			console.log("halfCount:" + halfCount)
			console.log(config.pagenum == 1 || mainPrevFlag < halfCount)
			
			//满足下列要求就不显示：
			//1.只要起始位置是1 
			//2.或者 mainPrevFlag小于halfCount就不显示首页
			//3.或者 config.count>=config.pagingTotal 
			var firstPageHtml = (config.pagenum == 1 || mainPrevFlag < halfCount || config.count >= config.pagingTotal) ? "" : '<a data-pagenum="1" class="num-page first-page" href="javascript:void(0);">' + config.firstPageTitle + '</a>';
			//只要起始位置不是1就显示前页
			var prevPageHtml = (config.pagenum == 1 || config.count >= config.pagingTotal) ? "" : '<a data-pagenum="' + prevNumber + '" class="num-page prev-page" href="javascript:void(0);">' + config.prevPageTitle + '</a>';

			//只要起始位置不是分页最大数就显示后页

			var nextPageHtml = (config.pagenum == config.pagingTotal || config.count >= config.pagingTotal) ? "" : '<a data-pagenum="' + nextNumber + '" class="num-page next-page" href="javascript:void(0);">' + config.nextPageTitle + '</a>';

			var lastPageHtml = (config.pagenum == config.pagingTotal || mainNextFlag < halfCount || config.count >= config.pagingTotal) ? "" : '<a data-pagenum="' + config.pagingTotal + '" class="num-page next-page" href="javascript:void(0);">' + config.lastPageTitle + '</a>';
			var currentPageHtml = '<a data-pagenum="' + config.pagenum + '" class="num-page on" href="javascript:void(0);">' + config.pagenum + '</a>';

			console.log(firstPageHtml)
			console.log(prevPageHtml)
			console.log(nextPageHtml)
			console.log(lastPageHtml)
			console.log(currentPageHtml)

			//生成页数模板
			var pagingtemplete = firstPageHtml + prevPageHtml + mainPagePrevHtml + currentPageHtml + mainPageNextHtml + nextPageHtml + lastPageHtml + '<span class="jump-container">跳到<input type="text" class="jump-page" name="jump-page"  maxlength="' + config.pagingTotal.toString().length + '" value="' + config.pagenum + '" />/&nbsp;' + config.pagingTotal + '页</span>';
			$me.append(pagingtemplete);
		};

		
		

		//事件侦听器
		var addListener = function () {
			//为跳转添加事件
			$(this).find(".jump-page").keypress(function () {
				if (event.keyCode == 13) {
					window.location.href = '?total=' + config.total + '&limit=' + config.limit + '&pagenum=' + $(event.target).val();
				}
			});

			//分页按钮事件，返回limit,offset,pagenum
			$(this).find(".num-page").click(function () {
				this.loadPage($(this).attr("data-pagenum"))
			})
		}

		//初始化
		var init = function () {
			console.log('g')
			validator();
			generateDom();
			//generateData();
			renderer();
			addListener();

			//初始化后，回调函数
			if (config.callback) {
				config.callback(this);
			}
		}()
	};

})(jQuery);