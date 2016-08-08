/**
 * @author lisfan
 * @class SelectPanel
 * @extends jquery-1.8.3
 * @markdown
 * #选择面板框插件
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
 
 
 SelectPanel
 
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
(function ($) {
	"use strict";

	/**
	 * 
	 * @param   {jobject|string}   id     直接传入jquery对象，或者传入id字符串名，id字符串前面需要加'#'号，容错处理，如果不包含#号会自动添加#号
	 * @param   {JSON}   config  配置项
	 * @returns {[[Type]]} [[Description]]
	 */
	var SelectPanel = function (id, config) {

		/**
		 * 验证ID名称是否为符合的字符串，不符合则抛出错误
		 * @param   {string} id 容错处理，如果不包含#号会自动添加#号
		 * @returns {Boolean}  
		 */

		var validId = function (s) {
				if (s && $.type(s) === "string") {
					//合法字符串，但缺少#号时，自动添加
					if (s.indexOf("#") === -1) {
						s += "#" + $.trim(s);
					}

					if (validObject($(s))) {
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


		var me = this;
		var $me = $(id);

		//父包裹对象
		//父包裹器
		var boxWrapper = "<div id='" + $me.attr("id") + "-selectpanel' class='selectpanel'></div>";

		$me.wrap(boxWrapper);

		me.$boxWrapper = $me.parent();
		//列表包裹对象
		me.$selectList = null;
		//面板视图对象
		me.$panelViewer = null;
		//选中项的数组索引值
		me.selectedIndex = [];

		//默认配置项
		//请求ajax地址 url:
		//本地数据
		//data:{}
		//请求方式:post


		//默认配置
		var defaults = {

			//自动加载
			//autoLoad: true,
			//请求地址
			url: null,
			//请求方式
			type: 'POST',

			eventType: "click", //事件行为 

			selectedId: ["3", "5"], //选中状态数组，会覆盖data数据设置的select状态

			//全局配置
			setting: {
				modalName: null, //可以指定需要创建选框的对象名称，默认在当前对象上创建选框
				modalType: "drop", //tree（树型-多级滑落展开）|floor（层级）|view(单级视图，左右切换)|drop(单级下拉)|panel(面板实时显示)
				showPanel: true, //实时面板是否开启，开启时，选中完弹框内容后，会自动关闭弹框（不占文本流），未开启时则一直显示弹框（占文本流）,面板视图是依据列表选框存在的，如果列表选框不存在，则视图元法完成
				panelName: null, //可以指定需要创建视图的对象名称，默认在当前对象上创建视图
				selectType: "multiple", //none(无需)|single(单选)|multiple(多选)，不需要实际的input表单元素，直接用图片模拟
				selectedStyle: "higlight", //box(选框) | highlight(高亮)
				async: true, // true | false,同步 | 异步 懒惰性加载 AJAX， 点击加载
				animation: false, //| false,
				//树型私有配置
				tree: {
					childIndent: 10, //子元素缩进距离
				}
			},
			//数据配置
			data: {
				"total": 200,
				"s": "1",
				"d": [{
					"id": "01",
					"value": "yyzx",
					"name": "应用中心",
					"href": "http://www.baidu.com",
					"open": true,
					"selected": false,
					"childs": [
						{
							"id": "01",
							"value": "sjz",
							"name": "设计组",
							"image": "../images/icon/icon1.png",
							"href": "http://www.baidu.com",
							"selected": false,
							"childs": [
								{
									"id": "101",
									"value": "zjw",
									"name": "朱建伟",
									"image": "../images/icon/icon2.png",
									"selected": true,

            },
								{
									"id": "102",
									"value": "ytt",
									"name": "严听听",
									"image": "../images/icon/icon3.png",
									"selected": true,
            }
          ]
        },
						{
							"id": "02",
							"value": "jsz",
							"name": "技术组",
							"childs": [
								{
									"id": "201",
									"value": "qdz",
									"name": "前端开发组",
									"childs": [
										{
											"id": "2201",
											"value": "msl",
											"name": "莫胜利",
											"childs": [
												{
													"id": "22201",
													"value": "jhjd",
													"name": "锦湖街道",

                    },
												{
													"id": "22202",
													"value": "ayjd",
													"name": "安阳街道",

                    }
                  ]
                },
										{
											"id": "2102",
											"value": "qsxlr",
											"name": "我是新来的"
                }
              ]
            },
								{
									"id": "202",
									"value": "kfz",
									"name": "测试组",
									"childs": [{
										"id": "2213",
										"value": "xfp",
										"name": "莫胜利"
										}, {
										"id": "2211",
										"value": "jxx",
										"name": "金鑫鑫"
										}]
            }
          ]
        }, {
							"id": "01",
							"value": "sjz",
							"name": "设计组",
							"image": "../images/icon/icon1.png",
							"href": "http://www.baidu.com",
							"selected": false,
							"childs": [
								{
									"id": "101",
									"value": "zjw",
									"name": "朱建伟"
            },
								{
									"id": "102",
									"value": "ytt",
									"name": "严听听"
            }
          ]
        },
						{
							"id": "02",
							"value": "jsz",
							"name": "技术组",
							"childs": [
								{
									"id": "201",
									"value": "qdz",
									"name": "前端开发组",
									"childs": [
										{
											"id": "2201",
											"value": "msl",
											"name": "莫胜利",
											"childs": [
												{
													"id": "22201",
													"value": "jhjd",
													"name": "锦湖街道",

                    },
												{
													"id": "22202",
													"value": "ayjd",
													"name": "安阳街道",

                    }
                  ]
                },
										{
											"id": "2102",
											"value": "qsxlr",
											"name": "我是新来的"
                }
              ]
            },
								{
									"id": "202",
									"value": "kfz",
									"name": "测试组",
									"childs": [{
										"id": "2213",
										"value": "xfp",
										"name": "莫胜利"
										}, {
										"id": "2211",
										"value": "jxx",
										"name": "金鑫鑫"
										}]
            }
          ]
        }, {
							"id": "01",
							"value": "sjz",
							"name": "设计组",
							"image": "../images/icon/icon1.png",
							"href": "http://www.baidu.com",
							"selected": false,
							"childs": [
								{
									"id": "101",
									"value": "zjw",
									"name": "朱建伟"
            },
								{
									"id": "102",
									"value": "ytt",
									"name": "严听听"
            }
          ]
        },
						{
							"id": "02",
							"value": "jsz",
							"name": "技术组",
							"childs": [
								{
									"id": "201",
									"value": "qdz",
									"name": "前端开发组",
									"childs": [
										{
											"id": "2201",
											"value": "msl",
											"name": "莫胜利",
											"childs": [
												{
													"id": "22201",
													"value": "jhjd",
													"name": "锦湖街道",

                    },
												{
													"id": "22202",
													"value": "ayjd",
													"name": "安阳街道",

                    }
                  ]
                },
										{
											"id": "2102",
											"value": "qsxlr",
											"name": "我是新来的"
                }
              ]
            },
								{
									"id": "202",
									"value": "kfz",
									"name": "测试组",
									"childs": [{
										"id": "2213",
										"value": "xfp",
										"name": "莫胜利"
										}, {
										"id": "2211",
										"value": "jxx",
										"name": "金鑫鑫"
										}]
            }
          ]
        }
      ]
				}, {
					"id": "02",
					"value": "sz",
					"name": "设置",
					"image": "../images/icon/icon2.png",
					"href": "www.baidu.com",
					"open": true,
					"selected": false,
					"childs": [{
						"id": "02",
						"value": "jsz",
						"name": "技术组",
						"childs": [
							{
								"id": "201",
								"value": "qdz",
								"name": "前端开发组",
								"childs": [
									{
										"id": "2201",
										"value": "msl",
										"name": "莫胜利",
										"childs": [
											{
												"id": "22201",
												"value": "jhjd",
												"name": "锦湖街道",

                    },
											{
												"id": "22202",
												"value": "ayjd",
												"name": "安阳街道",

                    }
                  ]
                },
									{
										"id": "2102",
										"value": "qsxlr",
										"name": "我是新来的"
                }
              ]
            },
							{
								"id": "202",
								"value": "kfz",
								"name": "测试组",
								"childs": [{
									"id": "2213",
									"value": "xfp",
									"name": "莫胜利"
										}, {
									"id": "2211",
									"value": "jxx",
									"name": "金鑫鑫"
										}]
            }
          ]
        }, ]
				}, {
					"id": "03",
					"value": "xx",
					"name": "信息",
					"image": "../images/icon/icon3.png",
					"href": "www.baidu.com",
					"open": true,
					"selected": true,
					"childs": []

				}, {
					"id": "04",
					"value": "tpzx",
					"name": "图片中心",
					"image": "../images/icon/icon4.png",
					"href": "www.baidu.com",
					"open": true,
					"selected": false,
					"childs": [
						{
							"id": "01",
							"value": "sjz",
							"name": "设计组",
							"image": "../images/icon/icon1.png",
							"href": "http://www.baidu.com",
							"selected": false,
							"childs": [
								{
									"id": "101",
									"value": "zjw",
									"name": "朱建伟"
            },
								{
									"id": "102",
									"value": "ytt",
									"name": "严听听"
            }
          ]
        },
						{
							"id": "02",
							"value": "jsz",
							"name": "技术组",
							"childs": [
								{
									"id": "201",
									"value": "qdz",
									"name": "前端开发组",
									"childs": [
										{
											"id": "2201",
											"value": "msl",
											"name": "莫胜利",
											"childs": [
												{
													"id": "22201",
													"value": "jhjd",
													"name": "锦湖街道",

                    },
												{
													"id": "22202",
													"value": "ayjd",
													"name": "安阳街道",

                    }
                  ]
                },
										{
											"id": "2102",
											"value": "qsxlr",
											"name": "我是新来的"
                }
              ]
            },
								{
									"id": "202",
									"value": "kfz",
									"name": "测试组",
									"childs": [{
										"id": "2213",
										"value": "xfp",
										"name": "莫胜利"
										}, {
										"id": "2211",
										"value": "jxx",
										"name": "金鑫鑫"
										}]
            }
          ]
        }, {
							"id": "01",
							"value": "sjz",
							"name": "设计组",
							"image": "../images/icon/icon1.png",
							"href": "http://www.baidu.com",
							"selected": false,
							"childs": [
								{
									"id": "101",
									"value": "zjw",
									"name": "朱建伟"
            },
								{
									"id": "102",
									"value": "ytt",
									"name": "严听听"
            }
          ]
        }]

				}, {
					"id": "05",
					"value": "ykt",
					"name": "云课堂",
					"image": "../images/icon/icon5.png",
					"href": "www.baidu.com",
					"open": true,
					"selected": true,
					"childs": []

				}, {
					"id": "06",
					"value": "wljcy",
					"name": "网络纠察员",
					"image": "../images/icon/icon6.png",
					"open": true,
					"selected": false,
					"childs": []

				}]
			},
			styles: { //设置样式
				//面板视图样式配置
				panelViewer: { /*CSS*/ },

				//列表选项框样式配置
				selectList: {
					/*CSS*/
				},
				selectItem: { /*CSS*/ }
			}
		};

		//自定义配置项
		me.config = $.extend({}, defaults, config);

		//数据验证器：覆盖配置顶后的各种数据各种验证
		var validator = function () {};

		//内容生成器：要据数据生成dom内容结构，同时保存选中项
		var generateDom = function (data) {
			//假如数据不存在或者不成功，或者没有可用数据
			//未传入参数时，使用本地默认配置数据
			//todo 模式错误时的显示处理

			/*if (data && data.s == "1") {
				var data = data.d;
			} else {
				console.log("获取数据不成功，请刷新检查数据源");
				return false;
			}*/

			//根据类型生成模板
			var modalType = me.config.setting.modalType;
			var selectType = me.config.setting.selectType;

			//根据传入的数据对象，判断是否选中类型以及多选模式，生成相应的选项按钮代码
			var createOptionTemplet = function (dataCell) {
				if (selectType === "single" && dataCell.selected) {
					return '<b class="single-enabled-all"></b>';
				} else if (selectType === "single" && !dataCell.selected) {
					return '<b class="single-enabled"></b>'
				} else if (selectType === "multiple" && dataCell.selected) {
					return '<b class="enabled-all"></b>'
				} else if (selectType === "multiple" && !dataCell.selected) {
					return '<b class="enabled"></b>'
				} else {
					return "";
				}
			};

			//根据传入的数据对象，判断是否存在图片，生成相应的图片代码
			var createImageTemplet = function (dataCell) {
				return dataCell.image ? ' <img src="' + dataCell.image + '" alt="' + dataCell.name + '">' : '';
			};

			//根据传入的数据对象，判断是否存在链接，生成相应的链接代码
			var createNameTemplet = function (dataCell) {
				return dataCell.href ? '<a href="' + dataCell.href + '" title="' + dataCell.name + '" target="_blank">' + dataCell.name + '</a>' : '<label>' + dataCell.name + '</label>';
			}

			if (modalType === "drop") {
				//是否多选
				var checkallHtml = me.config.setting.selectType == "multiple" ? '<div class="checkall"><b class="check-icon enabled"></b>全选</div>' : ''

				me.$selectList = $('<div class="selectlist droplist">' + checkallHtml + '</div>');

				var domTemplet = "<ul>";
				for (var i = 0; i < data.length; i++) {
					//TODO 数据绑定，将绑定数据的方式剥离，将索引序号保留
					var dataCell = data[i];
					if (dataCell.selected) {
						me.selectedIndex.push(i)
					}
					//TODO 假如为单选，则忽略后面的选中状态，以先出现的为主
					var optionTemplet = createOptionTemplet(dataCell);
					var imageTemplet = createImageTemplet(dataCell);
					var nameTemplet = createNameTemplet(dataCell);
					domTemplet += '<li data-index="' + i + '" data-id="' + dataCell.id + '" data-value="' + dataCell.value + '">' + optionTemplet + imageTemplet + nameTemplet + '</li>';
				}
				domTemplet += '</ul>';
				me.$selectList.append(domTemplet);
			} else if (modalType === "tree") {
				//数据循环树结构，每个支叶加载ajax

				//树列表包裹
				me.$selectList = $("<div class='selectlist treelist'></div>");

				//存在子项，添加标签
				var childArrow = '<i class="child-arrow"></i>';
				//检查是否含有子项,并且含有数据
				var haveChilds = function (o) {
					if (o.childs !== undefined && $.type(o.childs) === "array") {
						return true;
						//继续判断他自已的，如果不放
					} else {
						return false;
					}
				}

				//若含有子项，则循环创建
				var creatChildDom = function (o) {
					//判断当前对象是否存在子项数据
					if (haveChilds(o)) {

						var selChild = "";
						if (o.open) {
							selChild = '<ul class="treelist-child active">';
						} else {
							selChild = '<ul class="treelist-child">';
						}

						for (var i = 0; i < o.childs.length; i++) {
							//有数据存在，循环判断
							var dataCell = o.childs[i];
							var lastChild = creatChildDom(dataCell);
							//TODO 假如为单选，则忽略后面的选中状态，以先出现的为主
							var optionTemplet = createOptionTemplet(dataCell);
							var imageTemplet = createImageTemplet(dataCell);
							var nameTemplet = createNameTemplet(dataCell);

							selChild += '<li data-index="' + i + '" data-id="' + dataCell.id + '" data-value="' + dataCell.value + '"><span class="treelist-label">' + childArrow + optionTemplet + imageTemplet + nameTemplet + '</span>' + lastChild + '</li>';
						}
						selChild += "</ul>";
						return selChild;
					} else {
						return "";
					}
				}

				//创建根树父级
				var domTemplet = "";
				for (var i = 0; i < data.length; i++) {
					//创建树根父标题

					var optionTemplet = createOptionTemplet(data[i]);
					var imageTemplet = createImageTemplet(data[i]);
					var nameTemplet = createNameTemplet(data[i]);

					var selTitle = '<div class="treelist-label">' + childArrow + optionTemplet + imageTemplet + nameTemplet + '</div>';

					var selParent = "";

					if (data[i].open) {
						selParent = '<ul class="treelist-parent active">';
					} else {
						selParent = '<ul class="treelist-parent">';
					}



					//创建父级选项
					//判断元素是否存在childs属性，不存在跳出本次循环
					if (haveChilds(data[i])) {
						for (var j = 0; j < data[i].childs.length; j++) {
							var dataCell = data[i].childs[j];
							//循环遍历子项
							var lastChild = creatChildDom(dataCell);
							var optionTemplet = createOptionTemplet(dataCell);
							var imageTemplet = createImageTemplet(dataCell);
							var nameTemplet = createNameTemplet(dataCell);

							selParent += '<li><span class="treelist-label">' + childArrow + optionTemplet + imageTemplet + nameTemplet + '</span>' + lastChild + '</li>'
						}
					}
					selParent += "</ul>";
					domTemplet += selTitle + selParent;
				}
				me.$selectList.append(domTemplet);

			} else {
				console.error("不存在 %s 此显示模式，请检查错误", modalType);
				return false;
			}

			me.$boxWrapper.append(me.$selectList);
			return true;
		};

		//数据绑定器
		var generateData = function () {

		};

		//面板视图器
		var panelViewer = function () {

			if (me.config.setting.showPanel) {
				var panelName = me.config.setting.panelName;
				//如果没有指定面板视图器对象，并且本对象的节点是div时，则将本对象的视为面板视图器，否则创建一个面板框，层叠到最上面
				if (panelName === null) {
					var panelViewerListHtml = '<ul class="clearfix"><li class="noitem">未选择图标</li></ul>';
					if ($me.get(0).nodeName !== "DIV") {
						//当前对象非DIV对象
						me.$panelViewer = $('<div class="panelviewer"><i class="panelviewer-icon"></i></div>');
						me.$panelViewer.append(panelViewerListHtml);
						$me.after(me.$panelViewer);
						$me.hide();
					} else {
						//更改样式
						$me.removeClass();
						$me.addClass("panelviewer");
						$me.append('<i class="panelviewer-icon"></i>');
						$me.append(panelViewerListHtml);
						me.$panelViewer = $me;;
					}
				} else {
					//TODO ddd
				}
			}
		};

		//样式渲染器：渲染按钮样式
		var renderer = function () {

			//TODO 默认样式，选框默认样式，视图默认样式

			//覆盖自定义样式
			//面板视图样式
			me.$panelViewer.css(me.config.styles.panelViewer);

			//列表选框样式
			me.$selectList.css(me.config.styles.selectList);

			//列表选项高亮样式
			me.$selectList.find("li").css(me.config.styles.selectItem)


		};

		//事件侦听器
		var addListener = function () {
			var selectItem = me.$selectList.find("li");
			var selectButton = selectItem.find("b");
			var panelItem = me.$panelViewer.find("li");

			var modalType = me.config.setting.modalType;
			var selectType = me.config.setting.selectType
				//todo 模式错误时的显示处理

			//列表内容模板
			var domTemplet = "";
			if (modalType === "drop") {

				//选项框选框按钮点击事件
				selectItem.click(function (event) {
					event.stopPropagation();
					//单选模式
					if (selectType === "single") {

						//按钮选中，列表激活增加样式，面板呈现
						if ($(this).is(".active")) {
							me.selectItem();
						} else {
							var addIndex = $(this).attr("data-index");
							//提交选中项方法
							me.selectItem(addIndex);
						}
						//隐藏列表明选项框
						me.hideSelectList();

					} else {
						//多选模式
						//遍历列表
						//按选择顺序来，而不按文档中排序顺序
						//选中的字段

						if ($(this).is(".active")) {
							//删除ID
							//通过查询列表选项框的项在面板视图中为第几个，就删除第几个位置
							var delIndex = me.$panelViewer.find("li").index(me.$panelViewer.find("li[data-index=" + $(this).parent().attr("data-index") + "]"));
							me.selectedIndex.splice(delIndex, 1);
						} else {
							//增加ID到数组
							var addIndex = $(this).parent().attr("data-index");
							me.selectedIndex.push(addIndex)
								//提交选中项方法
						}
						me.selectItem(me.selectedIndex);
					}
				});
			} else if (modalType === "tree") {

			}


			//通用事件


			//点击空白区域关闭选框事件
			$("html").click(function () {
				if (me.$selectList.is(":visible")) {
					me.hideSelectList();
				}
			});

			//点击面板框打开列表选项框事件
			me.$panelViewer.click(function (event) {
				event.stopPropagation();

				if (me.$selectList.is(":visible")) {
					me.hideSelectList();
				} else {
					me.showSelectList();
				}
			});

			//面板选项关闭取消按钮
			me.$panelViewer.delegate(".active i", "click", function (event) {
				var delIndex = me.$panelViewer.find("li").index(me.$panelViewer.find("li[data-index=" + $(this).attr("data-index") + "]"));
				me.selectedIndex.splice(delIndex, 1);
				me.selectItem(me.selectedIndex);

				event.stopPropagation();
			})


			me.$selectList.click(function (event) {
				event.stopPropagation();
			});

			me.$selectList.find(".check-icon").click(function () {
				if ($(this).is(".enabled-all")) {
					me.selectItem([]);
				} else {
					me.selectAllItem();
				}
			});

		};

		//初始化
		var init = function () {
			console.log("selectpanel初始化成功")
			validator();
			generateDom(me.config.data.d);
			//创建成功执行下面的语句
			generateData();
			panelViewer();
			renderer();
			addListener();
			//初始化面板选中视图，写到panelviewer里
			me.selectItem(me.selectedIndex);
			//初始化后，回调函数
			if (me.config.callback) {
				me.config.callback(this);
			}
		}();
	};


	//selectItem() 选中某项：传入一个或数组索引序号，同时保存该索引序号到全局属性,判断选框中所有值是否都被选中，若都选中，则选中多选框（假如有的话）
	SelectPanel.prototype.selectItem = function (index) {
		//TODO 前提先绑定数据
		var data = this.config.data.d;
		//转数据类型字符
		//验证值类型

		//值可能是数字，可能是字符串，可能是非数字，可能是数组
		//超过字序容错
		if ($.type(parseInt(index)) !== "number" && $.type(index) !== "array") {
			return false;
		}

		var selectType = this.config.setting.selectType;
		var selectItem = this.$selectList.find("li");
		var selectButton = selectItem.find("b");
		var checkAllButton = this.$selectList.find(".checkall b");

		//todo 全选标志 分离出来

		//呈现面板视图变化
		var panelItemHtml = "";

		//根据索引位置高亮选项
		var setSelectItemHighlight = function (index) {
			selectItem.eq(index).addClass("active");
		};

		//根据索引位置按钮选中状态，判断是单选，还是多选，设置不同的状态
		var setSelectButtonState = function (index) {
			if (selectType === "single") {
				selectButton.eq(index).attr("class", "single-enabled-all");
			} else {
				selectButton.eq(index).attr("class", "enabled-all");
			}

		};

		//根据选择结果判断全选按钮的状态
		var checkAllButtonState = function (index) {
			if (index && index.length == selectItem.length) {
				checkAllButton.attr("class", "enabled-all")
			} else {
				checkAllButton.attr("class", "enabled")
			}
		};

		//根据索引位置按钮选中状态，生成对应的面板选项dom
		var createPanelTemplet = function (indexo) {
			//BUG
			//根据传入的数据对象，判断是否存在图片，生成相应的图片代码
			var createPanelImageTemplet = function (dataCell) {
				return dataCell.image ? ' <img src="' + dataCell.image + '" alt="' + dataCell.name + '">' : '';
			};

			//根据传入的数据对象，判断是否存在链接，生成相应的链接代码
			var createPanelNameTemplet = function (dataCell) {
				return dataCell.href ? '<a href="' + dataCell.href + '" title="' + dataCell.name + '" target="_blank">' + dataCell.name + '</a>' : dataCell.name;
			};
			var dataCell = data[indexo];
			//console.log(dataCell)
			var panelImageTemplet = createPanelImageTemplet(dataCell);
			var panelNameTemplet = createPanelNameTemplet(dataCell);

			//判断类型生成不同的内容
			if (selectType == "single") {
				return '<li data-index="' + index + '" data-id="' + dataCell.id + '" data-value="' + dataCell.value + '" class="active only">' + panelImageTemplet + panelNameTemplet + '</li>';
			} else {
				return '<li data-index="' + index + '" data-id="' + dataCell.id + '" data-value="' + dataCell.value + '" class="active">' + panelImageTemplet + panelNameTemplet + '<i class="iconfont"></i></li>'
			}
		}

		//控制样式
		//清空并重新创建面板视图区内容
		//选项高亮，按钮选中，视图变更，判断全选，清空数据存储
		if (!index || index.length === 0) {

			//列表选项框取消所有选中项
			selectItem.removeClass("active");
			selectButton.attr("class", "enabled");
			panelItemHtml = '<li class="noitem">未选择图标</li>';
			checkAllButtonState();

		} else {
			//只要是type为single，那就是单选，无论index是数字还是数组
			if (selectType == "single") {
				//取值
				index = $.type(index) == "array" ? index[0] : index;
				//那么就只传入一个数字给设置项

				//清空所有的
				selectItem.removeClass("active");
				selectButton.attr("class", "single-enabled");

				setSelectItemHighlight(index);
				setSelectButtonState(index);
				panelItemHtml = createPanelTemplet(index);
				//生成panelhtml
			} else if (selectType == "multiple") {
				//清空所有的
				selectItem.removeClass("active");
				selectButton.attr("class", "single-enabled");

				checkAllButtonState(index);

				for (var i = 0; i < index.length; i++) {
					setSelectItemHighlight(index[i]);
					setSelectButtonState(index[i]);
					panelItemHtml += createPanelTemplet(index[i]);
				}
			}
		}
		//清空数组，存储新值,保存ID和索引值
		this.selectedIndex = index;
		//附加DOM
		this.$panelViewer.find("ul").empty().append(panelItemHtml);

	};

	//selectChild() 效率上更加高级 全选子项数据
	SelectPanel.prototype.selectAllItem = function () {
		var selectItem = this.$selectList.find("li")

		var addIndex = []
			//如果全选，那就重置按顺序走
		for (var i = 0; i < selectItem.length; i++) {
			addIndex.push(selectItem.eq(i).attr("data-index"));
		}
		this.selectItem(addIndex);
	};

	//面板展示方式变更
	SelectPanel.prototype.panelDisplay = function () {

	};
	//reload()：重载，可根据传入data参数进行重置样式内容
	SelectPanel.prototype.reload = function (ajax, data) {
		//ajax地址请求
		//重置列表选框
		//重置面板视图
	};


	// 
	/**
	 * getSelectedData() 获取列表选框所有被选中的项数据
	 * @param   {String} key   返回指定的选中顶属性值
	 * @param   {Number} index 返回指定的选中顶索引值
	 * @returns {Array} 返回数组对象，或对象，或字符串
	 */
	SelectPanel.prototype.getSelectedData = function (key, index) {
		//要返回的数组对象
		var dataArray = [];

		//如果未选中选项，则直接返回空对象
		if (this.selectedIndex.length === 0) {
			return dataArray;
		}

		//遍历
		for (var i = 0; i < this.selectedIndex.length; i++) {
			dataArray[i] = this.config.data.d[this.selectedIndex[i]];
		}

		//如果参数是索引值，则输出该条的数据
		//如果同时存在属性名和索引值(忽略其他值），则输出指定条数的属性名

		if (arguments.length >= 2 && $.type(key) === "string" && $.type(index) === "number") {
			dataArray = dataArray[index][key];
		} else if (arguments.length == 1 && $.type(arguments[0]) === "string") {
			for (var i = 0; i < dataArray.length; i++) {
				dataArray[i] = dataArray[i][arguments[0]];
			}
		} else if (arguments.length == 1 && $.type(arguments[0]) === "number") {
			if (arguments[0] < dataArray.length) {
				dataArray = dataArray[arguments[0]];

			} else {
				dataArray = []
			}
		}

		return dataArray;
	};

	//getData():获取指定数据可指定名称[单个或多个],
	/**
	 * getData() 获取列表选框中指定的项数据,TODO 如果选择父亲，将获取子项的所有数据数组
	 * @param   {Number} index 返回指定的选中顶索引值
	 * @param   {String} key   返回指定的选中顶属性值
	 * @returns {Array} 返回数组对象，或对象，或字符串
	 */
	SelectPanel.prototype.getData = function (key, index) {

	};

	//更改某项数据项
	SelectPanel.prototype.setData = function (key, value, index) {

	};

	//增加新数据项，（可指定位置，默认末尾）
	SelectPanel.prototype.addData = function (key, value, offset) {

	};

	//删除数据项（可指定位置，默认末尾）
	SelectPanel.prototype.delData = function (startIndex, endIndex) {

	};



	//显示列表选项框
	SelectPanel.prototype.showSelectList = function () {
		//打开列表选项框
		this.$selectList.show();
		this.$panelViewer.addClass("focus");
		this.$panelViewer.find(".panelviewer-icon").addClass("active");


	};
	//隐藏列表选项框
	SelectPanel.prototype.hideSelectList = function () {
		this.$selectList.hide();
		this.$panelViewer.removeClass("focus");
		this.$panelViewer.find(".panelviewer-icon").removeClass("active");
	};


	$.fn.selectpanel = function (config) {
		//当前对象不存在
		if (this.length === 0) {
			console.error("%c%s%c 对象不存在，请检查", "font-weight:bold;text-decoration:underline", this.selector, "");
			return false;
		}

		//实例化
		var treelist = new SelectPanel(this, config);

		//返回初始化对象
		return treelist;
	};
})(jQuery);