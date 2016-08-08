/**
 * @class Tree
 * @version 0.1.0
 * @author lisfan QQ@448182355 GIT@lisfan 
 * @createDate 04/02/2016
 * @requires jquery-1.11.3
 * @name 树列表插件
 * 
 * ## 更新
 * - 2016.2.14
 * 		- 根据LUIControllerAdvance重构并拓展实例化方法
 */

"use strict";

var Tree = function (selector, setting, callback) {
	var filterArgs = _filterArguments(arguments, [["string", "plainobject", "jqobject"], ["plainobject", "string", "array"], "function"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cnew Tree(selector, setting, callback)";
		log(errorText, "color:#f00");
		return false;
	}

	selector = filterArgs[0];
	setting = filterArgs[1];
	callback = filterArgs[2];

	var me = this;
	me._type = "tree";
	me._version = "0.1.0";
	//弹出框扩展配置初始化
	me.config = {
		_isUserDefined: setting && (setting._isUserDefined === undefined || setting._isUserDefined === true) ? true : false,
		view: {
			//可用模式
			enabled: true,
			enabledControl: false,
			enabledFilter: false, //开启搜索区
			//可用模式
			//主要显示:image，只显示图片，标题作为图片title属性
			//主要显示:text，只显示文本，忽略图片
			//主要显示:all，即(先）显示图片，也显示文本
			mainShow: "all",
			//启用多选
			enabledMultiple: false,
			//启用自动关闭：表示为选中达到条件后后自动关闭树
			enabledAutoHide: true,
			//多选个数限制
			multipleSize: null,
			nodeFormater: function (nodeData, nodeIndex) {
				//根据不同的显示要求生成项html
				if (me.config.view.mainShow == "image") {
					return '<div><img src="' + nodeData.image + '" alt="' + nodeData.name + '" title="' + nodeData.name + '"></div>';

				} else if (me.config.view.mainShow == "text") {
					return '<div><span class="name" title="' + nodeData.name + '">' + nodeData.name + '</span></div>';
				} else {
					//名称如果未填写容错处理放置空白符
					if (!nodeData.name) {
						nodeData.name = "&nbsp;"
					}

					var imageHtml = "";
					if (nodeData.image) {
						imageHtml = '<img src="' + nodeData.image + '" alt="' + nodeData.name + '" title="' + nodeData.name + '">';
					}
					return "<div>" + imageHtml + '<span class="name" title="' + nodeData.name + '">' + nodeData.name + '</span></div>';
				}
			}
		},
		callback: {
			configCallback: function (config, obj) {
				if (config.view.enabledFilter) {
					config.view.enabledControl = true;
				}
			},
			loadCallback: function ($addNode, obj) {

				obj.config.action.initSelectedNode(obj);

				/*var $getNode = obj.getSelectedNode();
				for (var i = 0; i < $getNode.length; i++) {
					var $currentNode = $getNode.eq(i);
					var currentData = obj.getDataById($currentNode);
					if (currentData.state == "selected") {
						obj.config.action._selectRelation($currentNode, currentData, obj)
					}
				}*/
			},
			clickNode: function ($currentNode, currentData, obj) {
				//如果元素禁用，则不可点击
				if (currentData.state == "disabled") {
					stopPropagation(event);
					return false;
				}

				obj.config.action.selectNode($currentNode, currentData, obj);

				//级联选中问题
				//0.若选中的该节点A存在子节点，则全部子节点全部取消选中状态
				//1.若选中的该节点存在父节点B，则查询节点A兄弟节点的选中状态
				//2.若父节点B兄弟节点未全部选中，则父节点B不选中，
				//3.若父节点B兄弟节点全部选中，则父节点B选中，继续向上查找父节点B情况，1-3步骤

				//todo 从属关系不只只有点击事件，像是添加节点等事件也会有从属关系，需要更改？

				//obj.config.action._selectRelation($currentNode, currentData, obj)
			},
			expandNode: function ($currentSwitcher, $currentNode, currentData, obj) {
				me.config.action.expandNode($currentSwitcher, $currentNode, currentData, obj);
			},
			controlCallback: function ($control,obj) {
				if (obj.config.view.enabledFilter) {
					//创建搜索区格式
					//若已经存在，则不再创建
					if ($control.find(".ext-filter").length <= 0) {
						var $filter = $("<div class='ext-filter'/>");
						var $filterVal = $('<input class="form-control" type="text" name="filterVal" id="filterVal" style="width:50%;margin:10px">');
						var $filterBtn = $('<a href="javascript:void(0);" class="btn btn-primary" id="filterBtn"><i class="iconfont"></i>搜索</a>');
						//绑定事件
						$filter.delegate("#filterBtn", "click._filterNode", function (event) {
							stopPropagation(event);
							obj.filterNode($filterVal.val());
						});
						$filter.delegate("#filterVal", "click._stopPropagation", function (event) {
							stopPropagation(event);
						});
						$filter.delegate("#filterVal", "keyup._restore", function (event) {
							stopPropagation(event);
							if ($.trim($filterVal.val()) == "") {
								//为空时，触发一次查找
								obj.filterNode($filterVal.val());
							}
						});
						$filter.append($filterVal).append($filterBtn);
						$control.append($filter);
					}
				}
			}
		},
		action: {
			_selectParent: function ($node, nodeData, me) {
				if (nodeData.hasChild) {
					//若存在子节点，则取消所有子节点的选中状态
					//存在子节点
					//获取该节点下的子节点
					var $getChildNode = me.getSelectedChildrenNode($node);
					//全部取消选中
					if ($getChildNode.length > 0) {
						me.cancelSelectedNode($getChildNode);
						$getChildNode.trigger("click.addViewerNode");
					}
				}
				//存在父节点时，递归
				if (nodeData.hasParent) {
					//显示父节点
					var $parentNode = me.getNodeById(nodeData.pId);
					var parentData = me.getDataById($parentNode);
					//获取父节点下的所有同备节点，包括自已

					var $siblingsNode;

					$siblingsNode = me.getAllNode(nodeData.level, me.getNodeById(nodeData.pId));
					//筛选出选中节点
					var $siblingsSelectedNode = $.grep($siblingsNode, function (value, index) {
						return me.getDataById($(value)).state == "selected"
					})

					//父节点下子节点长度与子节点选中长度相等 
					if (parentData.length == $siblingsSelectedNode.length) {
						//选中父亲并递归查找
						me.selectNode($parentNode);
						$parentNode.trigger("click.addViewerNode");
						me.config.action._selectParent($parentNode, parentData, me);
					} else {
						//递归查找同一线上的父节点全部取消选中
						me.cancelSelectedNode($parentNode);
						$parentNode.trigger("click.addViewerNode");
						var _parentData = parentData;
						var _hasParent = _parentData.hasParent;
						while (_parentData.hasParent) {
							var $_topNode = me.getNodeById(_parentData.pId);
							me.cancelSelectedNode($_topNode);
							$_topNode.trigger("click.addViewerNode");
							_parentData = me.getDataById($_topNode);
						}
					}
				}
			},
			_selectRelation: function ($node, nodeData, me) {
				//如果存在子节点，则全部选中
				/*if (nodeData.hasChild) {
					//若存在子节点，则取消所有子节点的选中状态
					//存在子节点
					//获取该节点下的子节点
					var $getChildNode = me.getSelectedChildrenNode($node);
					//全部取消选中
					if ($getChildNode.length > 0) {
						me.cancelSelectedNode($getChildNode);
						$getChildNode.trigger("click.addViewerNode");
					}
				}*/
				//存在父节点时，递归
				if (nodeData.hasParent) {
					//显示父节点
					var $parentNode = me.getNodeById(nodeData.pId);
					var parentData = me.getDataById($parentNode);
					//获取父节点下的所有同备节点，包括自已

					var $siblingsNode;

					$siblingsNode = me.getAllNode(nodeData.level, me.getNodeById(nodeData.pId));
					//筛选出选中节点
					var $siblingsSelectedNode = $.grep($siblingsNode, function (value, index) {
						return me.getDataById($(value)).state == "selected"
					})

					//父节点下子节点长度与子节点选中长度相等 
					if (parentData.length == $siblingsSelectedNode.length) {
						//选中父亲并递归查找
						me.selectNode($parentNode);
						$parentNode.trigger("click.addViewerNode");
						me.config.action._selectRelation($parentNode, parentData, me);
					} else {
						//递归查找同一线上的父节点全部取消选中
						me.cancelSelectedNode($parentNode);
						$parentNode.trigger("click.addViewerNode");
						var _parentData = parentData;
						var _hasParent = _parentData.hasParent;
						while (_parentData.hasParent) {
							var $_topNode = me.getNodeById(_parentData.pId);
							me.cancelSelectedNode($_topNode);
							$_topNode.trigger("click.addViewerNode");
							_parentData = me.getDataById($_topNode);
						}
					}
				}
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
		//合并参数配置成功回调事件
		if (setting.callback && setting.callback.configCallback) {
			setting.callback.configCallback = _mergeFunc(setting.callback.configCallback, me.config.callback.configCallback);
		}

		//合并载入成功回调事件
		if (setting.callback && setting.callback.loadCallback) {
			setting.callback.loadCallback = _mergeFunc(setting.callback.loadCallback, me.config.callback.loadCallback);
		}

		//合并节点展开回调事件
		if (setting.callback && setting.callback.clickNode) {
			setting.callback.clickNode = _mergeFunc(me.config.callback.clickNode,setting.callback.clickNode);
		}

		//合并节点点击回调事件
		if (setting.callback && setting.callback.expandNode) {
			setting.callback.expandNode = _mergeFunc(setting.callback.expandNode, me.config.callback.expandNode);
		}

		//合并控制台回调事件
		if (setting.callback && setting.callback.controlCallback) {
			setting.callback.controlCallback = _mergeFunc(setting.callback.controlCallback, me.config.callback.controlCallback);
		}

		//覆盖配置
		me.config = $.extend(true, me.config, setting);
	}

	LUIControllerAdvance.call(this, me.config, callback);
};

//继承LUIcontroller类的属性和方法
Tree.prototype = new LUIControllerAdvance();

//扩展为JQ方法
$.fn.tree = function (setting, callback) {
	//实例化
	var tree = new Tree(this.selector, setting, callback);
	//返回初始化对象
	return tree;
}

//扩展为window方法
window.tree = function (selector, setting, callback) {

	//实例化
	var tree = new Tree(selector, setting, callback);

	//返回初始化对象
	return tree;
};