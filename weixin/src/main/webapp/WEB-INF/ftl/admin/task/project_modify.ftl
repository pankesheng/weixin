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
                <td><label style="margin-top:-45px;" class="form-label" for="name">项目名称<b class="red">*</b></label></td>
                <td>
                	<input class="form-control" name="name" id="name" type="text" data-check="must|max-len:100" value="${(obj.name)!}"/>
                	<div><font color="#999999">示例：p01_booking.包厢网</font></div>
                </td>
            </tr>
            <tr>
                <td><label class="form-label" for="user">负责人<b class="red">*</b></label></td>
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
		url : '${contextPath}/task/modifyProject.ajax',
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