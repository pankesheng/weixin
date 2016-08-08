/**
 * @class SelectBox
 * @version 1.0.0
 * @author lisfan
 * @createDate 14/12/2015
 * @requires jquery-1.11.3
 * @name 选择面板
 */



//UI
//图标弹出框样式：网格结构（边框区分），图标居中，选中的标记（打勾、底色变化）
//多选或单选
//搜索：默认不开启
//网格：默认不开启
//展示：有图片则显示图片，无图片则显示文本
//选中样式名称:classname

//网格框、搜索、选中显示框

(function ($) {
	"use strict";


	var SelectBox = function (sbId, setting, callback) {

		var me = this;
		me.$me = $(sbId)

		//弹出框扩展配置初始化
		me.config = {
			_roleName: "SelectBox" + Math.round(new Date().getMilliseconds() * Math.random() * 1000),

			_userDefined: false,
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

				nodeFormater: function (nodeData) {

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
						if (me.config.view.multipleSize !== 0 && me.config.view.multipleSize !== 1) {
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
						var $getNode = sbO.getSelectedNode();
						sbO.cleanSelectedNode();
						sbO.selectNode($getNode.eq(0));
					}

				},
				nodeOnClick: function ($currentNode, sbO) {
					if (!me.config.view.enabledMultiple) {
						//单选模式
						if ($currentNode.is("[data-state='selected']")) {
							sbO.cancelSelectedNode($currentNode);
						} else {
							sbO.cleanSelectedNode();

							sbO.selectNode($currentNode, "node selected");

						}
					} else {


						if ($currentNode.is("[data-state='selected']")) {

							sbO.cancelSelectedNode($currentNode);
						} else {

							var multiplesize = null;
							if (me.config.view.multipleSize !== 0 && me.config.view.multipleSize !== 1) {
								multiplesize = me.config.view.multipleSize;
							}

							if (!multiplesize || multiplesize > sbO.getSelectedNode().length) {

								//弹框选中
								sbO.selectNode($currentNode, "node selected");
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

		LUIController.call(this, sbId, me.config, callback);
	};

	//继承自LUIcontroller
	SelectBox.prototype = new LUIController();

	//变更方法内容
	$.fn.selectbox = function (setting, callback) {
		//当前对象不存在
		if (this.length === 0) {
			console.error("%c%s%c 对象不存在，请检查", "font-weight:bold;text-decoration:underline", this.selector, "");
			return false;
		}

		//实例化
		var selectbox = new SelectBox(this, setting, callback);

		//返回初始化对象
		return selectbox;
	};

})(jQuery);