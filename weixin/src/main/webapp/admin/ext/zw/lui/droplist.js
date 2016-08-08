/**
 * @class Droplist
 * @version 0.1.0
 * @author lisfan QQ@448182355 GIT@lisfan 
 * @createDate 14/12/2015
 * @requires jquery-1.11.3
 * @name 下拉列表
 *       
 * ## 更新
 * - 2016.1.16
 * 		- 根据LUIController1.1重构并拓展实例化方法
 */

//UI
//select元素兼容模式

//滚动条样式
//多选模式
//禁用选框效果
//二级选择
//网格框、搜索、选中显示框
//多级选择，展现


"use strict";

var Droplist = function (selector, setting, callback) {
	var filterArgs = _filterArguments(arguments, [["string", "plainobject", "jqobject"], ["plainobject", "string", "array"], "function"], 1);

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
	me._version = "0.1.0";
	//弹出框扩展配置初始化
	me.config = {
		_isUserDefined: setting && (setting._isUserDefined === undefined || setting._isUserDefined === true) ? true : false,
		async: {},
		store: {},
		view: {
			//可用模式
			enabled: true,
			//主要显示:image，只显示图片，标题作为图片title属性
			//主要显示:text，只显示文本，忽略图片
			//主要显示:all，即(先）显示图片，也显示文本
			mainShow: "all",

			//启用多选
			enabledMultiple: false,
			//多选个数限制
			multipleSize: null,
			//选中即时显示
			enabledShowSelected: true,
			enabledSearch: true,
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
			},

		},
		callback: {
			loadCallback: function ($addNode, dlO) {
				dlO.config.action.initSelectedState(dlO);
			},
			nodeClick: function ($currentNode, currentData, dlO) {
				//如果元素禁用，则不可点击
				if (currentData.state == "disabled") {
					stopPropagation(event);
					return false;
				}

				dlO.config.action.nodeClick($currentNode, currentData, dlO);
			},
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

		//覆盖配置
		me.config = $.extend(true, me.config, setting);
	}

	//判断html元素类型，如果是select元素则重置配置参数
	//如果是select元素并且用户进行了自定义配置setting
	me.$me = $(me.config.selector);
	if (me.$me.get(0).nodeName == "SELECT" && !setting) {
		if (me.$me.attr("disabled")) me.config.view.enabled = false;
		if (me.$me.attr("multiple")) me.config.view.enabledMultiple = true;
		if (me.$me.attr("size")) me.config.view.multipleSize = me.$me.attr("size");

		//转换option数据
		var $option = me.$me.find("option");
		var optionDataArray = [];
		for (var i = 0; i < $option.length; i++) {
			var $currentOption = $option.eq(i);
			var currentOptionData = {};
			currentOptionData.name = $currentOption.text();
			currentOptionData.value = $currentOption.val();
			if ($currentOption.attr("disabled")) {
				currentOptionData.state = $currentOption.attr("disabled");
			}
			if ($currentOption.attr("selected")) {
				currentOptionData.state = $currentOption.attr("selected");
			}
			optionDataArray.push(currentOptionData);
		}

		me.config.store.data = optionDataArray;

		//隐藏自己，创建代替者，变更实例指向
		me.$me.hide();
		me.$me.after($('<div id="' + me.$me.attr("id") + 'Droplist" class="droplist hide close-popup"></div>'))
		me.config.selector += "Droplist";
	}

	LUIController.call(this, me.config, callback);
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