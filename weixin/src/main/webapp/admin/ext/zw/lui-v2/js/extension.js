/**
 * @class Extension
 * @version 0.1.0
 * @author lisfan QQ@448182355 GIT@lisfan 
 * @createDate 17/02/2016
 * @requires jquery-1.11.3
 * @name 功能插件封装
 * @markdown
 * 
 * ## 更新
 * - 2016.2.17
 * _ 封装树列表与面板视图:EXT.TreeViewer()
 * 		
 */

function Extension() {

	this.init = {
		type: "extension",
		version: "0.1.0",
		//参数接受对象形式的参数配置
		Viewer: function (setting) {
			var filterArgs = _filterArguments(arguments, ["plainobject"], 1);

			//输出错误信息，快速定位错误
			if (filterArgs === false) {
				var errorText = "%cExtension.TreeViewer(obj)";
				log(errorText, "color:#f00");
				return false;
			}

			var selector = setting.selector;
			var viewer = setting.viewer;
			var ncO = setting.nicescroll;

			//判断各对象引用是否正确
			if (!selector._type) {
				//输出错误信息，快速定位错误
				var errorText = "%cEXT.TreeViewer()方法中selector值，需要是一个由LUIControler的扩展控件对象实例";
				log(errorText, "color:#f00");
				return false;
			}

			if (viewer._type != "panelview") {
				//输出错误信息，快速定位错误
				var errorText = "%cEXT.TreeViewer()方法中viewer值，需要Panelview对象，您将'" + viewer._selector + "'实例化的" + viewer._type + "类型不正确";
				log(errorText, "color:#f00");
				return false;
			}

			var $selector = selector.$me;
			var $viewer = viewer.$me;
			var $nc = ncO ? ncO.me : null;

			//初始化UI
			$viewer.parent().css({
				"position": "relative",
			});

			//如果自定义了配置，则以用户配置为准，忽略此处
			//重载面板配置
			var viewerSetting = {
				_isUserDefined: false,
				_updateConfig: true,
				callback: {
					loadCallback: function ($addNode, obj) {
						//视图按钮移除点击事件
						viewer.$content.undelegate("[data-role='remove']", "click.removeViewerNode");
						viewer.$content.delegate("[data-role='remove']", "click.removeViewerNode", function (event) {
							stopPropagation(event);
							viewer.config.action.removeViewerNode($(this));
						});
					}
				},
				action: {
					removeViewerNode: function ($remover) {
						var $getNode = $remover.closest('[data-role="node"]');
						var getData = viewer.getDataById($getNode);
						var $getSelectorNode = selector.getNodeById(getData.id);
						selector.cancelSelectedNode($getSelectorNode);
						_autoHide();
					}
				}
			};
			if (!viewer.config._isUserDefined) {
				//使用者未自定义配置时，还将覆盖配置
				viewerSetting.view = {
					//默认启用控制栏
					enabledcontrol: false,
					//自定义内容区html格式
					nodeFormater: function (nodeData, nodeIndex) {
						//return 每一项的格式
						//根据不同的显示要求生成项html
						if (selector.config.view.mainShow == "image") {
							return '<div><img src="' + nodeData.image + '" /></div>';

						} else if (selector.config.view.mainShow == "text") {
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

				//$.extend(true, viewerSetting, _viewerSetting);
			}

			//合并视图对象加载回调
			viewerSetting.callback.loadCallback = _mergeFunc(viewer.config.callback.loadCallback, viewerSetting.callback.loadCallback);

			viewer.load(viewerSetting);

			$viewer.prepend('<div class="placeholder">请选择</div><i class="selectbox-icon"></i>');

			var $placeholder = $viewer.find(".placeholder");

			var getSelectedData = viewer.cloneData(selector.getSelectedData());


			//重载选项配置
			var selectorSetting = {
				_isUserDefined: false,
				_updateConfig: true,
				callback: {
					clickNode: function ($currentNode, currentData, obj) {
						obj.config.action.addViewerNode($currentNode, currentData, obj)
					}
				},
				action: {
					addViewerNode: function ($currentNode, currentData, obj) {
						//节点选中，且在视图区里未存在当前节点ID时，在面板里显示该数据
						//如已存在，则进行替换（更新）节点数据
						if (currentData.state == "selected") {
							stopPropagation(event);
							var cloneData = viewer.cloneData(currentData);
							//面板视图不需要子节点数据 
							//delete cloneData.children;
							var $addnode;
							var $currentViewerNode = viewer.getNodeById(currentData.id);
							if ($currentViewerNode.length <= 0) {
								//视图区不存在节点：增加
								if (!selector.config.view.enabledMultiple) {
									//单选
									$(".ext-close-popup").not($selector).not($nc).hide();
									viewer.cleanNode();
									$viewer.removeClass("focus");
								} else {
									//除自已以外的所有都关闭
									$(".ext-close-popup").not($selector).not($nc).hide();
									//多选模式时只有达到了条件才隐藏弹出框
									if (selector.config.view.multipleSize && (selector.config.view.multipleSize <= selector.getSelectedNode().length)) {
										$viewer.removeClass("focus");
									}
								}
								$addnode = viewer.addNode(cloneData, false)
							} else {
								//视图区存在节点：更新
								//找到这个节点的位置
								var index = $currentViewerNode.index();
								$addnode = viewer.addNode(cloneData, index, false);
							}
							viewer.cancelSelectedNode($addnode);
						} else {
							//取消选中时
							stopPropagation(event);
							viewer.removeNode(viewer.getNodeById(currentData.id));
							if (!selector.config.view.enabledMultiple) {
								$(".ext-close-popup").not($selector).not($nc).hide();
								$viewer.removeClass("focus");
							}
						}
						_autoHide();
					}
				}
			}

			//合并节点展开回调事件
			selectorSetting.callback.clickNode = _mergeFunc(selector.config.callback.clickNode, selectorSetting.callback.clickNode);
			//重载
			selector.load(selectorSetting)

			//侦听事件
			//面板点击事件
			if (selector.config.view.enabled) {
				$viewer.bind("click", function (event) {
					//删除其他同类控件焦点
					//$(".ext-viewer").removeClass("focus");
					$viewer.removeClass("focus");
					stopPropagation(event);
					if (ncO) {
						if ($nc.is(":visible")) {
							$nc.hide();
						} else {
							$(".ext-close-popup").hide();

							$viewer.addClass("focus");
							$nc.show();
							$selector.show();

							$nc.css({
								"position": "absolute",
								"width": $viewer.outerWidth() + "px",
								"left": 0,
								"zIndex": 1024,
							});

							ncO.autohidedom.css({
								"zIndex": 1030,
							});
						}
					} else {
						if ($selector.is(":visible")) {
							$selector.hide();
						} else {
							$(".ext-close-popup").hide();

							$viewer.addClass("focus");

							$selector.show();
							$selector.css({
								"position": "absolute",
								"width": $viewer.innerWidth() + "px",
								"height": "288px",
								"overflowY": "auto",
								"left": 0,
								"zIndex": 1024,
							});
						}
					}
				});
			} else {
				$viewer.addClass("disabled");
			}

			//初始化视图面板，根据目标显示已选中的数据
			var $addNode = viewer.addNode(getSelectedData, false);
			viewer.cancelSelectedNode($addNode);

			//若无增加项，则将placeholder显示出来
			if ($addNode.length <= 0) {
				$placeholder.show();
				viewer.$content.hide();
			} else {
				//一项时增加single属性
				if (!selector.config.view.enabledMultiple && viewer.getAllNode().length == 1) {
					viewer.$content.addClass("single");
				} else {
					viewer.$content.removeClass("single");
				}
				viewer.cancelSelectedNode($addNode);
				$placeholder.hide();
				viewer.$content.show();
			}

			//自动隐藏
			function _autoHide() {
				if (selector.config.view.enabledAutoHide) {
					//视图区无节点时
					if (viewer.getAllNode().length <= 0) {
						$viewer.find(".placeholder").show();
						viewer.$content.hide();
					} else {
						//有节点时
						if (!selector.config.view.enabledMultiple) {
							/*
														if (!selector.config.view.enabledMultiple && viewer.getAllNode().length == 1) {
							*/
							//单选模式
							viewer.$content.addClass("single");
						} else {
							viewer.$content.removeClass("single");
						}
						$viewer.find(".placeholder").hide();
						viewer.$content.show();
					}
				}
			}

			//点击空白区域关闭选框事件
			$("html").undelegate("body", "click.hideViewer");

			$("html").delegate("body", "click.hideViewer", function () {
				$(".ext-viewer").removeClass("focus");
				$viewer.removeClass("focus");
				$(".ext-close-popup").hide();
			});
		}
	}

	return this.init;
};

var EXT = Extension = new Extension();