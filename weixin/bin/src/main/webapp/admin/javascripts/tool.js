(function ($) {

	//封装树创建
	$.fn.createTree = function (zSetting, zNodes, callback) {
		//当前对象不存在
		if (this.length === 0) {
			console.error("%c%s%c 对象不存在，请检查", "font-weight:bold;text-decoration:underline", this.selector, "");
			return false;
		}

		//如果有treeContentId，就与左树关联,使右侧内容自已适应，
		//如果没有ID，则自已管自已
		//都会根据setting配置生成树

		var me = this;
		var zTreeObj;
		var treeContentId = null;
		var eleTreeList = $(this);

		eleTreeList.parent().css("position", "relative");


		//假如treeContentId没有传入，并且自身id并不是treeList
		if ((!zSetting.view || !zSetting.view.treeContentId) && this.selector == "#treeList") {
			treeContentId = "#treeContent";
		} else {
			treeContentId = zSetting.view.treeContentId;
		}

		//更改ztree的默认配置，以适合本项目
		var setting = {

			view: {
				showLine: false,
				showIcon: true,
				selectedMulti: false,
				treeContentId: treeContentId,
				dblClickExpand: false,
			},
			callback: {

			},

		};

		var eleTreeContent = $(treeContentId);

		setting = $.extend(true, setting, zSetting);

		var oldAddDiyDom;

		if (setting.view.addDiyDom) {
			oldAddDiyDom = setting.view.addDiyDom;
		} else {
			oldAddDiyDom = function () {}
		}

		var newAddDiyDom = function (treeId, treeNode) {
			var icoObj = $("#" + treeNode.tId + "_ico");

			icoObj.bind("click", function () {
				zTreeObj.expandNode(treeNode, null, null, null, true);
			});
		}

		setting.view.addDiyDom = function (treeId, treeNode) {
			newAddDiyDom(treeId, treeNode);
			oldAddDiyDom(treeId, treeNode);
		}

		//如果id不存在，则不管树内容，直接生成树即可
		if (eleTreeContent.length <= 0) {
			zTreeObj = $.fn.zTree.init(this, setting, zNodes);

		} else {

			var oldOnExpand, oldOnCollapse;

			if (setting.callback.onExpand) {
				oldOnExpand = setting.callback.onExpand;
			} else {
				oldOnExpand = function () {}
			}

			if (setting.callback.oldOnCollapse) {
				oldOnCollapse = setting.callback.oldOnCollapse;
			} else {
				oldOnCollapse = function () {}
			}

			//设置展开与关闭的事件
			var addOnExpand = function (treeId, treeNode) {
				//展开树自动调整右侧尺寸
				var eleTreeListOuterWidth = eleTreeList.outerWidth(),
					documentWidth = $(document).width();
				if (eleTreeListOuterWidth > documentWidth / 2) {
					eleTreeList.css("width", documentWidth / 2);
					eleTreeContent.animate({
						"marginLeft": eleTreeList.outerWidth() + 10
					});
				} else {
					eleTreeList.css("width", "auto");
					eleTreeContent.animate({
						"marginLeft": eleTreeListOuterWidth + 10
					});
				}
			};

			var addOnCollapse = function (treeId, treeNode) {
				eleTreeList.css("width", "auto");
				var eleTreeListOuterWidth = eleTreeList.outerWidth(),
					documentWidth = $(document).width();
				if (eleTreeListOuterWidth > documentWidth / 2) {
					eleTreeList.css("width", documentWidth / 2);
					eleTreeContent.animate({
						"marginLeft": eleTreeList.outerWidth() + 10
					});
				} else {
					eleTreeList.css("width", "auto");
					eleTreeContent.animate({
						"marginLeft": eleTreeListOuterWidth + 10
					});
				}
			};

			setting.callback.onExpand = function (treeId, treeNode) {
				addOnExpand(treeId, treeNode);
				oldOnExpand(treeId, treeNode);
			};

			setting.callback.onCollapse = function (treeId, treeNode) {
				addOnCollapse(treeId, treeNode);
				oldOnCollapse(treeId, treeNode);
			};

			zTreeObj = $.fn.zTree.init(this, setting, zNodes);

			//初始化树与树内容布局
			eleTreeContent.css("marginLeft", eleTreeList.outerWidth() + 10);
			//为树设置最大高度
			eleTreeList.css("height", eleTreeContent.height() - parseInt(eleTreeList.css("paddingTop")) - parseInt(eleTreeList.css("paddingBottom")) - parseInt(eleTreeList.css("borderTop")) - parseInt(eleTreeList.css("borderBottom")));
		}

		//回调函数
		if (callback) {
			callback(me);
		}

		return zTreeObj;
	};

	//封装树选择列表创建
	$.fn.createTreeSelectList = function (zSetting, zNodes, callback) {
		//当前对象不存在
		if (this.length === 0) {
			console.error("%c%s%c 对象不存在，请检查", "font-weight:bold;text-decoration:underline", this.selector, "");
			return false;
		}

		var me = this;
		var $me = $(this);
		var zTreeObj;
		var selectedArray;

		var setting = {

			//数据关键词字段配置
			data: {
				key: {
					name: "name",
					//可以像ztree 节点数据保存节点名称一样，也可以保存图片关键词了，默认为image
					image: "image",
					//所有子项的总数，默认total
					total: "total",
					//直接子项的总数，默认count
					count: "count"
				}
			},

			view: {
				dblClickExpand: false,
				//add 在不开启选框模式的情况下，高亮的选择模式，默认为单选
				//如果同时开启选框和高亮多选，将以选框为主，忽略高亮
				enableMultiple: false,
				//add 是否开启自动创建视图面板，默认为开启
				//不开启时，创建视图面板，再绑定到树上面
				enabledPanel: false,
				//多选时限制最大选择数目，默认不限制
				multipleSize: null
			},

			check: {
				//默认单选模式
				chkStyle: "radio",
				radioType: 'all'
			},

			//菜单点击事件
			callback: {
				beforeClick: function (event, treeId, treeNode) {
					selectedArray = zTreeObj.getSelectedNodes();

				},

				onClick: function (event, treeId, treeNode) {

					//如果点击的是展开按钮则，触发展开，不执行其他事件
					if ($(event.target).is(".button")) {
						zTreeObj.expandNode(treeNode);
						event.stopPropagation();
						return false;
					}


					//当开启选框模式时，取消高亮
					if (setting.check && setting.check.enable) {
						zTreeObj.cancelSelectedNode(treeNode);
						return false;
					}

					//高亮单选模式时 enableMultiple为false
					if (!setting.view.enableMultiple) {
						if (selectedArray.length > 0 && selectedArray[0].tId == treeNode.tId) {
							zTreeObj.cancelSelectedNode(treeNode);
						}
						return false;
					}




					//高亮多选模式时enableMultiple为true，multipleSize: 有做限制
					//1.多个选中状态
					//2.选中父级时，全选子集
					//3.点击选中的父级时，取消选中子集
					//4.点击子集时，取消父级的选中状态

					//阻止冒泡自动关闭下拉框
					event.stopPropagation();



					//假如已经达到5个，则不应该再选中，并且字体颜色置灰色,表示无法选中的意思

					//子元素选中状态
					//TODO  循环遍历父亲，和循环遍历子级样式的变化
					var childSelectdState = function (parentNode, handle) {
						if (parentNode.isParent && parentNode.children.length > 0) {
							//是父元素，并且，有子元素，则选中所有子元素

							if (handle) {
								for (var j = 0; j < parentNode.children.length; j++) {
									zTreeObj.selectNode(parentNode.children[j], true);
								}
							} else {
								for (var j = 0; j < parentNode.children.length; j++) {
									zTreeObj.cancelSelectedNode(parentNode.children[j]);
								}
							}
						}
					}


					//高亮多选模式，高亮模式和选框模式同时开启时，优先以选框模式为准
					if (setting.view && setting.view.enableMultiple && (setting.check && !setting.check.enable)) {
						//多选选中目前已选中的项
						for (var i = 0; i < selectedArray.length; i++) {
							zTreeObj.selectNode(selectedArray[i], true);
						}

						//判断当前项是否已被选中，若已选中，则取消当前项高亮
						//若当是父亲且存在子项，还要取消选中他的孩子
						//若当前项有父亲且兄弟项未全部选中，则迭代取消其父亲的高亮选中
						if ($.inArray(treeNode, selectedArray) >= 0) {
							//取消，取消子级
							zTreeObj.cancelSelectedNode(treeNode)
							childSelectdState(treeNode, false)
						} else {
							childSelectdState(treeNode, true)
						}
					}

					//截断选中队列数
					//判断当前选中数和多选限制数,超过时，变更样式
					if (setting.view.multipleSize && setting.view.multipleSize <= zTreeObj.getSelectedNodes().length) {
						$me.addClass("multipleSize");

					} else {
						$me.removeClass("multipleSize");
					}

					if (setting.view.multipleSize && zTreeObj.getSelectedNodes().length > setting.view.multipleSize) {
						zTreeObj.cancelSelectedNode(treeNode)

					}




				},

			},
		};

		//回调函数
		if (callback) {
			callback(me);
		}

		//覆盖配置
		setting = $.extend(true, setting, zSetting);

		//自定义dom树关键字名称
		var parentOffset = 0;
		var selfOffset = 0;


		//配置容错
		if (setting.view.multipleSize === 0 || setting.view.multipleSize === 1) {
			setting.view.multipleSize = null;
		}
		//自定义dom树结构
		setting.view.addDiyDom = function (treeId, treeNode) {

			var checkObj = $("#" + treeNode.tId + "_check"),
				icoObj = $("#" + treeNode.tId + "_ico"),
				switchObj = $("#" + treeNode.tId + "_switch"),
				spanObj = $("#" + treeNode.tId + "_span");

			var spanObjHtml = "";

			//若开启选择框
			if (setting.check && setting.check.enable) {
				icoObj.after(checkObj);
				switchObj.remove();
				spanObj.css("display", "inline-block");
			} else {
				switchObj.remove();
			}

			if (treeNode[setting.data.key.name]) {
				spanObjHtml += treeNode[setting.data.key.name];
			}
			if (treeNode[setting.data.key.total]) {
				spanObjHtml += "(" + treeNode[setting.data.key.total] + ")";
			}
			if (treeNode[setting.data.key.count]) {
				spanObjHtml += "(" + treeNode[setting.data.key.count] + ")";
			}

			//若存在图片
			if (treeNode[setting.data.key.image]) {
				spanObjHtml = "<img class='icon-image' src ='" + treeNode[setting.data.key.image] + "' / ><span class='icon-text' >" + spanObjHtml + "</span>"
			}

			spanObj.attr("data-parentOffset", parentOffset)
			spanObj.attr("data-selfOffset", selfOffset)
			parentOffset++;
			selfOffset++;
			spanObj.html(spanObjHtml);
		}

		//创建树
		zTreeObj = $.fn.zTree.init(this, setting, zNodes);

		//返回树ID
		zTreeObj.me = "#" + zTreeObj.setting.treeId;
		//返回树配置

		//包裹树
		$me.wrap("<div style='position:relative'></div>");
		//创建视图面板，需要引入panelviewport.js文件
		if (setting.view.enabledPanel) {

			//生成面板dom

			var panelviewport = $('<div id="panelViewport" data-mode="tree" class="tree-select-list-panel panel-viewport"><div class="panel-placeholder">请选择</div><i class="ui-selectbox-icon"></i></div>');
			$me.before(panelviewport);

			panelviewport.panelviewport(zTreeObj, function (that) {
				//选区默认不可见，点击多选框后，才可见，以下语句默认使选区可见
				that.$me.show()
			});
		}

		return zTreeObj;
	};

	//封装按钮下拉
	$.fn.dropList = function () {
		var dropListOption = this;
		this.each(function () {
			var droplistOption = $(this).find(".ui-droplist-option");
			var uiSelectboxOption = droplistOption.find(".ui-selectbox-option");
			var btn = $(this).find(".btn");
			var icon = $(this).find(".arrow-selectbox-container");
			var btnInnerWidth = btn.innerWidth();
			droplistOption.css({
				"minWidth": btnInnerWidth,
			});

			if ($(this).is(".arrow-droplist")) {
				icon.bind("click", function (event) {
						event.stopPropagation();

						if (droplistOption.is(":visible")) {

							btn.removeClass("active");
							droplistOption.hide();

						} else {
							dropListOption.find(".ui-droplist-option").prev().removeClass("active")
							dropListOption.find(".ui-droplist-option").hide();
							btn.addClass("active");
							droplistOption.show();
						}


					})
					/*uiSelectboxOption.bind("click", function (event) {
						event.stopPropagation();

						if (droplistOption.is(":visible")) {
							btn.removeClass("active");
							droplistOption.hide();
						} else {
							btn.addClass("active");
							droplistOption.show();
						}
					})*/
			} else {

				$(this).bind("click", function (event) {

					event.stopPropagation();

					if (droplistOption.is(":visible")) {
						btn.removeClass("active");
						droplistOption.hide();
					} else {
						dropListOption.find(".ui-droplist-option").prev().removeClass("active")
						dropListOption.find(".ui-droplist-option").hide();
						btn.addClass("active");
						droplistOption.show();
					}
				})
			}
		});
		//点击空白区域关闭选框事件
		$("html").click(function () {
			//查找所有的ui-droplist
			dropListOption.find(".ui-droplist-option").prev().removeClass("active")
			dropListOption.find(".ui-droplist-option").hide();
		});

	};


	//封装文本域字数统计 			
	//字数统计以html里设置的maxLength为最高优先级，参数无法覆盖它
	$.fn.wordCount = function (maxlength) {
		this.each(function () {
			//如果HTML标签存在maxlength属性，则以maxlength
			//如果不存在maxlength属性，则以maxlength参数为准

			var maxlengthP = $(this).attr("maxlength");
			var endlength = 0;
			//参数校验
			if (maxlengthP && maxlengthP > 0) {
				endlength = parseInt(maxlengthP);
			} else if (maxlength && parseInt(maxlength) > 0) {
				endlength = parseInt(maxlength)
				$(this).attr("maxlength", endlength);
			} else {
				return false;
			}

			//创建统计数对象
			var countHtml = $("<span>0/" + endlength + "</span>").insertAfter($(this));
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
				countHtml.text(nowLength + "/" + endlength);
			});

		});
	}
})(jQuery)


$(function () {
	//标签页
	$('[data-toggle=tab]').each(function () {
		var $tabsBtn = $(this).find('.tabs-btn');

		$tabsBtn.bind('click', $tabsBtn, changeTab);
	});
	//标签
	$(document).on('click', '.tags .close', function () {
		$(this).parents('.tags').remove();
	});
});

/**
 * 显示提示
 * @param  {String} tipString 提示字符串
 * @param  {[type]} type      success 绿色 danger 红色 info 蓝色 warning 黄色
 */
function tip(tipString, type) {
	var $dom = $(
		'<div class="dialog alert-tip alert alert-' + type + '">' +
		'<div>' + tipString + '</div>' +
		'</div > '
	);
	var offset = '';

	$('body').append($dom);
	offset = _getCenterPoint($dom);

	$dom.show().css({
		top: 15,
		left: offset.left
	});

	window.setTimeout(function () {
		$dom.fadeOut('fast', function () {
			$dom.remove();
		});
	}, 2000);
}

/**
 * 显示iframe
 * @param  {String} title  标题
 * @param  {String} url    url地址
 * @param  {Number} width  宽度
 * @param  {Number} height 高度
 * @return {Number} index  层级
 */
function showIframe(title, url, width, height) {
	if (typeof $.layer !== 'undefined') {
		if (!title) {
			title = false;
		}
		return $.layer({
			type: 2,
			title: title,
			maxmin: true,
			shadeClose: true,
			area: [width + 'px', height + 'px'],
			iframe: {
				src: url
			}
		});
	}
}

/**
 * 显示dom
 * @param  {String} title  标题
 * @param  {Object} dom    dom
 * @param  {Number} width  宽度
 * @param  {Number} height 高度
 * @return {Number} index  层级
 */
function showDom(title, dom, width, height) {
	if (typeof $.layer !== 'undefined') {
		if (!title) {
			title = false;
		}
		$(dom).find('.form-wrap').width(width - 42).height(height - 77);
		return $.layer({
			type: 1,
			title: title,
			maxmin: false,
			shadeClose: true,
			area: [width + 'px', height + 'px'],
			page: {
				dom: dom
			}
		});
	}
}

/**
 * 显示alert
 * @param  {String} msg    字符串
 * @param  {Number} width  宽度
 * @param  {Number} height 高度
 * @return {Number} index  层级
 */
function showAlert(msg, yes, no) {
	if (typeof $.layer !== 'undefined') {
		return $.layer({
			shade: [0.5, '#000'],
			area: ['auto', 'auto'],
			dialog: {
				msg: msg,
				type: -1,
				btns: 2,
				btn: ['确定', '取消'],
				yes: yes
			}
		});
	}
}

function changeTab(event) {
	event.preventDefault();

	event.data.removeClass('selected');
	$(this).addClass('selected');

	$($(this).attr('href')).siblings().hide()
		.end().show();
}

/**
 * 标签
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
function tags(config) {

}

/**
 * 显示遮罩
 */
function showShade() {
	if ($('body .shade').length) {
		return false;
	} else {
		$('body').append('<div class="shade"></div>')
	}
}
/**
 * 隐藏遮罩
 */
function hideShade() {
	$('body .shade').remove();
}

function _getCenterPoint($dom) {
	return {
		left: $(document).width() / 2 - $dom.outerWidth() / 2,
		top: $(document).height() / 2 - $dom.outerHeight() / 2
	};
}



function consoleLog(content) {

	if (window.console) {
		console.log(content)
	}
}

//封装grid和panelview
function gridPanelview(gridO, panelO) {
	var $grid = gridO.$me;
	var $panel = panelO.$me;
	console.log($grid)
	console.log($panel)

	//面板多选框 点击改变 事件
	$grid.delegate(":checkbox:not(.selectAll)", "change", function () {

		//todo 更改数据结构
		var currentGridData = gridO.getRowDataByDom($(this)).data;

		var nodeId = currentGridData.id;

		console.log(currentGridData)
		console.log(panelO.getNodeById(nodeId))
		if (this.checked) {
			//选中状态生成视图项节点
			//容错：面板中已有该选项，则不再生成

			if (nodeId && panelO.getNodeById(nodeId).length > 0) {

			} else {
				panelO.addNode(currentGridData);
			}
		} else {
			//取消选中状态时移除视图项节点
			panelO.removeNode(nodeId)
		}
	});

	//全选按钮事件
	$grid.delegate(".selectAll", "change", function () {
		var checkbox = $grid.find(":checkbox").not(".selectAll");
		checkbox.change();
	});

	//确认按钮事件的重新绑定

	panelO.$controls.find("[data-role='yes']").click(function () {
		var data = panelO.getAllData()
	})
};