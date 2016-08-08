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
				dblClickExpand: false
			},
			callback: {

			}

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


	//封装树创建
	$.fn.createTreeScroll = function (zSetting, zNodes, callback) {
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

		eleTreeList.parent().parent().css("position", "relative");


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
				dblClickExpand: false
			},
			callback: {

			}

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
				/*				//展开树自动调整右侧尺寸
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
								}*/
			};

			var addOnCollapse = function (treeId, treeNode) {
				/*				eleTreeList.css("width", "auto");
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
								}*/
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
			eleTreeContent.css("marginLeft", eleTreeList.parent().outerWidth() + 10);
			//为树设置最大高度
			eleTreeList.css("height", eleTreeContent.outerHeight() - parseInt(eleTreeList.parent().css("paddingTop")) - parseInt(eleTreeList.parent().css("paddingBottom")) - parseInt(eleTreeList.parent().css("borderTop")) - parseInt(eleTreeList.parent().css("borderBottom")));
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




				}

			}
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
			var btn = $(this).find(".btn");
			var icon = $(this).find(".arrow-selectbox-container");
			var btnInnerWidth = btn.innerWidth();
			droplistOption.css({
				"minWidth": btnInnerWidth
			});

			var dropButton = $(this);
			if (dropButton.is(".arrow-droplist")) {
				icon.unbind("click");

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
						if (dropButton.is(".table-droplist")) {
							if (dropButton.position().top + dropButton.outerHeight() + droplistOption.outerHeight() > dropButton.parents(".table").outerHeight()) {
								//按钮位置+按钮高度+弹出层高度大于表可靠高度时,改成向上弹出
								droplistOption.css({
									position: "absolute",
									left: dropButton.position().left,
									//边框高度-按钮位置=剩余的量，剩余的量
									bottom: dropButton.parents(".table").outerHeight() - dropButton.position().top
								});
							} else {
								droplistOption.css({
									position: "absolute",
									left: dropButton.position().left,
									top: dropButton.position().top + dropButton.outerHeight()
								});
							}
						}
					}
				});

			} else {
				dropButton.unbind("click");
				dropButton.bind("click", function (event) {
					//TABLE下拉框出现兼容
					event.stopPropagation();

					if (droplistOption.is(":visible")) {
						btn.removeClass("active");
						droplistOption.hide();
					} else {
						dropListOption.find(".ui-droplist-option").prev().removeClass("active")
						dropListOption.find(".ui-droplist-option").hide();
						btn.addClass("active");
						droplistOption.show();
						if (dropButton.is(".table-droplist")) {
							if (dropButton.position().top + dropButton.outerHeight() + droplistOption.outerHeight() > dropButton.parents(".table").outerHeight()) {
								//按钮位置+按钮高度+弹出层高度大于表可靠高度时,改成向上弹出
								droplistOption.css({
									position: "absolute",
									left: dropButton.position().left,
									//边框高度-按钮位置=剩余的量，剩余的量
									bottom: dropButton.parents(".table").outerHeight() - dropButton.position().top
								});
							} else {
								droplistOption.css({
									position: "absolute",
									left: dropButton.position().left,
									top: dropButton.position().top + dropButton.outerHeight()
								});
							}
						}
					}
				});
			}
		});
		//点击空白区域关闭选框事件
		$("html").click(function () {
			//查找所有的ui-droplist
			dropListOption.find(".ui-droplist-option").prev().removeClass("active")
			dropListOption.find(".ui-droplist-option").hide();
		});
	};

	//封装弹出小提示
	$.fn.popupTips = function () {
		var tips = this;
		tips.each(function () {
			if ($(this).is(".popuptips")) {
				$(this).bind("click", function (event) {
					var content = $(this).attr("title");
					layer.tips(content, $(this), {
						tips: 2,
						time: 5000
					});
					event.stopPropagation();
				});
			} else if ($(this).is(".showtips")) {

				$(this).bind("click", function (event) {

					var tipsid = $(this).attr("data-tipsid");
					var $info;
					if (tipsid && $(tipsid).length > 0) {
						//展示html内容
						$info = $(tipsid);
						if ($info.is(":visible")) {
							$info.fadeOut()
						} else {
							$info.fadeIn()
						}
					} else {
						//根据title创建html元素
						var content = $(this).attr("title");
						if ($(this).next().length <= 0) {
							$info = $('<div class="showtips-alert alert alert-warning mb-10"><span>' + content + '</span><span class="tips-close"><i class="iconfont">&#xe628;</i></span></div>');
							$(this).after($info);
							$info.fadeIn();
						} else {
							$info = $(this).next();
							if ($info && $info.is(":visible")) {
								$info.fadeOut()
							} else if ($info) {
								$info.fadeIn();
							}
						}
					}

					//为关闭按钮添加事件
					if ($info && $info.is(":visible")) {
						$info.delegate(".tips-close", "click", function () {
							event.stopPropagation();
							$info.fadeOut();
						});
					}
					event.stopPropagation();
				});
			}
		})
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
			$(this).keyup();
		});
	};

	//封装tabs页
	$.fn.tabs = function (setting) {

		//切换后返回的id值 C
		//点击次数，是否已加载 C
		//增加数据 C
		//onclick返回事件 C

		var me = this;

		var config = {
			store: {
				/*data: [{
					id: "01",
					target: "#tab1",
					name: "学生信息",
					state: "selected"
					}, {
					id: "02",
					target: "#tab2",
					name: "教师信息",
					}, {
					id: "03",
					target: "#tab3",
					name: "家长信息",
					}]*/
			},
			view: {

			},
			callback: {
				/*nodeOnClick: function ($currentNode, $currentData) {
				}*/
			}
		}

		config = $.extend(true, config, setting);

		//由类名tabs控制为一组，检测项中的selected状态
		var $node = $(this).find('.node');

		//初始化进入配置选中

		//html形式书写并且data不存在时
		if ($node.length > 0 && !config.store.data) {
			//缓存html节点上的数据 id和名称,选中状态，和目标
			$node.each(function (i) {
				var currentNode = $(this);
				var currentNodeData = {};
				currentNodeData.id = currentNode.attr("id");
				currentNodeData.target = currentNode.attr("data-target");
				currentNodeData.name = currentNode.get(0).innerText;
				if (currentNode.attr("class").match("selected")) {
					currentNodeData.state = "selected";
				}
				currentNode.data("data", currentNodeData);
			})
		} else {
			//清空原数据
			$(this).empty();
			//按配置生成html元素内容

			for (var i = 0; i < config.store.data.length; i++) {
				var $node2 = $('<div class="node" id="' + config.store.data[i].id + '" data-target="' + config.store.data[i].target + '">' + config.store.data[i].name + '</div>');

				if (config.store.data[i].state == "selected") {
					$node2.addClass("selected")
				}

				//绑定数据
				$node2.data("data", config.store.data[i]);

				$(this).append($node2);
			}
		}

		$(this).delegate('.node', 'click', function (event) {
			var $node = $(me).find('.node');
			//样式变化
			$node.removeClass('selected');
			$(this).addClass('selected');

			//打开项显示
			$($(this).attr('data-target')).siblings().hide()
				.end().show();

			//点击数增加，返回数据
			if (!$(this).data("data").count && $(this).data("data").count != 0) {
				$(this).data("data").count = 0;
			} else {
				$(this).data("data").count++
			}


			if (config && config.callback && config.callback.nodeOnClick && $.type(config.callback.nodeOnClick) == "function") {
				config.callback.nodeOnClick($(this), $(this).data("data"));
			}
		});

		//自定义链接参数进入选中
		var params = getUrlParams();
		if (params.id) {
			$(this).find("#" + params.id).click();
		}

	}

	//即时搜索下拉框
	$.fn.searchDroplist = function (controllerO, filterKey, matchMode) {
		var searchO = $(this)
		var ncO, dlO;

		if ($.type(controllerO) == "array") {
			dlO = controllerO[0];
			if (controllerO[1]) {
				ncO = controllerO[1];
			}
		} else {
			dlO = controllerO;
		}

		var $search = searchO;
		var $dl = dlO.$me;
		var $nc = ncO ? ncO.me : null;

		//初始化UI
		$search.parent().css({
			"position": "relative"
		});

		//假如搜索区初始化无内容，则显示下拉列表中已选中的数据
		if (!$search.val() && dlO.getSelectedNode().length > 0) {
			if (dlO.config.view.enabledMultiple) {
				//多选
				$search.val(dlO.dataToArray(dlO.getSelectedData("name")).join(","))
			} else {
				$search.val(dlO.dataToArray(dlO.getSelectedData("name"))[0])
			}
		}

		//取消节点的全部选中状态
		dlO.cleanSelectedNode();

		if (dlO.config.view.enabled) {
			//搜索区获取焦点事件
			$search.bind("focus", function () {
				$(".close-popup").hide();
				if (ncO) {
					$nc.show();
					$dl.show();
					$nc.css({
						"position": "absolute",
						"width": $search.outerWidth() + "px",
						"left": 0,
						"top": $search.outerHeight(),
						"zIndex": 1024
					})
					ncO.autohidedom.css({
						"zIndex": 1030
					});
				} else {
					$dl.show();
					$dl.css({
						"position": "absolute",
						"width": $search.innerWidth() + "px",
						"height": "288px",
						"overflowY": "auto",
						"left": 0,
						"top": $search.outerHeight(),
						"zIndex": 1024
					})
				}
			});


			//搜索键盘 keyup事件
			//连字查找时，字之间需要无空格
			$search.bind("keyup", function () {
				var searchVal = $search.val();

				var $allNode = dlO.getAllNode();
				if (searchVal.length > 0) {
					var resultNodeId = dlO.filterNode(searchVal)
					if (resultNodeId.length > 0) {
						$allNode.hide();
						resultNodeId.show();

						if (ncO) {
							$nc.show();
							var ncHeight = $nc.height();
							//判断内容区高度
							if ($dl.height() < ncHeight) {
								ncO.autohidedom.hide()
							}
						} else {
							$dl.show();
							//取得现有的高度值
							var currentHeight = $dl.css("height");
							$dl.css({
								"height": "auto"
							})
							if (parseInt($dl.css("height")) < parseInt(currentHeight)) {
								$dl.css({
									"overflowY": "hidden"
								})
							}
						}
					} else {
						if (ncO) {
							$nc.hide();
						} else {
							$dl.hide();
						}
					}
				} else {
					$allNode.show();

					if (ncO) {
						$nc.show();
						ncO.autohidedom.show()
					} else {
						$dl.show();
						$dl.css({
							"overflowY": "auto",
							"maxHeight": "288px"
						})
					}
				}
			});

			/*
			$search.bind("keyup", function () {
				var searchVal = "";
				if (matchMode && $.type(matchMode) == "boolean") {
					searchVal = $.trim($search.val()).replace(/\s+/g, "");
					var regString = "";
					for (var i = 0; i < searchVal.length; i++) {
						regString += searchVal[i] + "+.*";
					}
					searchVal = regString;
				} else {
					searchVal = $.trim($search.val()).replace(/\s+/g, " ");
					searchVal = searchVal.replace(/\s+/g, "+.*");
				}
				var $allNode = dlO.getAllNode();
				if (searchVal.length > 0) {
					var resultNodeId = [];

					for (var i = 0; i < $allNode.length; i++) {
						var $getNode = $allNode.eq(i)
						var getData;
						//字符串，或者数组
						if (filterKey && filterKey == "all") {
							getData = dlO.getDataById($getNode);
						} else if (filterKey && ($.type(filterKey) == "string" || $.type(filterKey) == "array")) {
							getData = dlO.getDataById($getNode, filterKey);
						} else {
							getData = dlO.getDataById($getNode, "name");
						}
						for (var key in getData) {
							if ($.trim(getData[key]).search(eval("/" + searchVal + "/g")) >= 0) {
								resultNodeId.push(dlO.getDataById($getNode).id)
								continue;
							}
						}
					}

					if (resultNodeId.length > 0) {
						$allNode.hide();
						dlO.getNodeById(resultNodeId).show();

						if (ncO) {
							$nc.show();
							var ncHeight = $nc.height();
							//判断内容区高度
							if ($dl.height() < ncHeight) {
								ncO.autohidedom.hide()
							}
						} else {
							//取得现有的高度值
							var currentHeight = $dl.css("height");
							$dl.css({
								"height": "auto",
							})
							if (parseInt($dl.css("height")) < parseInt(currentHeight)) {
								$dl.css({
									"overflowY": "hidden",
								})
							}
						}
					} else {
						if (ncO) {
							$nc.hide();
						} else {
							$dl.hide();
						}
					}
				} else {
					$allNode.show();

					if (ncO) {
						$nc.show();
						ncO.autohidedom.show()
					} else {
						$dl.show();
						$dl.css({
							"overflowY": "auto",
							"maxHeight": "288px"
						})
					}
				}
			});*/
		} else {
			$search.attr("disabled", "disabled");
		}

		//搜索区点击事件：阻止冒泡
		$search.bind("click", function (event) {
			event.stopPropagation();
		})

		//节点点击事件

		dlO.$content.delegate("[data-role='node']", "click", function (event) {

			//如果项不可选，则直接退出
			if (dlO.getDataById($(this)).state == "disabled") {

				return false;

			}
			//多选
			if (dlO.config.view.enabledMultiple) {
				event.stopPropagation();
				var nodeName = dlO.getDataById($(this)).name;
				//拼装到原来已有的内容里
				var searchText = "";
				if (!$search.val()) {
					searchText = nodeName;
				} else {
					searchText = $search.val() + "," + nodeName;
				}
				$search.val(searchText);
				dlO.cancelSelectedNode($(this));
				searchO.focus();

			} else {
				//单选
				var nodeName = dlO.getDataById($(this)).name;
				$search.val(nodeName);
				dlO.cancelSelectedNode($(this))
			}

		});


		//点击空白区域关闭选框事件
		$("html").click(function () {
			$(".close-popup").hide();

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

function changeTab(event) {
	event.preventDefault();

	event.data.removeClass('selected');
	$(this).addClass('selected');

	$($(this).attr('href')).siblings().hide()
		.end().show();
}

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

//弹出内容层
function popupLayer(content, title, size, btn, yesCallback, cancelCallback, successCallback) {
	var popupIndex = layer.open({
		type: $(content).length ? 1 : 2,
		title: title,
		content: $(content).length ? $(content) : content,
		area: size || ["900px", "500px"],
		closeBtn: 1,
		btn: btn,
		yes: function (index, layero) {

			if (yesCallback && $.type(yesCallback) == "function") {
				yesCallback(index, layero);
			}

		},
		cancel: function (index) {

			if (cancelCallback && $.type(cancelCallback) == "function") {
				cancelCallback(index)
			}

		},
		success: function (layero, index) {
			/*//缓存目前选中的数据，用于关闭时重置选择
			oldSelectedItem = me.getSelectedItem();*/
			if (successCallback && $.type(successCallback) == "function") {
				successCallback(layero, index)
			}
		}
	});
	/*}, 500);*/

	return popupIndex;
}


function consoleLog(content) {

	if (window["console"]) {
		console.log(content)
	}
}

//表格视图封装
function gridPanelview(gridO, panelO) {
	var $grid = gridO.$me;
	var $panel = panelO.$me;

	//表格多选框 点击改变 事件
	$grid.delegate(":checkbox:not(.selectAll)", "change", function () {

		//todo 更改数据结构
		var currentGridData = gridO.getRowDataByDom($(this)).data;
		//不变动表格原数据，复制成为新的数据
		var panelData = panelO.cloneData(currentGridData, function (cloneData, filterData, me) {
			//将表格的_id复制一份给面板的id
			if (!cloneData.id) {
				cloneData.id = cloneData._id;
			}
		});

		var nodeId = panelData.id;
		if (this.checked) {
			//选中状态生成视图项节点
			//容错：面板中已有该选项，则不再生成
			if (nodeId && panelO.getNodeById(nodeId).length > 0) {} else {
				panelO.addNode(panelData);
			}
		} else {
			//取消选中状态时移除视图项节点
			panelO.removeNode(nodeId)
		}
	});

	//TODO表格 全选按钮事件
	$grid.delegate(".selectAll", "change", function () {
		//console.log($grid.next(".table-bottom-bar").find(".pagination").find(""))
		var checkbox = $grid.find(":checkbox").not(".selectAll");
		checkbox.each(function () {
			$(this).change();
		})
	});

	//TODO分页按钮事件
	$grid.next(".table-bottom-bar").delegate(".pagination", "click", function () {});

	//面板移除事件
	panelO.$content.delegate("[data-role='remove']", "click", function (event) {
		var id = $(this).parents('[data-role="node"]').attr("id");
		$grid.find(":checkbox").not(".selectAll").filter("#" + id).removeAttr("checked");
		$grid.find(".selectAll").removeAttr("checked");

		return true;
	});

	//确认按钮事件的重新绑定
	/*	panelO.$control.find("[data-role='yes']").click(function () {
			var data = panelO.getAllData()
		});*/
};

//列表弹出视图封装
function SelectBoxPanelview(controllerO) {
	var sbO = controllerO[0];
	var panelO = controllerO[1];

	var $sb = sbO.$me;
	var $panel = panelO.$me;

	//重载面板配置
	if (!panelO.config._userDefined) {
		var panelOsetting = {
			//功能配置
			view: {
				//默认启用控制栏
				enabledcontrol: false,

				//自定义内容区html格式
				nodeFormater: function (nodeData) {
					//return 每一项的格式
					//根据不同的显示要求生成项html
					if (sbO.config.view.mainShow == "image") {
						return '<div><img src="' + nodeData.image + '" /></div>';
					} else if (sbO.config.view.mainShow == "text") {
						return '<div><span>' + nodeData.name + '</span></div>';
					} else {
						//名称如果未填写容错处理放置空白符
						if (!nodeData.name) {
							nodeData.name = "&nbsp;"
						}

						var imageHtml = "";
						if (nodeData.image) {
							imageHtml = '<img src="' + nodeData.image + '" alt="' + nodeData.name + '" title="' + nodeData.name + '">';
						}

						return "<div>" + imageHtml + '<span>' + nodeData.name + '</span></div>';
					}
				}
			}
		};
		panelO.load(panelOsetting, function ($addNode, panelO) {
			panelO.$me.prepend('<div class="heading">您目前的选择：</div>')
		})
	}

	//初始化视图面板，选中选项框已选中的数据
	panelO.addNode(panelO.cloneData(sbO.getSelectedData()), function ($addNode, panelO) {
		panelO.cancelSelectedNode($addNode);
	});

	//事件侦听：
	//选项框点击，面板视图出现相关信息
	sbO.$content.delegate("[data-role='node']", "click", function (event) {
		//获取节点数据
		var currentSBData = sbO.getDataById($(this));

		//直接在面板里显选中示数据
		if (currentSBData.state == "selected" && !(currentSBData.id && panelO.getNodeById(currentSBData.id).length > 0)) {

			if (!sbO.config.view.enabledMultiple) {
				panelO.cleanAllNode();
			}

			var cloneData = panelO.cloneData(currentSBData);

			var $addnode = panelO.addNode(cloneData)
			panelO.cancelSelectedNode($addnode);

		} else if (currentSBData.state != "selected" && (currentSBData.id && panelO.getNodeById(currentSBData.id).length > 0)) {
			panelO.removeNode(currentSBData.id);
		}
	});

	//视图按钮移除点击事件
	panelO.$content.delegate("[data-role='remove']", "click", function (event) {
		var currentData = panelO.getDataById($(this).parents('[data-role="node"]'));

		var $sbNode = sbO.getNodeById(currentData.id);
		sbO.cancelSelectedNode($sbNode);

	});

}


//弹出框视图封装封装
function popupSelectBox(controllerO, content, title, size, btn, yesCallback, cancelCallback, successCallback) {

	var sbO = controllerO[0];
	var panelO = controllerO[1];
	var panelO2;
	if (controllerO[2]) {
		panelO2 = controllerO[2];
	}

	var $sb = sbO.$me;
	var $panel = panelO.$me;
	var $panel2 = panelO2 ? panelO2.me : null;

	//如果自定义了配置，则以用户配置为准，忽略此处
	//重载面板配置
	if (!panelO.config._userDefined) {
		var panelOsetting = {
			_userDefined: false,
			//功能配置
			view: {
				//默认启用控制栏
				enabledcontrol: false,
				//自定义内容区html格式
				nodeFormater: function (nodeData) {
					//return 每一项的格式
					//根据不同的显示要求生成项html
					if (sbO.config.view.mainShow == "image") {
						return '<div><img src="' + nodeData.image + '" /></div>';

					} else if (sbO.config.view.mainShow == "text") {
						return '<div><span>' + nodeData.name + '</span></div>';
					} else {
						//名称如果未填写容错处理放置空白符
						if (!nodeData.name) {
							nodeData.name = "&nbsp;"
						}

						var imageHtml = "";
						if (nodeData.image) {
							imageHtml = '<img src="' + nodeData.image + '" alt="' + nodeData.name + '" title="' + nodeData.name + '">';
						}

						return "<div>" + imageHtml + '<span>' + nodeData.name + '</span></div>';
					}
				}
			}
		};
		panelO.load(panelOsetting, function ($addNode, panelO) {
			$panel.prepend('<div class="placeholder">请选择</div><i class="selectbox-icon"></i>')
		})
	}

	//初始化视图面板，选中选项框已选中的数据
	panelO.addNode(panelO.cloneData(sbO.getSelectedData()), function ($addNode, panelO) {
		panelO.cancelSelectedNode($addNode);
		//若无增加项，则将placeholder显示出来
		if ($addNode.length <= 0) {
			$panel.find(".placeholder").show();
			panelO.$content.hide();
		} else {
			if (!sbO.config.view.enabledMultiple && panelO.getAllNode().length == 1) {
				panelO.$content.addClass("single");
			} else {
				panelO.$content.removeClass("single");
			}
			//一项时增加single属性
			panelO.cancelSelectedNode($addNode)
			$panel.find(".placeholder").hide();
			panelO.$content.show();
		}
	});

	//事件侦听：

	//视图按钮移除点击事件
	panelO.$content.delegate("[data-role='remove']", "click", function (event) {
		var currentData = panelO.getDataById($(this).parents('[data-role="node"]'));

		var $sbNode = sbO.getNodeById(currentData.id);
		sbO.cancelSelectedNode($sbNode);


		if (panelO2) {
			var $panelO2Node = panelO2.getNodeById(currentData.id);
			panelO2.removeNode($panelO2Node);
		}


		//视图区无选项时，显示placeholder
		if (panelO.getAllNode().length <= 0) {
			$panel.find(".placeholder").show();
			panelO.$content.hide();
		} else {
			//一项时增加single属性
			if (!sbO.config.view.enabledMultiple && panelO.getAllNode().length == 1) {
				panelO.$content.addClass("single");
			} else {
				panelO.$content.removeClass("single");
			}
			$panel.find(".placeholder").hide();
			panelO.$content.show();
		}



	});

	//如果选择框被隐藏，则默认为面板视图设置一个打开
	//面板框点击事件

	if ($sb.is(":hidden")) {
		$panel.bind("click", function () {

			$panel.addClass("focus");

			//使用layer打开层

			var $oldSelectedNode;

			var popupIndex = popupLayer(content, title, size, btn, function (index, layero) {

					//点击保存时可以获取当前选中的目标
					//显示在目标区域里
					//获取图标地址和图标名称,返回一个数组对象
					//暂存目前选中的数据
					//假如未开启视图面板自动显示，则显示一次
					var $getNode = sbO.getSelectedNode();
					panelO.cleanAllNode();


					//增项加：未复制数据，镜象引用

					var cloneData = panelO.cloneData(sbO.getSelectedData());
					var $addNode = panelO.addNode(cloneData);

					//视图区无选项时，显示placeholder
					if (panelO.getAllNode().length <= 0) {
						$panel.find(".placeholder").show();
						panelO.$content.hide();
					} else {
						if (!sbO.config.view.enabledMultiple && panelO.getAllNode().length == 1) {
							panelO.$content.addClass("single");
						} else {
							panelO.$content.removeClass("single");
						}
						//一项时增加single属性
						panelO.cancelSelectedNode($addNode)
						$panel.find(".placeholder").hide();
						panelO.$content.show();
					}

					$panel.removeClass("focus");

					if (yesCallback) {
						yesCallback(index, layero)
					} else {
						layer.close(popupIndex);
					}


				}, function (index) {

					//选框清空所有已选中项清空选择和数据
					sbO.cleanSelectedNode();

					sbO.selectNode($oldSelectedNode);

					if (panelO2) {
						if (sbO.config.view.enabledMultiple) {
							var $panelO2Node = panelO2.getNodeById(sbO.dataToArray(sbO.getDataById($oldSelectedNode, "id")));

							var $tempNode = panelO2.removeNode($panelO2Node);

							panelO2.cleanAllNode();

							panelO2.addNode(panelO2.getDataById($tempNode))
						} else {
							panelO2.cleanAllNode();


							var cloneData = panelO2.cloneData(sbO.getDataById($oldSelectedNode));

							var $addNode = panelO2.addNode(cloneData)

							panelO2.cancelSelectedNode($addNode)
						}

					}

					$panel.removeClass("focus");

					if (cancelCallback) {
						cancelCallback(index)
					}

				},
				function (layero, index) {
					//缓存目前选中的数据，用于关闭时重置选择
					$oldSelectedNode = sbO.getSelectedNode();
					if (successCallback) {
						successCallback(layero, index)
					}
				})

			event.stopPropagation();
		});
	}
}


//下拉列表
function droplist(controllerO) {
	var dlO = controllerO[0];
	var panelO = controllerO[1];
	var ncO;

	if (controllerO[2]) {
		ncO = controllerO[2];
	}

	var $dl = dlO.$me;
	var $panel = panelO.$me;
	var $nc = ncO ? ncO.me : null;

	//如果自定义了配置，则以用户配置为准，忽略此处
	//重载面板配置

	if (!panelO.config._userDefined) {
		var panelOsetting = {
			_userDefined: false,
			//功能配置
			view: {
				//默认启用控制栏
				enabledcontrol: false,
				//自定义内容区html格式
				nodeFormater: function (nodeData) {
					//return 每一项的格式
					//根据不同的显示要求生成项html
					if (dlO.config.view.mainShow == "image") {
						return '<div><img src="' + nodeData.image + '" /></div>';

					} else if (dlO.config.view.mainShow == "text") {
						return '<div><span>' + nodeData.name + '</span></div>';
					} else {
						//名称如果未填写容错处理放置空白符
						if (!nodeData.name) {
							nodeData.name = "&nbsp;"
						}

						var imageHtml = "";
						if (nodeData.image) {
							imageHtml = '<img src="' + nodeData.image + '" alt="' + nodeData.name + '" title="' + nodeData.name + '">';
						}

						return "<div>" + imageHtml + '<span>' + nodeData.name + '</span></div>';
					}
				}
			}
		};
		panelO.load(panelOsetting, function ($addNode, panelO) {
			$panel.prepend('<div class="placeholder">请选择</div><i class="selectbox-icon"></i>')
		})
	}

	//初始化视图面板，选中选项框已选中的数据
	panelO.addNode(panelO.cloneData(dlO.getSelectedData()), function ($addNode, panelO) {
		panelO.cancelSelectedNode($addNode);
		//若无增加项，则将placeholder显示出来
		if ($addNode.length <= 0) {
			$panel.find(".placeholder").show();
			panelO.$content.hide();
		} else {
			if (!dlO.config.view.enabledMultiple && panelO.getAllNode().length == 1) {
				panelO.$content.addClass("single");
			} else {
				panelO.$content.removeClass("single");
			}
			//一项时增加single属性
			panelO.cancelSelectedNode($addNode)
			$panel.find(".placeholder").hide();
			panelO.$content.show();
		}
	});

	//初始化UI
	$panel.parent().css({
		"position": "relative"
	});


	//侦听事件
	//面板点击事件
	if (dlO.config.view.enabled) {
		$panel.bind("click", function (event) {
			//删除其他同类空间焦点
			$(".select-panelview").removeClass("focus");
			event.stopPropagation();
			if (ncO) {
				if ($nc.is(":visible")) {
					$nc.hide();
				} else {
					$(".close-popup").hide();

					$panel.addClass("focus");
					$nc.show();
					$dl.show();

					$nc.css({
						"position": "absolute",
						"width": $panel.outerWidth() + "px",
						"left": 0,
						"zIndex": 1024
					});

					ncO.autohidedom.css({
						"zIndex": 1030
					});
				}
			} else {
				if ($dl.is(":visible")) {
					$dl.hide();
				} else {
					$(".close-popup").hide();

					$panel.addClass("focus");

					$dl.show();
					$dl.css({
						"position": "absolute",
						"width": $panel.innerWidth() + "px",
						"height": "288px",
						"overflowY": "auto",
						"left": 0,
						"zIndex": 1024
					});
				}
			}
		});

		//下拉列表点击，面板视图出现相关信息
		dlO.$content.delegate("[data-role='node']", "click", function (event) {
			//获取节点数据
			var currentSBData = dlO.getDataById($(this));

			//直接在面板里显选中示数据
			if (currentSBData.state == "selected" && !(currentSBData.id && panelO.getNodeById(currentSBData.id).length > 0)) {

				if (!dlO.config.view.enabledMultiple) {
					//单选
					panelO.cleanAllNode();
					$panel.removeClass("focus");

					$(".close-popup").hide();
				} else {
					event.stopPropagation();
					if (dlO.config.view.multipleSize && (dlO.config.view.multipleSize <= dlO.getSelectedNode().length)) {
						$panel.removeClass("focus");
						$(".close-popup").hide();
					}
				}

				var cloneData = panelO.cloneData(currentSBData);

				var $addnode = panelO.addNode(cloneData)
				panelO.cancelSelectedNode($addnode);

			} else if (currentSBData.state != "selected" && (currentSBData.id && panelO.getNodeById(currentSBData.id).length > 0)) {
				panelO.removeNode(currentSBData.id);
				event.stopPropagation();
			}

			//视图区无选项时，显示placeholder
			if (panelO.getAllNode().length <= 0) {
				$panel.find(".placeholder").show();
				panelO.$content.hide();
			} else {
				if (!dlO.config.view.enabledMultiple && panelO.getAllNode().length == 1) {
					panelO.$content.addClass("single");
				} else {
					panelO.$content.removeClass("single");
				}
				$panel.find(".placeholder").hide();
				panelO.$content.show();
			}

		});

		//视图按钮移除点击事件
		panelO.$content.delegate("[data-role='remove']", "click", function (event) {
			var currentData = panelO.getDataById($(this).parents('[data-role="node"]'));

			var $sbNode = dlO.getNodeById(currentData.id);
			dlO.cancelSelectedNode($sbNode);

			//视图区无选项时，显示placeholder
			if (panelO.getAllNode().length <= 0) {
				$panel.find(".placeholder").show();
				panelO.$content.hide();
			} else {
				//一项时增加single属性
				if (!dlO.config.view.enabledMultiple && panelO.getAllNode().length == 1) {
					panelO.$content.addClass("single");
				} else {
					panelO.$content.removeClass("single");
				}
				$panel.find(".placeholder").hide();
				panelO.$content.show();
			}
		});
	} else {
		$panel.addClass("disabled")
	}

	//点击空白区域关闭选框事件
	$("html").click(function () {
		$panel.removeClass("focus");

		$(".close-popup").hide();

	});

}


//返回自定义链接参数
function getUrlParams(searchString) {
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
}