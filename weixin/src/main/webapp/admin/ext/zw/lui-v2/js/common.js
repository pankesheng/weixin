/**
 * @name 实用工具函数库
 * @version 1.0.0.0
 * @author lisfan QQ@448182355 GIT@lisfan 
 * @createDate 21/01/2016
 * @requires jquery-1.11.3
 * @markdown
 * 
 * ## 更新
 * - 2016.1.16
 * 		- 增加_filterArguments()
 * 		- 增加_getFuncName()
 * 		- 修正_dataToArray()
 * - 2016.1.28
 * 		- 强化_filterArguments()
 * 		- 小重构部分工具函数
 * 		- 增加_arraySort()
 * 		- 完善注释
 * ## TODO
 * - dataToJSON封装
 */

"use strict";

/**
 * 开启调试模式（可以在保留打印信息的情况下保留语句，logDebug设置为关闭），控制台打印，目前只支持简单的打印
 * @param {String} msg   打印信息，样式通过%c控制
 * @param {String} style 打印信息的样式
 * @example 
 */
var logDebug = true;

function log(msg, style) {
	//logdebug开启，并且浏览器支持console输出时
	if (logDebug && console) {
		if ($.type(msg) == "string" && msg.indexOf("%c") >= 0) {
			console.log(msg, style)
		} else {
			console.log(msg)
		}
	}
}

/**
 * 过滤参数，筛选出符合要求的参数数组
 * @param {!undefined} argumentsList    接受非undefined的任意原始数据类型参数，非数组参数，会先转成数组表
 * @param {Array||String} typeList 仅接受字符串和数组，数组中的元素也必须是字符串格式
 * @param {Number} requireLength 必须要有的参数数量
 * @returns {Boolean||Array}  若过滤成功，则返回过滤后的参数数组，若失败则返回false
 * @example 
 */
function _filterArguments(argumentsList, typeList, requireLength) {
	if ($.type(argumentsList) === "undefined") {
		var errorText = "%ccommon._filterArguments(argumentsList, typeList, requireLength)";
		log(errorText, "color:#f00");
		errorText = "%cargumentsList参数需要接受一个非undefined的值";
		log(errorText, "color:#f00");
		return false;
	}

	//验证，必须要有前2个参数
	//第一个参数接受任意类型的数据，非数组格式参数，将先转成数组表
	var argumentsListArray = [];
	//argumentsList不是函数的arguments变量或者不是自已传入的数组时
	if ($.type(argumentsList) != "object" && $.type(argumentsList) != "array") {
		//单个参数值的验证
		argumentsListArray[0] = argumentsList;
	} else if ($.type(argumentsList) == "object") {
		//调用函数的arguments对象
		argumentsListArray = $.makeArray(argumentsList);
	} else {
		argumentsListArray = argumentsList;
	}

	//第二个参数接受数组（数组元素需要也是字符串）和字符串，字符串格式参数，将先转成数组表
	var typeListArray = [];
	if ($.type(typeList) === "string") {
		typeListArray[0] = typeList;
	} else if ($.type(typeList) === "array") {
		typeListArray = typeList;
	}
	//若未指定必须参数数量时，默认为0个
	requireLength = requireLength || 0;

	//参数错误标识
	var errorFlag = false;
	var errorText = "%c缺少所需参数，请检查：参数需要" + requireLength + "个以上";

	//typeList可接受的数据类型完整列表
	var allType = ["null", "string", "number", "boolean", "array", "plainobject", "function", "regexp", "date", "error"];

	//过滤后返回的新参数数组和长度
	var _filterArguments = [];
	for (var i = 0; i < typeListArray.length; i++) {
		//初始化为undefined
		_filterArguments[i] = undefined;
	}

	//备份一份类型列表
	var typeListArrayBackup = $.merge([], typeListArray);

	//先将类型列表，转换成二维数组
	var tempTypeList = [];
	for (var i = 0; i < typeListArray.length; i++) {
		var listArray = [];
		if (typeListArray[i] === "all") {
			listArray = allType;
		} else if ($.type(typeListArray[i]) === "string") {
			listArray[0] = typeListArray[i];
		} else if ($.type(typeListArray[i]) === "array") {
			listArray = typeListArray[i];
		}

		tempTypeList.push(listArray)
	}

	typeListArray = tempTypeList;

	//更换思路：
	//旧思路：拿实际参数去匹配类型列表，匹配则优先给其使用
	//新思路：拿类型列表去匹配实际参数类型，匹配则优先给其使用
	for (var i = 0; i < argumentsListArray.length; i++) {
		//取得当前实参的类型，主要针对object做一些特殊处理，
		//如果是原生对象，则改为plainobject，如果是jq节点对象，则改为jqobject，如果是我自已写的插件，则取得插件类型的名称
		//如果非object类型，则返回原始数据类型
		var argType;
		if ($.type(argumentsListArray[i]) == "object") {
			if ($.isPlainObject(argumentsListArray[i])) {
				//原生JS对象
				argType = "plainobject";
			} else if (argumentsListArray[i].length >= 0) {
				//jq对象
				argType = "jqobject";
			} else if (argumentsListArray[i]._type) {
				//扩展插件
				argType = argumentsListArray[i]._type;
			}
		} else {
			argType = $.type(argumentsListArray[i]);
		}

		//遍历类型列表
		for (var j = 0; j < typeListArray.length; j++) {
			//typeListArray[j]为null的不再检测
			if (typeListArray[j] && $.inArray(argType, typeListArray[j]) >= 0) {
				//当前参数在类型表中能得到匹配
				//则将当前当前参数放入过滤参数变量暂存，将得到匹配的类型列表索引位置为null，避免重复查询
				_filterArguments[j] = argumentsListArray[i];
				typeListArray[j] = undefined;
				//argumentsListArray[i] = null;
				break;
			}
		}
	}

	//检查是否达到必需参数数量
	for (var i = 0; i < requireLength; i++) {
		if (_filterArguments[i] == undefined) {
			//参数为未定义时
			//发生错误
			errorFlag = true;
			if (requireLength < typeListArrayBackup.length) {
				errorText += "，第" + (i + 1) + "个参数数据类型需为" + typeListArrayBackup[i].toString();
			} else {
				errorText += "，第" + (i + 1) + "个参数数据类型未定义";
			}
		} else {
			errorText += "，第" + (i + 1) + "个参数数据类型正确";
		}
	}

	//假如有错误，返回false
	if (errorFlag) {
		log(errorText, "color:#f00");
		return false;
	} else {
		//返回筛选后的参数列表
		return _filterArguments;
	}
}


/**
 * 获取函数的名称(不支持获取匿名函数)
 * @param {Function} callee  函数语句
 * @returns {String}   返回函数名字符串
 */

function _getFuncName(callee) {
	var filterArgs = _filterArguments(arguments, ["function"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%ccommon._getFuncName(callback)";
		log(errorText, "color:#f00");
		return false;
	}

	callee = filterArgs[0];

	var funcScope = callee.toString();
	return funcScope.match(/^function\s(.*)\(/)[1];

}
/**
 * 验证数据源
 * 1.验证后的数据源，返回的数据源永远是数组形式的
 * 2.会过淲掉空的数据
 * @param   {PlainObject||Array} data     数据源可以是直接健/值对的原生对象格式，也可以是多项健/值对的数组对象
 * @returns {Array}   返回符合要求的数据源，没有数据时返回空数组
 */

function _validateData(data) {
	//过滤参数且重排理想参数顺序
	var filterArgs = _filterArguments(arguments, [["plainobject", "array"]]);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%ccommon._validateData(data)";
		log(errorText, "color:#f00");
		return false;
	}

	data = filterArgs[0];

	//验证数据类型，返回的数据永远是数组形式，且每一项是名/值对的格式
	var validateData = [];
	var dataArray = [];

	if ($.type(data) == "object") {
		dataArray[0] = data;
	} else if ($.type(data) == "array") {
		dataArray = data;
	}

	for (var i = 0; i < dataArray.length; i++) {
		if ($.type(dataArray[i]) == "object" && $.isPlainObject(dataArray[i]) && !$.isEmptyObject(dataArray[i])) {
			validateData.push(dataArray[i]);
		}
	}

	//始终返回数组格式
	return validateData;
}

/**
 * 过滤数据源
 * 注意：过滤后的数据源是对原数据的直接过滤删除，因此要注意考虑原数据是否还有用处，有用则先复制一份再过滤
 * 1.无参数情况下，返回所有数据
 * 2.可以传入键名，过滤指定的键值数据
 * @param   {PlainObject||Array} data     数据源可以是直接健/值对的原生对象格式，也可以是多项健/值对的数组对象
 * @param   {String||Array} key        指定要过滤的键名字符串，或键名数组
 * @param   {Boolean} filterMode 过滤模式：简单模式false(默认)：仅部分包括即可返回数据源;严格过滤模式true：必须包括全部的键名才被过滤
 * @returns {PlainObject||Array}  返回符合要求的数据源
 */
function _filterData(data, key, filterMode) {
	//过滤参数且重排理想参数顺序
	var filterArgs = _filterArguments(arguments, [["plainobject", "array"], ["string", "array"], "boolean"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%ccommon._filterData(data, key, filterMode)";
		log(errorText, "color:#f00");
		return false;
	}

	data = filterArgs[0];
	key = filterArgs[1];
	filterMode = filterArgs[2] === undefined ? filterArgs[2] : false;

	var validateData = _validateData(data);

	var filterDataArray = [];

	if (!key) {
		//key如果不存在，直接返回筛选后的数据源
		filterDataArray = validateData;
	} else {
		var keyArray = [];
		if (key && $.type(key) == "string") {
			keyArray[0] = key;
		} else if (key && $.type(key) == "array") {
			keyArray = key;
		}

		for (var i = 0; i < validateData.length; i++) {
			//删除非指定关键字的数据
			for (var keyName in validateData[i]) {
				if ($.inArray(keyName, keyArray) < 0) {
					delete validateData[i][keyName]
				}
			}

			//现在 validateData[i] 只保留了被筛选过后的值
			//验证它们的元素数量是否相等，相等则返回
			if (filterMode == true) {
				//严格筛选模式
				//检测filterData中项的数量
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

	//只有一条数据时直接返回第一条数据，多条数据时返回数组对象
	if ($.type(data) != "array") {
		filterDataArray = filterDataArray[0];
	}

	//返回筛选后符合要求的的数据源
	return filterDataArray;
}



/**
 * 克隆数据源
 * 注意：克隆后的数据源是对原数据源的拷贝，任何在克隆数据源上的操作都不会反映在原数据源上
 * data不进行validateData，_cloneData需要保持数据的完整性结构
 * 根据data的数据类型，返回的数据也保持同样的数据类型，如果是对象，则返回对象格式，如果是数组则返回数组格式
 * @param   {PlainObject||Array} data     数据源可以是直接健/值对的原生对象格式，也可以是多项健/值对的数组对象
 * @returns {PlainObject||Array}  返回克隆的数据源
 */
function _cloneData(data) {
	var filterArgs = _filterArguments(arguments, [["plainobject", "array"]], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%ccommon._cloneData(data)";
		log(errorText, "color:#f00");
		return false;
	}

	data = filterArgs[0];

	var dataArray = [];
	//根据data的数据类型，返回的数据也保持同样的数据类型，如果是对象，则返回对象格式，如果是数组则返回数组格式
	//转为数组
	if ($.type(data) == "array") {
		dataArray = data;
	} else {
		dataArray[0] = data;
	}

	var cloneDataArray = [];

	//不使用map复制，那样复制的只是对象引用
	for (var i = 0; i < dataArray.length; i++) {
		/*		var cloneData = {};
				//原数据克隆
				for (var keyName in dataArray[i]) {
					cloneData[keyName] = dataArray[i][keyName];
				}*/
		var cloneData = $.extend(true, {}, dataArray[i]);
		cloneDataArray.push(cloneData);

	}

	//只有一条数据时直接返回第一条数据，多条数据时返回数组对象
	if ($.type(data) != "array") {
		cloneDataArray = cloneDataArray[0];
	}

	//返回克隆的数据源
	return cloneDataArray;
}

/**
 * 数据格式转换为字符串格式，若数据源为数组数据，则返回的字符串数组
 * @param   {PlainObject|Array} data     数据源可以是直接健/值对的原生对象格式，也可以是多项健/值对的数组对象
 * @returns {Array|String}   返回字符串或者字符串数组
 */
function _dataToString(data) {
	var filterArgs = _filterArguments(arguments, [["plainobject", "array"]], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%ccommon._dataToString(data)";
		log(errorText, "color:#f00");
		return false;
	}

	data = filterArgs[0];

	var validateData = _validateData(data);

	var toStringArray = [];

	for (var i = 0; i < validateData.length; i++) {
		var toString = "";
		for (var key in validateData[i]) {
			toString += key + ":" + validateData[i][key] + ",";
		}
		toStringArray.push(toString.slice(0, -1));
	}

	//只有一条数据时直接返回第一条数据，多条数据时返回数组对象
	if ($.type(data) != "array") {
		toStringArray = toStringArray[0];
	}

	//返回格式化后的数组字符串
	return toStringArray;
}


/**
 * TODO,JSON封装
 * 数据格式封装成JSON字符串格式
 * @param   {PlainObject||Array} data     数据源可以是直接健/值对的原生对象格式，也可以是多项健/值对的数组对象
 * @param   {String} namekey   保存JSON数据的键名，默认data名称

 * @returns {String}   返回字符串或者字符串数组
 */

function _dataToJSON(data, namekey) {

	//TODO 递归 
	var filterArgs = _filterArguments(arguments, [["plainobject", "array"], "string"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%ccommon._dataToJSON(data, namekey)";
		log(errorText, "color:#f00");
		return false;
	}

	data = filterArgs[0];
	namekey = filterArgs[1] === undefined ? filterArgs[1] : "data";

	var validateData = _validateData(data);

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

	var dataToJSON = '{"' + namekey + '":[' + dataStringArray.join(",") + ']}';

	//返回格式化后的JSON字符串
	return dataToJSON;
}

/**
 * 数据格式转换成数组格式，比较适用于将对象或者数组对象，去除key键名，转成只有value的数组
 * @param   {PlainObject||Array} data     数据源可以是直接健/值对的原生对象格式，也可以是多项健/值对的数组对象
 * @returns {String}   返回字符串或者字符串数组
 */

function _dataToArray(data) {
	var filterArgs = _filterArguments(arguments, [["plainobject", "array"]]);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%ccommon._dataToArray(data)";
		log(errorText, "color:#f00");
		return false;
	}

	data = filterArgs[0];

	var validateData = _validateData(data);
	var dataToArray = [];

	for (var i = 0; i < validateData.length; i++) {
		var dataArray = [];
		for (var key in validateData[i]) {
			dataArray.push(validateData[i][key]);
		}
		//如果数据项只有一条的则直接输出值
		if (dataArray.length == 1) {
			dataArray = dataArray[0]
		}
		dataToArray.push(dataArray);
	}

	//只有一条数据时直接返回第一条数据，多条数据时返回数组对象
	if ($.type(data) != "array") {
		dataToArray = dataToArray[0];
	}
	return dataToArray;
}

/**
 * 对数据源进行转换，返回期望格式
 * 1.[{id:"19890129","name":"msl"},{id:"19890130","name":"llm"}] 不作更改
 * 2.[{name:"msl"},{name:"llm"},{name:"mcy"}] 返回数组格式:["msl","llm","mcy"]
 * 3.[{id:"19890129","name":"msl"}] 返回直接对象格式：{id:"19890129","name":"msl"}
 * 4.[{name:"msl"}] 返回字符串格式:msl
 * @param   {PlainObject||Array} data     数据源可以是直接健/值对的原生对象格式，也可以是多项健/值对的数组对象
 * @returns {PlainObject||Array||String}   返回格式化数据源后期望的格式，可能是原生对象，可能是数组对象，也可能是字符串
 */
function _dataFormater(data) {
	var filterArgs = _filterArguments(arguments, [["plainobject", "array"]], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%ccommon._dataFormater(data)";
		log(errorText, "color:#f00");
		return false;
	}

	data = filterArgs[0];

	var validateData = _validateData(data);
	var dataFormat;

	//数据源只有一个
	if (validateData.length == 1) {
		//数据项的数量
		var count = 0;

		for (var key in validateData[0]) {
			count++
		}

		//数据项大于1个，返回字符串格式
		if (count > 1) {
			dataFormat = validateData[0]
		} else {
			//数据项只有1个时，直接返回字符串格式
			dataFormat = _dataToString(validateData[0]);
			dataFormat = dataFormat.slice(dataFormat.indexOf(":") + 1);
		}
	} else {
		//数据源多个
		//数据项的数量
		var count = 0;
		for (var key in validateData[0]) {
			count++
		}
		if (count > 1) {
			dataFormat = validateData
		} else {
			//每个数据源只有一个数据项时，返回数组
			dataFormat = _dataToArray(validateData);
		}
	}

	//返回格式化数据源后的期望格式
	return dataFormat;
}


/**
 * 合并函数语句，返回一个新函数语句
 * 支持无限级函数合并，合并顺序从左至右，执行顺序也将从左至右，谁前谁先执行
 * 当参数只有1个且为数组函数列表时，忽略第二个参数？
 * @param   {Function||Array} func1     函数或者函数列表
 * @param   {Function} func2     函数
 * @returns {Function}   返回字符串或者字符串数组
 */
function _mergeFunc(func1, func2) {
	var filterArgs = _filterArguments(arguments, [["function", "array"], "function"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%ccommon._mergeFunc(func1, func2)";
		log(errorText, "color:#f00");
		return false;
	}

	func1 = filterArgs[0];
	func2 = filterArgs[1];

	//合并后的新函数
	var newFunc;

	//将第一个参数转成数组
	var funcArray = [];
	if ($.type(func1) == "function") {
		funcArray[0] = func1
	} else {
		funcArray = func1;
	}

	//先过滤一次数组，保留数组元素也是函数的
	var filterFunc = $.grep(funcArray, function (value, index) {
		return $.type(value) == "function";
	})

	//先合并func1中的函数
	var newFunc1 = function () {
		for (var i = 0; i < filterFunc.length; i++) {
			filterFunc[i].apply(this, arguments);
		}
	}

	//若存在参数2，
	if (func2) {
		//参数1和参数2都是函数时
		//合并2个函数
		newFunc = function () {
			newFunc1.apply(this, arguments);
			func2.apply(this, arguments);
		}
	} else {
		newFunc = newFunc1;
	}

	return newFunc;
}


/**
 * 获取链接的参数的键值对象
 * @param   {String} url     链接字符串，默认采用当前页面链接，自定义时，需要保证是一个合法的链接格式，如http://www.baidu.com/index.html?name=msl&age=&born=19890129
 * @returns {Object}   返回键值对象
 */
function _getUrlParams(url) {
	var filterArgs = _filterArguments(arguments, ["string"]);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%ccommon.getUrlParams(url)";
		log(errorText, "color:#f00");
		return false;
	}

	url = filterArgs[0] === undefined ? filterArgs[0] : window.location.href;;

	var seriesParams = {};
	if (url.indexOf("?") > -1) {
		//截取?号后面的字符串
		url = url.substring(url.indexOf("?") + 1, url.length);
		var paramsArray = url.split("&");
		for (var i = 0; i < paramsArray.length; i++) {
			var param = paramsArray[i];
			var sparam = param.split("=");
			//假如是转义过的字符串，则解码
			if (sparam.length > 0) {
				//参数存在值，如果没有值则设置为null
				if (sparam[1]) {
					if (sparam[0].indexOf('%') == 0) {
						seriesParams[sparam[0]] = decodeURIComponent(sparam[1]);
					} else {
						seriesParams[sparam[0]] = sparam[1];
					}
				} else {
					seriesParams[sparam[0]] = null;
				}
			}
		}
	}
	return seriesParams;
}

/**
 * 返回数组中，最大的数字
 * @param   {Array} arr    接受一个数组，只比较number格式的数组元素和sting格式可以转为数字的字符串
 * @returns {Number}   返回最大的数字
 */
function _arrayMax(arr) {
	var filterArgs = _filterArguments(arguments, ["array"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%ccommon._arrayMax(arr)";
		log(errorText, "color:#f00");
		return false;
	}

	arr = filterArgs[0];

	//过滤数组
	arr = $.grep(arr, function (value) {
		return $.type(value) == "number" || $.isNumeric(parseInt(value));
	})

	//过滤后如果长度为零，说明数组不合法，请使用数字
	if (arr.length <= 0) {
		var errorText = "%ccommon._arrayMax(arr)";
		log(errorText, "color:#f00");
		var errorText = "%c数组数据元素不合法，未包含数字";
		log(errorText, "color:#f00");
		return false;
	}

	var maxNum = parseInt(arr[0]);
	for (var i = 0; i < arr.length; i++) {
		//非数字不参于判断
		maxNum = parseInt(arr[i]) > maxNum ? parseInt(arr[i]) : maxNum;
	}
	return maxNum;
}

/**
 * 返回数组中，最小的数字
 * @param   {Array} arr    接受一个数组，只比较number格式的数组元素和sting格式可以转为数字的字符串
 * @returns {Number}   返回最小的数字
 */
function _arrayMin(arr) {
	var filterArgs = _filterArguments(arguments, ["array"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%ccommon._arrayMin(arr)";
		log(errorText, "color:#f00");
		return false;
	}

	arr = filterArgs[0];

	//过滤数组
	arr = $.grep(arr, function (value) {
		return $.type(value) == "number" || $.isNumeric(parseInt(value));
	})

	//过滤后如果长度为零，说明数组不合法，请使用数字
	if (arr.length <= 0) {
		var errorText = "%c数组数据元素不合法，未包含数字";
		log(errorText, "color:#f00");
	}

	var maxNum = parseInt(arr[0]);
	for (var i = 0; i < arr.length; i++) {
		//非数字不参于判断
		maxNum = parseInt(arr[i]) > maxNum ? parseInt(arr[i]) : maxNum;
	}
	return maxNum;
}

/**
 * 排序数组，返回排序后的新数组，不对原数组作变动
 * @param   {Array} arr    接受一个数组，接受数据类型暂不限制
 * @returns {Object}   返回键值对象
 */
function _arraySort(arr) {
	var filterArgs = _filterArguments(arguments, ["array"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%ccommon._arraySort(arr)";
		log(errorText, "color:#f00");
		return false;
	}

	arr = filterArgs[0];

	//排序后的数组
	var sortArr = [];
	var cloneArr;

	//检测原数组中是否包含数字
	var hasNumeric = false;
	$.each(arr, function (index, value) {
		if ($.type(value) == "number") {
			hasNumeric = true;
			return false;
		}
	})

	if (hasNumeric) {
		//将数组中的数字转换为带0的字符串格式
		//得到数组中最大的数字值的长度
		var maxNum = _arrayMax(arr);

		//存在数字元素
		var maxLength = maxNum.toString().length;
		//先将数组中的将数组中的数字前面补0，并产生新的数组
		cloneArr = $.map(arr, function (value, index) {
			return _numAddZero(value, maxLength)
		});
	} else {
		cloneArr = $.merge([], arr);
	}

	//复制一份
	var sortCloneArr = $.merge([], cloneArr).sort();

	//通过复制的这两个数组，得到排序序位，判断他们之间是否有数值相等
	for (var j = 0; j < sortCloneArr.length; j++) {
		var index = $.inArray(sortCloneArr[j], cloneArr);
		cloneArr[index] = null;
		//暂存
		sortArr.push(arr[index])
	}

	return sortArr;
}

/**
 * 将数字转换成指定长度的字符串，长度不够时，数字和字符串数字前面补上“0”字符补位，其他类型不作处理，直接返回，如num为10,长度为5时，返回的字符串是00010
 * @param   {number||String} value   只接受number格式的数组元素和sting格式可以转为数字的字符串
 * @param   {number} length   转换为指定的长度
 * @returns {String}   返回转换后的字符串格式的“数字”
 */

function _numAddZero(value, length) {

	var filterArgs = _filterArguments(arguments, ["all", "number"], 1);

	//输出错误信息，快速定位错误
	if (filterArgs === false) {
		var errorText = "%ccommon._numAddZero(value, length)";
		log(errorText, "color:#f00");
		return false;
	}

	value = filterArgs[0];

	if ($.type(value) == "number" || $.isNumeric(parseInt(value))) {
		//取得当前数字的长度
		value = parseInt(value);
		var valueLength = value.toString().length;

		if (valueLength < length) {
			var needLength = length - valueLength;
			for (var i = 0; i < needLength; i++) {
				value = "0" + value;
			}
		} else {
			value = "" + value;
		}
	}

	return value;
}


//跨浏览器兼容处理工具函数
//简易选择器
function $S(selector) {
	if ("#" === selector.charAt(0)) {
		return document.getElementById(selector.slice(1));
	} else if ("." === selector.charAt(0)) {
		return document.getElementsByClassName(selector.slice(1));
	} else {
		return document.getElementsByTagName(selector);
	}
}

//阻止冒泡
function stopPropagation(event) {
	var e = event || window.event;
	e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
}

//取消默认行为
function preventDefault(event) {
	var e = event || window.event;
	e.preventDefault ? e.preventDefault() : e.returnValue = false;
}

//实例化XHR对象
function getXHR() {
	return XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
}

//侦听事件
//绑定事件
function addEventListener(selector, type, listener, useCapture) {
	selector.addEventListener ? selector.addEventListener(type, listener, useCapture) : "" /*selector.attachEvent(type, listener)*/ ;
}

//移除事件
function removeEventListener(selector, type, listener, useCapture) {
	selector.removeEventListener ? selector.removeEventListener(type, listener, useCapture) : "" /*selector.detachEvent(type, listener)*/ ;
}