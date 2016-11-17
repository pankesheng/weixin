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
        <span>通讯录</span>
    </div>
    <div class="body-warp">
        <div class="panel filter-block">
            <form class="form-inline">
	            <div class="form-group">
                    <select id="searchHourse_num" class="form-select">
                        <option value="">--请选择几栋--</option>
                        <#list hourseList as hourse>
                        	<option value="${hourse}">${hourse}</option>
                        </#list>
                    </select>
                </div>
	            <div class="form-group">
                    <select id="searchRoom_num" class="form-select">
                        <option value="">--请选择房间号--</option>
                        <#list roomList as room>
                        	<option value="${room}">${room}</option>
                        </#list>
                    </select>
                </div>
                <div class="form-group">
                  	 姓名：<input id="searchName" class="form-control" type="text" />
                </div>
                <div class="form-group">
                  	 电话：<input id="searchPhone" class="form-control" type="text" />
                </div>
                <div class="form-group">
                    <a href="javascript:void(0);" class="btn" id="search-btn"><i class="iconfont">&#xe61b;</i>搜索</a>
                </div>
            </form>
        </div>
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
            <#-- 
            	align: 'left'
             -->
            {
                title: '几栋',
                dataIndex: 'hourse_num'
            },{
                title: '房间号',
                dataIndex: 'room_num'
            },{
                title: '姓名',
                dataIndex: 'name'
            },{
                title: '电话',
                dataIndex: 'phone'
            },{
                title: '操作',
                dataIndex: 'id',
                renderer: function(cellData, rowData){
                	var result = '';
                	result += '<div style="overflow:hidden;">';
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
		var data = grid.getSelectedData('id');
		z_delete2(data, '${contextPath}/user/delete.ajax');
	}
	
	
	$('#search-btn').click(function(){
    	var params = {};
    	params['searchHourse_num'] = $('#searchHourse_num').val();
    	params['searchRoom_num'] = $('#searchRoom_num').val();
    	params['searchName'] = $('#searchName').val();
    	params['searchPhone'] = $('#searchPhone').val();
    	grid.load(params);
    });
    <#-- 
    $('#searchKey').keydown(function(e){
		if(e.keyCode==13){
		   $('#search-btn').click();
		   return false;
		}
	});
    -->
	$('#searchHourse_num').change(function(){
		$('#search-btn').click();
	});
	$('#searchRoom_num').change(function(){
		$('#search-btn').click();
	});
</script>
</body>
</html>