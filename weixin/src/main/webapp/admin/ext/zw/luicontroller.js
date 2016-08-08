/**
 * @class LUIController
 * @version 1.1.0.1
 * @author lisfan
 * @createDate 04/12/2015
 * @requires jquery-1.11.3
 * @name LUI的基础函数库
 * @markdown
 * 
 * ## todo清单 
 * 
 * - 增加节点等的操作，应该可以对ID进行一个增加回调？
 * - 去除默认的内容区格式
 * - 去除移除按钮事件
 * - html格式 绑定数据，格式需要满足要求
 * - ajax加载
 * 
 * ## 心得
 * 
 * - 插件首先不能封装对另一个插件的调用，需要调用时独立封装到其他文件 
 * - 插件只需要完成**自身**的业务逻辑、UI控制和数据操作即可，禁止跨插件操作
 * - 插件需要有一种最简单的默认业务、UI和操作行为
 * - 制作插件时，首页要明白自已要操作哪些东西：对于页面来说，有2个是必须的，一是操作节点对象，二是操作节点数据
 * - 插件之前交互的应该只有数据，而不进行其他操作。可以在数据里增加一项私有键名_owner：str，以显示说明，这个数据被哪些对象操作过或者这条数据的所有者属于哪几个对象实例
 * - 如果不想不同插件操作同一数据源，则应该先对数据源进行克隆一份
 * - 然后根据基础业务需求，写出一系列的API方法
 * - 每一个方法都要考虑到的事情有：1.验证参数是否合法，2.对操作对象进行一次筛选，以求操作的对象都是合法健全的最终操作对象
 * - 对节点数据的操作都应该实时更新的出来
 * 
 * ## 更新历史
 * - 增加filterNode()方法，考虑加入可直接搜索表达式
 * 
 * ## todo
 * 验证回调函数的顺序是否正确
 */

"use strict";

/**
 * 数据操作面板视图窗口
 * @param {string} panelId    面板视图选择器ID
 * @param {Object} data 数据源
 * @param {Object} setting 配置参数
 * @param {function} callback 回调函数
 */
var LUIController = function (panelId, setting, callback) {
	var me = this;

	me.$me = $(panelId);

	me.config = {
		//角色名称，默认则生成一个随机数值
		_roleName: Math.round(new Date().getMilliseconds() * Math.random() * 1000),
		//一个唯一的ID指数成长器
		_uniqueID: 19890129,
		//用户是否对文本进行了自定义
		_userDefined: false,
		//
		store: {
			data: [
					/*{"id":"01","name":"msl"}*/
				//数据源中请必须设置id和name
				//若未设置ID，ID取值为_roleName+_uniqueID的值，因此，如果想固定一个ID的话，请设置_roleName的名称
				//若未设置NAME，NAME取值为ID
			]
		},
		//功能配置
		view: {
			//启用控制栏
			enabledcontrol: false,

			/*
			//自定义内容区html格式
			nodeFormater: function (nodeData) {
				//return 每一项的格式
			},

			//自定义控制器html格式
			controlFormater: function () {
				//return 控制器格式

			}*/
		},

		//回调事件
		callback: {

			//异步加载失败回调事件
			asyncErrorCallback: function ($addNode, obj) {

			},
			//异步加载成功回调事件
			asyncSuccessCallback: function ($addNode, obj) {

			},

			//页面载入成功事件
			loadCallback: function ($addNode, obj) {

			},

			//每个节点生成后的回调事件
			nodeCallback: function ($currentNode, obj) {

			},

			//节点点击事件
			nodeOnClick: function ($currentNode, obj) {

			},

			//默认确定事件
			yesCallback: function ($self, obj) {

			},

			//默认取消事件
			noCallback: function ($self, obj) {

			},


		}
	};

	//初始化
	var init = function (setting, callback) {
		me.load(setting, callback);
	};

	if (setting && $.type(setting) == "object") {
		//覆盖配置
		init(setting, callback)
	} else if (setting && $.type(setting) == "function") {
		//覆盖配置
		init([], setting);
	} else {
		init();
	}

};

//TODO
//AJAX加载成功后，可以执行一个回调函数
LUIController.prototype.loadAJAX = function (setting, callback) {

	}
	/**
	 * 首次数据load(data, setting, callback)
	 * 1.若在HTML页面中已存在即有的元素，且参数中也没有传入data，以此html作为原数据
	 * 2.data和setting是可选的，传入空参数时，仅实例化面板视图对象，该项可用于初始化一个空面板
	 * 3.传入data时，会根据数据初始化面板，返回所有成功生成的对象
	 * 4.对于data数据中一般要求存在id和name两个字段，若不存在id字段则按序号生成id（因此要注意ID不要与存在id的数据冲突），若不存在name字段，则使用id的内容，selected可以使节点初始化为选中状态
	 * 5.可以自定义节点格式和控制器格式
	 * @param   {ObjectArray|urlAJAX} data     可选，数据为数组对象或者一个JSON对象，数据值的关键字为"data"
	 * @param   {Object}              setting  可选，参数配置，不配置时默认开启控制器操作和移除按钮，需关闭请设置为false
	 * @param   {Object}              callback 载入成功后的回调
	 * @returns {Boolean}             成功插入，则返回插入的对象，插入失败则返回false
	 */
//TODO 加载方式，可以是附加方式loadMode:true，默认false，清除附加
LUIController.prototype.load = function (setting, callback) {
		//销毁原对象
		var me = this;

		//合并载入回调事件
		if (setting && setting.callback && setting.callback.loadCallback) {
			setting.callback.loadCallback = merge(me.config, setting, "loadCallback");
		}

		//合并节点点击回调事件
		if (setting && setting.callback && setting.callback.nodeOnClick) {
			setting.callback.nodeOnClick = merge(me.config, setting, "nodeOnClick");
		}

		//合并确定函数
		if (setting && setting.callback && setting.callback.yesCallback) {
			setting.callback.yesCallback = merge(me.config, setting, "yesCallback");
		}
		//合并取消函数
		if (setting && setting.callback && setting.callback.noCallback) {
			setting.callback.noCallback = merge(me.config, setting, "noCallback");
		}

		//覆盖配置
		me.config = $.extend(true, me.config, setting);

		//setting存在且setting._userDefined没有明确的设置为false时，都说明用户进行了自定义配置参数
		if (setting && $.type(setting._userDefined) == "undefined") {
			me.config._userDefined = true;
		}

		var validateData = me.validateData(me.config.store.data);

		var $addNode;

		//内容区和控制区dom不管如何，都必须在初始化时生成一次
		//内容区Dom
		//假如已存在html元素(格式要求需要符合格式)，且未传入数据，且未设置自定义格式化，则不再生成
		//弊端：无法初始化默认绑定的数据，适用于不进数据操作的情况下生成
		if (me.config._userDefined == false && me.$me.find('[data-role="content"]').length > 0 && $.isEmptyObject(validateData)) {
			me.$content = me.$me.find('[data-role="content"]');
			$addNode = me.getAllNode();

			//首先缓存data-*
			//缓存class
			//缓存id
			//缓存name和image
			for (var i = 0; i < $addNode.length; i++) {
				//对每一对象缓存数据
				$addNode.eq(i).data("data", {});
				var $currentNode = $addNode.eq(i);
				var currentData = $currentNode.data("data");

				//缓存节点数据
				for (var key in $currentNode.data()) {
					if (key != "data") {
						currentData[key] = $currentNode.data()[key];
					}
				}

				//如果存在图片
				if ($currentNode.find("img").attr("src")) {
					currentData.image = $currentNode.find("img").attr("src")
				}

				//如果存在文本
				if ($currentNode.text()) {
					currentData.name = $currentNode.text()
				}

				//缓存序号
				currentData.index = i;
			}
		} else {

			//生成

			if (me.$me.find('[data-role="content"]').length <= 0) {
				me.$content = $('<div class="content clearfix" data-role="content"></div>');
				me.$me.append(me.$content)
			} else {
				me.$content = me.$me.find('[data-role="content"]');
			}

			//清空所有原数据
			me.cleanAllNode();

			//根据data生成内容
			$addNode = me.addNode(validateData);

		}

		//控制器Dom
		//开启控制器区enabledcontrol，默认生成确认和取消按钮，若存在自定义配置参数，则以自定义配置为准
		//假如未使用自定义setting配置，且已存在html元素（格式需要符合要求），并且自定义格式化里没有自定义配置项
		if (!setting && me.$me.find('[data-role="control"]').length > 0 && !(me.config.view && me.config.view.enabledcontrol)) {
			me.$control = me.$me.find('[data-role="control"]');
		} else if (me.config.view && me.config.view.enabledcontrol) {
			//生成
			//清空所有原数据
			if (me.$me.find('[data-role="control"]').length <= 0) {
				me.$control = $('<div class="control clearfix" data-role="control"></div>');
				me.$me.prepend(me.$control);
			} else {
				me.$control = me.$me.find('[data-role="control"]');
				me.$control.empty()
			}


			var controlHtml;
			if (me.config.view && me.config.view.controlFormater && $.type(me.config.view.controlFormater) == "function") {
				controlHtml = me.config.view.controlFormater();
			} else {
				controlHtml = '<a class="btn btn-success btn-large" data-role="yes" href="javascript:void(0);">确定</a>\n<a class="btn btn-danger btn-large" data-role="no" href="javascript:void(0);">取消</a>';
			}
			me.$control.append(controlHtml);
		} else {
			if (me.$control) {
				me.$control.remove()
				delete me.$control;
			}
		}

		//默认事件侦听器

		me.$content.undelegate();

		//默认选项点击事件(无)
		me.$content.delegate("[data-role='node']", "click", function (event) {
			//自定义点击事件

			if (me.config.callback && me.config.callback.nodeOnClick && $.type(me.config.callback.nodeOnClick) == "function") {
				me.config.callback.nodeOnClick($(this), me);
			} else {
				//点击默认无行为
			}
		});

		//默认控制器区事件
		if (me.config.view && me.config.view.enabledcontrol) {
			me.$control.undelegate();

			//存在控制区时，绑定默认事件
			//默认控制器确认事件
			me.$control.delegate("[data-role='yes']", "click", function (event) {
				//自定义点击事件
				if (me.config.callback && me.config.callback.yesCallback && $.type(me.config.callback.yesCallback) == "function") {
					me.config.callback.yesCallback($(this), me);

				}
			});

			//默认控制器取消事件
			me.$control.delegate("[data-role='no']", "click", function (event) {
				//自定义点击事件
				if (me.config.callback && me.config.callback.noCallback && $.type(me.config.callback.noCallback) == "function") {
					me.config.callback.noCallback($(this), me);
				}
			});

		}



		//全局性载入成功回调
		if (me.config.callback && me.config.callback.loadCallback && $.type(me.config.callback.loadCallback) == "function") {
			me.config.callback.loadCallback($addNode, this);
		}

		if (callback && $.type(callback) == "function") {
			callback($addNode, this);
		}

		//返回增加的对象
		return $addNode;

	}
	/**
	 * 重载数据，仅变更节点内容区，其他内容不作改变
	 * @param   {Object|ObjectArray} data     重新加载的数据
	 * @param   {Function} callback 回调函数
	 * @returns {Object}   返回被重载后的JQ节点对象
	 */
	//TODO  AJAX加载
LUIController.prototype.reload = function (data, callback) {

		if (!data) {
			return false;
		}

		var validateData = this.validateData(data);

		//重载前老的节点对象
		var $removeNode = this.cleanAllNode();
		//重载后新的节点对象
		var $addNode = this.addNode(validateData);

		if ($addNode.length > 0) {

			//触发自身回调
			if (callback && $.type(callback) == "function") {
				callback($addNode, $removeNode, this);
			}
			//返回增加的对象
			return $addNode;
		} else {
			return false;
		}
	}
	/**
	 * 移除整个对象
	 * @param   {Function} callback 回调函数
	 * @returns {Object} 返回被移除的对象
	 */
LUIController.prototype.destory = function (callback) {
	this.$me.remove();

	if (callback && $.type(callback) == "function") {
		callback(this);
	}
	return this;
}

/**
 * 返回指定的JQ节点对象
 * @param   {Number|String|StringArray|JQObject} nodeId ID字符串 | 数组ID字符串 | JQ节点对象 
 * @param   {Function} callback 回调函数
 * @returns {JQObject} 返回选中的JQ节点对象
 */
LUIController.prototype.getNodeById = function (nodeId, callback) {

	var $getNode;
	if ($.type(nodeId) == "number" || $.type(nodeId) == "string") {
		//$getNode = this.getAllNode().filter('#' + nodeId);
		$getNode = this.getAllNode().filter('[data-id="' + nodeId + '"]');
	} else if ($.type(nodeId) == "object" && !$.isPlainObject(nodeId)) {
		$getNode = nodeId;
	} else if ($.type(nodeId) == "array") {
		var selector = "";
		for (var i = 0; i < nodeId.length; i++) {
			if ($.type(nodeId[i]) == "number" || $.type(nodeId[i]) == "string") {
				selector += '[data-id="' + nodeId[i] + '"]' + ",";
			}
			if ($.type(nodeId[i]) == "object" && !$.isPlainObject(nodeId[i])) {
				var getId = this.getDataById(nodeId[i], "id")
				selector += '[data-id="' + getId + '"]' + ",";
			}
		}
		$getNode = this.getAllNode().filter(selector.slice(0, -1));
	} else {
		$getNode = [];
	}

	if (callback && $.type(callback) == "function") {}

	//返回被查找到的对象
	return $getNode;
}

/**
 * 获取所有JQ节点对象
 * @param   {Function} callback 回调函数
 * @returns {JQObject} 返回所有JQ节点对象
 */
LUIController.prototype.getAllNode = function (callback) {
	var $allNode = this.$content.find('[data-role="node"]');

	if (callback && $.type(callback) == "function") {
		callback($allNode, this);
	}
	return $allNode;
}

/**
 * 获取选中的JQ节点对象
 * @param   {Function} callback 回调函数
 * @returns {JQObject} 返回选中的JQ节点对象
 */
LUIController.prototype.getSelectedNode = function (callback) {
	var $selectedNode = this.getAllNode().filter('[data-state="selected"]');

	if (callback && $.type(callback) == "function") {
		callback($selectedNode, this);
	}
	return $selectedNode;
}

/**
 * 增加JQ节点对象
 * 1.根据数据增加节点
 * 2.暂不支持：无法直接附加JQ节点对象：原节点删除
 * //addnote要求，只能根据数据附加，无法按节点附加
 * 3.可一次性增加多个节点
 * 4.功能测试：增加一个数据节点，增加多个数据节点，增加一个节点对象，增加多个节点对象，根据位置增加节点对象
 * 5.返回测试：新增的节点带的数据，新增的节点对象带的数据
 * @param   {[[Type]]} data     [[Description]]
 * @param   {Number} index    位置，正整数
 * @param   {Function} callback 回调函数
 * @returns {JQObject|Boolean} 成功：返回增加JQ节点对象，失败：返回false
 */
LUIController.prototype.addNode = function (data, index, callback) {

	var validateData = this.validateData(data);

	//增加项临时缓存区
	var $addNodeCache = $("<div></div>");

	var $addNode;

	for (var i = 0; i < validateData.length; i++) {

		//检查ID，若不存在则配置唯一ID
		if (!validateData[i].id) {
			//不存在id时随机指定，并存储到data里
			validateData[i].id = this.config._roleName + "" + this.config._uniqueID++;
		}

		//检查name值，若不存在则使用id
		if (!validateData[i].name) {
			validateData[i].name = validateData[i].id;
		}

		//根据nodeFormater函数格式化节点
		if (this.config.view && this.config.view.nodeFormater && $.type(this.config.view.nodeFormater) == "function") {
			$addNode = $(this.config.view.nodeFormater(validateData[i]));
		} else {
			//默认格式
			$addNode = $('<div>' + validateData[i].name + '</div>');
		}

		//定义节点属性：ID、序号、角色和初始样式
		$addNode.attr("data-role", "node");
		$addNode.attr("data-index", i);
		$addNode.attr("data-id", validateData[i].id);
		$addNode.addClass("node");

		//绑定数据：增加角色、序号、拥有者
		validateData[i].index = i;
		//增加私有角色属性
		validateData[i]._role = "node";
		//增加数据拥有者属性
		validateData[i]._owner = validateData[i]._owner || [];
		validateData[i]._owner.push(this.config._roleName)

		//节点保存数据
		$addNode.data("data", validateData[i]);

		//缓存区暂存节点
		$addNodeCache.append($addNode);

		//节点创建成功后的回调
		if (this.config.callback && this.config.callback.nodeCallback && $.type(this.config.callback.nodeCallback) == "function") {
			this.config.callback.nodeCallback($addNode, this);
		}
	}

	var $addNodeArray = $addNodeCache.children();

	//插入到指定位置
	if ($.type(parseInt(index)) == "number" && parseInt(index) >= 0) {
		var $targetNode = this.getAllNode().eq(parseInt(index));
		$targetNode.before($addNodeArray);
	} else {
		this.$content.append($addNodeArray);
	}

	//初始化节点状态
	for (var i = 0; i < $addNodeArray.length; i++) {
		var currentNodeData = this.getDataById($addNodeArray.eq(i));
		this.setNodeState(currentNodeData.id, currentNodeData.state);
	}

	if (index && $.type(index) == "function") {
		callback = index;
	}

	//触发自身回调
	if (callback && $.type(callback) == "function") {
		callback($addNodeArray, this);
	}

	//返回增加的对象
	return $addNodeArray;
}

/**
 * 克隆JQ节点对象，对克隆数据的操作不会影响到原数据的变化
 * @param   {Number|String|StringArray|JQObject} nodeId ID字符串 | 数组ID字符串 | JQ节点对象 
 * @param   {Boolean} cloneMode 克隆模式，ture时并不是克隆节点对象，而是对那个镜象对象的引用镜像，即数据指向是一致的,false是独立复制了一份数据并克隆(默认)
 * @param   {Function} callback  回调函数
 * @returns {JQObject|Boolean} 成功：返回克隆JQ节点对象，失败：返回false
 */
LUIController.prototype.cloneNode = function (nodeId, cloneMode, callback) {

	var $getNode = this.getNodeById(nodeId);

	var $cloneNodeCache = $("<div></div>");

	for (var i = 0; i < $getNode.length; i++) {

		var $currentNode = $getNode.eq(i);
		var $cloneNode = $currentNode.clone();

		if (cloneMode && $.type(cloneMode) == "boolean") {
			$cloneNode.data("data", this.getDataById($currentNode));
		} else {
			var cloneData = this.cloneData(this.getDataById($currentNode))
			$cloneNode.data("data", cloneData);
		}
		$cloneNodeCache.append($cloneNode);
	}

	var $cloneNodeArray = $cloneNodeCache.children();

	if (cloneMode && $.type(cloneMode) == "function") {
		callback = cloneMode;
	}

	//触发自身回调
	if (callback && $.type(callback) == "function") {
		callback($cloneNodeArray, $getNode, this);
	}
	//返回删除的对象
	return $cloneNodeArray;
}

/**
 * 移除JQ节点对象
 * @param   {Number|String|StringArray|JQObject} nodeId   ID字符串 | 数组ID字符串 | JQ节点对象
 * @param   {Function} callback 回调函数
 * @returns {JQObject|Boolean} 成功：返回被移除的JQ节点对象，失败：返回false
 */
LUIController.prototype.removeNode = function (nodeId, callback) {

	var $getNode = this.getNodeById(nodeId);

	var $removeNodeCache = $("<div></div>");

	for (var i = 0; i < $getNode.length; i++) {
		var $currentNode = $getNode.eq(i);
		var $currentNodeData = this.getDataById($currentNode);
		var $removeNode = $currentNode.remove();
		$removeNode.data("data", $currentNodeData);
		$removeNodeCache.append($removeNode);
	}

	var $removeNodeArray = $removeNodeCache.children();

	//触发自身回调
	if (callback && $.type(callback) == "function") {
		callback($removeNodeArray, this);
	}
	//返回删除的对象
	return $removeNodeArray;
};

/**
 * 移除所有JQ节点对象
 * @param   {Number|String|StringArray|JQObject} nodeId   ID字符串 | 数组ID字符串 | JQ节点对象
 * @param   {Function} callback 回调函数
 * @returns {JQObject|Boolean} 成功：返回被移除的JQ节点对象，失败：返回false
 */
LUIController.prototype.cleanAllNode = function (callback) {
	var $allNode = this.getAllNode();

	var $removeNode = this.removeNode($allNode);

	if (callback && $.type(callback) == "function") {
		callback($removeNode, this);
	}
	//返回被清空的所有的对象
	return $removeNode;
};

/**
 * 替换JQ节点对象，请求替换的源可以是新数据，也可以是节点对象
 * @param   {Number|String|StringArray|JQObject} nodeId   ID字符串 | 数组ID字符串 | JQ节点对象
 * @param   {Object||JQObject}                           data     新数据源或JQ节点对象
 * @param   {Function}                           callback 回调函数
 * @returns {JQObject|Boolean}                   成功：返回被替换后的新JQ节点对象，失败：返回false
 */
LUIController.prototype.replaceNode = function (nodeId, data, callback) {

	var $getNode = this.getNodeById(nodeId);

	var $addNodeCache = $("<div></div>");

	for (var i = 0; i < $getNode.length; i++) {

		var $addNode;
		if (data && $.type(data) == "object" && !$.isPlainObject(data)) {
			//如果data是一个节点对象，则替换节点
			$addNode = this.cloneNode(data, true);
		} else if (data && $.type(data) == "object") {
			$addNode = this.addNode(data);
		} else {
			//若data参数
			return []
		}
		$addNodeCache.append($addNode)
	}

	var $addNodeArray = $addNodeCache.children();

	var baseNumber = $addNodeArray.length / $getNode.length;

	for (var i = 0; i < $getNode.length; i++) {
		for (var j = (i + 1) * baseNumber; j >= i * baseNumber; j--) {
			$getNode.eq(i).after($addNodeArray.eq(j));
		}
	}

	this.removeNode($getNode);

	if (callback && $.type(callback) == "function") {
		callback($addNodeArray, $getNode, this);
	}

	//返回被替换的对象
	return $addNodeArray;
};

/**
 * 排序JQ节点对象
 * @param   {Number|String|StringArray|JQObject} nodeId   ID字符串 | 数组ID字符串 | JQ节点对象
 * @param   {String|StringArray} orderKey  需要排序字段，无默认值，默认按他自已在文档流中的顺序排列
 * @param   {String|StringArray} orderType 排序方式，默认不作排序（以其在文档流中的顺序为准），"asc"升序，"desc"降序，若排序方式少于排序字段，则默认以前一个的排序方式值
 * @param   {Function} callback   回调函数
 * @returns {JQObject|Boolean} 成功：返回被排序成功的新JQ节点对象顺序，失败：返回false
 */

LUIController.prototype.sortNode = function (nodeId, orderKey, orderType, callback) {
	var $filterNode = this.getNodeById(nodeId);
	var $allNode = this.getAllNode();

	//递归
	var orderKeyArray = [],
		orderTypeArray = [];
	//判断之后的一一个排序字段是顺序，如果相等，则继续传值递归
	if (orderKey && $.type(orderKey) == "string") {
		orderKeyArray.push(orderKey);
	} else if (orderKey && $.type(orderKey) == "array") {
		orderKeyArray = orderKey;
	}

	if (orderType && $.type(orderType) == "string") {
		orderTypeArray.push(orderType);

	} else if (orderType && $.type(orderType) == "array") {
		orderTypeArray = orderType;
	}


	//若排序方式与排序字段数量不对称，方式>字段时，忽略方式后面的值；字段>方式是，以方式的最后一个值，填充至与字段相同的长度
	if (orderTypeArray.length > orderKeyArray.length) {
		orderTypeArray = orderTypeArray.slice(0, orderKeyArray.length);
	} else if (orderTypeArray.length < orderKeyArray.length) {
		var num = orderKeyArray.length - orderTypeArray.length;

		while (num > 0) {
			num--;
			if ($.type(orderTypeArray[orderTypeArray.length - 1]) == "undefined") {
				orderTypeArray.push("desc");
			} else {
				orderTypeArray.push(orderTypeArray[orderTypeArray.length - 1]);

			}
		}
	}
	var $sortNode

	//如果存在排序字段，在每次过滤排序之前，要重置元素为本来的序位
	if (orderKeyArray.length > 0) {
		//节点序号缓存
		var $initIndexNodeCache = $("<div></div>");
		var allId = this.dataToArray(this.getAllData("index"));
		var sortAllId;
		//升序
		sortAllId = $.map(allId, function (n) {
			return n
		}).sort();

		for (var j = 0; j < sortAllId.length; j++) {
			var index = $.inArray(sortAllId[j], allId)
			$initIndexNodeCache.append($allNode.eq(index));
		}

		this.$content.append($initIndexNodeCache.children());
		//重置End


		var $sortNodeCache = $("<div></div>");

		//首次排序 Start
		//排序前的字段位置id
		var filterKeyId = this.dataToArray(this.getDataById($filterNode, "id"));
		var sortKeyId;
		var i = 0;
		//取得暂存区的节点（刷新序位）
		//过滤得到需要排序的数据字段
		var filterKey = this.dataToArray(this.getDataById($filterNode, orderKeyArray[0]));
		var sortKey;

		//根据orderType类型决定当前字段的排序方式
		if (!orderTypeArray[0]) {
			//不排序，正常文档流位置，加入位置则正常
			$sortNodeCache.append($filterNode);
		} else {
			if (orderTypeArray[0] && orderTypeArray[0].toLowerCase() === "asc") {
				//升序
				sortKey = $.map(filterKey, function (n) {
					return n
				}).sort();
			} else if (orderTypeArray[0] && orderTypeArray[0].toLowerCase() === "desc") {
				//降序
				sortKey = $.map(filterKey, function (n) {
					return n
				}).sort().reverse();
			}

			//判断他们之间是否有数值相等
			for (var j = 0; j < sortKey.length; j++) {

				var index = $.inArray(sortKey[j], filterKey);

				filterKey[index] = "";
				//过滤后将filterKey里的值给清空，避免重复取得
				$sortNodeCache.append($filterNode.eq(index));
			}

			//首次排序得到新的排序后的ID值
			sortKeyId = this.dataToArray(this.getDataById($sortNodeCache.children(), "id"));
		}
		//首次排序 End

		//检索是否还存在排序字段 
		while ((i++) < orderKeyArray.length) {
			//若存在
			//比较当前排序后两个值是前后是否相等,最后一个值不作比较

			//执行2次：第1次对第1个以后的字段先排序，第2次对第1个进行排序
			for (var z = 0; z < 2; z++) {
				for (var k = 0; k < sortKey.length - 1; k++) {
					var fNode = $sortNodeCache.children().eq(k);
					var sNode = $sortNodeCache.children().eq(k + 1);
					//重新排序后的当前字段值
					var fCurrentKeyData = this.getDataById(fNode, orderKeyArray[i - 1])[orderKeyArray[i - 1]];
					var sCurrentKeyData = this.getDataById(sNode, orderKeyArray[i - 1])[orderKeyArray[i - 1]];
					if (fCurrentKeyData == sCurrentKeyData) {
						//若相同，计算下一个排序字段的值
						//获取下一个排序字段
						var nextOrderKey = orderKeyArray[i];
						var nextOrderType = orderTypeArray[i];
						var fKeyData = this.getDataById(fNode, nextOrderKey)[nextOrderKey];
						var sKeyData = this.getDataById(sNode, nextOrderKey)[nextOrderKey];

						//取得这2个值的下一个排序字段的数据值，进行比较，
						if (nextOrderType && nextOrderType.toLowerCase() === "asc") {
							//比较两个值哪个大，大的放后面
							if (fKeyData > sKeyData) {
								sNode.after(fNode);
							} else {
								fNode.after(sNode);
							}
						} else if (nextOrderType && nextOrderType.toLowerCase() === "desc") {
							//比较两个值哪个大，大的放前面
							if (fKeyData > sKeyData) {
								fNode.after(sNode);
							} else {
								sNode.after(fNode);
							}
						}
					}
				}
			}
		}

		//循环结束后将排序后的节点顺序附加到内容区中
		$sortNode = $sortNodeCache.children();
		this.$content.prepend($sortNode);
	} else {
		$sortNode = this.getAllNode();
	}
	//如果第二和第三个参数是函数
	if (orderKey && $.type(orderKey) == "function") {
		callback = orderKey;
	}
	if (orderType && $.type(orderType) == "function") {
		callback = orderType;
	}
	if (callback && $.type(callback) == "function") {
		callback($sortNode, $filterNode, this);
	}

	//返回被排序后的对象
	return $sortNode;
};

/**
 * 过滤JQ节点对象
 * @param {String|RegExp} pattern   过滤表达式（使用正则表达式时，将忽略matchmode）或过滤字符串
 * @param {String|Array} searchKey 搜索的字段，默认搜索name字段，all表示全部
 * @param {Boolean} matchMode 匹配模式：精确匹配(false默认)，模糊匹配(true)
 * @param {Boolean} filterMode 过滤模式，true表示删除非指定的节点,false（默认）表示仅隐藏并不删除非指定的节点
 * @param {Function} callback  回调函数
 * @returns {JQObject|Boolean} 成功：返回被过滤成功的JQ节点对象，失败：空
 */
LUIController.prototype.filterNode = function (pattern, searchKey, matchMode, filterMode, callback) {
		var $allNode = this.getAllNode();
		//根据过滤条件，过滤节点ID数组 
		var $filterNode;
		var filterNodeId = [];
		//filterMode为true时下被移出的节点，若非true则表示移出节点为空
		var $removeNode = [];

		//若过滤内容不存在，则显示所有节点
		if (!pattern) {
			$filterNode = $allNode;
			$filterNode.show();
		} else {
			//参数后移
			if ($.type(searchKey) == "boolean") {
				callback = filterMode;
				filterMode = matchMode;
				matchMode = searchKey;
			}
			var filterExp = "";
			if (pattern && $.type(pattern) == "regexp") {
				filterExp = pattern;
			} else if (pattern && $.type(pattern) == "string") {
				//如果为字符串格式，则转为正则
				if (matchMode && $.type(matchMode) == "boolean") {
					filterExp = $.trim(pattern.replace(/\s+/g, ""));
					var reg = "";
					for (var i = 0; i < filterExp.length; i++) {
						reg += filterExp[i] + "+.*";
					}
					filterExp = reg;
				} else {
					filterExp = $.trim(pattern).replace(/\s+/g, " ");
					filterExp = filterExp.replace(/\s+/g, "+.*");
				}
				filterExp = eval("/" + filterExp + "/g");
			}

			//检索查询
			for (var i = 0; i < $allNode.length; i++) {
				//筛选数据
				var $getNode = $allNode.eq(i)
				var getData;
				//字符串，或者数组
				if (searchKey && $.type(searchKey) == "string" && searchKey == "all") {
					getData = this.getDataById($getNode);
				} else if (searchKey && ($.type(searchKey) == "string" || $.type(searchKey) == "array")) {
					getData = this.getDataById($getNode, searchKey);
				} else {
					//默认只查name字段
					getData = this.getDataById($getNode, "name");
				}

				for (var key in getData) {
					//开始查询
					if ($.trim(getData[key]).search(filterExp) >= 0) {
						filterNodeId.push(this.getDataById($getNode).id)
						continue;
					}
				}
			}

			//隐藏所有节点
			$allNode.hide();
			//过滤得到的节点
			$filterNode = this.getNodeById(filterNodeId);

			//显示查询结果节点
			if ($filterNode.length > 0) {
				//未成功筛选的节点
				var allData = this.dataToArray(this.getAllData("id"));
				//排序所有节点中已经过滤得到的节点
				var hideId = $.grep(allData, function (n, i) {
					if ($.inArray(n, filterNodeId) < 0) {
						return n
					}
				});
				//严格过滤模式
				if (filterMode && $.type(filterMode) == "boolean") {
					$removeNode = this.removeNode(this.getNodeById(hideId));
				} else {
					$removeNode = this.getNodeById(hideId);
				}
				$filterNode.show();
			}
		}

		if (searchKey && $.type(searchKey) == "function") {
			callback = searchKey;
		}

		if (matchMode && $.type(matchMode) == "function") {
			callback = matchMode;
		}
		if (filterMode && $.type(filterMode) == "function") {
			callback = filterMode;
		}
		if (callback && $.type(callback) == "function") {
			callback($filterNode, $removeNode, this);
		}
event.stopPropagation();
		return $filterNode;
	}
	/**
	 * 刷新JQ节点对象，使用现在的数据源重新格式化目标节点
	 * @param   {Number|String|StringArray|JQObject} nodeId   ID字符串 | 数组ID字符串 | JQ节点对象
	 * @param   {Function} callback   回调函数
	 * @returns {JQObject|Boolean} 成功：返回被刷新成功的JQ节点对象，失败：返回false
	 */
LUIController.prototype.refreshNode = function (nodeId, callback) {

	var $getNode = this.getNodeById(nodeId);

	var $addNodeCache = $("<div></div>");

	for (var i = 0; i < $getNode.length; i++) {
		var getData = this.getDataById($getNode.eq(i));
		var $addNode = this.addNode(getData);
		$addNodeCache.append($addNode);
	}

	var $refreshNode = $addNodeCache.children();

	for (var i = 0; i < $getNode.length; i++) {
		$getNode.eq(i).after($refreshNode.eq(i));
	}

	this.removeNode($getNode);

	if (callback && $.type(callback) == "function") {
		callback($refreshNode, this);
	}
	//返回被刷新成功的JQ节点对象
	return $refreshNode;
}

/**
 * 设置JQ节点对象的状态值
 * @param   {Number|String|StringArray|JQObject} nodeId   ID字符串 | 数组ID字符串 | JQ节点对象
 * @param   {String} state      自定义状态名：常用默认的有禁用disabled，选中selected
 * @param   {String} stateClass 自定义样式名：常用默认的有禁用disabled，选中selected，也可以直接写样式
 * @param   {Function} callback   回调函数
 * @returns {JQObject|Boolean} 成功：返回被成功设置的JQ节点对象，失败：返回false
 */
LUIController.prototype.setNodeState = function (nodeId, state, stateClass, callback) {

	var $getNode = this.getNodeById(nodeId);

	for (var i = 0; i < $getNode.length; i++) {
		//存储状态数据
		if (state && $.type(state) == "string") {
			$getNode.eq(i).attr("data-state", state);
			this.replaceNodeData($getNode.eq(i), "state", state)
		} else {
			$getNode.eq(i).removeAttr("data-state");
			this.removeNodeData($getNode.eq(i), "state")
		}

		if (stateClass && $.type(stateClass) == "string") {
			//样式名称或直接的样式属性
			if (stateClass.indexOf("{") >= 0 && stateClass.indexOf("}") >= 0) {
				$getNode.eq(i).attr("style", stateClass.slice(1, -1))
			} else {
				$getNode.eq(i).attr("class", "node")
				$getNode.eq(i).addClass(stateClass);
			}
		} else {
			if (state) {
				$getNode.eq(i).attr("class", "node")
				$getNode.eq(i).addClass(state);
			} else {
				$getNode.eq(i).attr("class", "node")
			}
		}
	}

	//如果第一和第二个参数是函数
	if (state && $.type(state) == "function") {
		callback = state;
	}
	if (stateClass && $.type(stateClass) == "function") {
		callback = stateClass;
	}
	if (callback && $.type(callback) == "function") {
		callback($getNode, this);
	}
	//返回被设置的对象
	return $getNode;
}

/**
 * 禁用JQ节点对象
 * @param   {Number|String|StringArray|JQObject} nodeId   ID字符串 | 数组ID字符串 | JQ节点对象
 * @param   {String} disabledClass 自定义禁用样式
 * @param   {Function} callback   回调函数
 * @returns {JQObject|Boolean} 成功：返回被禁用的JQ节点对象，失败：返回false
 */
LUIController.prototype.disableNode = function (nodeId, disabledClass, callback) {

	var $disabledNode;
	if (disabledClass && $.type(disabledClass) == "string") {
		$disabledNode = this.setNodeState(nodeId, "disabled", disabledClass);
	} else {
		$disabledNode = this.setNodeState(nodeId, "disabled", "disabled");
	}

	//如果第二个参数是函数
	if (disabledClass && $.type(disabledClass) == "function") {
		callback = disabledClass;
	}

	if (callback && $.type(callback) == "function") {
		callback($disabledNode, this);
	}
	//返回被选中的对象
	return $disabledNode;
}

/**
 * 选中JQ节点对象
 * @param   {Number|String|StringArray|JQObject} nodeId   ID字符串 | 数组ID字符串 | JQ节点对象
 * @param   {String} disabledClass 自定义选中样式
 * @param   {Function} callback   回调函数
 * @returns {JQObject|Boolean} 成功：返回被选中的JQ节点对象，失败：返回false
 */
LUIController.prototype.selectNode = function (nodeId, selectedClass, callback) {

	var $selectedNode;
	if (selectedClass && $.type(selectedClass) == "string") {
		$selectedNode = this.setNodeState(nodeId, "selected", selectedClass);
	} else {
		$selectedNode = this.setNodeState(nodeId, "selected", "selected");
	}

	//如果第二个参数是函数
	if (selectedClass && $.type(selectedClass) == "function") {
		callback = selectedClass;
	}
	if (callback && $.type(callback) == "function") {
		callback($selectedNode, this);
	}
	//返回被选中的对象
	return $selectedNode;
}

/**
 * 取消选中JQ节点对象
 * @param   {Number|String|StringArray|JQObject} nodeId   ID字符串 | 数组ID字符串 | JQ节点对象
 * @param   {Function} callback   回调函数
 * @returns {JQObject|Boolean}   成功：返回被取消选中的JQ节点对象，失败：返回false
 */
LUIController.prototype.cancelSelectedNode = function (nodeId, callback) {
	//取消选中时，样式小时，数据绑定也消失
	var $getNode = this.getNodeById(nodeId);

	var $cancelSelectNodeArray = [];
	for (var i = 0; i < $getNode.length; i++) {

		var getData = this.getDataById($getNode.eq(i));
		if ( /*getData && */ getData.state == "selected") {
			$cancelSelectNodeArray.push(this.setNodeState($getNode.eq(i)))
		}
	}

	if (callback && $.type(callback) == "function") {
		callback($cancelSelectNodeArray, this);
	}

	//返回被取消选中的对象
	return $cancelSelectNodeArray;
}

/**
 * 取消所有选中JQ节点对象
 * @param   {Number|String|StringArray|JQObject} nodeId   ID字符串 | 数组ID字符串 | JQ节点对象
 * @param   {Function} callback   回调函数
 * @returns {JQObject|Boolean}   成功：返回被取消选中的所有JQ节点对象，失败：返回false
 */
LUIController.prototype.cleanSelectedNode = function (callback) {

	var $selectedNode = this.getSelectedNode();

	var $cancelSelectNode = this.cancelSelectedNode($selectedNode);

	if (callback && $.type(callback) == "function") {
		callback($cancelSelectNode, this);
	}
	//返回被取消选中的对象
	return $cancelSelectNode;
}


/**
 * JQ节点对象的数据源增加一项记录或多项记录
 * 一项记录时为可以使用key和value2个参数，多项记录时使用key参数，传入格式要求为键/值对格式，忽略value参数
 * 注意：如果要新增的键已存在且存在内容，则不替换它，将会略过，如果键内容为空，则替换它
 * @param   {Number|String|StringArray|JQObject} nodeId   ID字符串 | 数组ID字符串 | JQ节点对象
 * @param   {String|Object} key      键名或键/值对的数据对象
 * @param   {String} value    值名
 * @param   {Function} callback  回调函数
 * @returns {JQObject|Boolean}   成功：返回增加后的新数据源，失败：返回false
 */
LUIController.prototype.addNodeData = function (nodeId, key, value, callback) {

	if (!key) {
		return false;
	}

	var $getNode = this.getNodeById(nodeId);
	var clonedata = _cloneData(this.getDataById($getNode));

	for (var i = 0; i < $getNode.length; i++) {
		var getData = this.getDataById($getNode.eq(i));

		if ($.type(key) == "string" && $.type(value) == "string") {
			if (!getData[key]) {
				getData[key] = value;
			}
		} else if ($.type(key) == "object") {
			for (var keyName in key) {
				if (!getData[keyName]) {
					getData[keyName] = key[keyName];
				}
			}
		}
	}

	//如果第三个参数是函数
	if (value && $.type(value) == "function") {
		callback = value;
	}

	if (callback && $.type(callback) == "function") {
		callback(this.getDataById($getNode), clonedata, this);
	}
	//返回增加后新的数据源
	return this.getDataById($getNode);
};

/**
 * JQ节点对象的数据源替换一项记录或多项记录，对于节点数据的更改不会在页面上出现变化，比如更改了数据的名称等等，不能实时显示
 * 注意：与addNodeData不同的地方在于
 * 1.针对查找到的key进行替换
 * 2.未找到key或者无内容，则增加
 * @param   {Number|String|StringArray|JQObject} nodeId   ID字符串 | 数组ID字符串 | JQ节点对象
 * @param   {String|Object} key      键名或键/值对的数据对象
 * @param   {String} value    值名
 * @param   {Function} callback  回调函数
 * @returns {JQObject|Boolean}   成功：返回替换后的新数据源，失败：返回false
 */
LUIController.prototype.replaceNodeData = function (nodeId, key, value, callback) {
	if (!key) {
		return false;
	}

	var $getNode = this.getNodeById(nodeId);
	var clonedata = _cloneData(this.getDataById($getNode));

	for (var i = 0; i < $getNode.length; i++) {
		var getData = this.getDataById($getNode.eq(i));

		if ($.type(key) == "string" && $.type(value) == "string") {
			getData[key] = value;
		} else if ($.type(key) == "object") {
			for (var keyName in key) {
				getData[keyName] = key[keyName];
			}
		}
	}

	//如果第三个参数是函数
	if (value && $.type(value) == "function") {
		callback = value;
	}

	if (callback && $.type(callback) == "function") {
		callback(this.getDataById($getNode), clonedata, this);
	}
	//返回增加后新的数据源
	return this.getDataById($getNode);
};

/**
 * JQ节点对象的数据源移除一项记录或多项记录，对于节点数据的更改不会在页面上出现变化，比如更改了数据的名称等等，不能实时显示
 * 注意：与addNodeData不同的地方在于
 * 1.针对查找到的key进行替换
 * 2.未找到key或者无内容，则增加
 * @param   {Number|String|StringArray|JQObject} nodeId   ID字符串 | 数组ID字符串 | JQ节点对象
 * @param   {String|Array} key      键名或键名数组
 * @param   {Function} callback  回调函数
 * @returns {JQObject|Boolean}   成功：返回移除后的新数据源，失败：返回false
 */
LUIController.prototype.removeNodeData = function (nodeId, key, callback) {
	if (!key) {
		return false;
	}
	var $getNode = this.getNodeById(nodeId);
	var clonedata = _cloneData(this.getDataById($getNode));

	for (var i = 0; i < $getNode.length; i++) {
		var getData = this.getDataById($getNode.eq(i));

		if ($.type(key) == "string") {
			delete getData[key];
		} else if ($.type(key) == "array") {
			for (var j = 0; j < key.length; j++) {
				delete getData[key[j]];
			}
		}
	}

	if (callback && $.type(callback) == "function") {
		callback(this.getDataById($getNode), clonedata, this);
	}
	//返回移除后新的数据源
	return this.getDataById($getNode);
};

/**
 * JQ节点对象的数据源全部移除
 * @param   {Number|String|StringArray|JQObject} nodeId   ID字符串 | 数组ID字符串 | JQ节点对象
 * @param   {Function} callback  回调函数
 * @returns {JQObject|Boolean}   成功：返回移除前的旧数据源，失败：返回false
 */
LUIController.prototype.cleanNodeData = function (nodeId, callback) {

	var $getNode = this.getNodeById(nodeId);
	var cloneData = _cloneData(this.getDataById(nodeId));
	for (var i = 0; i < $getNode.length; i++) {
		var getData = this.getDataById($getNode.eq(i));
		for (var key in getData) {
			delete getData[key]
		}
	}

	if (callback && $.type(callback) == "function") {
		callback(cloneData, this);
	}
	//返回清空前的数据源
	return cloneData;

};

/**
 * 返回指定节点数据，
 * 只有nodeId参数时，返回的是指向原数据源的引用，任何对返回数据源的修改，都会影响老数据源实时反应，如果想修改的数据不影响原数据，请先用cloneData克隆一份数据源
 * 存在key参数时，将返回被筛选后的原数据源的克隆数据，任何对返回数据源的修改，都不会影响老数据源
 * 操作的节点对象只有一个时，直接返回对该数据的引用
 * 操作的节点对象只有一个时，且键名只有一个时，将返回复制过数据源的字符串格式
 * 操作的节点对象多个时，但键名只有一个时，将返回复制过数据源的字符串数组格式

 * @param   {Number|String|StringArray|JQObject} nodeId   ID字符串 | 数组ID字符串 | JQ节点对象
 * @param   {String|Array} key        指定要筛选的键名字符串，或键名数组
 * @param   {Boolean} filterMode 严格筛选模式（默认关闭）：被筛选的数据中，必须包括全部的键名才被筛选
 * @param   {Function} callback  回调函数
 * @returns {JQObject|Boolean}   成功：返回不同情况的数据源，失败：返回false
 */
LUIController.prototype.getDataById = function (nodeId, key, filterMode, callback) {

	var $getNode = this.getNodeById(nodeId);

	var getData = [];

	for (var i = 0; i < $getNode.length; i++) {
		getData.push($getNode.eq(i).data("data"));
	}

	if (key && ($.type(key) == "string" || $.type(key) == "array") && filterMode && $.type(filterMode) == "boolean") {
		getData = _cloneData(getData);
		getData = this.filterData(getData, key, true);
	} else if (key && ($.type(key) == "string" || $.type(key) == "array")) {
		getData = _cloneData(getData);
		getData = this.filterData(getData, key);
	}

	/*期望的数据格式
	getData = this.dataFormat(getData);
	*/

	if (getData.length == 1) {
		getData = getData[0];
	}

	if (key && $.type(key) == "function") {
		callback = key;
	}
	if (filterMode && $.type(filterMode) == "function") {
		callback = filterMode;
	}

	if (callback && $.type(callback) == "function") {
		callback(getData, $getNode, this);
	}
	return getData;
};



/**
 * 返回所有的JQ节点对象数据
 * 只有nodeId参数时，返回的是指向原数据源的引用，任何对返回数据源的修改，都会影响老数据源实时反应，如果想修改的数据不影响原数据，请先用cloneData克隆一份数据源
 * 存在key参数时，将返回被筛选后的原数据源的克隆数据，任何对返回数据源的修改，都不会影响老数据源
 * 操作的节点对象只有一个时，直接返回对该数据的引用
 * 操作的节点对象只有一个时，且键名只有一个时，将返回复制过数据源的字符串格式
 * 操作的节点对象多个时，但键名只有一个时，将返回复制过数据源的字符串数组格式
 * @param   {String|Array} key        指定要筛选的键名字符串，或键名数组
 * @param   {Boolean} filterMode 严格筛选模式（默认关闭）：被筛选的数据中，必须包括全部的键名才被筛选
 * @param   {Function} callback  回调函数
 * @returns {JQObject|Boolean}   成功：返回验证后的数据源，失败：返回false
 */

LUIController.prototype.getAllData = function (key, filterMode, callback) {

	var $allNode = this.getAllNode();

	var allData = [];

	for (var i = 0; i < $allNode.length; i++) {
		allData.push(this.getDataById($allNode.eq(i)));
	}

	if (key && ($.type(key) == "string" || $.type(key) == "array") && filterMode && $.type(filterMode) == "boolean") {
		allData = _cloneData(allData);
		allData = this.filterData(allData, key, true);
	} else if (key && ($.type(key) == "string" || $.type(key) == "array")) {
		allData = _cloneData(allData);
		allData = this.filterData(allData, key);
	}


	/* 期望的数据格式
				allData = this.dataFormat(allData);
	*/

	//如果第一或第二个参数是函数
	if ($.type(key) == "function") {
		callback = key;
	}
	if ($.type(filterMode) == "function") {
		callback = filterMode;
	}

	if (callback && $.type(callback) == "function") {
		callback(allData, this);
	}

	//返回所有数据
	return allData;

}

/**
 * 返回被选中的JQ节点对象数据
 * 只有nodeId参数时，返回的是指向原数据源的引用，任何对返回数据源的修改，都会影响老数据源实时反应，如果想修改的数据不影响原数据，请先用cloneData克隆一份数据源
 * 存在key参数时，将返回被筛选后的原数据源的克隆数据，任何对返回数据源的修改，都不会影响老数据源
 * 操作的节点对象只有一个时，直接返回对该数据的引用
 * 操作的节点对象只有一个时，且键名只有一个时，将返回复制过数据源的字符串格式
 * 操作的节点对象多个时，但键名只有一个时，将返回复制过数据源的字符串数组格式
 * @param   {String|Array} key        指定要筛选的键名字符串，或键名数组
 * @param   {Boolean} filterMode 严格筛选模式（默认关闭）：被筛选的数据中，必须包括全部的键名才被筛选
 * @param   {Function} callback  回调函数
 * @returns {JQObject|Boolean}   成功：返回验证后的数据源，失败：返回false
 */

LUIController.prototype.getSelectedData = function (key, filterMode, callback) {
	var $selectedNode = this.getSelectedNode();

	var selectedData = [];

	for (var i = 0; i < $selectedNode.length; i++) {
		selectedData.push(this.getDataById($selectedNode.eq(i)));
	}

	if (key && ($.type(key) == "string" || $.type(key) == "array") && filterMode && $.type(filterMode) == "boolean") {
		selectedData = _cloneData(selectedData);
		selectedData = this.filterData(selectedData, key, true);
	} else if (key && ($.type(key) == "string" || $.type(key) == "array")) {
		selectedData = _cloneData(selectedData);
		selectedData = this.filterData(selectedData, key);
	}


	/*期望的数据格式
		selectedData = this.dataFormat(selectedData);
	*/
	//如果第一或第二个参数是函数
	if (key && $.type(key) == "function") {
		callback = key;
	}
	if (filterMode && $.type(filterMode) == "function") {
		callback = filterMode;
	}

	if (callback && $.type(callback) == "function") {
		callback(selectedData, this);
	}

	//返回被选中数据
	return selectedData;
}


/**
 * 验证数据源
 * 1.验证后的数据源，返回的数据源永远是数组形式的
 * 2.会过淲掉空的数据
 * @param   {Object|ObjectArray} data     数据源可以是直接健/值对的形式或者多项健/值对的数组
 * @param   {Function} callback  回调函数
 * @returns {JQObject|Boolean}   成功：返回验证后的数据源，失败：返回false
 */
LUIController.prototype.validateData = function (data, callback) {

	//验证数据类型，返回的数据永远是数组形式，且每一项是名/值对的格式
	var validateData = [];
	if ($.type(data) == "object" && !$.isEmptyObject(data)) {
		validateData[0] = data;
	} else if ($.type(data) == "array") {
		//如果是数据数组，则过滤其中的各项，只保留是对象格式和非空对象
		for (var i = 0; i < data.length; i++) {
			if ($.type(data[i]) == "object" && !$.isEmptyObject(data[i])) {
				validateData.push(data[i]);
			}
		}
	}

	if (callback && $.type(callback) == "function") {
		callback(validateData, this);
	}
	//返回验证后符合要求的的数据源

	return validateData;
}

/**
 * 克隆数据源：如果对数据进行了克隆，那么这一份数据的拥有者就清空了，然后增加一个克隆至谁的数据字段和被克隆次数的字段
 * 克隆数据会增加一些额外数据字段
 * @param   {Object|ObjectArray} data     数据源可以是直接健/值对的形式或者多项健/值对的数组
 * @param   {Function} callback  回调函数
 * @returns {JQObject|Boolean}   成功：返回克隆后的数据源，失败：返回false
 */
LUIController.prototype.cloneData = function (data, callback) {

	var validateData = this.validateData(data);
	var cloneDataArray = [];

	for (var i = 0; i < validateData.length; i++) {
		var cloneData = {};
		//原数据克隆
		for (var keyName in validateData[i]) {
			cloneData[keyName] = validateData[i][keyName];
		}
		//对原数据增加克隆者属性和被克隆者属性

		if (!validateData[i]._cloneCount) {
			validateData[i]._cloneCount = 1;
		} else {
			validateData[i]._cloneCount++;
		}

		//复制者的角色名，自已复制自已则的也是自已
		if (!validateData[i]._cloner) validateData[i]._cloner = [];
		validateData[i]._cloner.push(this.config._roleName);

		//清空拥有者
		cloneData._owner = [];
		//添加数据原拥有者
		cloneData._holder = validateData[i]._owner;

		cloneDataArray.push(cloneData);
	}

	//只有一条数据时直接返回第一条数据
	if (cloneDataArray.length == 1) {
		cloneDataArray = cloneDataArray[0];
	}

	if (callback && $.type(callback) == "function") {
		callback(cloneDataArray, validateData, this);
	}

	//返回克隆的数据源
	return cloneDataArray;
}

/**
 * 筛选数据源：
 * 注意：筛选后的数据源是对原数据的直接筛选删除，因此要注意考虑原数据是否还有用，有用则先复制一份再筛选
 * 1.无参数情况下，返回所有数据
 * 2.可以传入键名，筛选指定的键值数据
 * @param   {Object|ObjectArray} data     数据源可以是直接健/值对的形式或者多项健/值对的数组
 * @param   {String|Array} key        指定要筛选的键名字符串，或键名数组
 * @param   {Boolean} filterMode 严格筛选模式（默认关闭）：被筛选的数据中，必须包括全部的键名才被筛选
 * @param   {Function} callback  回调函数
 * @returns {JQObject|Boolean}   成功：返回验证后的数据源，失败：返回false
 */
LUIController.prototype.filterData = function (data, key, filterMode, callback) {


	var validateData = this.validateData(data);
	var cloneData = _cloneData(validateData);

	var filterDataArray = [];

	var keyArray = [];
	if (key && $.type(key) == "string") {
		keyArray[0] = key;
	} else if (key && $.type(key) == "array") {
		keyArray = key;
	}
	if (!key) {
		//key如果不存在，直接返回筛选后的数据源
		filterDataArray = validateData;
	} else {
		for (var i = 0; i < validateData.length; i++) {
			for (var keyName in validateData[i]) {
				if ($.inArray(keyName, keyArray) < 0) {
					delete validateData[i][keyName]
				}
			}

			//validateData[i] 只保留了被筛选过后的值
			//验证他们的数量是否相等，相等则返回
			if (filterMode && $.type(filterMode) == "boolean") {
				//验证filterData中的值是否都存在
				var count = 0;
				for (var keyName in validateData[i]) {
					count++;
				}
				if (count == keyArray.length) {
					filterDataArray.push(validateData[i]);
				}
			} else {
				filterDataArray.push(validateData[i]);
			}

		}
	}

	//如果第三个参数是函数
	if (filterMode && $.type(filterMode) == "function") {
		callback = filterMode;
	}

	if (callback && $.type(callback) == "function") {
		callback(filterDataArray, cloneData, this);
	}
	//返回筛选后符合要求的的数据源
	return filterDataArray;
}




/**
 * 返回格式化数据源后的期望格式
 * 1.[{id:"19890129","name":"msl"},{id:"19890130","name":"llm"}] 不作更改
 * 2.[{name:"msl"},{name:"llm"},{name:"mcy"}] 返回数组格式:["msl","llm","mcy"]
 * 3.[{id:"19890129","name":"msl"}] 返回直接对象格式：{id:"19890129","name":"msl"}
 * 4.[{name:"msl"}] 返回字符串格式:msl
 * @param   {Object|ObjectArray} data     数据源可以是直接健/值对的形式或者多项健/值对的数组
 * @param   {Function} callback  回调函数
 * @returns {Array}   返回格式化数据源后的期望格式
 */
LUIController.prototype.dataFormatting = function (data, callback) {

	var validateData = this.validateData(data);
	var dataFormat;

	//数据源只有一个
	if (validateData.length == 1) {
		var count = 0;
		for (var key in validateData[0]) {
			count++
		}
		//数据项大于1个
		if (count > 1) {
			dataFormat = validateData[0]
		} else {
			//数据项只有1个时，直接返回字符串
			dataFormat = this.dataToString(validateData[0]);
			dataFormat = dataFormat.slice(dataFormat.indexOf(":") + 1);
		}
	} else {
		//数据源多个
		var count = 0;
		for (var key in validateData[0]) {
			count++
		}
		if (count > 1) {
			dataFormat = validateData
		} else {
			//每个数据源只有一个数据项时，返回数组
			dataFormat = this.dataToArray(validateData);
		}
	}

	if (callback && $.type(callback) == "function") {
		callback(dataFormat, this);
	}
	//返回格式化数据源后的期望格式
	return dataFormat;
}

/**
 * 数据格式转换为字符串，若数据源为数组数据，则返回的字符串数组
 * @param   {Object|ObjectArray} data     数据源可以是直接健/值对的形式或者多项健/值对的数组
 * @param   {Function} callback  回调函数
 * @returns {Array}   返回格式化后的数组字符串
 */
LUIController.prototype.dataToString = function (data, callback) {

	var validateData = this.validateData(data);

	var dataStringArray = [];

	for (var i = 0; i < validateData.length; i++) {
		var dataString = "";
		for (var key in validateData[i]) {
			dataString += key + ":" + validateData[i][key] + ",";
		}
		dataStringArray.push(dataString.slice(0, -1));
	}

	if (dataStringArray.length == 1) {
		dataStringArray = dataStringArray[0];
	}

	if (callback && $.type(callback) == "function") {
		callback(dataStringArray, validateData, this);
	}
	//返回格式化后的数组字符串
	return dataStringArray;
}

/**
 * 数据格式转换为JSON字符串
 * @param   {Object|ObjectArray} data     数据源可以是直接健/值对的形式或者多项健/值对的数组
 * @param   {String} namekey   保存JSON数据的键名
 * @param   {Function} callback  回调函数
 * @returns {String}   返回格式化后的JSON字符串
 */

LUIController.prototype.dataToJSON = function (data, namekey, callback) {


	if (namekey && $.type(namekey) == "string") {
		namekey = namekey;
	} else {
		namekey = "data";
	}

	var validateData = this.validateData(data);

	var dataStringArray = [];

	for (var i = 0; i < validateData.length; i++) {
		var dataToString = "{";
		for (var key in validateData[i]) {
			dataToString += '"' + key + '":"' + validateData[i][key] + '",';
		}
		dataToString = dataToString.slice(0, -1);
		dataToString += "}";
		dataStringArray.push(dataToString)
	}
	var dataToJSON = "";
	if (dataStringArray.length == 1) {
		dataToJSON = '{"' + namekey + '":' + dataStringArray + '}';
	} else {
		dataToJSON = '{"' + namekey + '":[' + dataStringArray.join(",") + ']}';
	}

	//如果第二个参数是函数
	if ($.type(namekey) == "function") {
		callback = namekey;
	}

	if (callback && $.type(callback) == "function") {
		callback(dataToJSON, validateData, this);
	}
	//返回格式化后的JSON字符串
	return dataToJSON;
}

/**
 * 数据格式转换为数组格式
 * @param   {Object|ObjectArray} data     数据源可以是直接健/值对的形式或者多项健/值对的数组
 * @param   {Function} callback  回调函数
 * @returns {Array}   返回格式化后的数组
 */
LUIController.prototype.dataToArray = function (data, callback) {

	var validateData = this.validateData(data);

	var dataToArray = [];

	for (var i = 0; i < validateData.length; i++) {
		var dataArray = [];
		for (var key in validateData[i]) {
			dataArray.push(validateData[i][key]);
		}
		if (dataArray.length == 1) {
			dataArray = dataArray[0];
		}
		dataToArray.push(dataArray);
	}

	if (callback && $.type(callback) == "function") {
		callback(dataToArray, validateData, this);
	}
	//返回克隆的数据源
	return dataToArray;
}

//通用函数集
//合并两个回调函数的内容，返回一个新函数内容
function merge(obj1, obj2, funName) {
	var fun1, fun2;
	//原节点点击函数
	if (obj2 && obj1.callback && obj1.callback[funName]) {
		fun1 = obj1.callback[funName];
	} else {
		fun1 = function () {}
	}

	//自定义节点点击函数
	if (obj2 && obj2.callback && obj2.callback[funName]) {
		fun2 = obj2.callback[funName];
	} else {
		fun2 = function () {}
	}
	//合并节点点击回调事件

	return function ($addNode, obj) {
		fun1($addNode, obj)
		fun2($addNode, obj);
	}
}

//克隆数据
function _cloneData(data) {

	var cloneDataArray = [];

	for (var i = 0; i < data.length; i++) {
		var cloneData = {};
		//原数据克隆
		for (var keyName in data[i]) {
			cloneData[keyName] = data[i][keyName];
		}
		cloneDataArray.push(cloneData);
	}

	//只有一条数据时直接返回第一条数据
	if (cloneDataArray.length == 1) {
		cloneDataArray = cloneDataArray[0];
	}

	//返回克隆的数据源
	return cloneDataArray;
}