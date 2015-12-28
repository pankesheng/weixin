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
        <table class="table" id="table"></table>
    </div>
<script>
    var grid = {};
    $(function() {
        grid = $('#table').grid({
            store: {
				url: '${contextPath}/task/tjlist.ajax'
            },
            tool: {
                pagingBar: false
            },
         	event: {
            	onLoadCallback:function(json){
					initTrColor();
				}
            },
            columns: [
            {
                title: '项目',
                dataIndex: 'name'
            },{
                title: '负责人',
                dataIndex: 'user'
            },{
                title:'状态',
                dataIndex:'state'
            },{
            	title:'预计工时',
            	dataIndex:'timePreStr'
            },{
            	title:'实际累计工时',
            	dataIndex:'timeRealStr'
            }]
        });
    });
    function initTrColor(){
    	var data = grid.getDataStore();
    	for(var i =0;i<data.length;i++){
    		if(data[i].name){
    			<#--
    				$("#table tr:eq("+(i+1)+")").attr("class","hover"); 
    			-->
    		}
    	}
    }
</script>
</body>
</html>