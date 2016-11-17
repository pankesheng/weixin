<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<link rel="stylesheet" type="text/css" href="${contextPath}/admin/stylesheets/common.css?v=${sversion}" media="screen" />
	<link rel="stylesheet" type="text/css" href="${contextPath}/admin/stylesheets/table.css?v=${sversion}" media="screen" />
	<script type="text/javascript" src="${contextPath}/ext/jquery/jquery-1.8.1.min.js"></script>
	<script type="text/javascript" src="${contextPath}/ext/jquery_form/jquery.form.min.js"></script>
	<script type="text/javascript" src="${contextPath}/ext/layer/layer.min.js"></script>
	<script type="text/javascript" src="${contextPath}/ext/laydate/laydate.js"></script>
	
	
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
		                <td><label class="form-label">几栋<b class="red">*</b></label></td>
		                <td>
		                	<input class="form-control" name="name" type="text" data-check="must|n"  value="${(obj.hourse_num)!}"/>
		                </td>
		            </tr>
			        <tr>
		                <td><label class="form-label">房间号<b class="red">*</b></label></td>
		                <td>
		                	<input class="form-control" name="name" type="text" data-check="must|n"  value="${(obj.room_num)!}"/>
		                </td>
		            </tr>
			        <tr>
		                <td><label class="form-label">姓名<b class="red">*</b></label></td>
		                <td>
		                	<input class="form-control" name="name" type="text" data-check="must|max-len:100"  value="${(obj.name)!}"/>
		                </td>
		            </tr>
			        <tr>
		                <td><label class="form-label">电话</label></td>
		                <td>
		                	<input class="form-control" name="phone" type="text" data-check="max-len:100"  value="${(obj.phone)!}"/>
		                </td>
		            </tr>
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
var prefix = "${contextPath}";

function _save() {

	
	$("#saveform").ajaxSubmit({
		url : '${contextPath}/user/modify.ajax',
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
$(document).ready(function(){
	
	// 解决IE6下第二次打开弹窗时焦点丢失的问题
	$('#form :input:not(:hidden):not(:button):first').focus();
});
</script>
</body>
</html>