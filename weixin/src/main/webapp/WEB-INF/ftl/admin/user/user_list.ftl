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
        <span>员工管理</span>
    </div>
    <div class="body-warp">
        <div class="panel table-tool-bar">
            <a class="btn" href="###" onclick="add()"><i class="add-btn iconfont">&#xe619;</i>新增</a>
            <a class="btn" href="###" onclick="removeItems()"><i class="remove-btn iconfont">&#xe608;</i>删除</a>
        </div>
        <table class="table" id="table"></table>
    </div>
<script>
    var grid = {};
    $(function() {
        grid = $('#table').grid({
            store: {
				url: '${contextPath}/user/list.ajax'
            },
            tool: {
                pagingBar: true
            },
            columns: [
            {
                title: '真实姓名',
                dataIndex: 'realname'
            },{
                title: '状态',
                dataIndex: 'state',
                renderer: function(cellData, rowData){
                    if(cellData){
						return '<span style="color:blue">在职</span>';
					}else{
						return '<span style="color:red">离职</span>';
					}
                }
            },{
                title: 'IP',
                dataIndex: 'ip'
            },{
                title: '操作',
                dataIndex: 'id',
                width: 300,
                renderer: function(cellData, rowData){
                	var result = '';
                	result += '<div style="width:300px;overflow:hidden;">';
                		result += '<a class="btn btn-primary" href="###" onclick="editItem(\''+cellData+'\');">编辑</a>\n';
                	result += '</div>';
                	return result;
                }
            }]
        });
    });
        
    //添加
	function add(){
		z_openIframe('新增', 700, 400, '${contextPath}/user/toadd.do');
	}
	
	//编辑
	function editItem(id){
		z_openIframe('编辑', 700, 400, '${contextPath}/user/tomodify/' + id + '.do');
	}

	//删除
	function removeItems(){
		var data = grid.getSelectedDataString('id');
		z_delete(data, '${contextPath}/user/delete.ajax');
	}
</script>
</body>
</html>