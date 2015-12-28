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
    <script type="text/javascript" src="${contextPath}/admin/ext/jquery/selectbox.js"></script>
    <script type="text/javascript" src="${contextPath}/admin/ext/zw/grid.js?v=${sversion}"></script>
    <script type="text/javascript" src="${contextPath}/admin/javascripts/tool.js?v=${sversion}"></script>
	<script type="text/javascript" src="${contextPath}/admin/javascripts/zcommon.js?v=${sversion}" basepath="${contextPath}" baseinit="ajaxCheckLogin"></script>
</head>
<body>
	<div class="place">
        <span class="label-span">位置：</span>
        <span>项目统计</span>
    </div>
    <div class="body-warp">
        <table class="table" id="table">
        	<thead><tr class="table-head hover"><th>项目</th><th>负责人</th><th>状态</th><th>预计工时</th><th>实际累计工时</th></tr></thead>
        	<tbody id="listview"></tbody>
        </table>
    </div>
<script>
    
	function _search(){
		var url = "${contextPath}/task/tjData.ajax";
		var post = {};
		post.user = $("#user").val();
		post.state = $("#state").val();
		$.post(url,post,function(data){
			var result=eval(data);;
			$("#listview").html("");
			$("#trTemp").tmpl(result).appendTo("#listview");
			$(result).each(function (key) {
				if(!result[key].pid && result[key].stateStr!="进行中"){
					$("[pid="+result[key].id+"]").hide();				
				}
		 	});
		 	$('.ui-droplist').dropList();
		},"json");
	}
	
	function _refresh(){
		_search();
	}
	_search();
	
	function _zk(id){
		$("[pid="+id+"]").show();
		$("#zk"+id).attr("style","display:none;font-weight:bold;");
		$("#ss"+id).attr("style","font-weight:bold;");
	}
	function _ss(id){
		$("[pid="+id+"]").hide();
		$("#zk"+id).attr("style","font-weight:bold;");
		$("#ss"+id).attr("style","display:none;font-weight:bold;");
	}
</script>
<script id="trTemp" type="text/x-jquery-tmpl">
	{{if pid}}
		<tr pid="{{= pid}}">
	{{else}}
		<tr class="hover">
	{{/if}}
		<td style="text-align: left;white-space: nowrap;">
			{{if pid}}
			{{else}}
				<span id="zk{{= id}}" {{if stateStr=="进行中"}}style="display:none;font-weight:bold;"{{else}}style="font-weight:bold;"{{/if}} ><a href="javascript:void(0);" onclick="_zk({{= id}})">[+]&nbsp;&nbsp;{{= name}}</a></span>
				<span id="ss{{= id}}" {{if stateStr!="进行中"}}style="display:none;font-weight:bold;"{{else}}style="font-weight:bold;"{{/if}}><a href="javascript:void(0);" onclick="_ss({{= id}})">[-]&nbsp;&nbsp;{{= name}}</a></span>
			{{/if}}
		</td>
		<td style="white-space: nowrap;">
			<span {{if pid}}{{else}}style="font-weight:bold;"{{/if}}>
				{{= user}}
			</span>
		</td>
		<td style="white-space: nowrap;">
			<span {{if pid}}{{else}}style="font-weight:bold;"{{/if}}>	
				{{= stateStr}}
			</span>
		</td>
		<td style="white-space: nowrap;">
			<span {{if pid}}{{else}}style="font-weight:bold;"{{/if}}>
				{{= timePreStr}}
			</span>
		</td>
		<td style="white-space: nowrap;">
			<span {{if pid}}{{else}}style="font-weight:bold;"{{/if}}>
				{{= timeRealStr}}
			</span>
		</td>
	</tr>
</script>
</body>
</html>