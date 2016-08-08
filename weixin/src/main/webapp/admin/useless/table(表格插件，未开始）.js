/**
 * @class Table
 * @version 1.0.0.0
 * @author lisfan
 * @createDate 26/01/2016
 * @requires jquery-1.11.3
 * @name 表格插件
 * 
 * 
 * ## TODO
 * - 包含原有grid.js的功能
 * - 表格生成一是table content区的html元素会发生变化，原先为div，需要变成table
 * - 可能还会有一些tbody元素
 * - 还有表头的设置这个地方基本可能会不发生变化
 * - 用loadCallback更改content的html元素名，并生成固定不变的表头格式
 * - 要扩展一些方法：比如取得一列的数据，获取指定序位的数据(使用getNodeById)
 * ## 更新
 * 
 * - XXXX
 * 
 * 		- XXXX
 */


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
				nodeFormater: function (nodeData) {
					var state = {
						start: "实施中",
						stop: "暂停中",
						wait: "待开始",
						finish: "已结束",
					}

					var html = '<tr class="node"><td class="cell">' + nodeData.date + '</td><td class="cell left"><a href="' + nodeData.url + '" title="' + nodeData.name + '">' + nodeData.name + '</a></td><td class="cell">' + nodeData.leader + '</td><td class="cell state ' + nodeData.state + '">' + state[nodeData.state] + '</td></tr>'
					return html;
				},
			},
			callback: {
				loadCallback: function ($addNode, sbO) {
					//增加头部
					var headHtml='<tr class="theader"><th class="cell">全部时间</th><th class="cell left un-nowrap">项目名称</th><th class="cell">教研员</th><th class="cell">研修状态</th></tr>'
					sbO.$content.prepend(headHtml)
				},
			}
		};


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