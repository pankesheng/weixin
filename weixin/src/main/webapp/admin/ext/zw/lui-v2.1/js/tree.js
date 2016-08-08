/**
 * @class Tree
 * @version 0.2.0
 * @author lisfan QQ@448182355 GIT@lisfan 
 * @createDate 04/02/2016
 * @requires jquery-1.11.3
 * @name 树列表插件
 * 
 * ## 更新
 * - 2016.2.14
 * 		- 根据LUIController 增强版 重构
 * - 2016.3.04
 * 		- 根据LUIController-v0.4 增强版 重构
 * - 2016.3.17
 * 		- 根据LUIController-v0.5 增强版 重构
 */

"use strict";

var Tree = function (selector, setting, callback) {
	var filterArgs = _filterArguments(arguments, [["string", "plainobject", "jqobject"], ["plainobject", "string", "array"], "function"]);

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
	me._version = "0.2.0";

	//弹出框扩展配置初始化
	me.config = {
		view: {
			enabled: true, //可用模式
			enabledFilter: false, //启用搜索区
			enabledAutoHide: true, //启用自动关闭：表示为选中达到条件后后自动关闭树
		},
		callback: {
			configCallback: function (self) {
				//配置变更
				if (self.config.view.enabledFilter) {
					self.config.view.enabledControl = true;
				}
			},
			controlCallback: function (self) {
				if (self.config.view.enabledFilter) {
					//创建搜索区DOM
					//若已经存在，则不再创建
					if (self.$control.find(".ext-filter").length <= 0) {
						var $filter = $("<div class='ext-filter'/>");
						var $filterInput = $('<input class="form-control" type="text" name="filterInput" id="filterInput" style="width:50%;margin:10px">');
						var $filterBtn = $('<a href="javascript:void(0);" class="btn btn-primary" id="filterBtn"><i class="iconfont"></i>搜索</a>');
						$filter.append($filterInput, $filterBtn).appendTo(self.$control);

						//绑定事件
						$filter.delegate("#filterBtn", "click._filterNode", function (event) {
							stopPropagation(event);
							self.filterNode($filterInput.val(), true);
						});
						$filter.delegate("#filterInput", "click._stopPropagation", function (event) {
							stopPropagation(event);
						});
						$filter.delegate("#filterInput", "keyup._reset", function (event) {
							stopPropagation(event);
							if ($.trim($filterInput.val()) == "") {
								//为空时，触发一次查找
								self.filterNode($filterInput.val());
							}
						});
					}
				}
			}
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
		//合并参数配置成功回调事件
		if (setting.callback && setting.callback.configCallback) {
			setting.callback.configCallback = _mergeFunc(setting.callback.configCallback, me.config.callback.configCallback);
		}

		//合并控制回调事件
		if (setting.callback && setting.callback.controlCallback) {
			setting.callback.controlCallback = _mergeFunc(setting.callback.controlCallback, me.config.callback.controlCallback);
		}

		//覆盖配置
		me.config = $.extend(true, me.config, setting);
		//插件对象实例化时不支持用户自定义，
		//用户自定义更新配置等只能通过load重载配置
	}

	if (selector) {
		//非原型链式继承
		LUIController.call(this, me.config, callback);
	}
};

//继承LUIcontroller类的属性和方法
Tree.prototype = new LUIController();

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