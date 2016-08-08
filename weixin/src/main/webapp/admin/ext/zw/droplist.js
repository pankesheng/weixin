/**
 * @class Droplist
 * @version 1.0.0
 * @author lisfan
 * @createDate 14/12/2015
 * @requires jquery-1.11.3
 * @name 下拉选择
 */



//UI
//select元素兼容模式

//滚动条样式
//多选模式
//禁用选框效果
//二级选择
//网格框、搜索、选中显示框
//多级选择，展现


(function ($) {
	"use strict";

	var Droplist = function (sbId, setting, callback) {

		var me = this;
		me.$me = $(sbId);

		//弹出框扩展配置初始化
		me.config = {
			_roleName: "Droplist" + Math.round(new Date().getMilliseconds() * Math.random() * 1000),
			_userDefined: false,
			store: {

			},
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
				nodeFormater: function (nodeData) {

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
						return "<div>"+imageHtml + '<span class="name" title="' + nodeData.name + '">' + nodeData.name + '</span></div>';
					}
				},

			},
			callback: {
				loadCallback: function ($addNode, dlO) {
					//初始化选中状态，如果单选模式，又配置了多个选中状态，则只选中第一个设置为选中的
					if (me.config.view.enabledMultiple) {
						//多选
						var $getNode = dlO.getSelectedNode();

						var multiplesize = null;
						if (me.config.view.multipleSize !== 0 && me.config.view.multipleSize !== 1) {
							multiplesize = me.config.view.multipleSize;
						};

						if (multiplesize) {
							dlO.cleanSelectedNode();
							while (multiplesize > 0) {
								dlO.selectNode($getNode.eq(multiplesize - 1));
								multiplesize--
							}
						}
					} else if (!me.config.view.enabledMultiple) {
						var $getNode = dlO.getSelectedNode();
						dlO.cleanSelectedNode();
						dlO.selectNode($getNode.eq(0));
					}
				},
				nodeOnClick: function ($currentNode, dlO) {
					//如果元素禁用，则不可点击
					if ($currentNode.data("state") == "disabled") {
						event.stopPropagation();

						return false;
					}

					if (!me.config.view.enabledMultiple) {
						//单选模式
						if ($currentNode.is("[data-state='selected']")) {
							dlO.cancelSelectedNode($currentNode);
						} else {
							dlO.cleanSelectedNode();
							dlO.selectNode($currentNode, "node selected");
						}
					} else {
						if ($currentNode.is("[data-state='selected']")) {
							dlO.cancelSelectedNode($currentNode);
						} else {
							var multiplesize = null;
							if (me.config.view.multipleSize !== 0 && me.config.view.multipleSize !== 1) {
								multiplesize = me.config.view.multipleSize;
							}
							if (!multiplesize || multiplesize > dlO.getSelectedNode().length) {
								//弹框选中
								dlO.selectNode($currentNode, "node selected");
							}
						}
					}
				},

			}

		};

		//合并载入回调事件
		if (setting && setting.callback && setting.callback.loadCallback) {
			setting.callback.loadCallback = merge(me.config, setting, "loadCallback");
		}

		//合并节点点击回调事件
		if (setting && setting.callback && setting.callback.nodeOnClick) {
			setting.callback.nodeOnClick = merge(me.config, setting, "nodeOnClick");
		}
		//覆盖配置
		me.config = $.extend(true, me.config, setting);

		if (setting && $.type(setting._userDefined) == "undefined") {
			me.config._userDefined = true;
		}


		//判断元素类型，重置配置参数
		//如果是select元素并且setting不存在

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
			me.$me = me.$me.next();
			sbId = "#" + me.$me.attr("id");
		}

		LUIController.call(this, sbId, me.config, callback);
	};

	//继承自LUIcontroller
	Droplist.prototype = new LUIController();

	//变更方法内容
	$.fn.droplist = function (setting, callback) {
		//当前对象不存在
		if (this.length === 0) {
			console.error("%c%s%c 对象不存在，请检查", "font-weight:bold;text-decoration:underline", this.selector, "");
			return false;
		}

		//实例化
		var droplist = new Droplist(this, setting, callback);

		//返回初始化对象
		return droplist;
	};

})(jQuery);