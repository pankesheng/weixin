/**
 * @author lisfan
 * @class PanelViewPort
 * @extends jquery-1.8.3
 * @markdown
 * #选择面板插件
 * 版本 1.0 日期 2015-11-17
 */

(function ($) {
	"use strict";
	/**
	 * 数据操作面板视图窗口
	 * @param {string} id         面板视图选择器
	 * @param {Object} bindingObj 数据操作对象实例
	 * @param {function} callback   回调函数
	 */
	var PanelViewPort = function (id, bindingObj, callback) {

		var me = this;

		this.$me = $(id);

		var mode = me.$me.attr("data-mode");

		var bindingSelector = bindingObj.me;

		//存储数据的属性名称为 data-"X"

		me.data = {};
		//容器生成器：要据数据生成dom内容结构，同时保存选中项
		var generateDom = function (data) {
			if (mode == "table") {
				var headerHtml = '<div class="panel-viewport-header">您目前的选择:<a class="clean-btn btn btn-danger" href="javascript:void(0);">清空</a></div>';
				me.$me.prepend(headerHtml);

			}
			me.$pvpC = $('<ul class="clearfix"></ul>');
			me.$me.append(me.$pvpC);

		};

		var addListener = function (bindingSelector) {


			if (mode == "table") {

				//多选按钮
				$(bindingSelector).delegate(":checkbox:not(.selectAll)", "change", function () {

					var index = parseInt($(this).attr("data-index"));
					var offset = parseInt($(this).attr("data-offset"));

					//选中状态
					if (this.checked) {
						//打开面板显示
						me.$me.show();
						//容错：面板中已有该选项，则不再生成
						if (me.$pvpC.find("[data-offset=" + offset + "]").length <= 0) {
							var store = bindingObj.getRowDataByIndex(index);
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
								var store = bindingObj.getRowDataByIndex(index);
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
					var checkAll = $(bindingSelector).find(":checkbox").filter(".selectAll");

					me.removeItem(offset);
					//面板删除项是否在当前表格里，在则取消选中，不在则不理

					checkbox.filter("[data-offset=" + offset + "]").removeAttr("checked")
					checkAll.removeAttr("checked")
					checkbox.filter("[data-offset=" + offset + "]").parents("tr").removeClass("selected")
				});

				//面板清空事件
				me.$me.find(".clean-btn").bind("click", function () {
					//查找这个页面的
					var checkbox = $(bindingSelector).find(":checkbox").not(".selectAll");
					var checkAll = $(bindingSelector).find(":checkbox").filter(".selectAll");
					var tableTr = $(bindingSelector).find("tr");

					checkbox.removeAttr("checked");
					checkAll.removeAttr("checked");
					tableTr.removeClass("selected");
					me.cleanAll();
				});

			} else if (mode == "tree") {

				//树列表选项点击事件
				$(bindingSelector).delegate("li a", "click", function () {

					//当前项，如果是选中的，则取消选中，取得当前项的数据
					var tId = $(this).parents("li").attr("id");
					var tIdOffset = parseInt(tId.replace("treeSelectList_", ""));
					var store = bindingObj.getNodeByTId(tId);
					var name = store[bindingObj.setting.data.key.name];
					var image = store[bindingObj.setting.data.key.image] ? store[bindingObj.setting.data.key.image] : '';
					var total = store[bindingObj.setting.data.key.total] ? '(' + store[bindingObj.setting.data.key.total] + ')' : '';
					var count = store[bindingObj.setting.data.key.count] ? '(' + store[bindingObj.setting.data.key.count] + ')' : '';


					//高亮选择模式
					var enableMultiple = bindingObj.setting.view.enableMultiple;

					//单选模式
					if (!enableMultiple) {
						//若已选中
						if ($(this).is(".curSelectedNode")) {
							me.$me.empty();
							me.$me.prepend('<div class="panel-placeholder">请选择</div><i class="ui-selectbox-icon"></i>');
						} else {
							me.$me.empty();
							me.$me.prepend('<div class="panel-single"><img class="icon-image" src="' + image + '" alt="' + name + '"><span class="icon-text">' + name + total + count + '</span></div><i class="ui-selectbox-icon"></i>');
						}
					} else {
						//多选模式
						//限制条数目
						var multipleSize = bindingObj.setting.view.multipleSize;



						//若已选中
						if ($(this).is(".curSelectedNode")) {
							//删除该项
							me.removeItem(tIdOffset);
							//若面板不存在选项，则重置为请选择
							if (me.$pvpC.children().length <= 0) {
								me.$me.prepend('<div class="panel-placeholder">请选择</div>');
							}
						} else {

							//限制数不存在，或者限制数大于面板内选项数时
							if (!multipleSize || multipleSize > me.$pvpC.children().length) {
								
							//封装数据
						var value = {
							"name": store[bindingObj.setting.data.key.name],
							"image": store[bindingObj.setting.data.key.image],
							"total": store[bindingObj.setting.data.key.total],
							"count": store[bindingObj.setting.data.key.count],
						}
						
								//增加该项，设置数据
								me.addItem(tIdOffset, value, store);
								if (me.$pvpC.children().length > 0) {
									me.$me.find(".panel-placeholder").remove();
								}
							}
						}
					}


				});



				//面板选项移除事件
				me.$me.delegate(".iconfont", "click", function (event) {

					var offset = parseInt($(this).parents(".panel-viewport-item").attr("data-offset"));

					$(bindingSelector).find("#treeSelectList_" + offset).find("a").removeClass("curSelectedNode");

					//移除项
					me.removeItem(offset);

					//取消树的已选中事件
					var treeNode = bindingObj.getNodeByTId("treeSelectList_" + offset);
					bindingObj.cancelSelectedNode(treeNode);

					if (me.$pvpC.children().length <= 0) {
						me.$me.prepend('<div class="panel-placeholder">请选择</div>');
					}
				})


				//面板点击打开树下拉事件
				me.$me.bind("click", function (event) {
					$(bindingSelector).show();
					me.$me.addClass("tree-select-list-panel-focus");
					me.$me.addClass("ui-selectbox-open");
					event.stopPropagation();
				})

				//点击空白处，关闭树下拉事件
				$(document).bind("click", function () {
					$(bindingSelector).hide();
					me.$me.removeClass("tree-select-list-panel-focus");
					me.$me.removeClass("ui-selectbox-open");

				});



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
	PanelViewPort.prototype.addItem = function (offset, value, data) {
		//增加其他配置
		if ($.type(value) == "string") {
			this.$pvpC.append('<li class="panel-viewport-item" data-offset="' + offset + '"><span>' + value + '</span><i class="iconfont remove-option" >&#xe628;</i></li>');

		} else if ($.type(value) == "object") {
			var name = value["name"] ? value["name"] : 'undefined';
			var image = value["image"] ? '<img src="' + value["image"] + '" />' : '';
			var total = value["total"] ? '(' + value["total"] + ')' : '';
			var count = value["count"] ? '(' + value["count"] + ')' : '';

			this.$pvpC.append('<li class="panel-viewport-item" data-offset="' + offset + '">' + image + '<span>' + name + total + count + '</span><i class="iconfont remove-option" >&#xe628;</i></li>');
		}
		this.$pvpC.show();
		//暂存数据
		this.data["data" + offset] = data;
	};

	//移除一项
	PanelViewPort.prototype.removeItem = function (offset) {
		this.$pvpC.find(".panel-viewport-item[data-offset=" + offset + "]").remove();
		delete this.data["data" + offset];
		//若无数据时
		if (this.$pvpC.children().length <= 0) {
			this.$pvpC.hide();
		}
	};

	//移除所有
	PanelViewPort.prototype.cleanAll = function () {
		this.data = {};
		this.$pvpC.empty();
		this.$pvpC.hide();
		//并将UL改为不可见
	};

	//获取面板里所有数据
	PanelViewPort.prototype.getData = function () {
		return this.data;
	}

	//获取指定位置数据
	PanelViewPort.prototype.getDataByIndex = function (index) {
		//将对象转为数组
		var dataArray = [];
		var i = 0;
		for (var name in this.data) {
			dataArray[i] = this.data[name];
			i++;
		}
		return dataArray[index]
	};

	$.fn.panelviewport = function (bindingSelector, callback) {
		//当前对象不存在
		if (this.length === 0) {
			console.error("%c%s%c 对象不存在，请检查", "font-weight:bold;text-decoration:underline", this.selector, "");
			return false;
		}

		//实例化
		var panelviewport = new PanelViewPort(this, bindingSelector, callback);

		//返回初始化对象
		return panelviewport;
	};

})(jQuery);