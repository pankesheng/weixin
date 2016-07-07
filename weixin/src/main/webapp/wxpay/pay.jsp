<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";

	String appId = request.getParameter("appid");
	String timeStamp = request.getParameter("timeStamp");
	String nonceStr = request.getParameter("nonceStr");
	String packageValue = request.getParameter("package");
	String paySign = request.getParameter("sign");
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<base href="<%=basePath%>">

<title>微信安全支付</title>

<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
<meta http-equiv="description" content="This is my page">
<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
<script type="text/javascript"
	src="${contextPath}/ext/jquery/jquery-1.8.1.min.js"></script>
</head>

<body>
</body>
<script type="text/javascript">
  	function callpay(){
		WeixinJSBridge.invoke('getBrandWCPayRequest',{
  		"appId" : "<%=appId%>","timeStamp" : "<%=timeStamp%>", "nonceStr" : "<%=nonceStr%>", "package" : "<%=packageValue%>","signType" : "MD5", "paySign" : "<%=paySign%>"
		}, function(res) {
			WeixinJSBridge.log(res.err_msg);
			// alert(res.err_code + res.err_desc + res.err_msg);
			if (res.err_msg == "get_brand_wcpay_request:ok") {
				window.location.href="http://www.baidu.com";
				//	alert("支付成功！");
			} else {
				//	alert("支付失败!");  
			}
		})
	}

	function onBridgeReady() {
	}
	if (typeof WeixinJSBridge === "undefined") {
		if (document.addEventListener) {
			document.addEventListener('WeixinJSBridgeReady', onBridgeReady,
					false);
		}
	} else {
		onBridgeReady();
	}

	document.addEventListener("WeixinJSBridgeReady", function() {
		callpay();
	});
</script>
</html>
