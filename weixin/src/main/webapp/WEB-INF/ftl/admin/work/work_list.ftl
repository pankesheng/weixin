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
        <span>工作记录</span>
    </div>
    <div class="body-warp">
    	<div class="panel filter-block">
            <form class="form-inline">
                <div class="form-group">
                    <label for="userId">负责人</label>
                    <select class="form-select" style="width:150px;" id="userId" >
                    	<option value="">--请选择负责人--</option>
                    	<#list userList as user>
                    		<option value="${user.id}" <#if user.currentUser>selected</#if> >${user.realname}</option>
                    	</#list>
                    </select>
                </div>
                <div class="form-group">
                	<a href="javascript:void(0);" class="btn" id="search-btn"><i class="iconfont">&#xe61b;</i>查询</a>
                </div>
            </form>
        </div>
        <div class="panel table-tool-bar">
            <a class="btn" href="###" onclick="add()"><i class="add-btn iconfont">&#xe619;</i>添加记录</a>
        </div>
        <table class="table" id="table"></table>
    </div>
<script>
    var grid = {};
    $(function() {
    	function _search(){
			$("#search-btn").click();
		} 
  	 	$("#search-btn").click(function(){
	     	grid.load({
	     		"userId":$("#userId").val()
	     	});
	    });
	    $("#userId").bind("change",function(){
	    	_search();
	    })
        grid = $('#table').grid({
            store: {
				url: '${contextPath}/work/list.ajax',
				autoLoad :false
            },
            tool: {
            	checkboxSelect:false,
                pagingBar: true
            },
            event: {
            	onLoadCallback:function(json){
					initWidget();
				}
            },
            columns: [
            {
                title: '员工',
                dataIndex: 'userName'
            },{
            	title:'时间',
				renderer:function(cd,rd){
					return rd.workBeginTime+"~"+rd.workEndTime;
				}
            },{
            	title:'累计时间',
            	dataIndex:'timeRealStr'
            },{
            	title:'项目',
            	align:'left',
            	dataIndex:'task.project.name'
            },{
            	title:'任务',
            	align:'left',
            	dataIndex:'task.name'
            },{
            	title:'最后更新',
            	dataIndex:'show_utime'
            },{
            	title:'备注',
            	dataIndex:'remark',
            	renderer:function(cd,rd){
            		if(cd){
					 	var html = '<div style="margin:auto;width: 150px;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;">';
					 	html += '<a href="javascript:void(0);" class="easyui-tooltip" title="'+cd+'">'+cd+'</a>';
					 	html += '</div>'
            			return html;
            		}else{
            			return '';
            		}
            	}
            },{
                title: '操作',
                dataIndex: 'id',
                renderer: function(cellData, rowData){
                	<#--
                	var controls = '<a href="javascript:void(0);" class="btn btn-primary" id="search-btn"><i class="iconfont">&#xe619;</i>操作菜单<i class="ui-selectbox-icon"></i></a>';
					var edit = '<dd class="ui-selectbox-option" onclick="editItem(\''+cellData+'\');"><i class="remove-btn iconfont">&#xe60f;</i>编辑</dd>';
					var history = '<dd class="ui-selectbox-option" onclick="_history(\''+cellData+'\');"><i class="remove-btn iconfont">&#xe61b;</i>历史记录</dd>';
					var containerHtml = '<div class="ui-droplist table-droplist">' + controls + '<dl class="ui-selectbox-dropdown ui-droplist-option">' + edit + history + '</dl></div>\n';
                	return containerHtml;
                	-->
                	var edit = '<a class="btn btn-primary" href="javascript:void(0);" onclick="editItem(\''+cellData+'\');"><i class="remove-btn iconfont">&#xe60f;</i>编辑</a>';
                	var history = '<a class="btn btn-primary" href="javascript:void(0);" onclick="_history(\''+cellData+'\');"><i class="remove-btn iconfont">&#xe61b;</i>历史记录</a>'
               		return '<div style="overflow:hidden;">'+edit+'&nbsp;&nbsp;'+history+'</div>'
                }
            }]
        });
      
		_search(); 
    });
    
    function initWidget(){
    	$('.ui-droplist').dropList();
    }
    
    //添加
	function add(){
		z_openIframe('新增', 700, 400, '${contextPath}/work/toadd.do');
	}
	
	//编辑
	function editItem(id){
		z_openIframe('编辑', 700, 400, '${contextPath}/work/tomodify/' + id + '.do');
	}

	//历史记录
	function _history(id){
		window.location.href="${contextPath}/worklog/tolist.do?workId="+id;	
	}
	
	//删除
	function removeItems(){
		var data = grid.getSelectedDataString('id');
		z_delete(data, '${contextPath}/user/delete.ajax');
	}
	
	//备注列表
	function _remarkList(id){
		window.location.href="${contextPath}/remark/tolist.do?type=2&id="+id;
	}
	
</script>
</body>
</html>