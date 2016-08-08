/**
 * @author Ezios
 * @class grid
 * @extends jquery-1.8.3
 * @markdown
 * #表格插件
 * 版本 1.5.5 日期 2015-4-3
 * 配置项详见Config options
 *
 * 示例：
 *
 *     @example
 *     var grid = $('dom').grid({
 *         store: {
 *             url: ''
 *         },
 *         columns: []
 *     });
 *
 *     grid.getSelected();
 *     grid.refresh();
 *
 * <p>ajax模式数据示例:</p>
 *
 *      @example
 *     {
 *         s: 1,
 *         d: [],
 *         total: 0
 *     }
 *
 * 字段可以自定义
 * s 成功标志
 * d 数据
 * total 总数
 *
 */
;
!(function ($) {
	"use strict";

	var Grid = function ($dom, config) {
		var me = this;

		//dom引用
		this.$me = $dom;
		//包装div
		this.$wrapper = $dom.wrap('<div class="grid-wrapper"></div>').parent('.grid-wrapper');
		//当前页数
		this.curPage = 0;
		//缓存参数
		this.ajaxParams = '';
		//ajax数据
		this.ajaxData = {};
		//默认配置项
		this.defaults = {
			/**
			 * @cfg {Object} [store] (required) 数据配置
			 * @cfg {Boolean} [store.autoLoad] 是否自动加载
			 * @cfg {Object} [store.params] 额外参数 固定的额外参数 不会被清除
			 * @cfg {Object} [store.data] 本地数据 url和data都存在时取url
			 * @cfg {String} [store.type] 请求方式 'GET'或'POST' 默认'POST'
			 * @cfg {String} [store.url] 请求地址
			 * @cfg {Number} [store.pagesize] 每页记录数
			 * @cfg {String} [store.totalProperty] 总页数字段名 默认： total
			 * @cfg {String} [store.dataProperty] 数据数组字段名 默认： d
			 * @cfg {String} [store.successProperty] 请求成功标志字段名 默认： s 1代表成功 其他值代表失败 失败时返回的d值将作为提示信息
			 * @cfg {Boolean} [store.sortable] 该列是否允许排序 点击该表头将依次发送 降序、升序、默认等参数
			 *
			 *     降序:/users?sort=account&asc=true&offset=0&limit=10
			 *
			 *     升序:/users?sort=account&asc=false&offset=0&limit=10
			 *
			 *     默认:/users?sort=account&asc=false&offset=0&limit=10
			 */
			store: {
				//自动加载
				autoLoad: true,
				//请求地址
				url: '',
				//额外参数
				extraParams: {},
				//本地数据
				data: {},
				//请求方式
				type: 'POST',
				//每页多少记录
				pagesize: 10,
				//总页数字段名
				totalProperty: 'total',
				//数组字段名
				dataProperty: 'd',
				//成功标志字段
				successProperty: 's',
				//排序
				sortable: false
			},
			/**
			 * @cfg {Object} [schema] 表格视图
			 * @cfg {String} [schema.displayMode] 显示模式 list--列表模式 thumb--缩略图模式
			 * @cfg {String} [schema.thumbCls] 缩略图模式的样式
			 * @cfg {String} [schema.thumbItemCls] 缩略图模式单元的样式
			 * @cfg {Object} [schema.thumbRenderer] 缩略图模式的渲染函数
			 *     <p>-cellData 单元格数据 当dataIndex属性存在时才有值</p>
			 *     <p>-rowData 行数据</p>
			 *     <p>-grid grid对象</p>
			 *     <p>-cellIndex 列序号</p>
			 *     <p>-rowIndex 行序号</p>
			 *
			 *     thumbRenderer: function(rowData, grid, rowIndex){
			 *         console.log('本行对应的数据 ', rowData);
			 *         console.log('当前页 ', grid.getCurPage());
			 *         console.log('行序号', rowIndex);
			 *     }
			 */
			schema: {
				displayMode: 'list',
				thumbCls: 'table-thumb',
				thumbItemCls: 'thumb-item'
			},
			/**
			 * @cfg {Object} [columns] (required) 表格模型
			 * @cfg {String} [columns.title] (required) 表头标题
			 * @cfg {Object} [columns.dataIndex] 数据字段 级联对象请使用 .操作符
			 *
			 *      $('dom').grid({
			 *          columns: [{
			 *              dataIndex: 'user.info.sex'
			 *          }]
			 *      });
			 * @cfg {Number} [columns.width] 宽度
			 * @cfg {String} [columns.align] 对齐方式 'center','left','right'，默认：'center'
			 * @cfg {Boolean} [columns.nowrap] 值为true时强制不换行 默认： false
			 * @cfg {String} [columns.totalProperty] 总页数字段名 默认： total
			 * @cfg {Function} [columns.renderer] 渲染函数
			 *      <p>-cellData 单元格数据 当dataIndex属性存在时才有值</p>
			 *      <p>-rowData 行数据</p>
			 *      <p>-grid grid对象</p>
			 *      <p>-cellIndex 列序号</p>
			 *      <p>-rowIndex 行序号</p>
			 *
			 *      renderer: function(cellData, rowData, grid, cellIndex, rowIndex){
			 *          console.log('dataIndex对应的数据 ', cellData);
			 *          console.log('本行对应的数据 ', rowData);
			 *          console.log('当前页 ', grid.getCurPage());
			 *          console.log('列序号 ', cellIndex);
			 *          console.log('行序号', rowIndex);
			 *      }
			 * @cfg {Object} [columns.formatter] 格式化
			 *
			 *      columns: [{
			 *          formatter: {
			 *              //长度限制
			 *              length: 10
			 *          }
			 *      }]
			 */
			columns: [{
				//标题
				title: '表头',
				//字段
				dataIndex: '',
				//宽度
				width: '',
				//对齐方式
				align: 'center',
				//换行
				nowrap: true
					//格式化函数
					// renderer: function() {}
            }],
			/**
			 * @cfg {Object} tool 工具
			 * @cfg {Boolean} [tool.checkboxSelect] 值为true时启用单选框
			 * @cfg {Boolean} [tool.tableTip] 值为true时启用提示
			 * @cfg {Boolean} [tool.pagingBar] 值为true时启用分页 排序参数为 偏移值offset 条数limit
			 * @cfg {String} [tool.tableBottomBarCls] 底部工具栏样式
			 * @cfg {String} [tool.pagingCls] 插入分页按钮的DOM元素的class
			 * @cfg {String} [tool.pagingInfoCls] 显示分页信息的DOM元素的class
			 * @cfg {String} [tool.pagingSizeCls] 分页条数设置的DOM元素的class
			 * @cfg {String} [tool.pagingJumpCls] 分页跳转的DOM元素的class
			 * @cfg {String} [tool.pagingContainerHtml] 分页按钮容器的html
			 *     双花括号内为动态内容不可更改，即标签语法，其他html可以随意更改。
			 *
			 *       <div class="table-bottom-left">
			 *          <span class="mr-10">每页</span>
			 *          <span class="page-size mr-10">
			 *              <select class="normal-select {{pagingSizeCls}}">
			 *                  <option value="10">10</option>
			 *                  <option value="20">20</option>
			 *                  <option value="50">50</option>
			 *                  <option value="100">100</option>
			 *              </select>
			 *          </span>
			 *          <span class="mr-10">条</span>
			 *          <span class="{{pagingCls}} mr-10"></span>
			 *          <span class="{{pagingJumpCls}}">
			 *              <input class="form-control mr-10 paging-value" type="text" />
			 *              <a class="btn btn-primary btn-go" href="javascript:void(0);">GO</a>
			 *          </span>
			 *      </div>
			 * @cfg {String} [tool.pagingInfoContainerHtml] 分页信息容器的html
			 *     双花括号内为动态内容不可更改，即标签语法，其他html可以随意更改。
			 *
			 *      <div class="page-function table-bottom-right">
			 *          <span class="{{pagingInfoCls}}"></span>
			 *      </div>
			 * @cfg {String} [tool.pagingBtnHtml] 页码按钮的html
			 * @cfg {String} [tool.pagingPrevBtnHtml] 上一页按钮的html
			 * @cfg {String} [tool.pagingNextBtnHtml] 下一页按钮的html
			 */
			tool: {
				//启用图片形式ajax状态回调:image显示图片(默认),text，显示文字,none不显示
				ajaxCallbackStatus: "image",
				//启用序号
				enableSerialNumber: false,
				//启用选框
				checkboxSelect: true,
				//提示
				tableTip: true,
				//分页
				pagingBar: false,
				//底部工具栏样式
				tableBottomBarCls: 'table-bottom-bar',
				//分页样式
				pagingCls: 'pagination',
				//分页信息样式
				pagingInfoCls: 'page-info',
				//分页条数设置样式
				pagingSizeCls: 'pagesize-value',
				//分页跳转
				pagingJumpCls: 'page-jump',
				//分页按钮容器的html
				pagingContainerHtml: '<div class="table-bottom-left">' +
					'<span class="mr-10">每页</span>' +
					'<span class="page-size mr-10">' +
					'<select class="normal-select {{pagingSizeCls}}">' +
					'<option value="10">10</option>' +
					'<option value="20">20</option>' +
					'<option value="50">50</option>' +
					'<option value="100">100</option>' +
					'</select>' +
					'</span>' +
					'<span class="mr-10">条</span>' +
					'<span class="{{pagingCls}} mr-10"></span>' +
					'<span class="{{pagingJumpCls}}">' +
					'<input class="form-control mr-10 paging-value" type="text" />' +
					'<a class="btn btn-primary btn-go" href="javascript:void(0);">GO</a>' +
					'</span>' +
					'</div>',
				//分页信息容器的html
				pagingInfoContainerHtml: '<div class="page-function table-bottom-right">' +
					'<span class="{{pagingInfoCls}}"></span>' +
					'</div>',
				//页码按钮的html
				pagingBtnHtml: '<a class="num-page{{cls}}" href="javascript:void(0);">{{pageNum}}</a>\n',
				//上一页按钮的html
				pagingPrevBtnHtml: '<a class="prev-page{{cls}}" href="javascript:void(0);">&nbsp;前页&nbsp;</a>\n',
				//下一页按钮的html
				pagingNextBtnHtml: '<a class="next-page{{cls}}" href="javascript:void(0);">&nbsp;后页&nbsp;</a>\n'
			},
			/**
			 * @cfg {Object} event 事件
			 * @cfg {Function} [event.onGetDataError] 获取数据失败时的处理回调，详见Events下的{@link grid#onGetDataError onGetDataError}
			 */
			event: {
				/**
				 * @event onGetDataError
				 * 获取数据失败时的处理回调
				 * @param  {Object} json 请求返回的数据
				 */
				onGetDataError: function (json) {
					var message = '';

					if (json) {
						if (json.d) {
							message = json.d;
						} else {
							message = json;
						}
					} else {
						message = '获取列表数据失败';
					}

					if (window.tip) {
						window.tip(message, 'danger');
					} else {
						alert(message);
					}
				},

				onLoadCallback: function (json) {

				},
				//页数按钮的点击事件回调
				pageBtnCallback: {}
			}
		};
		//数据仓库
		this.store = new Array();
		//操作对象
		this.gridObj = {
			/**
			 * @property {Object} 配置项
			 *
			 *
			 *     alert(grid.config);
			 */
			me: me,
			$me: me.$me,
			config: config,
			/**
			 * 添加记录
			 * @param  {Object} data 数据对象
			 *
			 *     @example
			 *     grid.addRecord({
			 *         "_id": "5518b89dbc547f6c18c98dff",
			 *         "account": "123123",
			 *         "password": "7c4a8d09ca3762af61e59520943dc26494f8941b",
			 *         "__v": 0,
			 *         "phone": "123",
			 *         "role": 2,
			 *         "sex": "123",
			 *         "name": "123123"
			 *     });
			 */
			addRecord: function (data) {
				me.$me.append(me.generateTableRow(data, me.$me.find('tr:not(.table-head)').length));
				//数据为空时添加数据移除提示信息
				if (me.store.length === 0) {
					//渲染表头
					me.renderTableHead();

					//初始化工具
					me.initTool();
				}

				me.store.push({
					rowIndex: me.store.length,
					data: data
				});
				//移除空提示
				me.tableTip('hideTip');
			},
			/**
			 * 以原有参数刷新表格。
			 */
			refresh: function () {
				//载入当前页
				me.loadPage(me.curPage);
			},
			/**
			 * 根据参数重新加载表格，之前的参数将被清除，并重新渲染表头，并返回第一页。
			 * @param  {Object} params 参数对象
			 * @param  {Function} callback 回调函数
			 * -data 返回的数据
			 *
			 *     @example
			 *     grid.load({
			 *         filter: 'name'
			 *     }, function(data){});
			 */
			load: function (params, callback) {
				me.loadPage(1, params, callback);
			},
			/**
			 * 载入第一页。
			 */
			firstPage: function () {
				me.loadPage(1);
			},
			/**
			 * 载入最后一页。
			 */
			lastPage: function () {
				me.loadPage(me.totalPage);
			},
			/**
			 * 上一页
			 */
			prevPage: function () {
				if (me.curPage !== 1) {
					me.loadPage(me.curPage - 1);
				}
			},
			/**
			 * 下一页
			 */
			nextPage: function () {
				if (me.curPage !== me.totalPage) {
					me.loadPage(me.curPage + 1);
				}
			},
			/**
			 * 跳转指定页
			 * @param  {Number} pageNum 页码
			 */
			gotoPage: function (pageNum) {
				if (typeof pageNum === 'number') {
					me.loadPage(pageNum);
				}
			},
			/**
			 * 获取当前页数
			 * @return {Number} 页数
			 */
			getCurPage: function () {
				return me.curPage;
			},
			/**
			 * 获取总页数
			 * @return {Number} 页数
			 */
			getTotalPage: function () {
				return me.totalPage;
			},
			getAjaxData: function () {
				return me.ajaxData;
			},
			/**
			 * 获取数据原型
			 * @return {Object} [description]
			 */
			getData: function () {
				return me.data;
			},
			/**
			 * 获取当前表格的数据对象
			 * @return {Object} 数据对象
			 */
			getDataStore: function () {
				var array = new Array();

				for (var i = 0; i < me.store.length; i++) {
					array.push(me.store[i].data);
				}

				return array;
			},
			/**
			 * 获取选中行的数据对象。
			 * @param {String} columnName 返回类型 为空返回完整数据数组 有值时返回指定值数组
			 * @return {Array} 数据对象
			 *
			 *     @example
			 *     grid.getSelectedData('_id');
			 *     //["5518b89dbc547f6c18c98dff", "551b56c11911ce040e0b9887", "551b59b377886a8c1d20b65e", "551b64b577886a8c1d20b671"]
			 */
			getSelectedData: function (columnName) {
				var selections = me.$me.find(':checked:not(.selectAll)');
				var len = selections.length;
				var values = new Array();

				if (columnName) {
					for (var i = 0; i < len; i++) {
						var $tr = $(selections[i]).parents('tr');

						if ($tr.data('data')[columnName]) {
							values.push($tr.data('data')[columnName]);
						}
					}
				} else {
					for (var i = 0; i < len; i++) {
						var $tr = $(selections[i]).parents('tr');
						var data = $tr.data('data');
						data.rowIndex = $tr.data('rowIndex');
						values.push(data);
					}
				}

				/*selections.prop('checked', false);
				me.$me.find('.selectAll').prop('checked', false);*/

				return values;
			},
			/**
			 * 获取选中行的数据字符串
			 * @param  {String Array} dataIndex 数据字段名 可以为字符串或数组
			 * @return {String}       参数字符串
			 *
			 *     @example
			 *     grid.getSelectedDataString('name');//return name=1&name=2&name=3
			 *     grid.getSelectedDataString(['name', 'id']);//return name=1&name=2&name=3&id=1&id=2
			 *
			 */
			getSelectedDataString: function (dataIndex) {
				var selections = me.$me.find(':checked:not(.selectAll)');
				var len = selections.length;
				var values = new Array();

				if (typeof dataIndex === 'string') {
					for (var i = 0; i < len; i++) {
						var $tr = $(selections[i]).parents('tr');

						values.push(dataIndex + '=' + $tr.data('data')[dataIndex]);
					}
				} else if (typeof dataIndex === 'object') {
					for (var j = 0, jLen = dataIndex.length; j < jLen; j++) {
						for (var i = 0; i < len; i++) {
							var $tr = $(selections[i]).parents('tr');

							values.push(dataIndex[j] + '=' + $tr.data('data')[dataIndex[j]]);
						}
					}
				} else {
					return $.error('dataIndex must be string');
				}

				//取消选择
				selections.prop('checked', false);
				me.$me.find('.selectAll').prop('checked', false);

				return values.join('&');
			},
			/**
			 * 获取行数据根据行元素
			 * @param  {Dom} dom 该行下的html元素
			 * @return {Object}         数据对象
			 */
			getRowDataByDom: function (dom) {
				return $(dom).parents('tr').data();
			},
			/**
			 * 获取行数据根据行序号
			 * @param  {Number} index 序号
			 * @return {Object} 数据对象
			 */
			getRowDataByIndex: function (index) {
				if (typeof index === 'number') {
					return me.$me.find('tr:not(.table-head)').eq(index).data();
				} else {
					$.error('arguments must be number');
				}
			},
			/**
			 * 更新行
			 * @param  {Object} rowData  行数据
			 * @param  {Number} rowIndex 行序号
			 */
			updateRecord: function (rowData, rowIndex) {
				var $trs = me.$me.find('tr:not(.table-head)');

				for (var i = 0, len = $trs.length; i < len; i++) {
					if ($($trs[i]).data('rowIndex') === rowIndex) {
						$($trs[i]).after(me.generateTableRow(rowData, rowIndex));
						$($trs[i]).remove();
						break;
					}
				}

				for (var i = 0, len = me.store.length; i < len; i++) {
					if (me.store[i].rowIndex === rowIndex) {
						me.store[i].data = rowData;
						break;
					}
				}
			},
			/**
			 * 选中或取消选中
			 * @param  {Array Number} rowIndex [description]
			 */
			selectRecord: function (rowIndex) {
				if (me.opts.tool.checkboxSelect) {
					var $trs = me.$me.find('tr:not(.table-head)');

					if (typeof rowIndex === 'object') {
						for (var i = rowIndex.length - 1; i >= 0; i--) {
							$trs.eq(rowIndex[i]).find(':checkbox').trigger('click');
						};
					} else {
						$trs.eq(rowIndex).find(':checkbox').trigger('click');
					}
				}
			},
			/**
			 * 删除行
			 * @param {Array} dataObject 调用get方法返回的数据对象数组 包含rowIndex属性
			 *
			 *     @example
			 *     grid.removeRecord(grid.getSelectedData());
			 */
			removeRecord: function (dataObject) {
				for (var i = 0, len = dataObject.length; i < len; i++) {
					if (typeof dataObject[i].rowIndex !== 'undefined') {
						me.gridObj.removeRecordByRowIndex(dataObject[i].rowIndex);
					}
				}
			},
			/**
			 * 删除行根据行序号
			 * @param {Number} rowIndex 行序号
			 *
			 *     @example
			 *     grid.removeRecordByRowIndex(0);
			 */
			removeRecordByRowIndex: function (rowIndex) {
				if (typeof rowIndex === 'number') {
					var $trs = me.$me.find('tr:not(.table-head)');
					//删除dom
					for (var i = 0, len = $trs.length; i < len; i++) {
						if ($($trs[i]).data('rowIndex') === rowIndex) {
							$($trs[i]).remove();
							break;
						}
					}
					//删除store里的对象
					for (var i = 0, len = me.store.length; i < len; i++) {
						if (me.store[i].rowIndex === rowIndex) {
							me.store.splice(i, 1);
							break;
						}
					}
				} else {
					$.error('arguments must be number');
				}
			},
			/**
			 * 切换显示模式
			 * @param  {String} modeName 模式名称
			 *
			 *     @example
			 *     grid.switchDisplayMode('list');//列表
			 *     grid.switchDisplayMode('thumb');//缩略图
			 */
			switchDisplayMode: function (modeName) {
				if (modeName === 'list' || modeName === 'thumb') {
					if (me.opts.schema.displayMode !== modeName) {
						me.opts.schema.displayMode = modeName;
						me.gridObj.refresh();
					}
				} else {
					$.error('arguments must between "list" and "thumb"');
				}
			}
		};
		//配置项
		this.opts = $.extend(true, this.defaults, config || {});

		/*事件注册*/
		//基本
		this.addListeners('basic');
		//分页
		if (this.opts.tool.pagingBar) {
			this.generateDom('tableBottomBar');
			this.addListeners('pagingBar');
		}

		if (this.opts.store.autoLoad) {
			this.loadPage(1);
		}

		//add 增加回调
		if (this.opts.event.callback) {
			this.opts.event.callback(this);
		}
	};

	/**
	 * 载入数据
	 * @private
	 * @param  {Number} page   页数
	 * @param  {Object} params 参数
	 */
	Grid.prototype.loadPage = function (page, params, callback) {
		var me = this;
		var timeoutID = '';

		this.$wrapper.height(this.$wrapper.height());
		//两秒后检查是否已返回数据
		timeoutID = setTimeout(function () {
			if (me.ajaxEndTime !== false && me.ajaxStartTime === me.ajaxEndTime) {
				//载入提示
				me.tableTip('showLoadingTip');
			}
		}, 2000);
		/* 生成参数 */
		if (params) {
			this.ajaxParams = {};
		}
		this.ajaxParams = $.extend(true, this.ajaxParams, this.opts.store.extraParams || {}, params || {});
		if (this.opts.tool.pagingBar) {
			this.ajaxParams = $.extend(true, this.ajaxParams, {
				offset: (page - 1) * this.opts.store.pagesize,
				limit: this.opts.store.pagesize
			});
		}
		//更新当前页数
		this.curPage = page;
		//获取数据
		this.getData(function (type, json) {
			//清除
			me.clean();
			//移除空提示
			me.tableTip('hideTip');
			//移除定时器
			window.clearTimeout(timeoutID);

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
						me.data = [];
						/*空数据提示*/
						me.tableTip('showNoneTip');
					}
				}
				//成功回调 
				if (typeof me.opts.event.onLoadCallback === 'function') {
					me.opts.event.onLoadCallback(json);
				}

			}

			me.$wrapper.height('auto');
			//移除载入动画
			me.tableTip('hideLoadingTip');

			if (typeof callback === 'function') {
				callback(json);
			}
		});
	};

	//渲染表格
	Grid.prototype.renderGrid = function () {
		if (this.opts.schema.displayMode === 'list') {
			//渲染表头
			this.renderTableHead();
			//渲染行
			this.rendererTableRow();
		} else {
			//渲染缩略图模式
			this.rendererThumb();
		}

		//初始化工具
		this.initTool();
	};

	/**
	 * 渲染表头
	 * @private
	 */
	Grid.prototype.renderTableHead = function () {
		if (this.$me.find('thead').length === 0) {
			var $thead = this.$me.find('thead');
			var $tr = '';
			//已存在表头不再生成
			if ($thead.length === 0) {
				$thead = $('<thead><tr class="table-head"></tr></thead>');
			}
			var $tr = $thead.children('.table-head');

			//移除之前的表头内容
			$tr.children().remove();
			//渲染表头单选框
			if (this.opts.tool.checkboxSelect === true) {
				$tr.append('<th style="white-space: nowrap;" class="checkbox-th"><input class="checkbox selectAll" type="checkbox" /></th>');
			}
			//渲染序号
			if (this.opts.tool.enableSerialNumber === true) {
				$tr.append('<th style="white-space: nowrap;width: 30px;">序号</th>');
			}
			//渲染表头
			for (var i = 0, len = this.opts.columns.length; i < len; i++) {
				if (this.opts.columns[i].sortable === true) {
					//排序表头
					var $th = $('<th style="white-space: nowrap;" class="sortable">' + this.opts.columns[i].title + '</th>');

					//渲染图标
					$th.append('<span class="iconfont normal">&#xe61e;</span><span class="iconfont sort-icon asc">&#xe621;</span><span class="iconfont sort-icon desc">&#xe622;</span>');

					//存储数据
					$th.data(this.opts.columns[i]).data({
						state: 1
					});

					//侦听筛选事件
					this.addListeners('sort', $th);

					$tr.append($th);
				} else {
					//普通表头
					$tr.append('<th style="white-space: nowrap;">' + this.opts.columns[i].title + '</th>');
				}
			}

			this.$me.prepend($thead);

			//选框事件
			if (this.opts.tool.checkboxSelect === true) {
				this.addListeners('checkbox');
			}
		} else {
			this.$me.find('thead').show();
		}
	};

	/**
	 * 渲染表格行
	 * @private
	 */
	Grid.prototype.rendererTableRow = function () {
		for (var i = 0, len = this.data.length; i < len; i++) {
			this.$me.append(this.generateTableRow(this.data[i], i));
			this.store.push({
				rowIndex: i,
				data: this.data[i]
			});
		}
	};

	/**
	 * 生成表格行
	 * @private
	 */
	Grid.prototype.generateTableRow = function (rowData, rowIndex) {
		var $tr = $('<tr></tr>');
		var columns = this.opts.columns;

		//渲染单选框
		if (this.opts.tool.checkboxSelect) {
			/*
						$tr.append('<td><input class="checkbox" type="checkbox" data-index=' + rowIndex + ' data-offset=' + (this.ajaxParams.offset + rowIndex) + ' /></td>');
			*/

			if (rowData.id) {
				$tr.append('<td><input class="checkbox" type="checkbox" id=' + rowData.id + ' /></td>');
			} else if (rowData._id) {
				$tr.append('<td><input class="checkbox" type="checkbox" id=' + rowData._id + ' /></td>');
			} else {
				$tr.append('<td><input class="checkbox" type="checkbox" /></td>');
			}

		}
		//渲染序号
		if (this.opts.tool.enableSerialNumber) {
			$tr.append('<td>' + (rowIndex + 1) + '</td>');
		}

		for (var j = 0, columnLen = columns.length; j < columnLen; j++) {
			var $td = $('<td></td>');

			/*内容*/
			if (columns[j].renderer) {
				//渲染回调函数 cellData rowData grid rowIndex cellIndex
				var renderContent = columns[j].renderer(this.getDataByDataIndex(columns[j].dataIndex, rowData), rowData, this.gridObj, j, rowIndex);

				$td.append(renderContent);
			} else {
				var renderContent = this.getDataByDataIndex(columns[j].dataIndex, rowData);
				//格式化
				if (columns[j].formatter) {
					//长度限制
					if (columns[j].formatter.length && typeof columns[j].formatter.length === 'number') {
						if (renderContent && renderContent.length > columns[j].formatter.length) {
							$td.attr('title', renderContent);
							renderContent = renderContent.substring(0, columns[j].formatter.length) + '...';
						}
					}
				}

				$td.append(renderContent);
			}

			//对齐
			if (columns[j].align && (columns[j].align === 'left' || columns[j].align === 'right')) {
				$td.css('text-align', columns[j].align);
			}
			//宽度
			if (columns[j].width && typeof columns[j].width === 'number') {
				$td.width(columns[j].width);
			}
			//换行
			if (columns[j].nowrap !== false) {
				$td.css('white-space', 'nowrap');
			}

			//存储数据
			$.data($td.get(0), {
				cellIndex: j,
				data: rowData[columns[j].dataIndex]
			});

			$tr.append($td);
		};

		//存储数据
		$.data($tr.get(0), {
			rowIndex: rowIndex,
			data: rowData
		});

		return $tr;
	};

	//渲染缩略图模式
	Grid.prototype.rendererThumb = function () {
		this.$me.find('thead').remove();
		if (this.$thumb) {
			this.$thumb.remove();
		}
		//初始化对象
		this.$thumb = $('<ul class="' + this.opts.schema.thumbCls + '"></ul>');

		for (var i = 0, len = this.data.length; i < len; i++) {
			this.generateDom('thumbItem', this.data[i], i);
		}

		if (this.$tableBottomBar) {
			this.$tableBottomBar.before(this.$thumb);
		} else {
			this.$wrapper.append(this.$thumb);
		}
	};

	//获取数据
	Grid.prototype.getData = function (callback) {
		this.ajaxStartTime = this.ajaxEndTime = new Date().getTime();

		if (this.opts.store.data && !this.opts.store.url) {
			this.ajaxEndTime = false;
			/*返回本地数据*/
			callback('success', this.opts.store.data);
		} else {
			/*返回ajax数据*/
			var me = this;
			var params = this.ajaxParams;
			var opts = this.opts;
			var method = 'GET';

			if (opts.store.type === 'GET' || opts.store.type === 'POST') {
				method = opts.store.type;
			}

			//加随机数防止缓存
			if (method === 'GET') {
				params._t = new Date().getTime();
			}

			//同步获取数据
			$.ajax({
				url: opts.store.url,
				type: method,
				dataType: 'json',
				data: params,
				success: function (json) {
					me.ajaxEndTime = new Date().getTime();
					me.ajaxData = json;
					if (json[opts.store.successProperty] == 1) {
						//获取成功
						callback('success', json);
					} else {
						callback('error', json);
					}
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					me.ajaxEndTime = new Date().getTime();
					if (textStatus === 'timeout') {
						callback('timeout');
					} else {
						callback('error');
					}
				}
			});
		}
	};

	//获取数据项
	Grid.prototype.getDataByDataIndex = function (dataIndex, rowData) {
		if (!dataIndex || typeof dataIndex === 'undefined') {
			return '';
		}
		var indexArray = dataIndex.split('.');
		var data = '';

		for (var i = 0, len = indexArray.length; i < len; i++) {
			if (data) {
				data = data[indexArray[i]];
			} else {
				data = rowData[indexArray[i]];
			}
		};

		return data;
	};

	//清除数据
	Grid.prototype.clean = function () {
		this.$me.find('tr').not('.table-head').remove();
		this.$me.find('.selectAll:checked').prop('checked', false);
		if (this.$thumb) {
			this.$thumb.remove();
		}
		//TO 清除右上角信息
		$('.selected-info').text('');
		if (this.$tableBottomBar) {
			this.$tableBottomBar.hide();
		}
	};

	//模版
	Grid.prototype.tpl = function (tpl, data) {
		return tpl.replace(/{{(\w*?)}}/g, function ($1, $2) {
			if (data[$2]) {
				return data[$2];
			} else {
				return '';
			}
		});
	};

	//表格提示
	Grid.prototype.tableTip = function (type) {
		if (!this.opts.tool.tableTip) {
			return false;
		}
		switch (type) {
		case 'showLoadingTip':
			if (this.defaults.tool.ajaxCallbackStatus == "none") {} else if (this.defaults.tool.ajaxCallbackStatus == "text") {

				this.$me.after('<div>数据加载中...</div>');
			} else {
				this.$me.after('<div class="table-tip table-loading"></div>');
			}
			break;
		case 'showNoneTip':
			if (this.defaults.tool.ajaxCallbackStatus == "none") {} else if (this.defaults.tool.ajaxCallbackStatus == "text") {

				this.$me.after('<div>暂无数据</div>');
			} else {
				this.$me.after('<div class="table-tip table-none"></div>');
			}
			break;
		case 'showTimeoutTip':
			if (this.defaults.tool.ajaxCallbackStatus == "none") {} else if (this.defaults.tool.ajaxCallbackStatus == "text") {
				this.$me.after('<div>加载超时，请刷新页面</div>');
			} else {
				this.$me.after('<div class="table-tip table-timeout"></div>');
			}
			break;
		case 'hideLoadingTip':
			this.$me.nextAll('.table-loading').remove();
			break;
		case 'hideTip':
			this.$me.nextAll('.table-tip').remove();
			break;
		}
	};

	//初始化工具
	Grid.prototype.initTool = function () {
		/*分页*/
		if (this.opts.tool.pagingBar) {
			//作用域
			var $aims = $('.' + this.opts.tool.pagingCls, this.$tableBottomBar);
			//引用对象
			var me = this;

			//获取前后页按钮
			var getPrevNextBtn = function (type, hasDisable) {
				var tplHtml = type == 'prev' ? me.opts.tool.pagingPrevBtnHtml : me.opts.tool.pagingNextBtnHtml;

				if (hasDisable) {
					return me.tpl(tplHtml, {
						cls: ' disabled'
					});
				} else {
					return me.tpl(tplHtml, {
						cls: ''
					});
				}
			};

			if (this.total && this.total !== 0) {
				//计算总页数
				this.totalPage = function (pagesize, total) {
					var rem = total % pagesize;

					if (rem > 0) {
						return parseInt(total / pagesize) + 1;
					} else {
						return parseInt(total / pagesize);
					}
				}(this.opts.store.pagesize, this.total);

				if (!$.isNumeric(this.totalPage)) {
					return false;
				}

				$aims.each(function (index, el) {
					var $that = $(this);
					//按钮数
					var btnNums = 0;
					var i = 0;
					//获取分页按钮
					var getPagingBtn = function (hasOn) {
						if (hasOn) {
							return me.tpl(me.opts.tool.pagingBtnHtml, {
								pageNum: i,
								cls: ' on'
							});
						} else {
							return me.tpl(me.opts.tool.pagingBtnHtml, {
								pageNum: i,
								cls: ''
							});
						}
					};
					//清空
					$that.html('');

					//当前页数小于等于4
					if (me.curPage <= 4) {
						for (i = 1; i <= me.totalPage && btnNums < 5; i++) {
							if (i === me.curPage) {
								//当前页
								$that.append(getPagingBtn(true));
							} else {
								//其他页
								$that.append(getPagingBtn(false));
							}
							btnNums++;
						}
					} else {
						//总页数小于当前页数+2
						var lessNums = me.curPage + 2 - me.totalPage;

						if (lessNums < 0) {
							lessNums = 0;
						}

						for (i = me.curPage - 2 - lessNums; i <= me.totalPage && btnNums < 5; i++) {
							if (i === me.curPage) {
								//当前页
								$that.append(getPagingBtn(true));
							} else {
								//其他页
								$that.append(getPagingBtn(false));
							}
							btnNums++;
						}

						//如果起始页大于1
						if (i > 1) {
							$that.prepend(me.tpl(me.opts.tool.pagingBtnHtml, {
								pageNum: 1,
								cls: ''
							}) + '...');
						}
					}

					//如果当前页数小于总页数
					if (i < me.totalPage) {
						$that.append('...' + me.tpl(me.opts.tool.pagingBtnHtml, {
							pageNum: me.totalPage,
							cls: ''
						}));
					} else if (i === me.totalPage) {
						$that.append(getPagingBtn(false));
					}

					//加入前页
					if (me.curPage !== 1) {
						$that.prepend(getPrevNextBtn('prev', false));
					} else {
						$that.prepend(getPrevNextBtn('prev', true));
					}

					//加入尾页
					if (me.curPage !== me.totalPage) {
						$that.append(getPrevNextBtn('next', false));
					} else {
						$that.append(getPrevNextBtn('next', true));
					}

					//点击事件
					me.addListeners('pageBtn', $that.find('a:not(.disabled):not(.on)'));
				});

				if (this.$tableBottomBar) {
					//分页信息显示
					$('.' + this.opts.tool.pagingInfoCls, this.$tableBottomBar).html('当前第 <b>' + this.curPage + '</b> / <b>' + me.totalPage + '</b> 页， 共有 <b>' + this.total + '</b> 条记录');
					//每页显示条数
					$('.' + this.opts.tool.pagingSizeCls, this.$tableBottomBar).val(this.opts.store.pagesize);

					this.$tableBottomBar.show();
				}
			} else if (me.data && me.data.length) {
				//无总页数的分页
				$aims.each(function (index, el) {
					var $that = $(this);
					//清空
					$that.html('');

					//加入上一页
					if (me.curPage !== 1) {
						$that.prepend(getPrevNextBtn('prev', false));
					} else {
						$that.prepend(getPrevNextBtn('prev', true));
					}

					//加入下一页
					if (me.data.length === me.ajaxParams.limit) {
						$that.append(getPrevNextBtn('next', false));
					} else {
						$that.append(getPrevNextBtn('next', true));
					}

					//点击事件
					me.addListeners('pageBtn', $that.find('a:not(.disabled):not(.on)'));
				});

				if (this.$tableBottomBar) {
					//每页显示条数
					$('.' + this.opts.tool.pagingSizeCls, this.$tableBottomBar).val(this.opts.store.pagesize);
					//隐藏跳转
					$('.' + this.opts.tool.pagingJumpCls, this.$tableBottomBar).hide();

					this.$tableBottomBar.show();
				}
			}
		} else {
			if (this.$tableBottomBar) {
				$('.' + this.opts.tool.pagingCls, this.$tableBottomBar).html('');
				$('.' + this.opts.tool.pagingSizeCls, this.$tableBottomBar).hide();
			}
		}

		/*其他工具*/
	};

	//html生成
	Grid.prototype.generateDom = function (type) {
		var me = this;
		var methods = {
			//生成缩略图模式单元dom
			thumbItem: function (rowData, index, type) {
				if (rowData) {
					//内容
					var content = ''

					if (typeof me.opts.schema.thumbRenderer === 'function') {
						content = me.opts.schema.thumbRenderer(rowData, me.gridObj, index);
					} else {
						return $.error('thumb mode need thumbRenderer function to render');
					}

					var $li = $('<li class="' + me.opts.schema.thumbItemCls + '">' + content + '</li>');

					$li.data(rowData);
					me.$thumb.append($li);
				}
			},
			tableBottomBar: function () {
				if (!this.$tableBottomBar) {
					var $tableBottomBar = $('<div class="' + this.opts.tool.tableBottomBarCls + '"></div>');

					if (this.opts.tool.pagingBar) {
						$tableBottomBar
							.append(this.tpl(this.opts.tool.pagingContainerHtml, this.opts.tool))
							.append(this.tpl(this.opts.tool.pagingInfoContainerHtml, this.opts.tool));

						me.$wrapper.append($tableBottomBar);
						me.$tableBottomBar = $tableBottomBar;
					}
				}
			}
		};

		if (methods[type]) {
			methods[type].apply(this, Array.prototype.slice.call(arguments, 1));
		}
	};

	/**
	 * 事件侦听器
	 * @private
	 */
	Grid.prototype.addListeners = function (type) {
		var me = this;
		var listeners = {
			//基本事件
			basic: function () {
				//经过效果
				me.$me.on('mouseover', 'tr', function () {
					$(this).addClass('hover');
				}).on('mouseleave', 'tr', function () {
					$(this).removeClass('hover');
				});
			},
			//选择框
			checkbox: function () {
				//全选选择框
				me.$me.find('.selectAll').bind('change', function () {
					//全选 反选
					me.$me.find(':checkbox:not(.selectAll)').prop('checked', this.checked);
					//更新选中信息
					$('.selected-info').text('当前选中 ' + me.$me.find(':checkbox:not(.selectAll):checked').length + ' 条');
					//tr选中效果
					this.checked ? me.$me.find('tr').addClass('selected') : me.$me.find('tr').removeClass('selected');
				});
				me.$me.on('change', ':checkbox:not(.selectAll)', function () {
					//触发全选
					if ($(':checkbox:not(.selectAll)', me.$me).not(':checked').length == 0) {
						me.$me.find('.selectAll').prop('checked', true);
					} else {
						me.$me.find('.selectAll').prop('checked', false);
					}
					//更新选中信息
					$('.selected-info').text('当前选中 ' + me.$me.find(':checkbox:not(.selectAll):checked').length + ' 条');
					//选中效果
					this.checked ? $(this).parents('tr').addClass('selected') : $(this).parents('tr').removeClass('selected');
				});
			},
			//分页
			pagingBar: function () {
				//更改每页显示
				$('.' + me.opts.tool.pagingSizeCls, me.$tableBottomBar).bind('change', function (event) {
					var val = parseInt($(this).val());

					me.opts.store.pagesize = val;

					me.loadPage(1);
				});
				//跳转页面
				$('.btn-go', this.$tableBottomBar).bind('click', function () {
					var pageNum = parseInt($('.paging-value', me.$tableBottomBar).val());

					if ($.isNumeric(pageNum)) {
						if (pageNum >= 1) {
							if (pageNum <= me.totalPage) {
								me.loadPage(pageNum);
							} else {
								me.gridObj.lastPage();
							}
						} else {
							me.gridObj.firstPage();
						}
					} else {
						if (window.tip) {
							window.tip('请输入正确的数字', 'danger');
						} else {
							alert('请输入正确的数字');
						}
					}

					$('.paging-value', me.$tableBottomBar).val('');
				});
				//回车跳转
				$('.paging-value', me.$tableBottomBar).bind('keydown', function (event) {
					if (event.keyCode === 13) {
						$('.btn-go', this.$tableBottomBar).trigger('click');
					}
				});
			},
			//页码
			pageBtn: function ($dom) {
				$dom.bind('click', function () {
					var type = $.trim($(this).attr('class'));
					var limit = me.opts.store.pagesize;

					switch (type) {
						//首页
					case 'index-page':
						me.gridObj.firstPage();
						break;
						//尾页
					case 'last-page':
						me.gridObj.lastPage();
						break;
						//前一页
					case 'prev-page':
						me.gridObj.prevPage();
						break;
						//后一页
					case 'next-page':
						me.gridObj.nextPage();
						break;
						//页码页
					case 'num-page':
						me.gridObj.gotoPage(parseInt($(this).text()));
						break;
					}
				});
			},
			//排序
			sort: function ($th) {
				$th.bind('click', function () {
					var data = $(this).data();
					var dataIndex = data.dataIndex;

					me.ajaxParams = '';

					$('.sortable', me.$me).not(this).data({
						state: 1
					});
					$('.sortable', me.$me).find('.sort-icon').hide()
						.end().find('.normal').not(this).show();
					$(this).find('.normal').hide();

					switch (data.state) {
						//默认 -- 升序
					case 1:
						$(this).data({
							state: 2
						}).find('.asc').show();

						me.loadPage(1, {
							sort: dataIndex,
							asc: true
						});

						break;
						//升序 -- 降序
					case 2:
						$(this).data({
							state: 3
						}).find('.desc').show();

						me.loadPage(1, {
							sort: dataIndex,
							asc: false
						});

						break;
						//降序 -- 默认
					case 3:
						$(this).data({
							state: 1
						}).find('.normal').show();

						me.loadPage(1);

						break;
					}
				});
			}
		};

		if (listeners[type]) {
			listeners[type].apply(this, Array.prototype.slice.call(arguments, 1));
		}
	};

	/**
	 * @constructor grid初始化方法
	 * @param  {Object} config 配置项
	 * @return {Object} grid 返回的grid对象
	 */
	$.fn.grid = function (config) {
		if (this.length === 0) {
			return false;
		}

		var myGrid = new Grid(this, config);

		return myGrid.gridObj;
	};
})(jQuery);