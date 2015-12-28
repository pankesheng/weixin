/**
 * @author lisfan
 * @class PanelView 轻量版
 * @extends jquery-1.11.3
 * @markdown
 * #选择面板插件
 * 版本 1.0 日期 2015-12-04
 */

//TODO清单
//测试所有方法 返回的对象带的数据是否正确
//测试数据绑定情况
//替换操作可以直接替换成j对象
(function ($) {
	"use strict";
	/**
	 * 数据操作面板视图窗口
	 * @param {string} panelId         面板视图选择器
	 * @param {Object} bindingObj 数据操作对象实例
	 * @param {function} callback   回调函数
	 */
	var PanelView = function (panelId, data, setting, callback) {

		var me = this;

		me.$me = $(panelId);

		//一个唯一的ID指数
		me.uniqueID = 19890129;

		//状态样式名称
		me._disabledClass = "node disabled";
		me._selectedClass = "node selected";

		//初始化
		var init = function (data, setting, callback) {
			me.load(data, setting, callback);
		};

		//若有参数传则初始化，否则不初化
		if (data && $.type(data) == "array") {
			init(data, setting, callback);
		} else {
			init();
		}

	};


	/**
	 * 载入数据
	 * 1.若在HTML页面中已存在即有的元素，且参数中也没有传入data，以此html作为原数据
	 * 2.data和setting是可选的，传入空参数时，仅实例化面板视图对象，该项可用于初始化一个空面板
	 * 3.传入data时，会根据数据初始化面板，返回所有成功生成的对象
	 * 4.对于data数据中一般要求存在id和name两个字段，若不存在id字段则按序号生成id（因此要注意ID不要与存在id的数据冲突），若不存在name字段，则使用id的内容，selected可以使节点初始化为选中状态
	 * 5.可以自定义节点格式和控制器格式
	 * 6.TODO 	将由HTML生成的对象的[data-*]数据保存起来
	 * @param   {arrayobject|urlAJAX} data     可选，数据为数组对象或者一个JSON对象，数据值的关键字为"data"
	 * @param   {object}              setting  可选，参数配置，不配置时默认开启控制器操作和移除按钮，需关闭请设置为false
	 * @param   {Object}              callback 载入成功后的回调
	 * @returns {Boolean}             成功插入，则返回插入的对象，插入失败则返回false
	 */
	PanelView.prototype.load = function (data, setting, callback) {

		//销毁原对象
		var me = this;


		me.config = {
			view: {

				//默认启用控制栏
				enabledControls: true,
				//默认启用选项移除按钮
				enabledRemoveIcon: true,
				/*
				//自定义内容区html格式
				nodeFormater: function (nodeData) {
					//return 每一项的格式
				},

				//自定义控制器html格式
				controlsFormater: function () {
					//return 控制器格式

				}*/
			},

			callback: {

				/*
				//载入成功事件

				loadCallback: function ($addNode,$content, $controls, panelO) {

				},
				//选项点击事件
				nodeOnClick: function ($currentNode, $allNode, panelO) {

				},
				//移除点击事件
				removeOnClick: function ($self,$currentNode, $allNode, panelO) {

				},

				//默认确定事件
				yesCallback: function ($self, $allNode, panelO) {

				},

				//默认取消事件
				noCallback: function ($self, $allNode, panelO) {

				},

				*/
			}
		};

		//覆盖配置
		me.config = $.extend(true, me.config, setting);

		var $addNodeArray;
		//内容区Dom
		//假如存在已存在html元素，则不再生成，但格式要求需要符合格式
		if (!data && me.$me.find('[data-role="content"]').length > 0) {
			me.$content = me.$me.find('[data-role="content"]');
			$addNodeArray = this.getAllNode();

			//TODO
			//保存自定义的data-*到数据里，不保存已有的项
			/*
						for (var name in $addNode.data()) {
							//跳过data
							if (name == "data") continue;
						}*/


		} else {
			//生成
			var generateContentDom = function () {
				if (!me.$content) {
					me.$content = $('<div class="content clearfix" data-role="content"></div>');
				} else {
					//清空所有原数据
					me.cleanAllNode();
					me.$content = me.$me.find('[data-role="content"]');
				}
				//根据data生成内容
				$addNodeArray = me.addNode(data);

				me.$me.append(me.$content)
			}();
		}
		//控制器Dom
		//假如存在已存在html元素，则不再生成，但格式要求需要符合格式
		if (me.$me.find('[data-role="controls"]').length > 0) {
			me.$controls = me.$me.find('[data-role="controls"]');
		} else {
			//生成
			var generateControlsDom = function () {
				me.$controls = $('<div class="controls clearfix" data-role="controls"></div>');

				if (me.config.view && me.config.view.enabledControls) {
					var controlsHtml = '';

					if (me.config.view && me.config.view.controlsFormater && $.type(me.config.view.controlsFormater) == "function") {
						controlsHtml = me.config.view.controlsFormater();
					} else {
						controlsHtml = '<span class="notice">您目前的选择：</span><a class="btn btn-danger btn-large" data-role="no" href="javascript:void(0);">清空</a><a class="btn btn-success btn-large" data-role="yes" href="javascript:void(0);">确认</a>'
					}
					me.$controls.append(controlsHtml);
					me.$content.before(me.$controls);
				}
			}();
		}

		//事件侦听器
		var addListener = function () {
			//默认选项点击事件(无)
			me.$content.delegate("[data-role='node']", "click", function () {
				//自定义点击事件
				if (me.config.callback && me.config.callback.nodeOnClick && $.type(me.config.callback.nodeOnClick) == "function") {
					me.config.callback.nodeOnClick($(this), me.getAllNode(), me);
				} else {
					//点击默认无行为
				}
			});

			//默认选项移除事件
			me.$content.delegate("[data-role='remove']", "click", function (event) {
				//自定义点击事件
				if (me.config.callback && me.config.callback.removeOnClick && $.type(me.config.callback.removeOnClick) == "function") {
					me.config.callback.removeOnClick($(this), $(this).parents('[data-role="node"]'), me.getAllNode(), me);
					event.stopPropagation();
				} else {
					//默认
					var $currentNode = $(this).parents('[data-role="node"]');
					me.removeNode($currentNode);
					event.stopPropagation();
				}
			});


			//默认控制器确认事件
			me.$controls.delegate("[data-role='yes']", "click", function () {
				//自定义点击事件
				if (me.config.callback && me.config.callback.yesCallback && $.type(me.config.callback.yesCallback) == "function") {
					me.config.callback.yesCallback($(this), me.getAllNode(), me);
				} else {
					//默认行为：返回所有数据
					return me.getAllData();
				}
			});

			//默认控制器取消事件
			me.$controls.delegate("[data-role='no']", "click", function () {
				//自定义点击事件
				if (me.config.callback && me.config.callback.noCallback && $.type(me.config.callback.noCallback) == "function") {
					me.config.callback.noCallback($(this), me.getAllNode(), me);
				} else {
					return me.cleanAllNode();
				}
			});

		}();

		if ($addNodeArray.length > 0) {
			//全局性载入成功回调
			if (me.config.callback && me.config.callback.loadCallback && $.type(me.config.callback.loadCallback) == "function") {
				me.config.callback.loadCallback($addNodeArray, this.$content, this.$controls, this);
			}

			//自身触发回调
			if (callback && $.type(callback) == "function") {
				callback($addNodeArray, this.$content, this.$controls, this);
			}
			//返回增加的对象
			return $addNodeArray;
		} else {
			return false;
		}
	}

	//销毁
	PanelView.prototype.destory = function (callback) {
		this.$me.remove();

		//自身触发回调
		if (callback && $.type(callback) == "function") {
			callback(this);
		}
		//返回这个销毁的对象
		return this;
	}

	//返回面板里所有对象
	PanelView.prototype.getAllNode = function (callback) {
		var $allNode = this.$content.find('[data-role="node"]');

		//自身触发回调
		if (callback && $.type(callback) == "function") {
			callback($allNode, this);
		}
		return $allNode;

	}

	//返回面板里所有选中项对象
	PanelView.prototype.getSelectedNode = function (callback) {
		var $selectedNode = this.getAllNode().filter('[data-state="selected"]');

		//自身触发回调
		if (callback && $.type(callback) == "function") {
			callback($selectedNode, this);
		}
		return $selectedNode;

	}

	//返回面板里所有项对象
	//检验数据：若为字符串ID，转为JQ对象
	//若为数组ID，转为JQ对象
	//若为JQ对象，不作处理
	PanelView.prototype.getNodeById = function (nodeId, callback) {

		if (!nodeId) {
			return false;
		}
		var $getNode;
		if ($.type(nodeId) == "number" || $.type(nodeId) == "string") {
			$getNode = this.getAllNode().filter('#' + nodeId);
		} else if ($.type(nodeId) == "array") {
			var selector = "";
			for (var i = 0; i < nodeId.length; i++) {
				selector += '#' + nodeId[i] + ",";
			}
			$getNode = this.getAllNode().filter(selector.slice(0, -1));
		} else {
			$getNode = nodeId;
		}

		if ($getNode.length > 0) {

			//自身触发回调
			if (callback && $.type(callback) == "function") {
				callback($getNode, this);
			}

			//返回被查找到的对象
			return $getNode;
		} else {
			//返回空对象
			return {};
		}
	}

	//增加
	PanelView.prototype.addNode = function (data, index, callback) {
		//多个数据
		var dataArray = [];
		if ($.type(data) == "array") {
			dataArray = data;
		} else {
			dataArray[0] = data;
		}

		//增加项临时缓存区
		var $addNodeCache = $("<div></div>");
		var selectedIdArray = [];

		var $addNode;

		for (var i = 0; i < dataArray.length; i++) {

			//容错处理：如果是空数据则跳过
			if ($.isEmptyObject(dataArray[i])) {
				continue;
			}

			//检查ID，若不存在则配置唯一ID
			if (!dataArray[i].id) {
				//不存在id时随机指定，并存储到data里
				dataArray[i].id = this.uniqueID++;
			}

			//检查name值，若不存在则使用id
			if (!dataArray[i].name) {
				dataArray[i].name = dataArray[i].id;
			}

			if (this.config.view && this.config.view.nodeFormater && $.type(this.config.view.nodeFormater) == "function") {
				$addNode = $(this.config.view.nodeFormater(dataArray[i]));
			} else {
				//默认格式
				$addNode = $('<div>' + dataArray[i].name + '</div>');
			}

			//设置id名称、数据角色和初始样式
			$addNode.attr("data-role", "node");
			$addNode.attr("id", dataArray[i].id);
			$addNode.addClass("node");

			//缓存区暂存
			$addNodeCache.append($addNode);

			//TODO  改成直接选中模式看看，默认选中状态
			if (dataArray[i].state == "selected") {
				selectedIdArray.push(dataArray[i].id);
			}

			//附加移除按钮
			if (this.config.view && this.config.view.enabledRemoveIcon) {
				$addNode.append('<i data-role="remove" class="iconfont">&#xe628;</i>');
			}
			//增加角色数据
			dataArray[i].role = "node";
			//节点保存数据
			$addNode.data("data", dataArray[i]);
		}

		var $addNodeArray = $addNodeCache.children();

		//插入到指定位置
		if ($.type(parseInt(index)) == "number" && parseInt(index) >= 0) {
			var $targetNode = this.getAllNode().eq(0);
			$targetNode.before($addNodeArray);
		} else {
			this.$content.append($addNodeArray);
		}

		//TODO
		this.selectNode(selectedIdArray);

		if ($addNodeArray.length > 0) {

			//触发自身回调
			if (callback && $.type(callback) == "function") {
				callback($addNodeArray, this);
			}
			//返回增加的对象
			return $addNodeArray;
		} else {
			return false;
		}
	}

	//移除
	/**
	 * 移出一项
	 * @param   {string|object|arraystring,arrayobject} nodeId 参数可以是字符串，或者直接是项节点的jquery对象，可以传入多个值的数组
	 * @param   {function} callback 回调函数
	 * @returns {object|arrayobject|false}  成功：返回被删除的节点jquery对象，失败：返回false
	 */
	PanelView.prototype.removeNode = function (nodeId, callback) {

		var $getNode = this.getNodeById(nodeId);

		var $removeNodeArray = $("<div></div>");

		for (var i = 0; i < $getNode.length; i++) {
			var $currentNode = $getNode.eq(i);
			var $removeNode = $currentNode.clone();
			$removeNode.data("data", $currentNode.data("data"));

			$removeNodeArray.append($removeNode);

			$currentNode.remove();
		}

		$removeNodeArray = $removeNodeArray.children();

		if ($removeNodeArray.length > 0) {
			//触发自身回调
			if (callback && $.type(callback) == "function") {
				callback($removeNodeArray, this);
			}
			//返回删除的对象
			return $removeNodeArray;
		} else {
			return false;
		}
	};

	//清空所有对象
	PanelView.prototype.cleanAllNode = function (callback) {
		var $allNode = this.getAllNode();

		var $removeNodeArray = this.removeNode($allNode);

		if ($removeNodeArray.length > 0) {
			//自身触发回调
			if (callback && $.type(callback) == "function") {
				callback($removeNodeArray, this);
			}
			//返回被清空的所有的对象
			return $removeNodeArray;
		} else {
			return false;
		}
	};

	//变更
	/**
	 * [[Description]]
	 * @param   {[[Type]]} nodeId       [[Description]]
	 * @param   {[[Type]]} data     [[Description]]
	 * @param   {[[Type]]} callback [[Description]]
	 * @returns {Boolean}  返回新增加数据对象的一个集合
	 */
	PanelView.prototype.replaceNode = function (nodeId, data, callback) {

		var $getNode = this.getNodeById(nodeId);

		var $removeNodeArray = $("<div></div>");

		for (var i = 0; i < $getNode.length; i++) {

			//可以直接替换为一个jq对象
			var $addNode
			if ($.type(data) == "object") {
				$addNode = data;
			} else {
				$addNode = this.addNode(data);
			}
			$getNode.eq(i).after($addNode);
			//TODO 返回新增加的对象

			var $removeNode = this.removeNode($getNode.eq(i));

			$removeNodeArray.append($removeNode);
		}

		$removeNodeArray = $removeNodeArray.children();

		if ($removeNodeArray.length > 0) {
			//自身触发回调
			if (callback && $.type(callback) == "function") {
				callback($removeNodeArray, this);
			}

			//返回被替换的对象
			return $removeNodeArray;
		} else {
			return false;
		}

	};

	//设置状态
	/**
	 * [[Description]]
	 * @param   {[[Type]]} nodeId         [[Description]]
	 * @param   {[[Type]]} state      [[Description]]
	 * @param   {[[Type]]} stateClass [[Description]]
	 * @param   {[[Type]]} callback   [[Description]]
	 * @returns {Boolean}  返回被设置状态成功的元素
	 */
	PanelView.prototype.setState = function (nodeId, state, stateClass, callback) {

		var $getNode = this.getNodeById(nodeId);

		for (var i = 0; i < $getNode.length; i++) {

			//存储数据状态
			if (state) {
				$getNode.eq(i).attr("data-state", state);
				//TODO SETDATA
				this.addData($getNode.eq(i), "state", state)
					//$setNode.data("data").state="selected";
			} else {
				$getNode.eq(i).removeAttr("data-state");
			}

			//设置状态样式
			if (stateClass) {
				//样式名称或直接的样式属性
				if (stateClass.indexOf("{") >= 0 && stateClass.indexOf("}") >= 0) {
					$getNode.eq(i).attr("style", stateClass.slice(1, -1))
				} else {
					$getNode.eq(i).attr("class", "")
					$getNode.eq(i).addClass(stateClass);
				}
			} else {
				switch (state) {
				case "selected":
					$getNode.eq(i).attr("class", "");
					$getNode.eq(i).addClass(this._selectedClass);
					break;
				case "disabled":
					$getNode.eq(i).attr("class", "");
					$getNode.eq(i).addClass(this._disabledClass);
					break;
				default:
					$getNode.eq(i).attr("class", "");
					$getNode.eq(i).addClass("node");
					break;
				}
			}

		}

		if ($getNode.length > 0) {
			//自身触发回调
			if (callback && $.type(callback) == "function") {
				callback($getNode, this);
			}
			//返回被设置的对象
			return $getNode;
		} else {
			return false;
		}
	}

	//禁用
	PanelView.prototype.disabledNode = function (nodeId, disabledClass, callback) {
		var $disabledNode;
		if (disabledClass) {
			$disabledNode = this.setState(nodeId, "disabled", disabledClass);
		} else {
			$disabledNode = this.setState(nodeId, "disabled", this._disabledClass);
		}

		if ($disabledNode.length > 0) {
			//自身触发回调
			if (callback && $.type(callback) == "function") {
				callback($disabledNode, this);
			}
			//返回被选中的对象
			return $disabledNode;
		} else {
			return false;
		}
	}

	//选中
	PanelView.prototype.selectNode = function (nodeId, selectedClass, callback) {
		var $selectedNode;
		if (selectedClass) {
			$selectedNode = this.setState(nodeId, "selected", selectedClass);
		} else {
			$selectedNode = this.setState(nodeId, "selected", this._selectedClass);
		}

		if ($selectedNode.length > 0) {
			//自身触发回调
			if (callback && $.type(callback) == "function") {
				callback($selectedNode, this);
			}
			//返回被选中的对象
			return $selectedNode;
		} else {
			return false;
		}
	}

	//取消选中
	PanelView.prototype.cancelSelectedNode = function (nodeId, callback) {
		var $cancelSelectNode = this.setState(nodeId);

		if ($cancelSelectNode.length > 0) {
			//自身触发回调
			if (callback && $.type(callback) == "function") {
				callback($cancelSelectNode, this);
			}
			//返回被取消选中的对象
			return $cancelSelectNode;
		} else {
			return false;
		}
	}

	//清空所有选中
	PanelView.prototype.cleanSelectedNode = function (callback) {

		var $allNode = this.getAllNode();

		var $cancelSelectNode = this.cancelSelectedNode($allNode);

		if ($cancelSelectNode.length > 0) {
			//自身触发回调
			if (callback && $.type(callback) == "function") {
				callback($cancelSelectNode, this);
			}
			//返回被取消选中的对象
			return $cancelSelectNode;
		} else {
			return false;
		}
	}

	//返回面板里所有数据
	PanelView.prototype.getAllData = function (callback) {

		var $allNode = this.getAllNode();

		var allData = [];

		for (var i = 0; i < $allNode.length; i++) {
			allData.push($allNode.eq(i).data("data"));
		}

		if (allData.length > 0) {
			//自身触发回调
			if (callback && $.type(callback) == "function") {
				callback(allData, this);
			}
			//返回所有数据
			return allData;
		} else {
			return false;
		}
	}

	//返回被选中数据
	PanelView.prototype.getSelectedData = function (callback) {
		var $selectedNode = this.getSelectedNode();

		var selectedData = [];

		for (var i = 0; i < $selectedNode.length; i++) {
			selectedData.push($selectedNode.eq(i).data("data"));
		}

		if (selectedData.length > 0) {
			//自身触发回调
			if (callback && $.type(callback) == "function") {
				callback(selectedData, this);
			}
			//返回被选中数据
			return selectedData;
		} else {
			return false;
		}
	}

	//返回指定数据
	PanelView.prototype.getDataById = function (nodeId, callback) {
		var $getNode = this.getNodeById(nodeId);

		var getData = [];

		for (var i = 0; i < $getNode.length; i++) {
			getData.push($getNode.eq(i).data("data"));
		}

		if (getData.length > 0) {
			//自身触发回调
			if (callback && $.type(callback) == "function") {
				callback(getData, this);
			}
			return getData;
		} else {
			return false;
		}
	};
	//TODO 数据格式转换为字符串
	PanelView.prototype.dataToString = function (data,callback) {
		//判断为数据格式
		console.log(data)
	/*	var returnresulthtml = "";
		for (var i = 0; i < returnresult.length; i++) {
			for (var j in returnresult[i]) {
				returnresulthtml += "<span>" + j + ":" + returnresult[i][j] + ",</span>";
			}
		}
		var $returnresult = panelO.$controls.find(".returnresult");
		$returnresult.text('返回内容：返回所有数据');
		$returnresult.append("<br />" + returnresulthtml);*/
	}

	PanelView.prototype.dataToJSON = function (nodeId, callback) {}
		//增加对象数据
	PanelView.prototype.addData = function (nodeId, name, value, callback) {
		var $getNode = this.getNodeById(nodeId);
		for (var i = 0; i < $getNode.length; i++) {
			$getNode.eq(i).data("data")[name] = value;
		}

		if ($getNode.length > 0) {
			//自身触发回调
			if (callback && $.type(callback) == "function") {
				callback(this.getDataById($getNode), this);
			}
			//返回新的数据结构
			return this.getDataById($getNode);
		} else {
			return false;
		}
	};

	//移除对象数据
	PanelView.prototype.removeData = function (nodeId, name, callback) {
		var $getNode = this.getNodeById(nodeId);
		for (var i = 0; i < $getNode.length; i++) {
			delete $getNode.eq(i).data("data")[name];
		}

		if ($getNode.length > 0) {
			//自身触发回调
			if (callback && $.type(callback) == "function") {
				callback(this.getDataById($getNode), this);
			}
			//返回新的数据结构
			return this.getDataById($getNode);
		} else {
			return false;
		}
	};

	//移除对象所有数据
	PanelView.prototype.cleanAllData = function (callback) {
		var $getNode = this.getAllNode();
		//老数据结构
		var oldData = this.getAllData();
		for (var i = 0; i < $getNode.length; i++) {
			$getNode.eq(i).data("data") = null;
		}

		if ($getNode.length > 0) {
			//自身触发回调
			if (callback && $.type(callback) == "function") {
				callback(oldData, this);
			}
			//返回被清空前的原数据
			return oldData
		} else {
			return false;
		}
	};

	//更改对象数据：与addData不同的地方在于查找不到名称时不附加数据
	PanelView.prototype.replaceData = function (nodeId, name, value, callback) {
		var $getNode = this.getNodeById(nodeId);
		for (var i = 0; i < $getNode.length; i++) {
			if ($getNode.eq(i).data("data")[name]) {
				$getNode.eq(i).data("data")[name] = value;
			}
		}

		if ($getNode.length > 0) {
			//自身触发回调
			if (callback && $.type(callback) == "function") {
				callback(this.getDataById($getNode), this);
			}
			//返回新的数据结构
			return this.getDataById($getNode);
		} else {
			return false;
		}
	};

	$.fn.panelview = function (data, setting, callback) {
		//当前对象不存在
		if (this.length === 0) {
			console.error("%c%s%c 对象不存在，请检查", "font-weight:bold;text-decoration:underline", this.selector, "");
			return false;
		}

		//实例化
		var panelview = new PanelView(this, data, setting, callback);

		//返回初始化对象
		return panelview;
	};
})(jQuery);