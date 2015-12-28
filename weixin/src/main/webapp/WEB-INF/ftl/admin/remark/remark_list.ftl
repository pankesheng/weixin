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
    <script type="text/javascript" src="${contextPath}/admin/ext/jquery/json2.js"></script>
    <script type="text/javascript" src="${contextPath}/admin/ext/zw/grid.js?v=${sversion}"></script>
    <script type="text/javascript" src="${contextPath}/admin/javascripts/tool.js?v=${sversion}"></script>
	<script type="text/javascript" src="${contextPath}/admin/javascripts/zcommon.js?v=${sversion}" basepath="${contextPath}" baseinit="ajaxCheckLogin"></script>
</head>
<body>
	<div class="place">
        <span class="label-span">位置：</span>
        <span>任务管理>>所有备注</span>
    </div>
    <div class="body-warp">
        <div class="panel table-tool-bar">
			<a class="btn" href="javascript:void(0);" onclick="_back();"><i class="iconfont">&#xe63a;</i>返回</a>
            <a class="btn" href="###" onclick="add()"><i class="add-btn iconfont">&#xe619;</i>添加备注</a>
        	<input class="form-control" id="searchKey" type="text" value="" />
        	<a href="javascript:void(0);" onclick="_search();" class="btn btn-filter"><i class="iconfont">&#xe61b;</i>查询</a>
        </div>
        <table class="table" id="table"></table>
    </div>
<script>
    var grid = {};
    $(function() {
        grid = $('#table').grid({
            store: {
				url: '${contextPath}/remark/list.ajax?workId=${workId}'
            },
            tool: {
                pagingBar: true
            },
            columns: [
            {
                title: '操作时间',
                dataIndex: 'ctime'
            },{
                title: '操作IP',
                dataIndex: 'ip'
            },{
            	title:'备注内容',
            	dataIndex:'content',
        	 	formatter: {
                    length: 20
                }
            },{
                title: '操作',
                dataIndex: 'id',
                renderer: function(cellData, rowData){
                	var result = '';
                	result += '<div style="overflow:hidden;">';
            		result += '<a class="btn btn-primary" href="###" onclick="editItem(\''+cellData+'\');">修改</a>\n';
                	result += '<a class="btn btn-primary" href="###" onclick="removeItems(\''+cellData+'\');">删除</a>\n';
                	result += '</div>';
                	return result;
                }
            }]
        });
    });
        
    function _refresh(){
		grid.refresh();
    }    
    
    function _search(){
    	grid.load({
     		"searchKey":$("#searchKey").val()
     	});
    }
    
    //添加
	function add(){
		z_openIframe('添加', 700, 400, '${contextPath}/remark/toadd.do?workId=${workId}');
	}
	
	//编辑
	function editItem(id){
		z_openIframe('修改备注', 700, 400, '${contextPath}/remark/tomodify/' + id + '.do');
	}

	//删除
	function removeItems(id){
		var post = {};
		var ids = new Array();
		ids[0] = id;
		post.idsJson = JSON.stringify(ids);
		$.post('${contextPath}/remark/remove.do',post,function(data){
			if(data.s==1){
				grid.refresh();
			}else{
				alert(data.d);
			}
		},"json");
	}
	
	function _back(){
		var type = ${type};
		if(type==1){
			window.location.href="${contextPath}/task/tolist.do";
		}else if(type==2){
			window.location.href="${contextPath}/work/tolist.do";
		}
	}
</script>
</body>
</html>