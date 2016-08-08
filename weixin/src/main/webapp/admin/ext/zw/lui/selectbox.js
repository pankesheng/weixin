/**
 * @class Selectbox
 * @version 0.1.0
 * @author lisfan QQ@448182355 GIT@lisfan 
 * @createDate 14/12/2015
 * @requires jquery-1.11.3
 * @name 选择列表
 * 
 * ## 更新
 * - 2016.1.16
 * 		- 根据LUIController1.1重构并拓展实例化方法
 */



//UI
//图标弹出框样式：网格结构（边框区分），图标居中，选中的标记（打勾、底色变化）
//多选或单选
//搜索：默认不开启
//网格：默认不开启
//展示：有图片则显示图片，无图片则显示文本
//选中样式名称:classname

//网格框、搜索、选中显示框

"use strict";

var Selectbox = function (selector, setting, callback) {
	var filterArgs = _filterArguments(arguments, [["string", "plainobject", "jqobject"], ["plainobject", "string", "array"], "function"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cnew Selectbox(selector, setting, callback)";
		log(errorText, "color:#f00");
		return false;
	}

	selector = filterArgs[0];
	setting = filterArgs[1];
	callback = filterArgs[2];

	var me = this;
	me._type = "selectbox";
	me._version = "0.1.0";
	//弹出框扩展配置初始化
	me.config = {
		_isUserDefined: setting && (setting._isUserDefined === undefined || setting._isUserDefined === true) ? true : false,
		async: {},
		store: {},
		view: {
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
			//启用网格(未支持)
			enabledGrid: true,
			//TODO启用搜索(未支持)
			enabledSearch: true,
			//TODO启用分页(未支持)
			enabledPagination: true,
			//TODO 分页每页数目
			paginationNumber: 2,
			//TODO启用视图(未支持)
			enabledPanelview: true,
			nodeFormater: function (nodeData, nodeIndex) {
				//根据不同的显示要求生成项html
				if (me.config.view.mainShow == "image") {
					return '<div><a href="javascript:void(0);" title="' + nodeData.name + '"><img src="' + nodeData.image + '" alt="' + nodeData.name + '" title="' + nodeData.name + '"></a><span class="iconfont icon-state">&#xe647;</span></div>';

				} else if (me.config.view.mainShow == "text") {
					return '<div><a href="javascript:void(0);" title="' + nodeData.name + '"><span class="name" title="' + nodeData.name + '">' + nodeData.name + '</span></a><span class="iconfont icon-state">&#xe647;</span></div>';
				} else {
					//名称如果未填写容错处理放置空白符
					if (!nodeData.name) {
						nodeData.name = "&nbsp;"
					}
					var imageHtml = "";
					if (nodeData.image) {
						imageHtml = '<img src="' + nodeData.image + '" alt="' + nodeData.name + '" title="' + nodeData.name + '">';
					}

					return '<div><a href="javascript:void(0);" title="' + nodeData.name + '">' + imageHtml + '<span class="name" title="' + nodeData.name + '">' + nodeData.name + '</span></a><span class="iconfont icon-state">&#xe647;</span></div>';
				}
			},
		},
		callback: {
			loadCallback: function ($addNode, sbO) {
				//初始化选中状态，如果单选模式，又配置了多个选中状态，则只选中第一个设置为选中的
				if (me.config.view.enabledMultiple) {
					//多选
					var $getNode = sbO.getSelectedNode();

					var multiplesize = null;
					if (me.config.view.multipleSize > 1) {
						multiplesize = me.config.view.multipleSize;
					};

					if (multiplesize) {
						sbO.cleanSelectedNode();
						while (multiplesize > 0) {
							sbO.selectNode($getNode.eq(multiplesize - 1));
							multiplesize--
						}
					}
				} else if (!me.config.view.enabledMultiple) {
					//单选
					var $getNode = sbO.getSelectedNode();
					sbO.cleanSelectedNode();
					sbO.selectNode($getNode.eq(0));
				}
			},
			nodeClick: function ($currentNode, currentData, sbO) {
				me.config.action.nodeClick($currentNode, currentData, sbO);
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

	LUIController.call(this, me.config, callback);

};

//继承LUIcontroller类的属性和方法
Selectbox.prototype = new LUIController();

//扩展为JQ方法
$.fn.selectbox = function (setting, callback) {
	//实例化
	var selectbox = new Selectbox(this.selector, setting, callback);
	//返回初始化对象
	return selectbox;
}

//扩展为window方法
window.selectbox = function (selector, setting, callback) {

	//实例化
	var selectbox = new Selectbox(selector, setting, callback);

	//返回初始化对象
	return selectbox;
};