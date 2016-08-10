<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<link rel="stylesheet" href="${contextPath}/admin/stylesheets/common.css?v=${sversion}" />
    <link rel="stylesheet" href="${contextPath}/admin/stylesheets/table.css?v=${sversion}" />
	<script type="text/javascript" src="${contextPath}/ext/jquery/jquery-1.8.1.min.js"></script>
    <script type="text/javascript" src="${contextPath}/ext/layer/layer.min.js"></script>
    <script type="text/javascript" src="${contextPath}/ext/laydate/laydate.js"></script>
    <script type="text/javascript" src="${contextPath}/admin/ext/jquery/selectbox.js"></script>
    <script type="text/javascript" src="${contextPath}/admin/ext/zw/grid.js?v=${sversion}"></script>
    <script type="text/javascript" src="${contextPath}/admin/javascripts/tool.js?v=${sversion}"></script>
	<script type="text/javascript" src="${contextPath}/admin/javascripts/zcommon.js?v=${sversion}" basepath="${contextPath}" baseinit="ajaxCheckLogin"></script>
</head>
<body>
    <div class="body-warp">
        <table class="table" id="table"></table>
    </div>
<script>
    var grid = {};
    $(function() {
        grid = $('#table').grid({
            store: {
				url: '${contextPath}/menubutton/materiallist.ajax?type=${type}'
            },
            tool: {
                pagingBar: true
            },
            columns: [
            {
            	title:'media_id',
            	dataIndex:'media_id'
            },{
                title: '名称',
                dataIndex:'name'
            },{
            	title:'更新时间',
            	dataIndex:'updateDate'
            },{
            	title:'操作',
            	renderer:function(cd,rd,g,ci,ri){
            		return '<div style="overflow:hidden;"><a style="btn btn-primary" href="###" onclick="choose('+ri+');">选择</a></div>';
            	}
            }]
        });
    });
    function choose(rowIndex){
    	var rowData = grid.getRowDataByIndex(rowIndex).data;
    	var obj = {};
    	obj.media_id = rowData.media_id;
    	obj.media_name = rowData.name;
    	obj.updateDate = rowData.updateDate;
    	parent._choose(obj);
    }
    
</script>
</body>
</html>