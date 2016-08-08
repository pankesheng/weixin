/**
 * @class Pagination
 * @version 0.1.0
 * @author lisfan QQ@448182355 GIT@lisfan 
 * @createDate 14/12/2015
 * @requires jquery-1.11.3
 * @name 分页插件
 * 
 * ## 更新
 * - 2016.1.20
 * 		- 根据LUIController1.1重构并拓展实例化方法
 */
"use strict";

var Pagination = function (selector, setting, callback) {
	var filterArgs = _filterArguments(arguments, [["string", "plainobject", "jqobject"], ["plainobject", "string", "array"], "function"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cnew Pagination(selector, setting, callback)";
		log(errorText, "color:#f00");
		return false;
	}

	selector = filterArgs[0];
	setting = filterArgs[1];
	callback = filterArgs[2];

	var me = this;
	me._type = "pagination";
	me._version = "0.1.0";
	//弹出框扩展配置初始化
	me.config = {
		_isUserDefined: setting && (setting._isUserDefined === undefined || setting._isUserDefined === true) ? true : false,
		async: {},
		store: {
			total: 0, //从查询到的内容要回传值
			curPagingNum: 1, //当前所在页数,默认第一页
		},
		view: {
			nodeClass: "node paging-num",
			enabledFixedNavigater: true, //显示固定首页/尾页导航页码
			enabledPagingLimit: true, //显示每页显示个数
			enabledPagingJump: true, //显示页码跳转
			enabledPagingInfo: true, //显示页码信息
			pagingSize: null, //分页数,me.config.store.total / me.config.view.limit;
			showPagingSize: 5, //面板显示的页码数量，默认显示5个页码，偶数码时多显示的码取后页码
			offset: null, //当前页码乘以每页限制数,(me.config.store.curPagingNum - 1) * me.config.view.limit
			showPagingHalfCount: 0, //以当前页页码为基准，前后应该显示几个页码
			showPagingPrevCount: 0, //以当前页页码为基准，前面已经显示了几个页码
			showPagingNextCount: 0, //以当前页页码为基准，后面已经显示了几个页码
			unShowPagingRemainderCount: 0, //剩下的未显示的页码数量：分页总数-showPagingPrevCount-showPagingNextCount
			limit: 10, //每页显示10条，默认10条
			limitArray: [10, 20, 50, 100], //限制选项列表的值
			firstPagingName: "首页", //默认按钮名称
			prevPagingName: "上一页",
			nextPagingName: "下一页",
			lastPagingName: "尾页",
			nodeFormater: function (nodeData, nodeIndex) {
				return '<span data-pagingNum="' + nodeData.pagingNum + '">' + nodeData.name + '</span>';
			},
		},

		callback: {
			//配置参数计算
			configCallback: function (config) {
				//通过计算这些，得出data数据

				//计算分页总数
				config.view.pagingSize = Math.ceil(config.store.total / config.view.limit) || 1;

				//验证容错
				//起始页数大于分页数时，置为最后页
				config.store.curPagingNum = config.store.curPagingNum > config.view.pagingSize ? config.view.pagingSize : config.store.curPagingNum;

				//计算当前位置
				config.view.offset = (config.store.curPagingNum - 1) * config.view.limit

				//以当前页页码为基准计算，前后应该显示几个页码
				config.view.showPagingHalfCount = Math.floor((config.view.showPagingSize - 1) / 2);
				//重置以下数据
				config.view.showPagingPrevCount = 0;
				config.view.showPagingNextCount = 0;
				config.view.unShowPagingRemainderCount = 0;
				//根据显示的页码数，页码数
				//data数据页码没有自定义生成时，根据其他参数生成，如果有data数据则按store参数生成页码等数据
				//假如要显示的页码数量大于分页出的数量，那么就直接显示出数据，不用一个个判断
				if (config.view.showPagingSize >= config.view.pagingSize) {
					config.store.data = (function () {
						var dataArray = [];

						for (var i = 1; i <= config.view.pagingSize; i++) {
							dataArray[i] = {
								//id随机生成
								"name": i,
								"pagingNum": i,
							};
							if (i == config.view.curPagingNum) {
								dataArray[i].state = "selected";
							}

						}
						return dataArray;
					})();
				} else {
					config.store.data = (function () {
						var dataArray = [];
						//将当前页面放入数组
						dataArray.push({
							//id随机生成
							"name": config.store.curPagingNum,
							"pagingNum": config.store.curPagingNum,
							"state": "selected"
						});

						//显示5页，总页数只有6页
						//5除2，商数为2，当前页需要大于2时，才显示前2页，同时显示后2页
						//6除3，商数为2，都显示在前1个

						//当前在第1页，则显示1，2，3，4，5
						//当前在第2页，则显示1，2，3，4，5
						//当前在第3页，则显示1，2，3，4，5
						//当前在第4页，则显示2，3，4，5，6
						//当前在第5页，则显示3，4，5，6，后2页小于实际分页数，则从前面补全第2页

						//向前计算页码
						/*
						for (var i = showPagingHalfCount; i > 0; i--) {
						*/

						for (var i = 1; i <= config.view.showPagingHalfCount; i++) {
							var prevpagingNum = parseInt(config.store.curPagingNum) - i;
							//上一页不是第一页
							if (prevpagingNum >= 1) {
								dataArray.unshift({
									"name": prevpagingNum,
									"pagingNum": prevpagingNum
								});
								config.view.showPagingPrevCount++;
							}
						}
						//向后计算页码
						for (var i = 1; i <= config.view.showPagingHalfCount; i++) {
							var nextpagingNum = parseInt(config.store.curPagingNum) + i;
							//下一页不是最后一页
							if (nextpagingNum <= config.view.pagingSize) {
								dataArray.push({
									"name": nextpagingNum,
									"pagingNum": nextpagingNum
								});
								config.view.showPagingNextCount++;
							}
						}
						//未显示页码的剩余数量=要显示的分页数-1（排除当前的1页）-已显示上面页码数量-已显示下面页码数量
						config.view.unShowPagingRemainderCount = config.view.showPagingSize - 1 - config.view.showPagingPrevCount - config.view.showPagingNextCount;

						//如果有余数并且分页总数大于要显示的分页数量
						if (config.view.unShowPagingRemainderCount && config.view.pagingSize >= config.view.showPagingSize) {

							//判断是哪边少了，如果前面少了，则后面加，如果后面少了就前面加
							if (config.view.showPagingPrevCount < config.view.showPagingHalfCount) {
								for (var i = 1; i <= config.view.unShowPagingRemainderCount; i++) {
									config.view.showPagingNextCount++
										var nextpagingNum = parseInt(config.store.curPagingNum) + config.view.showPagingNextCount;				
								
									dataArray.push({
										"name": nextpagingNum,
										"pagingNum": nextpagingNum
									});
								}
							} else if (config.view.showPagingNextCount < config.view.showPagingHalfCount) {

								for (var i = 1; i <= config.view.unShowPagingRemainderCount; i++) {
									config.view.showPagingPrevCount++
										var prevpagingNum = parseInt(config.store.curPagingNum) - config.view.showPagingPrevCount;
									dataArray.unshift({
										"name": prevpagingNum,
										"pagingNum": prevpagingNum
									});
								}
							}
						}
						//假如分页数是偶数的，显示页码会差一位，并且页数数据中长度还未达到显示的页码数量
						//先考虑从后面补位，前面如果碰壁，则前面补位
						if (config.view.showPagingSize % 2 == 0 && dataArray.length != config.view.showPagingSize) {
							//偶数
							var nextpagingNum = parseInt(config.store.curPagingNum) + config.view.showPagingNextCount + 1;
							if (nextpagingNum <= config.view.pagingSize) {
								dataArray.push({
									"name": nextpagingNum,
									"pagingNum": nextpagingNum
								});
							} else {
								var prevpagingNum = parseInt(config.store.curPagingNum) - config.view.showPagingPrevCount - 1;
								dataArray.unshift({
									"name": prevpagingNum,
									"pagingNum": prevpagingNum
								});
							}
						}
						return dataArray
					})();
				}
			},
			loadCallback: function ($addNode, pagingO) {
				//以当前页为依据，得到上下页码
				var prevpagingNum = parseInt(pagingO.config.store.curPagingNum) - 1 > 0 ? parseInt(pagingO.config.store.curPagingNum) - 1 : 1;
				var nextpagingNum = parseInt(pagingO.config.store.curPagingNum) + 1 < parseInt(pagingO.config.view.pagingSize) ? parseInt(pagingO.config.store.curPagingNum) + 1 : parseInt(pagingO.config.view.pagingSize);
				
				//add 当前要显示页码数量大于分页数时，不出现上下页，首尾页
				//del 分页数大于1页时，显示更多的内容信息
				if (pagingO.config.view.pagingSize > pagingO.config.view.showPagingSize) {
					//上一页不显示：当前页大于第一页
					//下一页不显示：当前页小于最后页
					if (pagingO.config.store.curPagingNum > 1) {
						var $prevPaging = pagingO.addNode({
								name: pagingO.config.view.prevPagingName,
								pagingNum: prevpagingNum
							})
							//删除掉无用的数据项
						$prevPaging.addClass("prev-paging");
						pagingO.$content.prepend($prevPaging)
					} else {
						var $prevPaging = pagingO.addNode({
								name: pagingO.config.view.prevPagingName,
								pagingNum: prevpagingNum,
								state: "disabled"
							})
							//删除掉无用的数据项
						$prevPaging.addClass("prev-paging");
						pagingO.$content.prepend($prevPaging);
					}

					if (pagingO.config.store.curPagingNum < pagingO.config.view.pagingSize) {
						var $nextPaging = pagingO.addNode({
								name: pagingO.config.view.nextPagingName,
								pagingNum: nextpagingNum
							})
							//删除掉无用的数据项
						$nextPaging.addClass("next-paging");
						pagingO.$content.append($nextPaging);
					} else {

						var $nextPaging = pagingO.addNode({
								name: pagingO.config.view.nextPagingName,
								pagingNum: nextpagingNum,
								state: "disabled"
							})
							//删除掉无用的数据项
						$nextPaging.addClass("next-paging");
						pagingO.$content.append($nextPaging);
					}

					//是否显示固定导航页码
					if (pagingO.config.view.enabledFixedNavigater) {

						//del 首页不显示：当前页在第一页，或分页数小于等于要显示的分页数，或已显示的前页数少于该显示的数，或当前页减去已显示的前页正好是第1页时
						//首页不显示：当前页在第一页，或分页数小于等于要显示的分页数，或已显示的前页数少于该显示的数，或当前页减去已显示的前页正好是第1页时
						//尾页不显示：当前页在最后页，或分页数小于等于要显示的分页数，或已显示的后页数少于该显示的数，或当前页加上已显示的后页正好是最后页时，或如果要显示的页码数是偶数时，当前页加上已显示的后页再加上1正好是最后页
						//	if (!(pagingO.config.store.curPagingNum == 1 || pagingO.config.view.showPagingPrevCount < pagingO.config.view.showPagingHalfCount || pagingO.config.store.curPagingNum - pagingO.config.view.showPagingPrevCount == 1 || pagingO.config.view.showPagingSize >= pagingO.config.view.pagingSize)) {

						if (!(pagingO.config.store.curPagingNum == 1)) {
							var $firstPaging = pagingO.addNode({
									name: pagingO.config.view.firstPagingName,
									pagingNum: 1
								})
								//删除掉无用的数据项
							$firstPaging.addClass("first-paging");
							pagingO.$content.prepend($firstPaging);
						} else {
							var $firstPaging = pagingO.addNode({
									name: pagingO.config.view.firstPagingName,
									pagingNum: 1,
									state: "disabled"
								})
								//删除掉无用的数据项
							$firstPaging.addClass("first-paging");
							pagingO.$content.prepend($firstPaging);
						}

						//if (!(pagingO.config.store.curPagingNum == pagingO.config.view.pagingSize || pagingO.config.view.showPagingNextCount < pagingO.config.view.showPagingHalfCount || pagingO.config.store.curPagingNum + pagingO.config.view.showPagingNextCount == pagingO.config.view.pagingSize || (pagingO.config.store.curPagingNum + pagingO.config.view.showPagingNextCount + 1 == pagingO.config.view.pagingSize && pagingO.config.view.showPagingSize % 2 == 0) || pagingO.config.view.showPagingSize >= pagingO.config.view.pagingSize)) {
						if (!(pagingO.config.store.curPagingNum == pagingO.config.view.pagingSize)) {
							var $lastPaging = pagingO.addNode({
									name: pagingO.config.view.lastPagingName,
									pagingNum: pagingO.config.view.pagingSize
								})
								//删除掉无用的数据项
							$lastPaging.addClass("last-paging");
							pagingO.$content.append($lastPaging);
						} else {
							var $lastPaging = pagingO.addNode({
									name: pagingO.config.view.lastPagingName,
									pagingNum: pagingO.config.view.pagingSize,
									state: "disabled"
								})
								//删除掉无用的数据项
							$lastPaging.addClass("last-paging");
							pagingO.$content.append($lastPaging);
						}
					}
					//显示页码跳转
					if (pagingO.config.view.enabledPagingJump) {
						var pagingJumpHtml = '<span class="paging-jump">跳到&nbsp;&nbsp;<select class="jump" name="pagingJump" id="pagingJump">';
						for (var i = 1; i <= pagingO.config.view.pagingSize; i++) {
							if (i == pagingO.config.store.curPagingNum) {
								pagingJumpHtml += '<option value="' + i + '" selected>' + i + '</option>'
							} else {
								pagingJumpHtml += '<option value="' + i + '">' + i + '</option>'
							}
						}
						pagingJumpHtml += '<select>&nbsp;&nbsp;页</span>';
						pagingO.$content.append(pagingJumpHtml);
					}
				}

				//显示每页显示数量限制数
				if (pagingO.config.view.enabledPagingLimit) {
					var pagingLimitHtml = '<span class="paging-limit">每页&nbsp;&nbsp;<select class="limit" name="pagingLimit" id="pagingLimit">';
					for (var i = 0; i < pagingO.config.view.limitArray.length; i++) {
						if (pagingO.config.view.limitArray[i] == pagingO.config.view.limit) {
							pagingLimitHtml += '<option value="' + pagingO.config.view.limitArray[i] + '" selected>' + pagingO.config.view.limitArray[i] + '</option>'
						} else {
							pagingLimitHtml += '<option value="' + pagingO.config.view.limitArray[i] + '">' + pagingO.config.view.limitArray[i] + '</option>'
						}
					}
					pagingLimitHtml += '<select>&nbsp;&nbsp;条</span>';
					pagingO.$content.prepend(pagingLimitHtml);
				}

				//显示页码信息
				if (pagingO.config.view.enabledPagingInfo) {
					//将页码主体包裹起来
					pagingO.$content.wrapInner('<div class="paging-container"/>')
					var pagingInfoHtml = '<div class="paging-info">当前 <em>' + pagingO.config.store.curPagingNum + '</em> / <em>' + pagingO.config.view.pagingSize + '</em> 页， 共 <em>' + pagingO.config.store.total + '</em> 条记录</div>';
					pagingO.$content.append(pagingInfoHtml);
				}
				pagingO.$content.undelegate(".paging-limit .limit", "change.changePaging");
				//为每页限制条数绑定事件
				pagingO.$content.delegate(".paging-limit .limit", "change.changePaging", function () {

					if (me.config.callback.limitChange && $.type(me.config.callback.limitChange) == "function") {
						me.config.callback.limitChange($(this).val(), me);
					}
				})

				pagingO.$content.undelegate(".paging-jump .jump", "change.changePaging");
				//为跳到指定页绑定事件
				pagingO.$content.delegate(".paging-jump .jump", "change.changePaging", function () {
					if (me.config.callback.jumpChange && $.type(me.config.callback.jumpChange) == "function") {
						me.config.callback.jumpChange($(this).val(), me);
					}
				})

			},

			nodeClick: function ($currentNode, currentData, pagingO) {
				//重载页码数据
				//更改为当前页码
				if (currentData.state != "disabled") {
					pagingO.config.store.curPagingNum = currentData.pagingNum;
					pagingO.load(pagingO.config);
				}
			},
			limitChange: function (limitSize, pagingO) {
				pagingO.config.view.limit = limitSize;
				pagingO.load(pagingO.config);
			},
			jumpChange: function (jumpNum, pagingO) {
				pagingO.config.store.curPagingNum = jumpNum;
				pagingO.load(pagingO.config);
			}
		}
	};

	if ($.type(selector) == "string") {
		me.config.selector = selector;
	} else if (!$.isPlainObject(selector)) {
		me.config.selector = selector.selector;
	} else {
		//覆盖参数
		setting = selector;
	}

	//根据setting类型配置参数
	if (setting && $.type(setting) == "string") {
		//如果是url连接，则开启async
		me.config.async.enabled = true;
		me.config.async.url = setting;
	} else if (setting && $.type(setting) == "array") {
		//如果是原生对象，则附加data
		me.config.async.enabled = false;
		me.config.async.url = '';
		me.config.store.data = setting;
	} else if (setting && $.type(setting) == "object") {
		//合并配置回调事件
		if (setting.callback && setting.callback.configCallback) {
			setting.callback.configCallback = _mergeFunc(setting.callback.configCallback, me.config.callback.configCallback);
		}

		//合并载入回调事件
		if (setting.callback && setting.callback.loadCallback) {
			setting.callback.loadCallback = _mergeFunc(setting.callback.loadCallback, me.config.callback.loadCallback);
		}

		//合并节点点击回调事件
		if (setting.callback && setting.callback.nodeClick) {
			setting.callback.nodeClick = _mergeFunc(setting.callback.nodeClick, me.config.callback.nodeClick);
		}

		//合并限制数改变回调事件
		if (setting.callback && setting.callback.limitChange) {
			setting.callback.limitChange = _mergeFunc(setting.callback.limitChange, me.config.callback.limitChange);
		}

		//合并页面跳转页码改变回调事件
		if (setting.callback && setting.callback.jumpChange) {
			setting.callback.jumpChange = _mergeFunc(setting.callback.jumpChange, me.config.callback.jumpChange);
		}
		//覆盖配置
		me.config = $.extend(true, me.config, setting);
	}

	LUIController.call(this, me.config, callback);
};

//继承LUIcontroller类的属性和方法
Pagination.prototype = new LUIController();

//扩展为JQ方法
$.fn.pagination = function (setting, callback) {
	//实例化
	var pagination = new Pagination(this.selector, setting, callback);
	//返回初始化对象
	return pagination;
}

//扩展为window方法
window.pagination = function (selector, setting, callback) {

	//实例化
	var pagination = new Pagination(selector, setting, callback);

	//返回初始化对象
	return pagination;
};