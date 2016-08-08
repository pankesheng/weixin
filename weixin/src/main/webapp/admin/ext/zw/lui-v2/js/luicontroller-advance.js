/**
 * @class LUIControllerAdvance
 * @version 0.3.0
 * @author lisfan QQ@448182355 GIT@lisfan 
 * @createDate 04/12/2015
 * @requires jquery-1.11.3
 * @name 扩展插件基类-增强版
 * @markdown
 * 
 * 
 * 增强版与简易版的区别
 * html结构不同：^节点会有一个node-container包裹节点，还多了子节点内容dom，$简易版直接为node 
 * ^支持节点ajax加载，且异步请求状态提示会显示在节点位置
 * refreshNode时，部分内容会进行强制保留
 * 
 * $ selectAllNode 简易版也需要
 

* ## todo清单 
 * - 修改简易版，也使用node-container包裹
 * - 兼容简易版
 * - 编写测试用例方档和API文档
 * - 开启动态加载器enabledLoader:true,开启后不直接addNode进数据：加载的数据先放在某一位置
 * 		- 增加view.loaderType 加载方式：批量加载还是全部加载
 * 		- 增加view.loaderCount 逐一加载的数量
 * 		- 增加view.loaderAnimate 加载动画
 * 		- 独立出代码中的样式
 *    - ajax加载几W条数据时怎么处理（过多时自动开启加载模式，除非显示的指定为关闭）
 *   纯手动形式刷新refreshNode和refreshNodeData
 *   pidKey全部更换
 *   
 *   simpleMode//简易模式后就不会转换为复杂的数据结构，刷新数据等也不会进行大数据刷新
 *   check形式加载 check和select行为分开
 *   考虑将addNode和insertNode的功能作用分开
 *   checkNode
 *   checkAllNode
 *   cancelCheckedNode
 *   cleanCheckedNode
 *   getCheckedNode
 *   
 *   //更改名称逻辑
 *   cleanXXNode  表示移除节点
 *   cancelXXXXXNode 表示不选中节点
 *   更改state状态，一对多的关系
 *   一个节点可以处于多个状态
 *   分别使用selected checked expanded
 *   2个版本同时管理，但高版本可以优雅的使用简易版 v0.3
 * ## 心得
 * - 下一个插件书写时要考虑到（插件可能只是给自已用的，因此写的时候不要老想着容错，单一思维试试）
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
 * - 2016.02.14
 * 		- 基础代码从简易版拷贝
 * - 2016.02.15
 * 		- 扩充addNode功能，对于树列表增加点击节点再加载数据
 * - 2016.02.16
 * 		- 根据增强版的需要，扩充现有API功能
 * - 2016.02.17
 * 		- 扩展sortNode和filterNode
 * - 2016.02.18
 * 		- 增加getChildrenNode()和getSelectedChildrenNode()
 * 		- 更改方法调用refreshNode()刷新逻辑
 * - 2016.02.19
 * 		- 重构refreshNode，增加refreshNodeData,getParentNode(),getSiblingsNode()
 * - 2016.02.20
 * 		- 重构load()和异步加载提示的显示逻辑
 * - 2016.02.21
 * 		- 无法很好有效的为addNode数据加载（大量）提示的显示逻辑（放弃ing）
 * 		- 增加getAsyncNode()和getAsyncSelectedNode()，实现获取最近一次加载
 * - 2016.02.22
 * 		- 移除cleanNodeData()
 * 		- 修改部分方法逻辑
 * 		- 增加insertNode()，修改removeNode()和replaceNode()
 * - 2016.02.25
 * 		- 调整refreshNode()和refreshNodeData();
 * 		- 调整removeNodeData()和addNodeData()和replaceNodeData();
 *   
 * ## 测试用例
 * 
 * 
 * 
 * 异步加载后，删除部分节点后，使用getAsyncNode获取的节点对有包括被删除的部分节点，使用getAsyncData时也能完整获取
 * 
 * 
 */

/**
 * LUIControllerAdvance类，任何扩展插件均基于此，继承其方法和属性
 * @param {Object} setting 配置参数 ***是可选的，为空时仅实例化对象，生成基本的HTML结构，之后可调用实例方法***
 * @param {Function} callback 回调事件
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
var LUIControllerAdvance = function (setting, callback) {
	var me = this;
	//私有属性(状态)
	me._type = me._type || "luicontrolleradvance"; //类型，用于_filterArguments函数判断时得知实例化对象的具体类型名称
	me._version = me._version || "0.3.0";
	me._isInitStaticHtml = false; //初始化时，是否为静态页面提供数据节点
	me._isInitLoadComplete = false; //初始化，是否是已加载首批数据（初始化节点不刷新refreshNode节点）
	me._isLoadComplete = false; //是否已完成数据加 ，每次加载数据时均为重置为false，加载过程中会被设置为true
	me._asyncNode = []; //保存最后一次异步请求加载的数据节点
	me._selectedNode = []; //开启选中节点记忆池后，将在这里暂存选中节点
	me._orderCounter = 0; //内置排序序号计数器，该项会强制按照数据的加载顺序设置，对象方法不支持修改_orderid的值，同时用户也不要去改_orderid的值，要增加自定义排序时请重新命名一个排序字段排序分类
	//config里的配置是可以自定义覆盖，不是私有的
	me.config = {
		//插件ID：默认生成一个随机数值
		_roleId: Math.round(new Date().getMilliseconds() * Math.random() * 1000),
		//节点唯一ID计数器：唯一ID，我的农历生日~。~
		_uniqueId: 19890129,
		//是否为自定义配置：判断用户是否自定义了配置，用于判断插件扩展配置时为开发者初始定义，还是使用者定义。开发者自定初始定义时，需要手动的设置为false值，使用者自定义时会这里会自动设置为true
		//如果被依旧是被设置为false时，一般都只是更新了配置，未对数据做出变化
		_isUserDefined: false,
		//启用配置更新（不更新数据）
		_updateConfig: false,
		//选择器配置：一个选择器格式的字符串
		selector: null,
		//异步请求配置：常用配置项，使用者需要自定义配置更多ajax参数时，请使用ajaxSetup属性，注意：这会覆盖该配置下的其他已配置参数
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
			dataKey: "data",
			childrenKey: "children",
			idKey: "id",
			nameKey: "name",
			pIdKey: "pid"
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
		//显示配置
		view: {
			//节点样式
			nodeClass: "node ext-node",
			firstNodeClass: "ext-first-node",
			lastNodeClass: "ext-last-node",
			//启用控制区
			enabledControl: false, //默认关闭false
			//全局加载模式，如果使用方法load()时未明确指定加载模式，则使用全局载入模式参数，为true表示持续加载，false（默认）表示覆盖加载
			//覆盖加载模式(false)且选中记忆池未开启时，会重置config._selectedNode为空数组
			loadMode: false, //默认关闭false
			//AJAX状态提示类型：0无提示，1图片形式，其他值为文字形式(默认行式),支持回调事件(return返回html格式)，包含一个参数，代表ajax请求状态textStatus
			asyncStatusTipType: 2,
			enabledSelectMode: true, //启用高亮选择模式，默认开启，关闭后选择事件失效，但不会影响调用如selectNode()方法
			//启用异选中记忆池后，会将选中的节点对明放入config._selectedNode里，即使后续使用load()重载内容后也不会将已选中的数据丢失
			//重载数据后，还会判断节点是否已存在于config._selectedNode里，若已存在，则将节点选中，同时config._selectedNode对应位置的节点指向新节点//todo
			//默认非开启状态下，且#非load(setting,true)#持续加载模式下，都会重置config._selectedCache为空数组，一般异步请求数据时需要开启
			enabledSelectedMemory: false, //启用选中记忆池，默认关闭false
			enabledMultiple: false, //开启多选，默认关闭false
			enabledCheckMode: false, //开启勾选模式，默认关闭false
			selectIsCheck: true, //开启选择即勾选模式，默认开启true
			enabledSwitcher: true, //开启折叠开关器，默认开启true
			enabledDblClickExpand: true, //开启双击展开节点，默认开启true,若开启双击展开模式，建议关闭选择模式，避免视觉上产生冲突
			expandSpeed: "normal", //展开速度一个毫秒数，还有内置的速度字符串"fast","slow","normal",0表示无动画效果
			showLine: false, //显示层级线//TODO
			autoRefresh: true, //开启自动刷新节点（针对节点操作），默认关闭//数据量多时，建议关闭，手动刷新节点
			refreshType: 1, //刷新方式（未开放），惰性刷新，延迟刷新，全部刷新
			simpleData: false, //启用简易数据格式，默认关闭
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
			/*
			//异步请求之前回调事件
			asyncBeforeSend: function (jqXHR, ajaxSetup) {

			},
			//异步请求失败回调事件
			asyncError: function (jqXHR, textStatus, errorMsg) {

			},
			//异步请求数据过滤回调事件
			asyncDataFilter: function (data, dataType) {

			},
			//异步请求成功回调事件
			asyncSuccess: function (data, textStatus, jqXHR) {

			},
			//异步请求完成后（无论加载成功还是失败）回调事件
			asyncComplete: function (jqXHR, textStatus) {

			},

			//配置参数回调事件，与loadCallback回调的区别在于
			//configCallback是在*数据初始化前*的最后一次配置参数变更，这里的事件回调应该只是对配置参数的变化，
			//而loadCallback是*数据初始化完成后*的最后一次回调执行
			configCallback: function (config, obj) {

			},

			//页面载入成功回调事件，在数据初始化完成后执行
			loadCallback: function ($addNode, obj) {

			},
			
			//每个节点生成时的回调事件
			//区别与节点格式化回调事件nodeFormater,nodeFormater必须返回的是一个带有HTML格式的字符串
			nodeCallback: function ($currentNode, currentData, obj) {
			},
			
			//控制区回调
			controlCallback: function (obj) {
				
			},
			
			//点击节点事件
			clickNode: function ($currentNode, currentData, obj) {

			}
			
			//节点选中之前回调（只支持通过selectNode方法触发）
			nodeBeforeSelected: function ($currentNode, currentData, obj) {

			},
			
			//节点选中回调（只支持通过selectNode方法触发）
			nodeSelect: function ($currentNode, currentData, obj) {

			},
			
			//节点取消选中之前回调（只支持通过cancelSelectedNode方法触发）

			nodeBeforeCancelSelected: function ($currentNode, currentData, obj) {

			},
			//节点取消选中回调（只支持通过cancelSelectedNode方法触发）

			nodeCancelSelected: function ($currentNode, currentData, obj) {

			},

			//勾选节点事件
			checkNode: function ($currentChecker, $currentNode, currentData, obj) {

			},

			//节点勾选事件
			nodeCheck: function ($currentChecker, $currentNode, currentData, obj) {

			},
			
			//节点勾选之前回调
			nodeBeforeChecked: function ($currentChecker, $currentNode, currentData, obj) {

			},

			//节点取消勾选之前回调
			nodeBeforeCancelChecked: function ($currentChecker, $currentNode, currentData, obj) {

			},

			//节点取消勾选前回调
			nodeCancelCheck: function ($currentChecker, $currentNode, currentData, obj) {

			},

			//节点展开回调
			expandNode: function ($currentSwitcher, $currentNode, currentData, obj) {

			}
			
			//节点展开之前回调
			nodeBeforeExpanded: function ($currentSwitcher, $currentNode, currentData, obj) {

			},

			//节点展开回调
			nodeExpand: function ($currentSwitcher, $currentNode, currentData, obj) {

			},

			//节点取消展开之前回调
			nodeBeforeCancelExpanded: function ($currentSwitcher, $currentNode, currentData, obj) {

			},
			//节点取消展开回调
			nodeCancelExpanded: function ($currentSwitcher, $currentNode, currentData, obj) {

			}*/
		},
		//默认事件动作
		action: {
			//初始化节点选中状态
			initSelectedNode: function (obj) {
				//如果不支持选持模式，则直接退出
				if (!obj.config.view.enabledSelectMode) {
					return;
				}

				//初始化选中状态，如果单选模式，又配置了多个选中状态，则只选中第一个选中的节点
				if (obj.config.view.enabledMultiple) {
					//多选
					var $getNode = obj.getSelectedNode();
					var multiplesize;
					if ($.type(obj.config.view.multipleSize) == "number" && obj.config.view.multipleSize > 1) {
						multiplesize = obj.config.view.multipleSize;
					};

					if (multiplesize) {
						//todo 换成slice的方法
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
				//如果不支持选持模式，则直接退出
				if (!obj.config.view.enabledSelectMode) {
					return;
				}

				if (!obj.config.view.enabledMultiple) {
					//单选模式
					if (currentData.state == "selected") {
						obj.cleanSelectedNode();
						//obj.cancelSelectedNode($currentNode);
					} else {
						//选中事件
						obj.cleanSelectedNode();
						obj.selectNode($currentNode);
					}
				} else {
					//多选
					if (currentData.state == "selected") {
						obj.cancelSelectedNode($currentNode);
					} else {
						var multiplesize = null;
						if ($.type(obj.config.view.multipleSize) == "number" && obj.config.view.multipleSize > 1) {
							multiplesize = obj.config.view.multipleSize;
						}
						if (!multiplesize || multiplesize > obj.getSelectedNode().length) {
							//弹框选中
							obj.selectNode($currentNode);
						}
					}
				}
			},
			expandNode: function ($currentSwitcher, $currentNode, currentData, obj) {
				//如果展开的是一个异步请求地址，则请求数据后展开
				//这个节点的请求正在请中且未请求加载过数据的，将发送请求
				if ($.type(currentData.children) == "string" && currentData.isAsyncing == false && currentData.isAsyncLoaded == false) {
					if (currentData.expand === true) {
						//如果请求节点是打开状态的，则先将其置为false
						me.replaceNodeData($currentNode, "expand", false);
					}
					obj.load(currentData.children, true, $currentNode);
					//循环计时器：异步请求加载完毕后，再展开节点，否则循环检测
					currentData.interval = setInterval(function () {
						//找到该节点的子节点包裹对象
						if (currentData.isAsyncLoaded == true) {
							clearInterval(currentData.interval);
							_switcher($currentSwitcher, $currentNode, currentData, obj);
						}
					}, 100);
				} else {
					//正常的载入情求
					_switcher($currentSwitcher, $currentNode, currentData, obj);
				}

				function _switcher($currentSwitcher, $currentNode, currentData, obj) {
					//查看当前节点是否是展开的
					if (currentData.expand === true) {
						obj.cancelExpandedNode($currentNode, true);
					} else {
						obj.expandNode($currentNode, true);
					}
				}
			},
			checkNode: function ($currentchecker, $currentNode, currentData, obj) {
				//TODO
			}
		}
	};
	//私有路由
	me._router = {

	};
	me._asyncLoader = {
		_create: function ($contextNode) {
			//异步请求提示信息区DOM
			//如果指定了$contextNode，则以目标节点位置设置为异步请求信息
			var $asyncContent;
			if ($contextNode && me.getNodeById($contextNode).length > 0) {
				var $targetNode = me.getNodeById($contextNode);
				var targetData = me.getDataById($targetNode);
				targetData.isAsyncing = true;
				$asyncContent = $targetNode;
			} else {
				$asyncContent = me.$content;
			}
			return $asyncContent.append("<span class='ext-async-loader' data-role='async-loader'></span>").find("[data-role='async-loader']");
		},
		_showTips: function (status, $asyncLoader) {
			switch (status) {
			case "nodata":
				if (me.config.asyncStatusTipType === 0) {
					//无提示
				} else if ($.type(me.config.view.asyncStatusTipType) === "function") {
					var asyncTipHtml = me.config.view.asyncStatusTipType("nodata");
					$asyncLoader.html(asyncTipHtml);
				} else {
					$asyncLoader.html("<span class='error'>暂无数据</span>");
				}
				break;
			case "success":
				if (me.config.view.asyncStatusTipType === 0) {
					//无提示
				} else if (me.config.view.asyncStatusTipType === 1) {
					$asyncLoader.html("<span class='ani-loading'></span>");
				} else if ($.type(me.config.view.asyncStatusTipType) === "function") {
					var asyncTipHtml = me.config.view.asyncStatusTipType("success");
					$asyncLoader.html(asyncTipHtml);
				} else {
					$asyncLoader.html("<span class='loading'>数据加载中，请稍候...</span>");
				}
				break;
			case "error":
				if (me.config.asyncStatusTipType === 0) {
					//无提示
				} else if ($.type(me.config.view.asyncStatusTipType) === "function") {
					var asyncTipHtml = me.config.view.asyncStatusTipType("error");
					$asyncLoader.html(asyncTipHtml);
				} else {
					$asyncLoader.html("<span class='error'>数据加载失败，请联系管理员。</span>");
				}
				break;
			case "timeout":
				if (me.config.asyncStatusTipType === 0) {
					//无提示
				} else if ($.type(me.config.view.asyncStatusTipType) === "function") {
					var asyncTipHtml = me.config.view.asyncStatusTipType("timeout");
					$asyncLoader.html(asyncTipHtml);
				} else {
					$asyncLoader.html("<span class='error'>数据加载超时，请重新刷新页面。</span>");
				}
				break;
			default:
				break;
			}
		},
		_remove: function ($contextNode) {
			//数据载入提示移除
			var $asyncContent;
			var $asyncLoader;
			if ($contextNode && me.getNodeById($contextNode).length > 0) {
				var $targetNode = me.getNodeById($contextNode);
				$asyncContent = $targetNode;
			} else {
				$asyncContent = me.$content;
			}

			$asyncLoader = $asyncContent.find("[data-role='async-loader']");
			$asyncLoader.remove();
		}
	};
	me._noder = {
		//首次加载节点不递归
		//创建节点：分离其中的数据，与创建操作 Noder创建节点与创建节点子内容
		_createNode: function (data, addMode) {
			//不清楚子节点中的数据格式是否符合要求，所以也需要验证
			var validateData = _validateData(data);

			//加载数据标记重置
			//数据加载是否已完成，每当加载数据时设置为已完成true，如遇子数据再设置为false未完成，等待下一次处理
			me._isLoadComplete = true;

			//检测要增加的数据ID 是否已存在于当前节点中，若已存在则不创建
			var allId = _dataToArray(me.getAllData("id"));

			//增加项临时缓存区
			var $addNodeCache = $("<div/>");

			for (var i = 0; i < validateData.length; i++) {
				var currentData = validateData[i];
				//如果当前数据源ID已存在于节点中，则不增加（也不作更新数据操作，因此使用者要清楚的知道自已是在addNode操作还是replaceNode操作
				if ($.inArray(currentData.id, allId) > -1) continue;

				var $addNode;
				//根据nodeFormater函数格式化节点
				if (me.config.view.nodeFormater && $.type(me.config.view.nodeFormater) == "function") {
					$addNode = $(me.config.view.nodeFormater(currentData, me._orderCounter));
				} else {
					//默认格式:输出name值
					$addNode = $('<div>' + currentData.name + '</div>');
				}

				//设置节点样式
				$addNode.addClass(me.config.view.nodeClass);

				if (currentData.isFirstNode) {
					$addNode.addClass(me.config.view.firstNodeClass);
				}

				if (currentData.isLastNode) {
					$addNode.addClass(me.config.view.lastNodeClass);
				}

				//保存数据
				$addNode.data("data", currentData);

				//增强版设置属性（必须）
				$addNode.attr("data-level", currentData.level);
				//$addNode.attr("data-pid", currentData.pId);
				$addNode.addClass("ext-node-" + currentData.level);

				//设置节点的HTML属性：ID（必须）、排序号、索引序号、角色名（必须）和初始样式
				$addNode.attr("data-role", "node");
				$addNode.attr("data-id", currentData.id);
				$addNode.attr("data-orderid", currentData._orderId);
				$addNode.attr("data-index", i);
				$addNode.attr("data-pid", currentData.pId);

				//缓存区暂存新增节点
				$addNodeCache.append($addNode);
				//最后，对node进行一个包裹
				var $nodeContainer = $("<div class='ext-node-container' data-role='node-container' />");
				//$nodeContainer.attr("data-pid", currentData.pId);
				$addNode.wrap($nodeContainer);

				//节点创建成功后的回调(还未附加到实际DOM里)
				if (me.config.callback.nodeCallback && $.type(me.config.callback.nodeCallback) == "function") {
					me.config.callback.nodeCallback($addNode, me.getDataById($addNode), me);
				}

				//更新节点状态信息：
				if (currentData.state) {
					me.setNodeState($addNode, currentData.state);
				}
				//根据加工模式决定是否加载子节点
				if (addMode) {
					//如果存在子节点(检测length，不检测hasChild)，说明加载未全部完成，需要递归继续加载
					if (currentData.length > 0) {
						me._isLoadComplete = false;
					}
					if (currentData.hasChild) {
						var $childContent = me._noder._createChildContent($addNode, currentData);
						me._switcher._createSwitcher($addNode, currentData);

						//如果是首次加载，则不递归创建子节点，以便快速显示出基础结构，之后加载时，可以再直接显示节点信息
						if (me._isInitLoadComplete === true) {
							//子节点对象为json地址时，不触发递归
							//递归
							if (currentData.length > 0) {
								$childContent.append(this._createNode(currentData.children, addMode));
							}
						}
					}
				}
			}
			//返回的是包含node-container的节点格式
			return $addNodeCache.children();
		},
		//在节点后方创建子节点内容区DOM
		_createChildContent: function ($node, nodeData) {
			//查找当前节点的$childContent和$switcher是否已存在，如不存在则创建
			//var $childContent = me.$content.find("[data-role='child-content']").filter("[data-pid='" + nodeData.id + "']");
			var $childContent = me._noder._getNodeChildContent($node);

			var $targetContent;
			if ($childContent.length <= 0) {
				$targetContent = $("<div/>");
				//检测是否包含有子节点
				$targetContent.addClass("ext-child-content ext-content-" + (nodeData.level + 1));
				$targetContent.attr("data-role", "child-content");
				$targetContent.attr("data-pid", nodeData.id);
				me._noder._getNodeContainer($node).after($targetContent);
				//设置打开状态：不是一个异步地址，且expand为true
				if (nodeData.expand === true && nodeData.length > 0) {
					$targetContent.addClass("active");
				}
			}

			return $targetContent;
		},
		//通过节点取得节点包裹对象
		_getNodeContainer: function ($node) {
			return $node.closest("[data-role='node-container']");
		},
		//通过节点取得包裹该节点的子内容节点对象
		_getTopChildContent: function ($node) {
			return $node.closest("[data-role='child-content']");
		},
		//取得所属指定节点的子内容节点对象
		_getNodeChildContent: function ($node) {
			var childContentString = "";
			for (var i = 0; i < $node.length; i++) {
				var nodeData = me.getDataById($node.eq(i));
				childContentString += '[data-role="child-content"][data-pid="' + nodeData.id + '"],';
			}
			var $childContent = me.$content.find(childContentString.slice(0, -1));
			return $childContent;
		},
		//通过节点取得展开对象
		//展开节点
		_expandNode: function ($node) {
			//节点打开状态需要将
		}
	};

	me._checker = {

	};
	me._switcher = {
		//创建子节点内容区DOM
		_createSwitcher: function ($node, nodeData) {
			//启用，则创建，否则不创建
			if (me.config.view.enabledSwitcher) {
				var $switcher = me._switcher._getSwitcher($node);

				if ($switcher.length <= 0) {
					var $switcher = $("<span/>");
					$switcher.addClass("ext-switcher ext-switcher-" + nodeData.level);
					$switcher.attr("data-role", "switcher");
					$node.after($switcher);
					//设置打开状态：不是一个异步地址，且expand为true
					if (nodeData.expand === true && nodeData.length > 0) {
						$switcher.addClass("active");
					}
				}
				return $switcher;
			}
		},
		_getSwitcher: function ($node) {
			return me._noder._getNodeContainer($node).find("[data-role='switcher']");
		}
	};
	me._selector = {};

	if (setting) {
		//非继承
		me.load(setting, callback)
	}
};

/**
 * 通过setting初始化配置的各项设置，按要求载入数据
 * @param   {PlainObject||String||Array} setting 自定义配置参数，当有传入配置参数时会根据自定义项初始化（自定义性强），也可以直接传入异步请求地址（会按照默认异步方式处理）,还可以直接传入数据数组对象
 * @param   {Boolean} loadMode 加载模式，false（默认）时为替换式加载模式，会清除内容区的节点数据（不删除其他内容），true时为持续式加载模式，新加载的内容会附加到内容区末尾
 * @param   {JQObject} $contextNode 目标节点，数据附加的目标子节点内容区：为了便于统一使用习惯，增强版涉及到$contextNode的地方，均只接受JQ节点对象，不再接受字符串等类型
 * @param   {Function}   callback 回调事件
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIControllerAdvance.prototype.load = function (setting, loadMode, $contextNode, callback) {
	var filterArgs = _filterArguments(arguments, [["plainobject", "string", "array"], "boolean", "jqobject", "function"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIControllerAdvance.prototype.load(setting, loadMode, $contextNode, callback)";
		log(errorText, "color:#f00");
		return false;
	}

	setting = filterArgs[0];
	loadMode = filterArgs[1] !== undefined ? filterArgs[1] : this.config.view.loadMode;
	$contextNode = filterArgs[2];
	callback = filterArgs[3];

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
		//扩展插件覆盖LUIControllerAdvance的默认配置
		me.config = $.extend(true, me.config, setting);
	}

	//初始化：生成插件基本结构$me,$content,$control

	me.$me = $(me.config.selector).eq(0);
	me._selector = me.config.selector;

	//判断选择器是否正确且存在
	if (!me._selector) {
		var errorText = "%c" + me._type + me.config._roleId + " 初始化未指定选择器，请检查";
		log(errorText, "color:#f00");
		return false;
	} else if (me.$me.length <= 0) {
		var errorText = "%c" + me._type + me.config._roleId + " 初始化所需的选择器 " + me._selector + " 元素不存在，请检查";
		log(errorText, "color:#f00");
		return false;
	}

	var $addNode;

	//内容区和控制区DOM不管如何，都必须在初始化时生成
	//内容区Dom
	//假如已存在内容区DOM(格式要求需要符合格式)，则不再生成
	//弊端：无法初始化默认绑定的数据，适用于不进行复杂数据操作的情况下使用
	if (me.$me.find('[data-role="content"]').length > 0) {
		//静态结构
		me.$content = me.$me.find('[data-role="content"]');
		me._isInitStaticHtml = false;
	} else {
		//不存在，生成附加至$me
		me.$content = $('<div class="ext-content content clearfix clear" data-role="content"></div>');
		me.$me.append(me.$content);
	}

	//控制区Dom
	//默认关闭，若开启，需要设置enabledControl=true
	//假如已存在控制区DOM(格式要求需要符合格式)，则不再生成
	//del 假如未使用自定义setting配置，且已存在html元素（格式需要符合要求），并且自定义格式化里没有自定义配置项
	if (me.$me.find('[data-role="control"]').length > 0) {
		//若控制器已存在，且控制器可见，则不生成，直接使用现成的
		me.$control = me.$me.find('[data-role="control"]');
	} else {
		//不存在，则生成
		me.$control = $('<div class="ext-control control clearfix clear" data-role="control"></div>');
		me.$content.before(me.$control);
	}

	//初始化请求数据
	//如果是异步请求
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

		var $asyncLoader;
		//异步请求发送请求之前
		ajaxSetup.beforeSend = function (jqXHR, ajaxSetup) {
			//创建异步请求DOM

			$asyncLoader = me._asyncLoader._create($contextNode);

			//自定义异步请求前回调事件
			if (me.config.callback.asyncBeforeSend && $.type(me.config.callback.asyncBeforeSend) == "function") {
				me.config.callback.asyncBeforeSend(jqXHR, ajaxSetup);
			}
		}

		//异步请求失败
		ajaxSetup.error = function (jqXHR, textStatus, errorMsg) {
			//异步失败错误提示
			if (textStatus == "timeout") {
				me._asyncLoader._showTips("timeout", $asyncLoader);
			} else {
				me._asyncLoader._showTips("error", $asyncLoader);
			}

			//打印日志
			log("%c错误状态：" + textStatus + "，错误文本：" + errorMsg, "color:#f00");

			//自定义异步请求失败回调事件
			if (me.config.callback.asyncError && $.type(me.config.callback.asyncError) == "function") {
				me.config.callback.asyncError(jqXHR, textStatus, errorMsg);
			}
		}

		//异步请求成功后的数据处理
		ajaxSetup.dataFilter = function (data, dataType) {
			if (me.config.callback.asyncDataFilter && $.type(me.config.callback.asyncDataFilter) == "function") {
				me.config.callback.asyncDataFilter(data, dataType);
			}

			return data;
		}

		//异步请求成功
		ajaxSetup.success = function (data, textStatus, jqXHR) {
			//自定义异步请求成功回调事件
			if (me.config.callback.asyncSuccess && $.type(me.config.callback.asyncSuccess) == "function") {
				me.config.callback.asyncSuccess(data, textStatus, jqXHR);
			}
			//请求数据
			//接收到的data是setting配置，还是纯store数据源
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
			//自定义配置参数的最后一次更改回调事件
			//主要对data做最后一次的处理，以便传入_init初始化），data无法覆盖，需判断原参数setting没有传入data数据
			if (me.config.callback.configCallback && $.type(me.config.callback.configCallback) == "function") {
				me.config.callback.configCallback(me.config, me)
			}

			if (me.config.store[me.config.key.dataKey].length == 0) {
				me._asyncLoader._showTips("nodata", $asyncLoader);
				//请求无数据：不使用init方式更新，这样做能保留住无数据的提示
				//非持续加载方式时，还需清空数据
				if (!loadMode) {
					me.cleanNode();
					me.$content.empty();
				}
			} else {
				me._asyncLoader._showTips("success", $asyncLoader);

				setTimeout(function () {
					//在加载期间怎样给用户一个反馈
					me._asyncNode = me._init(me.config.store[me.config.key.dataKey], loadMode, $contextNode, callback);
				}, 50);
			}

		}

		//异步请求完成后（无论成功还是失败）
		ajaxSetup.complete = function (jqXHR, textStatus) {
			if (me.config.callback.asyncComplete && $.type(me.config.callback.asyncComplete) == "function") {
				me.config.callback.asyncComplete(jqXHR, textStatus);
			}
		}

		//发起异步请求
		$.ajax(me.config.async.url, ajaxSetup);
	} else {
		//静态数据载入
		//自定义配置参数的最后一次更改回调事件
		//主要对data做最后一次的处理，以便传入_init初始化），data无法覆盖，需判断原参数setting没有传入data数据
		if (me.config.callback.configCallback && $.type(me.config.callback.configCallback) == "function") {
			me.config.callback.configCallback(me.config, me)
		}
		$addNode = me._init(me.config.store[me.config.key.dataKey], loadMode, $contextNode, callback);

		//返回当前对象
		return $addNode;
	}
}

/**
 * 初始化数据
 * 若在HTML页面中已存在即有的元素（格式上需要符合要求，数据以data-*绑定），且参数中也没有传入data，就会以此HTML作为原数据(这种情况适用于一些简单数据结构)
 * 对于data数据中一般要求存在id和name两个字段，若不存在id字段则按序号生成id（因此要注意ID不要与存在id的数据冲突），若不存在name字段，则使用id的内容
 * @param   {Array} data  初始化数据源，以此为基础继承的插件均会传入setting配置，也可以直接传入数组对象格式数据源，也可以传入url，默认get方法
 * @param   {JQObject} $contextNode 目标节点，为了便于统一使用习惯，增强版涉及到$contextNode的地方，均只接受JQ节点对象，不再接受字符串等类型
 * @param   {Boolean} loadMode 加载模式，false（默认）时为替换式加载模式，会清除内容区的节点数据（不删除其他内容），true时为持续式加载模式，新加载的内容会附加到内容区末尾
 * @param   {Function}  callback 回调事件
 * @returns {JQObject}  若有传入数据源，则返回生成的jQ节点对象，若直接是html形式的数据源，则返回页面中已存在的jq节点对象
 */
LUIControllerAdvance.prototype._init = function (data, loadMode, $contextNode, callback) {
	var filterArgs = _filterArguments(arguments, ["array", "boolean", "jqobject", "function"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIControllerAdvance.prototype._init(data, loadMode, $contextNode, callback)";
		log(errorText, "color:#f00");
		return false;
	}

	data = filterArgs[0] !== undefined ? filterArgs[0] : [];
	loadMode = filterArgs[1] !== undefined ? filterArgs[1] : this.config.view.loadMode;
	$contextNode = filterArgs[2];
	callback = filterArgs[3];

	var me = this;
	var validateData = _validateData(data);
	var $addNode = [];
	//如果是仅更新配置标记为true,则不更新数据（可能因为不同场景再次进行了配置）
	if (!me.config._updateConfig) {
		if (validateData.length > 0) {

			//有新数据时，按照validateData数据生成
			if (!loadMode) {
				//非持续加载数据模式
				//清空所有原数据
				me.cleanNode();
				me.$content.empty();
			}

			//若开启选中记忆池，则不清空全局已选中数据源
			//加载了新的数据后，要判断新加载的数据源是否已存在于节点记忆池中
			if (me.config.view.enabledSelectedMemory) {
				$addNode = me.addNode(validateData, $contextNode, callback);

				//若已存在则当前项需要高亮选中
				//筛选出选中的ID
				var selectedId = _dataToArray(me.getSelectedData("id"));

				var addId = _dataToArray(me.getDataById($addNode, "id"));
				for (var i = 0; i < addId.length; i++) {
					var index = $.inArray(addId[i], selectedId);
					//若存在，则选中节点，且指向这个新节点
					if (index >= 0) {
						var $getNode = me.getNodeById(addId[i]);
						me.selectNode($getNode);
						me._selectedNode[index] = $getNode;
					}
				}

			} else {
				//未开启节点记忆池功能，清空全局已选中数据源
				me._selectedNode = [];
				//数据源可能为空
				//用户配置时不需要加载数据
				$addNode = me.addNode(validateData, $contextNode, callback);
			}
		} else if (validateData.length == 0 && me._isInitStaticHtml === true) {
			//数据项为0且是已经进行过静态页面数据初始化，说明第二次以上传入的数据项为0
			if (!loadMode) {
				me.cleanNode();
				me.$content.empty();
			}
			if (!me.config.view.enabledSelectedMemory) {
				me._selectedNode = [];
			}
			//清空所有数据
		} else if (me.config._isUserDefined && validateData.length == 0 && me._isInitStaticHtml === false) {
			//数据项为0且是静态页面数据初始化
			me._isInitStaticHtml = true;

			$addNode = me.getAllNode();

			//将HTML上的属性数据进行存储，以备调用
			//首先缓存data-*，id，name和image
			for (var i = 0; i < $addNode.length; i++) {
				//对每一个对象缓存数据
				//置空
				$addNode.eq(i).data("data", {});
				var $currentNode = $addNode.eq(i);
				var currentData = $currentNode.data("data");

				//缓存节点的data-*数据，不缓存orderid和index，该2项为自动生成
				for (var key in $currentNode.data()) {
					if (key != "data" && key != "orderid" && key != "index") {
						currentData[key] = $currentNode.data()[key];
					}
				}

				//手动更新index和orderid TODO 还更了哪些数据

				//如果节点存在图片，缓存图片地址
				if ($currentNode.find("img").attr("src")) {
					currentData.image = $currentNode.find("img").attr("src");
				}

				//如果节点存在文本
				if ($currentNode.text()) {
					currentData.name = $currentNode.text()
				}

				//如果节点存在id且data-id不存在时，使用id属性，否则随机生成
				if (!$currentNode.attr("data-id") && $currentNode.attr("id")) {
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

			if (callback) {
				callback($addNode, this);
			}
		}
	} else {
		me.config._updateConfig = false;
	}

	//设置默认侦听事件
	me.$content.undelegate("[data-role='node']", "click._default");

	//默认选项点击事件(无)
	me.$content.delegate("[data-role='node']", "click._default", function (event) {
		//自定义点击事件
		stopPropagation(event);
		if (me.config.callback.clickNode && $.type(me.config.callback.clickNode) == "function") {
			me.config.callback.clickNode($(this), me.getDataById($(this)), me);
		}
	});

	//启用双击展开
	if (me.config.view.enabledDblClickExpand) {
		//双击展开事件
		me.$content.undelegate("[data-role='node']", "dblclick._default");
		//默认选项点击事件(无)
		me.$content.delegate("[data-role='node']", "dblclick._default", function (event) {
			//自定义点击事件
			stopPropagation(event);
			if (me.config.callback.expandNode && $.type(me.config.callback.expandNode) == "function") {
				var $currentNode = $(this);
				var $currentSwitcher = $(this).siblings("[data-role='switcher']");
				me.config.callback.expandNode($currentSwitcher, $currentNode, me.getDataById($currentNode), me);
			}
		});
	}

	//启用展开标记
	if (me.config.view.enabledSwitcher) {
		//默认节点展开事件
		me.$content.undelegate("[data-role='switcher']", "click._default");
		me.$content.delegate("[data-role='switcher']", "click._default", function (event) {
			//阻止冒泡
			stopPropagation(event);
			if (me.config.callback.expandNode && $.type(me.config.callback.expandNode) == "function") {
				var $currentSwitcher = $(this);
				var $currentNode = $(this).siblings("[data-role='node']");
				me.config.callback.expandNode($currentSwitcher, $currentNode, me.getDataById($currentNode), me);
			}
		});
	}

	//启用控制区
	if (me.config.view.enabledControl) {
		me.$control.empty();
		//控制区格式化回调
		if (me.config.callback.controlFormater && $.type(me.config.callback.controlFormater) == "function") {
			//先清空
			var controlHtml = me.config.view.controlFormater();
			me.$control.append(controlHtml);
		}

		//控制区回调
		if (me.config.callback.controlCallback && $.type(me.config.callback.controlCallback) == "function") {
			//存在控制器回调时执行
			me.config.callback.controlCallback(me.$control, me);
		}
	}

	//全局加载回调
	if (me.config.callback.loadCallback && $.type(me.config.callback.loadCallback) == "function") {
		me.config.callback.loadCallback($addNode, me);
	}

	//返回增加的对象
	return $addNode;
}


/**
 * 根据数据源加载节点
 * 1.根据数据源增加节点，不支持直接附加JQ节点对象
 * 2.当添加的数据源具有相同ID时，添加不成功
 * 2.通过nodeFormater格式化节点的格式，节点数据生成之后，都会执行一次nodeCallback回调
 * @param   {PlainObject||Array} data     数据源可以是直接健/值对的原生对象格式，也可以是多项健/值对的数组对象
 * @param   {Number||String||Array||JQObject} $contextNode ID字符串 | 数组ID字符串 | JQ节点对象，数据加载时的目标位置，默认在顶层后面加载
 * @param   {Boolean} addMode 加载模式 true（默认）是表示加载子节点数据，false表示不加载子节点数据
 * @param   {Number} index  附加位置，正整数
 * @param   {Function} callback 回调事件
 * @returns {JQObject} 返回增加的的JQ节点对象
 */
LUIControllerAdvance.prototype.addNode = function (data, $contextNode, addMode, index, callback) {
	var filterArgs = _filterArguments(arguments, [["plainobject", "array"], "jqobject", "boolean", "number", "function"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIControllerAdvance.prototype.addNode(data, $contextNode, index, callback)";
		log(errorText, "color:#f00");
		return false;
	}

	data = filterArgs[0];
	$contextNode = filterArgs[1];
	addMode = filterArgs[2] !== undefined ? filterArgs[2] : true;
	index = filterArgs[3];
	callback = filterArgs[4];

	var me = this;
	var validateData = _validateData(data);

	//无论是否指定了目标节点
	//都需要初始化数据
	//如果有目标就向目标节点增加，没有目标节点就向根节点增加
	//第一次初始化进来加载目标一定是根节点
	//之后的后续加载可能是根节点也可能是目标节点
	//用isInitLoadComplete来判断是初始化加载还是后续加载
	var $addNodeArray;
	if (me._isInitLoadComplete === false) {
		//首次加载未完成（第一次load加载）
		//首次加载节点时先加载数据结构的第一层，以便在页面中快速显示出实际DOM结构，之后再递归显示之后的层级数据
		//转换为复杂数据结构
		_transformData(validateData);
		me.$content.append(me._noder._createNode(validateData, addMode));
		//首次加载数据完成
		me._isInitLoadComplete = true;
		//开启子节点加载模式
		//如果数据未全部加载完毕，则启动后续加载
		if (!me._isLoadComplete) {
			for (var i = 0; i < validateData.length; i++) {
				//当前层有子节点，且子节点是一个静态数据源且长度大于0（即非ajax地址，ajax地址为点击请求载入）
				if (validateData[i].length > 0 && validateData[i].children && $.type(validateData[i].children) == "array") {
					//向对应的节点内容区DOM附加节点
					//me.$content.find("[data-role='child-content']").filter("[data-pid='" + validateData[i].id + "']").append(me._noder._createNode(validateData[i].children));
					me.$content.find("[data-role='child-content']").filter("[data-pid='" + validateData[i].id + "']").append(me._noder._createNode(validateData[i].children, addMode));
				}
			}
		}
		$addNodeArray = me.getAllNode();

		if (callback) {
			callback($addNodeArray, me);
		}
	} else {
		//非首次加载，后续加载
		//targetNode不存在时，直接加在最后面，查找不到的则不添加
		var $targetContent;
		var $targetChildrenNode;
		var $addNodeCache;

		//目标节点ID存在，且节点存在于DOM中，则按要求添加，否则添加到根节点
		if ($contextNode && $contextNode.length > 0) {
			var $targetNode = $contextNode;
			var targetData = this.getDataById($targetNode);
			//检测目标节点ID存在，准备添加到指定位置
			//DEL 优先为目标节点设置子节点数量，无法这样做：因为你不知道目标节点是否已经存在其他子节点
			//假如要添加位置的目标节点存在，则将目标节点的level值，优先赋值
			//能直接确定jq节点对象之关系的数据，直接进行设置，比如优先设置层级level和父节点pId
			for (var i = 0; i < validateData.length; i++) {
				validateData[i].level = targetData.level + 1;
				validateData[i].pId = targetData.id;
			}

			//查找目标节点内容区DOM
			$targetContent = this._noder._getNodeChildContent($targetNode);
			//若不存在，则创建（排除提前创建全部节点内容区的想法：避免HTML无用内容过多）
			//目标节点内容区不存在，且存在数据项时
			if ($targetContent.length <= 0 && validateData.length > 0) {
				$targetContent = me._noder._createChildContent($targetNode, targetData);
				me._switcher._createSwitcher($targetNode, targetData);
			}
			//获取目标节点的直接子节点对象
			$targetChildrenNode = me.getChildrenNode($targetNode, true);

			//如果是异步请求状态，_isAsyncLoadComplete就会是false
			//插入完毕后，更新一批节点数据
			if (targetData.isAsyncing) {
				targetData.isAsyncing = false;
				targetData.isAsyncLoaded = true;
			}
		} else {
			//目标节点不存在，新增节点添加到最末尾
			//假如要添加位置的目标节点存在，则将目标节点的level值，优先赋值?
			for (var i = 0; i < validateData.length; i++) {
				validateData[i].level = 0;
				validateData[i].pId = null;
			}

			$targetContent = me.$content;
			$targetChildrenNode = this.getAllNode(0);
		}
		//转换为复杂数据结构
		_transformData(validateData);

		//结构都好了，创建节点，附加位置
		$addNodeCache = me._noder._createNode(validateData, addMode);

		$addNodeArray = $addNodeCache.find("[data-role='node']");

		//插入之前触发回调 TODO到底放哪里好
		if (callback) {
			callback($addNodeArray, me);
		}

		//插入到指定位置
		if (index >= 0 && index < $targetChildrenNode.length) {
			var $targetIndex = $targetChildrenNode.eq(index);
			me._switcher._getSwitcher($targetIndex).before($addNodeCache);
		} else {
			$targetContent.append($addNodeCache);
		}

		//刷新节点，再附加对象，del先附加节点，再刷新（先附加的话当数据量多时，能让用户先看到DOM显示）
		//首次加载不需要再刷新数据，后续加载成功时刷新数据
		//刷新延迟执行，避免数据量过多时造成卡顿
		if ($addNodeArray.length > 0) {
			//del 直接刷新节点的原因是：不先加载DOM，再延迟刷新节点数据，因为延迟刷新还是会阻断了用户的操作
			//需要先加载DOM，不然结构无法成立
			if (me.config.view.autoRefresh) {
				me.refreshNode($addNodeArray, true);
			}
		}
	}
	//清除异步提示
	me._asyncLoader._remove($contextNode);

	//返回增加的对象
	return $addNodeArray;

	//创建节点并为节点节点增加节点属性和html属性

	//转换数据格式（递归）
	function _transformData(data) {
		var filterArgs = _filterArguments(arguments, [["plainobject", "array"]], 1);

		//输出错误信息，快速定位错误
		if (filterArgs === false) {
			var errorText = "%cCommon._transformData(data)";
			log(errorText, "color:#f00");
			return false;
		}

		data = filterArgs[0];

		for (var i = 0; i < data.length; i++) {
			//基础数据
			//检查ID，若不存在则生成唯一ID，每次刷新页面都会随机一个（每次刷新不同）
			//ADD ID值存在，且是字符串或者数字格式，其他格式不受理
			if (!(data[i].id !== undefined && ($.type(data[i].id) == "string" || $.type(data[i].id) == "number"))) {
				//不存在id时随机指定，并存储到data[i]里
				data[i].id = me.config._roleId + "" + me.config._uniqueId++;
			}

			//必须有的属性值：检查name值，若不存在则沿用ID值
			if (!data[i].name) {
				data[i].name = data[i].id;
			}

			//再绑定其他数据：增加角色、拥有者、索引序号、内部排序号
			data[i]._role = "node";
			data[i]._orderId = me._orderCounter++;
			data[i].index = i;
			//增加数据拥有者属性
			data[i]._owner = data[i]._owner || [];
			data[i]._owner.push(me.config._roleId);

			//是否为简单数据结构
			if (!me.config.view.simpleData) {
				data[i].level = data[i].level || 0; //节点级别
				data[i].pId = data[i].level === 0 ? null : data[i].pId; //节点关联的父节点ID
				data[i].isRoot = data[i].level === 0 ? true : false; //是否为根节点
				data[i].hasParent = data[i].level === 0 ? false : true; //是否存在父节点
				data[i].expand = data[i].expand || false; //是否为展开状态（默认都为关闭）
				data[i].isAsyncing = false; //是否正在异步状态
				data[i].isAsyncLoaded = false; //子节点是否已加载，判断它决定是否重新加载异步连接
				data[i].isFirstNode = i == 0 ? true : false; //是否为首节点，增删改查数据后需要refreshNodeData
				data[i].isLastNode = (i + 1) == data.length ? true : false; //是否为末节点，增删改查数据后需要refreshNodeData

				//如存在子节点，且子节点是数据源数组，且长度大于0条
				if (data[i].children && $.type(data[i].children) == "array" && data[i].children.length > 0) {
					data[i].length = data[i].children.length;
					data[i].hasChild = true;
					//为每个子节点添加前置数据
					for (var j = 0; j < data[i].children.length; j++) {
						data[i].children[j].level = data[i].level + 1;
						data[i].children[j].pId = data[i].id;
					}
					//递归
					_transformData(data[i].children);
				} else if (data[i].children && $.type(data[i].children) == "string") {
					//如果子节点是一个异步请求地址
					data[i].length = 0;
					data[i].hasChild = true;
				} else {
					//如果不存在子节点，或者他的长度小于0或
					data[i].length = 0;
					data[i].hasChild = false;
				}
			}
		}
	}
}

/**
 * 移除整个对象
 * @returns {JQObject}  返回移除的jq对象
 */
LUIControllerAdvance.prototype.destory = function () {
	return this.$me.detach();
}

/**
 * 返回指定的JQ节点对象
 * @param   {Number||String||Array||JQObject} nodeId ID字符串 | 数组ID字符串 | JQ节点对象 
 * @param   {Number} filterLevel 筛选节点的级别
 * @param   {JQObject} $contextNode 筛选节点的级别的查找范围：为了便于统一使用习惯，增强版涉及到$contextNode的地方，均只接受JQ节点对象，不再接受字符串等类型
 * @returns {JQObject} 返回指定的JQ节点对象
 */
LUIControllerAdvance.prototype.getNodeById = function (nodeId, filterLevel, $contextNode) {
	var filterArgs = _filterArguments(arguments, [["number", "string", "array", "jqobject"], "number", "jqobject"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIControllerAdvance.prototype.getNodeById(nodeId, filterLevel, $contextNode)";
		log(errorText, "color:#f00");
		return false;
	}

	nodeId = filterArgs[0];
	filterLevel = filterArgs[1];
	$contextNode = filterArgs[2];

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

	//$getNode = filterLevel !== undefined ? $getNode.filter("[data-level='" + filterLevel + "']") : $getNode;
	//从数据层面上筛选符合要求的节点
	var $filterNode = [];

	if (filterLevel !== undefined) {
		for (var i = 0; i < $getNode.length; i++) {
			var $getNode = $getNode.eq(i);
			var getData = this.getDataById($getNode);

			if (getData.level === filterLevel) {
				//排除当前对象
				$filterNode.push($getNode);
			}
		}
		$getNode = this.getNodeById($filterNode);
	}

	//查找指定范围内的指定等级节点
	var childContentString = "";
	if ($contextNode !== undefined) {
		for (var i = 0; i < $contextNode.length; i++) {
			var targetData = this.getDataById($contextNode.eq(i));
			childContentString += '[data-role="child-content"][data-pid="' + targetData.id + '"],';
		}
		var $childContent = this.$content.find(childContentString.slice(0, -1));
		$getNode = $childContent.find($getNode);
	}

	//返回被查找到的对象
	return $getNode;
}

/**
 * 获取所有JQ节点对象
 * @param   {Number} filterLevel 筛选节点的级别
 * @param   {JQObject} $contextNode 筛选节点的级别的查找范围：为了便于统一使用习惯，增强版涉及到$contextNode的地方，均只接受JQ节点对象，不再接受字符串等类型
 * @returns {JQObject} 返回所有的JQ节点对象
 */
LUIControllerAdvance.prototype.getAllNode = function (filterLevel, $contextNode) {
	//过滤参数且重排理想结构
	var filterArgs = _filterArguments(arguments, ["number", "jqobject"]);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIControllerAdvance.prototype.getAllNode(filterLevel, $contextNode)";
		log(errorText, "color:#f00");
		return false;
	}

	filterLevel = filterArgs[0];
	$contextNode = filterArgs[1];

	var $allNode = this.$content.find('[data-role="node"]');
	var $filterNode = [];
	//$allNode = filterLevel !== undefined ? $allNode.filter("[data-level='" + filterLevel + "']") : $allNode;
	//从数据层面上筛选符合要求的节点
	if (filterLevel !== undefined) {
		for (var i = 0; i < $allNode.length; i++) {
			var $getNode = $allNode.eq(i);
			var getData = this.getDataById($getNode);

			if (getData.level === filterLevel) {
				//排除当前对象
				$filterNode.push($getNode);
			}
		}
		$allNode = this.getNodeById($filterNode);
	}

	//$allNode = $filterNode;
	//$allNode = filterLevel !== undefined ? $allNode.filter("[data-level='" + filterLevel + "']") : $allNode;

	var childContentString = "";
	if ($contextNode !== undefined) {
		for (var i = 0; i < $contextNode.length; i++) {
			var targetData = this.getDataById($contextNode.eq(i));
			childContentString += '[data-role="child-content"][data-pid="' + targetData.id + '"],';
		}
		var $childContent = this.$content.find(childContentString.slice(0, -1));
		$allNode = $childContent.find($allNode);
	}

	return $allNode;
}

/**
 * 获取选中的JQ节点对象
 * @param   {Number} filterLevel 筛选节点的级别
 * @param   {JQObject} $contextNode 筛选节点的级别的查找范围：为了便于统一使用习惯，增强版涉及到$contextNode的地方，均只接受JQ节点对象，不再接受字符串等类型
 * @param   {Boolean} selectedMode 选择模式，true时表示只（一定）选择当前页面中的所有选中节点，false(默认)时表示可能会从enabledSelectedMemory里查找选中节点
 * @returns {JQObject} 返回被选中的JQ节点对象
 */
LUIControllerAdvance.prototype.getSelectedNode = function (filterLevel, $contextNode, selectedMode) {
	var filterArgs = _filterArguments(arguments, ["number", "jqobject", "boolean", "function"]);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIControllerAdvance.prototype.getSelectedNode(filterLevel, $contextNode, selectedMode)";
		log(errorText, "color:#f00");
		return false;
	}

	filterLevel = filterArgs[0];
	$contextNode = filterArgs[1];
	selectedMode = filterArgs[2] !== undefined ? filterArgs[2] : false;

	var $selectedNode;

	if (selectedMode || !this.config.view.enabledSelectedMemory) {
		//未启用节点记忆池
		//从节点数据层获取选中状态节点
		var $allNode = this.getAllNode();
		var $node = [];
		for (var i = 0; i < $allNode.length; i++) {
			var $currentNode = $allNode.eq(i);
			var currentData = this.getDataById($currentNode);
			if (currentData.state == "selected") {
				$node.push($currentNode);
			}
		}
		$selectedNode = this.getNodeById($node);
	} else {
		$selectedNode = this.getNodeById(this._selectedNode);
	}

	//$selectedNode = filterLevel !== undefined ? $selectedNode.filter("[data-level='" + filterLevel + "']") : $selectedNode;
	var $filterNode = [];
	if (filterLevel !== undefined) {
		for (var i = 0; i < $selectedNode.length; i++) {
			var $getNode = $selectedNode.eq(i);
			var getData = this.getDataById($getNode);

			if (getData.level === filterLevel) {
				//排除当前对象
				$filterNode.push($getNode);
			}
		}
		$selectedNode = this.getNodeById($filterNode);
	}

	var childContentString = "";
	if ($contextNode !== undefined) {
		for (var i = 0; i < $contextNode.length; i++) {
			var targetData = this.getDataById($contextNode.eq(i));
			childContentString += '[data-role="child-content"][data-pid="' + targetData.id + '"],';
		}
		var $childContent = this.$content.find(childContentString.slice(0, -1));
		$selectedNode = $childContent.find($selectedNode);
	}

	return $selectedNode;
}

/**
 * 获取指定索引序号(html页面上*实际看见*的节点的序位)的JQ节点对象，索引位置从0开始
 * @param   {Number||Array} 索引序位 接受数字和纯数字形式字符串
 * @param   {Number} filterLevel 筛选节点的级别
 * @param   {JQObject} $contextNode 筛选节点的级别的查找范围：为了便于统一使用习惯，增强版涉及到$contextNode的地方，均只接受JQ节点对象，不再接受字符串等类型
 * @returns {JQObject} 返回指定序位的JQ节点对象
 */
LUIControllerAdvance.prototype.getNodeByIndex = function (index, filterLevel, $contextNode) {
	var filterArgs = _filterArguments(arguments, [["number", "array"], "number", "jqobject", "function"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIControllerAdvance.prototype.getNodeByIndex(index, filterLevel, $contextNode)";
		log(errorText, "color:#f00");
		return false;
	}

	index = filterArgs[0];
	filterLevel = filterArgs[1];
	$contextNode = filterArgs[2];

	var $allNode = this.getAllNode(filterLevel, $contextNode);

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

	var $filterNode = this.getNodeById(filterArray);

	return $filterNode;
}


/**
 * 获取最后一次异步加载的所有节点
 * @param   {Number} filterLevel 筛选节点的级别
 * @param   {JQObject} $contextNode 筛选节点的级别的查找范围：为了便于统一使用习惯，增强版涉及到$contextNode的地方，均只接受JQ节点对象，不再接受字符串等类型
 * @returns {JQObject} 返回最后一次异步加载的所有节点
 */
LUIControllerAdvance.prototype.getAsyncNode = function (filterLevel, $contextNode) {
	var filterArgs = _filterArguments(arguments, ["number", "jqobject"]);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIControllerAdvance.prototype.getAsyncNode(filterLevel, $contextNode)";
		log(errorText, "color:#f00");
		return false;
	}

	filterLevel = filterArgs[0];
	$contextNode = filterArgs[1];

	var $getAsyncNode = this.getNodeById(this._asyncNode);

	//$getAsyncNode = filterLevel !== undefined ? $getAsyncNode.filter("[data-level='" + filterLevel + "']") : $getAsyncNode;
	var $filterNode = [];
	if (filterLevel !== undefined) {
		for (var i = 0; i < $getAsyncNode.length; i++) {
			var $getNode = $getAsyncNode.eq(i);
			var getData = this.getDataById($getNode);

			if (getData.level === filterLevel) {
				//排除当前对象
				$filterNode.push($getNode);
			}
		}
		$getAsyncNode = this.getNodeById($filterNode);
	}

	var childContentString = "";
	if ($contextNode !== undefined) {
		for (var i = 0; i < $contextNode.length; i++) {
			var targetData = this.getDataById($contextNode.eq(i));
			childContentString += '[data-role="child-content"][data-pid="' + targetData.id + '"],';
		}
		var $childContent = this.$content.find(childContentString.slice(0, -1));
		$getAsyncNode = $childContent.find($getAsyncNode);
	}

	return $getAsyncNode;
}

/**
 * 获取最后一次异步加载的节点的所有选中状态的节点
 * @param   {Number} filterLevel 筛选节点的级别
 * @param   {JQObject} $contextNode 筛选节点的级别的查找范围：为了便于统一使用习惯，增强版涉及到$contextNode的地方，均只接受JQ节点对象，不再接受字符串等类型
 * @returns {JQObject} 返回最后一次异步加载的所有节点
 */
LUIControllerAdvance.prototype.getAsyncSelectedNode = function (filterLevel, $contextNode) {
	var filterArgs = _filterArguments(arguments, ["number", "jqobject"]);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIControllerAdvance.prototype.getAsyncSelectedNode(filterLevel, $contextNode)";
		log(errorText, "color:#f00");
		return false;
	}

	filterLevel = filterArgs[0];
	$contextNode = filterArgs[1];

	var $getAsyncSelectedNode = this.getNodeById(this._asyncNode);

	var $node = [];
	for (var i = 0; i < $getAsyncSelectedNode.length; i++) {
		var $currentNode = $getAsyncSelectedNode.eq(i);
		var currentData = this.getDataById($currentNode);
		if (currentData.state == "selected") {
			$node.push($currentNode);
		}
	}
	$getAsyncSelectedNode = this.getNodeById($node);

	//$getAsyncNode = filterLevel !== undefined ? $getAsyncNode.filter("[data-level='" + filterLevel + "']") : $getAsyncNode;
	var $filterNode = [];
	if (filterLevel !== undefined) {
		for (var i = 0; i < $getAsyncSelectedNode.length; i++) {
			var $getNode = $getAsyncSelectedNode.eq(i);
			var getData = this.getDataById($getNode);
			if (getData.level === filterLevel) {
				//排除当前对象
				$filterNode.push($getNode);
			}
		}
		$getAsyncSelectedNode = this.getNodeById($filterNode);
	}

	var childContentString = "";
	if ($contextNode !== undefined) {
		for (var i = 0; i < $contextNode.length; i++) {
			var targetData = this.getDataById($contextNode.eq(i));
			childContentString += '[data-role="child-content"][data-pid="' + targetData.id + '"],';
		}
		var $childContent = this.$content.find(childContentString.slice(0, -1));
		$getAsyncSelectedNode = $childContent.find($getAsyncSelectedNode);
	}

	return $getAsyncSelectedNode;
}


/**
 * 获取指定节点的所有子节点，默认获取所有子节点，可以通过层级进行筛选
 * //当前节点的直接子节点this.getChildrenNode(node,nodeData.level+1);
 * @param   {Number||String||Array||JQObject} $node      ID字符串 | 数组ID字符串 | JQ节点对象 
 * @param   {Boolean}                          getMode 获取模式，true表示全部获取，false（默认）表示获取直接子节点
 * @param   {Number}                          filterLevel 筛选节点的级别（筛选置从当前节点算起），如直接子节点就为0，下一级为1
 * @returns {JQObject}                        返回指定节点的子节点
 */
LUIControllerAdvance.prototype.getChildrenNode = function ($node, getMode, filterLevel) {
	var filterArgs = _filterArguments(arguments, ["jqobject", "boolean", "number"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIControllerAdvance.prototype.getChildrenNode($node, getMode, filterLevel)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0];
	getMode = filterArgs[1] !== undefined ? filterArgs[1] : false;
	filterLevel = filterArgs[2];

	//获取该节点下的所有选中的子节点
	var $getNode = this.getNodeById($node);
	var childrenNodeArray = [];

	for (var i = 0; i < $getNode.length; i++) {
		var $currentNode = $getNode.eq(i);
		var currentData = this.getDataById($currentNode);
		if (getMode) {
			childrenNodeArray.push(this.getAllNode(currentData.level + 1, $currentNode));
		} else {
			if (filterLevel !== undefined) {
				childrenNodeArray.push(this.getAllNode(filterLevel, $currentNode));
			} else {
				childrenNodeArray.push(this.getAllNode($currentNode));
			}
		}
	}
	var $childrenNode = this.getNodeById(childrenNodeArray);

	return $childrenNode;
}

/**
 * 获取指定节点的所有兄弟节点，getMode模式规定是否包括自身
 * @param   {Number||String||Array||JQObject} $node ID字符串 | 数组ID字符串 | JQ节点对象 
 * @param   {Number} getMode 兄弟节点获取模式，ture时表示包括查找兄弟节点时的自身节点，false（默认） 不包括自身
 * @returns {JQObject} 返回指定节点的所有兄弟节点
 */
LUIControllerAdvance.prototype.getSiblingsNode = function ($node, getMode) {
	var filterArgs = _filterArguments(arguments, ["jqobject", "boolean", "function"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIControllerAdvance.prototype.getSiblingsNode($node, getMode)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0];
	getMode = filterArgs[1] !== undefined ? filterArgs[1] : false;

	var $getNode = this.getNodeById($node);
	var getData = this.getDataById($getNode)

	//取得同辈节点(不通过jq的siblings()获取，因为html结构上不同)
	var siblingsNodeArray = [];
	for (var i = 0; i < $getNode.length; i++) {
		var $currentNode = $getNode.eq(i);
		var currentData = this.getDataById($currentNode);
		var siblingsNodeCache;
		if (currentData.level === 0) {
			//如果是根节点
			siblingsNodeCache = this.getAllNode(0);
		} else {
			siblingsNodeCache = this._noder._getTopChildContent($getNode).children("[data-role='node-container']").find("[data-role='node']");
		}

		if (!getMode) {
			siblingsNodeCache = siblingsNodeCache.not($currentNode);
		}
		siblingsNodeArray.push(siblingsNodeCache)
	}

	var $siblingsNode = this.getNodeById(siblingsNodeArray);

	return $siblingsNode;
};

/**
 * 获取指定节点的父节点（通过pid查询）
 * @param   {Number||String||Array||JQObject} $node ID字符串 | 数组ID字符串 | JQ节点对象 
 * @returns {JQObject} 返回指定指定节点的直接父节点
 */
LUIControllerAdvance.prototype.getParentNode = function ($node) {
	var filterArgs = _filterArguments(arguments, ["jqobject"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIControllerAdvance.prototype.getParentNode($node)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0];

	var $getNode = this.getNodeById($node);

	var parentNodeArray = [];

	for (var i = 0; i < $getNode.length; i++) {
		var $currentNode = $getNode.eq(i);
		var currentData = this.getDataById($currentNode);
		if (currentData.level !== 0) {
			//如果是根节点则不查找父节点
			/*var $childContent = this._noder._getTopChildContent($getNode);
			//获取子节点内容区上的PID
			//如果向上找不到包裹他的子内容区，可能节点已不在DOM中
			if ($childContent.length > 0) {
				var getPId = $childContent.attr("data-pid");
				$parentNode = this.getNodeById(getPId);
			}*/

			$parentNode = this.getNodeById(currentData.pId);
			parentNodeArray.push($parentNode);
		}
	}

	var $parentNode = this.getNodeById(parentNodeArray);

	return $parentNode;
};

/**
 * 刷新JQ节点对象，使用现在的节点数据，刷新节点对象，更新节点的HTML信息（适用于绑定的数据有了更新，但页面上没有实时显示变化时，重新格式化目标节点）
 * 不删除原节点对象，以免引起其他已指向该节点的变量出问题，仅更新它内部的HTML内容
 * 新增、删除、替换、过滤、排序都需要更新节点
 * @param {JQObject}    $node      JQ节点对象//未指定节点时将刷新全部节点
 * @param   {Boolean} refreshMode  刷新模式 true时表示刷新同级节点，false(默认)表示只刷新当前节点(只刷新当前节点时，那么有些数据就不需要刷新了)
 * @returns {PlainObject} 返回调用该方法的对象本身
 */
LUIControllerAdvance.prototype.refreshNode = function ($node, refreshMode) {
	var filterArgs = _filterArguments(arguments, ["jqobject", "boolean"]);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIControllerAdvance.prototype.refreshNode($node, refreshMode)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0] !== undefined ? filterArgs[0] : this.getAllNode();
	refreshMode = filterArgs[1] !== undefined ? filterArgs[1] : false;

	//刷新节点前调用数据刷新refreshNodeData
	this.refreshNodeData($node, refreshMode);

	var $getNode = this.getNodeById($node);
	for (var i = 0; i < $getNode.length; i++) {
		var $currentNode = $getNode.eq(i);
		var currentData = this.getDataById($currentNode);

		//refreshNodeData刷新了数据，所以在HTML页面上要表现出一些变化
		//1.节点结构更新
		//2.节点样式更新
		//4.更新state状态
		//5.更新hasParent状态
		//6.更新hasChild状态
		//3.节点属性更新：更新data-leve,data-id,data-orderid,data-index

		//如：有可能重置了一个节点的所属父ID

		//先刷新父节点

		//如果存在父节点hasParent，要根据父节点的打开状态来显示该子节点内容区与switcher
		if (currentData.hasParent === true) {
			var $parentNode = this.getParentNode($currentNode);
			var parentData = this.getDataById($parentNode);
			var $parentChildContent = this._noder._getNodeChildContent($parentNode);

			var $parentSwitcher = this._switcher._getSwitcher($parentNode);
			//当前节点为展开状态并且已经存在子节点
			if (parentData.expand === true && parentData.length > 0) {
				$parentSwitcher.addClass("active");
				$parentChildContent.addClass("active");
			}
		}

		//刷新兄弟节点所有（包括自身）
		var $refreshNode;
		//如果强制刷新是启用的，则一定会刷新所有兄弟节点，否则只刷新自身
		if (refreshMode) {
			//全部刷新
			$refreshNode = this.getSiblingsNode($currentNode, true);
		} else {
			//只刷新自已
			$refreshNode = $currentNode;
		}

		for (var j = 0; j < $refreshNode.length; j++) {
			var $node = $refreshNode.eq(j);
			var nodeData = this.getDataById($node);

			//按照nodeFormater格式化HTML内容
			var $addNode;
			if (this.config.view.nodeFormater && $.type(this.config.view.nodeFormater) == "function") {
				$addNode = $(this.config.view.nodeFormater(nodeData, this._orderCounter));
			} else {
				//默认格式:输出name值
				$addNode = $('<div>' + nodeData.name + '</div>');
			}

			//刷新节点时需要保留的一些HTML结构
			//保留住data-role=async-loader
			var $currentAsyncLoader = $node.find("[data-role='async-loader']");
			$currentAsyncLoader.detach();
			//清空原节点里的HTML内容并替换
			$node.empty();
			$node.html($addNode.html());
			$node.append($currentAsyncLoader);

			//节点更新完毕后，执行一次nodeCallback回调
			if (this.config.callback.nodeCallback && $.type(this.config.callback.nodeCallback) == "function") {
				this.config.callback.nodeCallback($node, nodeData, this);
			}

			//暂存目前节点上显示的层级数据
			var currentLevel = $node.attr("data-level");
			//去除节点旧层级样式，加上节点新层级样式
			$node.removeClass(function (index, value) {
				return "ext-node-" + currentLevel;
			});
			$node.addClass(function (index, value) {
				return "ext-node-" + nodeData.level;
			});

			//首节点和末节点层级样式变更，是增加，非移除
			if (nodeData.isFirstNode) {
				$node.addClass(this.config.view.firstNodeClass);
			} else {
				$node.removeClass(this.config.view.firstNodeClass);
			}

			if (nodeData.isLastNode) {
				$node.addClass(this.config.view.lastNodeClass);
			} else {
				$node.removeClass(this.config.view.lastNodeClass);
			}

			//如果存在子节点hasChild，true时查找$childContent和$switcher点时，不存在则创建；false删除
			var $childContent = this._noder._getNodeChildContent($node);
			var $switcher = this._switcher._getSwitcher($node);;

			if (nodeData.hasChild === true) {
				//检查
				this._noder._createChildContent($node, nodeData);
				this._switcher._createSwitcher($node, nodeData);

				//节点数据发生了变更，想应的，他的子节点也会有变化，因此发调整至最佳状态
				$childContent = this._noder._getNodeChildContent($node);
				$switcher = this._switcher._getSwitcher($node);;
				//更新switcher和父内容区的层级样式
				//去除老样式
				$childContent.removeClass(function (index, value) {
					return "ext-content-" + (parseInt(currentLevel) + 1);
				});
				$childContent.addClass(function (index, value) {
					return "ext-content-" + (parseInt(nodeData.level) + 1);
				});
				//去除老样式
				$switcher.removeClass(function (index, value) {
					return "ext-switcher-" + currentLevel;
				});
				$switcher.addClass(function (index, value) {
					return "ext-switcher-" + nodeData.level;
				});

				var $nodeContainer = this._noder._getNodeContainer($node);
				$nodeContainer.after($childContent);
			} else {
				$childContent.remove();
				$switcher.remove();
			}

			//更新节点state状态
			if (nodeData.state) {
				this.setNodeState($node, nodeData.state);
			}

			//更新识别节点需要的HTML属性值
			//index，orderid,data-id
			$node.attr("data-level", nodeData.level);
			$node.attr("data-id", nodeData.id);
			$node.attr("data-orderid", nodeData._orderId);
			$node.attr("data-index", nodeData.index);
		}
	}

	return this;
}

/**
 * 克隆JQ节点对象，（cloneMode为true时）对克隆节点的数据操作不会影响到原数据的变化
 * @param   {Number||String||Array||JQObject} $node ID字符串 | 数组ID字符串 | JQ节点对象 
 * @param   {Boolean} cloneMode 克隆模式，false(默认)时是独立复制了一份数据并克隆，还会附带一些克隆信息，ture时并不是克隆节点对象，而是对那个镜象对象的引用镜像，即数据指向是一致的，操作这个克隆的数据时，被克隆对象也会发生变更
 * @returns {JQObject} 返回克隆的JQ节点对象
 */
LUIControllerAdvance.prototype.cloneNode = function ($node, cloneMode) {
	var filterArgs = _filterArguments(arguments, ["jqobject", "boolean", "function"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIControllerAdvance.prototype.cloneNode($node, cloneMode)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0];
	cloneMode = filterArgs[1] !== undefined ? filterArgs[1] : false;

	var $getNode = this.getNodeById($node);

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

	return $cloneNodeArray;
}

/**
 * 插入JQ节点对象（思路：插入到目标节点范围内的指定位置，当做直接子节点。旧思路：插入到目标节点后面，因为插入的目标节点有可能会是一个无子节点内容区的对象，所以不使用此种方式）
 * 要插入的对象如果是内存中的DOM，插入到目标节点后面
 * 要插入的节点如果是实际DOM中的节点，节点会被移移除，插入到目标节点后面
 * @param   {Number||String|||JQObject} $node ID字符串 | 数组ID字符串 | JQ节点对象 
 * @param   {Number||String||Array||JQObject} $contextNode ID字符串 | JQ节点对象 目标节点不存在时，将增加到根节点后面
 * @param   {Boolean}  replaceMode 替换模式，为true时为互相交换(交换的位置为替换节点的第一个位置)，为false时替换节点覆盖被替换节点
 * @returns {JQObject} 返回替换的JQ节点对象
 */
LUIControllerAdvance.prototype.insertNode = function ($node, $contextNode, index) {
	var filterArgs = _filterArguments(arguments, ["jqobject", "jqobject", "number"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIControllerAdvance.prototype.insertNode($node, $contextNode, index)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0];
	$contextNode = filterArgs[1];
	index = filterArgs[2];

	var $getNode = this.getNodeById($node);
	var $targetNode;
	var targetData;
	var $targetChildContent;
	var $targetChildrenNode;

	//目标节点存在，且存在于真实DOM中，则添加到指定目标，否则直接添加到根节点
	if ($contextNode !== undefined && this.getNodeById($contextNode).length > 0) {
		$targetNode = this.getNodeById($contextNode);
		targetData = this.getDataById($targetNode);
		//获取目标节点的子内容区对象
		var $targetChildContent = this._noder._getNodeChildContent($targetNode);

		//查看目标节点是否存在子内容区
		//如果子内容区不存在，则需要创建

		if ($targetChildContent.length <= 0) {
			$targetChildContent = this._noder._createChildContent($targetNode, targetData);
			this._switcher._createSwitcher($targetNode, targetData);
		}

		$targetChildrenNode = this.getChildrenNode($targetNode, true);
	} else {
		//目标节点不存在，添加至根节点
		$targetChildContent = this.$content;
		$targetChildrenNode = this.getAllNode(0);
	}

	//取得插入节点操作前要插入的节点的兄弟节点对象（后面要刷新节点）
	var $siblingsNode = this.getSiblingsNode($getNode);

	//获取要插入节点ID及其子内容区DOM
	//按顺序插入进来
	for (var i = 0; i < $getNode.length; i++) {
		var $currentNode = $getNode.eq(i);
		var $childContent = this._noder._getNodeChildContent($currentNode);
		var $nodeContainer = this._noder._getNodeContainer($currentNode);
		//插入到指定位置(AJAX未加载时也无法获取)
		if (index >= 0 && index < $targetChildrenNode.length) {
			var $targetIndex = $targetChildrenNode.eq(index);
			var $targetContainer = this._noder._getNodeContainer($targetIndex);
			$targetContainer.before($nodeContainer);
			$nodeContainer.after($childContent)
		} else {
			$targetChildContent.append($nodeContainer).append($childContent);
		}

		var currentData = this.getDataById($currentNode);
		//因为是插入到目标节点的操作，所以要将当前节点level更改为当前目标节点的子level,
		currentData.level = targetData !== undefined ? targetData.level + 1 : 0;
		currentData.pId = targetData !== undefined ? targetData.id : null;
		//插入的节点变成了目标节点的一个子节点，因此要刷新这个节点的兄弟节点数据
	}

	//更新节点信息
	//如是插入的位置只是同级节点之间，那么就只需要刷新自已就可以了，如果不是，则需要都刷新
	if (this.config.view.autoRefresh) {
		this.refreshNode($getNode, true);
		this.refreshNode($siblingsNode, true);
	}

	return this;
};

/**
 * 移除JQ节点对象
 * @param   {Number||String||Array||JQObject} $node ID字符串 | 数组ID字符串 | JQ节点对象 
 * @returns {JQObject} 返回移除的JQ节点对象
 */
LUIControllerAdvance.prototype.removeNode = function ($node) {
	var filterArgs = _filterArguments(arguments, ["jqobject"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIControllerAdvance.prototype.removeNode($node)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0];

	var $getNode = this.getNodeById($node);

	//var $removeNodeCache = $("<div/>");
	var removeNodeArray = [];

	for (var i = 0; i < $getNode.length; i++) {
		var $currentNode = $getNode.eq(i);
		var currentData = this.getDataById($currentNode);
		//查找他的子内容区DOM

		//因为节点被移除，所以他不实际存在于dom中了，因此要通过与它相关的节点更新节点数据
		//如果存在兄弟元弟，则获取第1个兄弟
		//如果不存在兄弟元素，则更新他的父节点信息
		//如果都没有找到(全部删完了)则不更新

		var $siblingsNode = this.getSiblingsNode($currentNode);
		if ($siblingsNode.length > 0) {
			//存在兄弟
			removeNodeArray.push($siblingsNode.eq(0));
		} else {
			//如果不存在兄弟元素，则更新他的父节点信息
			var $parentNode = this.getParentNode($currentNode);

			if ($parentNode.length > 0) {
				//存在兄弟
				removeNodeArray.push($parentNode);
			}
			//都不存在，则不更新
		}

		var $removeChildContent = this._noder._getNodeChildContent($currentNode).detach();

		var $removeNode = this._noder._getNodeContainer($currentNode).detach();

		//$removeNodeCache.append($removeNode).append($removeChildContent);
	}

	//删除节点的一个完整结构，以便用在别处
	//var $removeNodeArray = $removeNodeCache.find("[data-role='node']");

	//更新节点信息
	if (this.config.view.autoRefresh) {
		this.refreshNode(removeNodeArray, true);
	}

	//返回删除的对象
	return this;
};

/**
 * 清空节点：移除所有JQ节点对象
 * @returns {JQObject} 返回移除的所有JQ节点对象
 */
LUIControllerAdvance.prototype.cleanNode = function () {
	var $allNode = this.getAllNode();
	var $removeNode = this.removeNode($allNode);

	return this;
};



/**
 * 替换JQ节点对象，请求替换只能是节点对象，不能是数据生成的对象（多次推论），可用一个或多个节点替换1个被替换的节点，节点如果是如果是一个已存在的，则会将其从原位置删除，并添加到替换源的
 * @param   {Number||String|||JQObject} $node ID字符串 | 数组ID字符串 | JQ节点对象 
 * @param   {Number||String||Array||JQObject} targetNodeId ID字符串 | 数组ID字符串 | JQ节点对象  被替换目标节点
 * @param   {Boolean}  replaceMode 替换模式，为true时为互相交换(交换的位置为替换节点的第一个位置)，为false时替换节点覆盖被替换节点
 * @returns {JQObject} 返回替换的JQ节点对象
 */
LUIControllerAdvance.prototype.replaceNode = function ($node, targetNodeId, replaceMode) {
	var filterArgs = _filterArguments(arguments, ["jqobject", "jqobject", "boolean"], 2);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIControllerAdvance.prototype.replaceNode($node, targetNodeId, replaceMode)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0];
	targetNodeId = filterArgs[1];
	replaceMode = filterArgs[2] !== undefined ? filterArgs[2] : false;

	var $getNode = this.getNodeById($node);
	var $targetNode = this.getNodeById(targetNodeId);

	//目标节点存在，就可以替换
	if ($targetNode.length > 0) {
		//取得目标兄弟节点
		var $targetSiblingsNode = this.getSiblingsNode($targetNode, true);
		//取得目标位置
		var targetIndex = $targetSiblingsNode.index($targetNode);
		//取得目标节点的父节点
		var $targetParentNode = this.getParentNode($targetNode);
		//取得替换节点的第一个节点的位置
		var $firstNode = $getNode.eq(0);
		var $firstSiblingsNode = this.getSiblingsNode($firstNode, true);

		//取得替换节点位置
		var fristIndex = $firstSiblingsNode.index($firstNode);
		//取得替换节点的父节点
		var $fristParentNode = this.getParentNode($firstNode);

		if (replaceMode) {
			//替换模式
			this.insertNode($getNode, $targetParentNode, targetIndex);
			this.insertNode($targetNode, $fristParentNode, fristIndex);
		} else {
			//覆盖模式
			this.insertNode($getNode, $targetParentNode, targetIndex);
			this.removeNode($targetNode);
		}
	}

	//返回被替换的对象
	return this;
};

/**
 * 排序JQ节点对象
 * @param   {JQObject} $node    JQ节点对象
 * @param   {String||Array} orderKey  排序字段，默认值_orderId(数据加载时按顺序生成的唯一排序ID)
 * @param   {String||Array} orderType 排序方式，默认升序（以其在文档流中的顺序为准），"asc"升序，"desc"降序，若排序方式少于排序字段，则默认以前一个的排序方式值，当字段>方式是，以方式的最后一个值，填充至与字段相同的长度
 * @returns {JQObject} 返回排序后的JQ节点对象
 */
LUIControllerAdvance.prototype.sortNode = function ($node, orderKey, orderType) {
	var filterArgs = _filterArguments(arguments, ["jqobject", ["string", "array"], ["string", "array"]]);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIControllerAdvance.prototype.sortNode($node, orderKey, orderType)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0] !== undefined ? filterArgs[0] : this.getAllNode();
	orderKey = filterArgs[1]; //todo 没有默认排序字段
	orderType = filterArgs[2];

	var $getNode = this.getNodeById($node);

	//del 功能 如果与上一次排序条件相同，则不排序(虽然排序字段相同，但可能数据有增加)

	//未找到要排序的节点，则返回一个空对象，否则返回排序后的节点（新的位置）	
	if ($getNode.length <= 0) return $();

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

	var $sortNode = [];
	var $nodeContainerCache = this._noder._getNodeContainer($getNode).detach();

	//如果需要排序
	if (orderKeyArray.length > 0) {
		//暂存排序后的节点
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
		//排序(节点关系保持不变)
		for (var j = 0; j < sortKey.length; j++) {
			//查找排序后数组元素在原数组中的位置
			var index = $.inArray(sortKey[j], clonefilterKey);
			//找到后将原数组中对应位置数据置为null，以避免之后重复查找
			clonefilterKey[index] = null;
			//暂存
			var $currentNode = $getNode.eq(index);
			var currentData = this.getDataById($currentNode);
			//暂存节点
			var $nodeContainer = this._noder._getNodeContainer($currentNode);
			$sortNodeCache.append($nodeContainer);
		}

		//首次排序后得到新的排序后的ID顺序
		sortKeyId = _dataToArray(this.getDataById($sortNodeCache.find("[data-role='node']"), "id"));
		//首次排序 End

		//递归检索是否还存在排序字段，对上一次排序后相同的数据进行再次排序
		var i = 0;

		while ((i++) < orderKeyArray.length) {
			//比较当前排序后两个值是前后是否相等,最后一个值不作比较
			//执行2次：第1次对第1个以后的字段先排序，第2次对第1个进行排序
			for (var z = 0; z < 2; z++) {
				for (var k = 0; k < sortKey.length - 1; k++) {
					var prevNode = $sortNodeCache.find("[data-role='node']").eq(k);
					var nextNode = $sortNodeCache.find("[data-role='node']").eq(k + 1);
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
							//升序时，大的值放后面，小的放前面
							if (prevKeyData > nextKeyData) {
								nextNode.after(prevNode);
							} else {
								prevNode.after(nextNode);
							}
						} else if (nextOrderType && nextOrderType.toLowerCase() === "desc") {
							//降序时，大的值放前面，小的放后面
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

		//排序节结后，先将节点附加至真实DOM中，之后再对位置做调整
		//在进入刷新数据前要调整好位置，刷新只按照真实DOM中的结构进行刷新
		//子内容区节点可以跟随首节点

		//循环结束后将排序后的节点顺序附加到内容区中
		var $sortNodeCacheTemp = $sortNodeCache.find("[data-role='node']");
		//插入到真实dom中，从后面开始，逐一插入
		for (var z = $sortNodeCacheTemp.length - 1; z >= 0; z--) {
			var $currentNode = $sortNodeCacheTemp.eq(z);
			var currentData = this.getDataById($currentNode);
			var $nodeContainer = $currentNode.closest("[data-role='node-container']");
			if (currentData.level === 0) {
				this.$content.prepend($nodeContainer);
			} else {
				//非根节点
				//查找他的父节点在哪里，先在暂存区里查找
				//查找当前节点的父节点子内容区
				//查找不到时添加到根节点
				var $parentNode = $sortNodeCacheTemp.filter("[data-id='" + currentData.pId + "']");
				if ($parentNode.length <= 0) {
					//从真实DOM从查找
					$parentNode = this.getNodeById(currentData.pId);
				}
				var $childContent = this._noder._getNodeChildContent($parentNode);
				if ($childContent.length > 0) {
					$childContent.prepend($nodeContainer);
				}
			}
		}
	}

	//更新节点信息
	if (this.config.view.autoRefresh) {
		this.refreshNode(true);
	}

	//返回被排序后的对象
	return $sortNode;
};

/**
 * 过滤JQ节点对象
 * @param {JQObject} $node    JQ节点对象
 * @param {String||RegExp} pattern   过滤表达式（使用正则表达式时，将忽略matchmode）或过滤字符串
 * @param {String||Array} filterKey 搜索的字段，默认搜索name字段，all表示全部
 * @param {Boolean} matchMode 匹配模式：精确匹配(false默认)，模糊匹配(true)
 * @param {Boolean} filterMode 过滤模式，true表示删除非指定的节点,false（默认）表示仅隐藏并不删除非指定的节点
 * @returns {JQObject} 返回过滤的JQ节点对象
 */
LUIControllerAdvance.prototype.filterNode = function ($node, pattern, filterKey, matchMode, filterMode) {
	var filterArgs = _filterArguments(arguments, ["jqobject", ["string", "regexp"], ["string", "array"], "boolean", "boolean"]);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIControllerAdvance.prototype.filterNode($node, pattern, filterKey, matchMode, filterMode)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0] !== undefined ? filterArgs[0] : this.getAllNode();
	pattern = filterArgs[1] !== undefined ? filterArgs[1] : "";
	filterKey = filterArgs[2] !== undefined ? filterArgs[2] : "name";
	matchMode = filterArgs[3] !== undefined ? filterArgs[3] : false;
	filterMode = filterArgs[4] !== undefined ? filterArgs[4] : false;

	var $allNode = this.getNodeById($node);
	if ($allNode.length <= 0) return $();

	//根据过滤条件，得到过滤后的数组JQ节点对象 和节点ID
	var $filterNode;
	var filterNodeArray = [];

	var $removeNode = [];

	//若过滤内容不存在，则显示所有节点
	if ($.type(pattern) == "string" && $.trim(pattern).length == 0) {
		//输入为空字符串时
		$filterNode = $allNode;
		//按顺序排序
		//this.sortNode($allNode);
		this._noder._getNodeContainer($filterNode).show()

	} else {
		//有查询条件时
		//如果是字符串，则将字符串转为正则表达式
		var filterExp = "";
		if ($.type(pattern) == "regexp") {
			filterExp = pattern;
		} else if ($.type(pattern) == "string") {
			//根据匹配模式，生成正则表达式
			if (matchMode) {
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
					filterNodeArray.push($getNode);
					break;
				}
			}
		}

		//隐藏所有节点
		this._noder._getNodeContainer($allNode).hide();
		//$allNode.hide();
		//过滤得到的节点ID
		$filterNode = this.getNodeById(filterNodeArray);
		//向上查找父亲ID，是否不显示，如果未显示，则将其显示出来

		for (var i = 0; i < $filterNode.length; i++) {
			var $currentNode = $filterNode.eq(i);
			var currentData = this.getDataById($filterNode.eq(i));
			//显示当前节点
			//递归查找父节点
			_showParent($currentNode, currentData, this)
		}

		//递归查找,显示父节点
		function _showParent($node, nodeData, me) {
			//当前节点如存在父节点，则显示节点，
			//$node.show();
			me._noder._getNodeContainer($node).show()
			me.replaceNodeData($node, "expand", true);
			if (nodeData.hasParent) {
				//显示父节点
				var $parentNode = me.getNodeById(nodeData.pId);
				var parentData = me.getDataById($parentNode);
				//无动画方式展开父节点
				//me.replaceNodeData($parentNode, "expand", true);

				_showParent($parentNode, parentData, me);
			}
		}

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
	if (this.config.view.autoRefresh) {
		this.refreshNode(true);
	}

	return $filterNode;
}

/**
 * 设置JQ节点对象的状态值data-state=*
 * @param   {Number||String||Array||JQObject} $node ID字符串 | 数组ID字符串 | JQ节点对象 
 * @param   {String} state      自定义状态名：常用默认的有禁用disabled，选中selected
 * @param   {String} stateClass 自定义样式名：常用默认的有禁用disabled，选中selected，也可以直接写样式
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIControllerAdvance.prototype.setNodeState = function ($node, state, stateClass) {
	var filterArgs = _filterArguments(arguments, ["jqobject", "string", "string", "function"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIControllerAdvance.prototype.setNodeState($node, state, stateClass)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0];
	state = filterArgs[1];
	stateClass = filterArgs[2];

	var $getNode = this.getNodeById($node);

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
					this._selectedNode.push($getNode.eq(i));
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

	//返回被设置的对象
	return this;
}

/**
 * 禁用JQ节点对象的快捷方法
 * @param   {Number||String||Array||JQObject} $node ID字符串 | 数组ID字符串 | JQ节点对象 
 * @param   {String} disabledClass 自定义禁用样式
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIControllerAdvance.prototype.disableNode = function ($node, disabledClass) {
	var filterArgs = _filterArguments(arguments, ["jqobject", "string"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIControllerAdvance.prototype.disableNode($node, disabledClass)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0];
	disabledClass = filterArgs[1];

	var $disabledNode = this.setNodeState($node, "disabled", disabledClass);

	//返回被选中的对象
	return this;
}

/**
 * 选中JQ节点对象
 * @param   {Number||String||Array||JQObject} $node ID字符串 | 数组ID字符串 | JQ节点对象 
 * @param   {String} disabledClass 自定义选中样式
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIControllerAdvance.prototype.selectNode = function ($node, selectedClass) {
	var filterArgs = _filterArguments(arguments, ["jqobject", "string", "function"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIControllerAdvance.prototype.selectNode($node, selectedClass)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0];
	selectedClass = filterArgs[1];

	//节点选中之前，执行一次nodeBeforeSelected回调
	if (this.config.callback.nodeBeforeSelected && $.type(this.config.callback.nodeBeforeSelected) == "function") {
		this.config.callback.nodeBeforeSelected(this.getNodeById($node), this.getDataById($node), this);
	}

	var $selectedNode = this.setNodeState($node, "selected", selectedClass);

	//节点选中后，执行一次nodeSelect回调
	if (this.config.callback.nodeSelect && $.type(this.config.callback.nodeSelect) == "function") {
		this.config.callback.nodeSelect(this.getNodeById($node), this.getDataById($node), this);
	}

	//返回被选中的对象
	return this;
}

/**
 * 选中所有JQ节点对象
 * @param   {Number||String||Array||JQObject} $node ID字符串 | 数组ID字符串 | JQ节点对象 
 * @param   {String} disabledClass 自定义选中样式
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIControllerAdvance.prototype.selectAllNode = function ($node, selectedClass) {
	var filterArgs = _filterArguments(arguments, ["jqobject", "string"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIControllerAdvance.prototype.selectNode($node, selectedClass)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0];
	selectedClass = filterArgs[1];

	var $allNode = this.getAllNode();

	var $selectAllNode = this.setNodeState($allNode, "selected", selectedClass);

	//返回被取消选中的对象
	return this;
}

/**
 * 取消选中JQ节点对象：只针对已选中状态取消选中，不针对其他状态
 * @param   {Number||String||Array||JQObject} $node ID字符串 | 数组ID字符串 | JQ节点对象 
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIControllerAdvance.prototype.cancelSelectedNode = function ($node) {
	var filterArgs = _filterArguments(arguments, ["jqobject", "function"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIControllerAdvance.prototype.cancelSelectedNode($node)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0];

	var $getNode = this.getNodeById($node);

	var $cancelSelectNodeArray = [];
	for (var i = 0; i < $getNode.length; i++) {
		var $currentNode = $getNode.eq(i);
		var getData = this.getDataById($currentNode);
		//只针对已选中状态取消选中，不针对其他状态
		if (getData.state == "selected") {
			$cancelSelectNodeArray.push($currentNode);
		}
	}

	//节点取消选中之前，执行一次nodeBeforeCancelSelected回调
	if (this.config.callback.nodeBeforeCancelSelected && $.type(this.config.callback.nodeBeforeCancelSelected) == "function") {
		this.config.callback.nodeBeforeCancelSelected(this.getNodeById($node), this.getDataById($node), this);
	}

	var $cancelSelectNode = this.setNodeState(this.getNodeById($cancelSelectNodeArray));

	//节点取消选中后，执行一次nodeCancelSelected回调
	if (this.config.callback.nodeCancelSelected && $.type(this.config.callback.nodeCancelSelected) == "function") {
		this.config.callback.nodeCancelSelected(this.getNodeById($node), this.getDataById($node), this);
	}

	return this;
}

/**
 * 取消所有选中JQ节点对象
 * @param   {Number||String||Array||JQObject} $node ID字符串 | 数组ID字符串 | JQ节点对象 
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIControllerAdvance.prototype.cancelSelectedAllNode = function () {
	var $selectedNode = this.getSelectedNode();
	this.cancelSelectedNode($selectedNode);

	return this;
}

/**
 * 
 * 移除当前控件当前页面下所有选中JQ节点对象
 * @param   {Number||String||Array||JQObject} $node ID字符串 | 数组ID字符串 | JQ节点对象 
 * @param   {Function} callback   回调事件
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIControllerAdvance.prototype.cleanSelectedNode = function () {

	var $selectedNode = this.getSelectedNode(true);
	this.cancelSelectedNode($selectedNode);

	return this;
}


/**
 * 展开指定JQ节点对象
 * @param   {Number||String||Array||JQObject} $node ID字符串 | 数组ID字符串 | JQ节点对象 
 * @param   {Boolean} expandMode 展开模式，true时表示动态加载，false（默认）时表示非动态加载
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIControllerAdvance.prototype.expandNode = function ($node, expandMode) {
	var filterArgs = _filterArguments(arguments, ["jqobject", "boolean"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIControllerAdvance.prototype.expandNode($node, expandMode)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0];
	expandMode = filterArgs[1] !== undefined ? filterArgs[1] : false;


	var $getNode = this.getNodeById($node);

	for (var i = 0; i < $getNode.length; i++) {
		var $currentNode = $getNode.eq(i);
		var currentData = this.getDataById($currentNode);
		var $currentSwitcher = this._switcher._getSwitcher($currentNode);
		var $childContent = this._noder._getNodeChildContent($currentNode);

		//节点展开之前，执行一次nodeBeforeExpanded回调
		if (this.config.callback.nodeBeforeExpanded && $.type(this.config.callback.nodeBeforeExpanded) == "function") {
			this.config.callback.nodeBeforeExpanded($currentSwitcher, $currentNode, currentData, me);
		}

		if (expandMode) {
			$currentSwitcher.addClass("active");
			var me = this;
			$childContent.slideDown(me.config.view.expandSpeed, function () {
				me.replaceNodeData($currentNode, "expand", true);
				$childContent.addClass("active");
				$childContent.removeAttr("style");
				//节点展开后，执行一次nodeExpand回调
				if (me.config.callback.nodeExpand && $.type(me.config.callback.nodeExpand) == "function") {
					me.config.callback.nodeExpand($currentSwitcher, $currentNode, currentData, me);
				}
			});
		} else {
			$currentSwitcher.addClass("active");
			this.replaceNodeData($currentNode, "expand", true);
			$childContent.addClass("active");
			$childContent.removeAttr("style");
			//节点展开后，执行一次nodeExpand回调
			if (this.config.callback.nodeExpand && $.type(this.config.callback.nodeExpand) == "function") {
				this.config.callback.nodeExpand($currentSwitcher, $currentNode, currentData, this);
			}
		}
	}

	return this;
}

/**
 * 展开所有JQ节点对象(可指定级别)
 * @param   {Number||String||Array||JQObject} $node ID字符串 | 数组ID字符串 | JQ节点对象 
 * @param   {Boolean} expandMode 展开模式，true时表示动态加载，false（默认）时表示非动态加载
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIControllerAdvance.prototype.expandAllNode = function (filterLevel, expandMode) {
	var filterArgs = _filterArguments(arguments, ["number", "boolean", "function"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIControllerAdvance.prototype.expandAllNode(filterLevel, expandMode)";
		log(errorText, "color:#f00");
		return false;
	}

	filterLevel = filterArgs[0];
	expandMode = filterArgs[1] !== undefined ? filterArgs[1] : false;

	var $allNode = this.getAllNode(filterLevel);

	for (var i = 0; i < $allNode.length; i++) {
		var $currentNode = $allNode.eq(i);
		var currentData = this.getDataById($currentNode);
		//如果当前节点为存在子节点（判断length），则展开

		//不存在子节点，直接跳过
		if (currentData.length <= 0) {
			continue;
		}

		this.expandNode($currentNode, expandMode);
	}

	return this;
}

/**
 * 取消展开指定JQ节点对象
 * @param   {Number||String||Array||JQObject} $node ID字符串 | 数组ID字符串 | JQ节点对象 
 * @param   {Boolean} expandMode 展开模式，true时表示动态加载，false（默认）时表示非动态加载
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIControllerAdvance.prototype.cancelExpandedNode = function ($node, expandMode) {
	var filterArgs = _filterArguments(arguments, ["jqobject", "boolean"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIControllerAdvance.prototype.cancelExpandedNode($node, expandMode)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0];
	expandMode = filterArgs[1] !== undefined ? filterArgs[1] : false;


	var $getNode = this.getNodeById($node);

	for (var i = 0; i < $getNode.length; i++) {
		var $currentNode = $getNode.eq(i);
		var currentData = this.getDataById($currentNode);
		var $currentSwitcher = this._switcher._getSwitcher($currentNode);
		var $childContent = this._noder._getNodeChildContent($currentNode);

		//节点展开之前，执行一次nodeBeforeCancelExpanded回调
		if (this.config.callback.nodeBeforeCancelExpanded && $.type(this.config.callback.nodeBeforeCancelExpanded) == "function") {
			this.config.callback.nodeBeforeCancelExpanded($currentSwitcher, $currentNode, currentData, this);
		}

		if (expandMode) {
			$currentSwitcher.removeClass("active");
			var me = this;
			$childContent.slideUp(me.config.view.expandSpeed, function () {
				me.replaceNodeData($currentNode, "expand", false);
				$childContent.removeClass("active");
				$childContent.removeAttr("style");
				//节点展开后，执行一次nodeCancelExpanded回调
				if (me.config.callback.nodeCancelExpanded && $.type(me.config.callback.nodeCancelExpanded) == "function") {
					me.config.callback.nodeCancelExpanded($currentSwitcher, $currentNode, currentData, me);
				}
			});
		} else {
			$currentSwitcher.removeClass("active");
			this.replaceNodeData($currentNode, "expand", true);
			$childContent.removeClass("active");
			$childContent.removeAttr("style");
			//节点展开后，执行一次nodeCancelExpanded回调
			if (this.config.callback.nodeCancelExpanded && $.type(this.config.callback.nodeCancelExpanded) == "function") {
				this.config.callback.nodeCancelExpanded($currentSwitcher, $currentNode, currentData, this);
			}
		}
	}

	return this;
}

/**
 * 取消展开指定JQ节点对象
 * @param   {Number||String||Array||JQObject} $node ID字符串 | 数组ID字符串 | JQ节点对象 
 * @param   {Boolean} expandMode 展开模式，true时表示动态加载，false（默认）时表示非动态加载
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIControllerAdvance.prototype.cleanExpandedNode = function (filterLevel, expandMode) {
	var filterArgs = _filterArguments(arguments, ["number", "boolean"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIControllerAdvance.prototype.cleanExpandedNode(filterLevel, expandMode)";
		log(errorText, "color:#f00");
		return false;
	}

	filterLevel = filterArgs[0];
	expandMode = filterArgs[1] !== undefined ? filterArgs[1] : false;

	var $allNode = this.getAllNode(filterLevel);

	for (var i = 0; i < $allNode.length; i++) {
		var $currentNode = $allNode.eq(i);
		var currentData = this.getDataById($currentNode);
		//如果当前节点为存在子节点（判断length），则展开

		//不存在子节点，直接跳过
		if (currentData.length <= 0) {
			continue;
		}

		this.cancelExpandedNode($currentNode, expandMode);
	}

	return this;
}

/**
 * JQ节点对象的数据源增加一项记录或多项记录
 * 一项记录时为可以使用key和value2个参数，多项记录时使用key参数，传入格式要求为键/值对格式原生对象，当为对象格式时会忽略value参数
 * 注意：如果要新增的键已存在且存在内容，则不替换它，将会略过，如果键内容为空，则替换它
 * @param   {Number||String||Array||JQObject} $node ID字符串 | 数组ID字符串 | JQ节点对象 
 * @param   {String||Object} key      键名或键/值对的数据对象
 * @param   {String} value    值名
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIControllerAdvance.prototype.addNodeData = function ($node, key, value) {
	var filterArgs = _filterArguments(arguments, ["jqobject", ["string", "array", "plainobject"], "all"], 2);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIControllerAdvance.prototype.addNodeData($node, key, value)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0];
	key = filterArgs[1];
	value = filterArgs[2];

	var keyArray = [];
	if ($.type(key) == "string") {
		keyArray[0] = key;
	} else {
		keyArray = key;
	}

	var $getNode = this.getNodeById($node);

	for (var i = 0; i < $getNode.length; i++) {
		var getData = this.getDataById($getNode.eq(i));
		if ($.type(keyArray) == "array" && value) {
			//注意：如果要新增的键已存在且存在内容，则不能替换他
			var addFlag, result;
			if ($.type(value) == "function") {
				//函数回调，返回值不为undefined时，才进行替换，否则略过
				var result = value(i, getData);
				if (result !== undefined) {
					addFlag = true;
				}
			} else {
				addFlag = true;
				result = value;
			}

			if (addFlag) {
				for (var j = 0; j < keyArray.length; j++) {
					if (getData[keyArray[j]] === undefined) {
						getData[keyArray[j]] = result;
					}
				}
			}
		} else if ($.type(keyArray) == "object") {
			for (var keyName in keyArray) {
				if (getData[keyName] === undefined) {
					getData[keyName] = keyArray[keyName];
				}
			}
		}
	}

	//只更新当前节点信息
	if (this.config.view.autoRefresh) {
		this.refreshNode($getNode);
	}

	return this;
};

/**
 * JQ节点对象的数据源替换一项记录或多项记录，会实时将更改显示在页面上
 * //TODO 测试跨level替换
 * //TODO 不支持修改内置数据
 * 注意：与addNodeData不同的地方在于
 * 1.针对查找到的key进行替换
 * 2.未找到key或者无内容时，进行增加和覆盖
 * @param   {Number||String||Array||JQObject} $node ID字符串 | 数组ID字符串 | JQ节点对象 
 * @param   {String||Object}                      key      键名或键/值对的数据对象
 * @param   {all}                             value    任间类型，支持回调
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIControllerAdvance.prototype.replaceNodeData = function ($node, key, value) {
	var filterArgs = _filterArguments(arguments, ["jqobject", ["string", "array", "plainobject"], "all"], 2);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIControllerAdvance.prototype.replaceNodeData($node, key, value)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0];
	key = filterArgs[1];
	value = filterArgs[2];

	var keyArray = [];
	if ($.type(key) == "string") {
		keyArray[0] = key;
	} else {
		keyArray = key;
	}

	var $getNode = this.getNodeById($node);

	for (var i = 0; i < $getNode.length; i++) {
		var getData = this.getDataById($getNode.eq(i));
		//当key类型为string时，value类型支持function回调
		if ($.type(keyArray) == "array" && value !== undefined && key != "_orderId" && key != "index") {
			var replaceFlag, result;
			if ($.type(value) == "function") {
				//函数回调，返回值不为undefined时，才进行替换，否则略过
				result = value(i, getData);
				if (result !== undefined) {
					replaceFlag = true;
				}
			} else {
				replaceFlag = true;
				result = value;
			}
			if (replaceFlag) {
				for (var j = 0; j < keyArray.length; j++) {
					getData[keyArray[j]] = result;
				}
			}
		} else if ($.type(keyArray) == "object") {
			for (var keyName in keyArray) {
				if (keyName != "_orderId" && keyName != "index") {
					getData[keyName] = keyArray[keyName];
				}
			}
		}
	}

	if (this.config.view.autoRefresh) {
		this.refreshNode($getNode);
	}

	return this;
};

/**
 * JQ节点对象的数据源移除一项记录或多项记录
 * @param   {Number||String||Array||JQObject} $node ID字符串 | 数组ID字符串 | JQ节点对象 
 * @param   {String||Array} key      键名或键名数组
 * @param   {Function} callback     回调函数，只有返回值为true时才正式删除节点上的key对应数据
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIControllerAdvance.prototype.removeNodeData = function ($node, key, callback) {
	var filterArgs = _filterArguments(arguments, ["jqobject", ["string", "array"], "function"], 2);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIControllerAdvance.prototype.removeNodeData($node, key)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0];
	key = filterArgs[1];
	callback = filterArgs[2];

	var keyArray = [];
	if ($.type(key) == "array") {
		keyArray = key;
	} else {
		keyArray[0] = key;
	}

	var $getNode = this.getNodeById($node);

	for (var i = 0; i < $getNode.length; i++) {
		var getData = this.getDataById($getNode.eq(i));

		var removeFlag = false;
		if (callback) {
			//函数回调，返回值为true时，才删除
			var result = callback(i, getData);
			if (result === true) {
				removeFlag = true;
			}
		} else {
			removeFlag = true;
		}

		if (removeFlag) {
			for (var j = 0; j < keyArray.length; j++) {
				delete getData[keyArray[j]]
			}
		}

		if (this.config.view.autoRefresh) {
			this.refreshNode($getNode);
		}
	}
	return this;
};

/**
 * 根据上下环境刷新数据
 *  *  增强版 如addNode，removeNode，replace后都需要更新节点数据(如hasChild,hasParent,index,isFirstNode,isLastNode,isRoot,length,level)，refreshNodeData(返回有数据变化的节点，以备刷新节点使用)，但可以不用更新节点
 *  ADD 简易版考虑是否需要该api
 *  更新数据的操作非常耗时，请慎用
 *  考虑增加filterLevel
 * @param   {Number||String||Array||JQObject} $node ID字符串 | 数组ID字符串 | JQ节点对象 
 * @param   {Boolean} refreshMode  刷新模式 true时表示刷新同级节点，false(默认)表示只刷新当前节点(只刷新当前节点时，那么有些数据就不需要刷新了)
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIControllerAdvance.prototype.refreshNodeData = function ($node, refreshMode) {
	var filterArgs = _filterArguments(arguments, ["jqobject", "boolean"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIControllerAdvance.prototype.refreshNodeData($node, refreshMode)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0];
	refreshMode = filterArgs[1] !== undefined ? filterArgs[1] : false;
	//$node根据上下文环境来刷新数据
	var $getNode = this.getNodeById($node);
	//需要更新哪些数据
	//1.更新当前节点数据
	//2.更新同级节点数据（要先确定同级其他节点的层级及指向是否正确）
	//3.更新父节点数据

	//isRefreshing 正在刷新节点中标记
	//refreshingDataCache 更新了的数据暂存区，更新完毕之后再将isRefreshing全部置为false
	var refreshingDataCache = [];

	for (var i = 0; i < $getNode.length; i++) {
		var $currentNode = $getNode.eq(i);
		var currentData = this.getDataById($currentNode);

		//先查看当前节点是否是更新中的，如更新中则不再遍历其兄弟节点（因为肯定有其他节点已经触发了其兄弟节点的更新）
		//查看当前节点是否正在刷新中，刷新中则退出
		if (currentData.isRefreshing === true) {
			continue;
		}

		//先取得父节点数据父节点数据
		var parentData = undefined;
		if (currentData.level !== 0) {
			var $parentNode = this.getParentNode($currentNode);
			parentData = this.getDataById($parentNode);
		}

		//如果是根节点，则不更新父节点数据
		//当前节点非根节点时，刷新父节点信息

		//取得兄弟节点所有（包括自身）
		var $siblingsNode = this.getSiblingsNode($currentNode, true);
		//如果强制刷新是启用的，则一定会刷新所有兄弟节点，否则只刷新自身
		if (refreshMode) {
			//全部刷新
			for (var j = 0; j < $siblingsNode.length; j++) {
				var $node = $siblingsNode.eq(j);
				var nodeData = this.getDataById($node);
				if (nodeData.isRefreshing === true) {
					continue;
				}

				//根据当前父节点设置当前节点的level
				//刷新当前节点数据
				nodeData.level = parentData !== undefined ? parentData.level + 1 : 0; //根据父亲节点设置当前节点级别
				nodeData.pId = nodeData.level === 0 ? null : parentData.id;
				nodeData.isRoot = nodeData.level === 0 ? true : false;
				nodeData.hasParent = nodeData.level === 0 ? false : true;
				nodeData.isFirstNode = j == 0 ? true : false;
				nodeData.isLastNode = (j + 1) == $siblingsNode.length ? true : false;
				nodeData.index = j;

				//刷新父节点的子节点相关数据，不更新自身的子节点标识数据
				var $childrenNode = this.getChildrenNode($node, true);
				nodeData.length = $childrenNode.length;
				if (nodeData.length > 0) {
					nodeData.hasChild = true;
				} else if ($.type(nodeData.children) == "string") {
					nodeData.hasChild = true;
				} else {
					nodeData.hasChild = false;
				}

				//刷新父节点的子节点相关数据，不更新自身的子节点标识数据
				if (parentData !== undefined) {
					parentData.length = $siblingsNode.length;
					parentData.hasChild = parentData.length > 0 ? true : false;
					//更新children//如果影响性能，后期会去除
					parentData.children = this.getDataById($siblingsNode);
				}

				//将节点标记为更新中状态，避免重复刷新数据
				nodeData.isRefreshing = true;
				refreshingDataCache.push(nodeData);
			}
		} else {
			//如果只刷新当前节点
			//刷新当前节点
			//如果显示为更新中，则不再刷新节点
			var index = $siblingsNode.index($currentNode);
			//根据当前父节点设置当前节点的level
			//如果当前节点是根节点，父节点不存在时
			//刷新当前节点数据
			//如果是简单数据结构时 todo只刷梳妆打扮哪些数据
			currentData.level = parentData !== undefined ? parentData.level + 1 : 0; //根据父亲节点设置当前节点级别
			currentData.pId = currentData.level === 0 ? null : parentData.id;
			currentData.isRoot = currentData.level === 0 ? true : false;
			currentData.hasParent = currentData.level === 0 ? false : true;

			currentData.isFirstNode = index == 0 ? true : false;
			currentData.isLastNode = (index + 1) == $siblingsNode.length ? true : false;
			currentData.index = index; //应该是不刷新的

			//刷新父节点的子节点相关数据，不更新自身的子节点标识数据
			var $childrenNode = this.getChildrenNode($currentNode, true);
			currentData.length = $childrenNode.length;
			if (currentData.length > 0) {
				currentData.hasChild = true;
			} else if ($.type(currentData.children) == "string") {
				currentData.hasChild = true;
			} else {
				currentData.hasChild = false;
			}

			//刷新父节点的子节点相关数据，不更新自身的子节点标识数据
			if (parentData !== undefined) {
				parentData.length = $siblingsNode.length;
				parentData.hasChild = parentData.length > 0 ? true : false;
				//更新children//如果影响性能，后期会去除
				parentData.children = this.getDataById($siblingsNode);
			}

			//将节点标记为更新中状态，避免重复刷新数据
			currentData.isRefreshing = true;
			refreshingDataCache.push(currentData);
		}
	}

	//刷新完毕后，重置isRefreshing标记
	$.each(refreshingDataCache, function () {
		this.isRefreshing = false;
	})

	return this;
};

/**
 * 获取指定JQ节点对象数据
 * 只有$node参数时，返回的是指向原数据源的引用，任何对返回数据源的修改，都会影响老数据源实时反应，如果想修改的数据不影响原数据，请先用cloneData克隆一份数据源
 * 存在filterKey参数时，将返回被筛选后的原数据源的克隆数据，任何对返回数据源的修改，都不会影响老数据源
 * 操作的节点对象只有一个时，直接返回对该数据的引用
 * 操作的节点对象只有一个时，且键名只有一个时，将返回复制过数据源的字符串格式
 * 操作的节点对象多个时，但键名只有一个时，将返回复制过数据源的字符串数组格式
 * @param   {Number||String||Array||JQObject} $node ID字符串 | 数组ID字符串 | JQ节点对象 
 * @param   {String||Array} filterKey        指定要筛选的键名字符串，或键名数组，未指定时获取全部数据
 * @param   {Boolean} filterMode 筛选模式：简单模式false(默认)：仅部分包括即可返回数据源;严格筛选模式true：必须包括全部的键名才被筛选
 * @param   {Number} filterLevel 筛选节点的级别
 * @param   {JQObject} $contextNode 筛选节点的级别的查找范围：为了便于统一使用习惯，增强版涉及到$contextNode的地方，均只接受JQ节点对象，不再接受字符串等类型
 * @returns {JQObject}   返回指定JQ节点对象数据数组对象
 */
LUIControllerAdvance.prototype.getDataById = function ($node, filterKey, filterMode, filterLevel, $contextNode) {
	var filterArgs = _filterArguments(arguments, ["jqobject", ["string", "array"], "boolean", "number", "jqobject"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIControllerAdvance.prototype.getDataById($node, filterKey, filterMode, filterLevel, $contextNode)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0];
	filterKey = filterArgs[1];
	filterMode = filterArgs[2] !== undefined ? filterArgs[2] : false;
	filterLevel = filterArgs[3];
	$contextNode = filterArgs[4];

	var $getNode = this.getNodeById($node, filterLevel, $contextNode);
	var getData = [];

	for (var i = 0; i < $getNode.length; i++) {
		getData.push($getNode.eq(i).data("data"));
	}

	if (filterKey) {
		getData = _cloneData(getData);
		getData = _filterData(getData, filterKey, filterMode);
	}

	//根据$node的数量，决定返回数量的长度格式
	//原参数为数组时，返回数组格式，原参数是直接的节点对象时且节点对象大于1个时，也返回数组格式
	//只有一条数据时直接返回第一条数据，多条数据时返回数组对象
	if ($.type($node) != "array" && !($.type($node) == "object" && $node.length > 1) && getData.length > 0) {
		getData = getData[0];
	}

	return getData;
};

/**
 * 返回所有的JQ节点对象数据
 * 只有nodeId参数时，返回的是指向原数据源的引用，任何对返回数据源的修改，都会影响老数据源实时反应，如果想修改的数据不影响原数据，请先用cloneData克隆一份数据源
 * 存在filterKey参数时，将返回被筛选后的原数据源的克隆数据，任何对返回数据源的修改，都不会影响老数据源
 * @param   {String|Array} filterKey        指定要筛选的键名字符串，或键名数组
 * @param   {Boolean} filterMode 筛选模式：简单模式false(默认)：仅部分包括即可返回数据源;严格筛选模式true：必须包括全部的键名才被筛选
 * @param   {Number} filterLevel 筛选节点的级别
 * @param   {JQObject} $contextNode 筛选节点的级别的查找范围：为了便于统一使用习惯，增强版涉及到$contextNode的地方，均只接受JQ节点对象，不再接受字符串等类型
 * @returns {JQObject}   返回所有JQ节点对象数据数组对象或空数组
 */

LUIControllerAdvance.prototype.getAllData = function (filterKey, filterMode, filterLevel, $contextNode) {
	var filterArgs = _filterArguments(arguments, [["string", "array"], "boolean", "number", "jqobject"]);
	//过滤参数且重排理想结构
	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIControllerAdvance.prototype.getAllData(filterKey, filterMode, filterLevel, $contextNode)";
		log(errorText, "color:#f00");
		return false;
	}

	filterKey = filterArgs[0];
	filterMode = filterArgs[1] !== undefined ? filterArgs[1] : false;
	filterLevel = filterArgs[2];
	$contextNode = filterArgs[3];

	var $allNode = this.getAllNode(filterLevel, $contextNode);

	var allData = [];

	//不通过getDataById获取所有节点数据，getAllData最终返回的是一个数组形式数据，因为有可能是空数组
	for (var i = 0; i < $allNode.length; i++) {
		allData.push(this.getDataById($allNode.eq(i)));
	}

	if (filterKey) {
		allData = _cloneData(allData);
		allData = _filterData(allData, filterKey, filterMode);
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
 * @param   {Number} filterLevel 筛选节点的级别
 * @param   {JQObject} $contextNode 筛选节点的级别的查找范围：为了便于统一使用习惯，增强版涉及到$contextNode的地方，均只接受JQ节点对象，不再接受字符串等类型
 * @returns {JQObject}   返回选中的JQ节点对象数据数组对象或空数组
 */
LUIControllerAdvance.prototype.getSelectedData = function (filterKey, filterMode, filterLevel, $contextNode) {
	var filterArgs = _filterArguments(arguments, [["string", "array"], "boolean", "number", "jqobject"]);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIControllerAdvance.prototype.getSelectedData(filterKey, filterMode, filterLevel, $contextNode)";
		log(errorText, "color:#f00");
		return false;
	}

	filterKey = filterArgs[0];
	filterMode = filterArgs[1] !== undefined ? filterArgs[1] : false;
	filterLevel = filterArgs[2];
	$contextNode = filterArgs[3];

	var $selectedNode = this.getSelectedNode(filterLevel, $contextNode);

	var selectedData = [];

	//不通过getDataById获取所有节点数据，最终返回的是一个数组形式数据，因为有可能是空数组
	for (var i = 0; i < $selectedNode.length; i++) {
		selectedData.push(this.getDataById($selectedNode.eq(i)));
	}

	if (filterKey) {
		selectedData = _cloneData(selectedData);
		selectedData = _filterData(selectedData, filterKey, filterMode);
	}

	return selectedData;
}

/**
 * 克隆数据源
 * 注意：克隆数据会增加一些额外数据字段，比如对数据进行了克隆，那么这一份新数据的拥有者就清空了，暂时没有人，然后还增加一个克隆至谁的数据字段和被克隆次数的字段
 * @param   {PlainObject||Array} data     数据源可以是直接健/值对的原生对象格式，也可以是多项健/值对的数组对象
 * @returns {JQObject}   返回克隆后的数据源
 */
LUIControllerAdvance.prototype.cloneData = function (data) {
	var filterArgs = _filterArguments(arguments, [["plainobject", "array"]], 1);

	if (filterArgs === false) {
		var errorText = "%cLUIControllerAdvance.prototype.cloneData(data)";
		log(errorText, "color:#f00");
		return false;
	}

	data = filterArgs[0];

	var validateData = _validateData(data);

	var cloneDataArray = [];

	for (var i = 0; i < validateData.length; i++) {

		//原数据源克隆
		var cloneData = $.extend(true, {}, validateData[i])

		//对原数据增加克隆者属性和被克隆者属性
		/*if (!validateData[i]._cloneCount) {
			validateData[i]._cloneCount = 1;
		} else {
			validateData[i]._cloneCount++;
		}*/
		validateData[i]._cloneCount = validateData[i]._cloneCount ? validateData[i]._cloneCount++ : 1;

		//复制者的角色名，自已复制自已则的也是自已
		validateData[i]._cloner = validateData[i]._cloner || [];

		validateData[i]._cloner.push(this.config._roleId);

		//清空拥有者
		cloneData._owner = [];

		//添加数据原拥有者
		cloneData._holder = validateData[i]._owner;

		cloneDataArray.push(cloneData);
	}

	//原数据格式如果为数组时也返回数组，如果为原始对象也返回对象格式
	if ($.type(data) != "array") {
		cloneDataArray = cloneDataArray[0];
	}

	return cloneDataArray;
}