/**
 * @class LUIController
 * @version 0.2.2
 * @author lisfan QQ@448182355 GIT@lisfan 
 * @createDate 04/12/2015
 * @requires jquery-1.11.3
 * @name 扩展插件基类-简易版(多级联菜单使用高级版)
 * @markdown
 * 
 * ## todo清单 
 * - 编写测试用例方档和API文档
 * - 增加view.loadType 加载方式：批量加载还是全部加载
 * - 增加view.loadCount 逐一加载的数量
 * - 独立出代码中的样式
 * ## 心得
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
 * ## 更新日记
 * - 2016.1.16
 * 		- 重构大部分方法参数，配置，扩展部分配置
 * 		- 增加AJAX支持
 * 		- 增加一些工具函数
 * 		- 增加一些调试信息
 * - 2016.01.24
 * 		- 大重构load()方法，增加loadMode参数，为true时，仅增加数据，不刷新
 * 		- 大重构sortNode()方法，对于sortType，做了容错处理
 * 		- 方法调用时发生参数错误时定位
 * 		- 修正filterNode()方法BUG
 * 		- 增加选中状态节点数据暂存记忆功能
 * - 2016.02.13
 * 		- 修改addNode，addNodeData，replaceNodeData,removeNodeData
 * 		- 修改refreshNode，增加部分节点刷新功能
 * 		- 增加全局属性isFirstLoadComplete属性
 * 		- 增加属性loadMode载入模式
 * - 2016.02.16
 * 		- 修改sortNode，支持不排序

 */

/**
 * LUIController类，任何扩展插件均基于此，继承其方法和属性
 * @param {Object} setting 配置参数
 * @param {Function} callback 回调函数
//实例化插件方法
//$(selector).()
//$(selector).(url)
//$(selector).(data)
//$(selector).(setting)
//new Selectbox(selector)
//new Selectbox(setting),setting里设置了选择符
//new Selectbox(selector,url)
//new Selectbox(selector,data)
//new Selectbox(selector,setting)
//window.selectbox(selector)
//window.selectbox(setting),setting里设置了选择符
//window.selectbox(selector,url)
//window.selectbox(selector,data)
//window.selectbox(selector,setting)                       
 */
var LUIController = function (setting, callback) {
	var me = this;
	//私有属性：类型，用于参数判断时得知实例的具体类型名称
	me._type = me._type || "luicontroller";
	me._version = me._version || "0.2.2";
	me._isStaticHtml = false; //是否为静态页面加载数据节点方式
	me._isAsyncComplete = false; //异步请求是否已完成，每当有异步请求时设置为false
	me._isLoadComplete = false; //静态数据加载是否已完成，每当静态加载数据时设置为false
	me._isInitLoadComplete = false; //是否为初始化加载数据，如果是则加载节点后不刷新节点，因为初始化没必要再刷新。
	me._orderCounter = 0; //内置排序序号计数器，该项会强制按照数据的加载顺序设置，实例方法不支持修改orderid，同时用户也不要去改orderid的值，要增加自定义排序时请重新命名一个排序字段排序分类
	me._selectedNode = me._selectedNode || []; //开启选中节点记忆池时，这里暂存选中节点
	//config里的配置是可以自定义覆盖，不是私有的
	me.config = {
		//角色ID属性：，默认生成一个随机数值
		_roleId: Math.round(new Date().getMilliseconds() * Math.random() * 1000),
		//节点唯一ID计数器：唯一ID，我的农历生日~。~
		_uniqueId: 19890129,
		//是否为自定义配置：判断用户是否自定义了配置，用于判断各插件扩展配置时为开发者初始定义，还是使用者定义，如果为开发者自定义，则需要手动的设置为false值，使用者自定义时会自动设置为true
		_isUserDefined: false,
		//选择器配置：一个选择器格式字符串
		selector: null,
		//异步配置：常用配置项，使用者需要自定义配置更多ajax参数时，请使用ajaxSetup属性，注意：这会覆盖该对象下的其他已配置参数
		async: {
			enabled: false,
			url: "",
			type: "GET",
			data: "",
			dataType: "json",
			cache: false,
			ajaxSetup: null
		},
		//关键字键配置
		key: {
			dataKey: "data"
		},
		//数据源配置
		store: {
			data: [],
			d: [],
			/*data: [
				//{"id":"01","name":"msl"}
				//数据源中必须设置id和name
				//若未设置ID，ID取值为_roleId+_uniqueId的值
				//若未设置NAME，NAME取值为ID
			],*/
		},
		//视图显示配置
		view: {
			//节点样式
			nodeClass: "node ext-node",
			//全局加载模式，如果未指定载入模式，则使用全局载入模式参数，为true表示持续加载，false表示覆盖加载
			loadMode: false,
			//异步选择模式，开启后，会将选中的节点“数据”放入config._selectedCache变量里，即使更新内容load()也不会将已选中的数据丢失
			//当重新加前页一次的内容时，还会判断数据的ID是否已存在于config._selectedCache变量里，若已存在，则将节点选中，同时使用现在的新数据替换原来老数据（考虑到数据会有更新）
			//默认非开启状态下，且#非load(setting,true)#持续加载模式下，都会重置config._selectedCache为空数组，一般异步请求数据时需要开启
			selectedMemory: false,
			//启用多选
			enabledMultiple: false,
			//启用控制栏
			enabledControl: false,
			//AJAX状态提示类型：0无提示，1图片形式，其他值为文字形式(默认行式),支持回调函数(return返回html格式)
			asyncStatusTipsType: 2
				/*
				//自定义内容区html格式：返回的html格式均需要有一个html元素包裹
				//nodeData,当前节点数据，nodeIndex，当前节点索引位置
				nodeFormater: function (nodeData,nodeIndex) {
					return 每一项节点的HTML格式
				},

				//自定义控制区html格式
				controlFormater: function () {
					return 控制区格式
				}*/
		},
		//回调事件
		callback: {

			/*//异步请求之前回调事件:权限级别最高，会覆盖ajaxSetup里的回调
			asyncBeforeSendCallback: function (jqXHR, ajaxSetup) {

			},
			//异步请求失败回调事件
			asyncErrorCallback: function (jqXHR, textStatus, errorMsg) {

			},
			//异步请求数据过滤回调事件
			asyncDataFilterCallback: function (data, dataType) {

			},
			//异步请求成功回调事件
			asyncSuccessCallback: function (data, textStatus, jqXHR) {

			},
			//异步请求完成后（无论加载成功还是失败）回调事件
			asyncCompleteCallback: function (jqXHR, textStatus) {

			},

			//配置参数回调事件，与loadCallback回调的区别在于：configCallback是在数据初始化之前的最后一次参数变更，这里进行的应该只是对配置参数的变化，而loadCallback是数据初始化完成之后的最后一步回调执行
			configCallback: function (config, obj) {

			},

			//页面载入成功回调事件，在load()方法加载成功后执行
			loadCallback: function ($addNode, obj) {

			},
			
			//每个节点生成后的回调事件
			//区别与节点格式化回调事件nodeFormater,nodeFormater必须返回的是一个html格式的字符串
			nodeCallback: function ($currentNode, currentData, obj) {
				
			},

			//控制区回调
			controlCallback: function (obj) {
				
			},

			//节点点击事件
			nodeClick: function ($currentNode, currentData, obj) {

			}*/

		},
		//默认事件动作
		action: {
			initSelectedNode: function (obj) {
				//初始化选中状态，如果单选模式，又配置了多个选中状态，则只选中第一个设置为选中的
				if (obj.config.view.enabledMultiple) {
					//多选
					var $getNode = obj.getSelectedNode();

					var multiplesize = null;
					if (obj.config.view.multipleSize > 1) {
						multiplesize = obj.config.view.multipleSize;
					};

					if (multiplesize) {
						obj.cleanSelectedNode();
						while (multiplesize > 0) {
							obj.selectNode($getNode.eq(multiplesize - 1));
							multiplesize--
						}
					}
				} else if (!obj.config.view.enabledMultiple) {
					//单选
					var $getNode = obj.getSelectedNode();
					obj.cleanSelectedNode();
					obj.selectNode($getNode.eq(0));
				}
			},
			selectNode: function ($currentNode, currentData, obj) {
				if (!obj.config.view.enabledMultiple) {
					//单选模式
					if (currentData.state == "selected") {
						obj.cancelSelectedNode($currentNode);
					} else {
						obj.cleanSelectedNode();
						obj.selectNode($currentNode, "selected");
					}
				} else {
					//多选
					if (currentData.state == "selected") {
						obj.cancelSelectedNode($currentNode);
					} else {
						var multiplesize = null;
						if (obj.config.view.multipleSize > 1) {
							multiplesize = obj.config.view.multipleSize;
						}
						if (!multiplesize || multiplesize > obj.getSelectedNode().length) {
							//弹框选中
							obj.selectNode($currentNode, "selected");
						}
					}
				}
			}
		}
	};

	if (setting) {
		//非继承
		me.load(setting, callback)
	}
};

/**
 * 通过setting初始化配置，载入数据
 * @param   {PlainObject||String||Array} setting  ***是可选的，为空时仅实例化对象，生成基本的HTML结构，之后可调用实例方法***，当有传入配置参数时会根据自定义项初始化（自定义性强），也可以直接传入异步请求地址（会按照默认异步方式处理）,还可以直接传入数据数组对象
 * @param   {Boolean} loadMode 加载模式，false（默认）时为替换式加载模式，会清除内容区的节点数据（不删除其他内容），true时为持续式加载模式，新加载的内容会附加到内容区末尾
 * @param   {Function}   callback 回调函数
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIController.prototype.load = function (setting, loadMode, callback) {
	var filterArgs = _filterArguments(arguments, [["plainobject", "string", "array"], "boolean", "function"], 1);
	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.load(setting, loadMode, callback)";
		log(errorText, "color:#f00");
		return false;
	}

	setting = filterArgs[0];
	loadMode = filterArgs[1] !== undefined ? filterArgs[1] : this.config.view.loadMode;
	callback = filterArgs[2];

	var me = this;

	if ($.type(setting) == "string") {
		//异步请求链接地址
		me.config.async.enabled = true;
		me.config.async.url = setting;
	} else if ($.type(setting) == "array") {
		//直接数据源
		me.config.async.enabled = false;
		me.config.async.url = '';
		me.config.store[me.config.key.dataKey] = setting;
	} else if ($.type(setting) == "object") {
		//自定义配置参数
		//假如传入的数据源存在，则使用传入的数据源，而非复制覆盖的数据源
		if (setting && setting.store && setting.store[me.config.key.dataKey]) {
			me.config.store[me.config.key.dataKey] = setting.store[me.config.key.dataKey];
		}
		//扩展插件覆盖LUIController的默认配置
		me.config = $.extend(true, me.config, setting);
	}

	//初始化出插件结构$me,$content,$control
	me.$me = $(me.config.selector);
	me._selector = me.config.selector;

	//判断选择器是否正确且存在
	if (!me._selector) {
		var errorText = "%c" + me._type + me.config._roleId + " 初始化未指定选择器，请检查";
		log(errorText, "color:#f00");
		return false;
	} else if (me.$me.length === 0) {
		var errorText = "%c" + me._type + me.config._roleId + " 初始化所需的选择器 " + me._selector + " 元素不存在，请检查";
		log(errorText, "color:#f00");
		return false;
	}

	//内容区和控制区DOM不管如何，都必须在初始化时生成
	//内容区Dom
	//假如已存在内容区DOM(格式要求需要符合格式)，则不再生成
	//弊端：无法初始化默认绑定的数据，适用于不进行复杂数据操作的情况下使用
	if (me.$me.find('[data-role="content"]').length > 0) {
		//静态结构
		me.$content = me.$me.find('[data-role="content"]');
		me._isStaticHtml = false;
	} else {
		//不存在，生成附加至$me
		me.$content = $('<div class="ext-content content clearfix" data-role="content"></div>');
		me.$me.append(me.$content);
	}

	//控制器Dom
	//默认关闭，若开启，需要设置enabledControl=true
	//假如已存在控制区DOM(格式要求需要符合格式)，则不再生成
	//del 假如未使用自定义setting配置，且已存在html元素（格式需要符合要求），并且自定义格式化里没有自定义配置项
	if (me.$me.find('[data-role="control"]').length > 0) {
		//若控制器已存在，且控制器可见，则不生成，直接使用现成的
		me.$control = me.$me.find('[data-role="control"]');
	} else if (me.$me.find('[data-role="control"]').length <= 0) {
		//若控制器不存在，且控制器可见，则生成
		me.$control = $('<div class="ext-control control clearfix" data-role="control"></div>');
		me.$me.prepend(me.$control);
	}

	//请求数据
	//异步请求
	//先看配置里的async是否开启了，同时url是否配置正确
	if (me.config.async.enabled === true && me.config.async.url) {
		//AJAX配置
		var ajaxSetup = {
			type: me.config.async.type,
			data: me.config.async.data,
			dataType: me.config.async.dataType,
			cache: me.config.async.cache,
		}

		//覆盖用户自定义的ajaxSetup配置
		if (me.config.async.ajaxSetup) {
			ajaxSetup = ajaxSetup.extentd(true, ajaxSetup, me.config.async.ajaxSetup);
		}

		//异步请求提示信息区DOM
		//如果指定了targetNodeId，则以目标节点位置设置为异步请求信息
		var $asyncLoader = me.$content;

		//异步请求发送请求之前
		ajaxSetup.beforeSend = function (jqXHR, ajaxSetup) {
			//每次异步请求时均将异步完成标记设置为false，表示初始化正在进行中
			me._isAsyncComplete = false;
			//创建异步请求DOM
			if ($asyncLoader.find(".ext-async-loader").length <= 0) {
				$asyncLoader.append("<div class='ext-async-loader' style='color: #999;'></div>");
			}
			//500毫秒内如果未加载成功(判断me._isAsyncComplete)，则弹出提示，增进体验
			setTimeout(function () {
				if (!me._isAsyncComplete) {
					if (me.config.view.asyncStatusTipsType === 0) {
						//无提示
					} else if (me.config.view.asyncStatusTipsType === 1) {
						$asyncLoader.find(".ext-async-loader").html("<span class='ani-before'></span>");
					} else if ($.type(me.config.view.asyncStatusTipsType) === "function") {
						var beforeSendHtml = me.config.view.asyncStatusTipsType();
						$asyncLoader.find(".ext-async-loader").html(beforeSendHtml);
					} else {
						$asyncLoader.find(".ext-async-loader").html("<span class='before'>数据加载中，请稍候...</span>");
					}
				}
			}, 500);
			//自定义异步请求前回调函数
			if (me.config.callback.asyncBeforeSendCallback && $.type(me.config.callback.asyncBeforeSendCallback) == "function") {
				me.config.callback.asyncBeforeSendCallback(jqXHR, ajaxSetup);
			}
		}

		//异步请求失败
		ajaxSetup.error = function (jqXHR, textStatus, errorMsg) {
			//异步失败错误提示
			if (textStatus == "timeout") {
				if (me.config.asyncStatusTipsType === 0) {
					//无提示
				} else {
					$asyncLoader.find(".ext-async-loader").html("<span class='error'>数据加载超时，请重新刷新页面。</span>");
				}
			} else {
				if (me.config.asyncStatusTipsType === 0) {
					//无提示
				} else {
					$asyncLoader.find(".ext-async-loader").html("<span class='error'>数据加载失败，请联系管理员。</span>");
				}
			}
			//打印日志
			log("%c错误状态：" + textStatus + "，错误文本：" + errorMsg, "color:#f00");

			//自定义异步请求失败回调函数
			if (me.config.callback.asyncErrorCallback && $.type(me.config.callback.asyncErrorCallback) == "function") {
				me.config.callback.asyncErrorCallback(jqXHR, textStatus, errorMsg);
			}
		}

		//异步请求成功后的数据处理
		ajaxSetup.dataFilter = function (data, dataType) {
			if (me.config.callback.asyncDataFilterCallback && $.type(me.config.callback.asyncDataFilterCallback) == "function") {
				me.config.callback.asyncDataFilterCallback(data, dataType);
			}
			return data;
		}

		//异步请求成功
		ajaxSetup.success = function (data, textStatus, jqXHR) {
			//自定义异步请求成功回调函数
			if (me.config.callback.asyncSuccessCallback && $.type(me.config.callback.asyncSuccessCallback) == "function") {
				me.config.callback.asyncSuccessCallback(data, textStatus, jqXHR);
			}
			//请求数据
			//接收到的data是setting参数，还是纯store数据源配置
			if (data.store) {
				//覆盖config配置
				//假如传入的数据源存在，则使用传入的数据源，而非复制覆盖的数据源
				if (data && data.store && data.store[me.config.key.dataKey]) {
					me.config.store[me.config.key.dataKey] = data.store[me.config.key.dataKey];
				}
				me.config = $.extend(true, me.config, data);
			} else {
				//覆盖store配置
				//假如传入的数据源存在，则使用传入的数据源，而非复制覆盖的数据源
				if (data[me.config.key.dataKey]) {
					me.config.store[me.config.key.dataKey] = data[me.config.key.dataKey];
				}
				//仅覆盖数据源配置
				me.config.store = $.extend(true, me.config.store, data);
			}
			//自定义配置参数的最后一次更改回调函数
			//主要对data做最后一次的处理，以便传入_init初始化），data无法覆盖，需判断原参数setting没有传入data数据
			if (me.config.callback.configCallback && $.type(me.config.callback.configCallback) == "function") {
				me.config.callback.configCallback(me.config)
			}

			if (me.config.store[me.config.key.dataKey].length == 0) {
				//请求无数据
				//非持续加载方式时，还需清空数据
				if (!loadMode) {
					me.cleanNode();
					me.$content.empty();
				}
				if (me.config.asyncStatusTipsType === 0) {} else {
					$asyncLoader.find(".ext-async-loader").html("<span class='nodata'>暂无数据</span>");
				}
			} else {
				$asyncLoader.find(".ext-async-loader").remove();
				me._init(me.config.store[me.config.key.dataKey], loadMode, targetNodeId, callback);
			}
		}

		//异步请求完成后（无论成功还是失败）
		ajaxSetup.complete = function (jqXHR, textStatus) {
			if (me.config.callback.asyncCompleteCallback && $.type(me.config.callback.asyncCompleteCallback) == "function") {
				me.config.callback.asyncCompleteCallback(jqXHR, textStatus);
			}
			//异步请求完成
			me._isAsyncComplete = true;
		}

		//发起异步请求
		$.ajax(me.config.async.url, ajaxSetup);
	} else {
		//自定义配置参数的最后一次更改回调函数
		//主要对data做最后一次的处理，以便传入_init初始化），data无法覆盖，需判断原参数setting没有传入data数据
		if (me.config.callback.configCallback && $.type(me.config.callback.configCallback) == "function") {
			me.config.callback.configCallback(me.config)
		}
		//数据源可能为空
		me._init(me.config.store[me.config.key.dataKey], loadMode, callback);
	}

	//返回当前对象
	return me;
}

/**
 * 初始化节点
 * 1.若在HTML页面中已存在即有的元素（格式上需要符合要求，数据通过data-*绑定上去），且参数中也没有传入data，就会以此html作为原数据(仅适合简单结构)
 * 4.对于data数据中一般要求存在id和name两个字段，若不存在id字段则按序号生成id（因此要注意ID不要与存在id的数据冲突），若不存在name字段，则使用id的内容，selected可以使节点初始化为选中状态
 * 5.可以自定义节点格式和控制器格式
 * @param   {Array} data  以此为基础继承的插件均会传入setting配置。也可以直接传入数组对象格式数据源，也可以传入url，默认get方法
 * @param   {Boolean} loadMode 加载模式，false（默认）时为替换式加载模式，会清除内容区的节点数据（不删除其他内容），true时为持续式加载模式，新加载的内容会附加到内容区末尾
 * @param   {Function}              callback 载入成功后的回调
 * @returns {JQObject}   若有传入数据源，则返回生成的jQ节点对象，若直接是html形式的数据源，则返回页面中已存在的jq节点对象
 */
LUIController.prototype._init = function (data, loadMode, callback) {
	var filterArgs = _filterArguments(arguments, ["array", "boolean", "function"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype._init(data, loadMode, callback)";
		log(errorText, "color:#f00");
		return false;
	}

	data = filterArgs[0] !== undefined ? filterArgs[0] : [];
	loadMode = filterArgs[1] !== undefined ? filterArgs[1] : this.config.view.loadMode;
	callback = filterArgs[2];

	var me = this;
	var validateData = _validateData(data);
	//复制一份，保留原数据不做变更
	//var validateData = _validateData(_cloneData(data));

	var $addNode = [];
	if (validateData.length > 0) {
		//有新数据时，按照validateData数据生成
		if (!loadMode) {
			//非持续加载数据模式
			//清空所有原数据
			me.cleanNode();
			me.$content.empty();
		}

		//若开启了选中节点记忆池功能，则不清空全局已选中数据源
		//加载了新的数据后，要判断新加载的数据源是否已存在于节点记忆池中
		if (me.config.view.selectedMemory) {
			$addNode = me.addNode(validateData);

			//若已存在则当前项需要高亮选中
			//删选出选中的ID
			var selectedId = _dataToArray(me.getSelectedData("id"));
			var addId = _dataToArray(me.getDataById($addNode, "id"));
			for (var i = 0; i < addId.length; i++) {
				var index = $.inArray(addId[i], selectedId);
				//若存在
				if (index >= 0) {
					me.selectNode(addId[i]);
				}
			}
		} else {
			//未开启节点记忆池功能，清空全局已选中数据源
			me._selectedNode = [];
			$addNode = me.addNode(validateData);
		}

	} else if (validateData.length == 0 && me._isStaticHtml === true) {
		//数据项为0且是已经进行了静态页面数据初始化，说明第二次以上传入的数据项为0
		if (!loadMode) {
			me.cleanNode();
			me.$content.empty();
		}
		if (!me.config.view.selectedMemory) {
			me._selectedNode = [];
		}
		//清空所有数据
	} else if (validateData.length == 0 && me._isStaticHtml === false) {
		//数据项为0且是静态页面数据初始化
		//+1，表明不再是初始化
		me._isStaticHtml = true;

		$addNode = me.getAllNode();

		//将HTML上的属性数据进行存储，以便调用
		//首先缓存data-*，id，name和image
		for (var i = 0; i < $addNode.length; i++) {
			//对每一个对象缓存数据
			//置空
			$addNode.eq(i).data("data", {});
			var $currentNode = $addNode.eq(i);
			var currentData = $currentNode.data("data");

			//缓存节点的data-*数据
			for (var key in $currentNode.data()) {
				if (key != "data" && key != "orderid" && key != "index") {
					currentData[key] = $currentNode.data()[key];
				}
			}

			//手动更新index和orderid

			//如果节点存在图片，缓存图片地址
			if ($currentNode.find("img").attr("src")) {
				currentData.image = $currentNode.find("img").attr("src");
			}

			//如果节点存在文本
			if ($currentNode.text()) {
				currentData.name = $currentNode.text()
			}

			//如果节点存在id且data-id不存在时，使用id属性，否则随机生成
			if ($currentNode.attr("id") && !$currentNode.attr("data-id")) {
				currentData.id = $currentNode.attr("id");
			} else if (!$currentNode.attr("data-id")) {
				currentData.id = me.config._roleId + "" + me.config._uniqueId++;
			}
			$currentNode.attr("data-id", currentData.id);

			//使用全局排序计算器，标记节点序号
			currentData._orderId = me._orderCounter++;
			$currentNode.attr("data-orderid", currentData._orderId);

			//设置索引序号
			currentData.index = i;
			$currentNode.attr("data-index", i);
		}
	}

	//设置默认侦听事件
	//解除所有的事件委派
	me.$content.undelegate("[data-role='node']", "click._default");

	//默认选项点击事件(无)
	me.$content.delegate("[data-role='node']", "click._default", function (event) {
		//自定义点击事件
		//stopPropagation(event);
		if (me.config.callback.nodeClick && $.type(me.config.callback.nodeClick) == "function") {
			me.config.callback.nodeClick($(this), me.getDataById($(this)), me);
		}
	});

	//控制区格式化
	if (me.config.view.enabledControl) {
		me.$control.empty();
		if (me.config.callback.controlFormater && $.type(me.config.callback.controlFormater) == "function") {
			//先清空
			var controlHtml = me.config.view.controlFormater();
			me.$control.append(controlHtml);
		}
		if (me.config.callback.controlCallback && $.type(me.config.callback.controlCallback) == "function") {
			//存在控制器回调时执行
			me.config.callback.controlCallback(me);
		}
	}

	//全局性载入成功回调
	if (me.config.callback.loadCallback && $.type(me.config.callback.loadCallback) == "function") {
		me.config.callback.loadCallback($addNode, me);
	}

	if (callback) {
		callback($addNode, this);
	}

	//返回增加的对象
	return $addNode;
}

/**
 * 移除整个对象，返回移除对象
 * @param   {Function} callback 回调函数
 * @returns {JQObject}  返回调用该对象节点
 */
LUIController.prototype.destory = function (callback) {
	var filterArgs = _filterArguments(arguments, ["function"]);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.destory(callback)";
		log(errorText, "color:#f00");
		return false;
	}

	callback = filterArgs[0];

	var $desotry = this.$me.detach();

	if (callback) {
		callback(this);
	}

	return $desotry;
}

/**
 * 返回指定的JQ节点对象
 * @param   {Number||String||Array||JQObject} nodeId ID字符串 | 数组ID字符串 | JQ节点对象 
 * @param   {Function} callback 回调函数
 * @returns {JQObject} 返回指定的JQ节点对象
 */
LUIController.prototype.getNodeById = function (nodeId, callback) {
	var filterArgs = _filterArguments(arguments, [["number", "string", "array", "jqobject"], "function"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.getNodeById(nodeId, callback)";
		log(errorText, "color:#f00");
		return false;
	}

	nodeId = filterArgs[0];
	callback = filterArgs[1];

	var nodeIdArray = [];

	if ($.type(nodeId) == "array") {
		nodeIdArray = nodeId;
	} else {
		nodeIdArray[0] = nodeId;
	}

	//创建空的jq对象
	var $getNode = $();
	for (var i = 0; i < nodeIdArray.length; i++) {
		if ($.type(nodeIdArray[i]) == "number" || $.type(nodeIdArray[i]) == "string") {
			$getNode = $getNode.add('[data-id="' + nodeIdArray[i] + '"]', this.$me);
		}
		if ($.type(nodeIdArray[i]) == "object" && !$.isPlainObject(nodeIdArray[i])) {
			$getNode = $getNode.add(nodeIdArray[i], this.$me);
		}
	}

	if (callback) {
		callback($getNode, this);
	}
	//返回被查找到的对象
	return $getNode;
}

/**
 * 获取所有JQ节点对象
 * @param   {Function} callback 回调函数
 * @returns {JQObject} 返回所有的JQ节点对象
 */
LUIController.prototype.getAllNode = function (callback) {
	//过滤参数且重排理想结构
	var filterArgs = _filterArguments(arguments, ["function"]);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.getAllNode(callback)";
		log(errorText, "color:#f00");
		return false;
	}

	callback = filterArgs[0];

	var $allNode = this.$content.find('[data-role="node"]');

	if (callback) {
		callback($allNode, this);
	}
	return $allNode;
}

/**
 * 获取选中的JQ节点对象
 * @param   {Function} callback 回调函数
 * @returns {JQObject} 返回被选中的JQ节点对象
 */
LUIController.prototype.getSelectedNode = function (callback) {
	var filterArgs = _filterArguments(arguments, ["function"]);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.getSelectedNode(callback)";
		log(errorText, "color:#f00");
		return false;
	}

	callback = filterArgs[0];

	var $selectedNode;

	if (this.config.view.selectedMemory) {
		//启用节点记忆池
		//从暂存区获取选中状态节点
		$selectedNode = this.getNodeById(this._selectedNode);
	} else {
		//未启用节点记忆池
		//从节点数据层获取选中状态节点
		var $allNode = this.getAllNode();
		var selectedId = [];
		for (var i = 0; i < $allNode.length; i++) {
			var $curNode = $allNode.eq(i);
			var curData = this.getDataById($curNode);
			if (curData.state == "selected") {
				selectedId.push(curData.id);
			}
		}
		$selectedNode = this.getNodeById(selectedId);
	}


	if (callback) {
		callback($selectedNode, this);
	}

	return $selectedNode;
}

/**
 * 获取指定索引序号(html页面上*实际看见*的节点的序位)的JQ节点对象，索引位置从0开始
 * @param   {Number||Array} 索引序位 接受数字和纯数字形式字符串
 * @param   {Function} callback 回调函数
 * @returns {JQObject} 返回指定序位的JQ节点对象
 */
LUIController.prototype.getNodeByIndex = function (index, callback) {
	var filterArgs = _filterArguments(arguments, [["number", "array"], "function"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.getNodeByIndex(index, callback)";
		log(errorText, "color:#f00");
		return false;
	}

	index = filterArgs[0];
	callback = filterArgs[1];

	var $allNode = this.getAllNode();

	//过滤出可见的节点
	var $visibleNode = $allNode.filter(":visible");

	var indexArray = [];
	var filterArray = [];
	if ($.type(index) == "number") {
		indexArray[0] = index;
	} else if ($.type(index) == "array") {
		indexArray = index;
	}

	for (var i = 0; i < indexArray.length; i++) {
		filterArray.push($visibleNode.eq(indexArray[i]))
	}

	if (callback) {
		callback(this.getNodeById(filterArray), this);
	}

	return this.getNodeById(filterArray);
}

/**
 * 刷新JQ节点对象，使用现在的节点数据，刷新HTML页面上的内容（适用于绑定的数据有了更新，但页面上没有实时显示变化时，重新格式化目标节点）
 * 节点刷新是全局的，无法指定某些节点刷新
 * 不删除原节点对象，以免引起其他已指向该节点的变量出问题，仅更新他的HTML内容
 * 新增、删除、替换、过滤、排序都需要更新节点
 * @param {JQObject} nodeId    JQ节点对象
 * @param   {Boolean} refreshMode   刷新模式，为true时刷新index，为false(默认)时不刷新index
 * @param   {Function} callback   回调函数
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIController.prototype.refreshNode = function (nodeId, refreshMode, callback) {
	var filterArgs = _filterArguments(arguments, ["jqobject", "boolean", "function"]);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.refreshNode(nodeId, refreshMode, callback)";
		log(errorText, "color:#f00");
		return false;
	}

	nodeId = filterArgs[0] !== undefined ? filterArgs[0] : this.getAllNode();
	refreshMode = filterArgs[1] !== undefined ? filterArgs[1] : false;
	callback = filterArgs[2];
	var $allNode = this.getNodeById(nodeId);

	for (var i = 0; i < $allNode.length; i++) {
		var $currentNode = $allNode.eq(i);
		var currentData = this.getDataById($currentNode);

		//按照nodeFormater格式化HTML内容
		var $addNode;
		if (this.config.view.nodeFormater && $.type(this.config.view.nodeFormater) == "function") {
			$addNode = $(this.config.view.nodeFormater(currentData, this._orderCounter));
		} else {
			//默认格式:输出name值
			$addNode = $('<div>' + currentData.name + '</div>');
		}

		//清空原节点里的HTML内容
		$currentNode.empty();
		$currentNode.html($addNode.html());

		//更新数据源索引序号

		currentData.index = refreshMode ? i : currentData.index;
		//设置识别节点需要的信息（更新的信息），但是对用户附加的其他属性不作改变及删除
		//如index，orderid,data-id
		$currentNode.attr("data-id", currentData.id);
		$currentNode.attr("data-orderid", currentData._orderId);
		$currentNode.attr("data-index", currentData.index);

		//节点更新完毕后，执行一次nodeCallback回调
		if (this.config.callback.nodeCallback && $.type(this.config.callback.nodeCallback) == "function") {
			this.config.callback.nodeCallback($currentNode, currentData, this);
		}

		//节点状态不存在时：不更新节点状态信息
		if (currentData.state) {
			this.setNodeState(currentData.id, currentData.state);
		}
	}

	if (callback) {
		callback(this);
	}
	//返回被刷新成功的JQ节点对象
	return this;
}


/**
 * 增加JQ节点对象
 * 1.根据数据源增加节点，不支持直接附加JQ节点对象
 * 2.当添加的数据源具有相同ID时，添加不成功
 * 2.通过nodeFormater格式化节点的格式，节点数据生成之后，都会执行一次nodeCallback回调
 * @param   {PlainObject||Array} data     数据源可以是直接健/值对的原生对象格式，也可以是多项健/值对的数组对象
 * @param   {Number} index  附加位置，正整数
 * @param   {Function} callback 回调函数
 * @returns {JQObject} 返回增加的的JQ节点对象
 */
LUIController.prototype.addNode = function (data, index, callback) {
	var filterArgs = _filterArguments(arguments, [["plainobject", "array"], "number", "function"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.addNode(data, index, callback)";
		log(errorText, "color:#f00");
		return false;
	}

	data = filterArgs[0];
	index = filterArgs[1];
	callback = filterArgs[2];

	var validateData = _validateData(data);

	//加载数据标记重置
	//数据加载是否已完成，每当加载数据时设置为false
	this._isLoadComplete = false;

	//增加的数据ID 是否已存在于当前节点中 
	var allId = _dataToArray(this.getAllData("id"));

	//增加项临时缓存区
	var $addNodeCache = $("<div/>");

	for (var i = 0; i < validateData.length; i++) {
		var currentData = validateData[i];
		//如果当前数据源ID已存在于节点中，则不增加（也不作更新数据操作，因此使用者要清楚的知道自已是在addNode操作还是replaceNode操作
		if ($.inArray(currentData.id, allId) > -1) continue;
		//必须有的属性值：检查ID，若不存在则生成唯一ID
		if (!currentData.id) {
			//不存在id时随机指定，并存储到data里
			currentData.id = this.config._roleId + "" + this.config._uniqueId++;
		}

		//必须有的属性值：检查name值，若不存在则沿用ID值
		if (!currentData.name) {
			currentData.name = currentData.id;
		}

		//绑定其他数据：增加角色、索引序号、拥有者
		currentData._role = "node";
		currentData.index = i;
		currentData._orderId = this._orderCounter++;
		//增加数据拥有者属性
		currentData._owner = currentData._owner || [];
		currentData._owner.push(this.config._roleId)

		var $addNode;
		//根据nodeFormater函数格式化节点
		if (this.config.view.nodeFormater && $.type(this.config.view.nodeFormater) == "function") {
			$addNode = $(this.config.view.nodeFormater(currentData, this._orderCounter));
		} else {
			//默认格式:输出name值
			$addNode = $('<div>' + currentData.name + '</div>');
		}

		$addNode.addClass(this.config.view.nodeClass);

		//节点保存数据池
		$addNode.data("data", currentData);
		//设置节点的HTML属性：ID、排序号、索引序号、角色和初始样式
		$addNode.attr("data-role", "node");
		$addNode.attr("data-id", currentData.id);
		$addNode.attr("data-orderid", currentData._orderId);
		$addNode.attr("data-index", currentData.index);

		//缓存区暂存新增节点
		$addNodeCache.append($addNode);

		//节点创建成功后的回调
		if (this.config.callback.nodeCallback && $.type(this.config.callback.nodeCallback) == "function") {
			this.config.callback.nodeCallback($addNode, this.getDataById($addNode), this);
		}

		//节点状态不存在时：不更新节点状态信息
		if (currentData.state) {
			this.setNodeState($addNode, currentData.state);
		}
	}

	//全部节点生成后
	var $addNodeArray = $addNodeCache.children();

	//插入到指定位置且位置在节点长度内
	if (index >= 0 && index <= this.getAllNode().length) {
		var $targetNode = this.getAllNode().eq(index);
		$targetNode.before($addNodeArray);
	} else {
		this.$content.append($addNodeArray);
	}

	//数据加载完毕
	this._isLoadComplete = true;

	//是否为第一次加载数据完毕
	if (this._isInitLoadComplete == false) {
		this._isInitLoadComplete = true;
	} else {
		//更新节点信息
		//this.refreshNode(true);
	}

	//触发自身回调
	if (callback) {
		callback($addNodeArray, this);
	}

	//返回增加的对象
	return $addNodeArray;
}

/**
 * 克隆JQ节点对象，（cloneMode为true时）对克隆节点的数据操作不会影响到原数据的变化
 * @param   {Number||String||Array||JQObject} nodeId ID字符串 | 数组ID字符串 | JQ节点对象 
 * @param   {Boolean} cloneMode 克隆模式，false(默认)时是独立复制了一份数据并克隆，还会附带一些克隆信息，ture时并不是克隆节点对象，而是对那个镜象对象的引用镜像，即数据指向是一致的，操作这个克隆的数据时，被克隆对象也会发生变更
 * @param   {Function} callback 回调函数
 * @returns {JQObject} 返回克隆的JQ节点对象
 */
LUIController.prototype.cloneNode = function (nodeId, cloneMode, callback) {
	var filterArgs = _filterArguments(arguments, [["number", "string", "array", "jqobject"], "boolean", "function"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.cloneNode(nodeId, cloneMode, callback)";
		log(errorText, "color:#f00");
		return false;
	}

	nodeId = filterArgs[0];
	cloneMode = filterArgs[1] !== undefined ? filterArgs[1] : false;
	callback = filterArgs[2];

	var $getNode = this.getNodeById(nodeId);

	var $cloneNodeCache = $("<div/>");

	for (var i = 0; i < $getNode.length; i++) {
		var $currentNode = $getNode.eq(i);
		var $cloneNode;

		if (cloneMode) {
			//引用同一数据源
			$cloneNode = $currentNode.clone(true);
		} else {
			//复制一份数据源
			$cloneNode = $currentNode.clone();
			var cloneData = this.cloneData(this.getDataById($currentNode))
			$cloneNode.data("data", cloneData);
		}
		$cloneNodeCache.append($cloneNode);
	}

	var $cloneNodeArray = $cloneNodeCache.children();

	//触发自身回调
	if (callback) {
		callback($cloneNodeArray, $getNode, this);
	}

	return $cloneNodeArray;
}

/**
 * 移除JQ节点对象
 * @param   {Number||String||Array||JQObject} nodeId ID字符串 | 数组ID字符串 | JQ节点对象 
 * @param   {Function} callback 回调函数
 * @returns {JQObject} 返回移除的JQ节点对象
 */
LUIController.prototype.removeNode = function (nodeId, callback) {
	var filterArgs = _filterArguments(arguments, [["number", "string", "array", "jqobject"], "function"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.removeNode(nodeId, callback)";
		log(errorText, "color:#f00");
		return false;
	}

	nodeId = filterArgs[0];
	callback = filterArgs[1];

	var $getNode = this.getNodeById(nodeId);

	var $removeNodeCache = $("<div/>");

	for (var i = 0; i < $getNode.length; i++) {
		var $currentNode = $getNode.eq(i);
		var $removeNode = $currentNode.detach();
		$removeNodeCache.append($removeNode);
	}

	var $removeNodeArray = $removeNodeCache.children();

	//更新节点信息
	//this.refreshNode(true);

	//触发自身回调
	if (callback) {
		callback($removeNodeArray, this);
	}
	//返回删除的对象
	return $removeNodeArray;
};

/**
 * 清空节点：移除所有JQ节点对象
 * @param   {Function} callback 回调函数
 * @returns {JQObject} 返回移除的所有JQ节点对象
 */
LUIController.prototype.cleanNode = function (callback) {
	var filterArgs = _filterArguments(arguments, ["function"]);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.cleanNode(callback)";
		log(errorText, "color:#f00");
		return false;
	}

	callback = filterArgs[0];

	var $allNode = this.getAllNode();

	var $removeNode = this.removeNode($allNode);

	if (callback) {
		callback($removeNode, this);
	}

	//返回被清空的所有的对象
	return $removeNode;
};

/**
 * 替换JQ节点对象，请求替换只能是节点对象，不能是数据生成的对象（多次推论），可用一个或多个节点替换1个被替换的节点，节点如果是如果是一个已存在的，则会将其从原位置删除，并添加到替换源的
 * 不按照replaceId的顺序添加，如果需要有顺序，请逐一调用此方法
 * @param   {Number||String|||JQObject} nodeId ID字符串 | 数组ID字符串 | JQ节点对象 
 * @param   {Number||String||Array||JQObject} replaceNodeId ID字符串 | 数组ID字符串 | JQ节点对象 
 * @param   {Boolean}  replaceMode 替换模式，为true时为互相交换(交换的位置为替换节点的第一个位置)，为false时替换节点覆盖被替换节点
 * @param   {Function} callback 回调函数
 * @returns {JQObject} 返回替换的JQ节点对象
 */
LUIController.prototype.replaceNode = function (nodeId, replaceNodeId, replaceMode, callback) {
	var filterArgs = _filterArguments(arguments, [["number", "string", "jqobject"], ["number", "string", "array", "jqobject"], "boolean", "function"], 2);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.replaceNode(nodeId, replaceNodeId, replaceMode, callback)";
		log(errorText, "color:#f00");
		return false;
	}

	nodeId = filterArgs[0];
	replaceNodeId = filterArgs[1];
	replaceMode = filterArgs[2] !== undefined ? filterArgs[2] : false;
	callback = filterArgs[3];

	var $getNode = this.getNodeById(nodeId);
	var $getReplaceNode = this.getNodeById(replaceNodeId);
	//被替换的节点存在于节点中且替换的节点也存在时失败时并不删除被替换的节点
	if ($getNode.index() >= 0 && $getReplaceNode.length > 0) {
		if (replaceMode) {
			var getIndex = this.getAllNode().index($getNode);
			$getReplaceNode.eq(0).after($getNode);
			this.getAllNode().eq(getIndex).before($getReplaceNode);
		} else {
			$getNode.after($getReplaceNode);
			this.removeNode($getNode);
		}
	}

	//更新节点信息
	//this.refreshNode(true);

	if (callback) {
		callback($getReplaceNode, $getNode, this);
	}

	//返回被替换的对象
	return $getReplaceNode;
};

/**
 * 排序JQ节点对象
 * @param   {JQObject} nodeId    JQ节点对象
 * @param   {String||Array} orderKey  排序字段，默认值_orderId(数据加载时按顺序生成的唯一排序ID)
 * @param   {String||Array} orderType 排序方式，默认升序（以其在文档流中的顺序为准），"asc"升序，"desc"降序，若排序方式少于排序字段，则默认以前一个的排序方式值，当字段>方式是，以方式的最后一个值，填充至与字段相同的长度
 * @param   {Function} callback   回调函数
 * @returns {JQObject} 返回排序后的JQ节点对象
 */
LUIController.prototype.sortNode = function (nodeId, orderKey, orderType, callback) {
	var filterArgs = _filterArguments(arguments, ["jqobject", ["string", "array"], ["string", "array"], "function"]);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.sortNode(nodeId, orderKey, orderType, callback)";
		log(errorText, "color:#f00");
		return false;
	}

	nodeId = filterArgs[0] !== undefined ? filterArgs[0] : this.getAllNode();
	orderKey = filterArgs[1];
	orderType = filterArgs[2];
	callback = filterArgs[3];

	//要递归的排序字段和排序方式数组
	var orderKeyArray = [],
		orderTypeArray = [];

	//转换为数组格式
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

	//过滤字段中非字符串的值，type不存在？
	orderTypeArray = $.grep(orderTypeArray, function (value, index) {
		return $.type(value) == "string";
	});

	//若排序方式与排序字段数量不对称，方式>字段时，忽略方式方式后面的值；字段>方式时，以方式的最后一个值，填充至与字段相同的长度
	if (orderTypeArray.length > orderKeyArray.length) {
		//方式>字段，截断后面要排序的值列
		orderTypeArray = orderTypeArray.slice(0, orderKeyArray.length);
	} else if (orderTypeArray.length <= orderKeyArray.length) {
		//方式<字段
		//将方式扩充至与字段一样多，未定义或非asc和desc的方式也设置一个默认值
		for (var i = 0; i < orderKeyArray.length; i++) {
			if (orderTypeArray[i] != "asc" && orderTypeArray[i] != "desc") {
				if (orderKeyArray[i] == "_orderId") {
					//如果是orderId，默认为asc，其他字段，默认为desc
					orderTypeArray[i] = "asc";
				} else {
					orderTypeArray[i] = "desc";
				}
			}
		}
	}

	var $getNode = this.getNodeById(nodeId);
	var $sortNode = [];
	//如果需要排序
	if (orderKeyArray.length > 0) {
		var $sortNodeCache = $("<div/>");
		//首次排序 Start
		//取得排序前的节点id顺序
		var filterKeyId = _dataToArray(this.getDataById($getNode, "id"));
		var sortKeyId;
		//取得暂存区的节点（刷新序位）
		//过滤需要排序的数据字段，得到排序顺序
		var filterKey = _dataToArray(this.getDataById($getNode, orderKeyArray[0]));
		var sortKey;
		//根据orderType类型决定当前字段的排序方式
		//复制一份
		var clonefilterKey = $.merge([], filterKey)
		var sortKey;
		if (orderTypeArray[0] && orderTypeArray[0].toLowerCase() === "asc") {
			//升序
			sortKey = _arraySort(clonefilterKey);
		} else if (orderTypeArray[0] && orderTypeArray[0].toLowerCase() === "desc") {
			//降序
			sortKey = _arraySort(clonefilterKey).reverse();
		}

		//判断他们之间是否有数值相等
		for (var j = 0; j < sortKey.length; j++) {
			var index = $.inArray(sortKey[j], clonefilterKey);
			//过滤后将clonefilterKey里的值给清空，避免重复取得
			clonefilterKey[index] = null;
			//暂存
			$sortNodeCache.append($getNode.eq(index));
		}

		//首次排序后得到新的排序后的ID顺序
		sortKeyId = _dataToArray(this.getDataById($sortNodeCache.children(), "id"));
		//首次排序 End
		//递归检索是否还存在排序字段，对上一次排序后相同的数据进行再次排序
		var i = 0;
		while ((i++) < orderKeyArray.length) {
			//比较当前排序后两个值是前后是否相等,最后一个值不作比较
			//执行2次：第1次对第1个以后的字段先排序，第2次对第1个进行排序
			for (var z = 0; z < 2; z++) {
				for (var k = 0; k < sortKey.length - 1; k++) {
					var prevNode = $sortNodeCache.children().eq(k);
					var nextNode = $sortNodeCache.children().eq(k + 1);
					//重新排序后的当前字段值
					var prevCurrentKeyData = this.getDataById(prevNode, orderKeyArray[i - 1])[orderKeyArray[i - 1]];
					var nextCurrentKeyData = this.getDataById(nextNode, orderKeyArray[i - 1])[orderKeyArray[i - 1]];
					if (prevCurrentKeyData == nextCurrentKeyData) {
						//若相同，计算下一个排序字段的值，不相同则不理会
						//获取下一个排序字段
						var nextOrderKey = orderKeyArray[i];
						var nextOrderType = orderTypeArray[i];
						var prevKeyData = this.getDataById(prevNode, nextOrderKey)[nextOrderKey];
						var nextKeyData = this.getDataById(nextNode, nextOrderKey)[nextOrderKey];

						//下一个排序字段的数据值，进行比较，
						if (nextOrderType && nextOrderType.toLowerCase() === "asc") {
							//比较两个值哪个大，大的放后面
							if (prevKeyData > nextKeyData) {
								nextNode.after(prevNode);
							} else {
								prevNode.after(nextNode);
							}
						} else if (nextOrderType && nextOrderType.toLowerCase() === "desc") {
							//比较两个值哪个大，大的放前面
							if (prevKeyData > nextKeyData) {
								prevNode.after(nextNode);
							} else {
								nextNode.after(prevNode);
							}
						}
					}
				}
			}
		}

		//循环结束后将排序后的节点顺序附加到内容区中
		$sortNode = $sortNodeCache.children();
		this.$content.prepend($sortNode);
	}

	//更新节点信息
	//this.refreshNode(true);

	if (callback) {
		callback($sortNode, $getNode, this);
	}

	//返回被排序后的对象
	return $sortNode;
};

/**
 * 过滤JQ节点对象
 * @param {JQObject} nodeId    JQ节点对象
 * @param {String||RegExp} pattern   过滤表达式（使用正则表达式时，将忽略matchmode）或过滤字符串
 * @param {String||Array} filterKey 搜索的字段，默认搜索name字段，all表示全部
 * @param {Boolean} matchMode 匹配模式：精确匹配(false默认)，模糊匹配(true)
 * @param {Boolean} filterMode 过滤模式，true表示删除非指定的节点,false（默认）表示仅隐藏并不删除非指定的节点
 * @param {Function} callback  回调函数
 * @returns {JQObject} 返回过滤的JQ节点对象
 */
LUIController.prototype.filterNode = function (nodeId, pattern, filterKey, matchMode, filterMode, callback) {
	var filterArgs = _filterArguments(arguments, ["jqobject", ["string", "regexp"], ["string", "array"], "boolean", "boolean", "function"]);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.filterNode(nodeId, pattern, filterKey, matchMode, filterMode, callback)";
		log(errorText, "color:#f00");
		return false;
	}

	nodeId = filterArgs[0] !== undefined ? filterArgs[0] : this.getAllNode();
	pattern = filterArgs[1] !== undefined ? filterArgs[1] : "";
	filterKey = filterArgs[2] !== undefined ? filterArgs[2] : "name";
	matchMode = filterArgs[3] !== undefined ? filterArgs[3] : false;
	filterMode = filterArgs[4] !== undefined ? filterArgs[4] : false;
	callback = filterArgs[5];

	var $allNode = this.getNodeById(nodeId);

	//根据过滤条件，得到过滤后的数组JQ节点对象 和节点ID
	var $filterNode;
	var filterIdArray = [];
	//filterMode为true时下被移出的节点，若非true则表示移出节点为空
	var $removeNode = [];

	//若过滤内容不存在，则显示所有节点
	if ($.type(pattern) == "string" && $.trim(pattern).length == 0) {
		//输入为空字符串时
		$filterNode = $allNode;
		//按顺序排序
		//this.sortNode($allNode);
		$filterNode.show();
	} else {
		//有查询条件时
		//如果是字符串，则将字符串转为正则表达式
		var filterExp = "";
		if ($.type(pattern) == "regexp") {
			filterExp = pattern;
		} else if ($.type(pattern) == "string") {
			//根据匹配模式，生成正则表达式
			if (matchMode == true) {
				//糊匹
				filterExp = $.trim(pattern).replace(/\s+/g, "");
				//在每个字符后加上+.*
				var reg = "";
				for (var i = 0; i < filterExp.length; i++) {
					reg += filterExp[i] + "+.*";
				}
				filterExp = reg;
			} else {
				//精匹
				filterExp = $.trim(pattern).replace(/\s+/g, " ");
				filterExp = filterExp.replace(/\s+/g, "+.*");
			}
			//转成正则表达式
			filterExp = eval("/" + filterExp + "/g");
		}

		//检索查询
		for (var i = 0; i < $allNode.length; i++) {
			//根据filterKey的设置筛选出数据
			var $getNode = $allNode.eq(i);
			var getData;

			//字符串，或者数组
			if ($.type(filterKey) == "string" && filterKey == "all") {
				getData = this.getDataById($getNode);
			} else if (($.type(filterKey) == "string" || $.type(filterKey) == "array")) {
				getData = this.getDataById($getNode, filterKey);
			}

			//遍历查询所有的数据
			for (var key in getData) {
				//开始查询
				if ($.trim(getData[key]).search(filterExp) >= 0) {
					//$filterNodeCache.append($getNode);
					filterIdArray.push(this.getDataById($getNode).id);
					break;
				}
			}
		}

		//隐藏所有节点
		$allNode.hide();
		//过滤得到的节点ID
		$filterNode = this.getNodeById(filterIdArray);
		$filterNode.show();

		//显示查询结果节点，不对顺序做变更
		//严格过滤模式
		if (filterMode == true) {
			//删除节点
			$removeNode = this.getAllNode().filter(":hidden");
			$removeNode.detach();
		} else {
			//仅隐藏节点
			$removeNode = this.getAllNode().filter(":hidden");
		}
	}

	//更新节点信息
	//this.refreshNode(true);

	if (callback) {
		callback($filterNode, $removeNode, this);
	}
	return $filterNode;
}

/**
 * 设置JQ节点对象的状态值data-state=*
 * @param   {Number||String||Array||JQObject} nodeId ID字符串 | 数组ID字符串 | JQ节点对象 
 * @param   {String} state      自定义状态名：常用默认的有禁用disabled，选中selected
 * @param   {String} stateClass 自定义样式名：常用默认的有禁用disabled，选中selected，也可以直接写样式
 * @param   {Function} callback   回调函数
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIController.prototype.setNodeState = function (nodeId, state, stateClass, callback) {
	var filterArgs = _filterArguments(arguments, [["number", "string", "array", "jqobject"], "string", "string", "function"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.setNodeState(nodeId, state, stateClass, callback)";
		log(errorText, "color:#f00");
		return false;
	}

	nodeId = filterArgs[0];
	state = filterArgs[1];
	stateClass = filterArgs[2];
	callback = filterArgs[3];

	var $getNode = this.getNodeById(nodeId);

	var selectedId = _dataToArray(this.getSelectedData("id"));

	for (var i = 0; i < $getNode.length; i++) {
		var currentData = this.getDataById($getNode.eq(i));
		var curId = currentData.id;

		//判断当前操作节点是否在节点记忆池中
		var index = $.inArray(curId, selectedId);

		//暂存原节点状态
		var oriState = this.getDataById($getNode.eq(i), "state").state;
		//移除原来的状态的样式
		/*$getNode.eq(i).removeClass(function (a, b) {
			return oriState;
		});*/

		$getNode.eq(i).removeClass(oriState);

		//存储状态数据
		if (state) {
			//state存在时，设置节点数据
			$getNode.eq(i).attr("data-state", state);
			currentData.state = state;
			//如果是选中状态，暂存数据(如果已存，则只更新节点信息)，否则删除数据
			if (state == "selected") {
				if (index < 0) {
					this._selectedNode.push($getNode.eq(i))
				} else {
					//若已存在，则只更新信息
					this._selectedNode[index] = $getNode.eq(i);
				}
			}
		} else {
			//移除状态节点
			$getNode.eq(i).removeAttr("data-state");
			delete currentData.state;
			//this.removeNodeData($getNode.eq(i), "state");
			//移除状态节点时，无论是什么状态，均从数据暂存区中删除
			//得到数据索引，删除那一条
			if (index >= 0) {
				this._selectedNode[index] = null;
			}
		}

		//如果有指定stateclass加上， 否则加上以现在状态为名称的样式
		if (stateClass) {
			//直接的样式属性表，需要用"{}"包裹，
			if (stateClass.indexOf("{") >= 0 && stateClass.indexOf("}") >= 0) {
				$getNode.eq(i).attr("style", stateClass.slice(1, -1))
			} else {
				//样式名称
				$getNode.eq(i).addClass(this.config.view.nodeClass);
				$getNode.eq(i).addClass(stateClass);
			}
		} else {
			//如果state存在
			if (state) {
				$getNode.eq(i).addClass(this.config.view.nodeClass);
				$getNode.eq(i).addClass(state);
			}
		}
	}

	//清除null值
	this._selectedNode = $.grep(this._selectedNode, function (value, index) {
		return value != null;
	});

	if (callback) {
		callback($getNode, this);
	}
	//返回被设置的对象
	return this;
}

/**
 * 禁用JQ节点对象的快捷方法
 * @param   {Number||String||Array||JQObject} nodeId ID字符串 | 数组ID字符串 | JQ节点对象 
 * @param   {String} disabledClass 自定义禁用样式
 * @param   {Function} callback   回调函数
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIController.prototype.disableNode = function (nodeId, disabledClass, callback) {
	var filterArgs = _filterArguments(arguments, [["number", "string", "array", "jqobject"], "string", "function"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.disableNode(nodeId, disabledClass, callback)";
		log(errorText, "color:#f00");
		return false;
	}

	nodeId = filterArgs[0];
	disabledClass = filterArgs[1];
	callback = filterArgs[2];

	var $disabledNode = this.setNodeState(nodeId, "disabled", disabledClass);

	if (callback) {
		callback($disabledNode, this);
	}
	//返回被选中的对象
	return this;
}

/**
 * 选中JQ节点对象
 * @param   {Number||String||Array||JQObject} nodeId ID字符串 | 数组ID字符串 | JQ节点对象 
 * @param   {String} disabledClass 自定义选中样式
 * @param   {Function} callback   回调函数
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIController.prototype.selectNode = function (nodeId, selectedClass, callback) {

	var filterArgs = _filterArguments(arguments, [["number", "string", "array", "jqobject"], "string", "function"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.selectNode(nodeId, selectedClass, callback)";
		log(errorText, "color:#f00");
		return false;
	}

	nodeId = filterArgs[0];
	selectedClass = filterArgs[1];
	callback = filterArgs[2];

	var $selectedNode = this.setNodeState(nodeId, "selected", selectedClass);

	if (callback) {
		callback($selectedNode, this);
	}
	//返回被选中的对象
	return this;
}

/**
 * 取消选中JQ节点对象：只针对已选中状态取消选中，不针对其他状态
 * @param   {Number||String||Array||JQObject} nodeId ID字符串 | 数组ID字符串 | JQ节点对象 
 * @param   {Function} callback   回调函数
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIController.prototype.cancelSelectedNode = function (nodeId, callback) {
	var filterArgs = _filterArguments(arguments, [["number", "string", "array", "jqobject"], "function"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.cancelSelectedNode(nodeId, callback)";
		log(errorText, "color:#f00");
		return false;
	}

	nodeId = filterArgs[0];
	callback = filterArgs[1];

	var $getNode = this.getNodeById(nodeId);

	var $cancelSelectNodeArray = [];
	for (var i = 0; i < $getNode.length; i++) {
		var $currentNode = $getNode.eq(i);
		var getData = this.getDataById($currentNode);
		//只针对已选中状态取消选中，不针对其他状态
		if (getData.state == "selected") {
			$cancelSelectNodeArray.push($currentNode);
		}
	}

	var $cancelSelectNode = this.setNodeState($cancelSelectNodeArray);

	if (callback) {
		callback($cancelSelectNode, this);
	}

	//返回被取消选中的对象
	return this;
}

/**
 * 取消所有选中JQ节点对象
 * @param   {Number||String||Array||JQObject} nodeId ID字符串 | 数组ID字符串 | JQ节点对象 
 * @param   {Function} callback   回调函数
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIController.prototype.cleanSelectedNode = function (callback) {
	var filterArgs = _filterArguments(arguments, ["function"]);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.cleanSelectedNode(callback)";
		log(errorText, "color:#f00");
		return false;
	}

	callback = filterArgs[0];

	var $selectedNode = this.getSelectedNode();
	var $cancelSelectNode = this.cancelSelectedNode($selectedNode);

	if (callback) {
		callback($cancelSelectNode, this);
	}
	//返回被取消选中的对象
	return this;
}

/**
 * JQ节点对象的数据源增加一项记录或多项记录
 * 一项记录时为可以使用key和value2个参数，多项记录时使用key参数，传入格式要求为键/值对格式原生对象，当为对象格式时会忽略value参数
 * 注意：如果要新增的键已存在且存在内容，则不替换它，将会略过，如果键内容为空，则替换它
 * @param   {Number||String||Array||JQObject} nodeId ID字符串 | 数组ID字符串 | JQ节点对象 
 * @param   {String||Object} key      键名或键/值对的数据对象
 * @param   {String} value    值名
 * @param   {Function} callback  回调函数
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIController.prototype.addNodeData = function (nodeId, key, value, callback) {

	var filterArgs = _filterArguments(arguments, [["number", "string", "array", "jqobject"], ["string", "plainobject"], "all", "function"], 2);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.addNodeData(nodeId, key, value, callback)";
		log(errorText, "color:#f00");
		return false;
	}

	nodeId = filterArgs[0];
	key = filterArgs[1];
	value = filterArgs[2];
	callback = filterArgs[3];

	var $getNode = this.getNodeById(nodeId);
	var clonedata = _cloneData(this.getDataById($getNode));

	for (var i = 0; i < $getNode.length; i++) {
		var getData = this.getDataById($getNode.eq(i));

		if ($.type(key) == "string" && value) {
			//注意：如果要新增的键已存在且存在内容，则不能替换他
			if (getData[key] === undefined) {
				getData[key] = value;
			}
		} else if ($.type(key) == "object") {
			for (var keyName in key) {
				if (getData[keyName] === undefined) {
					getData[keyName] = key[keyName];
				}
			}
		}
	}

	//更新当前节点信息
	this.refreshNode($getNode, false);

	if (callback) {
		callback(this.getDataById($getNode), clonedata, this);
	}

	return this;
};

/**
 * JQ节点对象的数据源替换一项记录或多项记录
 * 不会在页面上出现变化，比如更改了数据的名称等等，不能实时显示
 * 变更数据时会同步更新HTML属性，因此有时候你改了数据，但在DOM结构上会马上显现出来
 * 注意：与addNodeData不同的地方在于
 * 0.不支持更改_orderId和index
 * 1.针对查找到的key进行替换
 * 2.未找到key或者无内容，则进行增加
 * @param   {Number||String||Array||JQObject} nodeId ID字符串 | 数组ID字符串 | JQ节点对象 
 * @param   {String||Object}                      key      键名或键/值对的数据对象
 * @param   {String}                             value    值名
 * @param   {Function}                           callback 回调函数
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIController.prototype.replaceNodeData = function (nodeId, key, value, callback) {
	var filterArgs = _filterArguments(arguments, [["number", "string", "array", "jqobject"], ["string", "plainobject"], "all", "function"], 2);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.replaceNodeData(nodeId, key, value, callback)";
		log(errorText, "color:#f00");
		return false;
	}

	nodeId = filterArgs[0];
	key = filterArgs[1];
	value = filterArgs[2];
	callback = filterArgs[3];

	var $getNode = this.getNodeById(nodeId);
	var clonedata = _cloneData(this.getDataById($getNode));

	for (var i = 0; i < $getNode.length; i++) {
		var getData = this.getDataById($getNode.eq(i));

		if ($.type(key) == "string" && value !== undefined && key != "_orderId" && key != "index") {
			//不支持变更orderID和index
			getData[key] = value;
		} else if ($.type(key) == "object") {
			for (var keyName in key) {
				if (keyName != "_orderId" && keyName != "index") {
					getData[keyName] = key[keyName];
				}
			}
		}
	}

	//更新当前节点信息
	this.refreshNode($getNode, false);

	if (callback) {
		callback(this.getDataById($getNode), clonedata, this);
	}

	return this;
};

/**
 * JQ节点对象的数据源移除一项记录或多项记录，对于节点数据的更改不会在页面上出现变化，比如更改了数据的名称等等，不能实时显示
 * 2.未找到key或者无内容，则增加
 * @param   {Number||String||Array||JQObject} nodeId ID字符串 | 数组ID字符串 | JQ节点对象 
 * @param   {String||Array} key      键名或键名数组
 * @param   {Function} callback  回调函数
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIController.prototype.removeNodeData = function (nodeId, key, callback) {
	var filterArgs = _filterArguments(arguments, [["number", "string", "array", "jqobject"], ["string", "array"], "function"], 2);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.removeNodeData(nodeId, key, callback)";
		log(errorText, "color:#f00");
		return false;
	}

	nodeId = filterArgs[0];
	key = filterArgs[1];
	callback = filterArgs[2];

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

	//更新当前节点信息
	this.refreshNode($getNode, false);

	if (callback) {
		callback(this.getDataById($getNode), clonedata, this);
	}

	return this;
};

/**
 * JQ节点对象的数据源项全部移除
 * @param   {Number||String||Array||JQObject} nodeId ID字符串 | 数组ID字符串 | JQ节点对象 
 * @param   {Function} callback  回调函数
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIController.prototype.cleanNodeData = function (nodeId, callback) {
	var filterArgs = _filterArguments(arguments, [["number", "string", "array", "jqobject"], "function"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.cleanNodeData(nodeId, callback)";
		log(errorText, "color:#f00");
		return false;
	}

	nodeId = filterArgs[0];
	callback = filterArgs[1];

	var $getNode = this.getNodeById(nodeId);
	var cloneData = _cloneData(this.getDataById(nodeId));
	for (var i = 0; i < $getNode.length; i++) {
		var getData = this.getDataById($getNode.eq(i));

		for (var key in getData) {
			delete getData[key]
		}
	}

	if (callback) {
		callback(cloneData, this);
	}

	return this;
};

/**
 * 获取指定JQ节点对象数据
 * 只有nodeId参数时，返回的是指向原数据源的引用，任何对返回数据源的修改，都会影响老数据源实时反应，如果想修改的数据不影响原数据，请先用cloneData克隆一份数据源
 * 存在filterKey参数时，将返回被筛选后的原数据源的克隆数据，任何对返回数据源的修改，都不会影响老数据源
 * 操作的节点对象只有一个时，直接返回对该数据的引用
 * 操作的节点对象只有一个时，且键名只有一个时，将返回复制过数据源的字符串格式
 * 操作的节点对象多个时，但键名只有一个时，将返回复制过数据源的字符串数组格式
 * @param   {Number||String||Array||JQObject} nodeId ID字符串 | 数组ID字符串 | JQ节点对象 
 * @param   {String||Array} filterKey        指定要筛选的键名字符串，或键名数组，未指定时获取全部数据
 * @param   {Boolean} filterMode 筛选模式：简单模式false(默认)：仅部分包括即可返回数据源;严格筛选模式true：必须包括全部的键名才被筛选
 * @param   {Function} callback  回调函数
 * @returns {JQObject}   返回指定JQ节点对象数据数组对象
 */
LUIController.prototype.getDataById = function (nodeId, filterKey, filterMode, callback) {
	var filterArgs = _filterArguments(arguments, [["number", "string", "array", "jqobject"], ["string", "array"], "boolean", "function"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.getDataById(nodeId, filterKey, filterMode, callback)";
		log(errorText, "color:#f00");
		return false;
	}

	nodeId = filterArgs[0];
	filterKey = filterArgs[1];
	filterMode = filterArgs[2] !== undefined ? filterArgs[2] : false;
	callback = filterArgs[3];

	var $getNode = this.getNodeById(nodeId);
	var getData = [];

	for (var i = 0; i < $getNode.length; i++) {
		getData.push($getNode.eq(i).data("data"));
	}

	if (filterKey) {
		getData = _cloneData(getData);
		getData = _filterData(getData, filterKey, filterMode);
	}

	//根据nodeId的数量，决定返回数量的长度格式
	//原参数为数组时，返回数组格式，原参数是直接的节点对象时且节点对象大于1个时，也返回数组格式
	//只有一条数据时直接返回第一条数据，多条数据时返回数组对象
	if ($.type(nodeId) != "array" && !($.type(nodeId) == "object" && nodeId.length > 1) && getData.length > 0) {
		getData = getData[0];
	}

	if (callback) {
		callback(getData, $getNode, this);
	}
	return getData;
};

/**
 * 返回所有的JQ节点对象数据
 * 只有nodeId参数时，返回的是指向原数据源的引用，任何对返回数据源的修改，都会影响老数据源实时反应，如果想修改的数据不影响原数据，请先用cloneData克隆一份数据源
 * 存在filterKey参数时，将返回被筛选后的原数据源的克隆数据，任何对返回数据源的修改，都不会影响老数据源
 * @param   {String|Array} filterKey        指定要筛选的键名字符串，或键名数组
 * @param   {Boolean} filterMode 筛选模式：简单模式false(默认)：仅部分包括即可返回数据源;严格筛选模式true：必须包括全部的键名才被筛选
 * @param   {Function} callback  回调函数
 * @returns {JQObject}   返回所有JQ节点对象数据数组对象或空数组
 */

LUIController.prototype.getAllData = function (filterKey, filterMode, callback) {
	var filterArgs = _filterArguments(arguments, [["string", "array"], "boolean", "function"]);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.getAllData(filterKey, filterMode, callback)";
		log(errorText, "color:#f00");
		return false;
	}

	filterKey = filterArgs[0];
	filterMode = filterArgs[1] !== undefined ? filterArgs[1] : false;
	callback = filterArgs[2];

	var $allNode = this.getAllNode();

	var allData = [];

	//不通过getDataById获取所有节点数据，getAllData最终返回的是一个数组形式数据，因为有可能是空数组
	for (var i = 0; i < $allNode.length; i++) {
		allData.push(this.getDataById($allNode.eq(i)));
	}

	if (filterKey) {
		allData = _cloneData(allData);
		allData = _filterData(allData, filterKey, filterMode);
	}

	if (callback) {
		callback(allData, this);
	}

	//返回所有数据
	return allData;
}

/**
 * 获取选中的JQ节点对象数据
 * 只有nodeId参数时，返回的是指向原数据源的引用，任何对返回数据源的修改，都会影响老数据源实时反应，如果想修改的数据不影响原数据，请先用cloneData克隆一份数据源
 * 存在filterKey参数时，将返回被筛选后的原数据源的克隆数据，任何对返回数据源的修改，都不会影响老数据源
 * @param   {String||Array} filterKey        指定要筛选的键名字符串，或键名数组
 * @param   {Boolean} filterMode 筛选模式：简单模式false(默认)：仅部分包括即可返回数据源;严格筛选模式true：必须包括全部的键名才被筛选
 * @param   {Function} callback  回调函数
 * @returns {JQObject}   返回选中的JQ节点对象数据数组对象或空数组
 */

LUIController.prototype.getSelectedData = function (filterKey, filterMode, callback) {
	var filterArgs = _filterArguments(arguments, [["string", "array"], "boolean", "function"]);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.getSelectedData(filterKey, filterMode, callback)";
		log(errorText, "color:#f00");
		return false;
	}

	filterKey = filterArgs[0];
	filterMode = filterArgs[1] !== undefined ? filterArgs[1] : false;
	callback = filterArgs[2];

	var $selectedNode = this.getSelectedNode();

	var selectedData = [];

	//不通过getDataById获取所有节点数据，getAllData最终返回的是一个数组形式数据，因为有可能是空数组
	for (var i = 0; i < $selectedNode.length; i++) {
		selectedData.push(this.getDataById($selectedNode.eq(i)));
	}

	if (filterKey) {
		selectedData = _cloneData(selectedData);
		selectedData = _filterData(selectedData, filterKey, filterMode);
	}

	if (callback) {
		callback(selectedData, this);
	}

	//返回被选中数据
	return selectedData;
}

/**
 * 获取指定索引序位的JQ节点对象数据
 * @param   {Number||Array} 索引序位 接受数字和纯数字形式字符串
 * @param   {String||Array} filterKey        指定要筛选的键名字符串，或键名数组，未指定时获取全部数据
 * @param   {Boolean} filterMode 筛选模式：简单模式false(默认)：仅部分包括即可返回数据源;严格筛选模式true：必须包括全部的键名才被筛选
 * @param   {Function} callback  回调函数
 * @returns {JQObject}   返回指定索引序位JQ节点对象数据数组对象
 */
LUIController.prototype.getDataByIndex = function (index, filterKey, filterMode, callback) {
	var filterArgs = _filterArguments(arguments, [["number", "array"], ["string", "array"], "boolean", "function"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.getDataByIndex(index, filterKey, filterMode, callback)";
		log(errorText, "color:#f00");
		return false;
	}

	index = filterArgs[0];
	filterKey = filterArgs[1];
	filterMode = filterArgs[2] !== undefined ? filterArgs[2] : false;
	callback = filterArgs[3];

	var $getNode = this.getNodeByIndex(index);

	var getData = [];

	for (var i = 0; i < $getNode.length; i++) {
		getData.push(this.getDataById($getNode.eq(i)));
	}

	if (filterKey) {
		getData = _cloneData(getData);
		getData = _filterData(getData, filterKey, filterMode);
	}

	//只有一条数据时直接返回第一条数据，多条数据时返回数组对象
	if ($.type(index) != "array" && getData.length > 0) {
		getData = getData[0];
	}

	/*	//区于别getAllData和getSelectedData，该方法返回的数据中只有一条数据时，会直接返回对象格式，而他们始终返回数组格式
		if (getData.length == 1) {
			getData = getData[0];
		}*/

	if (callback) {
		callback(getData, $getNode, this);
	}
	return getData;
}

/**
 * 克隆数据源
 * 注意：克隆数据会增加一些额外数据字段，比如对数据进行了克隆，那么这一份数据的拥有者就清空了，然后增加一个克隆至谁的数据字段和被克隆次数的字段
 * @param   {PlainObject||Array} data     数据源可以是直接健/值对的原生对象格式，也可以是多项健/值对的数组对象
 * @param   {Function} callback  回调函数
 * @returns {JQObject}   返回克隆后的数据源
 */
LUIController.prototype.cloneData = function (data, callback) {

	//过滤参数且重排理想参数顺序
	var filterArgs = _filterArguments(arguments, [["plainobject", "array"], "function"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.cloneData(data, callback)";
		log(errorText, "color:#f00");
		return false;
	}

	data = filterArgs[0];
	callback = filterArgs[1];

	var validateData = _validateData(data);

	var cloneDataArray = [];

	for (var i = 0; i < validateData.length; i++) {

		//原数据源克隆
		var cloneData = $.extend(true, {}, validateData[i])

		//对原数据增加克隆者属性和被克隆者属性
		if (!validateData[i]._cloneCount) {
			validateData[i]._cloneCount = 1;
		} else {
			validateData[i]._cloneCount++;
		}

		//复制者的角色名，自已复制自已则的也是自已

		validateData[i]._cloner = validateData[i]._cloner || [];

		validateData[i]._cloner.push(this.config._roleId);

		//清空拥有者
		cloneData._owner = [];
		//添加数据原拥有者
		cloneData._holder = validateData[i]._owner;

		cloneDataArray.push(cloneData);
	}

	//只有一条数据时直接返回第一条数据，多条数据时返回数组对象
	if ($.type(data) != "array") {
		cloneDataArray = cloneDataArray[0];
	}

	if (callback) {
		callback(cloneDataArray, validateData, this);
	}

	//返回克隆的数据源
	return cloneDataArray;
}