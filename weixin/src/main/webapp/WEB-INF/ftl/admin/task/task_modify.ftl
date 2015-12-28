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
</head>
<body>
<div class="form-wrap">
    <form id="saveform" method="post">
    	<input type="hidden" name="id" value="${(obj.id)!}"/>
        <table class="form-table">
            <tr>
                <td><label class="form-label" for="pid">所属项目<b class="red">*</b></label></td>
                <td>
                	<#if obj??>
                		<input type="hidden" name="pid"  value="${obj.pid}" />
                	</#if>
                	<select class="form-select" name="pid" id="pid" <#if obj??>disabled="disabled"</#if> data-check="must">
						<#list projectList as task>
							<option value="${task.id}" 
								<#if obj??&&obj.pid==task.id>
									selected
								</#if>
							 >${task.name}</option>
						</#list>
                    </select>
                </td>
            </tr>
            <tr>
            	<td><label class="form-label" for="name">任务<b class="red">*</b></label></td>
            	<td>
            		<input class="form-control" type="text" value="${(obj.name)!}" name="name" id="name" data-check="must|max-len:100" />
            	</td>
            </tr>
            <tr>
                <td><label class="form-label" for="userId">负责人<b class="red">*</b></label></td>
                <td>
                    <select class="form-select" name="userId" id="userId" data-check="must">
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
            	<td><label class="form-label" for="state">状态<b class="red">*</b></label></td>
            	<td>
            		<select class="form-select" name="state" id="state" data-check="must" >
            			<option value="">--请选择状态--</option>
            			<option value="进行中" <#if obj??&&obj.state=="进行中">selected</#if> >进行中</option>
            			<option value="暂停中" <#if obj??&&obj.state=="暂停中">selected</#if> >暂停中</option>
            			<option value="已完成" <#if obj??&&obj.state=="已完成">selected</#if> >已完成</option>
            		</select>
            	</td>
            </tr>
            <tr>
            	<td><label class="form-label" for="timePre">预计工时<b class="red">*</b></label></td>
            	<td>
            		<input class="form-control" name="timePre" id="timePre" type="text" data-check="must|n" value="${(obj.timePre)!}" />小时
            		<font color="#999999">（一天按8小时计算）</font>
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

function _save() {
	$("#saveform").ajaxSubmit({
		url : '${contextPath}/task/modifyTask.ajax',
		dataType : 'json',
		beforeSubmit : function(formData, jqForm, options) {
			if(!$("#saveform").check())return false;
			if(!window.confirm("确定提交?"))return false;
		    return true;
		},
		success : function(data, statusText, xhr) {
			if(data.s){
				window.parent._refresh();
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
$(document).ready(function(){
	// 解决IE6下第二次打开弹窗时焦点丢失的问题
	$('#form :input:not(:hidden):not(:button):first').focus();
});
</script>
</body>
</html>