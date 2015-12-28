<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="renderer" content="webkit">
	<meta http-equiv="X-UA-Compatible" content="IE=Edge">
	<link rel="stylesheet" type="text/css" href="${contextPath}/admin/stylesheets/common.css?v=${sversion}" media="screen" />
	<link rel="stylesheet" type="text/css" href="${contextPath}/admin/stylesheets/table.css?v=${sversion}" media="screen" />
	<script type="text/javascript" src="${contextPath}/ext/jquery/jquery-1.8.1.min.js"></script>
	<script type="text/javascript" src="${contextPath}/ext/jquery_form/jquery.form.min.js"></script>
	<script type="text/javascript" src="${contextPath}/ext/layer/layer.min.js"></script>
	<script type="text/javascript" src="${contextPath}/ext/laydate/laydate.js"></script>
	<link rel="stylesheet" type="text/css" href="${contextPath}/admin/ext/uploadify/uploadify.css" media="screen" />
	<script type="text/javascript" src="${contextPath}/admin/ext/uploadify/jquery.uploadify.min.js?t=<@z.z_now />"></script>
	<link rel="stylesheet" href="${contextPath}/ext/jquery_zcj/jquery.zimgslider.css?v=${sversion}" />
	<script type="text/javascript" src="${contextPath}/ext/jquery_zcj/jquery.zimgslider.js?v=${sversion}"></script>
	<script type="text/javascript" src="${contextPath}/admin/ext/jquery/selectbox.js"></script>
	<script type="text/javascript" src="${contextPath}/admin/ext/zw/check.js?v=${sversion}"></script>
	<script type="text/javascript" src="${contextPath}/admin/javascripts/zcommon.js?v=${sversion}" basepath="${contextPath}" baseinit="ajaxCheckLogin"></script>
	<style>
		.ui-selectbox-dropdown .ui-selectbox-disabled, .ui-selectbox-dropdown .ui-selectbox-disabled:hover{
			color:#999;
		    cursor: default;
		    background: #FFF;
	    }
	</style>
</head>
<body>
<div class="form-wrap">
    <form id="saveform" method="post">
    	<input type="hidden" name="id" value="${(obj.id)!}"/>
        <table class="form-table">
            <tr>
                <td><label class="form-label" for="userId">员工<b class="red">*</b></label></td>
                <td>
                    <select class="form-select" name="userId" id="userId" onchange="_userChange();" data-check="must">
						<option value="">--请选择负责人--</option>
						<#list userList as user>
							<option value="${user.id}" 
								<#if obj??>
									<#if obj.userId==user.id>
										selected
									</#if>
								<#else>
									<#if user.currentUser>
										selected
									</#if>
								</#if>
							>${user.realname}</option>
						</#list>
                    </select>
                </td>
            </tr>
            <tr>
            	<td><label class="form-label">时间<b class="red">*</b></label></td>
            	<td>																									
            		<input class="form-control date" style="width:100px;" id="workBeginTime" name="workBeginTime" value="${((obj.workBeginTime)?string("yyyy-MM-dd"))!'${(.now)?string("yyyy-MM-dd")}'}" data-check="must" type="text" />
            		~
            		<input class="form-control date" style="width:100px;" id="workEndTime" name="workEndTime" value="${((obj.workEndTime)?string("yyyy-MM-dd"))!'${(.now)?string("yyyy-MM-dd")}'}" data-check="must" type="text" />
            	</td>
            </tr>
            <tr>
            	<td><label class="form-label" for="timeReal">累计工时<b class="red">*</b></label></td>
            	<td>
            		<input class="form-control" style="width:100px;" name="timeReal" id="timeReal" type="text" data-check="must|n" value="${(obj.timeReal)!8}" />小时
            		<font color="#999999">（一天按8小时计算）</font>
            	</td>
            </tr>
            <tr>
            	<td><label class="form-label" for="taskId">任务<b class="red">*</b></label></td>
            	<td>
            		<select class="form-select" name="taskId" id="taskId" data-check="must">
						<option value="">--请选择任务--</option>
						<#list taskList as task>
							<option value="${task.id}" 
								<#if obj??&&obj.taskId==task.id> 
									selected="selected"
								</#if>
								<#if !task.pid> disabled="disabled"</#if>
							>
							<#if task.pid>&nbsp;&nbsp;&nbsp;&nbsp;</#if>${task.name}</option>
						</#list>
                    </select>
            	</td>
            </tr>
            <#if obj==null>
	            <tr class="valign-top">
	                <td><label class="form-label" for="content">备注</label></td>
	                <td>
	                	<textarea style="resize:none;" class="form-textarea" name="content" ></textarea>
	                </td>
	            </tr>
            </#if>
            <tr>
                <td><label class="form-label">&nbsp;</label></td>
                <td>
                    <input class="btn btn-success btn-large" type="button" onclick="_save()" value="提交">
                    <input class="btn btn-danger btn-large" type="reset" value="重置">
                </td>
            </tr>
        </table>
    </form>
</div>
<script type="text/javascript">
function _proChange(){
	var projectId = $("#projectId").val();
	var post = {};
	post.projectId = projectId;
	$.post('${contextPath}/work/projectTasks.ajax',post,function(data){
		var result=eval(data);
		$("#taskId").html("");
		$("#taskId").append('<option value="">--请选择任务--</option>');
		$(result).each(function (key) {
        	$("#taskId").append('<option value="'+result[key].id+'">'+result[key].name+'</option>');
	 	});
	},"json")
}

$(function(){
	var workBeginTime = {
	    elem: '#workBeginTime',
	    format: 'YYYY-MM-DD',
		event: 'focus',
	    choose: function(datas){
	         workEndTime.min = datas; //开始日选好后，重置结束日的最小日期
	         workEndTime.start = datas //将结束日的初始值设定为开始日
	    }
	};
	var workEndTime = {
		elem: '#workEndTime',
	    format: 'YYYY-MM-DD',
		event: 'focus',
	    choose: function(datas){
	         workBeginTime.max = datas; //结束日选好后，重置开始日的最大日期
	    }
	}
	laydate(workBeginTime);
	laydate(workEndTime);
})
function _save() {
	$("#saveform").ajaxSubmit({
		url : '${contextPath}/work/modify.ajax',
		dataType : 'json',
		beforeSubmit : function(formData, jqForm, options) {
			if(!$("#saveform").check())return false;
			if(!window.confirm("确定提交?"))return false;
		    return true;
		},
		success : function(data, statusText, xhr) {
			if(data.s){
				window.parent.grid.refresh();
				// 解决IE6下关闭弹窗时焦点丢失的问题
				$("#searchKey", window.parent.document).focus();
				window.parent.layer.closeAll();
			}else{
				z_alert_error(data.d);
			}
		    return true;
		}
	});
}

function _userChange(){
	var url = "${contextPath}/work/userChange.ajax";
	var post = {};
	post.userId = $("#userId").val();
	$.post(url,post,function(data){
		var result=eval(data);
		$("#taskId").html("");
		$("#taskId").append('<option value="">--请选择任务--</option>');
		$(result).each(function (key) {
			if(result[key].pid){
				$("#taskId").append('<option value="'+result[key].id+'">&nbsp;&nbsp;&nbsp;&nbsp;'+result[key].name+'</option>');
			}else{
        		$("#taskId").append('<option disabled="disabled" value="'+result[key].id+'">'+result[key].name+'</option>');
        	}
	 	});
	},"json");
}

$(document).ready(function(){
	// 解决IE6下第二次打开弹窗时焦点丢失的问题
	$('#form :input:not(:hidden):not(:button):first').focus();
});
</script>
</body>
</html>