/**
 * @class Component
 * @version 0.1.0.
 * @author lisfan QQ@448182355 GIT@lisfan 
 * @createDate 21/01/2016
 * @requires jquery-1.11.3
 * @name 功能组件Ui库
 * @markdown
 * @markdown
 * 
 * ## 更新
 * - 2016.1.30
 * 		_ 增加私有方法：检测是否已滚动到某一区域_isRolledToArea();
 * 		_ 增加组件方法：滚动到某一位直Component.RollTo();
 * 		- 增加悬浮导航组件Component.Fixer();
 * 		- 增加悬浮导航组件Component.Roller();
 * - 2016.1.31
 * 		- 增加下拉菜单组件Component.Droplist();
 * - 2016.2.1
 * 		- 编写演示例子;
 * - 2016.2.2
 * 		- 加强下拉菜单组件Component.Droplist()，添加移出行为;
 * 		- 重构方法，取消传参式的行为控制，只通过data-*绑定行为控制
 * - 2016.2.3
 * - 封装到Component类
 * - 为下拉组件增加
 * - 重构Switcher和Enabler
 * ## todo
 *   考虑重新启用传参式的行为控制(已经转换的也未做测试)
 *   Tabber(编写)
 *   写注释
 *   
 */


//滚动到指定位置
//参数1：可以是jq对象，也可以是选择器字符串，也可以指定到指定位置，默认滚动到顶部 0，滚动速度可以指定

function Component() {

	//检测滚动条是否滚动到某一视图区范围内
	//参数1
	function _isRolledToArea(posStart, posEnd) {
		//过滤参数且重排理想参数顺序
		var filterArgs = _filterArguments(arguments, [["string", "number", "jqobject", "array"], ["string", "number", "jqobject"]], 1);

		//输出错误信息，快速定位错误
		if (filterArgs === false) {
			var errorText = "%cComponent._isRolledToArea(posStart, posEnd)";
			log(errorText, "color:#f00");
			return false;
		}

		posStart = filterArgs[0];
		posEnd = filterArgs[1];

		var posArray = [],
			finalPosArray = [];

		//检测参数，封装成数组
		//若参数1为数组，则忽略第2个参数
		if ($.type(posStart) == "array") {
			posArray = posStart;
		} else {
			posArray[0] = posStart;
			if (posEnd) posArray[1] = posEnd;
		}

		//将非数组转为数组格式，再求出一个定位数值数组
		for (var i = 0; i < posArray.length; i++) {

			if ($.type(posArray[i]) == "object") {
				//获取这个选择器的位置
				finalPosArray.push(posArray[i].offset().top);
			} else if ($.type(posArray[i]) == "string") {
				if ($.isNumeric(parseInt(posArray[i])) == "number") {
					finalPosArray.push(parseInt(posArray[i]));
				} else {
					finalPosArray.push($(posArray[i]).offset().top);
				}
			} else if ($.type(posArray[i]) == "number") {
				finalPosArray.push(posArray[i]);
			}
		}

		//重新排序
		finalPosArray = _arraySort(finalPosArray);

		var scrollTop = $(document).scrollTop();
		var finalPosState = false;
		for (var i = 0; i < finalPosArray.length; i++) {
			if (i % 2 == 0) {
				//奇，滚动位置大于定位位置时
				if (scrollTop > finalPosArray[i]) {
					finalPosState = true;
				}
			} else {
				//偶，要滚出的区域，所以前提是必须已经显示
				if (scrollTop > finalPosArray[i]) {
					finalPosState = false;
				}
			}
		}
		return finalPosState;
	}

	this.init = {
		type: "component",
		version: "0.1.0",

		RollTo: function (selector, timeout) {
			var filterArgs = _filterArguments(arguments, [["string", "number", "jqobject"], "number"]);

			//输出错误信息，快速定位错误
			if (filterArgs === false) {
				var errorText = "%cComponent._rollTo(selector, timeout)";
				log(errorText, "color:#f00");
				return false;
			}

			selector = filterArgs[0] === undefined ? filterArgs[0] : 0;
			timeout = filterArgs[1] === undefined ? filterArgs[1] : 500;

			var targetPos;
			if ($.type(selector) == "number") {
				targetPos = selector;
			} else {
				targetPos = $(selector).offset().top;
			}

			//假设目标没有正在执行动画执行滚动
			if (!$("body").is(":animated")) {
				$("body").animate({
					scrollTop: targetPos
				}, timeout);
			}
		},

		Fixer: function (selector, pos, className) {
			//过滤参数且重排理想参数顺序
			var filterArgs = _filterArguments(arguments, [["string", "jqobject"], ["string", "number", "jqobject", "array"], "string"], 1);

			//输出错误信息，快速定位错误
			if (filterArgs === false) {
				var errorText = "%cComponent._comFixer(selector, pos, className)";
				log(errorText, "color:#f00");
				return false;
			}

			selector = filterArgs[0];
			pos = filterArgs[1];
			className = filterArgs[2]
			var $selector = $(selector);
			var me = this;
			$selector.each(function () {
				//将元素的父级设置为相对定位
				$(this).parent().css("position", "relative");
				//获得该元素最原始的定位样式
				var oriStyle = $(this).attr("style") || "";
				var oriPosition = $(this).css("position");

				//为该元素生成一个临时dom占据空间
				var $temp = $("<div></div>");
				$temp.attr("style", oriStyle);
				$temp.css({
					"position": "absolute",
					"left": "0",
					"top": "0",
					"zIndex": "-1",
					"width": $(this).outerWidth(),
					"height": $(this).outerHeight(),
					"visibility": "visible",
				})
				$(this).after($temp);

				var dataPos = $(this).data().pos;
				var dataClass = $(this).data().class;

				var _pos, _className;

				if (pos === undefined) {
					//pos未传入，则从data获取
					if (dataPos) {
						if (dataPos.indexOf(",")) {
							//有逗号分隔时，就说明是一个数组，如[4,6,8,666,522]
							_pos = dataPos.split(",");
						} else if ($.isNumeric(parseInt(dataPos))) {
							_pos = parseInt(dataPos);
						} else {
							_pos = dataPos;
							//_pos = dataPos.toString();
						}
					} else {
						_pos = 0;
					}
				} else {
					_pos = pos;
				}

				if (className === undefined) {
					_className = dataClass || "";
				} else {
					_className = className;
				}

				me.Roller(selector, _pos, _className);

				var self = this;
				//滚动事件
				$(document).scroll(function () {

					var finalPosState = _isRolledToArea(_pos);
					if (finalPosState) {
						//如果已经定位，则不再执行
						if ($(self).css("position") != "fixed") {
							//临时文件占用原空间
							$temp.css("position", oriPosition);
							$(self).addClass("active")
						}
					} else {
						if ($(self).css("position") == "fixed") {
							$temp.css("position", "absolute");
							$(self).removeClass("active")
						}
					}
				})
			})
		},

		//当滚动到指定区域里时，指定元素增加样式名
		Roller: function (selector, pos, className) {

			//过滤参数且重排理想参数顺序
			var filterArgs = _filterArguments(arguments, [["string", "jqobject"], ["string", "number", "jqobject", "array"], "string"], 1);

			//输出错误信息，快速定位错误
			if (filterArgs === false) {
				var errorText = "%cComponent._comRoll(selector, pos, className)";
				log(errorText, "color:#f00");
				return false;
			}

			selector = filterArgs[0];
			pos = filterArgs[1];
			className = filterArgs[2]

			var $selector = $(selector);

			$selector.each(function () {
				//如果pos和style不存在
				//则获取邦定的data-pos和data-class
				//如果data数据也不存在，则使用一个默认值
				//如果是从data中获取的数据都是字符串格式的
				var dataPos = $(this).data().pos;
				var dataClass = $(this).data().class;

				var _pos, _className;

				if (pos === undefined) {
					//pos未传入，则从data获取
					if (dataPos) {
						if (dataPos.indexOf(",")) {
							_pos = dataPos.split(",");
						} else if ($.isNumeric(parseInt(dataPos))) {
							_pos = parseInt(dataPos);
						} else {
							_pos = dataPos;
						}
					} else {
						_pos = 0;
					}
				} else {
					_pos = pos;
				}

				if (className === undefined) {
					_className = dataClass || "";
				} else {
					_className = className;
				}

				var self = this;
				//滚动事件
				$(document).scroll(function () {

					var finalPosState = _isRolledToArea(_pos);
					if (finalPosState) {
						//如果滚动到指定区域
						$(self).addClass(_className);
					} else {
						$(self).removeClass(_className);
					}
				})
			});
		},

		//扩展event增加消失事件
		//下拉菜单
		//触发对象可以设置
		Droplist: function (selector) {
			//过滤参数且重排理想参数顺序
			var filterArgs = _filterArguments(arguments, [["string", "jqobject"]], 1);

			//输出错误信息，快速定位错误
			if (filterArgs === false) {
				var errorText = "%cComponent._comDroplist(selector)";
				log(errorText, "color:#f00");
				return false;
			}

			selector = filterArgs[0];

			var $selector = $(selector);

			$selector.each(function () {
				var $self = $(this);
				//前面的下拉菜单定位比后面的高
				var $trigger = $self.find(".com-trigger");
				var $arrow = $("<b class='com-arrow'></b>");

				var $target = $self.find(".com-target");
				//获取自身的的行为参数
				var selfDataGroup = $self.data().group;

				//获取触发对象com-trigger的行为参数
				var triggerDataEvent = $trigger.data().event;
				var triggerDataTransient = $trigger.data().transient;
				var triggerDataUIArrow = $trigger.data().uiarrow;

				//获取目标对象com-target的行为参数
				var targetDataEvent = $target.data().event;
				var targetDataAnimated = $target.data().animated;
				var targetDataEffect = $target.data().effect;

				var _selfGroup;
				var _triggerEventIn, _triggerEventOut, _triggerTransient, _triggerUIArrow;
				var _targetEvent, _targetAnimated, _targetEffectIn, _targetEffectOut;

				_selfGroup = selfDataGroup || null;
				_triggerTransient = triggerDataTransient || null;
				_triggerUIArrow = triggerDataUIArrow || null;
				_targetEvent = targetDataEvent || null
				_targetAnimated = targetDataAnimated || null;

				if (triggerDataEvent) {
					if (triggerDataEvent.indexOf(",") >= 0) {
						var temp = triggerDataEvent.split(",");
						_triggerEventIn = temp[0];
						_triggerEventOut = temp[1];
					} else {
						_triggerEventIn = triggerDataEvent;
						_triggerEventOut = _triggerEventIn;
					}
				} else {
					_triggerEventIn = "click";
					_triggerEventOut = "click";
				}

				//容错处理hover
				if (_triggerEventIn == "hover") {
					_triggerEventIn = "mouseenter";
					_triggerEventOut = "mouseleave";
				}


				//目标对象事件触发容错，只接受第一个参数
				if (_targetEvent) {
					if (_targetEvent.indexOf(",") >= 0) {
						var temp = _targetEvent.split(",");
						_targetEvent = temp[0];
					}
				}

				if (targetDataEffect) {
					if (targetDataEffect.indexOf(",") >= 0) {
						var temp = targetDataEffect.split(",");
						_targetEffectIn = temp[0];
						_targetEffectOut = temp[1];
					} else {
						_targetEffectIn = targetDataEffect;
						_targetEffectOut = "";
					}
				} else {
					_targetEffectIn = "";
					_targetEffectOut = "";
				}

				var self = this;

				//事件路由
				var eventRouter = {
					"open": function (self) {
						var $self = $(self);
						var $trigger = $self.find(".com-trigger");
						var $arrow = $self.find(".com-arrow");
						var $target = $self.find(".com-target");
						$self.addClass("active");
						$trigger.addClass("active");
						$arrow.addClass("active");

						//取消正在进行的动画
						clearTimeout($target.prop("animatedFlag"));
						$target.prop("opened", true);
						$target.css("display", "block");
						$target.addClass("active").removeClass(_targetEffectOut).addClass(_targetEffectIn);
					},
					"close": function (self) {
						var $self = $(self);
						var $trigger = $self.find(".com-trigger");
						var $arrow = $self.find(".com-arrow");
						var $target = $self.find(".com-target");
						$self.removeClass("active");
						$trigger.removeClass("active");
						$arrow.removeClass("active");
						//取消正在进行的动画
						$target.prop("opened", false);
						$target.removeClass("active").removeClass(_targetEffectIn).addClass(_targetEffectOut);

						//获取动画进行的时间 转换成毫秒
						var gettargetAnimatedDuration = 0;
						if (_targetAnimated) {
							gettargetAnimatedDuration = $target.css("animationDuration").slice(0, -1) * 1000;
						}

						if (_targetEffectOut && gettargetAnimatedDuration != 0) {
							var targetAnimatedFlag = setTimeout(function () {
								$target.css("display", "none");
							}, gettargetAnimatedDuration);
							$target.prop("animatedFlag", targetAnimatedFlag);
						} else {
							$target.css("display", "none");
						}
					}
				}

				//初始化一些东西
				$target.addClass(_targetAnimated);

				//下拉框一个默认事件
				$self.delegate(".com-trigger", "mouseenter", function () {
					clearTimeout($trigger.prop("targetTimeout"));
					$trigger.prop("focused", true);
				}).delegate(".com-trigger", "mouseleave", function () {
					$trigger.prop("focused", false);
				});

				//下拉框一个默认事件
				$self.delegate(".com-target", "mouseenter", function () {
					clearTimeout($target.prop("targetTimeout"));
					$target.prop("focused", true);
				}).delegate(".com-target", "mouseleave", function () {
					$target.prop("focused", false);
				});

				//创建下拉箭头的样式
				if (triggerDataUIArrow) {
					$arrow.addClass(_triggerTransient).addClass(triggerDataUIArrow);
					$trigger.append($arrow);
				}

				//为触发对象绑定事件
				$self.delegate(".com-trigger", _triggerEventIn, function () {
					//stopPropagation(event);
					//筛选出同组对象
					//取得当前的data-group值
					//排除自已
					//假如组名存在，则对同组元素进行去除样式

					if (_selfGroup) {
						//过滤出是同类控件的且不包括自已
						var $group = $("[data-group=" + _selfGroup + "]").filter(selector).not($self);
						if ($group.length > 0) eventRouter["close"]($group);
					}

					if (!_triggerEventIn || _triggerEventOut == _triggerEventIn) {
						if (!$target.prop("opened")) {
							eventRouter["open"](self);
						} else {
							eventRouter["close"](self);
						}
					} else {
						if (!$target.prop("opened")) {
							eventRouter["open"](self);
						}
					}
				})

				//如果移出事件存在，则为触发对象其绑定移出事件
				if (_triggerEventOut != _triggerEventIn && _triggerEventOut) {
					$self.delegate(".com-trigger", _triggerEventOut, function () {
						//移出事件延迟100ms执行
						var triggerTimeout = setTimeout(function () {
							if ($target.prop("opened") && !$target.prop("focused")) {
								eventRouter["close"](self);
							}
						}, 100);
						$trigger.prop("triggerTimeout", triggerTimeout);
					});
				}

				//为目标对象绑定事件
				//获取下拉框的消失事件
				//如果无事件不主动消失
				if (_targetEvent) {
					$self.delegate(".com-target", _targetEvent, function () {
						//移出事件延迟100ms执行
						var targetTimeout = setTimeout(function () {
							if ($target.prop("opened") == true && !$trigger.prop("focused")) {
								eventRouter["close"](self);
							}
						}, 100);
						$target.prop("targetTimeout", targetTimeout);
					})
				}
			})
		},
		//旧方法：会删除：滚动到指定位置
		//参数1：可以是jq对象，也可以是选择器字符串，也可以指定到指定位置，默认滚动到顶部 0，滚动速度可以指定


		/*@example*/
		/*<ul class="compont-nav" data-group="g2">
				<li class="node"><a href="###">小学</a></li>
				<li class="node active"><a href="###">中学</a></li>
				<li class="node"><a href="###">高中</a></li>
				<li class="node"><a href="###">大学</a></li>
			</ul>*/
		//开关组件，对选中的那项，高亮，
		Switcher: function (selector, event, group) {
			//过滤参数且重排理想参数顺序
			var filterArgs = _filterArguments(arguments, [["string", "jqobject"], "string", "string"], 1);

			//输出错误信息，快速定位错误
			if (filterArgs === false) {
				var errorText = "%cComponent.Switcher(selector, event, group)";
				log(errorText, "color:#f00");
				return false;
			}

			selector = filterArgs[0];
			event = filterArgs[1];
			group = filterArgs[2];

			var $selector = $(selector);

			$selector.each(function () {
				var dataEvent = $(this).data().event || "click";
				var dataGroup = $(this).data().group || null;

				var _event = event === undefined ? event : dataEvent;
				var _group = group === undefined ? group : dataGroup;

				//为每个元素添加data-group属性
				if (_group) $(this).attr("data-group", _group);

				var self = this;

				//为触发者绑定事件
				$(self).delegate(".node", _event, function () {
					//stopPropagation(event);
					//筛选出同组对象
					//取得当前的data-group值
					//排除自已
					//假如组名存在，则对同组元素进行去除样式

					if (_group) {
						var $group = $("[data-group=" + _group + "]").filter(selector).not(this);

						if ($group.length > 0) $group.find(".node").removeClass("active");
					}

					$(this).siblings().removeClass("active");

					$(this).addClass("active");
				});
			})
		},


		/*	<ul class="compont-condation-filter" data-total="2" >
				<li class="node"><a href="###">小学</a></li>
				<li class="node active"><a href="###">中学</a></li>
				<li class="node"><a href="###">高中</a></li>
				<li class="node"><a href="###">大学</a></li>
			</ul>*/

		//导航筛选组件，可多选，可以限制多选选中数量，超过后就不再可选
		Enabler: function (selector, total, event) {
			//过滤参数且重排理想参数顺序
			var filterArgs = _filterArguments(arguments, [["string", "jqobject"], "number", "string"], 1);

			//输出错误信息，快速定位错误
			if (filterArgs === false) {
				var errorText = "%cComponent.Enabler(selector, total, event)";
				log(errorText, "color:#f00");
				return false;
			}

			selector = filterArgs[0];
			total = filterArgs[1];
			event = filterArgs[2];

			var $selector = $(selector);

			$selector.each(function () {
				var dataTotal = $(this).data().total || null;
				var dataEvent = $(this).data().event || "click";

				var _total = total === undefined ? total : dataTotal;
				var _event = event === undefined ? event : dataEvent;

				var self = this;

				//为触发者绑定事件
				$(self).delegate(".node", _event, function () {
					if (!_total || $(this).siblings().filter(".active").length < _total) {
						if ($(this).is(".active")) {
							$(this).removeClass("active");
						} else {
							$(this).addClass("active");
						}
					}
				});
			})
		}
	}

	return this.init;
};

var Component = new Component();


function scrollTo(selector, timeout) {
	var filterArgs = _filterArguments(arguments, [["jqobject", "string", "number"], "number"]);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%cComponent.scrollTo(selector, timeout)";
		log(errorText, "color:#f00");
		return false;
	}

	selector = filterArgs[0] === undefined ? filterArgs[0] : 0;
	timeout = filterArgs[1] === undefined ? filterArgs[1] : 500;

	var targetPos;
	if ($.type(selector) == "number") {
		targetPos = selector;
	} else if ($.type(selector) == "string") {
		targetPos = $(selector).offset().top;
	} else if ($.type(selector) == "object") {
		targetPos = selector.offset().top;
	}

	//假设目标没有正在执行动画执行滚动
	if (!$("body").is(":animated")) {
		$("body").animate({
			scrollTop: targetPos
		}, timeout);
	}
}