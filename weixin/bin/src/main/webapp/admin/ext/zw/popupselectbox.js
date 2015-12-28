/**
 * @author lisfan
 * @class PopupSelectBox
 * @extends jquery-1.8.3
 * @markdown
 * #选择面板插件
 * 版本 1.0 日期 2015-12.02
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

	var PopupSelectBox = function (id, data, zSetting, callback) {

		var me = this;
		this.$me = $(id);
		this.data = data;
		this.selectedData = [];

		var setting = {
			//主要显示:image，只显示图片，标题作为图片title属性
			//主要显示:text，只显示文本，忽略图片
			//主要显示:all，即(先）显示图片，也显示文本
			"mainShow": "all",
			//启用网格
			"enabledGrid": true,
			//启用多选
			"enabledMultiple": false,
			//启用搜索
			"enabledSearch": true,
			//启用分页
			"enabledPagination": true,
			//启用视图
			"enabledPanelview": true,
			//自动显示在面板里视图
			"autoShowPanelview": false,
			//TODO 多选限制个数(有bug)
			"multipleSize": null,
			//TODO 分页每页数目
			"count": 2,
		}

		//覆盖配置

		setting = $.extend(true, setting, zSetting);

		//配置参数容错

		if (setting.multipleSize === 0 || setting.multipleSize === 1) {
			setting.multipleSize = null;
		}


		this.setting = setting

		//容器生成器：要据数据生成dom内容结构，同时保存选中项
		var generateDom = function (data) {

			//初始化已选中数量
			var selectedCount = 0;

			//选项包裹层
			var $listContainer = $('<ul class="popup-select-list clearfix"></ul>');
			me.$me.append($listContainer)

			//生成列表内容
			for (var i = 0; i < data.length; i++) {
				var $item;

				//根据不同的显示要求生成项html
				if (setting.mainShow == "image") {
					$item = $('<li data-id="item_' + i + '"><a href="javascript:void(0);" title="' + data[i].name + '"><img src="' + data[i].image + '" alt="' + data[i].name + '" title="' + data[i].name + '"></a><span class="iconfont icon-state" title="' + data[i].name + '">&#xe647;</span></li>');

				} else if (setting.mainShow == "text") {
					$item = $('<li data-id="item_' + i + '"><a href="javascript:void(0);" title="' + data[i].name + '"><span class="name" title="' + data[i].name + '">' + data[i].name + '</span></a><span class="iconfont icon-state" >&#xe647;</span></li>');

				} else {
					//名称如果未填写容错处理放置空白符
					if (!data[i].name) {
						data[i].name = "&nbsp;"
					}

					$item = $('<li data-id="item_' + i + '"><a href="javascript:void(0);" title="' + data[i].name + '"><img src="' + data[i].image + '" alt="' + data[i].name + '" title="' + data[i].name + '"><span class="name" title="' + data[i].name + '">' + data[i].name + '</span></a><span class="iconfont icon-state">&#xe647;</span></li>');
				}

				$listContainer.append($item)

				//初始化选中状态，如果单选模式，又配置了多个选中状态，则只选中第一个设置为选中的
				if (setting.enabledMultiple) {
					//多选
					if (!setting.multipleSize || setting.multipleSize > selectedCount) {
						if (data[i].selected) {
							me.selectItem("item_" + i);
							selectedCount++
						}
					}
				} else if (!setting.enabledMultiple && selectedCount == 0) {
					if (data[i].selected) {
						me.selectItem("item_" + i);
						selectedCount++;
					}
				}

				//TODO html预置方式
				//TODO id唯一名称 若没有id用序号代替

			}

		};

		//TODO 生成搜索
		var searchDom = function () {
			var searchHtml = '<span class="search"><input type="text" value="" placeholder="请输入图标名称"><i class="iconfont">&#xe61b;</i></span>';
			me.$me.prev().append(searchHtml);
		};

		//生成分页
		var PaginationDom = function () {};

		//生成面板视图
		var panelViewerDom = function () {

			//查询是否有占位符，若有，则在占位符生成，若无则生成兄弟元素
			if ($(".panel-viewport").length > 0) {
				me.$panelview = $(".panel-viewport");
			} else {
				me.$panelview = $('<div class="popup-select-panel panel-viewport"></div>');
				me.$me.before(me.$panelview);
			}
			me.$panelview.append('<div class="panel-placeholder">请选择</div><ul class="clearfix"></ul><i class="ui-selectbox-icon">&#xe628;</i>')
			me.$pvpC = me.$panelview.find("ul");

			//单选
			if (!setting.enabledMultiple) {
				me.$pvpC.addClass("panel-single");
			}
			//为面板初始化选中状态
			var selectedItem = me.getSelectedItem();

			//有选中项时
			if (selectedItem.length > 0) {

				for (var i = 0; i < selectedItem.length; i++) {
					var itemID = selectedItem[i].itemID;
					var name = selectedItem[i].name;

					//取得选中的数据
					var image = selectedItem[i].name;
					var image = selectedItem[i].image;

					//封装数据
					var value = {
						"name": name,
						"image": image,
					}

					me.addPanelItem(itemID, value);
				}

			} else {
				me.cleanPanelItem();
			}
		};


		//事件侦听器：
		var addListener = function () {

			//弹出框项点击事件
			me.$me.find("li").bind("click", function () {
				var itemID = $(this).attr("data-id");

				//多选事件
				if (!setting.enabledMultiple) {
					//单选模式
					if ($(this).is(".selected")) {
						me.cleanSelectedItem();
					} else {
						me.cleanSelectedItem();
						me.selectItem(itemID);
					}
				} else {
					//多选模式
					if ($(this).is(".selected")) {
						//弹框取消选中
						me.cancelSelectItem(itemID);
					} else {

						if (!setting.multipleSize || setting.multipleSize > me.$pvpC.children().length) {
							//弹框选中
							me.selectItem(itemID);
						}
					}
				}

				//面板实时显示

				if (setting.enabledPanelview && setting.autoShowPanelview) {
					//单选模式
					//多选事件
					if (!setting.enabledMultiple) {
						if (!$(this).is(".selected")) {
							me.cleanPanelItem();

						} else {
							me.cleanPanelItem();

							//取得选中的数据
							var name = me.selectedData[itemID].name;
							var image = me.selectedData[itemID].image;

							//封装数据
							var value = {
								"name": name,
								"image": image,
							}

							me.addPanelItem(itemID, value);

						}
					} else {
						//多选模式
						if (!$(this).is(".selected")) {

							//面板视图删除该项
							me.removePanelItem(itemID);

						} else {

							if (!setting.multipleSize || setting.multipleSize > me.$pvpC.children().length) {

								//取得选中的数据
								var name = me.selectedData[itemID].name;
								var image = me.selectedData[itemID].image;

								//封装数据
								var value = {
									"name": name,
									"image": image,
								}

								//面板增加该项
								me.addPanelItem(itemID, value);
							}
						}
					}
				}
			});



			/*//选项点击选中事件,临时绑定数据
			me.$me.find("li").bind("click", function () {
				var itemID = $(this).attr("data-id");

				if (!setting.enabledMultiple) {
					//单选模式

					if ($(this).is(".selected")) {
						me.cleanPanelItem();
						me.cleanSelectedItem();

					} else {
						me.cleanPanelItem();
						me.cleanSelectedItem();
						me.selectItem(itemID);


						//取得选中的数据
						var name = me.selectedData[itemID].name;
						var image = me.selectedData[itemID].image;

						//封装数据
						var value = {
							"name": name,
							"image": image,
						}


						me.addPanelItem(itemID, value);

					}
				} else {

					//多选模式
					if ($(this).is(".selected")) {

						//面板视图删除该项
						me.removePanelItem(itemID);

						//弹框取消选中
						me.cancelSelectItem(itemID);
					} else {

						if (!setting.multipleSize || setting.multipleSize > me.$pvpC.children().length) {

							//弹框选中
							me.selectItem(itemID);

							//取得选中的数据
							var name = me.selectedData[itemID].name;
							var image = me.selectedData[itemID].image;

							//封装数据
							var value = {
								"name": name,
								"image": image,
							}

							//面板增加该项
							me.addPanelItem(itemID, value);

						}


					}
				}
			});*/



			//面板选项移除事件
			me.$pvpC.delegate(".iconfont", "click", function (event) {

				var itemID = $(this).parents(".panel-item").attr("data-id");

				//面板视图移除项
				me.removePanelItem(itemID);

				//取消选中已选中项
				me.cancelSelectItem(itemID);

				event.stopPropagation();
			})




			//搜索事件


			//分页事件


			//面板事件

		};

		//初始化
		var init = function () {

			//弹出成功后的回调
			//初始化弹出框内容
			generateDom(data);

			//关闭网格
			if (!setting.enabledGrid) {
				me.$me.find("li").css("border", "none");
			}

			//启用搜索
			if (setting.enabledSearch) {}

			//启用分页
			if (setting.enabledPagination) {}

			//启用视图
			if (setting.enabledPanelview) {
				panelViewerDom()
			}

			addListener();

			if (callback) {
				callback(me);
			}


		}();
	};


	//重载数据
	PopupSelectBox.prototype.reload = function (data) {};

	//获取选中的数据
	PopupSelectBox.prototype.getSelectedItem = function () {
		//将对象转为数组
		//取得DATA
		var $selectedItem = this.$me.find(".popup-select-list li.selected");
		var selectedArray = [];
		for (var i = 0; i < $selectedItem.length; i++) {
			var itemID = $selectedItem.eq(i).attr("data-id");
			this.selectedData[itemID].itemID = itemID;
			selectedArray.push(this.selectedData[itemID]);
		}
		return selectedArray;
	};

	//选中数据
	PopupSelectBox.prototype.selectItem = function (itemID) {
		var $target = this.$me.find(".popup-select-list li").filter("[data-id=" + itemID + "]");
		var itemIndex = itemID.slice(5)
		$target.addClass("selected");
		this.selectedData[itemID] = this.data[itemIndex];
	};

	//取消选中数据
	PopupSelectBox.prototype.cancelSelectItem = function (itemID) {
		var $target = this.$me.find(".popup-select-list li").filter("[data-id=" + itemID + "]");
		$target.removeClass("selected");
		delete this.selectedData[itemID];
	};

	//清空已选数据
	PopupSelectBox.prototype.cleanSelectedItem = function () {
		this.$me.find(".popup-select-list li").removeClass("selected");
		this.selectedData = [];
	};

	//弹出框事件//可配置
	PopupSelectBox.prototype.popup = function (title, size, btn, successCallback, yesCallback, cancelCallback) {
		var me = this;

		var $me = this.$me;
		var popupIndex;
		/*
				var loadIndex = layer.load();
		*/

		var oldSelectedItem = [];
		/*
				setTimeout(function () {
		*/
		//封装layer
		/*
					layer.close(loadIndex);
		*/

		popupIndex = layer.open({
			type: 1,
			title: title,
			content: $me,
			area: size,
			closeBtn: 1,
			btn: btn,
			success: function (layero, index) {
				//缓存目前选中的数据，用于关闭时重置选择
				oldSelectedItem = me.getSelectedItem();
				if (successCallback) {
					successCallback(layero, index)
				}
			},
			yes: function (index, layero) {
				//点击保存时可以获取当前选中的目标
				//显示在目标区域里
				//获取图标地址和图标名称,返回一个数组对象
				//暂存目前选中的数据
				//假如未开启视图面板自动显示，则显示一次
				var selected = me.getSelectedItem();
				me.cleanPanelItem();

				for (var i = 0; i < selected.length; i++) {
					var itemID = selected[i].itemID;

					//取得选中的数据
					var name = me.selectedData[itemID].name;
					var image = me.selectedData[itemID].image;

					//封装数据
					var value = {
						"name": name,
						"image": image,
					}

					me.addPanelItem(itemID, value);
				}

				me.$panelview.removeClass("popup-select-panel-focus");
				me.$panelview.removeClass("ui-selectbox-open");

				if (yesCallback) {
					yesCallback(index, layero)
				}

				layer.close(popupIndex);

			},
			cancel: function (index) {
				//面板移除所有
				me.cleanPanelItem();
				//清空选择和数据
				me.cleanSelectedItem();
				//循环已选中
				for (var i = 0; i < oldSelectedItem.length; i++) {
					var itemID = oldSelectedItem[i].itemID;
					me.selectItem(itemID);
					//取得选中的数据
					var name = me.selectedData[itemID].name;
					var image = me.selectedData[itemID].image;

					//封装数据
					var value = {
						"name": name,
						"image": image,
					}

					me.addPanelItem(itemID, value);

					me.$panelview.removeClass("popup-select-panel-focus");
					me.$panelview.removeClass("ui-selectbox-open");
				}
				if (cancelCallback) {
					cancelCallback(index)
				}
			}
		});
		/*}, 500);*/

		return popupIndex;
	}

	//关闭弹出框事件

	PopupSelectBox.prototype.closePopup = function () {}

	//面板增加一顶
	PopupSelectBox.prototype.addPanelItem = function (itemID, value) {


		/*	if (!this.setting.enabledMultiple) {
			//单选
			if ($(this).is(".selected")) {
				this.$panelview.empty();
				this.$panelview.prepend('<div class="panel-placeholder">请选择</div><i class="ui-selectbox-icon"></i>');
			} else {
				//取得选中的数据
				var name = this.selectedData[itemID].name;
				var image = this.selectedData[itemID].image;
				this.$panelview.empty();
				this.$panelview.prepend('<div class="panel-single"><img class="icon-image" src="' + image + '" alt="' + name + '"><span class="icon-text">' + name + '</span></div><i class="ui-selectbox-icon"></i>');
			}
		}*/

		//多选
		//增加其他配置

		//删除
		this.$panelview.find(".panel-placeholder").hide();

		if ($.type(value) == "string") {
			this.$pvpC.append('<li class="panel-item" data-id="' + itemID + '"><span>' + value + '</span><i class="iconfont remove-option">&#xe628;</i></li>');
		} else if ($.type(value) == "object") {
			var name = value["name"] ? value["name"] : 'undefined';
			var image = value["image"] ? '<img src="' + value["image"] + '" />' : '';
			this.$pvpC.append('<li class="panel-item" data-id="' + itemID + '">' + image + '<span>' + name + '</span><i class="iconfont remove-option" >&#xe628;</i></li>');
		}
		this.$pvpC.show();

	};

	//面板移除一项
	PopupSelectBox.prototype.removePanelItem = function (itemID) {

		this.$pvpC.find("[data-id=" + itemID + "]").remove();

		//若面板不存在选项，则重置为请选择
		if (this.$pvpC.children().length <= 0) {
			this.$panelview.find(".panel-placeholder").show();

			this.$pvpC.hide();
		} else {

		}

	};

	//面板移除所有
	PopupSelectBox.prototype.cleanPanelItem = function () {
		this.$pvpC.empty();
		this.$pvpC.hide();
		//并将UL改为不可见
	};

	$.fn.popupSelectBox = function (data, setting, callback) {
		//当前对象不存在
		if (this.length === 0) {
			console.error("%c%s%c 对象不存在，请检查", "font-weight:bold;text-decoration:underline", this.selector, "");
			return false;
		}

		//实例化
		var popupselectbox = new PopupSelectBox(this, data, setting, callback);

		//返回初始化对象
		return popupselectbox;
	};
})(jQuery);