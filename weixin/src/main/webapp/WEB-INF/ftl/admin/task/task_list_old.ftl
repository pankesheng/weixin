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
        <span>任务管理</span>
    </div>
    <div class="body-warp">
    	<div class="panel filter-block">
            <form class="form-inline">
                <div class="form-group">
                    <label for="user">负责人</label>
                    <select class="form-select" style="width:150px;" id="user" onchange="_search();" >
                    	<option value="">--请选择负责人--</option>
                    	<#list userList as user>
                    		<option value="${user.realname}">${user.realname}</option>
                    	</#list>
                    </select>
                </div>
                <div class="form-group">
                    <label for="state">状态</label>
                    <select class="form-select" style="width:150px;" id="state" onchange="_search();">
                    	<option value="" >--请选择状态--</option>
                        <option value="进行中">进行中</option>
                        <option value="暂停中">暂停中</option>
                        <option value="已完成">已完成</option>
                    </select>
                </div>
                <div class="form-group">
                	<a href="javascript:void(0);" class="btn" id="search-btn"><i class="iconfont">&#xe61b;</i>查询</a>
                </div>
            </form>
        </div>
        <div class="panel table-tool-bar">
            <a class="btn" href="###" onclick="add()"><i class="add-btn iconfont">&#xe619;</i>添加项目</a>
            <a class="btn" href="###" onclick="addTask()"><i class="add-btn iconfont">&#xe619;</i>添加任务</a>
        </div>
        <table class="table" id="table">
        	
        </table>
    </div>
<script>
    var grid = {};
    $(function() {
        grid = $('#table').grid({
            store: {
				url: '${contextPath}/task/list.ajax'
            },
            tool: {
                pagingBar: false
            },
            columns: [
            {
                title: '项目/任务',
                dataIndex: 'name',
                align:'left',
                renderer:function(cd,rd){
                	if(rd.pid){
                		return '&nbsp;&nbsp;&nbsp;&nbsp;'+cd;
                	}else{
                		return cd;
                	}
                }
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
            },{
            	title:'最后更新时间',
            	dataIndex:'show_utime'
            },{
            	title:'最后备注信息',
            	dataIndex:'show_remark',
            	renderer:function(cd){
            		if(cd){
            			return '<span class="easyui-tooltip" title="'+cd+'">移上去查看<span>';
            		}else{
            			return '';
            		}
            	}
            },{
                title: '操作',
                dataIndex: 'id',
                renderer: function(cd,rd){
                	var result = '';
                	result += '<div style="overflow:hidden;">';
            		result += '<a class="btn btn-primary" href="###" onclick="_editItem(\''+cd+'\');">编辑</a>\n';
            		result += '<a class="btn btn-primary" href="###" onclick="_history(\''+cd+'\');">历史记录</a>\n';
            		result += '<a class="btn btn-primary" href="###" onclick="_remarkList(\''+cd+'\');">所有备注</a>\n';
            		result += '<a class="btn btn-primary" href="###" onclick="_addRemark(\''+cd+'\');">添加备注</a>\n';
                	result += '</div>';
                	return result;
                }
            }]
        });
    });
    
      
        
    //添加项目
	function add(){
		z_openIframe('新增项目', 700, 400, '${contextPath}/task/toadd.do?type=1');
	}
	
	//添加任务
	function addTask(){
		z_openIframe('新增任务', 700, 500, '${contextPath}/task/toadd.do?type=2');
	}
	
	//编辑
	function _editItem(id){
		z_openIframe('编辑', 700, 400, '${contextPath}/task/tomodify/' + id + '.do');
	}
	
	//备注列表
	function _remarkList(id){
		window.location.href="${contextPath}/remark/tolist.do?id="+id;
	}
	
	//添加备注
	function _addRemark(id){
		z_openIframe('添加', 700, 400, '${contextPath}/remark/toadd.do?workId='+id);
	}
	
	function _history(id){
		window.location.href="${contextPath}/tasklog/tolist.do?taskId="+id;
	}
	
	$("#search-btn").click(function(){
     	grid.load({
     		"user":$("#user").val(),
     		"state":$("#state").val()
     	});
    });
	
	function _search(){
		$("#search-btn").click();
	}
	
	function _refresh(){
		grid.refresh();
	}
	
	
</script>
</body>
</html>