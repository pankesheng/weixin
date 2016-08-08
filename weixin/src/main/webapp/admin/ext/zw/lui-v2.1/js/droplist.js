/**
 * @class Droplist
 * @version 0.2.0
 * @author lisfan QQ@448182355 GIT@lisfan 
 * @createDate 14/12/2015
 * @requires jquery-1.11.3
 * @name 下拉列表
 *       
 * ## 更新
 * - 2016.1.16
 * 		- 根据LUIController0.1重构并拓展实例化方法
 * - 2016.3.08
 * 		- 根据LUIController0.4重构并拓展实例化方法 
 * - 2016.3.21
 * 		- 根据LUIController0.5重构并拓展实例化方法  
 */

"use strict";

var Droplist = function (selector, setting, callback) {
	var filterArgs = _filterArguments(arguments, [["string", "plainobject", "jqobject"], ["plainobject", "string", "array"], "function"]);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cnew Droplist(selector, setting, callback)";
		log(errorText, "color:#f00");
		return false;
	}

	selector = filterArgs[0];
	setting = filterArgs[1];
	callback = filterArgs[2];

	var me = this;

	me._type = "droplist";
	me._version = "0.3.0";
	
	//弹出框扩展配置初始化
	me.config = {
		view: {
			//显示方式:2=image，只显示图片，标题作为图片title属性
			//显示方式:1=text，只显示文本，忽略图片
			//显示方式(默认):0=all，即(先）显示图片，也显示文本
			showType: 0,
			nodeFormater: function (nodeData, nodeIndex) {
				//根据不同的显示要求生成项html
				if (me.config.view.showType === 2) {
					return '<div><img src="' + nodeData.image + '" alt="' + nodeData[me.config.key.nameKey] + '" title="' + nodeData[me.config.key.nameKey] + '"></div>';

				} else if (me.config.view.showType === 1) {
					return '<div><span class="name" title="' + nodeData[me.config.key.nameKey] + '">' + nodeData[me.config.key.nameKey] + '</span></div>';
				} else {
					//名称如果未填写容错处理放置空白符
					if (!nodeData[me.config.key.nameKey]) {
						nodeData[me.config.key.nameKey] = "&nbsp;"
					}

					var imageHtml = "";
					if (nodeData.image) {
						imageHtml = '<img src="' + nodeData.image + '" alt="' + nodeData[me.config.key.nameKey] + '" title="' + nodeData[me.config.key.nameKey] + '">';
					}
					return "<div>" + imageHtml + '<span class="name" title="' + nodeData[me.config.key.nameKey] + '">' + nodeData[me.config.key.nameKey] + '</span></div>';
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
		/*//合并参数配置成功回调事件
		if (setting.callback && setting.callback.configCallback) {
			setting.callback.configCallback = _mergeFunc(setting.callback.configCallback, me.config.callback.configCallback);
		}*/
		//覆盖配置
		me.config = $.extend(true, me.config, setting);
	}

	//判断选择器对应的HTML元素类型，如果是select元素则依据select元素的属性重置配置参数
	if ($(me.config.selector).length > 0) {
		var $selector = $(me.config.selector).eq(0);
		if ($selector.get(0).nodeName == "SELECT") {
			//转换select属性数据
			if ($selector.attr("disabled")) me.config.view.enabled = false;
			if ($selector.attr("multiple")) me.config.view.selectedMultiple = true;
			if ($selector.attr("size")) me.config.view.selectedSize = $selector.attr("size");

			//转换option属性数据
			var $option = $selector.find("option");
			var optionDataArray = [];
			for (var i = 0; i < $option.length; i++) {
				var $currentOption = $option.eq(i);
				var currentOptionData = {};
				currentOptionData.name = $currentOption.text();
				currentOptionData.value = $currentOption.val();
				if ($currentOption.attr("disabled")) {
					currentOptionData.disabled = true;
				}
				if ($currentOption.attr("selected")) {
					currentOptionData.selected = true;
				}
				optionDataArray.push(currentOptionData);
			}
			me.config.store = {};
			me.config.store.data = optionDataArray;
			//隐藏自己，创建代替者，变更实例指向
			$selector.hide();
			$selector.after($('<div id="' + $selector.attr("id") + 'Droplist" class="ext-droplist close-popup"></div>'));
			me.config.selector += "Droplist";
		}
	}

	if (selector) {
		//非原型链式继承
		LUIController.call(this, me.config, callback);
	}
};

//继承LUIcontroller类的属性和方法
Droplist.prototype = new LUIController();

//扩展为JQ方法
$.fn.droplist = function (setting, callback) {
	//实例化
	var droplist = new Droplist(this.selector, setting, callback);
	//返回初始化对象
	return droplist;
}

//扩展为window方法
window.droplist = function (selector, setting, callback) {
	//实例化
	var droplist = new Droplist(selector, setting, callback);
	//返回初始化对象
	return droplist;
};