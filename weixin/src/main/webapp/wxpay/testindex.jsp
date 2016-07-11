<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>微信安全支付</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
	<script type="text/javascript" src="${contextPath}/ext/jquery/jquery-1.8.1.min.js"></script>
  </head>
  
  <body>
		<br><br><br><br><br><br><br>
  		<div style="text-align:center;size:100px;"><input type="button" style="width:250px;height:150px;" value="测试支付" onclick="pay()"></div>
  		
  		<div style="text-align:center;size:100px;"><input type="button" style="width:250px;height:150px;" value="获取登录信息" onclick="aaaa()"></div>
  </body>
  <script type="text/javascript">
	var order = '${orderNo}';
	function pay(){
		window.location.href="${contextPath}/wxpay/paymain.ajax?orderNo="+order+"&userId=124124&descr=是多少分开就害臊低级房哈市的金凤凰驾驶的恢复了卡号第十六课了可视电话&money=0.01";		
	}
	
	function aaaa(){
		window.location.href="${contextPath}/wxpay/oauth.ajax";
	}
	
  </script>
</html>
