/**
 * @class Builder
 * @version 0.1.0
 * @author lisfan QQ@448182355 GIT@lisfan 
 * @createDate 26/01/2016
 * @requires jquery-1.11.3
 * @name 内容生成插件
 * 
 * ## 更新
 * - XXXX
 * 		- XXXX
 */

"use strict";

var Builder = function (selector, setting, callback) {
	var filterArgs = _filterArguments(arguments, [["string", "plainobject", "jqobject"], ["plainobject", "string", "array"], "function"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cnew Builder(selector, setting, callback)";
		log(errorText, "color:#f00");
		return false;
	}

	selector = filterArgs[0];
	setting = filterArgs[1];
	callback = filterArgs[2];

	var me = this;
	me._type = "builder";
	me._version = "0.1.0";
	//弹出框扩展配置初始化
	me.config = {
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
		me.config.async = {};
		me.config.async.enabled = true;
		me.config.async.url = setting;
	} else if (setting && $.type(setting) == "array") {
		//如果是原生对象，则附加data
		me.config.store = {};
		me.config.store.data = setting;
	} else if (setting && $.type(setting) == "object") {
		//覆盖配置
		me.config = $.extend(true, me.config, setting);
	}

	LUIController.call(this, me.config, callback);
};

//继承LUIcontroller类的属性和方法
Builder.prototype = new LUIController();

//扩展为JQ方法
$.fn.builder = function (setting, callback) {
	//实例化
	var builder = new Builder(this.selector, setting, callback);
	//返回初始化对象
	return builder;
}

//扩展为window方法
window.builder = function (selector, setting, callback) {

	//实例化
	var builder = new Builder(selector, setting, callback);

	//返回初始化对象
	return builder;
};