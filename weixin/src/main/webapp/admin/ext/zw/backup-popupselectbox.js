/**
 * @author lisfan
 * @class popupselectbox
 * @extends jquery-1.8.3
 * @markdown
 * #选择面板插件
 * 版本 1.0 日期 2015-11-18
 */

(function ($) {
	"use strict";

	var PopupSelectBox = function (id, bindingSelector, callback) {

		var me = this;
		this.$me = $(id);
		//存储数据的属性名称为 data+"X"

		me.data = {};
		//容器生成器：要据数据生成dom内容结构，同时保存选中项
		var generateDom = function (data) {
			var titleHtml = '<div class="panel-viewport-title">您目前的选择:<a class="clean-btn btn btn-danger" href="javascript:void(0);">清空</a></div>';
			me.$pvpC = $('<ul class="clearfix"></ul>');
			me.$me.append(me.$pvpC).prepend(titleHtml);
		};

		var addListener = function (bindingSelector) {
				//如果当前为表格，则侦听事件
				if ($(bindingSelector).get(0).nodeName == "TABLE") {
					$(bindingSelector).delegate(":checkbox:not(.selectAll)", "change", function () {

						var index = parseInt($(this).attr("data-index"));
						var offset = parseInt($(this).attr("data-offset"));


						//选中状态
						if (this.checked) {
							//打开面板显示
							me.$me.show();

							//容错：面板中已有该选项，则不再生成
							if (me.$pvpC.find("[data-offset=" + offset + "]").length <= 0) {
								var store = grid.getRowDataByIndex(index);
								me.addItem(offset, store.data.name, store.data);
							}
						} else {
							//表格区没有选中项并且视图面板，也没有项
							me.removeItem(offset)
							if (me.$pvpC.find(".panel-viewport-item").length <= 0) {
								me.$me.hide();
							}
						}
					});

					//全选按钮事件
					$(bindingSelector).delegate(".selectAll", "change", function () {
						if (this.checked) {
							//打开面板显示
							me.$me.show();
							//查找AJAX更新后的当前选项
							var checkbox = $(bindingSelector).find(":checkbox").not(".selectAll");
							for (var i = 0; i < checkbox.length; i++) {

								var index = parseInt(checkbox.eq(i).attr("data-index"));
								var offset = parseInt(checkbox.eq(i).attr("data-offset"));
								//容错：面板中已有该选项，则不再生成
								if (me.$pvpC.find("[data-offset=" + offset + "]").length <= 0) {
									var store = grid.getRowDataByIndex(index);
									me.addItem(offset, store.data.name, store.data);
								}
							}
						} else {
							var checkbox = $(bindingSelector).find(":checkbox").not(".selectAll");
							for (var i = 0; i < checkbox.length; i++) {

								var offset = parseInt(checkbox.eq(i).attr("data-offset"));
								me.removeItem(offset)
							}

							if (me.$pvpC.find(".panel-viewport-item").length <= 0) {
								me.$me.hide();
							}
						}
					})

					//面板选项移除事件
					me.$me.delegate(".iconfont", "click", function (event) {

						var offset = parseInt($(this).parents(".panel-viewport-item").attr("data-offset"));
						var checkbox = $(bindingSelector).find(":checkbox").not(".selectAll");

						me.removeItem(offset);
						//面板删除项是否在当前表格里，在则取消选中，不在则不理

						checkbox.filter("[data-offset=" + offset + "]").removeAttr("checked")
							//删除数据				
					})

					//面板清空事件
					me.$me.find(".clean-btn").bind("click", function () {
						//查找这个页面的
						var checkbox = $(bindingSelector).find(":checkbox").not(".selectAll");
						var checkAll = $(bindingSelector).find(":checkbox").filter(".selectAll");
						checkbox.removeAttr("checked");
						checkAll.removeAttr("checked");
						me.cleanAll();
					})
				}
			}
			//初始化

		var init = function () {
			generateDom();
			addListener(bindingSelector);

			if (callback) {
				callback(me);
			}
		}();
	};

	//增加一顶
	PopupSelectBox.prototype.addItem = function (offset, value, data) {
		this.$pvpC.append('<li class="panel-viewport-item" data-offset="' + offset + '"><span>' + value + '</span><i class="iconfont remove-option" ></i></li>');
		this.data["data" + offset] = data;

	};

	//移除一项
	PopupSelectBox.prototype.removeItem = function (offset) {
		this.$pvpC.find(".panel-viewport-item[data-offset=" + offset + "]").remove();
		delete this.data["data" + offset];
	};

	//移除所有
	PopupSelectBox.prototype.cleanAll = function () {
		this.data = {};
		this.$pvpC.empty();
	};

	//获取面板里所有数据
	PopupSelectBox.prototype.getData = function () {
		return this.data;
	}

	//获取指定位置数据
	PopupSelectBox.prototype.getDataByIndex = function (index) {
		//将对象转为数组
		var dataArray = [];
		var i = 0;
		for (var name in this.data) {
			dataArray[i] = this.data[name];
			i++;
		}
		return dataArray[index]
	};

	$.fn.popupselectbox = function (bindingSelector, callback) {
		//当前对象不存在
		if (this.length === 0) {
			console.error("%c%s%c 对象不存在，请检查", "font-weight:bold;text-decoration:underline", this.selector, "");
			return false;
		}

		//实例化
		var popupselectbox = new PopupSelectBox(this, bindingSelector, callback);

		//返回初始化对象
		return popupselectbox;
	};
})(jQuery);