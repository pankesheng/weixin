<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="renderer" content="webkit">
	<meta http-equiv="X-UA-Compatible" content="IE=Edge">
	<link rel="stylesheet" href="${contextPath}/admin/stylesheets/common.css?v=${sversion}" />
    <link rel="stylesheet" href="${contextPath}/admin/stylesheets/table.css?v=${sversion}" />
	<script type="text/javascript" src="${contextPath}/ext/jquery/jquery-1.8.1.min.js"></script>
    <script type="text/javascript" src="${contextPath}/ext/layer/layer.min.js"></script>
    <script type="text/javascript" src="${contextPath}/ext/jquery_tmpl/jquery.tmpl.js"></script>
	<script type="text/javascript" src="${contextPath}/ext/laydate/laydate.js"></script>
    <script type="text/javascript" src="${contextPath}/admin/ext/jquery/selectbox.js"></script>
    <script type="text/javascript" src="${contextPath}/admin/ext/zw/grid.js?v=${sversion}"></script>
    <script type="text/javascript" src="${contextPath}/admin/javascripts/tool.js?v=${sversion}"></script>
	<script type="text/javascript" src="${contextPath}/admin/javascripts/zcommon.js?v=${sversion}" basepath="${contextPath}" baseinit="ajaxCheckLogin"></script>
</head>
<body>
	<div class="place">
        <span class="label-span">位置：</span>
        <span>工作统计</span>
    </div>
    <div class="body-warp">
    	<div class="panel filter-block">
            <form class="form-inline">
                <div class="form-group">
                    <label for="userId">员工</label>
                    <select class="form-select" style="width:150px;" id="userId">
                    	<option value="">--所有员工--</option>
                    	<#list userList as user>
                    		<option value="${user.id}">${user.realname}</option>
                    	</#list>
                    </select>
                    <label>请选择时间段</label>
                    <input class="form-control" style="width:100px;" type="text" id="beginTime" value="${((beginTime)?string("yyyy-MM-dd"))!}" />~
                    <input class="form-control" style="width:100px;" type="text" id="endTime" value="${((endTime)?string("yyyy-MM-dd"))!}" />
                </div>
                <div class="form-group">
                	<a href="javascript:void(0);" class="btn" id="search-btn"><i class="iconfont">&#xe61b;</i>查询</a>
                </div>
            </form>
        </div>
        <div class="body-warp">
	        <table class="table" id="table">
	        	<thead><tr class="table-head hover"><th>时间</th><th>员工</th><th>项目</th><th>任务</th></tr></thead>
	        	<tbody id="listview"></tbody>
	        </table>
	    </div>
    </div>
<script>
    $(function() {
    	laydate({
		    elem: '#beginTime', //目标元素。
		    event: 'focus', //响应事件。
		    format: 'YYYY-MM-DD',
		    festival: false
		});
		laydate({
		    elem: '#endTime', //目标元素。
		    event: 'focus', //响应事件。
		    format: 'YYYY-MM-DD',
		    festival: false
		});
    });
 	function _search(){
 		var post = {};
 		post.userId = $("#userId").val();
 		post.beginTime = $("#beginTime").val();
 		post.endTime = $("#endTime").val();
 		var url = "${contextPath}/work/tjData.ajax";
 		$.post(url,post,function(data){
 			var result=eval(data);
			$("#listview").html("");
			$("#trTemp").tmpl(result).appendTo("#listview");
 		},"json");
    }
    _search();
    $("#search-btn").bind('click',function(){
    	_search();
    }) 
    $("#userId").bind('change',function(){
    	_search();
    })
</script>
<script id="trTemp" type="text/x-jquery-tmpl">
	<tr class="hover">
		{{if dataCount}}
			<td rowspan="{{= dataCount}}" style="text-align: center;">
				{{= timeStr}}
			</td>
		{{/if}}
		<td style="white-space: nowrap;">
			{{= user}}
		</td>
		<td style="white-space: nowrap;">
			{{= project}}
		</td>
		<td style="white-space: nowrap;">
			{{= task}}
		</td>
	</tr>
</script>
</body>
</html>