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
        <span>历史记录</span>
    </div>
    <div class="body-warp">
        <div class="panel table-tool-bar">
            <a class="btn" href="${contextPath}/task/tolist.do"><i class="iconfont">&#xe63a;</i>返回</a>
        </div>
        <table class="table" id="table"></table>
    </div>
<script>
    var grid = {};
    $(function() {
        grid = $('#table').grid({
            store: {
				url: '${contextPath}/tasklog/list.ajax?taskId=${taskId}'
            },
            tool: {
                pagingBar: true
            },
            columns: [
            {
                title: '操作时间',
                dataIndex: 'ctime'
            },{
                title: '操作ip',
                dataIndex: 'ip'
            },{
                title:'项目',
                dataIndex:'name'
            },{
            	title:'负责人',
            	dataIndex:'userName'
            },{
            	title:'状态',
            	dataIndex:'state'
            },{
            	title:'预计工时',
            	dataIndex:'timePreStr'
            }]
        });
    });
        
</script>
</body>
</html>