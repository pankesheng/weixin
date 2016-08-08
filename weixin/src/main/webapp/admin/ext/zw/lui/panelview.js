/**
 * @class Panelview
 * @version 0.1.0
 * @author lisfan QQ@448182355 GIT@lisfan 
 * @createDate 04/12/2015
 * @requires jquery-1.11.3
 * @name 视图面板
 *       
 * ## 更新
 * - 2016.1.16
 * 		- 根据LUIController1.1重构并拓展实例化方法
 */

"use strict";

var Panelview = function (selector, setting, callback) {
	var filterArgs = _filterArguments(arguments, [["string", "plainobject", "jqobject"], ["plainobject", "string", "array"], "function"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cnew Panelview(selector, setting, callback)";
		log(errorText, "color:#f00");
		return false;
	}

	selector = filterArgs[0];
	setting = filterArgs[1];
	callback = filterArgs[2];

	var me = this;
	me._type = "panelview";
	me._version = "0.1.0";
	//弹出框扩展配置初始化
	me.config = {
		_isUserDefined: setting && (setting._isUserDefined === undefined || setting._isUserDefined === true) ? true : false,
		async: {},
		store: {},
		view: {
			//默认启用选项移除按钮
			enabledRemoveIcon: true,

			controlFormater: function () {
				return '<span class="notice">您目前的选择：</span><a class="btn btn-danger btn-large" data-role="no" href="javascript:void(0);">清空</a><a class="btn btn-success btn-large" data-role="yes" href="javascript:void(0);">确认</a>'
			}
		},
		callback: {
			loadCallback: function ($addNode, panelO) {
				//panelO.cancelSelectedNode($addNode)
				//绑定移除事件
				panelO.$content.delegate("[data-role='remove']", "click", function (event) {
					//停止冒泡至节点点击事件
					if (me.config.callback.removeClick && $.type(me.config.callback.removeClick) == "function") {
						me.config.callback.removeClick($(this), $(this).parents('[data-role="node"]'), me);
					}
				});

				//默认控制器区事件
				if (me.config.view.enabledcontrol) {
					//解除委派事件
					me.$control.undelegate();

					//存在控制区时，绑定默认事件
					//默认控制器确认事件
					me.$control.delegate("[data-role='yes']", "click", function (event) {
						//自定义点击事件
						if (me.config.callback.yesCallback && $.type(me.config.callback.yesCallback) == "function") {
							me.config.callback.yesCallback($(this), me);
						}
					});

					//默认控制器取消事件
					me.$control.delegate("[data-role='no']", "click", function (event) {
						//自定义点击事件
						if (me.config.callback.noCallback && $.type(me.config.callback.noCallback) == "function") {
							me.config.callback.noCallback($(this), me);
						}
					});
				}
			},

			nodeClick: function ($currentNode, currentData, panelO) {
				me.config.action.nodeClick($currentNode, currentData, panelO);
			},

			//每个节点生成后的回调事件
			nodeCallback: function ($currentNode, currentData, obj) {
				//移除按钮
				if (me.config.view.enabledRemoveIcon) {
					$currentNode.append('<i data-role="remove" class="iconfont">&#xe628;</i>');
				}
			},

			//移除按钮事件
			removeClick: function ($self, $currentNode, panelO) {
				stopPropagation(event);
				me.removeNode($currentNode);
			},

			//默认确认事件
			yesCallback: function ($self, panelO) {
				console.log("520")
			},

			//默认清空事件
			noCallback: function ($self, panelO) {
				console.log("789")
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
		//合并载入回调事件
		if (setting.callback && setting.callback.loadCallback) {
			setting.callback.loadCallback = _mergeFunc(setting.callback.loadCallback, me.config.callback.loadCallback);
		}

		//合并节点点击回调事件
		if (setting.callback && setting.callback.nodeClick) {
			setting.callback.nodeClick = _mergeFunc(setting.callback.nodeClick, me.config.callback.nodeClick);
		}

		//合并节点生成函数
		if (setting.callback && setting.callback.nodeCallback) {
			setting.callback.nodeCallback = _mergeFunc(setting.callback.nodeCallback, me.config.callback.nodeCallback);
		}

		//覆盖配置
		me.config = $.extend(true, me.config, setting);
	}

	LUIController.call(this, me.config, callback);
};

//继承LUIcontroller类的属性和方法
Panelview.prototype = new LUIController();

//扩展为JQ方法
$.fn.panelview = function (setting, callback) {
	//实例化
	var panelview = new Panelview(this.selector, setting, callback);
	//返回初始化对象
	return panelview;
}

//扩展为window方法
window.panelview = function (selector, setting, callback) {

	//实例化
	var panelview = new Panelview(selector, setting, callback);

	//返回初始化对象
	return panelview;
};