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
	<script type="text/javascript" src="${contextPath}/admin/ext/zw/src/jquery-elist.js"></script>
    <script type="text/javascript" src="${contextPath}/admin/ext/zw/grid.js?v=${sversion}"></script>
    <script type="text/javascript" src="${contextPath}/admin/javascripts/jquery.cookie.js"></script>
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
                    <label for="projectId">项目</label>
                    <select class="form-select" style="width:150px;" id="projectId" onchange="_search();" >
                    	<option value="">--请选择项目--</option>
                    	<#list projectList as task>
                    		<option id="selectProject${task.id}" value="${task.id}">${task.name}</option>
                    	</#list>
                    </select>
                </div>
                <div class="form-group">
                    <label for="userId">负责人</label>
                    <select class="form-select" style="width:150px;" id="userId" onchange="_search();" >
                    	<option value="">--请选择负责人--</option>
                    	<#list userList as user>
                    		<option id="selectUser${user.id}" value="${user.id}">${user.realname}</option>
                    	</#list>
                    </select>
                </div>
                <div class="form-group">
                    <label for="state">状态</label>
                    <select id="state" data-placeholder="--请选择状态--" >
                        <option id="selectStateing" value="进行中">进行中</option>
                        <option id="selectStatepause" value="暂停中">暂停中</option>
                        <option id="selectStateok" value="已完成">已完成</option>
					</select>
                </div>
                <div class="form-group">
                	<a href="javascript:void(0);" class="btn" id="search-btn"><i class="iconfont">&#xe61b;</i>查询</a>
                </div>
            </form>
        </div>
        <div class="panel table-tool-bar">
            <a class="btn" href="###" onclick="addTask()"><i class="add-btn iconfont">&#xe619;</i>添加任务</a>
            <a class="btn" href="###" onclick="add()"><i class="add-btn iconfont">&#xe619;</i>添加项目</a>
        </div>
        <table class="table" id="table">
        	<thead><tr class="table-head hover"><th>项目/任务</th><th>负责人</th><th style="width:150px;">状态</th><th>实际/预计工时</th><th>最后更新时间</th><th>最后备注信息</th><th>操作</th></tr></thead>
        	<tbody id="listview"></tbody>
        </table>
    </div>
<script>
	var cookieProject = $.cookie('the_cookie_project');
	if(cookieProject!=null){
		$("#selectProject"+cookieProject).attr("selected","selected");
	}
	var cookieUserId = $.cookie('the_cookie_userId');
	if(cookieUserId!=null){
		$("#selectUser"+cookieUserId).attr("selected","selected");
	}
	var cookieState = $.cookie('the_cookie_state');
	if(cookieState!=null){
		var obj = cookieState.split(",");
		for(var i = 0;i<obj.length;i++){
			if(obj[i]=="进行中"){
				$("#selectStateing").attr("data-selected","true");
			}else if(obj[i]=="暂停中"){
				$("#selectStatepause").attr("data-selected","true");
			}else if(obj[i]=="已完成"){
				$("#selectStateok").attr("data-selected","true");
			}
		}
	}
	$("#state").elist();
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
		window.location.href="${contextPath}/remark/tolist.do?type=1&id="+id;
	}
	
	//添加备注
	function _addRemark(id){
		z_openIframe('添加', 700, 400, '${contextPath}/remark/toadd.do?workId='+id);
	}
	
	function _history(id){
		window.location.href="${contextPath}/tasklog/tolist.do?taskId="+id;
	}
	
	$("#search-btn").click(function(){
     	_search();
    });
	
	function _search(){
		var url = "${contextPath}/task/listData.ajax";
		var post = {};
		var userId = $("#userId").val();
		post.userId = userId;
		$.cookie('the_cookie_userId', userId, { expires: 30 });
		var states = $("#state").elist("getData");
    	var stateStr = new Array();
    	var stateStr1 = "";
    	for (var i = 0; i < states.length; i++) {
    		stateStr.push(states[i]);
    		if(stateStr1!=""){
    			stateStr1+=",";
    		}
    		stateStr1+=states[i];
		}
		$.cookie('the_cookie_state', stateStr1, { expires: 30 });
    	post.stateStr = JSON.stringify(stateStr);
    	var projectId = $("#projectId").val();
		post.projectId = projectId;
		$.cookie('the_cookie_project', projectId, { expires: 30 });
		$.post(url,post,function(data){
			var result=eval(data);
			$("#listview").html("");
			$("#trTemp").tmpl(result).appendTo("#listview");
			$(result).each(function (key) {
				if(!result[key].pid && result[key].state!="进行中"){
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
	
	function _stateChange(id){
		var post = {};
		post.id = id;
		post.state = $("#changeState"+id).val();
		var url = "${contextPath}/task/changeState.ajax";
		$.post(url,post,function(data){
			if(data.s!=1){
				alert(data.d);
			}else{
				_search();
			}
		},"json");
	}
	function _csclick(id){
		$("#cs"+id).hide();
		$("#css"+id).show();
		$("#changeState"+id).focus();
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
				<span style="margin-left:20px;">{{= name}}</span>
			{{else}}
				<span id="zk{{= id}}" {{if stateStr=="进行中"}}style="display:none;font-weight:bold;"{{else}}style="font-weight:bold;"{{/if}} ><a href="javascript:void(0);" onclick="_zk({{= id}})">[+]&nbsp;&nbsp;{{= name}}</a>{{if newTask==true}}<font color="red">&nbsp;&nbsp;【new】</font>{{/if}}</span>
				<span id="ss{{= id}}" {{if stateStr!="进行中"}}style="display:none;font-weight:bold;"{{else}}style="font-weight:bold;"{{/if}}><a href="javascript:void(0);" onclick="_ss({{= id}})">[-]&nbsp;&nbsp;{{= name}}</a>{{if newTask==true}}<font color="red">&nbsp;&nbsp;【new】</font>{{/if}}</span>
			{{/if}}			
		</td>
		<td style="white-space: nowrap;">
			<span {{if pid}}{{else}}style="font-weight:bold;"{{/if}}>
			{{= userName}}
			</span>
		</td>
		<td style="white-space: nowrap;">
			{{if pid}}
				<span id="cs{{= id}}">
					{{= stateStr}}<i class="remove-btn iconfont" onclick="_csclick({{= id}})">&#xe611;</i>
				</span>
				<div id="css{{= id}}" style="display:none;">
					<select class="form-select" style="width:80px;" id="changeState{{= id}}" onchange="_stateChange({{= id}});" >
	                	<option value="进行中" {{if stateStr=="进行中"}}selected{{/if}}>进行中</option>
						<option value="暂停中" {{if stateStr=="暂停中"}}selected{{/if}}>暂停中</option>
						<option value="已完成" {{if stateStr=="已完成"}}selected{{/if}}>已完成</option>
	                </select>
				</div>
			{{else}}
				<span style="font-weight:bold;">
					{{= stateStr}}&nbsp;&nbsp;&nbsp;&nbsp;
				</span>
			{{/if}}
			<#--
			{{if pid}}
				<select class="form-select" style="width:80px;" id="changeState{{= id}}" onchange="_stateChange({{= id}});" >
                	<option value="进行中" {{if stateStr=="进行中"}}selected{{/if}}>进行中</option>
					<option value="暂停中" {{if stateStr=="暂停中"}}selected{{/if}}>暂停中</option>
					<option value="已完成" {{if stateStr=="已完成"}}selected{{/if}}>已完成</option>
                </select>
			{{else}}
				<span {{if pid}}{{else}}style="font-weight:bold;"{{/if}}>
					{{= stateStr}}
				</span>
			{{/if}}
			-->
		</td>
		<#--
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
		-->
		<td style="white-space: nowrap;">
			<span {{if pid}}{{else}}style="font-weight:bold;"{{/if}}>
				{{= timeRealStr}}/{{= timePreStr}}
			</span>
		</td>
		<td style="white-space: nowrap;">
			<span {{if pid}}{{else}}style="font-weight:bold;"{{/if}}>
			{{= show_utime}}
			</span>
		</td>
		<td style="white-space: nowrap;text-align:left;">
			<span {{if pid}}{{else}}style="font-weight:bold;"{{/if}}>
			{{if show_remark}}
				<div style="margin:auto;width: 150px;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;">
					<font color="green">({{= remarkCount}})</font><a href="javascript:void(0);" onclick="_remarkList('{{= id}}');" class="easyui-tooltip" title="{{= show_remark}}">{{= show_remark}}</a>
				</div>
			{{/if}}
			</span>
		</td>
		<td style="white-space: nowrap;">
			<a class="btn btn-primary" href="javascript:void(0);" onclick="_editItem('{{= id}}');"><i class="remove-btn iconfont">&#xe60f;</i>编辑</a>
			<div class="ui-droplist arrow-droplist table-droplist">
				<a href="javascript:void(0);" class="btn btn-success" onclick="_addRemark('{{= id}}');" id="search-btn">添加备注<span class="arrow-selectbox-container"><i class="ui-selectbox-icon"></i></span></a>
				<dl class="ui-selectbox-dropdown ui-droplist-option" style="min-width: 126px; display: none;">
					<dd class="ui-selectbox-option" onclick="_history('{{= id}}');"><i class="remove-btn iconfont">&#xe61b;</i>历史记录</dd>
					<dd class="ui-selectbox-option" onclick="_remarkList('{{= id}}');"><i class="remove-btn iconfont">&#xe61b;</i>所有备注</dd>
				</dl>
			</div>
		</td>
	</tr>
</script>
</body>
</html>