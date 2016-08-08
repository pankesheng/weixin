/**
 * @class Panelview
 * @version 1.1.0
 * @author lisfan
 * @createDate 04/12/2015
 * @requires jquery-1.11.3
 * @name 视图面板
 */

(function ($) {
	"use strict";

	var Panelview = function (panelId, setting, callback) {

		var me = this;
		me.$me = $(panelId)

		//弹出框扩展配置初始化
		me.config = {
			_roleName: "Panelview" + Math.round(new Date().getMilliseconds() * Math.random() * 1000),
			_userDefined: false,
			view: {
				//默认启用选项移除按钮
				enabledRemoveIcon: true,
				enabledcontrol: true,

				nodeFormater: function (nodeData,nodeIndex) {
					return '<div><span>' + nodeData.name + '</span></div>';
				},
				controlFormater: function () {
					return '<span class="notice">您目前的选择：</span><a class="btn btn-danger btn-large" data-role="no" href="javascript:void(0);">清空</a><a class="btn btn-success btn-large" data-role="yes" href="javascript:void(0);">确认</a>'
				}

			},
			callback: {
				loadCallback: function ($addNode, panelO) {

					panelO.cancelSelectedNode($addNode)

					//绑定移除事件
					panelO.$content.delegate("[data-role='remove']", "click", function (event) {
						me.config.callback.removeOnClick($(this), $(this).parents('[data-role="node"]'), panelO);
					})
				},

				nodeCallback: function ($currentNode, panelO) {
					if (me.config.view.enabledRemoveIcon) {
						$currentNode.append('<i data-role="remove" class="iconfont">&#xe628;</i>')
					}
				},
				nodeOnClick: function ($currentNode, panelO) {},

				removeOnClick: function ($self, $currentNode, panelO) {
					me.removeNode($currentNode);
					event.stopPropagation();
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

		LUIController.call(this, panelId, me.config, callback);
	};

	//继承自LUIcontroller
	Panelview.prototype = new LUIController();

	//变更方法内容
	$.fn.panelview = function (setting, callback) {
		//当前对象不存在
		if (this.length === 0) {
			console.error("%c%s%c 对象不存在，请检查", "font-weight:bold;text-decoration:underline", this.selector, "");
			return false;
		}

		//实例化
		var panelview = new Panelview(this, setting, callback);

		//返回初始化对象
		return panelview;
	};

})(jQuery);