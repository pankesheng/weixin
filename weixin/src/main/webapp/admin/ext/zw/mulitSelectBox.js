/**
 * @author lisfan
 * @class MulitSelectBox
 * @extends jquery-1.8.3
 * @markdown
 * #多选框级联插件
 * 版本 1.0 日期 2015-10-27
 * 配置项详见Config options
 *

 
 2个对象：面板与弹出框列表，交互
   取得数据【可异步】-创建单元数据-生成dom附加文档-侦听事件

 mulitSelectPanel
 
 面板多选显示区域
  
 实时响应选中状态
  
 面板取消选中事件
 
 init
 初始化：根据据参数设置(可传入值)
 
 
 mulitSelectBox
 
 	init
  初始化
  
  getData
  遍历json或ajax数据循环层级结构 读取数据
    下级 菜单弹出框 事件【ajax获取列表】

  generateDom
  生成dom树
  
  addListener
  侦听事件 
  弹出框 选中事件【全选、父级多选】
  弹出框 取消选中事件
  弹出框 清空事件
  弹出框 确定事件
  弹出框 关闭事件
  
  默认配置项
  
 */
;
!(function ($) {
	"use strict";

	/**
	 * 
	 * @param   {jobject|string}   id     直接传入jquery对象，或者传入id字符串名，id字符串前面需要加'#'号，容错处理，如果不包含#号会自动添加#号
	 * @param   {JSON}   config  配置项
	 * @returns {[[Type]]} [[Description]]
	 */
	var MulitSelectBox = function (id, config) {

		/**
		 * 验证ID名称是否为符合的字符串，不符合则抛出错误
		 * @param   {string} id 容错处理，如果不包含#号会自动添加#号
		 * @returns {Boolean}  
		 */

		var validId = function (type) {
				if (type && $.type(type) === "string") {
					//合法字符串，但缺少#号时，自动添加
					if (type.indexOf("#") === -1) {
						type += "#" + $.trim(type);
					}

					if (validObject($(type))) {
						return true;
					} else {
						console.log("检查ID名称不存在")
						return false;
					}
				} else {
					console.log("请输入有效的ID名称")
					return false;
				}
			}
			/**
			 * 验证ID名称是否为符合的字符串，不符合则抛出错误
			 * @param   {string}  id 容错处理，如果不包含#号会自动添加#号
			 * @returns {Boolean} 
			 */

		var validObject = function (o) {
			if (o && $.type(o) === "object" && o.length !== 0) {
				return true;
			}
		}

		var $me = null;
		if (validObject(id)) {
			$me = $(id);
		} else if (validObject(id)) {
			$me = id
		}

		//多选框包裹
		var $boxWrapper = $("<div id='" + $me.attr("id") + "-mulit-selectbox' class='mulit-selectbox'></div>");

		//默认配置项
		//请求ajax地址 url:
		//本地数据
		//data:{}
		//请求方式:post

		this.defaults = {
			"success": "s",
			"methed": "post",
			"url": '',
			"eventType": "click",
			"state": "s",
			"total": "",
			"selectedId": [], //选中状态数组，会覆盖data数据设置的select状态
			"contWidth": "auto", //自定义宽度，默认XX?
			"contHeight": "auto", //自定义外框高度，默认auto
			"childWidth": "auto", //统一子项宽度，微调
			"eventType": "click", //事件行为 
			"callback": function () {} //回调函数
		};

		//覆盖自定义配置项
		var config = $.extend({}, this.defaults, config);

		//获取数据
		var getData = function (callback) {

			if (type === 'error') {
				/*错误提示*/
				if (typeof me.opts.event.onGetDataError === 'function') {
					me.opts.event.onGetDataError(json);
				}
			} else if (type === 'timeout') {
				/*超时提示*/
				me.tableTip('showTimeoutTip');
			} else if (type === 'success') {
				var data = json[me.opts.store.dataProperty];

				if (typeof data === 'object' && data.length) {
					/*有数据*/
					//数据
					me.data = json[me.opts.store.dataProperty];
					//总数
					me.total = json[me.opts.store.totalProperty];
					//渲染
					me.renderGrid();
				} else {
					//当不是第一页时跳转到上一页
					if (me.curPage !== 1) {
						me.gridObj.prevPage();
					} else {
						/*空数据提示*/
						me.tableTip('showNoneTip');
					}
				}
			}

			//移除载入动画
			me.tableTip('hideLoadingTip');

			//如果有url连接连接优先
			if (this.config.data && !this.config.url) {
				/*返回本地数据*/
				callback('success', this.config.data);
			} else {

				//同步获取数据
				$.ajax({
					url: this.config.url,
					type: this.config.methed,
					dataType: 'json',
					success: function (json) {
						if (json[opts.config.success] == 1) {
							//获取成功
							callback('success', json);
						} else {
							callback('error', json);
						}
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						if (textStatus === 'timeout') {
							callback('timeout');
						} else {
							callback('error');
						}
					}
				});
			}
		};

		//创建数据单元dom TODO 考虑传入数据生成
		var createCells = function () {
			var data = config.data;

			//检查是否含有子项,并且含有数据
			var haveChilds = function (o) {
				if (o.childs !== undefined && $.type(o.childs) === "array") {
					return true;
					//继续判断他自已的，如果不放
				} else {
					return false;
				}
			}



			//创建子项
			var createChildsCells = function (o) {
				//判断当前对象是否存在子项数据
				if (haveChilds(o)) {

					var selChild = '<ul class="selectbox-child clearfix">';

					for (var i = 0; i < o.childs.length; i++) {
						//有数据存在，循环判断
						var lastChild = createChildsCells(o.childs[i]);
						selChild += '<li><span><input type="checkbox" value="' + o.childs[i].id + '" name="' + o.childs[i].value + '" id="' + o.childs[i].value + '" /><b class="enabled"></b><label>' + o.childs[i].name + '</label></span>' + lastChild + '</li>';
					}
					selChild += "</ul>";
					return selChild;
				} else {
					return "";
				}
			}

			for (var i = 0; i < data.length; i++) {
				//							
				//创建标题
				var selTitle = '<div class="selectbox-title"><input type="checkbox" value="' + data[i].id + '" name="' + data[i].value + '" id="' + data[i].value + '" /><b class="enabled"></b><label>' + data[i].name + '</label></div>';

				var selParent = "";
				if (data[i].open) {
					selParent = '<ul class="selectbox-parent on clearfix">';

				} else {
					selParent = '<ul class="selectbox-parent clearfix">';

				}

				//创建父级项
				//判断元素是否存在childs属性，不存在跳出本次循环
				if (haveChilds(data[i])) {
					for (var j = 0; j < data[i].childs.length; j++) {
						var child = data[i].childs[j];
						//循环遍历子项
						var lastChild = createChildsCells(child);
						selParent += '<li><span><input type="checkbox" value="' + child.id + '" name="' + child.value + '" id="' + child.value + '" /><b class="enabled"></b><label>' + child.name + '</label></span>' + lastChild + '</li>'
					}
				}
				selParent += "</ul>";
				$boxWrapper.append(selTitle + selParent)
			}
		};

		//创建功能按钮html结构
		var createTools = function () {
			var toolsHtml = '<div id="' + $me.attr("id") + '-selectbox-tools" class="selectbox-tools"><span class="selectbox-close btn btn-success">确认</span><span class="selectbox-clean btn btn-danger">清空</span><span class="selectbox-close btn btn-default">取消</span></div>';
			$boxWrapper.append(toolsHtml);
		};

		//统计每项的子项数量
		var countItem = function () {
				//查找到最后一的一个ul

			}
			//附加dom到目标位置
		var generateDom = function () {
			//定位到目标位置的下方

			$me.parent().append($boxWrapper);



		};

		var drawStyle = function () {

			//为目标父级增加样式
			$me.parent().css("position", "relative");

			var contWidth = config.contWidth === "auto" ? $me.outerWidth() - parseInt($boxWrapper.css("padding-left")) - parseInt($boxWrapper.css("padding-right")) - parseInt($boxWrapper.css("border-left")) - parseInt($boxWrapper.css("border-right")) : config.contWidth - parseInt($boxWrapper.css("padding-left")) - parseInt($boxWrapper.css("padding-right"));
			var contHeight = config.contHeight === "auto" ? "auto" : config.contHeight

			//初始化最外框尺寸

			$boxWrapper.css({
				"position": "absolute",
				"left": $me.position().left,
				"top": $me.position().top + $me.outerHeight() - 1,
				"width": contWidth,
				"height": contHeight
			})

			//初始化子项框尺寸

			$boxWrapper.find(".selectbox-child").css({
				"width": contWidth - 50,
			})



		}

		//侦听事件
		var addListeners = function (type) {

			//TODo 判断鼠标点击事件类型，与多选框打开方式

			//打开多选框

			$me.click(function () {
				//判断鼠标焦点是否在目标元素上，如果不在目标元素则隐藏多选框
				if ($boxWrapper.is(":visible")) {
					$boxWrapper.hide();
				} else {
					$boxWrapper.show();
				}
				event.stopPropagation();
			});

			//多选框停止冒泡
			$boxWrapper.click(function () {
				event.stopPropagation();
			});

			//选项事件行为类型:点击类型

			//label父级展现子级 TODO  取消最顶级的展现事件
			$boxWrapper.find("label").click(function () {

				//获取目标项的同级对象
				var siblingName = $(this).closest("li").siblings().children("span");
				var siblingList = $(this).closest("li").siblings().children("ul");

				//获取当前项的所有子项
				var childName = $(this).closest("li")
					//同级隐藏
				siblingName.removeClass("on");
				siblingList.hide();

				//目标项的所有子项全部隐藏
				var siblingListChildName = siblingList.find("span");
				var siblingListChildList = siblingList.find("ul");
				siblingListChildName.removeClass("on");
				siblingListChildList.hide();

				//显示当前项，如果已显示则隐藏
				var currentName = $(this).parent();
				var currentList = $(this).parent().next()

				if (currentList.is(":visible")) {
					currentName.removeClass("on");
					currentList.hide();
				} else {
					//TODO假如没有内容，则选中当前项
					currentName.addClass("on");
					currentList.show();
				}
				//自已选中，子项全部选中//阻止冒泡
				//event.stopPropagation();

			});


			//多选框控制
			$boxWrapper.find("b").click(function () {

				//获取当前项，如果已显示则隐藏
				var currentUl = $(this).parent().next()
				var currentSpan = $(this).parent();
				var currentB = $(this);
				var currentInput = currentSpan.find("input");
				//保存当前选框的状态
				var currentBState = $(this).attr("class");

				//获取当前项父级对象
				var parentUl = $(this).closest("ul");
				var parentSpan = $(this).closest("ul").prev();
				var parentB = parentSpan.find("b");
				var parentInput = parentSpan.find("input");

				//获取目标项的同级项对象
				var siblingLi = $(this).closest("li").siblings();
				var siblingUl = siblingLi.children("ul");
				var siblingSpan = siblingLi.children("span");
				var siblingB = siblingSpan.find("b");
				var siblingInput = siblingSpan.find("input");

				//TODO currentUl 判断是否存在子项
				var haveChild = function (o) {
					//假如存在ul，则表示有子项
					if ($(o).parent().next().length > 0) {
						return true;
					} else {
						return false;
					}
				}

				//如果当前子项选项框未弹出，则触发弹出
				/*if (currentUl.is(":hidden")) {
					currentSpan.find("label").click();
				}*/

				//判断当前选中状态
				//只要不是已选中状态，并且存在子项，则选中自已,不若存在，则选中未选中的所有子项
				//4种状态
				//1.不是全选状态，并且有子项，则变更状态并全选
				//2.不是全选状态，也没有子项，则变更状态
				//3.全选状态，并且有子项，则变更状态并取消全选
				//4.全选状态，但没有子项，则变更状态
				if (!currentB.is(".enabled-all")) {
					currentInput.attr("checked", "checked");
					currentB.attr("class", "enabled-all");
					if (haveChild(this)) {
						currentUl.find("input").attr("checked", "checked");
						currentUl.find("b").attr("class", "enabled-all");
					}
				} else {
					if (haveChild(this)) {
						currentUl.find("input").removeAttr("checked", "checked");
						currentUl.find("b").attr("class", "enabled");
						//全选
					}
					currentInput.removeAttr("checked");
					currentB.attr("class", "enabled");
				}

				//循环遍历整个树结构，判断整个的选中状态
				//方法1.从当前位置，向上遍历*目前按此方法*
				//方法2.全部遍历，进行中
				//遍历整个树结构，变更多选框状态

				var setParentCheckboxEnabled = function (co) {
					//判断当前当前项的选择情况
					//如果全部选中，则将父亲设置为enabled-all
					//如果部分选中，则将父亲设置为enabled-part
					//检测我有多少兄弟
					var _currentB = $(co);
					var _parentSpan = $(co).closest("ul").prev();
					var _parentB = _parentSpan.find("b");
					var _parentInput = _parentSpan.find("input");
					var _siblingB = $(co).closest("li").siblings().children("span").find("b");

					if (_currentB.is(".enabled-all") && _siblingB.length === _siblingB.filter(".enabled-all").length) {
						//自已选中，并且兄弟也都选中
						_parentB.attr("class", "enabled-all");
						_parentSpan.attr("checked", "checked");
					} else if (_currentB.is(".enabled-all") || _currentB.is(".enabled-part") || _siblingB.filter(".enabled-all").length > 0 || _siblingB.filter(".enabled-part").length > 0) {
						//兄弟部分选中
						_parentB.attr("class", "enabled-part");
						_parentSpan.removeAttr("checked");

					} else {
						_parentB.attr("class", "enabled");
						_parentSpan.removeAttr("checked");

					}

					return _parentB
				};

				var _currentB = currentB;
				var _parentB = parentB;

				while (_parentB.length > 0) {
					_parentB = setParentCheckboxEnabled(_currentB);
					_currentB = _parentB;
				}

				event.stopPropagation();


			});

			/*//顶级父项滑动展开事件
						$boxWrapper.find(".selectbox-title").click(function () {
							if ($(this).next().is(":visible")) {
								$(this).next().slideUp("fast");
							} else {
								$(this).next().slideDown("fast");
							}
						});*/

			//TODO 在没有新增加项的未点击确认的情况下，不自动消失，
			//选框没有新行为时关闭
			/*$("html").click(function () {
				if ($boxWrapper.is(":visible")) {
					$boxWrapper.hide();
				}
			});*/
			//确认事件

			//清空事件

			//取消事件

		};

		//初始化多选菜单并执行
		var init = function () {

			//获取数据

			//生成单元数据
			createCells();
			//生成工具按钮
			createTools();
			//附加HTML
			generateDom();
			//渲染样式
			drawStyle();
			//侦听事件
			addListeners();
		}();



	};

	//重载，可根据传入data参数进行重置
	MulitSelectBox.prototype.reload = function () {

		}
		//获取所有选中的数据项，

	MulitSelectBox.prototype.getAllSelectedData = function () {

		}
		//获取指定数据可指定名称[单个或多个],如果选择父亲，将获取子项的所有数据数组
	MulitSelectBox.prototype.getData = function (key) {

	}

	//全选子项数据
	MulitSelectBox.prototype.selectChild = function () {

	}

	//更改某项数据
	MulitSelectBox.prototype.setData = function (key, value) {

		}
		//增加新数据（可指定位置，默认末尾）
	MulitSelectBox.prototype.addData = function (key, value, index) {

		}
		//打开多选框
	MulitSelectBox.prototype.openSelectBox = function () {

		}
		//关闭多选框
	MulitSelectBox.prototype.closeSelectBox = function () {

		}
		//清空数据多选框
	MulitSelectBox.prototype.cleanSelectBox = function () {

	}

	$.fn.mulitSelectBox = function (config) {
		//当前对象不存在
		if (this.length === 0) {
			return false;
		}

		//实例化
		var selectbox = new MulitSelectBox(this, config);

		//返回初始化对象
		return selectbox;
	};
})(jQuery);