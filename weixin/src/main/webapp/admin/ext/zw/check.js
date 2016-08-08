/**
 * @author Ezios
 * @class check
 * @extends jquery-1.8.3
 * @markdown
 * #校验插件
 * 版本 0.2.3 日期 2015-4-13
 * 校验条件列表详见Config options
 *
 * 示例：
 * 在需要校验的表单元素上加上校验条件data-check属性， 如data-check="max-len:10"
 * 
 *     @example
 *     if($('form').check()){
 *         alert('校验通过');
 *     }
 *
 *     $('dom').check('setCheck', {
 *         check: '*'
 *     });
 */
/**
 * @cfg data-check 校验条件
 *      <p>多个条件用 | 隔开</p>
 * @cfg [data-check.must] 必填项
 * @cfg [data-check.n] 仅为数字
 * @cfg [data-check.mobile] 手机号
 * @cfg [data-check.max-len] 最大长度
 *
 *      data-check="max-len: 10"
 * @cfg [data-check.max-char-len] 字符最大长度 区分汉字和英文
 *
 *      data-check="max-char-len: 10"
 * @cfg [data-check.min-len] 最小长度
 *
 *      data-check="min-len: 10"
 * @cfg [data-check.min-char-len] 字符最小长度 区分汉字和英文
 *
 *      data-check="min-char-len: 10"
 * @cfg [data-check.fit] 校验指定name值的表单元素的值是否与校验元素相同，例如确认密码
 *
 *      data-check="fit: account"
 * @cfg [data-check.scope] 数字区间限制
 * 
 *      data-check="scope: 1-10"
 * @cfg [data-check.idcard] 身份证
 * 
 *      data-check="idcard"
 * @cfg [data-check.url] url地址
 *
 *      data-check="url"
 * @cfg [data-check.email] 电子邮箱
 *
 *      data-check="email"
 * @cfg [data-check.ip] ip地址
 *
 *      data-check="ip"
 * @cfg [data-check.custom] 自定义验证函数
 *
 *      在表单元素上定义函数名
 *      data-check="custom: functionName"
 *      在window对象上添加新函数
 *      --$control 校验元素dom
 *      function functionName($control){
 *          //CODE
 *          return {
 *              //'验证是否通过的标志'
 *              flag: false,
 *              //'验证失败时显示的信息'
 *              message: '验证失败'
 *          };
 *      }
 *
 */
;
!(function ($) {
	var $me = {};
	var cls = {
		errorCls: 'error-input',
		selectCls: 'ui-selectbox'
	};
	var checkMethods = {
		isEmpty: function (val) {
			if ($.trim(val).length === 0) {
				return true;
			} else {
				return false;
			}
		},
		isNumeric: function (val) {
			if (checkMethods.isEmpty(val)) {
				return true;
			}
			if ($.isNumeric(val)) {
				return true;
			} else {
				return false;
			}
		},
		isMobile: function (val) {
			if (checkMethods.isEmpty(val)) {
				return true;
			}
			return !!val.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
		},
		isIdcard: function (val) {
			var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子   
			var ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值.10代表X   
			function IdCardValidate(idCard) {
				idCard = trim(idCard.replace(/ /g, "")); //去掉字符串头尾空格                     
				if (idCard.length == 15) {
					return isValidityBrithBy15IdCard(idCard); //进行15位身份证的验证    
				} else if (idCard.length == 18) {
					var a_idCard = idCard.split(""); // 得到身份证数组   
					if (isValidityBrithBy18IdCard(idCard) && isTrueValidateCodeBy18IdCard(a_idCard)) { //进行18位身份证的基本验证和第18位的验证
						return true;
					} else {
						return false;
					}
				} else {
					return false;
				}
			}
			/**
			 * @private
			 * 判断身份证号码为18位时最后的验证位是否正确  
			 */
			function isTrueValidateCodeBy18IdCard(a_idCard) {
				var sum = 0; // 声明加权求和变量   
				if (a_idCard[17].toLowerCase() == 'x') {
					a_idCard[17] = 10; // 将最后位为x的验证码替换为10方便后续操作   
				}
				for (var i = 0; i < 17; i++) {
					sum += Wi[i] * a_idCard[i]; // 加权求和   
				}
				valCodePosition = sum % 11; // 得到验证码所位置   
				if (a_idCard[17] == ValideCode[valCodePosition]) {
					return true;
				} else {
					return false;
				}
			}
			/** @private
			 * 验证18位数身份证号码中的生日是否是有效生日  
			 */
			function isValidityBrithBy18IdCard(idCard18) {
				var year = idCard18.substring(6, 10);
				var month = idCard18.substring(10, 12);
				var day = idCard18.substring(12, 14);
				var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
				// 这里用getFullYear()获取年份，避免千年虫问题   
				if (temp_date.getFullYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
					return false;
				} else {
					return true;
				}
			}
			/**
			 * @private
			 * 验证15位数身份证号码中的生日是否是有效生日  
			 */
			function isValidityBrithBy15IdCard(idCard15) {
				var year = idCard15.substring(6, 8);
				var month = idCard15.substring(8, 10);
				var day = idCard15.substring(10, 12);
				var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
				// 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法   
				if (temp_date.getYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
					return false;
				} else {
					return true;
				}
			}
			//去掉字符串头尾空格   
			function trim(str) {
				return str.replace(/(^\s*)|(\s*$)/g, "");
			}

			if (checkMethods.isEmpty(val)) {
				return true;
			}

			return IdCardValidate(val);
		},
		/*计算字符串长度 中文为2*/
		countCharacters: function (str) {
			var totalCount = 0;
			for (var i = 0; i < str.length; i++) {
				var c = str.charCodeAt(i);
				if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
					totalCount++;
				} else {
					totalCount += 2;
				}
			}
			return totalCount;
		},
		isUrl: function (val) {
			if (checkMethods.isEmpty(val)) {
				return true;
			}
			var regExp = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

			if (regExp.test(val)) {
				return true;
			} else {
				return false;
			}
		},
		isEmail: function (val) {
			if (checkMethods.isEmpty(val)) {
				return true;
			}
			var regExp = /^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/;

			if (regExp.test(val)) {
				return true;
			} else {
				return false;
			}
		},
		isIp: function (val) {
			if (checkMethods.isEmpty(val)) {
				return true;
			}
			var regExp = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

			if (regExp.test(val)) {
				return true;
			} else {
				return false;
			}
		},
		isChinese: function (val) {
			//非数字
			//非标点
			//非英文
			//每个字符都是中文
			var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
			for (var i = 0; i < val.length; i++) {
				if (!reg.test(val[i])) {
					return false;
				}
			}
			return true
		}
	};
	var methods = {
		/**
		 * 校验方法
		 * @return {Boolean} 校验通过返回true 失败返回false
		 */
		expose: function () {
			//暴露方法
			return checkMethods;
		},
		check: function () {

			$me = $(this);
			//校验DOM集合
			var $dom = $me.find('[data-check]');
			//校验规则
			var checkRules = new Array();

			//清空之前的提示
			removeTip($dom);

			$me.data({
				isPass: true
			});

			for (var i = 0, domLen = $dom.length; i < domLen; i++) {
				//包装DOM元素
				var $control = $($dom.get(i));

				//单个控件校验标志
				$control.data({
					isPass: true
				});

				//忽略data-ignore为true的元素
				if ($control.data('ignore') === true) {
					continue;
				}

				//获取校验规则数组
				checkRules = $.trim($control.data('check')).split('|');

				for (var j = 0, rulesLen = checkRules.length; j < rulesLen; j++) {
					//没有包含:的规则
					if (checkRules[j].toString().indexOf(':') === -1) {
						switch (checkRules[j]) {
							//非空判断
						case 'must':
							if (checkMethods.isEmpty($control.val())) {
								showTip(false, $control, '该项不能为空');
							} else {
								showTip(true, $control);
							}
							break;
							//仅为数字
						case 'n':
							if (!checkMethods.isNumeric($control.val())) {
								showTip(false, $control, '请输入数字');
							} else {
								showTip(true, $control);
							}
							break;
							//手机号
						case 'mobile':
							if (!checkMethods.isMobile($control.val())) {
								showTip(false, $control, '请输入正确的手机号码');
							} else {
								showTip(true, $control);
							}
							break;
							//身份证
						case 'idcard':
							if (!checkMethods.isIdcard($control.val())) {
								showTip(false, $control, '请输入正确的身份证号码');
							} else {
								showTip(true, $control);
							}
							break;
							//URL
						case 'url':
							if (!checkMethods.isUrl($control.val())) {
								showTip(false, $control, '请输入正确的URL地址');
							} else {
								showTip(true, $control);
							}
							break;
							//电邮
						case 'email':
							if (!checkMethods.isEmail($control.val())) {
								showTip(false, $control, '请输入正确的电子邮箱');
							} else {
								showTip(true, $control);
							}
							break;
							//ip
						case 'ip':
							if (!checkMethods.isIp($control.val())) {
								showTip(false, $control, '请输入正确的ip地址');
							} else {
								showTip(true, $control);
							}
							break;
							//电邮
						case 'chinese':
							if (!checkMethods.isChinese($control.val())) {
								showTip(false, $control, '请输入中文字符');
							} else {
								showTip(true, $control);
							}
							break;
						}
					} else {
						var limit = checkRules[j].split(':');

						//去除空格
						limit[1] = $.trim(limit[1]);

						switch (limit[0]) {
							//最大长度
						case 'max-len':
							if ($control.val().length > parseInt(limit[1])) {
								showTip(false, $control, '长度不能大于' + parseInt(limit[1]) + '个字符');
							} else {
								showTip(true, $control);
							}
							break;
							//字符最大长度 区分汉字和英文
						case 'max-char-len':
							if (checkMethods.countCharacters($control.val()) > parseInt(limit[1])) {
								showTip(false, $control, '汉字不能大于' + parseInt(limit[1] / 2) + '个, 英文不能大于' + parseInt(limit[1]) + '个');
							} else {
								showTip(true, $control);
							}
							break;
							//最小长度
						case 'min-len':
							if (checkMethods.isEmpty($control.val())) {
								showTip(true, $control);
							} else if ($control.val().length < parseInt(limit[1])) {
								showTip(false, $control, '长度不能小于' + parseInt(limit[1]) + '个字符');
							} else {
								showTip(true, $control);
							}
							break;
							//字符最小长度 区分汉字和英文
						case 'min-char-len':
							if (checkMethods.isEmpty($control.val())) {
								showTip(true, $control);
							} else if (checkMethods.countCharacters($control.val()) < parseInt(limit[1])) {
								showTip(false, $control, '汉字不能小于' + parseInt(limit[1] / 2) + '个, 英文不能小于' + parseInt(limit[1]) + '个');
							} else {
								showTip(true, $control);
							}
							break;
							//指定name的元素是否与校验元素值相同
						case 'fit':
							if ($($me).find('[name=' + limit[1] + ']').val() !== $control.val()) {
								showTip(false, $control, '两次输入的内容不一致');
							} else {
								showTip(true, $control);
							}
							break;
							//指定数字范围
						case 'scope':
							var scope = $.trim(limit[1]).split('-');
							var min = Math.min(scope[0], scope[1]);
							var max = Math.max(scope[0], scope[1]);

							if (parseInt($control.val()) < min || parseInt($control.val()) > max) {
								showTip(false, $control, '请输入范围在' + min + ' - ' + max + ' 的数字');
							} else {
								showTip(true, $control);
							}
							//自定义
						case 'custom':
							if (typeof window[limit[1]] === 'function') {
								var obj = window[limit[1]]($control);

								if (!obj.flag) {
									showTip(false, $control, obj.message);
								} else {
									showTip(true, $control);
								}
							}
							break;
						}
					}
				}

				//第一个控件获取焦点
				$dom.filter('.' + cls.errorCls + ':first').focus();
			};

			if ($me.data('isPass')) {
				return true;
			} else {
				return false;
			}
		},
		/**
		 * 为指定元素设置校验
		 * @param {Object} checkArray 校验对象
		 * 示例：
		 * 
		 *     $(this).check('setCheck', {
		 *         check: '*',
		 *         title: '账户名'
		 *     });
		 */
		setCheck: function (checkArray) {
			if ($(this).length) {
				$(this).attr({
					'data-check': checkArray.check
				});
			}
		},
		/**
		 * 移除校验
		 * 示例：
		 * 
		 *     $(this).check('removeCheck');
		 */
		removeCheck: function () {
			if (this) {
				$(this).removeAttr('data-check');
			}
		},
		/**
		 * 启用校验
		 * 示例：
		 * 
		 *     $(this).check('enabledCheck');
		 */
		enabledCheck: function () {
			if (this) {
				$(this).removeAttr('data-ignore');
			}
		},
		/**
		 * 禁用校验
		 * 示例：
		 * 
		 *     $(this).check('disabledCheck');
		 */
		disabledCheck: function () {
			if (this) {
				$(this).attr('data-ignore', 'true');
			}
		}
	};



	//修复IE6不支持indexOf函数
	if (!Array.indexOf) {
		Array.prototype.indexOf = function (obj) {
			for (var i = 0; i < this.length; i++) {
				if (this[i] == obj) {
					return i;
				}
			}
			return -1;
		}
	}
	//修复chrome自动填充无法获取值的问题
	if (navigator.userAgent.toLowerCase().indexOf("chrome") >= 0) {
		$(window).load(function () {
			$('input:-webkit-autofill').each(function () {
				var text = $(this).val();
				var name = $(this).attr('name');
				$(this).after(this.outerHTML).remove();
				$('input[name=' + name + ']').val(text);
			});
		});
	}

	/**
	 * @private
	 * 显示提示信息
	 * @param  {Dom} $control      校验元素
	 * @param  {String} tipString 提示字符串
	 */
	function showTip(flag, $control, tipString) {
		if (!flag) {
			//校验未通过
			var html = '<span class="check-tip alert alert-danger">' + tipString + '</span>\n';

			//下拉框特殊处理
			if ($control.is('select')) {
				$control.parent().find('.' + cls.selectCls).addClass(cls.errorCls);
				$control.addClass(cls.errorCls);
			}

			$me.data({
				isPass: false
			});
			$control.data({
				isPass: false
			});

			//显示提示
			$control.addClass(cls.errorCls);
			$control.parent().append(html);
		}

		if ($control.data('isPass') == true) {
			$control.parent().find('.' + cls.errorCls).removeClass(cls.errorCls).end()
				.find('.form-tip').show();
		} else if ($control.data('isPass') == false) {
			$control.parent().find('.form-tip').hide();
		}
	}

	/**
	 * @private
	 * 隐藏提示
	 * @param  {[type]} $control 控件
	 */
	function removeTip($control) {
		$control.nextAll('.check-tip').remove()
			.end().nextAll('.form-tip').hide();

	}

	$.fn.check = function (method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.check.apply(this, arguments);
		} else { //未找到参数指明的方法
			$.error('错误"' + method + '"方法未定义');
		}
	};
})(jQuery);