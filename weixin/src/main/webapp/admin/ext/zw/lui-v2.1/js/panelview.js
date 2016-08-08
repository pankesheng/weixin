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
	var filterArgs = _filterArguments(arguments, [["string", "plainobject", "jqobject"], ["plainobject", "string", "array"], "function"]);

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
		view: {
			enabledSelectMode: false,
			showRemoveIcon: true, //是否显示移除按钮，默认关闭false
			enabledControl: false
		},
		callback: {
			loadCallback: function (self) {
				//解除委派
				self.$content.off("click._removeNode", "[data-role='ext-remove-icon']");

				//委派移除按钮事件
				self.$content.on("click._removeNode", "[data-role='ext-remove-icon']", function (event) {
					event.stopPropagation();
					var $node = $(this.closest("[data-role='node']"));
					var nodeData = me.getDataById($node)[0];

					//禁用节点不执行事件
					if (nodeData.disabled === true) {
						return false;
					}

					if ($.type(self.config.callback.removeIconCallback) == "function") {
						self.config.callback.removeIconCallback($node, self);
					}
					self.removeNode($node);
				});
			},

			nodeCallback: function ($node, nodeData, self) {
				//增加移除按钮
				if (self.config.view.showRemoveIcon === true) {
					$node.append('<i data-role="ext-remove-icon" class="iconfont">&#xe628;</i>');
				}
			},

			controlCallback: function (self) {
				if (self.config.view.enabledControl === true) {
					self.config.view.controlFormater = function () {
						return '<span class="notice">您目前的选择：</span><a class="btn btn-danger btn-large" data-role="btn-no" href="javascript:void(0);">清空</a><a class="btn btn-success btn-large" data-role="btn-yes" href="javascript:void(0);">确认</a>';
					};

					//解除委派事件
					self.$control.off("click._yesCallback", "[data-role='btn-yes']");
					//存在控制区时，绑定默认事件
					//默认控制器确认事件
					self.$control.on("click._yesCallback", "[data-role='btn-yes']", function (event) {
						event.stopPropagation();

						if ($.type(self.config.callback.yesCallback) == "function") {
							var allData = self.getAllData();
							self.config.callback.yesCallback(allData, self);
						}
					});
					self.$control.off("click._noCallback", "[data-role='btn-no']");

					//默认控制器取消事件
					self.$control.on("click._noCallback", "[data-role='btn-no']", function (event) {
						event.stopPropagation();
						//清空节点
						self.cleanNode();
						if ($.type(self.config.callback.noCallback) == "function") {
							self.config.callback.noCallback(self);
						}
					});

				}
			},

			//移除按钮回调事件
			removeIconCallback: function ($node, self) {},

			//控制区确认按钮回调事件
			yesCallback: function (allData, self) {},

			//控制区清空按钮回调事件
			noCallback: function (self) {}
		}
	};

	if (selector && $.type(selector) == "string") {
		me.config.selector = selector;
	} else if (selector && !$.isPlainObject(selector)) {
		me.config.selector = selector.selector;
	} else if (selector && $.isPlainObject(selector)) {
		//覆盖参数
		setting = selector;
	}

	//根据setting类型配置参数
	if (setting && $.type(setting) == "string") {
		//如果是url连接，则开启async
		me.config.async = {};
		me.config.async.enabled = true;
		me.config.async.url = setting;
	} else if (setting && $.type(setting) == "array") {
		//如果是原生对象，则附加data
		me.config.store = {};
		me.config.store.data = setting;
	} else if (setting && $.type(setting) == "object") {
		//合并载入回调事件
		if (setting.callback && setting.callback.loadCallback) {
			setting.callback.loadCallback = _mergeFunc(setting.callback.loadCallback, me.config.callback.loadCallback);
		}
		//合并控制区回调事件
		if (setting.callback && setting.callback.controlCallback) {
			setting.callback.controlCallback = _mergeFunc(setting.callback.controlCallback, me.config.callback.controlCallback);
		}
		//合并节点生成函数
		if (setting.callback && setting.callback.nodeCallback) {
			setting.callback.nodeCallback = _mergeFunc(setting.callback.nodeCallback, me.config.callback.nodeCallback);
		}

		//覆盖配置
		me.config = $.extend(true, me.config, setting);
	}

	if (selector) {
		//非原型链式继承
		LUIController.call(this, me.config, callback);
	}
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