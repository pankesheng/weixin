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
	<div class="place">
        <span class="label-span">位置：</span>
        <span>测试 - 自定义菜单管理</span>
    </div>
    <div class="body-warp">
        <div class="panel filter-block">
            <form class="form-inline">
                <div class="form-group">
					名称：<input id="btn_name" class="form-control" type="text" />
                </div>
                <div class="form-group">
                    <a href="javascript:void(0);" class="btn" id="search-btn"><i class="iconfont">&#xe61b;</i>搜索</a>
                </div>
            </form>
        </div>
        <div class="panel table-tool-bar">
            <a class="btn" href="###" onclick="_add();"><i class="add-btn iconfont">&#xe619;</i>添加</a>
            <a class="btn" href="###" onclick="_remove();"><i class="remove_btn iconfont">&#xe608;</i>删除</a>
            <a class="btn" href="###" onclick="_createMenu();"><i class="add-btn iconfont">&#xe619;</i>生成菜单</a>
        </div>
        <table class="table" id="table"></table>
    </div>
<script>
    var grid = {};
    $(function() {
        grid = $('#table').grid({
            store: {
				url: '${contextPath}/menubutton/list.ajax'
            },
            tool: {
                pagingBar: true
            },
            columns: [
            {
                title: '名称',
                dataIndex: 'btn_name'
            },{
            	title:'排序号',
            	dataIndex:'btn_order'
            },{
            	title:'所属列表项',
            	dataIndex:'show_parent.btn_name'
            },{
            	title:'一级菜单',
            	dataIndex:'pid',
            	renderer:function(cd){
            		if(cd){
            			return "否";
            		}else{
            			return "是";
            		}
            	}
            },{
            	title:'是否作为列表项',
            	dataIndex:'btn_list',
            	renderer:function(cd){
            		if(cd==1){
            			return "是";
            		}else{
            			return "否";
            		}
            	}
            },{
                title: '类型',
                dataIndex: 'btn_type'
            },{
                title: 'key',
                dataIndex: 'btn_key'
            },{
                title: 'url',
                dataIndex: 'btn_url'
            },{
            	title:'素材',
            	dataIndex:'btn_media_name'
            },{
            	title:'状态',
            	dataIndex:'btn_state',
            	renderer:function(cd){
            		if(cd==1){
            			return "启用";
            		}else{
            			return "停用";
            		}
            	}
            },{
            	title:'操作',
            	dataIndex:'id',
            	renderer:function(cd){
            		var result = '<div style="overflow:hidden;">';
            		result += '<a class="btn btn-primary" href="###" onclick="_editItem('+cd+');">编辑</a>\n';
            		result += '<a class="btn btn-danger" href="###" onclick="_removeItem('+cd+');">删除</a>\n';
            		result +="</div>";
            		return result;
            	}
            }]
        });
    });
    
    function _editItem(id){
    	window.location.href="${contextPath}/menubutton/tomodify.ajax?id="+id;
    }
    function _removeItem(id){
    	var post = {};
    	post.ids = id;
    	var url = "${contextPath}/menubutton/remove.ajax";
    	if(!confirm("您确定要删除这条信息吗？删除该信息对现有菜单不会有任何影响!"))return;
    	$.post(url,post,function(data){
    		if(data.s==1){
    			alert(data.d||"删除成功！");
    			grid.refresh();
    		}else{
    			alert(data.d||"删除失败！");
    		}
    	},"json");
    }
    
    function _remove(){
    	var dataString = grid.getSelectedData("id");
		
		if (!dataString || dataString.length == 0) {
			alert('请选择至少一条记录！');
			return false;
		}
		var ids = "";
		for (i in dataString) {
			ids += dataString[i];
			if (i < dataString.length-1) {
				ids += ",";
			}
		}
		var post = {};
		post.ids = ids;
		var url = "${contextPath}/menubutton/remove.ajax";
		if(!confirm("删除后数据不可恢复，是否继续？"))return ;
		$.post(url,post,function(data){
    		if(data.s==1){
    			alert(data.d||"删除成功！");
    			grid.refresh();
    		}else{
    			alert(data.d||"删除失败！");
    		}
    	},"json");
    }
    
   	function _add(){
   		window.location.href="${contextPath}/menubutton/toadd.ajax";
   	}
	
	function _createMenu(){
		var post = {};
		var url = "${contextPath}/menubutton/createMenu.ajax";
		if(!confirm("该操作生成的菜单将会覆盖原来的菜单，请谨慎操作！是否继续？")) return ;
		$.post(url,post,function(data){
			if(data.s==1){
				alert(data.d||"菜单生成成功！");
			}else{
				alert(data.d||"菜单生成失败！");
			}
		},"json");
	}

	$('#search-btn').click(function(){
    	var params = {};
    	params['btn_name'] = $('#btn_name').val();
    	grid.load(params);
    });
    $('#btn_name').keydown(function(e){
		if(e.keyCode==13){
		   $('#search-btn').click();
		   return false;
		}
	});
</script>
</body>
</html>