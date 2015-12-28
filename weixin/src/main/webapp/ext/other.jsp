<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="/struts-tags" prefix="s"%>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
<script type="text/javascript">

<!--[if !IE]><!--> 除IE外都可识别 <!--<![endif]-->
<!--[if IE]> 所有的IE可识别 <![endif]-->
<!--[if IE 6]> 仅IE6可识别 <![endif]-->
<!--[if lt IE 6]> IE6以及IE6以下版本可识别 <![endif]-->
<!--[if gte IE 6]> IE6以及IE6以上版本可识别 <![endif]-->

$(document).ready(function() {
	
});
function href() {
	window.location.reload();// 刷新(重新请求)当前页
	window.location.href="<%=request.getContextPath() %>/0000";// 修改当前页面的URL
	window.parent.location.href="<%=request.getContextPath() %>/user1003";// 修改上级页面的URL
	
	var url = "http://www.baidu.com/u=encodeURI(\"中文\")";
}
</script>
</head>
<body>

	<%@include file="demo_list.jsp" %>	//插入a.jsp的内容；静态包含；生成一个.class文件；url里不能带参数；
	<jsp:include page="demo_list.jsp"/>	//动态包含；生成两个.class文件；可带参数；两个servlet对象；
	
	<%response.sendRedirect("/login.jsp"); %>	//重定向；通知客户端转到a.jsp页面；url改变
	<jsp:forward page="/login.jsp">				//转发；自动转到a.jsp页面；url不变
		<jsp:param name="name1" value="3"/>		//参数跟着转
	</jsp:forward>

</body>
</html>