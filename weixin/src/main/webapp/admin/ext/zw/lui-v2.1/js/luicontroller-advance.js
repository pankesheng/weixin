/**
 * @class LUIController
 * @version 0.5.0
 * @author lisfan QQ@448182355 GIT@lisfan 
 * @createDate 04/12/2015
 * @requires jquery-1.11.3
 * @name 扩展插件基类-增强版（Advance）
 * @markdown
 * 
 * ## 增强版与简易版的区别
 * - 自带绑定数据不同，增强版绑定了很多简易版没有的子段
 * - 增强版支持多级结构，简易版只支持单级
 
 * ## 功能说明 
 * - 支持初始静态HTML方式初始化页面
 * - 支持ajax 数据加载
 * - 可以自定义增加节点状态并通过getNodeByState获取(内置为4种状态selected,checked,expanded,disabled提供了小部分方法和增强性的功能)
 * 
 * ## todo清单 
 * - 增加选框关闭时触发事件
 * - 即时搜索下拉时的严格和松散匹配模式
 * - 完善现有示例
 * - 级联选择关系线逻辑调整
 * - table插件
 * - 上下翻页
 * - editMode(在线编辑模式，制作表格插件时追加，暂时不做
 *  * - dragMode拖拽模式

 * - 兼容老版本插件，2个版本同时管理，但高版本可以优雅的使用简易版， 缩减简易版本
 * - 编写测试用例方档和API文档
 * - 整理jquery方法列表，加强方法记忆
 * - 一次性加载1500条数据的思路:分割数据，分批次调用load加载数据（注意_asyncNode的值）？
 * - (搁置)即使不是ajax加载，或者说返正只要是数据加载的都要一个提示反馈
 * - 增加加载器loader
 * - 启用加载器enabledLoader:true,启用后不直接addNode进数据：加载的数据先放在某一位置
 * 		- 增加view.loaderType 加载方式：批量加载还是全部加载
 * 		- 增加view.loaderCount 逐一加载的数量
 * 		- 增加view.loaderAnimate 加载动画
 *   loadType:是一次性全部加载完毕呢，还是先加载首节点，再加载子节点
 * 		- 独立出代码中的样式
 *    - ajax加载几W条数据时怎么处理（过多时自动启用加载模式，除非显示的指定为关闭）
 *
 *
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
 * 		- 基础代码从简易版拷贝，扩展为增强版
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
 * - 2016.02.27
 * 		- 支持部分关键key自定义;
 * - 2016.02.29
 * 		- 重构selected相关的方法和checked相关的方法;
 * - 2016.03.01
 * 		- 增强性能，加快速度，节点查询时从DOM层获取，不再解析节点数据值
 * - 2016.03.03
 * 		- 增加刷新节点暂存，以便后续刷新全部未刷新节点
 * 		- 同时展开节点的数量配置参数
 * 		- 增强同时展开节点的数量及关闭节点的顺序
 * 		- 增强filterNode()
 * - 2016.03.04
 * 		- 增加checked的样式框
 * 		- 增加selectIsCheck和checkIsSelect配置
 * 		- 更改状态模式（selectMode）的多选模式下的多选数量逻辑
 * - 2016.03.05
 * 		- 初始化勾选状态和展开状态
 * 		- 完善多重选中的的显示逻辑
 * - 2016.03.05
 * 		- 更改loadCallback的触发时s机，增加类似jquery.ready的方法
 * 		- _init私有化
 * - 2016.03.10
 * 		- 更改初始化选中，勾选等逻辑
 * - 2016.03.12
 * 		- 增加一系列disabled状态的属性和方法
 * - 2016.03.14
 * 		- 更改HTML结构
 * 		- v0.5版本的重构
 * - 2016.03.15
 * 		- v0.5版本的重构
 * - 2016.03.16
 * 		- 拆分refreshNode()和refreshNodeData()方法的独立性
 * 		- 增强刷新节点的逻辑，减少错误
 * 		- 移除index字段数据
 * - 2016.03.17
 * 		- 重构sortNode() 提升效率
 * - 2016.03.18
 * 		- 静态方式加载页面
 * - 2016.03.19
 * 		- 更改部分方法中filterLevel和$contextNode参数的逻辑
 * 		- 去除原_isUserDefined
 * - 2016.03.22
 * 		- 提升性能，移除两个字段（isFirstNode和isLastNode）的设置
 * 		- 修改部分有使用到getSiblings()的方法，避免使用（太影响性能）
 * 		- 更改部分参数，自动刷新节点的方式
 * - 2016.03.23
 * 		- 异步加载显示信息优化
 * 		- 优化初始化状态方法的性能
 * 		- 优化设置节点状态查询速度的性能
 * - 2016.03.23
 * 		- 修复小BUG
 * - 2016.03.27
 * 		- 增加显示和隐藏节点api，还有初始化节点状态
 *   ## 测试用例
 * 
 * 
 * 
 * 异步加载后，删除部分节点后，使用getAsyncNode获取的节点对有包括被删除的部分节点，使用getAsyncData时也能完整获取
 * 
 * 
 */

/**
 * LUIController类，任何扩展插件均基于此，继承其方法和属性
 * @param {Object} setting 配置参数 ***是可选的，为空时仅实例化对象，生成基本的HTML结构，之后可调用实例方法***
 * @param {Function} callback 回调事件
//实例化插件方法
//$(selector).()
//$(selector).(url)
//$(selector).(data)
//$(selector).(setting)
//new Selectbox(selector)
//new Selectbox(setting),setting里设置了选择器
//new Selectbox(selector,url)
//new Selectbox(selector,data)
//new Selectbox(selector,setting)
//window.selectbox(selector)
//window.selectbox(setting),setting里设置了选择器
//window.selectbox(selector,url)
//window.selectbox(selector,data)
//window.selectbox(selector,setting)                       
 */
var LUIController = function (setting, callback) {
	var me = this;
	//一些不开放的属性(状态)
	me._type = me._type || "luicontroller"; //类型，用于_filterArguments函数过滤有用参数得知插件对象的具体类型名称
	me._version = me._version || "0.5.0";
	me._isInitStaticHtml = false; //是否为静态页面方式初始化（即直接通用HTML的方式生成节点并提供数据）
	me._isInitLoadComplete = false; //首页数据加载初始化，为了避开再次刷新节点(再次调用refreshNode()方法)
	me._isLoading = false; //数据是否正在加载中（是否已完成数据加载，每次使用load方法重载数据时都会重置为false）
	me._isLoadComplete = false; //数据是否加载完毕，每次创建节点(addNode)时均为重置为true，检测到数据未加载完时重置为false(比如子节点未加载完毕时继续加载)
	me._waitingRefreshNode = $(); //暂存变动了数据的节点，等待刷新，调用未传入参数的refreshNode()方法时，默认刷新这里暂存的所有节点，并且重置为空jq对象
	me._waitingRefreshDataNode = $(); //暂存变动了数据的节点，等待刷新，调用未传入参数的refreshNodeData()方法时，默认刷新这里暂存的所有节点，并且重置为空jq对象
	me._asyncNode = $(); //暂存最近（最后）一次异步请求加载的所有节点
	me._selectedNode = $(); //启用选中节点记忆池(view.enabledSelectedMemory=true)后，暂存选中节点（将可以保留数据重载变后的已选中节点的选中状态）
	me._checkedNode = $(); //启用勾选节点记忆池(view.enabledSelectedMemory=true)后，暂存勾选节点（将可以保留数据重载变后的已勾选节点的勾选状态）
	me._expandedNode = $(); //启用展开节点记忆池(view.enabledSelectedMemory=true)后，暂存展开节点（将可以保留数据重载变后的已展开节点的展开状态）
	me._disabledNode = $(); //启用禁用节点记忆池(view.enabledSelectedMemory=true)后，暂存禁用节点（将可以保留数据重载变后的已禁用节点的禁用状态）
	me._initSelectedNode = $(); //暂存用户载入（load）数据或增加节点(addNode)时明确表示已选中状态的节点，然后要据当前实例对象的数据配置初始化节点的选中状态，之后会根据节点的点击选中状态实时更新。每次非持续加载数据时都会重置为空jq对象
	me._initCheckedNode = $(); //暂存用户载入（load）数据或增加节点(addNode)时明确表示已勾选状态的节点，然后要据当前实例对象的数据配置初始化节点的勾选状态，之后会根据节点的点击勾选状态实时更新。每次非持续加载数据时都会重置为空jq对象
	me._initExpandedNode = $(); //暂存用户载入（load）数据或增加节点(addNode)时明确表示已展开状态的节点，然后要据当前实例对象的数据配置初始化节点的展开状态，之后会根据节点的点击展开状态实时更新。每次非持续加载数据时都会重置为空jq对象
	me._initDisabledNode = $(); //暂存用户载入（load）数据或增加节点(addNode)时明确表示已禁用状态的节点，然后要据当前实例对象的数据配置初始化节点的禁用状态，之后会根据节点的点击禁用状态实时更新。每次非持续加载数据时都会重置为空jq对象
	me._expandedOrder = []; //暂存所有节点从最初展开到最后一次展开的顺序ID，每次重载(load)将清空，只保留当前面面下节点的展开顺序
	me._orderCounter = 0; //内置排序序号计数器，该项会强制按照数据的加载顺序设置，同时用户不要去改_orderid的值，要增加自定义排序时请重新命名一个排序字段排序分类

	//以下config里的配置是可以自定义覆盖，不是私有的
	me.config = {
		//插件ID：默认生成一个随机数值
		_roleId: Math.round(new Date().getMilliseconds() * Math.random() * 1000),
		//节点唯一ID计数器：唯一ID，我的农历生日~。~
		_uniqueId: 19890129,
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

		//关键字键配置：默认数据字段名称
		key: {
			dataKey: "data",
			childrenKey: "children",
			idKey: "id",
			nameKey: "name",
			pIdKey: "pId"
		},

		//数据源配置
		store: {
			data: [],
			d: []
				/*data: [
					//{"id":"01","name":"msl"}
					//数据源中必须设置id和name
					//若未设置ID，ID取值为_roleId+_uniqueId的值
					//若未设置NAME，NAME取值为ID
				],*/
		},

		//显示配置
		view: {
			//全局配置
			enabled: true, //插件是否可用
			enabledCtrol: false, //启用控制区，默认关闭false
			updateConfig: false, //只更新配置，不更新数据

			/*
            //自定义节点的HTML格式
            //返回一个HTML字符串，且必须要有一个最外包裹元素
            //nodeData，当前节点数据
            nodeFormater: function (nodeData) {
            	return "节点的HTML格式";
            },
			
            //自定义控制区HTML格式
            controlFormater: function () {
            	return "控制区的HTML格式";
            }*/

			//载入方式相关：
			loadMode: false, //全局加载模式，如果使用方法load()时未明确指定加载模式，则使用全局载入模式参数，为true表示持续加载，false（默认）表示覆盖加载，覆盖加载模式(false)且选中记忆池未启用时，会重置config._selectedNode为空jq对象
			addMode: me._type === "tree" ? true : false, //子节点加模式，启用时加载子节点数据，tree插件，默认为true，其他插件为false
			//AJAX状态提示类型：0无提示，1图片形式，其他值为文字形式(默认行式),支持回调事件(return返回HTML格式)，包含一个参数，代表ajax请求状态textStatus
			asyncStatusTipsType: 2,

			//刷新模式相关
			autoRefresh: false, //启用自动刷新节点（针对节点操作），默认关闭,数据量多时，建议关闭，手动刷新节点
			//refreshType: 1, //刷新方式（未开放），惰性刷新，延迟刷新，全部刷新

			//样式相关：节点样式
			//todo是否将内置的四种状态值样式名进行自定义配置，还有其他元素的样式
			nodeClass: "ext-node",
			firstNodeClass: "ext-first-node",
			lastNodeClass: "ext-last-node",

			//选中模式相关：
			enabledSelectMode: true, //启用高亮选中模式，默认启用，关闭后选中事件失效，但不会影响调用如selectNode()方法
			enabledSelectedMemory: false, //启用选中记忆池，默认关闭false
			//启用异选中记忆池后，会将选中的节点对明放入config._selectedNode里，即使后续使用load()重载内容后也不会将已选中的数据丢失
			selectedMultiple: false, //启用选中模式多选，默认关闭false
			selectedSize: null, //设置选中模式多选模式的同级别节点数量，默认不限制，负数会转成正数

			//勾选模式相关：
			enabledCheckMode: false, //启用勾选模式，默认关闭false 
			enabledCheckedMemory: false, //启用勾选记忆池，默认关闭false
			checkedMultiple: false, //启用勾选模式多选，默认关闭false
			checkedSize: null, //设置勾选模式多选模式的同级别节点数量，默认不限制，负数会转成正数

			//勾选和选中模式通用
			checkIsSelect: false, //勾选模式即选中事件，同时会绑定的勾选事件
			selectIsCheck: false, //checkIsSelect的别名，作用是一样的，以免记不住，负数会转成正数

			//禁用模式相关：
			enabledDisableMode: true, //启用勾选模式，默认关闭false 
			enabledDisabledMemory: false, //启用勾选记忆池，默认关闭false
			disabledMultiple: true, //启用勾选模式多选，默认启用true
			disabledSize: null, //设置勾选模式多选模式的同级别节点数量，默认不限制，负数会转成正数

			//展开模式相关：
			enabledExpandMode: me._type === "tree" ? true : false, //启用折叠模式，tree插件，默认为true，其他插件为false
			enabledExpandedMemory: false, //启用勾选记忆池，默认关闭false
			expandedMultiple: false, //启用折叠模式多选，默认关闭false
			expandedSize: null, //设置折叠模式多选模式的同级别节点数量，默认不限制（超过数量时，自动会收起最初展开的节点）
			expandSpeed: "normal", //展开速度，使用毫秒数，或内置的速度字符串"fast","slow","normal"，0表示无动画效果
			enabledDblClickExpand: false, //启用双击折叠模式，默认关闭false，若启用双击折叠模式，建议关闭选中模式，避免视觉上产生冲突
			showLine: false //显示层级线（功能暂未开通）
		},

		//回调函数
		callback: {
			/*//异步请求之前回调函数
			asyncBeforeSend: function (jqXHR, ajaxSetup) {},

			//异步请求失败回调函数
			asyncError: function (jqXHR, textStatus, errorMsg) {},

			//异步请求数据过滤回调函数
			asyncDataFilter: function (data, dataType) {},
			//异步请求成功回调函数

			asyncSuccess: function (data, textStatus, jqXHR) {},
			//异步请求完成后（无论加载成功还是失败）回调函数
			asyncComplete: function (jqXHR, textStatus) {},

			//控制区回调
			controlCallback: function (self) {},

			//配置参数回调函数，与loadCallback回调的区别在于
			//configCallback是在*数据加载初始化前*的最后配置变更，这里的回调函数应该只针对配置参数的变更，不涉及其方方面的变更（比如数据等）
			//而loadCallback是*数据加载初始化彻底完成后*的回调（load()方式加载数据的回调）
			configCallback: function (self) {},

			//数据载入成功后回调函数，在数据彻底初始化完成后执行
			loadCallback: function (self) {},

			//与的区别：一个是laod()方法触发，一个是addNode()方法触发
			//增加节点后的回调
			addCallback: function ($addNode, self) {},

			//每个节点生成时的回调函数
			//区别与节点格式化回调函数nodeFormater,nodeFormater必须返回的是一个带有HTML格式的字符串
			nodeCallback: function ($node, nodeData, self) {},

			//选中节点函数
			selectNode: function ($node, nodeData, self) {},

			//节点选中之前回调（只支持通过selectNode方法触发）
			nodeBeforeSelected: function ($node, nodeData, self) {},

			//节点选中回调（只支持通过selectNode方法触发）
			nodeSelected: function ($node, nodeData, self) {},

			//节点取消选中之前回调（只支持通过cancelSelectedNode方法触发）
			nodeBeforeCancelSelected: function ($node, nodeData, self) {},

			//节点取消选中回调（只支持通过cancelSelectedNode方法触发）
			nodeCancelSelected: function ($node, nodeData, self) {},

			//勾选节点函数
			checkNode: function ($node, nodeData, self) {},

			//节点勾选之前回调函数
			nodeBeforeChecked: function ( $node, nodeData, self) {},

			//节点勾选后回调函数
			nodeChecked: function ($node, nodeData,  self) {},

			//节点取消勾选之前回调函数
			nodeBeforeCancelChecked: function ( $node, nodeData, self) {},

			//节点取消勾选前回调函数
			nodeCancelChecked: function ( $node, nodeData, self) {},

			//节点展开回调函数
			expandNode: function ($node, nodeData, self) {},

			//节点展开后回调函数
			nodeExpanded: function ($node, nodeData, self) {},

			//节点展开之前回调函数
			nodeBeforeExpanded: function ($node, nodeData, self) {},

			//节点取消展开之前回调函数
			nodeBeforeCancelExpanded: function ($node, nodeData, self) {},

			//节点取消展开后回调函数
			nodeCancelExpanded: function ($node, nodeData, self) {},

			//节点禁用回调函数
			disableNode: function ($node, nodeData, self) {},

			//节点禁用后回调函数
			nodeDisabled: function ($node, nodeData, self) {},

			//节点禁用之前回调函数
			nodeBeforeDisabled: function ($node, nodeData, self) {},

			//节点取消禁用之前回调函数
			nodeBeforeCancelDisabled: function ($node, nodeData, self) {},

			//节点取消禁用后回调函数
			nodeCancelDisabled: function ($node, nodeData, self) {}*/
		},
		//默认事件动作
		action: {
			//初始化节点选中事件
			initSelectedNode: function () {
				//如果不支持勾选模式，则直接退出
				if (!me.config.view.enabledSelectMode) {
					return;
				}

				//从待勾选节点暂存池里取得待勾选的节点
				var $selectedNode = me._initSelectedNode;
				//如果启用了勾选即选中，则将待选中的节点也增加进来一起计算
				if (me.config.view.enabledSelectMode === true && (me.config.view.selectIsCheck === true || me.config.view.checkIsSelect === true)) {
					$selectedNode = $selectedNode.add(me._initCheckedNode);
				}

				//不存在待勾选节点时，则直接退出
				if ($selectedNode.length <= 0) return;

				//移除全部待勾选节点的勾选状态（重新勾选）
				//新增加节点：已选中则不再勾选 直接退出
				//  me.removeNodeState($selectedNode, "selected");

				//层级节点单选模式：勾选所有待勾选节点的第一个节点，不检查同级，忽略其他节点
				//层级节点多选模式：从每个待勾选节点的兄弟节点进行数量计数（不从所有节点，而是节点的同级节点），勾选达到中指定数量的节点为止

				//单级节点单选模式：勾选所有待勾选节点的第一个节点
				//单级节点多选模式：勾选所有待勾选节点的N个数量

				//勾选逻辑：根节点优先勾选
				var $rootNode = $selectedNode.filter("[data-level='0']");

				//非根节点
				var $leaveNode = $selectedNode.not($rootNode);

				var selectedSize;
				if (me.config.view.selectedMultiple === false) {
					//只要是单选模式，就强制过滤待勾选节点
					if ($rootNode.length > 0) {
						$rootNode = $rootNode.slice(0, 1);
						//无视其他节点
						$leaveNode = $();
					} else if ($leaveNode.length > 0) {
						$leaveNode = $rootNode.slice(0, 1);
					}
				} else if (me.config.view.selectedMultiple === true && $.type(me.config.view.selectedSize) == "number" && me.config.view.selectedSize != 0) {
					//多选模式，数字类型
					selectedSize = Math.abs(me.config.view.selectedSize);
					$rootNode = $rootNode.slice(0, selectedSize);
				} else {
					selectedSize = null;
				}

				if ($rootNode.length > 0) {
					//以要勾选中总数量遍历
					for (var i = 0; i < $rootNode.length; i++) {
						var $currentNode = $rootNode.eq(i);
						var currentData = me.getDataById($currentNode)[0];

						//勾选节点
						me.selectNode($currentNode);

						if (me.config.view.enabledCheckMode === true && me.config.view.checkedMultiple === false && (me.config.view.selectIsCheck === true || me.config.view.checkIsSelect === true) && currentData.checked !== currentData.selected) {
							var $checker = $currentNode.find("[data-role='checker']");
							//触发勾选事件
							$checker.trigger("click");
						}

						//多选模式下，触发勾选关系线
						if (me.config.view.selectedMultiple) {
							this._selectedAssociation($currentNode);
						}
					}
				}

				if ($leaveNode.length > 0) {
					//若是不加载子节点数据模式
					//临时兄弟节点
					var $tempSiblingsNode;
					//当前节点与上个节点的父ID相同时，说明他们是兄弟节点，则从临时节点里调出，不重复查询其他兄弟节点
					var prevNodePId;
					for (var i = 0; i < $leaveNode.length; i++) {
						var $currentNode = $leaveNode.eq(i);
						var currentData = me.getDataById($currentNode)[0];

						//子节点加载模式
						//获取当前节点兄弟节点和已勾选的兄弟节点
						var $siblingsNode
						if (prevNodePId == currentData[me.config.key.pIdKey]) {
							//相同父ID，从暂存区获取
							$siblingsNode = $tempSiblingsNode;
						} else {
							$siblingsNode = me.getSiblingsNode($currentNode, true);
							$tempSiblingsNode = $siblingsNode;
							prevNodePId = currentData[me.config.key.pIdKey];
						}

						var $selectedSiblingsNode = me.getNodeByState($siblingsNode, "selected");
						var selectedNodeLength = $selectedSiblingsNode.length;

						//假如当前兄弟节点中已勾选的节点数量已经大于或等于最大限制勾选数量时，跳过本次】
						if (selectedSize && selectedSize <= selectedNodeLength) continue;

						me.selectNode($currentNode);

						if (me.config.view.enabledCheckMode === true && me.config.view.checkedMultiple === false && (me.config.view.selectIsCheck === true || me.config.view.checkIsSelect === true) && currentData.checked !== currentData.selected) {
							var $checker = $currentNode.find("[data-role='checker']");
							//触发勾选事件
							$checker.trigger("click");
						}

						if (me.config.view.selectedMultiple) {
							//多选模式下，触发勾选关系线
							this._selectedAssociation($currentNode);
						}
					}
				}
				/*
				//如果不支持选中模式，则直接退出
				if (!me.config.view.enabledSelectMode) {
				    return;
				}

				//初始化选中状态，如果单选模式，只选中第一个节点
				//从暂存里取得要选中的节点

				var $selectedNode = me._initSelectedNode;

				//如果启用了选中即勾选，则将勾选中的节点也增加进来一起计算
				if (me.config.view.enabledCheckMode === true && (me.config.view.selectIsCheck === true || me.config.view.checkIsSelect === true)) {
				    $selectedNode = $selectedNode.add(me._initCheckedNode);
				}

				//不存在选中节点
				if ($selectedNode.length <= 0) return;

				//移除全部选中节点的选中状态
				me.removeNodeState($selectedNode, "selected");

				//取得多选模式下时的多选数量，待用
				var selectedSize;
				if ($.type(me.config.view.selectedSize) == "number" && me.config.view.selectedSize >= 1) {
				    selectedSize = me.config.view.selectedSize;
				}

				if (!me.config.view.selectedMultiple) {
				    //单选
				    var $currentNode = $selectedNode.eq(0);
				    var currentData = me.getDataById($currentNode)[0];
				    me.selectNode($currentNode);

				    if (me.config.view.enabledCheckMode === true && me.config.view.checkedMultiple === false && (me.config.view.selectIsCheck === true || me.config.view.checkIsSelect === true) && currentData.checked !== currentData.selected) {
				        var $checker = $currentNode.find("[data-role='checker']");
				        //触发勾选事件
				        $checker.trigger("click");
				    }
				} else {
				    //多选
				    //TODO 更改逻辑，减少getSiblingsNode的次数
				    for (var i = 0; i < $selectedNode.length; i++) {
				        var $currentNode = $selectedNode.eq(i);
				        var currentData = me.getDataById($currentNode)[0];
				        //获取当前节点兄弟节点和已选中的兄弟节点
				        var $siblingsNode = me.getSiblingsNode($currentNode, true);

				        var $selectedSiblingsNode = me.getNodeByState($siblingsNode, "selected");
				        var selectedNodeLength = $selectedSiblingsNode.length;

				        //假如当前兄弟节点中勾选中的节点数量已经大于或等于最大限制勾选数量时，跳过本次
				        if (selectedSize <= selectedNodeLength) continue;

				        me.selectNode($currentNode);

				        //节点之间的选中关系线
				        this._selectedAssociation($currentNode);
				        //假如启用了勾选即选中为selectIsCheck=true
				        //同时启用了勾选模式enaenabledCheckMode=true
				        //且目前checked与selected数据是不一致的
				        //行为逻辑需要一致
				        if (me.config.view.enabledCheckMode === true && me.config.view.checkedMultiple === true && (me.config.view.selectIsCheck === true || me.config.view.checkIsSelect === true) && currentData.checked !== currentData.selected) {
				            var $checker = $currentNode.find("[data-role='checker']");
				            //触发勾选事件
				            $checker.trigger("click");
				        }
				    }
				}*/
			},
			//初始化节点勾选事件
			initCheckedNode: function () {
				//如果不支持勾选模式，则直接退出
				if (!me.config.view.enabledCheckMode) {
					return;
				}

				//从待勾选节点暂存池里取得待勾选的节点
				var $checkedNode = me._initCheckedNode;

				//如果启用了勾选即选中，则将待选中的节点也增加进来一起计算
				if (me.config.view.enabledCheckMode === true && (me.config.view.selectIsCheck === true || me.config.view.checkIsSelect === true)) {
					$checkedNode = $checkedNode.add(me._initSelectedNode);
				}


				//不存在待勾选节点时，则直接退出
				if ($checkedNode.length <= 0) return;

				//移除全部待勾选节点的勾选状态（重新勾选）
				//新增加节点：已选中则不再勾选 直接退出
				//  me.removeNodeState($checkedNode, "checked");

				//层级节点单选模式：勾选所有待勾选节点的第一个节点，不检查同级，忽略其他节点
				//层级节点多选模式：从每个待勾选节点的兄弟节点进行数量计数（不从所有节点，而是节点的同级节点），勾选达到中指定数量的节点为止

				//单级节点单选模式：勾选所有待勾选节点的第一个节点
				//单级节点多选模式：勾选所有待勾选节点的N个数量

				//勾选逻辑：根节点优先勾选
				var $rootNode = $checkedNode.filter("[data-level='0']");

				//非根节点
				var $leaveNode = $checkedNode.not($rootNode);

				var checkedSize;
				if (me.config.view.checkedMultiple === false) {
					//只要是单选模式，就强制过滤待勾选节点
					if ($rootNode.length > 0) {
						$rootNode = $rootNode.slice(0, 1);
						//无视其他节点
						$leaveNode = $();
					} else if ($leaveNode.length > 0) {
						$leaveNode = $rootNode.slice(0, 1);
					}
				} else if (me.config.view.checkedMultiple === true && $.type(me.config.view.checkedSize) == "number" && me.config.view.checkedSize != 0) {
					//多选模式，数字类型
					checkedSize = Math.abs(me.config.view.checkedSize);
					$rootNode = $rootNode.slice(0, checkedSize);
				} else {
					checkedSize = null;
				}

				if ($rootNode.length > 0) {
					//以要勾选中总数量遍历
					for (var i = 0; i < $rootNode.length; i++) {
						var $currentNode = $rootNode.eq(i);
						var currentData = me.getDataById($currentNode)[0];

						//勾选节点
						me.checkNode($currentNode);

						if (me.config.view.enabledSelectMode === true && me.config.view.selectedMultiple === false && (me.config.view.selectIsCheck === true || me.config.view.checkIsSelect === true) && currentData.checked !== currentData.selected) {

							//触发选中事件
							$currentNode.trigger("click");
						}

						//多选模式下，触发勾选关系线
						if (me.config.view.checkedMultiple) {
							this._checkedAssociation($currentNode);
						}
					}
				}

				if ($leaveNode.length > 0) {
					//若是不加载子节点数据模式
					//临时兄弟节点
					var $tempSiblingsNode;
					//当前节点与上个节点的父ID相同时，说明他们是兄弟节点，则从临时节点里调出，不重复查询其他兄弟节点
					var prevNodePId;
					for (var i = 0; i < $leaveNode.length; i++) {
						var $currentNode = $leaveNode.eq(i);
						var currentData = me.getDataById($currentNode)[0];

						//子节点加载模式
						//获取当前节点兄弟节点和已勾选的兄弟节点
						var $siblingsNode
						if (prevNodePId == currentData[me.config.key.pIdKey]) {
							//相同父ID，从暂存区获取
							$siblingsNode = $tempSiblingsNode;
						} else {
							$siblingsNode = me.getSiblingsNode($currentNode, true);
							$tempSiblingsNode = $siblingsNode;
							prevNodePId = currentData[me.config.key.pIdKey];
						}

						var $checkedSiblingsNode = me.getNodeByState($siblingsNode, "checked");
						var checkedNodeLength = $checkedSiblingsNode.length;

						//假如当前兄弟节点中已勾选的节点数量已经大于或等于最大限制勾选数量时，跳过本次】
						if (checkedSize && checkedSize <= checkedNodeLength) continue;

						me.checkNode($currentNode);

						if (me.config.view.enabledSelectMode === true && me.config.view.selectedMultiple === false && (me.config.view.selectIsCheck === true || me.config.view.checkIsSelect === true) && currentData.checked !== currentData.selected) {
							//触发选中事件
							$currentNode.trigger("click");
						}

						if (me.config.view.checkedMultiple) {
							//多选模式下，触发勾选关系线
							this._checkedAssociation($currentNode);
						}
					}
				}
			},
			//初始化禁用事件
			initDisabledNode: function () {
				//如果不支持禁用模式，则直接退出
				if (!me.config.view.enabledDisableMode) {
					return;
				}

				//从待禁用节点暂存池里取得待禁用的节点
				var $disabledNode = me._initDisabledNode;

				//不存在待禁用节点时，则直接退出
				if ($disabledNode.length <= 0) return;

				//移除全部待禁用节点的禁用状态（重新禁用）
				//新增加节点：已选中则不再禁用 直接退出
				//  me.removeNodeState($disabledNode, "disabled");

				//层级节点单选模式：禁用所有待禁用节点的第一个节点，不检查同级，忽略其他节点
				//层级节点多选模式：从每个待禁用节点的兄弟节点进行数量计数（不从所有节点，而是节点的同级节点），禁用达到中指定数量的节点为止

				//单级节点单选模式：禁用所有待禁用节点的第一个节点
				//单级节点多选模式：禁用所有待禁用节点的N个数量

				//禁用逻辑：根节点优先禁用
				var $rootNode = $disabledNode.filter("[data-level='0']");

				//非根节点
				var $leaveNode = $disabledNode.not($rootNode);

				var disabledSize;
				if (me.config.view.disabledMultiple === false) {
					//只要是单选模式，就强制过滤待禁用节点
					if ($rootNode.length > 0) {
						$rootNode = $rootNode.slice(0, 1);
						//无视其他节点
						$leaveNode = $();
					} else if ($leaveNode.length > 0) {
						$leaveNode = $rootNode.slice(0, 1);
					}
				} else if (me.config.view.disabledMultiple === true && $.type(me.config.view.disabledSize) == "number" && me.config.view.disabledSize != 0) {
					//多选模式，数字类型
					disabledSize = Math.abs(me.config.view.disabledSize);
					$rootNode = $rootNode.slice(0, disabledSize);
				} else {
					disabledSize = null;
				}

				if ($rootNode.length > 0) {
					//以要禁用中总数量遍历
					for (var i = 0; i < $rootNode.length; i++) {
						var $currentNode = $rootNode.eq(i);
						var currentData = me.getDataById($currentNode)[0];

						//禁用节点
						me.disableNode($currentNode);

						//多选模式下，触发禁用关系线
						if (me.config.view.disabledMultiple) {
							this._disabledAssociation($currentNode);
						}
					}
				}

				if ($leaveNode.length > 0) {
					//若是不加载子节点数据模式
					//临时兄弟节点
					var $tempSiblingsNode;
					//当前节点与上个节点的父ID相同时，说明他们是兄弟节点，则从临时节点里调出，不重复查询其他兄弟节点
					var prevNodePId;
					for (var i = 0; i < $leaveNode.length; i++) {
						var $currentNode = $leaveNode.eq(i);
						var currentData = me.getDataById($currentNode)[0];

						//子节点加载模式
						//获取当前节点兄弟节点和已禁用的兄弟节点
						var $siblingsNode
						if (prevNodePId == currentData[me.config.key.pIdKey]) {
							//相同父ID，从暂存区获取
							$siblingsNode = $tempSiblingsNode;
						} else {
							$siblingsNode = me.getSiblingsNode($currentNode, true);
							$tempSiblingsNode = $siblingsNode;
							prevNodePId = currentData[me.config.key.pIdKey];
						}

						var $disabledSiblingsNode = me.getNodeByState($siblingsNode, "disabled");
						var disabledNodeLength = $disabledSiblingsNode.length;

						//假如当前兄弟节点中已禁用的节点数量已经大于或等于最大限制禁用数量时，跳过本次】
						if (disabledSize && disabledSize <= disabledNodeLength) continue;

						me.disableNode($currentNode);

						if (me.config.view.disabledMultiple) {
							//多选模式下，触发禁用关系线
							this._disabledAssociation($currentNode);
						}
					}
				}


				/*
				//如果不支持禁用模式，则直接退出
				if (!me.config.view.enabledDisableMode) {
				    return;
				}

				//初始化禁用状态，如果单选模式，只禁用第一个节点
				//从暂存里取得要禁用的节点
				var $disabledNode = me._initDisabledNode;

				//不存在禁用节点
				if ($disabledNode.length <= 0) return;

				//移除全部禁用节点的禁用状态
				me.removeNodeState($disabledNode, "disabled");

				//取得多选模式下时的多选数量，待用
				var disabledSize;
				if ($.type(me.config.view.disabledSize) == "number" && me.config.view.disabledSize >= 1) {
				    disabledSize = me.config.view.disabledSize;
				}

				if (!me.config.view.disabledMultiple) {
				    var $currentNode = $disabledNode.eq(0);
				    var currentData = me.getDataById($currentNode)[0];
				    me.disableNode($currentNode);
				} else {
				    //多选
				    for (var i = 0; i < $disabledNode.length; i++) {
				        var $currentNode = $disabledNode.eq(i);
				        var currentData = me.getDataById($currentNode)[0];
				        //获取当前节点兄弟节点和已禁用的兄弟节点
				        var $siblingsNode = me.getSiblingsNode($currentNode, true);
				        var $disabledSiblingsNode = me.getNodeByState($siblingsNode, "disabled");
				        var disabledNodeLength = $disabledSiblingsNode.length;

				        //假如当前兄弟节点中禁用的节点数量已经大于或等于最大限制禁用数量时，跳过本次
				        if (disabledSize <= disabledNodeLength) continue;

				        me.disableNode($currentNode);

				        //节点之间的禁用关系线
				        this._disabledAssociation($currentNode);
				    }
				}*/
			},
			//初始化节点展开事件
			initExpandedNode: function () {
				//如果不支持展开模式，则直接退出
				if (!me.config.view.enabledExpandMode) {
					return;
				}

				//从待展开节点暂存池里取得待展开的节点
				var $expandedNode = me._initExpandedNode;

				//不存在待展开节点时，则直接退出
				if ($expandedNode.length <= 0) return;

				//移除全部待展开节点的展开状态（重新展开）
				//新增加节点：已选中则不再展开 直接退出
				//  me.removeNodeState($expandedNode, "expanded");

				//层级节点单选模式：展开所有待展开节点的第一个节点，不检查同级，忽略其他节点
				//层级节点多选模式：从每个待展开节点的兄弟节点进行数量计数（不从所有节点，而是节点的同级节点），展开达到中指定数量的节点为止

				//单级节点单选模式：展开所有待展开节点的第一个节点
				//单级节点多选模式：展开所有待展开节点的N个数量

				//不过滤根节点
				var $leaveNode = $expandedNode;

				var expandedSize;
				if (me.config.view.expandedMultiple === false) {
					expandedSize = 1;
				} else if (me.config.view.expandedMultiple === true && $.type(me.config.view.expandedSize) == "number" && me.config.view.expandedSize != 0) {
					//多选模式，数字类型
					expandedSize = Math.abs(me.config.view.expandedSize);
				} else {
					expandedSize = null;
				}

				if ($leaveNode.length > 0) {
					//若是不加载子节点数据模式
					//临时兄弟节点
					var $tempSiblingsNode;
					//当前节点与上个节点的父ID相同时，说明他们是兄弟节点，则从临时节点里调出，不重复查询其他兄弟节点
					var prevNodePId;
					for (var i = 0; i < $leaveNode.length; i++) {
						var $currentNode = $leaveNode.eq(i);
						var currentData = me.getDataById($currentNode)[0];

						//子节点加载模式
						//获取当前节点兄弟节点和已展开的兄弟节点
						var $siblingsNode
						if (currentData.level !== 0 && prevNodePId == currentData[me.config.key.pIdKey]) {
							//相同父ID，从暂存区获取
							$siblingsNode = $tempSiblingsNode;
						} else {
							$siblingsNode = me.getSiblingsNode($currentNode, true);
							$tempSiblingsNode = $siblingsNode;
							prevNodePId = currentData[me.config.key.pIdKey];
						}


						var $expandedSiblingsNode = me.getNodeByState($siblingsNode, "expanded");
						var expandedNodeLength = $expandedSiblingsNode.length;

						//假如当前兄弟节点中已展开的节点数量已经大于或等于最大限制展开数量时，跳过本次】
						if (expandedSize && expandedSize <= expandedNodeLength) continue;

						me.expandNode($currentNode);
					}
				}
				/*
				                //如果不支持展开模式，则直接退出
				                if (!me.config.view.enabledExpandMode) {
				                    return;
				                }

				                //初始化展开状态，如果单选模式，只展开第一个节点
				                //从暂存里取得要展开的节点
				                var $expandedNode = me._initExpandedNode;

				                //不存在展开节点
				                if ($expandedNode.length <= 0) return;

				                //取消全部节点的展开状态
				                me.removeNodeState($expandedNode, "expanded");

				                //取得多选模式下时的多选数量，待用
				                var expandedSize;
				                if ($.type(me.config.view.expandedSize) == "number" && me.config.view.expandedSize >= 1) {
				                    expandedSize = me.config.view.expandedSize;
				                }

				                for (var i = 0; i < $expandedNode.length; i++) {
				                    var $currentNode = $expandedNode.eq(i);
				                    var currentData = me.getDataById($currentNode)[0];
				                    //获取当前节点兄弟节点和已展开的兄弟节点
				                    var $siblingsNode = me.getSiblingsNode($currentNode, true);
				                    var $expandedSiblingsNode = me.getNodeByState($siblingsNode, "expanded");
				                    var expandedNodeLength = $expandedSiblingsNode.length;

				                    if (!me.config.view.expandedMultiple) {
				                        //单选(同级节点中只勾选一个)
				                        //假如当前同级节点已存在勾选中的节点时，跳过本次
				                        if (expandedNodeLength > 0) continue;
				                    } else {
				                        //多选
				                        //假如当前兄弟节点中展开的节点数量已经大于或等于最大限制展开数量时，跳过本次
				                        if (expandedSize <= expandedNodeLength) continue;
				                    }
				                    me.expandNode($currentNode);
				                }*/
			},
			//选中节点事件
			selectNode: function ($node) {
				//如果不支持选中模式，则直接退出
				//如果启用了选中即勾选，则触发勾选事件
				if (!me.config.view.enabledSelectMode) {
					if ((me.config.view.selectIsCheck === true || me.config.view.checkIsSelect === true)) {
						//触发勾选事件

						var $checker = $node.find("[data-role='checker']");
						$checker.trigger("click");
					}
					return;
				}

				var nodeData = me.getDataById($node)[0];

				if (!me.config.view.selectedMultiple) {
					//单选模式
					if (nodeData.selected) {
						me.cancelSelectedNode($node);
					} else {
						var $selectedNode = me.getSelectedNode(true);
						me.cancelSelectedNode($selectedNode);
						me.selectNode($node);
					}
				} else {
					//多选
					if (nodeData.selected) {
						me.cancelSelectedNode($node);
					} else {
						var selectedSize = null;

						if ($.type(me.config.view.selectedSize) == "number" && me.config.view.selectedSize != 0) {
							//多选模式，数字类型
							selectedSize = Math.abs(me.config.view.selectedSize);
						} else {
							selectedSize = null;
						}

						if (!selectedSize) {
							//无限制时
							me.selectNode($node);
						} else {
							var $siblingsNode = me.getSiblingsNode($node, true);
							var $selectedSiblingsNode = me.getNodeByState($siblingsNode, "selected");

							var selectedNodeLength = $selectedSiblingsNode.length;
							//未限制或者已选中数还在限制数内
							if (selectedSize > selectedNodeLength) {
								me.selectNode($node);
							}
						}
					}
					//节点之间的选中关系线
					this._selectedAssociation($node);
				}

				//单选多选都会触发的
				//假如启用了勾选即选中为selectIsCheck=true
				//同时启用了勾选模式enaenabledCheckMode=true
				//且目前checked与selected数据是不一致的
				//行为逻辑需要一致
				if (me.config.view.enabledCheckMode === true && (me.config.view.selectIsCheck === true || me.config.view.checkIsSelect === true) && nodeData.checked !== nodeData.selected) {
					var $checker = $node.find("[data-role='checker']");
					//触发勾选事件
					$checker.trigger("click");
				}
			},
			//勾选节点事件
			checkNode: function ($node) {
				//单选模式下从始至终只会有一个节点是勾选状态，节点之间不会建立关系线，不会呈现出父节点或子节点的勾选状态
				//多选模式下，多节点勾选状态，节点之间会触发关系线
				//多选模式下的多选数量是针对于一个节点的兄弟节点间的数量而定，非针对全局，假如数量限制为1个时，并不表现出与单选相同效果，表示兄弟节点间只有一个节点能选中，其他不能选中

				//多选模式下节点间关系线逻辑
				//0.选中的该节点A 若存在子节点，则全部子节点全部勾选状态
				//1.选中的该节点A 若存在父节点B，根据该节点A的同级兄弟节点决定父节点的显示状态，可能为“部分选中”或“全部选中”状态，
				//2.若父节点B还存在父节点，再继续向上查询重复1-2的逻辑

				//如果不支持勾选模式，则直接退出
				if (!me.config.view.enabledCheckMode) {
					return;
				}
				var nodeData = me.getDataById($node)[0];

				if (!me.config.view.checkedMultiple) {
					//单选模式
					if (nodeData.checked) {
						me.cancelCheckedNode($node);
					} else {
						var $checkedNode = me.getCheckedNode(true);
						me.cancelCheckedNode($checkedNode);
						me.checkNode($node);
					}
				} else {
					//多选
					if (nodeData.checked) {
						me.cancelCheckedNode($node);
					} else {
						var checkedSize = null;

						if ($.type(me.config.view.checkedSize) == "number" && me.config.view.checkedSize != 0) {
							//多选模式，数字类型
							checkedSize = Math.abs(me.config.view.checkedSize);
						} else {
							checkedSize = null;
						}

						if (!checkedSize) {
							//无限制时
							me.checkNode($node);
						} else {
							var $siblingsNode = me.getSiblingsNode($node, true);
							var $checkedSiblingsNode = me.getNodeByState($siblingsNode, "checked");

							var checkedNodeLength = $checkedSiblingsNode.length;
							//未限制或者已选中数还在限制数内
							if (checkedSize > checkedNodeLength) {
								me.checkNode($node);
							}
						}
					}
					//节点之间的勾选关系线
					this._checkedAssociation($node);
				}

				//单选多选都会触发的
				//假如启用了勾选即选中为selectIsCheck=true
				//同时启用了选中模式enabledSelectMode=true
				//且目前checked与selected数据是不一致的
				//行为逻辑需要一致
				if (me.config.view.enabledSelectMode === true && (me.config.view.selectIsCheck === true || me.config.view.checkIsSelect === true) && nodeData.checked !== nodeData.selected) {
					//触发选中事件
					$node.trigger("click");
				}
			},
			//禁用节点事件
			disableNode: function ($node) {
				//如果不支持选中模式，则直接退出
				if (!me.config.view.enabledDisableMode) {
					return;
				}

				var nodeData = me.getDataById($node)[0];

				if (!me.config.view.disabledMultiple) {
					//单选模式
					if (nodeData.disabled) {
						me.cancelDisabledNode($node);
					} else {
						var $disabledNode = me.getNodeByState(me.getAllNode(), "disabled");
						me.cancelDisabledNode($disabledNode);
						me.disableNode($node);
					}
				} else {
					//多选
					if (nodeData.disabled) {
						me.cancelDisabledNode($node);
					} else {
						var disabledSize = null;
						if ($.type(me.config.view.disabledSize) == "number" && me.config.view.disabledSize != 0) {
							//多选模式，数字类型
							disabledSize = Math.abs(me.config.view.disabledSize);
						} else {
							disabledSize = null;
						}

						if (!disabledSize) {
							//无限制时
							me.disableNode($node);
						} else {
							var $siblingsNode = me.getSiblingsNode($node, true);
							var $disabledSiblingsNode = me.getNodeByState($siblingsNode, "disabled");

							var disabledNodeLength = $disabledSiblingsNode.length;
							//未限制或者已选中数还在限制数内
							if (disabledSize > disabledNodeLength) {
								me.disableNode($node);
							}
						}
					}
					//节点之间的勾选关系线
					this._disabledAssociation($node);
				}
			},
			//展开节点事件
			expandNode: function ($node) {
				//如果不支持展开模式，则直接退出
				if (!me.config.view.enabledExpandMode) {
					return;
				}

				var nodeData = me.getDataById($node)[0];

				//如果展开的是一个异步请求地址，且这个节点的请求“未”正在请求中且“未”请求加载过数据的，将发送请求
				//请求完成后，再展开节点
				if ($.type(nodeData[me.config.key.childrenKey]) == "string" && nodeData.isAsyncing == false && nodeData.isAsyncLoaded == false) {
					//如果请求节点是打开状态的，则先将其置为false
					if (nodeData.expanded === true) {
						me.removeNodeState($node, "expanded");
					}
					//向目标节点追加数据
					me.load(nodeData[me.config.key.childrenKey], true, $node);

					//循环计时器：异步请求加载完毕后，再展开节点，否则循环检测
					clearInterval(nodeData.loadInterval);
					nodeData.loadInterval = setInterval(function () {
						//找到该节点的子节点包裹对象
						if (nodeData.isAsyncLoaded == true) {
							clearInterval(nodeData.loadInterval);
							_expander($node, nodeData);
						}
					}, 100);
				} else {
					//正常的载入请求
					_expander($node, nodeData);
				}

				function _expander($node, nodeData) {

					//单选模式下，同级别节点只能展开一个
					if (!me.config.view.expandedMultiple) {
						//单选模式
						if (nodeData.expanded) {
							me.cancelExpandedNode($node, true);
						} else {
							//获取当前节点的兄弟节点
							var $siblingsNode = me.getSiblingsNode($node);
							var $expandedSiblingsNode = me.getNodeByState($siblingsNode, "expanded");

							me.cancelExpandedNode($expandedSiblingsNode, true);
							me.expandNode($node, true);
						}
					} else {
						//多选
						if (nodeData.expanded) {
							me.cancelExpandedNode($node, true);
						} else {


							var expandedSize = null;
							if ($.type(me.config.view.expandedSize) == "number" && me.config.view.expandedSize != 0) {
								//多选模式，数字类型
								expandedSize = Math.abs(me.config.view.expandedSize);
							} else {
								expandedSize = null;
							}

							if (!expandedSize) {
								//无限制时
								me.expandNode($node, true);
							} else {
								var $siblingsNode = me.getSiblingsNode($node, true);
								var $expandedSiblingsNode = me.getNodeByState($siblingsNode, "disabled");

								var expandedNodeLength = $expandedSiblingsNode.length;
								//未限制或者已选中数还在限制数内
								if (expandedSize > expandedNodeLength) {
									me.expandNode($node, true);
								} else {
									//已经达到最大限制数
									//从_expandedOrder里获取已展开的同级节点中最早展开的一个节点，并折叠它
									//取得最先匹配到的ID
									var siblingsId = _dataToArray(me.getDataById($siblingsNode, [me.config.key.idKey]));
									var index;
									for (var i = 0; i < me._expandedOrder.length; i++) {
										var index = $.inArray(me._expandedOrder[i], siblingsId);
										//已检索到，跳出循环
										if (index >= 0) break
									}
									me.cancelExpandedNode($siblingsNode.eq(index), true);
									me.expandNode($node, true);
								}
							}
						}
					}
				}
			},
			//选中节点之间的关系线
			_selectedAssociation: function ($node) {
				//TODO 非子节点加载模式，不调用关系线
				//不存在节点时，退出
				if ($node.length <= 0) {
					return;
				}

				var nodeData = me.getDataById($node)[0];

				//模拟check“局部勾选的处理方式”来达到理想效果，否则暂时没有别的处理方式达不到理想
				//若存在子节点且“该节点非部分选中状态”，则选中所有子节点
				if (nodeData.length > 0 && !$node.is(".selected-part")) {
					var $childrenNode = me.getChildrenNode($node);
					//根据当前节点选中状态，判断子级节点选中状态
					if (nodeData.selected === true) {
						me.selectNode($childrenNode);
					} else {
						me.cancelSelectedNode($childrenNode);
					}
				}

				//显示父节点的选中状态
				if (nodeData.hasParent) {
					//存在父节点
					var $parentNode = me.getNodeById(nodeData.pId);

					//获取当前节点的兄弟节点(通过获取父节点的子节点方式获取：比getSiblingsNode效率高点)和选中的兄弟节点
					var $siblingsNode = me.getChildrenNode($parentNode, true);
					var $siblingsSelectedNode = me.getNodeByState($siblingsNode, "selected");

					//当前父节点下子节点数量与“选中”的子节点数量相同，
					//设置为“全部选中”状态，并向上递归查找父节点的父节点的选中状态
					if ($siblingsNode.length == $siblingsSelectedNode.length) {
						//则选中父节点
						me.selectNode($parentNode);
						//$parentNode.removeClass("selected-part");
					} else if ($siblingsSelectedNode.length > 0 || $siblingsNode.filter(".selected-part").length > 0) {
						//不相等时，但至少有一个兄弟节点选中，或者兄弟节点中至少有一个“部分选中状态”，则显示部分选中状态
						//取消节点选中状态
						me.cancelSelectedNode($parentNode);
						$parentNode.addClass("selected-part");
					} else {
						//不相等，且兄弟节点中不存在“选中状态”和“部分选中状态”
						//取消节点选中状态
						me.cancelSelectedNode($parentNode);
						//$parentNode.removeClass("selected-part");
					}
					//递归判断父节点的选中状态
					this._selectedAssociation($parentNode);
				}
			},
			//勾选节点之间的关系线
			_checkedAssociation: function ($node) {
				//节点不存在时退出
				if ($node.length <= 0) {
					return;
				}

				var nodeData = me.getDataById($node)[0];

				//显示子节点的勾选状态
				//若存在子节点且“该节点非部分勾选状态”，则勾选所有子节点
				if (nodeData.length > 0 && !$node.is(".checked-part")) {
					var $childrenNode = me.getChildrenNode($node);

					//根据当前节点勾选状态，判断子级节点勾选状态
					if (nodeData.checked === true) {
						me.checkNode($childrenNode);
					} else {
						me.cancelCheckedNode($childrenNode);
					}
				}

				//显示父节点的勾选状态
				if (nodeData.hasParent) {
					//存在父节点
					var $parentNode = me.getNodeById(nodeData.pId);

					//获取当前节点的兄弟节点(通过获取父节点的子节点方式获取：比getSiblingsNode效率高点)和勾选中的兄弟节点
					var $siblingsNode = me.getChildrenNode($parentNode, true);

					var $siblingsCheckedNode = me.getNodeByState($siblingsNode, "checked");

					if ($siblingsNode.length == $siblingsCheckedNode.length) {
						//当前父节点下子节点数量与“勾选”的子节点数量相同，
						//设置为“全部勾选中”状态，并向上递归查找父节点的父节点勾选状态
						me.checkNode($parentNode);
					} else if ($siblingsCheckedNode.length > 0 || $siblingsNode.filter(".checked-part").length > 0) {
						//不相等时，但至少有一个兄弟节点选中，或者兄弟节点中至少有一个“部分勾选中状态”，则显示部分勾选状态
						//取消节点勾选中状态
						me.cancelCheckedNode($parentNode);
						$parentNode.addClass("checked-part");
					} else {
						//不相等，且兄弟节点中不存在“勾选状态”和“部分勾选状态”
						//取消节点勾选状态
						me.cancelCheckedNode($parentNode);
					}

					//递归判断父节点的勾选状态
					this._checkedAssociation($parentNode);
				}
			},
			//禁用节点之间的关系线
			_disabledAssociation: function ($node) {
				if ($node.length <= 0) {
					return;
				}

				var nodeData = me.getDataById($node)[0];

				//模拟check“局部禁用的处理方”来达到效果，否则暂时达不到理想状态
				//若存在子节点且“该节点非部分选中状态”，则选中所有子节点
				if (nodeData.length > 0 && !$node.is(".disabled-part")) {
					//获取该节点下的所有子节点
					var $childrenNode = me.getChildrenNode($node);
					//根据当前节点禁用状态，判断子级节点禁用状态
					if (nodeData.disabled === true) {
						me.disableNode($childrenNode);
					} else {
						me.cancelDisabledNode($childrenNode);
					}
				}

				//显示父节点的禁用状态
				if (nodeData.hasParent) {
					//存在父节点
					var $parentNode = me.getNodeById(nodeData.pId);

					//获取当前节点的兄弟节点(通过获取父节点的子节点方式获取：比getSiblingsNode效率高点)和禁用中的兄弟节点
					var $siblingsNode = me.getChildrenNode($parentNode, true);
					var $siblingsDisabledNode = me.getNodeByState($siblingsNode, "disabled");

					//当前父节点下子节点数量与“禁用”的子节点数量相同，
					//设置为“全部禁用中”状态，并向上递归查找父节点的父节点状态
					if ($siblingsNode.length == $siblingsDisabledNode.length) {
						//则禁用父节点
						me.disableNode($parentNode);
						//$parentNode.removeClass("disabled-part");
					} else if ($siblingsDisabledNode.length > 0 || $siblingsNode.filter(".disabled-part").length > 0) {
						//不相等时，但至少有一个兄弟节点选中，或者兄弟节点中至少有一个“部分选中状态”，则显示部分禁用状态
						//取消节点选中状态
						me.cancelDisabledNode($parentNode);
						$parentNode.addClass("disabled-part");
					} else {
						//不相等，且兄弟节点中不存在“禁用状态”和“部分禁用状态”
						//全部取消
						me.cancelDisabledNode($parentNode);
						//$parentNode.removeClass("disabled-part");
					}

					//递归判断父节点的禁用状态
					this._disabledAssociation($parentNode);
				}
			},
		}
	};

	//节点相关操作
	me._noder = {
		//创建节点并为节点节点增加节点属性和HTML属性
		_createNode: function (data) {
			//不清楚子节点中的数据格式是否符合要求，所以也需要进行验证
			var validateData = _validateData(data);

			//数据加载是否已完成，每当加载数据时设置为true，如遇节点存在了节点再设置为false未完成，等待下一次处理
			me._isLoadComplete = true;

			//检测要增加的数据ID 是否已存在于当前节点中，若已存在则不创建
			var allId = _dataToArray(me.getAllData(me.config.key.idKey));
			//增加项临时缓存区
			var $addNodeCache = $("<div/>");

			for (var i = 0; i < validateData.length; i++) {
				var currentData = validateData[i];
				//如果当前数据源ID已存在于真实节点中，则不再增加（也不作更新数据操作，因此使用者要清楚的知道自已是在addNode操作还是replaceNode操作）必须保证ID的唯一性
				if ($.inArray(currentData[me.config.key.idKey], allId) > -1) continue;
				var $addNode;

				//根据nodeFormater函数格式化节点
				if ($.type(me.config.view.nodeFormater) == "function") {
					$addNode = $(me.config.view.nodeFormater(currentData));
				} else {
					//默认格式:只输出name值
					$addNode = $('<div>' + currentData[me.config.key.nameKey] + '</div>');
				}

				//设置节点样式
				$addNode.addClass(me.config.view.nodeClass);

				//保存数据到data属性里
				$addNode.data("data", currentData);

				//增强版设置属性（必须）
				$addNode.attr("data-level", currentData.level);
				$addNode.addClass(me.config.view.nodeClass + "-" + currentData.level);

				//设置节点的HTML属性：ID（必须）、排序号、索引序号、角色名（必须）和初始样式
				$addNode.attr("data-id", currentData[me.config.key.idKey]);
				//$addNode.attr("data-orderid", currentData._orderId);
				//$addNode.attr("data-index", i);
				//$addNode.attr("data-pid", currentData[me.config.key.pIdKey]);
				$addNode.attr("data-role", "node");

				//缓存区暂存新增节点
				$addNodeCache.append($addNode);

				//最后，对node进行一个包裹
				var $nodeContainer = $("<div class='ext-node-container' data-role='node-container' />");
				//$nodeContainer.attr("data-pid", currentData.pId);
				$addNode.wrap($nodeContainer);

				//隐藏节点
				if (currentData.hidden === true) {
					me.hideNode($addNode);
				}

				//如果是内置的四种状态(selected,checked,expanded,disabled)，需要特别处理
				if (currentData.selected) {
					//先从状态值中先删除
					me.removeNodeState($addNode, "selected");
					//将当前节点暂存至全局属性里
					if (me.config.view.enabledSelectMode) {
						me._initSelectedNode = me._initSelectedNode.add($addNode);
					}
				}

				if (currentData.checked) {
					//先从状态值中先删除
					me.removeNodeState($addNode, "checked");
					//将当前节点暂存至全局属性里
					if (me.config.view.enabledCheckMode) {
						me._initCheckedNode = me._initCheckedNode.add($addNode);
					}
				}

				if (currentData.disabled) {
					//先从状态值中先删除
					me.removeNodeState($addNode, "disabled");
					//将当前节点暂存至全局属性里
					if (me.config.view.enabledDisableMode) {
						me._initDisabledNode = me._initDisabledNode.add($addNode);
					}
				}

				if (currentData.expanded) {
					//先从状态值中先删除
					me.removeNodeState($addNode, "expanded");
					//暂将当前节点存至全局属性里
					if (me.config.view.enabledExpandMode) {
						me._initExpandedNode = me._initExpandedNode.add($addNode);
					}
				}

				//(已清除四种内置样式)设置节点剩余的状态样式(交由addNodeState处理)
				if (currentData.state) {
					me.addNodeState($addNode, currentData.state);
				}

				//节点创建成功后（其他数据也创建完毕，提早执行节点回调，会造成有些数据可能还没有创建）的回调(还未附加到实际DOM里)
				if ($.type(me.config.callback.nodeCallback) == "function") {
					me.config.callback.nodeCallback($addNode, me.getDataById($addNode)[0], me);
				}

				//增加节点勾选按钮
				if (me.config.view.enabledCheckMode) {
					$addNode.prepend("<i class='ext-btn-checker' data-role='checker'></i>");
					//根据多选模式，增加样式
					if (me.config.view.checkedMultiple) {
						//多选选框
						$addNode.addClass("ext-checkbox");
					} else {
						//单选选框
						$addNode.addClass("ext-radio");
					}
				}


				//根据加载模式决定是否加载子节点
				if (me.config.view.addMode) {
					//如果存在子节点，说明加载未全部完成，需要递归继续加载(检测length，不检测hasChild，因为如果节点是ajax地址时也是证明他是有子节点的，只是未加载)
					if (currentData.length > 0) {
						me._isLoadComplete = false;
					}

					//存在子节，且子节点非请求地址时
					if (currentData.hasChild) {
						var $childContent = this._createChildContent($addNode);
						me._expander._createExpander($addNode);

						//如果是首次加载，则不递归创建子节点，以便快速显示出基础结构，之后加载时，可以再直接显示节点信息
						if (me._isInitLoadComplete === true) {
							//子节点对象为json地址时，不触发递归
							//递归
							if (currentData.length > 0) {
								$childContent.append(this._createNode(currentData[me.config.key.childrenKey]));
							}
						}
					}
				}
			}
			//返回的是包含node-container的节点格式
			return $addNodeCache.children();
		},
		//在节点内附加子节点内容区DOM
		_createChildContent: function ($node) {
			var nodeData = me.getDataById($node)[0];
			//查找当前节点的$childContent和$expander是否已存在，如不存在则创建
			var $childContent = this._getChildContent($node);
			if ($childContent.length <= 0) {
				//检测是否包含有子节点
				$childContent = $("<div/>");
				$childContent.addClass("ext-child-content ext-child-content-" + nodeData.level);
				$childContent.attr("data-role", "child-content");
				$childContent.attr("data-pid", nodeData[me.config.key.idKey]);
				this._getParentNodeContainer($node).append($childContent);
				//设置打开状态：不是一个异步地址，且expanded为true
				/*if (nodeData.expanded === true && nodeData.length > 0) {
					//todo expandNode
					$childContent.addClass("active");
				}*/
			}

			return $childContent;
		},
		//通过节点取得节点包裹对象
		_getParentNodeContainer: function ($node) {
			return $node.closest("[data-role='node-container']");
		},
		//通过节点取得包裹该节点的子内容节点对象
		_getParentChildContent: function ($node) {
			return $node.closest("[data-role='child-content']");
		},

		//取得指定节点的子内容节点对象
		_getChildContent: function ($node) {
			var childContentString = "";
			for (var i = 0; i < $node.length; i++) {
				var nodeData = me.getDataById($node.eq(i))[0];
				childContentString += '[data-role="child-content"][data-pid="' + nodeData[me.config.key.idKey] + '"],';
			}
			var $childContent = me.$content.find(childContentString.slice(0, -1));
			return $childContent;
		},
	};

	//展开按钮相关操作
	me._expander = {
		//创建子节点内容区DOM
		_createExpander: function ($node) {
			var nodeData = me.getDataById($node)[0];

			//启用，则创建，否则不创建
			if (me.config.view.enabledExpandMode) {
				var $expander = me._expander._getExpander($node);

				if ($expander.length <= 0) {
					var $expander = $("<span/>");
					$expander.addClass("ext-expander");
					$expander.attr("data-role", "expander");
					$node.prepend($expander);
					//设置打开状态：不是一个异步地址，且expanded为true
					/*if (nodeData.expanded === true && nodeData.length > 0) {
						$expander.addClass("active");
					}*/
				}
				return $expander;
			}
		},
		_getExpander: function ($node) {
			return $node.find("[data-role='expander']");
		}
	};

	//加载提示器
	me._loader = {
		//创建提示器
		_create: function ($contextNode) {
			//如果指定了$contextNode，则以目标节点位置设置提示器
			var $asyncContent;
			if ($contextNode && me.getNodeById($contextNode).length > 0) {
				var $targetNode = me.getNodeById($contextNode);
				$asyncContent = $targetNode;
			} else {
				$asyncContent = me.$content;
			}

			return $asyncContent.append("<span class='ext-loader' data-role='loader'></span>").find("[data-role='loader']");
		},
		_showTips: function (status, $contextNode) {
			var $asyncContent;
			if ($contextNode && me.getNodeById($contextNode).length > 0) {
				var $targetNode = me.getNodeById($contextNode);
				$asyncContent = $targetNode;
			} else {
				$asyncContent = me.$content;
			}

			var $loader = $asyncContent.find("[data-role='loader']");

			switch (status) {
			case "nodata":
				if (me.config.asyncStatusTipsType === 0) {
					//无提示
				} else if ($.type(me.config.view.asyncStatusTipsType) === "function") {
					var tipString = me.config.view.asyncStatusTipsType("nodata");
					$loader.html(tipString);
				} else {
					$loader.html("<span class='error'>暂无数据</span>");
				}
				break;
			case "success":
				if (me.config.view.asyncStatusTipsType === 0) {
					//无提示
				} else if (me.config.view.asyncStatusTipsType === 1) {
					$loader.html("<span class='ani-loading'></span>");
				} else if ($.type(me.config.view.asyncStatusTipsType) === "function") {
					var tipString = me.config.view.asyncStatusTipsType("success");
					$loader.html(tipString);
				} else {
					$loader.html("<span class='loading'>数据加载中，请稍候...</span>");
				}
				break;
			case "error":
				if (me.config.asyncStatusTipsType === 0) {
					//无提示
				} else if ($.type(me.config.view.asyncStatusTipsType) === "function") {
					var tipString = me.config.view.asyncStatusTipsType("error");
					$loader.html(tipString);
				} else {
					$loader.html("<span class='error'>数据加载失败，请联系管理员。</span>");
				}
				break;
			case "timeout":
				if (me.config.asyncStatusTipsType === 0) {
					//无提示
				} else if ($.type(me.config.view.asyncStatusTipsType) === "function") {
					var tipString = me.config.view.asyncStatusTipsType("timeout");
					$loader.html(tipString);
				} else {
					$loader.html("<span class='error'>数据加载超时，请重新刷新页面。</span>");
				}
				break;
			default:
				break;
			}
		},
		_remove: function ($contextNode) {
			//数据载入提示移除
			var $asyncContent;
			var $loader;
			if ($contextNode && me.getNodeById($contextNode).length > 0) {
				var $targetNode = me.getNodeById($contextNode);
				$asyncContent = $targetNode;
			} else {
				$asyncContent = me.$content;
			}

			$asyncContent.find("[data-role='loader']").remove();
		}
	};

	if (setting) {
		//非原型链式继承
		me.load(setting, callback);
	}
};


/**
 * 数据能耗加载完毕后再执行回调
 * @param   {Function}   callback 回调事件
 */

LUIController.prototype.ready = function (callback) {
	//定时器
	var me = this;

	clearInterval(me._readyInterval);

	me._readyInterval = setInterval(function () {
		//数据加载完毕且目前未正在加载
		//loadCallback已执行完毕
		//清除定时器，执行回调
		if (me._loadFlag == true && me._isLoading === false && me._isLoadComplete === true) {
			clearInterval(me._readyInterval);
			callback(me);
		}
	}, 30);
}

/**
 * 通过setting初始化各项设置，根据配置载入数据
 * 若在HTML页面中已存在即有的元素（格式上需要符合要求，数据以data-*绑定），且参数中也没有传入data，就会以此HTML作为原数据
 * data数据都是一份原数据的克隆，保持原数据的完整性，节点数据操作不会变更原数据
 * 对于data数据中一般要求存在id和name两个字段，若不存在id字段则按内置计器生成id（因此要注意ID不要与存在id的数据冲突），若不存在name字段，则使用id的内容
 * @param   {PlainObject||String||Array} setting 自定义配置参数，当有传入配置参数时会根据自定义项初始化（自定义性强），也可以直接传入异步请求地址（会按照默认异步方式处理）,还可以直接传入数据数组对 
 * @param   {Boolean} loadMode 加载模式，false（默认）时为增开不加载模式，会清除内容区，true时为持续加载模式，新加载的节点会附加到内容区末尾
 * @param   {JQObject} $contextNode 目标节点，加载节点附加的目标节点：为了便于统一使用习惯，增强版涉及到$contextNode的地方，均只接受JQ节点对象，不再接受字符串等类型
 * @param   {Function}   callback 回调事件（暂无实现）
 * @returns {PlainObject}  返回实例对本身
 */
LUIController.prototype.load = function (setting, loadMode, $contextNode, callback) {
	var filterArgs = _filterArguments(arguments, [["plainobject", "string", "array"], "boolean", "jqobject", "function"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.load(setting, loadMode, $contextNode, callback)";
		log(errorText, "color:#f00");
		return false;
	}

	setting = filterArgs[0];
	loadMode = filterArgs[1];
	$contextNode = filterArgs[2];
	callback = filterArgs[3];

	var me = this;

	//setting初始化Start：配置进行合并
	if ($.type(setting) == "string") {
		//异步请求链接地址
		me.config.async.enabled = true;
		me.config.async.url = setting;
		me.config.store[me.config.key.dataKey] = [];
	} else if ($.type(setting) == "array") {
		//直接数据源
		me.config.async.enabled = false;
		me.config.async.url = "";
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

	//更新loadMode的值
	loadMode = loadMode !== undefined ? loadMode : me.config.view.loadMode;

	//结构初始化Start：生成基本结构$me，$content，$control
	me.$me = $(me.config.selector).eq(0);
	me._selector = me.config.selector;

	//验证选择器是否正确且存在
	if (!me._selector) {
		var errorText = "%c" + me._type + me.config._roleId + " 初始化未指定选择器，请检查";
		log(errorText, "color:#f00");
		return false;
	} else if (me.$me.length <= 0) {
		var errorText = "%c" + me._type + me.config._roleId + " 初始化所需的选择器 " + me._selector + " 元素不存在，请检查";
		log(errorText, "color:#f00");
		return false;
	}

	//内容区和控制区DOM不管如何，都必须在初始化后存在
	//若已存在内容区DOM(格式要求需要符合格式)，则不再生成
	me.$content = me.$me.find('[data-role="content"]');
	if (me.$content.length <= 0) {
		//不存在，则创建
		me.$content = $('<div class="ext-content clearfix clear" data-role="content"></div>');
		me.$me.append(me.$content);
	}

	//若enabledControl=true，会再下面的操作中对控制区DOM进行移除
	//假如已存在控制区DOM(格式要求需要符合格式)，则不再生成
	me.$control = me.$me.find('[data-role="control"]');
	if (me.$control.length <= 0) {
		me.$control = $('<div class="ext-control clearfix clear" data-role="control"></div>');
		me.$content.before(me.$control);
	}

	//未启用节点记忆池功能，清空全局已选中节点
	if (!me.config.view.enabledSelectedMemory) {
		me._selectedNode = $();
	}

	//未启用节点记忆池功能，清空全局已勾选节点
	if (!me.config.view.enabledCheckedMemory) {
		me._checkedNode = $();
	}

	//未启用节点记忆池功能，清空全局已展开节点
	if (!me.config.view.enabledExpandedMemory) {
		me._expandedNode = $();
	}

	//未启用节点记忆池功能，清空全局已展开节点
	if (!me.config.view.enabledDisabledMemory) {
		me._disabledNode = $();
	}

	//初始化数据Start：根据请求方式加载节点
	//如果是异步请求
	//先看配置里的async是否启用了，同时url是否非空
	if (me.config.async.enabled === true && me.config.async.url) {
		//AJAX配置
		var ajaxSetup = {
			type: me.config.async.type,
			data: me.config.async.data,
			dataType: me.config.async.dataType,
			cache: me.config.async.cache,
		}

		//用户自定义的ajaxSetup配置
		if (me.config.async.ajaxSetup) {
			ajaxSetup = ajaxSetup.extentd(true, ajaxSetup, me.config.async.ajaxSetup);
		}

		//异步请求发送请求之前
		ajaxSetup.beforeSend = function (jqXHR, ajaxSetup) {
			//创建异步请求DOM
			me._loader._create($contextNode);
			if ($contextNode) {
				var targetData = me.getDataById($contextNode)[0];
				//当前节点正在异步请求中
				targetData.isAsyncing = true;
			}

			//自定义异步请求前回调事件
			if ($.type(me.config.callback.asyncBeforeSend) == "function") {
				me.config.callback.asyncBeforeSend(jqXHR, ajaxSetup);
			}
		}

		//异步请求失败
		ajaxSetup.error = function (jqXHR, textStatus, errorMsg) {
			//异步失败错误提示
			if (textStatus == "timeout") {
				me._loader._showTips("timeout", $contextNode);
			} else {
				me._loader._showTips("error", $contextNode);
			}
			//打印日志
			log("%c错误状态：" + textStatus + "，错误文本：" + errorMsg, "color:#f00");

			//自定义异步请求失败回调事件
			if ($.type(me.config.callback.asyncError) == "function") {
				me.config.callback.asyncError(jqXHR, textStatus, errorMsg);
			}
		}

		//异步请求成功后的数据处理
		ajaxSetup.dataFilter = function (data, dataType) {
			if ($.type(me.config.callback.asyncDataFilter) == "function") {
				me.config.callback.asyncDataFilter(data, dataType);
			}

			return data;
		}

		//异步请求成功
		ajaxSetup.success = function (data, textStatus, jqXHR) {
			//自定义异步请求成功回调事件
			if ($.type(me.config.callback.asyncSuccess) == "function") {
				me.config.callback.asyncSuccess(data, textStatus, jqXHR);
			}

			//判断接收到的data是setting配置，还是纯store数据源
			if (data.store) {
				//setting配置
				//覆盖config的配置
				//假如传入的数据源存在，则使用传入的数据源
				if (data && data.store && data.store[me.config.key.dataKey]) {
					me.config.store[me.config.key.dataKey] = data.store[me.config.key.dataKey];
				}
				me.config = $.extend(true, me.config, data);
			} else {
				//纯数据源
				//覆盖store配置
				//假如传入的数据源存在，则使用传入的数据源
				if (data[me.config.key.dataKey] !== undefined) {
					me.config.store[me.config.key.dataKey] = data[me.config.key.dataKey];
				}
				//仅覆盖数据源配置
				me.config.store = $.extend(true, me.config.store, data);
			}

			//自定义配置参数的回调函数
			if ($.type(me.config.callback.configCallback) == "function") {
				me.config.callback.configCallback(me)
			}

			//如果是异步加载，提前清空节点
			if (loadMode === false) {
				//非持续加载数据模式
				//先清空所有节点
				me.cleanNode();
			}

			//提示加载信息
			if (me.config.store[me.config.key.dataKey].length == 0) {
				//请求无数据：不使用init方式更新，这样做能保留住无数据的提示
				me._loader._showTips("nodata", $contextNode);
			} else {
				me._loader._showTips("success", $contextNode);
			}

			me._isLoading = true;

			//延迟加载（直接加载会造成无法显示加载提示语）
			setTimeout(function () {
				//设置数据加载中标记为true
				//数据加载完毕后保存至全局数据里，以备待用
				me._asyncNode = _initData(me.config.store[me.config.key.dataKey]);
			}, 15);

		}

		//异步请求完成后（无论成功还是失败）
		ajaxSetup.complete = function (jqXHR, textStatus) {
			if ($.type(me.config.callback.asyncComplete) == "function") {
				me.config.callback.asyncComplete(jqXHR, textStatus);
			}
		}

		//发送异步请求
		$.ajax(me.config.async.url, ajaxSetup);
	} else {
		//静态数据载入
		//自定义配置参数的回调函数
		if ($.type(me.config.callback.configCallback) == "function") {
			me.config.callback.configCallback(me);
		}
		//不更新数据，只更新配置
		//设置数据加载中标记为true
		me._isLoading = true;

		_initData(me.config.store[me.config.key.dataKey]);
	}

	//绑定事件Start（因确保configCallback回调顺利执行，绑定事件，要放在初始化数据后面执行）
    
	//插件不可用时，不添加事件
	if (!me.config.view.enabled) {
		me.$me.addClass("ext-disabled");
	} else {
		addEventListener();
		me.$me.removeClass("ext-disabled");
	}

	if (me.config.async.enabled) {
		//如果是异步加载方式
		//定时器：检测数据是否已完成加载，数据加载完毕后执行loadCallback，避免数据未加载完全的情况下造成的错误
		//先清除原来的定时器
		clearInterval(me._loadInterval);
		me._loadInterval = setInterval(function () {

			//数据加载完毕且目前未正在加载
			//清除定时器，执行回调
			if (me._isLoading === false && me._isLoadComplete === true) {
				clearInterval(me._loadInterval);
				loadEnding();
			}
		}, 18);
	} else {
		loadEnding();
	}


	//加载结束
	function loadEnding() {
		//静态加载时，节点状态初始化
		if (me._isInitStaticHtml === false) {
			me.config.action.initSelectedNode();
			me.config.action.initCheckedNode();
			me.config.action.initExpandedNode();
			me.config.action.initDisabledNode();
		}
		me._isInitStaticHtml = true;

		//全局加载回调
		if ($.type(me.config.callback.loadCallback) == "function") {
			me.config.callback.loadCallback(me);
		}

		me._loadFlag = true;
	}

	return me;

	//委派事件
	function addEventListener() {
		//节点点击事件
		me.$content.off("click._default", "[data-role='node']");
		me.$content.on("click._default", "[data-role='node']", function (event) {
			event.stopPropagation();
			var $node = $(this);
			var nodeData = me.getDataById($node)[0];

			//禁用节点不执行事件
			if (nodeData.disabled === true) {
				return false;
			}

			me.config.action.selectNode($node);

			if (me.config.view.enabledSelectMode && $.type(me.config.callback.selectNode) == "function") {
				me.config.callback.selectNode($node, nodeData, me);
			}
		});

		//节点勾选事件
		if (me.config.view.enabledCheckMode) {
			me.$content.off("click._default", "[data-role='checker']");
			me.$content.on("click._default", "[data-role='checker']", function (event) {
				event.stopPropagation();
				var $node = $(this).closest("[data-role='node']");
				var nodeData = me.getDataById($node)[0];

				//禁用节点不执行事件
				if (nodeData.disabled === true) {
					return false;
				}

				me.config.action.checkNode($node);

				if (me.config.view.enabledCheckMode && $.type(me.config.callback.checkNode) == "function") {
					me.config.callback.checkNode($node, nodeData, me);
				}
			});
		}

		//节点双击展开事件(双击的触发时间是300毫秒内)
		if (me.config.view.enabledDblClickExpand) {
			me.$content.off("dblclick._default", "[data-role='node']");
			//默认选项点击事件
			me.$content.on("dblclick._default", "[data-role='node']", function (event) {
				event.stopPropagation();
				var $node = $(this);
				var nodeData = me.getDataById($node)[0];

				me.config.action.expandNode($node);

				if (me.config.view.enabledExpandMode && $.type(me.config.callback.expandNode) == "function") {
					me.config.callback.expandNode($node, nodeData, me);
				}
			});
		}

		//节点展开事件
		if (me.config.view.enabledExpandMode) {
			me.$content.off("click._default", "[data-role='expander']");
			me.$content.on("click._default", "[data-role='expander']", function (event) {
				event.stopPropagation();
				var $node = $(this).closest("[data-role='node']");
				var nodeData = me.getDataById($node)[0];

				me.config.action.expandNode($node);

				if (me.config.view.enabledExpandMode && $.type(me.config.callback.expandNode) == "function") {
					me.config.callback.expandNode($node, nodeData, me);
				}
			});
		}

		//启用控制区
		if (me.config.view.enabledControl) {
			me.$control.empty();

			//控制区回调
			if ($.type(me.config.callback.controlCallback) == "function") {
				//存在控制器回调时执行
				me.config.callback.controlCallback(me);
			}

			//控制区格式化回调
			if ($.type(me.config.view.controlFormater) == "function") {
				//先清空
				var controlHtml = me.config.view.controlFormater();
				me.$control.append(controlHtml);
			}
		} else {
			//移除
			me.$me.find('[data-role="control"]').remove();
		}
	}

	//初始化数据
	function _initData(data) {
      
		//克隆数据并验证数据
		var validateData = _validateData(data);
		var $addNode = $();
		//加载的几种情况
		//注意：首次加载后一定要么进行数据加载，要么不加载数据，但无论是否加载，首次过后，第二次就不再支持静态化了
		//1.首次加载，不传配置，不传数据，表示静态化或者表示什么都不做，仅生成实例对象
		//2.首次加载，传配置，不传数据，表示静态化或者表示什么都不做，仅生成实例对象
		//3.首次加载，不传配置，传数据，表示动态加载数据
		//4.首次加载，传配置，传数据，表示动态加载数据
		//5.二次加载，不传配置，传数据，表示动态加载
		//6.二次加载，传配置，不传数据(指undefined值)，表示*不*加载数据，但更新配置(该例子与view.updateConfig=ture相似，但updateConfig更新配置时不刷新原数据(不管你是否传入了新的数据)，而这个例子支持刷新原数据)
		//7.二次加载，传配置，传数据，表示动态加载*新数据*

		//存在数据源时一定会重加数据
		//传入数据为空数组且非首次加载

		//明确表示更新配置时，不重载数据（适合一些只有配置上的变化，节点本身没有大改变时，否则建议数据也一起重载）
		if (!me.config.view.updateConfig && (validateData.length > 0 || (validateData.length == 0 && me._isInitStaticHtml === true))) {
			//根据加载模式判断是否清空已存在节点
			if (loadMode === false) {
				//非持续加载数据模式
				//先清空所有节点
				me.cleanNode();

				//再清空其他内容
				me.$content.empty();
				//重置一些全局属性值（只在覆盖加载模式下重置）
				//重置首次加载标记（避免新增加的节点重复刷新）
				me._isInitLoadComplete = false;
				//重置状态节点暂存池
				me._initSelectedNode = $();
				me._initCheckedNode = $();
				me._initExpandedNode = $();
				me._initDisabledNode = $();
				me._waitingRefreshNode = $();
				me._waitingRefreshDataNode = $();
				me._expandedOrder = [];
			}

			$addNode = me.addNode(validateData, $contextNode, callback);
			//提前设置
			me._isInitStaticHtml = true;
		} else if (validateData.length == 0 && me._isInitStaticHtml === false) {
			//什么样的情况下才会静态初始化呢
			//1.在配置中没有数据源，或者数据源为不存在
			//静态页面未初始化过（即为首次初始化）
			//数据项为0且是静态页面数据初始化
			//静态格式需要符合要求
			//为了减少视觉差异，请优先设置样式
			//包裹子节点有data-role="content"属性
			//节点必需要有data-role="node"属性，为了减少逻辑错误，请优先指定id（除非你能保证页面不刷新）,为了减少显示逻辑错误，对应设置了状态的节点，优先设置状态样式
			//节点必须要有包裹，节点包裹有data-role="node-container"属性
			//子节点必须要有data-role="child-content"属性
			//<div class="ext-content clearfix clear" data-role="content">
			//	<div class="ext-node-container" data-role="node-container">
			//		<div class="ext-node" data-role="node" data-id="###"><span class="name" data-role="namer">莫胜利</span></div>
			//	</div>
			//	<div class="ext-child-content" data-role="child-content">
			//		<div class="ext-node" data-role="node" data-id="###"><span class="name" data-role="namer">莫胜利</span></div>
			//	</div>
			//</div>
			$addNode = me.getAllNode();

			//设置节点自已的一些信息
			//对HTML上的属性数据进行存储，以备调用
			//首先缓存data-*，id，name和image
			for (var i = 0; i < $addNode.length; i++) {
				//对每一个对象缓存数据
				//置空
				var $currentNode = $addNode.eq(i);

				//去除原来所有样式
				$currentNode.addClass(me.config.view.nodeClass);
				//设置节点包裹
				me._noder._getParentNodeContainer($currentNode).addClass("ext-node-container");
				//设置节点包裹
				var $childContent = $currentNode.siblings("[data-role='child-content']");
				$childContent.addClass("ext-child-content");

				//设置数据存储对象
				$currentNode.data("data", {});
				var currentData = $currentNode.data("data");

				//缓存节点上用户绑定的data-*数据（注意，不要绑定一些影响逻辑的数据，比如orderId,level等等，这些数据会自动生成，如果你设置了也会被覆盖）
				for (var key in $currentNode.data()) {
					if (key != "role" && key != "data") {
						//对于空值字段使用true数据
						//同时内置的4种状态字段特殊处理
						if ($currentNode.data()[key] === "" || key == "selected" || key == "checked" || key == "expanded" || key == "disabled") {
							currentData[key] = true;
						} else {
							currentData[key] = $currentNode.data()[key];
						}
					}
				}

				//隐藏节点
				if ($currentNode.is(".hidden") || currentData.hidden) {
					me.hideNode($currentNode);
				}

				//如果节点存在id且data-id不存在时，使用id属性，否则随机生成
				if (!$currentNode.attr("data-id") && $currentNode.attr("id")) {
					currentData[me.config.key.idKey] = $currentNode.attr("id");
				} else if (!$currentNode.attr("data-id")) {
					currentData[me.config.key.idKey] = me.config._roleId + "" + me.config._uniqueId++;
				}

				//如果节点存在名称角色，则以角色文本为准，如果节点中不存在name字段数据，则选取节点内的所有文本作为name字段
				//name字段不存在时
				var $namer = $currentNode.find("[data-role='namer']");

				if (currentData[me.config.key.nameKey] === undefined && $namer.length > 0) {
					currentData[me.config.key.nameKey] = $.trim($namer.text());
				} else if (currentData[me.config.key.nameKey] === undefined) {
					currentData[me.config.key.nameKey] = $.trim($currentNode.text());
				}

				//设置字段数据(内部设置，不以用户绑定为主)
				currentData._orderId = me._orderCounter++;
				currentData._owner = me.config._roleId;
				currentData._role = "node";
				currentData.isAsyncLoaded = false;
				currentData.isAsyncing = false;

				//获取该节点下的子节点(直接检索方式)
				var $childrenNode = $childContent.children("[data-role='node-container']").children("[data-role='node']");

				//若已存在children字段，且是字符串格式
				if ($.type(currentData[me.config.key.childrenKey]) !== "string") {
					if ($childrenNode.length > 0) {
						//存在子节点
						currentData.length = $childrenNode.length;
						currentData.hasChild = true;
						//无法得到正确的子节点数据
						currentData[me.config.key.childrenKey] = [];
					} else {
						//不存在
						currentData.length = 0;
						currentData.hasChild = false;
						currentData[me.config.key.childrenKey] = [];
					}
				} else {
					currentData.length = 0;
					currentData.hasChild = true;
				}

				//状态值（转成数组类型）
				if (currentData.state) {
					currentData.state = currentData.state.split(",");
				} else {
					currentData.state = [];
				}

				//内置4种状态初始化
				//当前选中状态为true且selected字段未保存到state里
				if ($currentNode.is(".selected")) {
					currentData.selected = true;
				}
				if ($currentNode.is(".checked")) {
					currentData.checked = true;
				}
				if ($currentNode.is(".expanded")) {
					currentData.expanded = true;
				}
				if ($currentNode.is(".disabled")) {
					currentData.disabled = true;
				}

				if (currentData.selected === true && $.inArray("selected", currentData.state) < 0) {
					currentData.state.push("selected");
				} else {
					currentData.selected = false;
				}

				//当前选中状态为true且checked字段未保存到state里
				if (currentData.checked === true && $.inArray("checked", currentData.state) < 0) {
					currentData.state.push("checked");
				} else {
					currentData.checked = false;
				}

				//当前选中状态为true且expanded字段未保存到state里
				if (currentData.expanded === true && $.inArray("expanded", currentData.state) < 0) {
					currentData.state.push("expanded");
				} else {
					currentData.expanded = false;
				}

				//当前选中状态为true且disabled字段未保存到state里
				if (currentData.disabled === true && $.inArray("disabled", currentData.state) < 0) {
					currentData.state.push("disabled");
				} else {
					currentData.disabled = false;
				}

				//如果是内置的四种状态(selected,checked,expanded,disabled)，需要特别处理
				if (currentData.selected) {
					//先从状态值中先删除
					me.removeNodeState($currentNode, "selected");
					//将当前节点暂存至全局属性里
					if (me.config.view.enabledSelectMode) {
						me._initSelectedNode = me._initSelectedNode.add($currentNode);
					}
				}

				if (currentData.checked) {
					//先从状态值中先删除
					me.removeNodeState($currentNode, "checked");
					//将当前节点暂存至全局属性里
					if (me.config.view.enabledCheckMode) {
						me._initCheckedNode = me._initCheckedNode.add($currentNode);
					}
				}

				if (currentData.disabled) {
					//先从状态值中先删除
					me.removeNodeState($currentNode, "disabled");
					//将当前节点暂存至全局属性里
					if (me.config.view.enabledDisableMode) {
						me._initDisabledNode = me._initDisabledNode.add($currentNode);
					}
				}

				if (currentData.expanded) {
					//先从状态值中先删除
					me.removeNodeState($currentNode, "expanded");
					//暂将当前节点存至全局属性里
					if (me.config.view.enabledExpandMode) {
						me._initExpandedNode = me._initExpandedNode.add($currentNode);
					}
				}

				//(已清除四种内置样式)设置节点剩余的状态样式(交由addNodeState处理)
				if (currentData.state) {
					me.addNodeState($currentNode, currentData.state);
				}

				//设置节点级别
				var $parentChildContent = me._noder._getParentChildContent($currentNode);

				if ($parentChildContent.length <= 0) {
					//不存在时，说明是根节点
					currentData.level = 0;
					currentData[me.config.key.pIdKey] = null;
					currentData.isRoot = true;
					currentData.hasParent = false;
				} else {
					//存在时，取得这个节点的数据
					var $parentNode = $parentChildContent.siblings("[data-role='node']");
					var parentNodeData = me.getDataById($parentNode)[0];
					currentData.level = parentNodeData.level + 1;
					currentData[me.config.key.pIdKey] = parentNodeData.id;
					currentData.isRoot = false;
					currentData.hasParent = true;
					parentNodeData[me.config.key.childrenKey].push(currentData);
				}

				//定义样式
				$currentNode.addClass(me.config.view.nodeClass + "-" + currentData.level);

				//设置节点HTML属性
				$currentNode.attr("data-id", currentData[me.config.key.idKey]);
				$currentNode.attr("data-level", currentData.level);

				$childContent.addClass("ext-child-content-" + currentData.level);
				$childContent.attr("data-pid", currentData.id);

				//增加节点勾选按钮
				$currentNode.find("[data-role='checker']").remove();
				if (me.config.view.enabledCheckMode) {
					$currentNode.prepend("<i class='ext-btn-checker' data-role='checker'></i>");
					//根据多选模式，增加样式
					if (me.config.view.checkedMultiple) {
						//多选选框
						$currentNode.addClass("ext-checkbox");
					} else {
						//单选选框
						$currentNode.addClass("ext-radio");
					}
				}

				$currentNode.find("[data-role='expander']").remove();

				//生成展开标记
				if (currentData.hasChild === true) {
					me._expander._createExpander($currentNode);
				}

				//根据当前节点的展开状式
				if (currentData.expanded === true) {
					me.expandNode($currentNode);
				}

			}
			//增加的数据绑定到配置里
			me.config.store[me.config.key.dataKey] = me.getDataById(me.getAllNode(0));
		}

		//无论首次加载是否是静态初始化或者是简单的数据加载，都设置如下属性
		//初始化加载已完毕
		me._isInitLoadComplete = true;
		//更新配置标记下一次就失效，多次更新配置时每次指定标 
		me.config.view.updateConfig = false;
		//数据是否正在加载中
		me._isLoading = false;
		//数据是否加载完毕
		me._isLoadComplete = true;
		return $addNode;
	}
}

/**
 * 根据传入的数据源生成节点
 * 1.不支持直接附加JQ节点对象
 * 2.当添加的数据源具有相同ID时，略过不添加
 * @param   {PlainObject||Array} data 数据源可以是直接健/值对的原生对象格式，也可以是多项健/值对的数组对象
 * @param   {JQObject} $contextNode JQ节点对象，数据加载时的目标节点，目标节点不存在时默认在根节点加载
 * @param   {Number} index  附加位置，正整数
 * @returns {JQObject} 返回增加的的JQ节点对象
 */
LUIController.prototype.addNode = function (data, $contextNode, index, callback) {
	var filterArgs = _filterArguments(arguments, [["plainobject", "array"], "jqobject", "number", "boolean", "function"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.addNode(data, $contextNode, index, callback)";
		log(errorText, "color:#f00");
		return false;
	}

	data = filterArgs[0];
	$contextNode = filterArgs[1];
	index = filterArgs[2];
	callback = filterArgs[4];

	var me = this;
	var validateData = _validateData(_cloneData(data));

	//如果有目标就向目标节点增加，没有目标节点就向根节点增加
	//第一次初始化进来加载目标一定是根节点
	//之后的后续加载可能是根节点也可能是目标节点
	//用isInitLoadComplete来判断是初始化加载还是后续加载
	var $addNode;
	//立即刷新的节点
	var $immediateRefreshNode = $();
	//load方式加载数据时，将返回内存中的节点结构，先不实际添加至真实DOM中
	if (me._isInitLoadComplete === false) {
		//del 首次加载节点时先加载数据结构的第一层，以便在页面中快速显示出实际DOM结构，之后再递归显示之后的层级数据
		//上述功能实现比较麻烦，会造成后续比较多的错误，比如选中延迟，数据未完成筛选
		//转换为复杂数据结构
		_transformData(validateData);
		me.$content.append(me._noder._createNode(validateData));
		//首次加载数据完成
		me._isInitLoadComplete = true;

		//启用子节点加载模式
		//如果数据未全部加载完毕，则启动后续加载
		//todo 测试延迟加载
		if (!me._isLoadComplete) {
			for (var i = 0; i < validateData.length; i++) {
				//当前层有子节点，且子节点是一个静态数据源且长度大于0（即非ajax地址，ajax地址为点击请求载入）
				if (validateData[i].length > 0 && validateData[i][me.config.key.childrenKey] && $.type(validateData[i][me.config.key.childrenKey]) == "array") {
					//向对应的节点内容区DOM附加节点
					me.$content.find("[data-role='child-content']").filter("[data-pid='" + validateData[i][me.config.key.idKey] + "']").append(me._noder._createNode(validateData[i][me.config.key.childrenKey]));
				}
			}
		}

		$addNode = me.getAllNode();
	} else {
		//非首次加载数据时，将根据目标节点追加节点
		var $targetContent;
		var targetData;
		var $targetChildrenNode;
		var $addNodeCache;
		//目标节点存在，且节点存在于DOM中，则按要求添加，否则添加到根节点
		if ($contextNode && $contextNode.length > 0) {
			var $targetNode = $contextNode;
			targetData = me.getDataById($targetNode)[0];
			//检测目标节点ID存在，准备添加到指定位置
			//DEL 优先为目标节点设置子节点数量，无法这样做：因为你不知道目标节点是否已经存在其他子节点
			//能直接确定jq节点对象之关系的数据，直接进行设置，比如优先设置层级level和父节点pId
			for (var i = 0; i < validateData.length; i++) {
				validateData[i].level = targetData.level + 1;
				validateData[i][me.config.key.pIdKey] = targetData[me.config.key.idKey];
			}
			//查找目标节点内容区DOM
			$targetContent = me._noder._getChildContent($targetNode);
			//若不存在，则创建（del 提前创建全部节点内容区的想法：避免HTML无用内容过多）
			//目标节点内容区不存在，且存在数据项时
			if ($targetContent.length <= 0 && validateData.length > 0) {
				$targetContent = me._noder._createChildContent($targetNode);
				me._expander._createExpander($targetNode);
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
			//目标节点不存在，新增节点添加到根节点
			//假如要添加位置的目标节点存在，则将目标节点的level值，优先更改
			for (var i = 0; i < validateData.length; i++) {
				validateData[i].level = 0;
				validateData[i][me.config.key.pIdKey] = null;
			}

			$targetContent = me.$content;
			$targetChildrenNode = me.getAllNode(0);
		}

		//转换为复杂数据结构
		_transformData(validateData);

		//结构都好了，创建节点并附加到目标节点的指定位置
		$addNodeCache = me._noder._createNode(validateData);

		$addNode = $addNodeCache.find("[data-role='node']");

		//插入到指定位置
		//位置不存在或超出范围时追加至末尾

		if (index >= 0 && index < $targetChildrenNode.length) {
			var $targetIndex = $targetChildrenNode.eq(index);
			var $targetNodeContainer = me._noder._getParentNodeContainer($targetIndex);
			$targetNodeContainer.before($addNodeCache);
		} else {
			$targetContent.append($addNodeCache);
		}

		//将新增的数据添加置目标节点，作为其新数据，保证节点上绑定的数据是一致的
		//倒序插入
		if (targetData !== undefined) {
			if ($.type(targetData[me.config.key.childrenKey]) !== "array") {
				targetData[me.config.key.childrenKey] = [];
			}
			for (var i = validateData.length - 1; i >= 0; i--) {
				targetData[me.config.key.childrenKey].splice(index, 0, validateData[i]);
			}
		}


		//刷新节点，再附加对象，del先附加节点，再刷新（先附加的话当数据量多时，能让用户先看到DOM显示，但也会卡在界面）
		//首次加载不需要再刷新数据，后续加载成功时刷新数据
		//刷新延迟执行，避免数据量过多时造成卡顿
		//del 直接刷新节点的原因是：不先加载DOM，再延迟刷新节点数据，因为延迟刷新还是会阻断了用户的操作
		//需要先加载DOM，不然结构无法成立

		//更新目标节点的数据的条件
		//有传入子节点数据，有目标节点，且存在目标节点
		if ($addNode.length > 0 && $contextNode && $contextNode.length > 0) {
			$immediateRefreshNode = $immediateRefreshNode.add($contextNode);
		}
	}


	if (callback) {
		callback($addNode, me)
	}

	//清除加载提示
	me._loader._remove($contextNode);

	//验证新加载的节点数据ID是否已在于节点记忆池中，如果存在，则高亮选中状态或勾选状态
	if (me.config.view.enabledSelectedMemory) {
		var allId = _dataToArray(me.getDataById($addNode, me.config.key.idKey));
		var selectedId = _dataToArray(me.getDataById(me._selectedNode, me.config.key.idKey));
		//存放要更新的节点和待移除的节点
		var $waitRemoveStateNode = $();
		var $waitAddStateNode = $();
		for (var i = 0; i < selectedId.length; i++) {
			var index = $.inArray(selectedId[i], allId);
			if (index >= 0) {
				$waitRemoveStateNode = $waitRemoveStateNode.add(me._selectedNode.eq(i));
				$waitAddStateNode = $waitAddStateNode.add($addNode.eq(index));
			}
		}
		//移除旧节点
		me.removeNodeState($waitRemoveStateNode, "selected");
		//更新新节点
		me.addNodeState($waitAddStateNode, "selected");
	}

	if (me.config.view.enabledCheckedMemory) {
		var allId = _dataToArray(me.getDataById($addNode, me.config.key.idKey));
		var checkedId = _dataToArray(me.getDataById(me._checkedNode, me.config.key.idKey));
		//存放要更新的节点和待移除的节点
		var $waitRemoveStateNode = $();
		var $waitAddStateNode = $();
		for (var i = 0; i < checkedId.length; i++) {
			var index = $.inArray(checkedId[i], allId);
			if (index >= 0) {
				$waitRemoveStateNode = $waitRemoveStateNode.add(me._checkedNode.eq(i));
				$waitAddStateNode = $waitAddStateNode.add($addNode.eq(index));
			}
		}
		//移除旧节点
		me.removeNodeState($waitRemoveStateNode, "checked");
		//更新新节点
		me.addNodeState($waitAddStateNode, "checked");
	}

	if (me.config.view.enabledExpandedMemory) {
		var allId = _dataToArray(me.getDataById($addNode, me.config.key.idKey));
		var expandedId = _dataToArray(me.getDataById(me._expandedNode, me.config.key.idKey));
		//存放要更新的节点和待移除的节点
		var $waitRemoveStateNode = $();
		var $waitAddStateNode = $();
		for (var i = 0; i < expandedId.length; i++) {
			var index = $.inArray(expandedId[i], allId);
			if (index >= 0) {
				$waitRemoveStateNode = $waitRemoveStateNode.add(me._expandedNode.eq(i));
				$waitAddStateNode = $waitAddStateNode.add($addNode.eq(index));
			}
		}
		//移除旧节点
		me.removeNodeState($waitRemoveStateNode, "expanded");
		//更新新节点
		me.addNodeState($waitAddStateNode, "expanded");
	}

	if (me.config.view.enabledDisabledMemory) {
		var allId = _dataToArray(me.getDataById($addNode, me.config.key.idKey));
		var disabledId = _dataToArray(me.getDataById(me._disabledNode, me.config.key.idKey));
		//存放要更新的节点和待移除的节点
		var $waitRemoveStateNode = $();
		var $waitAddStateNode = $();
		for (var i = 0; i < disabledId.length; i++) {
			var index = $.inArray(disabledId[i], allId);
			if (index >= 0) {
				$waitRemoveStateNode = $waitRemoveStateNode.add(me._disabledNode.eq(i));
				$waitAddStateNode = $waitAddStateNode.add($addNode.eq(index));
			}
		}
		//移除旧节点
		me.removeNodeState($waitRemoveStateNode, "disabled");
		//更新新节点
		me.addNodeState($waitAddStateNode, "disabled");
	}

	//每次(后续加载)加载节点后，都需要根据当前环境，初始化新的节点状态
	me.config.action.initSelectedNode();
	me.config.action.initCheckedNode();
	me.config.action.initExpandedNode();
	me.config.action.initDisabledNode();

	if ($.type(me.config.callback.addCallback) == "function") {
		me.config.callback.addCallback($addNode, me);
	}

	me.refreshNodeData($immediateRefreshNode);
	me.refreshNode($immediateRefreshNode);

	//返回新增节点
	return $addNode;

	//转换数据格式（递归）
	function _transformData(data) {
		for (var i = 0; i < data.length; i++) {
			//验证ID，若不存在，则生成唯一ID（每次刷新不同）
			//ID值存在，且是字符串或者数字类型，其他数据类型不受理
			if (!(data[i][me.config.key.idKey] !== undefined && ($.type(data[i][me.config.key.idKey]) == "string" || $.type(data[i][me.config.key.idKey]) == "number"))) {
				//不存在时时随机指定
				data[i][me.config.key.idKey] = me.config._roleId + "" + me.config._uniqueId++;
			}

		/*	//验证name值，若不存在则沿用ID值
			if (!data[i][me.config.key.nameKey]) {
				data[i][me.config.key.nameKey] = data[i][me.config.key.idKey];
			}*/

			//再增加其他数据：角色、内部排序号
			data[i]._role = "node";
			data[i]._orderId = me._orderCounter++;
			//增加拥有者
			data[i]._owner = me.config._roleId;

			//验证状态值（转成数组类型）
			if (data[i].state) {
				if ($.type(data[i].state) != "array") {
					var temp = data[i].state;
					data[i].state = [];
					data[i].state.push(temp);
				} else {
					data[i].state = data[i].state;
				}
			} else {
				data[i].state = [];
			}

			//内置4种状态初始化
			//当前选中状态为true且selected字段未保存到state里
			if (data[i].selected === true && $.inArray("selected", data[i].state) < 0) {
				data[i].state.push("selected");
			} else {
				data[i].selected = false;
			}

			//当前选中状态为true且checked字段未保存到state里
			if (data[i].checked === true && $.inArray("checked", data[i].state) < 0) {
				data[i].state.push("checked");
			} else {
				data[i].checked = false;
			}

			//当前选中状态为true且expanded字段未保存到state里
			if (data[i].expanded === true && $.inArray("expanded", data[i].state) < 0) {
				data[i].state.push("expanded");
			} else {
				data[i].expanded = false;
			}

			//当前选中状态为true且disabled字段未保存到state里
			if (data[i].disabled === true && $.inArray("disabled", data[i].state) < 0) {
				data[i].state.push("disabled");
			} else {
				data[i].disabled = false;
			}

			//设置状态数组中的各个状态值为true
			for (var j = 0; j < data[i].state.length; j++) {
				data[i][data[i].state[j]] = true;
			}

			data[i].level = data[i].level || 0; //节点级别
			data[i][me.config.key.pIdKey] = data[i].level === 0 ? null : data[i][me.config.key.pIdKey]; //节点关联的父节点ID
			data[i].isRoot = data[i].level === 0 ? true : false; //是否为根节点
			data[i].hasParent = data[i].level === 0 ? false : true; //是否存在父节点
			data[i].isAsyncing = false; //节点正在异步请求中标记
			data[i].isAsyncLoaded = false; //异步请求数据是否已加载，判断它决定是否重新请求异步地址

			//设置节点的子节点相关数据
			//如存在子节点，且子节点是数据源数组，且长度大于0条
			//其他插件不取消子节点数据，我们要保持数据的完整性 
			if (data[i][me.config.key.childrenKey] && $.type(data[i][me.config.key.childrenKey]) == "array" && data[i][me.config.key.childrenKey].length > 0) {
				data[i].length = data[i][me.config.key.childrenKey].length;
				data[i].hasChild = true;
				//还需要为每个子节点添加前置数据
				for (var j = 0; j < data[i][me.config.key.childrenKey].length; j++) {
					data[i][me.config.key.childrenKey][j].level = data[i].level + 1;
					data[i][me.config.key.childrenKey][j][me.config.key.pIdKey] = data[i][me.config.key.idKey];
				}
				//递归转换数据
				_transformData(data[i][me.config.key.childrenKey]);
			} else if (data[i][me.config.key.childrenKey] && $.type(data[i][me.config.key.childrenKey]) == "string") {
				//如果子节点是一个异步请求地址
				data[i].length = 0;
				data[i].hasChild = true;
			} else {
				//如果不存在子节点，或者他的长度小于0
				data[i].length = 0;
				data[i].hasChild = false;
			}
		}
	}
}

/**
 * 销毁插件
 * @returns {JQObject}  返回移除的jq对象
 */
LUIController.prototype.destory = function () {
	return this.$me.detach();
}

/**
 * 获取指定[data-id]的JQ节点对象
 * @param   {JQObject} nodeId JQ节点对象 
 * @param   {Number} filterLevel 筛选节点的级别，缩小筛选范围，默认从根节点起开始计数筛选，如果指定了$contextNode，将从目标节点的级别开始计数（0为当前节点）
 * @param   {JQObject} $contextNode 筛选节点的级别的查找范围：为了便于统一使用习惯，增强版涉及到$contextNode的地方，均只接受JQ节点对象，不再接受其他数据类型
 * @returns {JQObject} 返回筛选到的JQ节点对象
 */
LUIController.prototype.getNodeById = function (nodeId, filterLevel, $contextNode) {
	var filterArgs = _filterArguments(arguments, [["number", "string", "array", "jqobject"], "number", "jqobject"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.getNodeById(nodeId, filterLevel, $contextNode)";
		log(errorText, "color:#f00");
		return false;
	}

	nodeId = filterArgs[0];
	filterLevel = filterArgs[1];
	$contextNode = filterArgs[2];

	var nodeIdArray = [];

	//转换为数组类型
	if ($.type(nodeId) == "array") {
		nodeIdArray = nodeId;
	} else {
		nodeIdArray[0] = nodeId;
	}

	//创建空的jq对象
	var $getNode = $();

	//限定获取节点的查找范围，获取当前插件内的
	//提升查询效率（拼接字 串）
	var nodeIdString = "";
	for (var i = 0; i < nodeIdArray.length; i++) {
		if ($.type(nodeIdArray[i]) == "number" || $.type(nodeIdArray[i]) == "string") {
			//$getNode = $getNode.add('[data-role="node"][data-id="' + nodeIdArray[i] + '"]', this.$content);
			nodeIdString += '[data-role="node"][data-id="' + nodeIdArray[i] + '"],';
		}
		if ($.type(nodeIdArray[i]) == "object" && !$.isPlainObject(nodeIdArray[i])) {
			for (var j = 0; j < nodeIdArray[i].length; j++) {
				var $currentNode = nodeIdArray[i].eq(j);
				var dataId = $currentNode.attr("data-id");
				if (dataId !== undefined) {
					//$getNode = $getNode.add('[data-role="node"][data-id="' + dataId + '"]', this.$content);
					nodeIdString += '[data-role="node"][data-id="' + dataId + '"],';

				}
			}
			//$getNode = $getNode.add(nodeIdArray[i], this.$content);
		}
	}

	$getNode = this.$content.find(nodeIdString.slice(0, -1));

	var targetData;
	if ($contextNode !== undefined) {
		$getNode = this._noder._getChildContent($contextNode).find($getNode);
		targetData = this.getDataById($contextNode)[0];
	}

	//(提升速度)从HTML结构层面上直接筛选
	if (filterLevel !== undefined) {
		if (targetData !== undefined) {
			$getNode = $getNode.filter("[data-level='" + (targetData.level + filterLevel) + "']");
		} else {
			$getNode = $getNode.filter("[data-level='" + filterLevel + "']");
		}
	}

	/*if (filterLevel !== undefined) {
		$childrenNode = $childrenNode.add(this.getAllNode(currentData.level + filterLevel, $currentNode));
	} else {
		$childrenNode = $childrenNode.add(this.getAllNode($currentNode));
	}*/



	/*	var contextFilter = "";
		if ($contextNode !== undefined) {
			for (var i = 0; i < $contextNode.length; i++) {
				var targetData = this.getDataById($contextNode.eq(i))[0];
				contextFilter += '[data-role="child-content"][data-pid="' + targetData[this.config.key.idKey] + '"],';
			}
			var $childContent = this.$content.find(contextFilter.slice(0, -1));
			$getNode = $childContent.find($getNode);
		}*/
	/*	//(提升速度)从HTML结构层面上直接筛选
		var contextFilter = "";
		if ($contextNode !== undefined) {
			for (var i = 0; i < $contextNode.length; i++) {
				var targetData = this.getDataById($contextNode.eq(i))[0];
				contextFilter += '[data-pid="' + targetData[this.config.key.idKey] + '"],';
			}
			$getNode = $getNode.filter(contextFilter.slice(0, -1));
		}*/

	//放弃（影响性能，下同）：从数据层面上筛选符合要求的节点
	/*	var $filterNode = [];

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
		}*/

	//放弃（影响性能，下同）：查找指定范围内的指定等级节点
	/*	var childContentString = "";
		if ($contextNode !== undefined) {
			for (var i = 0; i < $contextNode.length; i++) {
				var targetData = this.getDataById($contextNode.eq(i));
				childContentString += '[data-role="child-content"][data-pid="' + targetData[this.config.key.idKey] + '"],';
			}
			var $childContent = this.$content.find(childContentString.slice(0, -1));
			$getNode = $childContent.find($getNode);
		}*/

	//返回被查找到的对象
	return $getNode;
}

/**
 * 获取当前所有JQ节点对象
 * @param   {Number} filterLevel 筛选节点的级别
 * @param   {JQObject} $contextNode 筛选节点的级别的查找范围：为了便于统一使用习惯，增强版涉及到$contextNode的地方，均只接受JQ节点对象，不再接受字符串等类型
 * @returns {JQObject} 返回所有的JQ节点对象
 */
LUIController.prototype.getAllNode = function (filterLevel, $contextNode) {
	//过滤参数且重排理想结构
	var filterArgs = _filterArguments(arguments, ["number", "jqobject"]);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.getAllNode(filterLevel, $contextNode)";
		log(errorText, "color:#f00");
		return false;
	}

	filterLevel = filterArgs[0];
	$contextNode = filterArgs[1];

	var $allNode = this.$content.find('[data-role="node"]');

	var targetData;
	if ($contextNode !== undefined) {
		$allNode = this._noder._getChildContent($contextNode).find($allNode);
		targetData = this.getDataById($contextNode)[0];
	}

	//(提升速度)从HTML结构层面上直接筛选
	if (filterLevel !== undefined) {
		if (targetData !== undefined) {
			$allNode = $allNode.filter("[data-level='" + (targetData.level + filterLevel) + "']");
		} else {
			$allNode = $allNode.filter("[data-level='" + filterLevel + "']");
		}
	}

	return $allNode;
}

/**
 * 获取处于指定状态的JQ节点对象
 * @param   {Number} filterLevel 筛选节点的级别
 * @param   {JQObject} $contextNode 筛选节点的级别的查找范围：为了便于统一使用习惯，增强版涉及到$contextNode的地方，均只接受JQ节点对象，不再接受字符串等类型
 * @param   {Boolean} getMode 获取模式，true时表示只（一定）获取当前插件中的所有选中节点，false(默认)时表示可能会从enabledSelectedMemory里查找选中节点
 * @returns {JQObject} 返回被选中的JQ节点对象
 */
LUIController.prototype.getNodeByState = function ($node, state, filterLevel, $contextNode) {
	var filterArgs = _filterArguments(arguments, ["jqobject", ["string", "array"], "number", "jqobject"], 2);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.getNodeByState($node, state, filterLevel, $contextNode)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0];
	state = filterArgs[1];
	filterLevel = filterArgs[2];
	$contextNode = filterArgs[3];

	var $stateNode;
	var stateArray = [];
	if ($.type(state) == "string") {
		stateArray[0] = state;
	} else {
		stateArray = state;
	}

	var stateString = "";
	for (var i = 0; i < stateArray.length; i++) {
		stateString += "." + stateArray[i] + ",";
	}

	//(提升速度)从HTML结构层面上直接筛选
	$stateNode = $node.filter(stateString.slice(0, -1));

	var targetData;
	if ($contextNode !== undefined) {
		$stateNode = this._noder._getChildContent($contextNode).find($stateNode);
		targetData = this.getDataById($contextNode)[0];
	}

	//(提升速度)从HTML结构层面上直接筛选
	if (filterLevel !== undefined) {
		if (targetData !== undefined) {
			$stateNode = $stateNode.filter("[data-level='" + (targetData.level + filterLevel) + "']");
		} else {
			$stateNode = $stateNode.filter("[data-level='" + filterLevel + "']");
		}
	}

	return $stateNode;
}

/**
 * 获取选中的JQ节点对象
 * @param   {Number} filterLevel 筛选节点的级别
 * @param   {JQObject} $contextNode 筛选节点的级别的查找范围：为了便于统一使用习惯，增强版涉及到$contextNode的地方，均只接受JQ节点对象，不再接受字符串等类型
 * @param   {Boolean} getMode 选择模式，true时表示只（一定）选择当前插件中的所有选中节点，false(默认)时表示可能会从enabledSelectedMemory里查找选中节点
 * @returns {JQObject} 返回被选中的JQ节点对象
 */
LUIController.prototype.getSelectedNode = function (filterLevel, $contextNode, getMode) {
	var filterArgs = _filterArguments(arguments, ["number", "jqobject", "boolean"]);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.getSelectedNode(filterLevel, $contextNode, getMode)";
		log(errorText, "color:#f00");
		return false;
	}

	filterLevel = filterArgs[0];
	$contextNode = filterArgs[1];
	getMode = filterArgs[2] !== undefined ? filterArgs[2] : false;

	var $selectedNode;

	if (getMode || !this.config.view.enabledSelectedMemory) {
		$selectedNode = this.getNodeByState(this.getAllNode(), "selected");
	} else {
		$selectedNode = this._selectedNode;
	}

	var targetData;
	if ($contextNode !== undefined) {
		$selectedNode = this._noder._getChildContent($contextNode).find($selectedNode);
		targetData = this.getDataById($contextNode)[0];
	}

	//(提升速度)从HTML结构层面上直接筛选
	if (filterLevel !== undefined) {
		if (targetData !== undefined) {
			$selectedNode = $selectedNode.filter("[data-level='" + (targetData.level + filterLevel) + "']");
		} else {
			$selectedNode = $selectedNode.filter("[data-level='" + filterLevel + "']");
		}
	}

	return $selectedNode;
}


/**
 * 获取勾选的JQ节点对象
 * @param   {Number} filterLevel 筛选节点的级别
 * @param   {JQObject} $contextNode 筛选节点的级别的查找范围：为了便于统一使用习惯，增强版涉及到$contextNode的地方，均只接受JQ节点对象，不再接受字符串等类型
 * @param   {Boolean} getMode 获取模式，true时表示只（一定）获取当前插件中的所有选中节点，false(默认)时表示可能会从enabledSelectedMemory里查找选中节点
 * @returns {JQObject} 返回被选中的JQ节点对象
 */
LUIController.prototype.getCheckedNode = function (filterLevel, $contextNode, getMode) {
	var filterArgs = _filterArguments(arguments, ["number", "jqobject", "boolean"]);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.getCheckedNode(filterLevel, $contextNode, getMode)";
		log(errorText, "color:#f00");
		return false;
	}

	filterLevel = filterArgs[0];
	$contextNode = filterArgs[1];
	getMode = filterArgs[2] !== undefined ? filterArgs[2] : false;

	var $checkedNode;

	if (getMode || !this.config.view.enabledCheckedMemory) {
		$checkedNode = this.getNodeByState(this.getAllNode(), "checked");
	} else {
		$checkedNode = this._checkedNode;
	}

	var targetData;
	if ($contextNode !== undefined) {
		$checkedNode = this._noder._getChildContent($contextNode).find($checkedNode);
		targetData = this.getDataById($contextNode)[0];
	}

	//(提升速度)从HTML结构层面上直接筛选
	if (filterLevel !== undefined) {
		if (targetData !== undefined) {
			$checkedNode = $checkedNode.filter("[data-level='" + (targetData.level + filterLevel) + "']");
		} else {
			$checkedNode = $checkedNode.filter("[data-level='" + filterLevel + "']");
		}
	}

	return $checkedNode;
}



/**
 * 获取指定JQ节点对象的数据
 * 只支持获取直接的jq节点对象，不支持字符串或数字的ID值（因为要获取数据的节点可能已经不存在于真实DOM中，已被删除或者是暂存到了节点记忆池中）
 * 返回的是指向原数据源的引用，任何对返回数据源的修改，都会影响老数据源实时反应，如果想修改的数据不影响原数据，请先用cloneData克隆一份数据源
 * 存在filterKey参数时，将返回被筛选后的原数据源的克隆数据，任何对返回数据源的修改，都不会影响老数据源
 * 始终返回数组类型的数据源（即便只有一条的情况下）
 * @param   {JQObject} $node JQ节点对象 
 * @param   {String||Array} filterKey        指定要筛选的键名字符串，或键名数组，未指定时获取全部数据
 * @param   {Boolean} filterMode 筛选模式：简单模式false(默认)：仅部分包括即可返回数据源;严格筛选模式true：必须包括全部的键名才被筛选
 * @param   {Number} filterLevel 筛选节点的级别
 * @param   {JQObject} $contextNode 筛选节点的级别的查找范围：为了便于统一使用习惯，增强版涉及到$contextNode的地方，均只接受JQ节点对象，不再接受字符串等类型
 * @returns {JQObject}   返回指定JQ节点对象数据数组对象
 */

LUIController.prototype.getDataById = function ($node, filterKey, filterMode, filterLevel, $contextNode) {
	var filterArgs = _filterArguments(arguments, ["jqobject", ["string", "array"], "boolean", "number", "jqobject"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.getDataById($node, filterKey, filterMode, filterLevel, $contextNode)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0];
	filterKey = filterArgs[1];
	filterMode = filterArgs[2] !== undefined ? filterArgs[2] : false;
	filterLevel = filterArgs[3];
	$contextNode = filterArgs[4];

	var getData = [];

	for (var i = 0; i < $node.length; i++) {
		getData.push($node.eq(i).data("data"));
	}

	if (filterKey) {
		getData = _cloneData(getData);
		getData = _filterData(getData, filterKey, filterMode);
	}

	return getData;
};

/**
 * 获取当前插件所有JQ节点对象的数据
 * @param   {String|Array} filterKey        指定要筛选的键名字符串，或键名数组
 * @param   {Boolean} filterMode 筛选模式：简单模式false(默认)：仅部分包括即可返回数据源;严格筛选模式true：必须包括全部的键名才被筛选
 * @param   {Number} filterLevel 筛选节点的级别
 * @param   {JQObject} $contextNode 筛选节点的级别的查找范围：为了便于统一使用习惯，增强版涉及到$contextNode的地方，均只接受JQ节点对象，不再接受字符串等类型
 * @returns {JQObject}   返回所有JQ节点对象数据数组对象或空数组
 */

LUIController.prototype.getAllData = function (filterKey, filterMode, filterLevel, $contextNode) {
	var filterArgs = _filterArguments(arguments, [["string", "array"], "boolean", "number", "jqobject"]);
	//过滤参数且重排理想结构
	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.getAllData(filterKey, filterMode, filterLevel, $contextNode)";
		log(errorText, "color:#f00");
		return false;
	}

	filterKey = filterArgs[0];
	filterMode = filterArgs[1] !== undefined ? filterArgs[1] : false;
	filterLevel = filterArgs[2];
	$contextNode = filterArgs[3];

	var $allNode = this.getAllNode(filterLevel, $contextNode);

	var allData = this.getDataById($allNode, filterKey, filterMode);

	return allData;
}

/**
 * 获取处于指定状态的JQ节点对象的数据
 * @param   {String||Array} filterKey        指定要筛选的键名字符串，或键名数组
 * @param   {Boolean} filterMode 筛选模式：简单模式false(默认)：仅部分包括即可返回数据源;严格筛选模式true：必须包括全部的键名才被筛选
 * @param   {Number} filterLevel 筛选节点的级别
 * @param   {JQObject} $contextNode 筛选节点的级别的查找范围：为了便于统一使用习惯，增强版涉及到$contextNode的地方，均只接受JQ节点对象，不再接受字符串等类型
 * @returns {JQObject}   返回选中的JQ节点对象数据数组对象或空数组
 */
LUIController.prototype.getDataByState = function ($node, state, filterKey, filterMode, filterLevel, $contextNode) {
	var filterArgs = _filterArguments(arguments, ["jqobject", ["string", "array"], ["string", "array"], "boolean", "number", "jqobject"], 2);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.getSelectedData($node, state, filterKey, filterMode, filterLevel, $contextNode)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0];
	state = filterArgs[1];
	filterKey = filterArgs[2];
	filterMode = filterArgs[3] !== undefined ? filterArgs[3] : false;
	filterLevel = filterArgs[4];
	$contextNode = filterArgs[5];

	var $stateNode = this.getNodeByState($node, state, filterLevel, $contextNode);

	var stateData = this.getDataById($stateNode, filterKey, filterMode);

	return stateData;
}

/**
 * 获取选中状态JQ节点对象数据
 * @param   {String||Array} filterKey        指定要筛选的键名字符串，或键名数组
 * @param   {Boolean} filterMode 筛选模式：简单模式false(默认)：仅部分包括即可返回数据源;严格筛选模式true：必须包括全部的键名才被筛选
 * @param   {Number} filterLevel 筛选节点的级别
 * @param   {JQObject} $contextNode 筛选节点的级别的查找范围：为了便于统一使用习惯，增强版涉及到$contextNode的地方，均只接受JQ节点对象，不再接受字符串等类型
 * @returns {JQObject}   返回选中的JQ节点对象数据数组对象或空数组
 */
LUIController.prototype.getSelectedData = function (filterKey, filterMode, filterLevel, $contextNode) {
	var filterArgs = _filterArguments(arguments, [["string", "array"], "boolean", "number", "jqobject"]);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.getSelectedData(filterKey, filterMode, filterLevel, $contextNode)";
		log(errorText, "color:#f00");
		return false;
	}

	filterKey = filterArgs[0];
	filterMode = filterArgs[1] !== undefined ? filterArgs[1] : false;
	filterLevel = filterArgs[2];
	$contextNode = filterArgs[3];

	var $stateNode = this.getSelectedNode(filterLevel, $contextNode);

	var stateData = this.getDataById($stateNode, filterKey, filterMode);

	return stateData;
}

/**
 * 获取勾选状态JQ节点对象数据
 * @param   {String||Array} filterKey        指定要筛选的键名字符串，或键名数组
 * @param   {Boolean} filterMode 筛选模式：简单模式false(默认)：仅部分包括即可返回数据源;严格筛选模式true：必须包括全部的键名才被筛选
 * @param   {Number} filterLevel 筛选节点的级别
 * @param   {JQObject} $contextNode 筛选节点的级别的查找范围：为了便于统一使用习惯，增强版涉及到$contextNode的地方，均只接受JQ节点对象，不再接受字符串等类型
 * @returns {JQObject}   返回选中的JQ节点对象数据数组对象或空数组
 */
LUIController.prototype.getCheckedData = function (filterKey, filterMode, filterLevel, $contextNode) {
	var filterArgs = _filterArguments(arguments, [["string", "array"], "boolean", "number", "jqobject"]);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.getCheckedData(filterKey, filterMode, filterLevel, $contextNode)";
		log(errorText, "color:#f00");
		return false;
	}

	filterKey = filterArgs[0];
	filterMode = filterArgs[1] !== undefined ? filterArgs[1] : false;
	filterLevel = filterArgs[2];
	$contextNode = filterArgs[3];

	var $checkedNode = this.getCheckedNode(filterLevel, $contextNode);

	var checkedData = this.getDataById($checkedNode, filterKey, filterMode);

	return checkedData;
}


/**
 * 获取指定索引序号(在HTML页面上*实际看见*的节点的序位)的JQ节点对象，索引位置从0开始
 * 索引序号只针对可见的节点
 * 索引序号的计数方式为从上到下依次出现的顺序，可能通过filterLevel和$contextNode去缩小范围
 * @param   {Number||Array} 索引序位 接受数字和纯数字形式字符串
 * @param   {Number} filterLevel 筛选节点的级别
 * @param   {JQObject} $contextNode 筛选节点的级别的查找范围：为了便于统一使用习惯，增强版涉及到$contextNode的地方，均只接受JQ节点对象，不再接受字符串等类型
 * @returns {JQObject} 返回指定序位的JQ节点对象
 */
LUIController.prototype.getNodeByIndex = function (index, filterLevel, $contextNode) {
	var filterArgs = _filterArguments(arguments, [["number", "array"], "number", "jqobject"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.getNodeByIndex(index, filterLevel, $contextNode)";
		log(errorText, "color:#f00");
		return false;
	}

	index = filterArgs[0];
	filterLevel = filterArgs[1];
	$contextNode = filterArgs[2];

	var $allNode = this.getAllNode(filterLevel, $contextNode);

	//过滤可见的节点
	var $visibleNode = $allNode.filter(":visible");

	var $filterNode = $();

	var indexArray = [];
	if ($.type(index) == "number") {
		indexArray[0] = index;
	} else if ($.type(index) == "array") {
		indexArray = index;
	}

	for (var i = 0; i < indexArray.length; i++) {
		$filterNode = $filterNode.add($visibleNode.eq(indexArray[i]));
	}

	return $filterNode;
}


/**
 * 获取最近一次异步加载的所有节点
 * @param   {Number} filterLevel 筛选节点的级别
 * @param   {JQObject} $contextNode 筛选节点的级别的查找范围：为了便于统一使用习惯，增强版涉及到$contextNode的地方，均只接受JQ节点对象，不再接受字符串等类型
 * @returns {JQObject} 返回最后一次异步加载的所有节点
 */
LUIController.prototype.getAsyncNode = function (filterLevel, $contextNode) {
	var filterArgs = _filterArguments(arguments, ["number", "jqobject"]);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.getAsyncNode(filterLevel, $contextNode)";
		log(errorText, "color:#f00");
		return false;
	}

	filterLevel = filterArgs[0];
	$contextNode = filterArgs[1];

	var $getAsyncNode = this._asyncNode;

	var targetData;
	if ($contextNode !== undefined) {
		$getAsyncNode = this._noder._getChildContent($contextNode).find($getAsyncNode);
		targetData = this.getDataById($contextNode)[0];
	}

	//(提升速度)从HTML结构层面上直接筛选
	if (filterLevel !== undefined) {
		if (targetData !== undefined) {
			$getAsyncNode = $getAsyncNode.filter("[data-level='" + (targetData.level + filterLevel) + "']");
		} else {
			$getAsyncNode = $getAsyncNode.filter("[data-level='" + filterLevel + "']");
		}
	}

	return $getAsyncNode;
}




/**
 * 克隆数据源
 * 注意：克隆数据会增加一些额外数据字段，如是哪插件对原数据进行了克隆，会增加一个克隆者
 * 原数据的拥有者就清空了，新插件会变成拥有者
 * 还会增加如克隆次数的数据
 * @param   {PlainObject||Array} data     数据源可以是直接健/值对的原生对象格式，也可以是多项健/值对的数组对象
 * @returns {JQObject}   返回克隆后的数据源
 */
LUIController.prototype.cloneData = function (data) {
	var filterArgs = _filterArguments(arguments, [["plainobject", "array"]], 1);

	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.cloneData(data)";
		log(errorText, "color:#f00");
		return false;
	}

	data = filterArgs[0];

	var validateData = _validateData(data);
	var cloneDataArray = [];

	for (var i = 0; i < validateData.length; i++) {
		//原数据源克隆
		var cloneData = $.extend(true, {}, validateData[i]);

		//原数据增加新字段
		//增加被克隆次数
		validateData[i]._cloneCount = validateData[i]._cloneCount ? validateData[i]._cloneCount++ : 1;

		//克隆者的角色名，自已克隆自已就是自已
		validateData[i]._cloner = validateData[i]._cloner || [];

		//检测是否已存在该克隆者，
		if ($.inArray(this.config._roleId, validateData[i]._cloner) < 0) {
			validateData[i]._cloner.push(this.config._roleId);
		}

		//克隆数据增加新字段
		//这个克隆对象的持有者是谁？当前插件！
		cloneData._holder = this.config._roleId;

		cloneDataArray.push(cloneData);
	}

	//根据传入参数的数据类型，返回相同数据类型：如果为数组时也返回数组，如果为原始对象也返回对象格式
	if ($.type(data) != "array") {
		cloneDataArray = cloneDataArray[0];
	}

	return cloneDataArray;
}

/**
 * 克隆JQ节点对象，cloneMode为true时，会同时克隆一份原节点对象的数据，绑定到克隆节点上，clonemode为false时，克隆的对象将引用原节点对象上的数据，因此对克隆节点的数据操作不会影响到原数据的变化
 * @param   {JQObject} $node JQ节点对象 
 * @param   {Boolean} cloneMode 克隆模式，false(默认)时是独立复制了一份数据并克隆，还会附带一些克隆信息，ture时并不是克隆节点对象，而是对那个镜象对象的引用镜像，即数据指向是一致的，操作这个克隆的数据时，被克隆对象也会发生变更
 * @returns {JQObject} 返回克隆的JQ节点对象
 */
LUIController.prototype.cloneNode = function ($node, cloneMode) {
	var filterArgs = _filterArguments(arguments, ["jqobject", "boolean"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.cloneNode($node, cloneMode)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0];
	cloneMode = filterArgs[1] !== undefined ? filterArgs[1] : false;

	var $cloneNodeCache = $();

	for (var i = 0; i < $node.length; i++) {
		var $currentNode = $node.eq(i);

		var $cloneNode;
		if (cloneMode) {
			//引用同一数据源
			$cloneNode = $currentNode.clone(true);
		} else {
			//复制一份数据源
			$cloneNode = $currentNode.clone();
			var cloneData = this.cloneData(this.getDataById($currentNode))[0];
			$cloneNode.data("data", cloneData);
		}
		$cloneNodeCache = $cloneNodeCache.add($cloneNode);
	}

	return $cloneNodeCache;
}


/**
 * 获取指定节点的所有子节点，默认获取所有子节点，可以通过getMode或filterLevel筛选子节点层级
 * filterLevel是相对于当前节点的层级进行计数的，即如果想达到与getMode=true时相同的效果，只需要将filterLevel设置为1就可以了
 * @param   {JQObject} $node      JQ节点对象 
 * @param   {Boolean}  getMode 获取模式，true表示全部获取，false（默认）表示获取直接子节点
 * @param   {Number} filterLevel 筛选节点的级别（筛选置从当前节点算起），如直接子节点就为0，下一级为1
 * @returns {JQObject} 返回指定节点的子节点
 */
LUIController.prototype.getChildrenNode = function ($node, getMode, filterLevel) {
	var filterArgs = _filterArguments(arguments, ["jqobject", "boolean", "number"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.getChildrenNode($node, getMode, filterLevel)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0];
	getMode = filterArgs[1] !== undefined ? filterArgs[1] : false;
	filterLevel = filterArgs[2];

	var $childrenNode = $();

	for (var i = 0; i < $node.length; i++) {
		var $currentNode = $node.eq(i);
		var currentData = this.getDataById($currentNode)[0];
		if (getMode === true) {
			$childrenNode = $childrenNode.add(this.getAllNode(currentData.level + 1, $currentNode));
		} else {
			if (filterLevel !== undefined) {
				$childrenNode = $childrenNode.add(this.getAllNode(currentData.level + filterLevel, $currentNode));
			} else {
				$childrenNode = $childrenNode.add(this.getAllNode($currentNode));
			}
		}
	}

	return $childrenNode;
}

/**
 * 获取指定节点的所有兄弟节点，getMode模式规定是否包括自身
 * @param   {JQObject} $node JQ节点对象 
 * @param   {Number} getMode 兄弟节点获取模式，ture时表示包括查找兄弟节点时的自身节点，false（默认） 不包括自身
 * @returns {JQObject} 返回指定节点的所有兄弟节点
 */
LUIController.prototype.getSiblingsNode = function ($node, getMode) {
	var filterArgs = _filterArguments(arguments, ["jqobject", "boolean"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.getSiblingsNode($node, getMode)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0];
	getMode = filterArgs[1] !== undefined ? filterArgs[1] : false;

	var $siblingsNode = $();

	for (var i = 0; i < $node.length; i++) {
		var $currentNode = $node.eq(i);
		var currentData = this.getDataById($currentNode)[0];
		var $siblingsNodeCache;

		//不使用jq的siblings()方法查找，效率太低
		//如果是根节点，则查找所有根节点
		if (currentData.level == 0) {
			$siblingsNodeCache = this.getAllNode(0);
		} else {
			$siblingsNodeCache = this.getChildrenNode(this.getParentNode($currentNode), true);
		}

		if (!getMode) {
			//不包括自已
			$siblingsNodeCache = $siblingsNodeCache.not($currentNode);
		}

		$siblingsNode = $siblingsNode.add($siblingsNodeCache);
	}

	return $siblingsNode;
};

/**
 * 获取指定节点的父节点（通过pid查询）
 * @param   {JQObject} $node JQ节点对象 
 * @returns {JQObject} 返回指定指定节点的直接父节点
 */
LUIController.prototype.getParentNode = function ($node) {
	var filterArgs = _filterArguments(arguments, ["jqobject"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.getParentNode($node)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0];

	var $parentNode = $();

	for (var i = 0; i < $node.length; i++) {
		var $currentNode = $node.eq(i);

		var currentData = this.getDataById($currentNode)[0];

		if (currentData.level !== 0) {
			//非根节点
			$parentNode = this.getNodeById(currentData[this.config.key.pIdKey]);
			$parentNode = $parentNode.add($parentNode);
		}
	}

	return $parentNode;
};


/**
 * 插入指定JQ节点对象作为目标节点的子节点
 * 旧思路：作为兄弟节点插入到目标节点后方（因为插入的目标节点有可能会是一个无子节点内容区DOM，所以不使用此种方式）
 * 新思路：作为子节点插入到目标节点内的指定位置
 * 要插入的节点对象如果是不存在于真实DOM中，则直接附加
 * 要插入的节点如果是*实际DOM*中的节点，节点原位置移到目标节点指定位置
 * 插入节点的前后两个兄弟的进行直接的refreshNodeData()和refreshNode()
 * 插入节点的其他兄弟节点只刷新refreshNodeData()，放入_waitingRefreshDataNode存储池中，等待刷新
 * 插入节点如果没有兄弟节点，则对其父节点（若存在）刷新进行直接的refreshNodeData()和refreshNode()
 * 目标节点需要进行直接的refreshNodeData()和refreshNode()
 * @param   {JQObject} $node JQ节点对象 
 * @param   {JQObject} $contextNode JQ节点对象 目标节点如果不存在，则增加至根节点
 * @returns {PlainObject} 返回实例本身
 */
LUIController.prototype.insertNode = function ($node, $contextNode, index) {
	var filterArgs = _filterArguments(arguments, ["jqobject", "jqobject", "number"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.insertNode($node, $contextNode, index)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0];
	$contextNode = filterArgs[1];
	index = filterArgs[2];

	var $targetNode;
	var targetData;
	var $targetChildContent;
	var $targetChildrenNode;
	//立即刷新的节点
	var $immediateRefreshNode = $();

	//目标节点存在且存在于真实DOM中
	if ($contextNode !== undefined && this.getNodeById($contextNode).length > 0) {
		$targetNode = this.getNodeById($contextNode);
		targetData = this.getDataById($targetNode)[0];

		//获取目标节点的子内容区对象
		var $targetChildContent = this._noder._getChildContent($targetNode);

		//查看目标节点是否存在子内容区
		//如果子内容区不存在，则需要先创建再插入，并显示出展开箭头等（但不展开）
		if ($targetChildContent.length <= 0) {
			$targetChildContent = this._noder._createChildContent($targetNode);
			this._expander._createExpander($targetNode);

			//优先更新目标节点的子节点数量
			targetData.length = $node.length;
			targetData.hasChild = true;
		}

		$targetChildrenNode = this.getChildrenNode($targetNode, true);
	} else {
		//目标节点不存在，添加至根节点
		$targetChildContent = this.$content;
		$targetChildrenNode = this.getAllNode(0);
	}

	//按顺序插入进来
	for (var i = 0; i < $node.length; i++) {
		var $currentNode = $node.eq(i);
		var currentData = this.getDataById($currentNode)[0];

		var $nodeContainer = this._noder._getParentNodeContainer($currentNode);

		//刷新父节点
		$immediateRefreshNode = $immediateRefreshNode.add(this.getParentNode($currentNode));

		//插入到指定位置
		if (index >= 0 && index < $targetChildrenNode.length) {
			//取得指定位置的节点
			var $targetIndex = $targetChildrenNode.eq(index);
			var $targetNodeContainer = this._noder._getParentNodeContainer($targetIndex);

			//在他前面附加
			$targetNodeContainer.before($nodeContainer);
		} else {
			//未指明插入位置时，插入到末尾
			$targetChildContent.append($nodeContainer);
		}

		//优先操作：因为是插入到目标节点的操作，所以要将当前节点level更改为当前目标节点的下一级level
		//如果是插入目标是根节点，则设置为0
		currentData.level = targetData !== undefined ? targetData.level + 1 : 0;
		currentData[this.config.key.pIdKey] = currentData.level === 0 ? null : targetData[this.config.key.idKey];
		//同时更新HTML属性
		$currentNode.attr("data-level", currentData.level);
		//$currentNode.attr("data-pid", currentData[this.config.key.pIdKey]);

		//包括自已也要刷新
		$immediateRefreshNode = $immediateRefreshNode.add($currentNode);
	}

	//同时刷新数据与节点
	this.refreshNodeData($immediateRefreshNode);
	this.refreshNode($immediateRefreshNode);

	return this;
};

/**
 * 移除JQ节点对象(todo这里有变动过，验证是否正确)
 * @param   {JQObject} $node JQ节点对象 
 * @returns {JQObject} 返回移除的JQ节点对象
 */
LUIController.prototype.removeNode = function ($node) {
	var filterArgs = _filterArguments(arguments, ["jqobject"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.removeNode($node)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0];

	var $immediateRefreshNode = $();

	for (var i = 0; i < $node.length; i++) {
		var $currentNode = $node.eq(i);
		var currentData = this.getDataById($currentNode)[0];

		//要删除的节点确保还存在于节点中，如已经不存在，则略过
		if (this.$content.find($currentNode).length <= 0) continue;

		//刷新父节点
		//当前节点非根节点或未有数据时(静态化的数据)
		if (currentData && currentData.level !== 0) {
			$immediateRefreshNode = $immediateRefreshNode.add(this.getParentNode($currentNode));
		}

		this._noder._getParentNodeContainer($currentNode).remove();
	}

	$immediateRefreshNode = $immediateRefreshNode.not($node);

	//同时刷新数据与节点
	this.refreshNodeData($immediateRefreshNode);
	this.refreshNode($immediateRefreshNode);

	return this;
};

/**
 * 清空节点：移除所有JQ节点对象(只删除节点，不删除其他dom)
 * del 增强性能：直接删除，不调用removeNode();
 * @returns {JQObject} 返回移除的所有JQ节点对象
 */
LUIController.prototype.cleanNode = function () {
	var $allNode = this.getAllNode();

	this.removeNode($allNode);
	return this;
};

/**
 * 替换JQ节点对象，请求替换的只能是节点对象，不能是数据生成的对象（多次推论）
 * 可用一个或多个节点替换1个被替换目标节点，替换节点如果存在于真实DOM中，则会对替换节点进行移动到被替换目标节点的位置
 * 如果存在多个替换目标节点，取第一个的位置
 * 如果要在多个节点里插入相同的节点，请逐一进行，并手动对节点行克隆
 * 交换模式以第一个替换节点位置为准
 * @param   {Number||String|||JQObject} $node JQ节点对象 
 * @param   {JQObject} $targetNode JQ节点对象  被替换目标节点
 * @param   {Boolean}  replaceMode 替换模式，为true时为互相交换(交换的位置为替换节点的第一个位置)，为false时替换节点覆盖被替换节点
 * @returns {JQObject} 返回替换的JQ节点对象
 */
LUIController.prototype.replaceNode = function ($node, $targetNode, replaceMode) {
	var filterArgs = _filterArguments(arguments, ["jqobject", "jqobject", "boolean"], 2);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.replaceNode($node, $targetNode, replaceMode)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0];
	$targetNode = filterArgs[1];
	replaceMode = filterArgs[2] !== undefined ? filterArgs[2] : false;

	//存在替换节点和替换节点目标
	if ($node.length <= 0 || $targetNode.length <= 0) return this;

	//多个替换目标节点时只取第一个替换目标节点
	$targetNode = $targetNode.eq(0);

	//取得目标兄弟节点
	var $targetSiblingsNode = this.getSiblingsNode($targetNode, true);
	//取得目标位置
	var targetIndex = $targetSiblingsNode.index($targetNode);
	//取得目标节点的父节点
	var $targetParentNode = this.getParentNode($targetNode);

	//暂存替换节点的第一个节点的位置

	var $firstNode = $node.eq(0);
	var $firstSiblingsNode = this.getSiblingsNode($firstNode, true);
	//取得替换节点位置
	var fristIndex = $firstSiblingsNode.index($firstNode);
	//取得替换节点的父节点
	var $fristParentNode = this.getParentNode($firstNode);

	if (replaceMode) {
		//替换模式
		this.insertNode($node, $targetParentNode, targetIndex);
		this.insertNode($targetNode, $fristParentNode, fristIndex);
	} else {
		//覆盖模式
		this.insertNode($node, $targetParentNode, targetIndex);
		this.removeNode($targetNode);
	}

	return this;
};

/**
 * 节点数据源增加一项记录或多项记录
 * 增加的节点数据不会实时呈现，请使用refreshNode（）更新
 * 增加一项记录时可以使用key和value两个参数，多项记录时可以使用keyObject，传入格式要求为键/值对格式对象，当为对象格式时会忽略value参数
 * 注意：如果要新增的键已存在且存在内容，则不替换它，将会略过，如果键内容为空，则替换它
 * @param   {JQObject} $node JQ节点对象 
 * @param   {String||Object} key      键名或键/值对的数据对象
 * @param   {String} value    值名
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIController.prototype.addNodeData = function ($node, key, value) {
	var filterArgs = _filterArguments(arguments, ["jqobject", ["string", "plainobject"], "all"], 2);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.addNodeData($node, key, value)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0];
	key = filterArgs[1];
	value = filterArgs[2];


	for (var i = 0; i < $node.length; i++) {
		var $currentNode = $node.eq(i);
		var currentData = this.getDataById($currentNode)[0];
		if ($.type(key) == "string" && value) {
			var addFlag, result;
			if ($.type(value) == "function") {
				//函数回调，返回值不为undefined时，才进行替换，否则略过
				var result = value(i, currentData);
				if (result !== undefined) {
					addFlag = true;
				}
			} else {
				addFlag = true;
				result = value;
			}

			if (addFlag) {
				//注意：如果要新增的键已存在且存在内容，则数据不作替换(仅表达一个新增效果)
				if (currentData[key] === undefined) {
					currentData[key] = result;
				}
			}
		} else if ($.type(key) == "object") {
			for (var keyName in key) {
				if (currentData[keyName] === undefined) {
					currentData[keyName] = key[keyName];
				}
			}
		}
	}

	return this;
};

/**
 * 节点数据源替换一项记录或多项记录
 *  * 增加的节点数据不会实时呈现，请使用refreshNode（）更新

 * 注意：与addNodeData不同的地方在于
 * 1.针对查找到的key进行替换
 * 2.未找到key或者无内容时，进行增加和覆盖
 * 3.不要用此方法更改一些内置的数据如level等等
 * @param   {JQObject} $node JQ节点对象 
 * @param   {String||Object}                      key      键名或键/值对的数据对象
 * @param   {all}                             value    任间类型，支持回调
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIController.prototype.replaceNodeData = function ($node, key, value) {
	var filterArgs = _filterArguments(arguments, ["jqobject", ["string", "plainobject"], "all"], 2);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.replaceNodeData($node, key, value)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0];
	key = filterArgs[1];
	value = filterArgs[2];

	for (var i = 0; i < $node.length; i++) {
		var $currentNode = $node.eq(i);
		var currentData = this.getDataById($currentNode)[0];

		//当key类型为string时，value类型支持function回调
		if ($.type(key) == "string" && value !== undefined && key != "_orderId") {
			var replaceFlag, result;
			if ($.type(value) == "function") {
				//函数回调，返回值不为undefined时，才进行替换，否则略过
				result = value(i, currentData);
				if (result !== undefined) {
					replaceFlag = true;
				}
			} else {
				replaceFlag = true;
				result = value;
			}
			if (replaceFlag) {
				currentData[key] = result;
			}
		} else if ($.type(key) == "object") {
			for (var keyName in key) {
				if (keyName != "_orderId") {
					currentData[keyName] = key[keyName];
				}
			}
		}
	}

	return this;
};

/**
 * JQ节点对象的数据源移除一项记录或多项记录
 *  * 增加的节点数据不会实时呈现，请使用refreshNode（）更新
 * @param   {JQObject} $node JQ节点对象 
 * @param   {String||Array} key      键名或键名数组
 * @param   {Function} callback     回调函数，只有返回值为true时才正式删除节点上的key对应数据
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIController.prototype.removeNodeData = function ($node, key, callback) {
	var filterArgs = _filterArguments(arguments, ["jqobject", ["string", "array"], "function"], 2);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.removeNodeData($node, key)";
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

	for (var i = 0; i < $node.length; i++) {
		var $currentNode = $node.eq(i);
		var currentData = this.getDataById($currentNode)[0];

		var removeFlag = false;
		if (callback) {
			//函数回调，返回值为true时，才删除
			var result = callback(i, currentData);
			if (result === true) {
				removeFlag = true;
			}
		} else {
			removeFlag = true;
		}

		if (removeFlag) {
			for (var j = 0; j < keyArray.length; j++) {
				delete currentData[keyArray[j]]
			}
		}

	}
	return this;
};



/**
 * 根据上下环境刷新数据
 * 增强版 如addNode，removeNode，replaceNode后都需要更新节点数据(如hasChild,hasParent,isRoot,length,level)，refreshNodeData(返回有数据变化的节点，以备刷新节点使用)，但可以不用更新节点
 * 更新数据的操作非常耗时，请慎用
 * @param   {JQObject} $node JQ节点对象 
 * @param   {Boolean} refreshMode  刷新模式 true时表示刷新同级节点，false(默认)表示只刷新当前节点(只刷新当前节点时，那么有些数据就不需要刷新了)
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIController.prototype.refreshNodeData = function ($node, refreshMode) {
	var filterArgs = _filterArguments(arguments, ["jqobject", "boolean"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.refreshNodeData($node, refreshMode)";
		log(errorText, "color:#f00");
		return false;
	}

	//如果未指定刷新节点，则刷新等待刷新池里的节点
	if (filterArgs[0] !== undefined) {
		$node = filterArgs[0];
		//从暂存刷新节点中去除这里有更新过的节点
		this._waitingRefreshDataNode = this._waitingRefreshDataNode.not($node);
	} else {
		$node = this._waitingRefreshDataNode;
		this._waitingRefreshDataNode = $();
	}

	refreshMode = filterArgs[1] !== undefined ? filterArgs[1] : false;

	//$node根据上下文环境来刷新数据
	//需要更新哪些节点数据
	//1.更新当前节点数据
	//2.更新同级节点数据（要先确定同级其他节点的层级及指向是否正确）
	//3.更新父节点数据

	//isRefreshing标记：进入了刷新状态的节点
	//refreshingDataCache 更新了的数据暂存区，更新完毕之后再将isRefreshing全部置为false
	var refreshingDataCache = [];

	for (var i = 0; i < $node.length; i++) {
		var $currentNode = $node.eq(i);
		var currentData = this.getDataById($currentNode)[0];

		//先查看当前节点是否正在更新中的，如正在更新中则不再遍历其兄弟节点（因为肯定有其他节点已经触发了其兄弟节点的更新）
		//查看当前节点是否正在刷新中，若正在刷新中则略过（因为可能有别的节点带动了这个节点的刷新）
		if (currentData.isRefreshing === true) {
			continue;
		}

		//如果是根节点，则不更新父节点数据
		//当前节点非根节点时，还需刷新父节点信息
		//var parentData = undefined;
		var parentData;
		if (currentData.level !== 0) {
			var $parentNode = this.getParentNode($currentNode);
			parentData = this.getDataById($parentNode)[0];
		}

		//准备刷新的节点（可能仅自已，也可能包括兄弟节点）
		var $siblingsNode = this.getSiblingsNode($currentNode, true);
		var $refreshNode;
		//如果强制刷新是启用的，则一定会刷新所有兄弟节点，否则只刷新自身
		if (refreshMode) {
			//全部刷新
			$refreshNode = $siblingsNode;
		} else {
			//只刷新自已
			$refreshNode = $currentNode;
		}

		for (var j = 0; j < $refreshNode.length; j++) {
			var $refreshingNode = $refreshNode.eq(j);
			var refreshingData = this.getDataById($refreshingNode)[0];

			//节点正在刷新中，则略过（因为有别的节点带动了这个节点的刷新）
			if (refreshingData.isRefreshing === true) {
				continue;
			}

			//刷新当前节点数据
			refreshingData.level = parentData !== undefined ? parentData.level + 1 : 0; //根据父亲节点设置当前节点级别
			refreshingData[this.config.key.pIdKey] = refreshingData.level === 0 ? null : parentData[this.config.key.idKey];
			refreshingData.isRoot = refreshingData.level === 0 ? true : false;
			refreshingData.hasParent = refreshingData.level === 0 ? false : true;
			//刷新自身子节点标识数据

			var $childrenNode = this.getChildrenNode($refreshingNode, true);
			refreshingData.length = $childrenNode.length;

			//子节点数量大于0或者子节点绑定了json地址时hasChild=true
			if (refreshingData.length > 0 || $.type(refreshingData[this.config.key.childrenKey]) == "string") {
				refreshingData.hasChild = true;
			} else {
				refreshingData.hasChild = false;
			}

			//刷新父节点的子节点相关数据，不更新自身的子节点标识数据
			if (parentData !== undefined) {
				parentData.length = $siblingsNode.length;
				parentData.hasChild = parentData.length > 0 ? true : false;
			}

			//将节点标记为更新中状态，避免重复刷新数据
			refreshingData.isRefreshing = true;
			refreshingDataCache.push(refreshingData);
		}
	}

	//刷新完毕后，重置isRefreshing标记
	$.each(refreshingDataCache, function () {
		this.isRefreshing = false;
	})

	return this;
};



/**
 * 刷新JQ节点对象，使用现在的节点数据，刷新节点对象，更新节点的HTML信息（适用于绑定的数据有了更新，但页面上没有实时显示变化时，重新格式化目标节点）
 * 不删除原节点对象，以免引起其他已指向该节点的变量出问题，仅更新它内部的HTML内容
 * 更新节点不带动数据刷新refreshNodeData()，两种保持独立
 * @param {JQObject}    $node      JQ节点对象//未指定节点时将刷新全部节点
 * @param   {Boolean} refreshMode  刷新模式 true时表示刷新兄弟节点，false(默认)表示只刷新当前节点(只刷新当前节点时，那么有些数据就不需要刷新了)
 * @returns {PlainObject} 返回调用该方法的对象本身
 */
LUIController.prototype.refreshNode = function ($node, refreshMode) {
	var filterArgs = _filterArguments(arguments, ["jqobject", "boolean"]);
	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.refreshNode($node, refreshMode)";
		log(errorText, "color:#f00");
		return false;
	}

	//如果未指定刷新节点，则刷新等待刷新池里的节点
	if (filterArgs[0] !== undefined) {
		$node = filterArgs[0];
		//从暂存刷新节点中去除这里有更新过的节点
		this._waitingRefreshNode = this._waitingRefreshNode.not($node);
	} else {
		$node = this._waitingRefreshNode;
		this._waitingRefreshNode = $();
	}

	refreshMode = filterArgs[1] !== undefined ? filterArgs[1] : false;

	for (var i = 0; i < $node.length; i++) {
		var $currentNode = $node.eq(i);
		var currentData = this.getDataById($currentNode)[0];
		//refreshNodeData刷新了数据，所以在HTML页面上要表现出一些变化
		//更新HTML结构
		//更新样式
		//更新hasChild状态
		//更新state状态
		//更新hasParent状态
		//更新HTML属性：更新data-leve,data-id,data-orderid

		//如果存在父节点hasParent，要根据父节点的打开状态来显示该子节点内容区与expander
		if (currentData.hasParent === true) {
			var $parentNode = this.getParentNode($currentNode);
			var parentData = this.getDataById($parentNode)[0];
			var $parentChildContent = this._noder._getChildContent($parentNode);

			var $parentExpander = this._expander._getExpander($parentNode);

			//父节点为展开状态并且已经存在子节点
			if (parentData.expanded === true && parentData.length > 0) {
				/* $parentExpander.addClass("active");
				 $parentChildContent.addClass("active");*/
				this.expandNode($parentNode);
			}
		}

		//准备刷新的节点（可能仅自已，也可能包括兄弟节点）
		var $refreshNode;
		//如果强制刷新是启用的，则一定会刷新所有兄弟节点，否则只刷新自身
		if (refreshMode) {
			//兄弟节点也刷新
			var $siblingsNode = this.getSiblingsNode($currentNode, true);
			$refreshNode = $siblingsNode;
		} else {
			//只刷新自已
			$refreshNode = $currentNode;
		}

		for (var j = 0; j < $refreshNode.length; j++) {
			var $refreshingNode = $refreshNode.eq(j);
			var refreshingData = this.getDataById($refreshingNode)[0];

			//更新HTML结构
			//按照nodeFormater格式化HTML内容
			var $addNode;
			if ($.type(this.config.view.nodeFormater) == "function") {
				$addNode = $(this.config.view.nodeFormater(refreshingData));
			} else {
				$addNode = $('<div>' + refreshingData[this.config.key.nameKey] + '</div>');
			}

			//刷新节点时需要保留的一些HTML结构
			//保留住data-role=loader
			var $loader = $refreshingNode.find("[data-role='loader']").detach();

			$refreshingNode.empty();
			$refreshingNode.html($addNode.html());
			$refreshingNode.append($loader);

			//启用勾选模式，变更样式
			if (this.config.view.enabledCheckMode) {
				$refreshingNode.prepend("<i class='ext-btn-checker' data-role='checker'></i>");
				if (this.config.view.checkedMultiple) {
					//多选
					$refreshingNode.removeClass("ext-radio");
					$refreshingNode.addClass("ext-checkbox");
				} else {
					$refreshingNode.removeClass("ext-checkbox");
					$refreshingNode.addClass("ext-radio");
				}
			}

			//更新样式
			//暂存目前节点上显示的层级数据
			var currentLevel = $refreshingNode.attr("data-level");

			//去除节点旧层级样式，加上节点新层级样式
			$refreshingNode.removeClass(this.config.view.nodeClass + "-" + currentLevel);
			$refreshingNode.addClass(this.config.view.nodeClass + "-" + refreshingData.level);

			//验证是否存在子节点hasChild（不检查length），true时查找$childContent和$expander点时，不存在时；false删除
			var $childContent = this._noder._getChildContent($refreshingNode);
			var $expander = this._expander._getExpander($refreshingNode);

			if (refreshingData.hasChild === true) {
				//存在子节点
				if ($childContent.length <= 0) {
					//不存在时创建
					$childContent = this._noder._createChildContent($refreshingNode);
				} else {
					//存在时，调整子节点内容区的跟随情况
					var $refreshingNodeContainer = this._noder._getParentNodeContainer($refreshingNode);
					$refreshingNodeContainer.append($childContent);

					//去除老样式
					$childContent.removeClass(function (index, value) {
						return "ext-child-content-" + (parseInt(currentLevel));
					});
					$childContent.addClass(function (index, value) {
						return "ext-child-content-" + (parseInt(refreshingData.level));
					});
				}

				if ($expander.length <= 0) {
					//不存在时创建
					this._expander._createExpander($refreshingNode);
				}
			} else {
				$childContent.remove();
				$expander.remove();
			}

			//根据子节点的状态数量，决定当前节点四种状态的“部分选中”状态
			var $childrenNode = this.getChildrenNode($refreshingNode, true);

			if ($refreshingNode.is(".selected-part") && this.getNodeByState($childrenNode, "selected").length <= 0) {
				$refreshingNode.removeClass("selected-part");
			}

			if ($refreshingNode.is(".checked-part") && this.getNodeByState($childrenNode, "checked").length <= 0) {
				$refreshingNode.removeClass("checked-part");
			}

			if ($refreshingNode.is(".expanded-part") && this.getNodeByState($childrenNode, "expanded").length <= 0) {
				$refreshingNode.removeClass("expanded-part");
			}

			if ($refreshingNode.is(".disabled-part") && this.getNodeByState($childrenNode, "disabled").length <= 0) {
				$refreshingNode.removeClass("disabled-part");
			}

			//更新节点state状态
			if (refreshingData.state) {
				this.addNodeState($refreshingNode, refreshingData.state);
			}

			//更新识别节点需要的HTML属性值
			$refreshingNode.attr("data-level", refreshingData.level);
			$refreshingNode.attr("data-id", refreshingData[this.config.key.idKey]);
			//$refreshingNode.attr("data-orderid", refreshingData._orderId);

			//更新节点间关系线
			this.config.action._selectedAssociation($refreshingNode);
			this.config.action._checkedAssociation($refreshingNode);
			this.config.action._disabledAssociation($refreshingNode);

			//节点更新完毕后，执行一次nodeCallback回调
			if ($.type(this.config.callback.nodeCallback) == "function") {
				this.config.callback.nodeCallback($refreshingNode, refreshingData, this);
			}
		}
	}
	return this;
}

/**
 * 排序JQ节点对象
 * @param   {JQObject} $node    JQ节点对象
 * @param   {String||Array} orderKey  排序字段，默认值_orderId(数据加载时按顺序生成的内置排序ID)
 * @param   {String||Array} orderType 排序方式，"asc"升序，"desc"降序，若未指定，则排序字段为_orderId，则默认排序为asc，其他字段为desc
 * @returns {JQObject} 返回排序后的JQ节点对象
 */
LUIController.prototype.sortNode = function ($node, orderKey, orderType) {
	var filterArgs = _filterArguments(arguments, ["jqobject", ["string", "array"], ["string", "array"]]);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.sortNode($node, orderKey, orderType)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0] !== undefined ? filterArgs[0] : this.getAllNode();
	orderKey = filterArgs[1] !== undefined ? filterArgs[1] : "_orderId";
	orderType = filterArgs[2];

	//del 功能 如果与上一次排序条件相同，则不排序(虽然排序字段相同，但可能数据会有增加)

	//未找到要排序的节点，则返回一个空对象，否则返回排序后的节点（新的位置）	
	if ($node.length <= 0) return this;


	//整理排序字段和排序方式数组
	var orderKeyArray = [],
		orderTypeArray = [];

	//转换为数组格式
	if ($.type(orderKey) == "string") {
		orderKeyArray[0] = (orderKey);
	} else {
		orderKeyArray = orderKey;
	}

	if ($.type(orderType) == "string") {
		orderTypeArray[0] = orderType;
	} else if ($.type(orderType) == "array") {
		orderTypeArray = orderType;
	}

	//过滤字段中非字符串的值
	orderTypeArray = $.grep(orderTypeArray, function (value, index) {
		return $.type(value) == "string";
	});

	//若排序方式与排序字段数量不对称，方式>字段时，忽略方式方式后面的值；字段>方式时，以方式的最后一个值，填充至与字段相同的长度
	if (orderTypeArray.length > orderKeyArray.length) {
		//方式>字段，截断后面要排序的值列
		orderTypeArray = orderTypeArray.slice(0, orderKeyArray.length);
	} else if (orderTypeArray.length <= orderKeyArray.length) {
		//方式<字段
		//将方式扩充至与字段一样多，未定义或非asc和desc的方式也设置一个默认值desc
		for (var i = 0; i < orderKeyArray.length; i++) {
			if (orderTypeArray[i] === undefined || (orderTypeArray[i].toLowerCase() != "asc" && orderTypeArray[i].toLowerCase() != "desc")) {
				if (orderKeyArray[i] == "_orderId") {
					//如果是orderId，默认为asc，其他字段，默认为desc
					orderTypeArray[i] = "asc";
				} else {
					orderTypeArray[i] = "desc";
				}
			}
		}
	}

	//如果存在排序字段
	//排序字段肯定存在？
	if (orderKeyArray.length > 0) {
		//暂存排序后的序号所引值
		var sortIndex = [];
		//首次排序 Start
		//取得排序前的节点id顺序
		var filterId = _dataToArray(this.getDataById($node, this.config.key.idKey));

		//取得排序字段的数据
		var filterKey = _dataToArray(this.getDataById($node, orderKeyArray[0]));

		//根据orderType类型决定当前字段的排序方式
		//克隆一份
		var clonefilterKey = $.merge([], filterKey)
		var sortKey;
		if (orderTypeArray[0].toLowerCase() === "asc") {
			//升序
			sortKey = _arraySort(clonefilterKey);
		} else if (orderTypeArray[0].toLowerCase() === "desc") {
			//降序
			sortKey = _arraySort(clonefilterKey).reverse();
		}


		//根据排序后的字段排序节点
		for (var j = 0; j < sortKey.length; j++) {
			//查找排序后字段在原数组中的位置
			var index = $.inArray(sortKey[j], clonefilterKey);
			//找到后将原数组中对应位置数据置为null，以避免之后重复查找
			clonefilterKey[index] = null;
			//暂存
			sortIndex.push(index);
		}
		//首次排序 End

		//检测是否还存在排序字段，对上一次排序后相同的数据进行再次排序
		var i = 0;


		while ((++i) < orderKeyArray.length) {
			//比较当前排序后两个值是前后是否相等,最后一个值不作比较
			//执行2次：第1次对第1个以后的字段先排序，第2次对第1个进行排序
			//todo合并次数
			for (var z = 0; z < 2; z++) {
				for (var k = 0; k < sortIndex.length - 1; k++) {
					var prevIndex = sortIndex[k];
					var nextIndex = sortIndex[k + 1];

					var prevNode = $node.eq(sortIndex[k]);
					var nextNode = $node.eq(sortIndex[k + 1]);

					var orderKey = orderKeyArray[i - 1];
					var orderType = orderTypeArray[i - 1];

					var prevCurrentKey = this.getDataById(prevNode, orderKey);
					var nextCurrentKey = this.getDataById(nextNode, orderKey);

					//不存在数据时则不进行比较，跳出循环
					if (prevCurrentKey.length <= 0 || nextCurrentKey.length <= 0) break;

					var prevCurrentKeyData = prevCurrentKey[0][orderKeyArray[i - 1]];
					var nextCurrentKeyData = nextCurrentKey[0][orderKeyArray[i - 1]];

					if (prevCurrentKeyData == nextCurrentKeyData) {
						//若相同，计算下一个排序字段的值，不相同则不理会
						//获取下一个排序字段
						var nextOrderKey = orderKeyArray[i];
						var nextOrderType = orderTypeArray[i];

						var prevKey = this.getDataById(prevNode, nextOrderKey);
						var nextKey = this.getDataById(nextNode, nextOrderKey);

						//不存在数据时则不进行比较，跳出循环
						if (prevKey.length <= 0 || nextKey.length <= 0) break;

						var prevKeyData = prevKey[0][nextOrderKey];
						var nextKeyData = nextKey[0][nextOrderKey];

						//下一个排序字段的数据值，进行比较，
						if (nextOrderType.toLowerCase() === "asc") {
							//升序时，前面的值大于后面的值时，则调换位置
							if (prevKeyData > nextKeyData) {
								sortIndex[k + 1] = prevIndex;
								sortIndex[k] = nextIndex;
							}
						} else if (nextOrderType.toLowerCase() === "desc") {
							//降序时，后面的值如果大于前面的值，则调换位置
							if (nextKeyData > prevKeyData) {
								sortIndex[k + 1] = prevIndex;
								sortIndex[k] = nextIndex;
							}
						}
					}
				}
			}
		}


		for (var z = sortIndex.length - 1; z >= 0; z--) {
			var $currentNode = $node.eq(sortIndex[z]);
			var currentData = this.getDataById($currentNode)[0];
			var $nodeContainer = this._noder._getParentNodeContainer($currentNode);
			var $childContent;

			if (currentData.level === 0) {
				//根节点时
				$childContent = this.$content;
			} else {
				$childContent = this._noder._getParentChildContent($currentNode);
			}
			$childContent.prepend($nodeContainer);
		}

		return

	}

	//因为排序会重置结构，所以应该刷新全部节点，但配置上自定义刷新方式
	if (this.config.view.autoRefresh) {
		this.refreshNodeData($node, true);
		this.refreshNode($node, true);
	} else {
		this._waitingRefreshDataNode = this._waitingRefreshDataNode.add($node);
		this._waitingRefreshNode = this._waitingRefreshNode.add($node);
	}

	//返回被排序后的对象
	return this;
};

/**
 * 过滤JQ节点对象
 * 显示匹配到的节点，同时不隐藏其子节点
 * @param {JQObject} $node    JQ节点对象
 * @param {String||RegExp} pattern   过滤表达式（使用正则表达式时，将忽略matchmode）或过滤字符串
 * @param {String||Array} filterKey 搜索的字段，未指定时默认检索节点文本，也可以检索绑定在节点上的字段（all表示全部检索）
 * @param {Boolean} matchMode 匹配模式：精确匹配(false默认)，模糊匹配(true)
 * @param {Boolean} filterMode 过滤模式，true表示删除非指定的节点,false（默认）表示仅隐藏并不删除非指定的节点
 * @returns {JQObject} 返回过滤的JQ节点对象
 */
LUIController.prototype.filterNode = function ($node, pattern, filterKey, matchMode, filterMode) {
	var filterArgs = _filterArguments(arguments, ["jqobject", ["number","string", "regexp"], ["string", "array"], "boolean", "boolean"]);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.filterNode($node, pattern, filterKey, matchMode, filterMode)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0] !== undefined ? filterArgs[0] : this.getAllNode();
	pattern = filterArgs[1] !== undefined ? filterArgs[1] : "";
	filterKey = filterArgs[2];
	matchMode = filterArgs[3] !== undefined ? filterArgs[3] : false;
	filterMode = filterArgs[4] !== undefined ? filterArgs[4] : false;

	var me = this;

	//节点不存在时
	if ($node.length <= 0) return $();

	//根据过滤条件，得到过滤后的数组JQ节点对象 和节点ID
	var $filterNode = $();

	//若过滤内容不存在(空字符串)，则显示所有节点
	if ($.type(pattern) == "string" && $.trim(pattern).length == 0) {
		$filterNode = $node;
		//按顺序排序
		//me._noder._getParentNodeContainer($filterNode).show();
		me.showNode($filterNode);
	} else {
		//有查询条件时
		//如果是字符串，则将字符串转为正则表达式
		var filterExp = "";
		if ($.type(pattern) == "regexp") {
			filterExp = pattern;
		} else  {
			//根据匹配模式，生成正则表达式
			if (matchMode) {
				//模糊匹配
				filterExp = $.trim(pattern).replace(/\s+/g, "");
				//在每个字符后加上+.*
				var reg = "";
				for (var i = 0; i < filterExp.length; i++) {
					reg += filterExp[i] + "+.*";
				}
				filterExp = reg;
			} else {
				//精确匹配
				filterExp = $.trim(pattern).replace(/\s+/g, " ");
				filterExp = filterExp.replace(/\s+/g, "+.*");
			}
			//转成正则表达式
			filterExp = eval("/" + filterExp + "/g");
		}

		//开始检索查询
		for (var i = 0; i < $node.length; i++) {
			//根据filterKey的设置筛选出数据
			var $currentNode = $node.eq(i);
			var currentData;

			//过滤关键字不存在时，从节点的文本里查找
			if (filterKey === undefined) {
				var currentData = $currentNode.text();
				if ($.trim(currentData).search(filterExp) >= 0) {
					$filterNode = $filterNode.add($currentNode);
				}
			} else {
				//字符串，或者数组
				if ($.type(filterKey) == "string" && filterKey == "all") {
					currentData = me.getDataById($currentNode)[0];
				} else if (($.type(filterKey) == "string" || $.type(filterKey) == "array")) {
					currentData = me.getDataById($currentNode, filterKey)[0];
				}

				//遍历查询所有的数据(只要有一个满足要求就退出循环)
				for (var key in currentData) {
					//开始查询
					if ($.trim(currentData[key]).search(filterExp) >= 0) {
						$filterNode = $filterNode.add($currentNode);
						break;
					}
				}
			}

		}

		//隐藏所有节点
		me.hideNode($node);
		//me._noder._getParentNodeContainer($node).hide();

		//向上查找展开关系线，如果父节点被隐藏，则将其显示出来
		for (var i = 0; i < $filterNode.length; i++) {
			var $currentNode = $filterNode.eq(i);
			var currentData = me.getDataById($filterNode.eq(i))[0];
			//me._noder._getParentNodeContainer($currentNode).show();
			me.showNode($currentNode);
			//如果当前节点存在子节点，则不隐藏
			if (currentData.length > 0) {
				//获取该节点下的所有子节点
				var $childrenNode = me.getChildrenNode($currentNode);
				// me._noder._getParentNodeContainer($childrenNode).show();
				me.showNode($childrenNode);

			}

			//存在父节点时，显示展开状态关系线
			if (currentData.hasParent) {
				_expandedAssociation($currentNode)
			}
		}

		//当前节点如存在父节点，则显示父节点，
		function _expandedAssociation($node) {
			var nodeData = me.getDataById($node)[0];
			if (nodeData.hasParent) {
				//显示父节点
				var $parentNode = me.getParentNode($node);
				var parentData = me.getDataById($parentNode)[0];
				//me._noder._getParentNodeContainer($parentNode).show();
				me.showNode($parentNode);

				me.expandNode($parentNode);
				//递归
				_expandedAssociation($parentNode);
			}
		}

		//严格过滤模式
		if (filterMode == true) {
			//删除节点
			var $hiddenNode = $node.filter(":hidden");
			me._noder._getParentNodeContainer($hiddenNode).remove();
		}
	}

	return $filterNode;
}

/**
 * 设置JQ节点对象的状态
 * 可以定义节点的任意状态且支持多种状态
 * 对内置的四种状态（selected,checked,expanded,disabled）做了特殊处理
 * @param   {JQObject} $node JQ节点对象 
 * @param   {String||Array} state   状态名称，状态样式名与状态名称一致
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIController.prototype.addNodeState = function ($node, state) {
	var filterArgs = _filterArguments(arguments, ["jqobject", ["string", "array"]], 2);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.addNodeState($node, state)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0];
	state = filterArgs[1];

	var stateArray = [];
	if ($.type(state) == "string") {
		stateArray[0] = state;
	} else {
		stateArray = state;
	}

	for (var i = 0; i < $node.length; i++) {
		var $currentNode = $node.eq(i);
		var currentData = this.getDataById($currentNode)[0];

		for (var j = 0; j < stateArray.length; j++) {
			var currentState = stateArray[j];
			//只支持字符串格式状态值
			if ($.type(currentState) !== "string") {
				continue;
			}

			//若状态值数组中未在时，增加进去
			//若已存在则略过
			if ($.inArray(currentState, currentData.state) < 0) {
				currentData.state.push(currentState);
			}

			//为节点增加该状态样式名
			$currentNode.addClass(currentState);

			//为节点设置直接的状态数据
			currentData[currentState] = true;

			//处于某种状态
			//增加至初始选中节点存储池
			//若节点记忆池开启，还要增加至节点记忆池
			if (currentState === "selected") {
				this._initSelectedNode = this._initSelectedNode.add($currentNode);
				if (this.config.view.enabledSelectedMemory === true) {
					this._selectedNode = this._selectedNode.add($currentNode);
				}
			} else if (currentState === "checked") {
				this._initCheckedNode = this._initCheckedNode.add($currentNode);
				if (this.config.view.enabledCheckedMemory === true) {
					this._checkedNode = this._checkedNode.add($currentNode);
				}
			} else if (currentState === "expanded") {
				this._initExpandedNode = this._initExpandedNode.add($currentNode);
				if (this.config.view.enabledExpandedMemory === true) {
					this._expandedNode = this._expandedNode.add($currentNode);
				}
			} else if (currentState === "disabled") {
				this._initDisabledNode = this._initDisabledNode.add($currentNode);
				if (this.config.view.enabledDisabledMemory === true) {
					this._disabledNode = this._disabledNode.add($currentNode);
				}
			}

			//保存展开节点顺序
			if (currentState === "expanded") {
				this._expandedOrder.push(currentData.id);
			}
		}
	}

	return this;
}


/**
 * 移除JQ节点对象的状态
 * @param   {JQObject} $node JQ节点对象 
 * @param   {String||Array} state   状态名称，状态样式名与状态名称一致
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIController.prototype.removeNodeState = function ($node, state) {
	var filterArgs = _filterArguments(arguments, ["jqobject", ["string", "array"]], 2);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.removeNodeState($node, state)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0];
	state = filterArgs[1];

	var stateArray = [];
	if ($.type(state) == "string") {
		stateArray[0] = state;
	} else {
		stateArray = state;
	}

	for (var i = 0; i < $node.length; i++) {
		var $currentNode = $node.eq(i);
		var currentData = this.getDataById($currentNode)[0];

		for (var j = 0; j < stateArray.length; j++) {
			var currentState = stateArray[j];
			//只支持字符串格式状态值
			if ($.type(currentState) != "string") {
				continue;
			}

			var stateIndex = $.inArray(currentState, currentData.state);

			//若已存在移除状态，移除数据，移除样式
			if (stateIndex >= 0) {
				$currentNode.removeClass(currentState);
				currentData[currentState] = false;
				currentData.state[stateIndex] = null;
			}

			//处于某种状态
			//移除初始选中节点存储池
			//若节点记忆池开启，移除节点记忆池
			if (currentState === "selected") {
				this._initSelectedNode = this._initSelectedNode.not($currentNode);
				if (this.config.view.enabledSelectedMemory === true) {
					this._selectedNode = this._selectedNode.not($currentNode);
				}
			} else if (currentState === "checked") {
				this._initCheckedNode = this._initCheckedNode.not($currentNode);
				if (this.config.view.enabledCheckedMemory === true) {
					this._checkedNode = this._checkedNode.not($currentNode);
				}
			} else if (currentState === "expanded") {
				this._initExpandedNode = this._initExpandedNode.not($currentNode);
				if (this.config.view.enabledExpandedMemory === true) {
					this._expandedNode = this._expandedNode.not($currentNode);
				}
			} else if (currentState === "disabled") {
				this._initDisabledNode = this._initDisabledNode.not($currentNode);
				if (this.config.view.enabledDisabledMemory === true) {
					this._disabledNode = this._disabledNode.not($currentNode);
				}
			}

			//保存节点顺序
			if (currentState === "expanded") {
				var index = $.inArray(currentData.id, this._expandedOrder);
				if (index >= 0) {
					this._expandedOrder[index] = null;
				}
			}
		}

		//过滤状态值中的null值
		currentData.state = $.grep(currentData.state, function (value, index) {
			return value != null;
		});
	}
	//过滤展开数组中的null值
	this._expandedOrder = $.grep(this._expandedOrder, function (value, index) {
		return value != null;
	});
}

/**
 * 选中JQ节点对象
 * @param   {JQObject} $node JQ节点对象 
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIController.prototype.selectNode = function ($node) {
	var filterArgs = _filterArguments(arguments, ["jqobject"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.selectNode($node)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0];

	for (var i = 0; i < $node.length; i++) {
		var $currentNode = $node.eq(i);
		var currentData = this.getDataById($currentNode)[0];

		//节点选中之前，执行一次nodeBeforeSelected回调
		if ($.type(this.config.callback.nodeBeforeSelected) == "function") {
			this.config.callback.nodeBeforeSelected($currentNode, currentData, this);
		}

		this.addNodeState($currentNode, "selected");
		$currentNode.removeClass("selected-part");

		//节点选中后，执行一次nodeSelected回调
		if ($.type(this.config.callback.nodeSelected) == "function") {
			this.config.callback.nodeSelected($currentNode, currentData, this);
		}
	}
	return this;
}

/**
 * 选中当前页面中所有的JQ节点对象（不包括选中记忆池中的节点）
 * @param   {JQObject} $node JQ节点对象 
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIController.prototype.selectAllNode = function () {
	var $allNode = this.getAllNode();
	this.selectNode($allNode);

	return this;
}

/**
 * 取消选中JQ节点对象
 * @param   {JQObject} $node JQ节点对象 
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIController.prototype.cancelSelectedNode = function ($node) {
	var filterArgs = _filterArguments(arguments, ["jqobject"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.cancelSelectedNode($node)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0];

	for (var i = 0; i < $node.length; i++) {
		var $currentNode = $node.eq(i);
		var currentData = this.getDataById($currentNode)[0];

		//节点取消选中之前，执行一次nodeBeforeCancelSelected回调
		if ($.type(this.config.callback.nodeBeforeCancelSelected) == "function") {
			this.config.callback.nodeBeforeCancelSelected($currentNode, currentData, this);
		}

		this.removeNodeState($currentNode, "selected");
		$currentNode.removeClass("selected-part");

		//节点取消选中后，执行一次nodeCancelSelected回调
		if ($.type(this.config.callback.nodeCancelSelected) == "function") {
			this.config.callback.nodeCancelSelected($currentNode, currentData, this);
		}
	}

	return this;
}

/**
 * 取消选中所有当前页面下已选中JQ节点对象
 * @param   {JQObject} $node JQ节点对象 
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIController.prototype.cancelSelectedAllNode = function () {
	var $selectedNode = this.getSelectedNode(true);
	this.cancelSelectedNode($selectedNode);
	return this;
}

/**
 * 移除所有选中JQ节点对象（包括选中记忆池中的节点）
 * @param   {JQObject} $node JQ节点对象 
 * @param   {Function} callback   回调事件
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIController.prototype.cleanSelectedNode = function () {
	var $selectedNode = this.getSelectedNode();
	this.cancelSelectedNode($selectedNode);
	return this;
}



/**
 * 禁用JQ节点对象
 * @param   {JQObject} $node JQ节点对象 
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIController.prototype.disableNode = function ($node) {
	var filterArgs = _filterArguments(arguments, ["jqobject"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.disableNode($node)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0];

	for (var i = 0; i < $node.length; i++) {
		var $currentNode = $node.eq(i);
		var currentData = this.getDataById($currentNode)[0];

		//节点选中之前，执行一次nodeBeforeDisabled回调
		if ($.type(this.config.callback.nodeBeforeDisabled) == "function") {
			this.config.callback.nodeBeforeDisabled($currentNode, currentData, this);
		}

		this.addNodeState($currentNode, "disabled");
		$currentNode.removeClass("disabled-part");

		//节点选中后，执行一次nodeDisabled回调
		if ($.type(this.config.callback.nodeDisabled) == "function") {
			this.config.callback.nodeDisabled($currentNode, currentData, this);
		}
	}
	return this;
}

/**
 * 禁用当前页面下所有的JQ节点对象
 * @param   {JQObject} $node JQ节点对象 
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIController.prototype.disableAllNode = function () {
	var $allNode = this.getAllNode();
	this.disableNode($allNode);

	return this;
}

/**
 * 取消选中JQ节点对象：只针对已选中状态取消选中，不针对其他状态
 * @param   {JQObject} $node JQ节点对象 
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIController.prototype.cancelDisabledNode = function ($node) {
	var filterArgs = _filterArguments(arguments, ["jqobject"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.cancelDisabledNode($node)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0];

	for (var i = 0; i < $node.length; i++) {
		var $currentNode = $node.eq(i);
		var currentData = this.getDataById($currentNode)[0];

		//节点取消选中之前，执行一次nodeBeforeCancelDisabled回调
		if ($.type(this.config.callback.nodeBeforeCancelDisabled) == "function") {
			this.config.callback.nodeBeforeCancelDisabled($currentNode, currentData, this);
		}

		this.removeNodeState($currentNode, "disabled");
		$currentNode.removeClass("disabled-part");

		//节点取消选中后，执行一次nodeCancelDisabled回调
		if ($.type(this.config.callback.nodeCancelDisabled) == "function") {
			this.config.callback.nodeCancelDisabled($currentNode, currentData, this);
		}
	}

	return this;
}

/**
 * 取消所有(当前插件)选中JQ节点对象
 * @param   {JQObject} $node JQ节点对象 
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIController.prototype.cancelDisabledAllNode = function () {
	var $disabledNode = this.getNodeByState(this.getAllNode(), "disabled");
	this.cancelDisabledNode($disabledNode);
	return this;
}

/**
 * 移除所有选中JQ节点对象（包在选中记忆池中的节点）
 * @param   {JQObject} $node JQ节点对象 
 * @param   {Function} callback   回调事件
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIController.prototype.cleanSelectedNode = function () {
	var $disabledNode = this._disabledNode;
	this.cancelDisabledNode($disabledNode);
	return this;
}



/**
 * 勾选JQ节点对象
 * @param   {JQObject} $node JQ节点对象 
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIController.prototype.checkNode = function ($node) {
	var filterArgs = _filterArguments(arguments, ["jqobject", "string"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.checkNode(checkNode)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0];

	for (var i = 0; i < $node.length; i++) {
		var $currentNode = $node.eq(i);
		var currentData = this.getDataById($currentNode)[0];

		//节点选中之前，执行一次nodeBeforeChecked回调
		if ($.type(this.config.callback.nodeBeforeChecked) == "function") {
			this.config.callback.nodeBeforeChecked($currentNode, currentData, this);
		}

		this.addNodeState($currentNode, "checked");
		$currentNode.removeClass("checked-part");

		//节点选中后，执行一次nodeChecked回调
		if ($.type(this.config.callback.nodeChecked) == "function") {
			this.config.callback.nodeChecked($currentNode, currentData, this);
		}
	}

	return this;
}


/**
 * 勾选所有JQ节点对象
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIController.prototype.checkAllNode = function () {
	var $allNode = this.getAllNode();
	this.checkNode($allNode);
	return this;
}

/**
 * 取有勾选JQ节点对象
 * @param   {JQObject} $node JQ节点对象 
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIController.prototype.cancelCheckedNode = function ($node) {
	var filterArgs = _filterArguments(arguments, ["jqobject", "string"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.cancelCheckedNode($node)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0];

	for (var i = 0; i < $node.length; i++) {
		var $currentNode = $node.eq(i);
		var currentData = this.getDataById($currentNode)[0];

		//节点取消选中之前，执行一次nodeBeforeCancelChecked回调
		if ($.type(this.config.callback.nodeBeforeCancelChecked) == "function") {
			this.config.callback.nodeBeforeCancelChecked($currentNode, currentData, this);
		}

		this.removeNodeState($currentNode, "checked");
		$currentNode.removeClass("checked-part");

		//节点取消选中后，执行一次nodeCancelChecked回调
		if ($.type(this.config.callback.nodeCancelChecked) == "function") {
			this.config.callback.nodeCancelChecked($currentNode, currentData, this);
		}
	}

	return this;
}


/**
 * 取消所有(当前插件)勾选的JQ节点对象
 * @param   {JQObject} $node JQ节点对象 
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIController.prototype.cancelCheckedAllNode = function () {
	var $checkedNode = this.getCheckedNode(true);
	this.cancelCheckedNode($checkedNode);
	return this;
}

/**
 * 移除所有勾选的JQ节点对象（包在选中记忆池中的数据）
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIController.prototype.cleanCheckedNode = function () {
	var $checkedNode = this.getCheckedNode();
	this.cancelCheckedNode($checkedNode);
	return this;
}

/**
 * 展开指定JQ节点对象
 * @param   {JQObject} $node JQ节点对象 
 * @param   {Boolean} expandMode 展开模式，true时表示动画效果加载，false（默认）时表示无动画效果加载
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIController.prototype.expandNode = function ($node, expandMode) {
	var filterArgs = _filterArguments(arguments, ["jqobject", "boolean"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.expandNode($node, expandMode)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0];
	expandMode = filterArgs[1] !== undefined ? filterArgs[1] : false;

	var me = this;

	for (var i = 0; i < $node.length; i++) {
		var $currentNode = $node.eq(i);
		var currentData = me.getDataById($currentNode)[0];

		//不存在子节点，直接跳过
		if (currentData.length <= 0) {
			continue;
		}
		var $currentExpander = me._expander._getExpander($currentNode);
		var $childContent = me._noder._getChildContent($currentNode);

		//节点展开之前，执行一次nodeBeforeExpanded回调
		if ($.type(me.config.callback.nodeBeforeExpanded) == "function") {
			me.config.callback.nodeBeforeExpanded($currentNode, currentData, me);
		}

		if (expandMode) {
			$currentExpander.addClass("active");
			me.addNodeState($currentNode, "expanded");
			$childContent.slideDown(me.config.view.expandSpeed, function () {
				$childContent.addClass("active");
				$childContent.removeAttr("style");
				//节点展开后，执行一次nodeExpanded回调
				if ($.type(me.config.callback.nodeExpanded) == "function") {
					me.config.callback.nodeExpanded($currentNode, currentData, me);
				}
			});
		} else {
			$currentExpander.addClass("active");
			me.addNodeState($currentNode, "expanded");
			$childContent.addClass("active");
			$childContent.removeAttr("style");
			//节点展开后，执行一次nodeExpanded回调
			if ($.type(me.config.callback.nodeExpanded) == "function") {
				me.config.callback.nodeExpanded($currentNode, currentData, me);
			}
		}
	}

	return me;
}

/**
 * 展开所有JQ节点对象(可指定级别)
 * @param   {JQObject} $node JQ节点对象 
 * @param   {Boolean} expandMode 展开模式，true时表示动画效果加载，false（默认）时表示非动画效果加载
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIController.prototype.expandAllNode = function (expandMode) {
	var $allNode = this.getAllNode();
	this.expandNode($allNode, expandMode);
	return this;
}

/**
 * 取消展开指定JQ节点对象
 * @param   {JQObject} $node JQ节点对象 
 * @param   {Boolean} expandMode 展开模式，true时表示动画效果加载，false（默认）时表示非动画效果加载
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIController.prototype.cancelExpandedNode = function ($node, expandMode) {
	var filterArgs = _filterArguments(arguments, ["jqobject", "boolean"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cLUIController.prototype.cancelExpandedNode($node, expandMode)";
		log(errorText, "color:#f00");
		return false;
	}

	$node = filterArgs[0];
	expandMode = filterArgs[1] !== undefined ? filterArgs[1] : false;

	var me = this;

	for (var i = 0; i < $node.length; i++) {
		var $currentNode = $node.eq(i);
		var currentData = me.getDataById($currentNode)[0];
		//不存在子节点，直接跳过
		if (currentData.length <= 0) {
			continue;
		}

		var $currentExpander = me._expander._getExpander($currentNode);
		var $childContent = me._noder._getChildContent($currentNode);

		//节点展开之前，执行一次nodeBeforeCancelExpanded回调
		if ($.type(me.config.callback.nodeBeforeCancelExpanded) == "function") {
			me.config.callback.nodeBeforeCancelExpanded($currentNode, currentData, me);
		}

		if (expandMode) {
			$currentExpander.removeClass("active");
			me.removeNodeState($currentNode, "expanded");
			$childContent.slideUp(me.config.view.expandSpeed, function () {
				$childContent.removeClass("active");
				$childContent.removeAttr("style");
				//节点展开后，执行一次nodeCancelExpanded回调
				if ($.type(me.config.callback.nodeCancelExpanded) == "function") {
					me.config.callback.nodeCancelExpanded($currentNode, currentData, me);
				}
			});
		} else {
			$currentExpander.removeClass("active");
			me.removeNodeState($currentNode, "expanded");
			$childContent.removeClass("active");
			$childContent.removeAttr("style");
			//节点展开后，执行一次nodeCancelExpanded回调
			if ($.type(me.config.callback.nodeCancelExpanded) == "function") {
				me.config.callback.nodeCancelExpanded($currentNode, currentData, me);
			}
		}
	}

	return this;
}

/**
 * 取消展开指定JQ节点对象
 * @param   {JQObject} $node JQ节点对象 
 * @param   {Boolean} expandMode 展开模式，true时表示动画效果加载，false（默认）时表示非动画效果加载
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIController.prototype.cancelExpandedAllNode = function (expandMode) {
	var $expandedNode = this.getNodeByState(this.getAllNode(), "expanded");
	this.cancelExpandedNode($expandedNode, expandMode);
	return this;
}


/**
 * 取消展开指定JQ节点对象
 * @param   {JQObject} $node JQ节点对象 
 * @param   {Boolean} expandMode 展开模式，true时表示动画效果加载，false（默认）时表示非动画效果加载
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIController.prototype.clearnExpandedNode = function (expandMode) {
	var $expandedNode = this._expandedNode;
	this.cancelExpandedNode($expandedNode, expandMode);
	return this;
}

/**
 * 显示JQ节点对象
 * @param   {JQObject} $node JQ节点对象 
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIController.prototype.showNode = function ($node) {
	var $nodeContainer = this._noder._getParentNodeContainer($node);
	$node.show();
	$nodeContainer.show();
	return this;
}

/**
 * 显示所有JQ节点对象
 * @param   {JQObject} $node JQ节点对象 
 * @returns {PlainObject}  返回调用该方法的对象本身
 */
LUIController.prototype.showAllNode = function () {
	var $allNode = this.getAllNode();
	var $nodeContainer = this._noder._getParentNodeContainer($allNode);
	$allNode.show();
	$nodeContainer.show();
	return this;
}

/**
 * 隐藏JQ节点对象
 * @param   {JQObject} $node JQ节点对象 
 * @returns {PlainObject}  返回调用该方法的对象本身
 */

LUIController.prototype.hideNode = function ($node) {
	var $nodeContainer = this._noder._getParentNodeContainer($node);
	$node.hide();
	$nodeContainer.hide();
	return this;
}

/**
 * 隐藏所有JQ节点对象
 * @param   {JQObject} $node JQ节点对象 
 * @returns {PlainObject}  返回调用该方法的对象本身
 */

LUIController.prototype.hideAllNode = function () {
	var $allNode = this.getAllNode();
	var $nodeContainer = this._noder._getParentNodeContainer($allNode);
	$allNode.hide();
	$nodeContainer.hide();
	return this;
}