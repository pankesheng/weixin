package com.weixin.action;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;
import java.util.SortedMap;
import java.util.TreeMap;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.weixin.pojo.SNSUserInfo;
import com.weixin.pojo.WeChatOauth2Token;
import com.weixin.service.CoreService;
import com.weixin.util.AdvancedUtil;
import com.weixin.util.GetWxOrderno;
import com.weixin.util.ParameterUtil;
import com.weixin.util.RequestHandler;
import com.weixin.util.SHA1Util;
import com.weixin.util.SignUtil;
import com.weixin.util.TenpayUtil;
import com.weixin.util.http.HttpConnect;
import com.weixin.util.http.HttpResponse;

@Controller
@RequestMapping(value="")
public class WeixinController {
	
	@RequestMapping(value = "coreServlet", method = RequestMethod.GET)
	public void coreServletGet(HttpServletRequest request,HttpServletResponse response) throws ServletException, IOException {
		 // 微信加密签名  
        String signature = request.getParameter("signature");  
        // 时间戳  
        String timestamp = request.getParameter("timestamp");  
        // 随机数  
        String nonce = request.getParameter("nonce");  
        // 随机字符串  
        String echostr = request.getParameter("echostr");  
  
        PrintWriter out = response.getWriter();  
        // 通过检验signature对请求进行校验，若校验成功则原样返回echostr，表示接入成功，否则接入失败  
        if (SignUtil.checkSignature(signature, timestamp, nonce)) {  
            out.print(echostr);  
        }  
        out.close();  
        out = null;  
     } 
	
	@RequestMapping(value = "coreServlet", method = RequestMethod.POST)
	public void coreServletPost(HttpServletRequest request,HttpServletResponse response) throws ServletException, IOException {
		// 将请求、响应的编码均设置为UTF-8（防止中文乱码）  
        request.setCharacterEncoding("UTF-8");  
        response.setCharacterEncoding("UTF-8");  
        // 调用核心业务类接收消息、处理消息  
        String respMessage = CoreService.processRequest(request);  
        // 响应消息  
        PrintWriter out = response.getWriter();  
        out.print(respMessage); 
        System.out.println(respMessage);
        out.close();  
    }  
	
	@RequestMapping(value="/oauth2")
	public void oauth2(HttpServletRequest request, HttpServletResponse response) throws Exception{
		request.setCharacterEncoding("gb2312");
		response.setCharacterEncoding("gb2312");//[/align][align=left]  // 用户同意授权后，能获取到code
		String code = request.getParameter("code");//[/align][align=left]  // 用户同意授权
		if (!"authdeny".equals(code)) {
			// 获取网页授权access_token
			WeChatOauth2Token weixinOauth2Token = AdvancedUtil.getOauth2AccessToken(ParameterUtil.appId, ParameterUtil.appSecret, code);
			// 网页授权接口访问凭证
			String accessToken = weixinOauth2Token.getAccessToken();
			// 用户标识
			String openId = weixinOauth2Token.getOpenId();
			// 获取用户信息
			SNSUserInfo snsUserInfo = AdvancedUtil.getSNSUserInfo(accessToken, openId);//[/align][align=left]   // 设置要传递的参数
			request.setAttribute("snsUserInfo", snsUserInfo);
		}
		// 跳转到index2.jsp
		request.getRequestDispatcher("index2.jsp").forward(request, response);
	}
	
	@RequestMapping(value="/wxpay/oauth2")
	public String oauth2(Model model,HttpServletRequest request, HttpServletResponse response) throws Exception{
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");//[/align][align=left]  // 用户同意授权后，能获取到code
		String code = request.getParameter("code");//[/align][align=left]  // 用户同意授权
		if (!"authdeny".equals(code)) {
			// 获取网页授权access_token
			WeChatOauth2Token weixinOauth2Token = AdvancedUtil.getOauth2AccessToken(ParameterUtil.appId, ParameterUtil.appSecret, code);
			// 网页授权接口访问凭证
			String accessToken = weixinOauth2Token.getAccessToken();
			// 用户标识
			String openId = weixinOauth2Token.getOpenId();
			// 获取用户信息
			SNSUserInfo snsUserInfo = AdvancedUtil.getSNSUserInfo(accessToken, openId);//[/align][align=left]   // 设置要传递的参数
			request.setAttribute("snsUserInfo", snsUserInfo);
			model.addAttribute("snsUserInfo", snsUserInfo);
		}
		return "/index2.jsp";
	}
	
	@SuppressWarnings("deprecation")
	@RequestMapping("/wxpay/paymain")
	public void paymain(HttpServletRequest request,HttpServletResponse response) throws IOException{
		String appid = ParameterUtil.appId;
		String backUri = "http://zdxx.tunnel.qydev.com/wxpay/topay.ajax";
		//授权后要跳转的链接所需的参数一般有会员号，金额，订单号之类，
		//最好自己带上一个加密字符串将金额加上一个自定义的key用MD5签名或者自己写的签名,
		//比如 Sign = %3D%2F%CS% 
		String orderNo=appid+SHA1Util.getTimeStamp();
		backUri = backUri+"?userId=b88001&orderNo="+orderNo+"&describe=test&money=0.01";
		//URLEncoder.encode 后可以在backUri 的url里面获取传递的所有参数
		backUri = URLEncoder.encode(backUri);
		//scope 参数视各自需求而定，这里用scope=snsapi_base 不弹出授权页面直接授权目的只获取统一支付接口的openid
		String url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appid+"&redirect_uri="+backUri+"&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect";
		response.sendRedirect(url);
	}
	
	@SuppressWarnings({ "unused", "static-access" })
	@RequestMapping(value="/wxpay/topay")
	public String topay(HttpServletRequest request,HttpServletResponse response){
		//网页授权后获取传递的参数
		String userId = request.getParameter("userId"); 	
		String orderNo = request.getParameter("orderNo"); 	
		String money = request.getParameter("money");
		String code = request.getParameter("code");
		//金额转化为分为单位
		float sessionmoney = Float.parseFloat(money);
		String finalmoney = String.format("%.2f", sessionmoney);
		finalmoney = finalmoney.replace(".", "");
		
		//商户相关资料 
		String appid = ParameterUtil.appId;
		String appsecret = ParameterUtil.appSecret;
		String partner = ParameterUtil.MCH_ID;
		String partnerkey = ParameterUtil.API_KEY;
		
		
		String openId ="";
		String URL = "https://api.weixin.qq.com/sns/oauth2/access_token?appid="+appid+"&secret="+appsecret+"&code="+code+"&grant_type=authorization_code";
		Map<String, Object> dataMap = new HashMap<String, Object>();
		HttpResponse temp = HttpConnect.getInstance().doGetStr(URL);		
		String tempValue="";
		if( temp == null){
			return "redirect:/wxpay/payerror.jsp";
		}else
		{
			try {
				tempValue = temp.getStringResult();
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			JSONObject  jsonObj = JSONObject.fromObject(tempValue);
			if(jsonObj.containsKey("errcode")){
				System.out.println(tempValue);
				return "redirect:/wxpay/payerror.jsp";
			}
			openId = jsonObj.getString("openid");
		}
		
		
		//获取openId后调用统一支付接口https://api.mch.weixin.qq.com/pay/unifiedorder
		String currTime = TenpayUtil.getCurrTime();
		//8位日期
		String strTime = currTime.substring(8, currTime.length());
		//四位随机数
		String strRandom = TenpayUtil.buildRandom(4) + "";
		//10位序列号,可以自行调整。
		String strReq = strTime + strRandom;
		
		//商户号
		String mch_id = partner;
		//子商户号  非必输
		//String sub_mch_id="";
		//设备号   非必输
		String device_info="";
		//随机数 
		String nonce_str = strReq;
		//商品描述
		//String body = describe;
		
		//商品描述根据情况修改
		String body = "美食";
		//附加数据
		String attach = userId;
		//商户订单号
		String out_trade_no = orderNo;
		int intMoney = Integer.parseInt(finalmoney);
		
		//总金额以分为单位，不带小数点
		int total_fee = intMoney;
		//订单生成的机器 IP
		String spbill_create_ip = request.getRemoteAddr();
		//订 单 生 成 时 间   非必输
		//String time_start ="";
		//订单失效时间      非必输
		//String time_expire = "";
		//商品标记   非必输
		//String goods_tag = "";
		
		//这里notify_url是 支付完成后微信发给该链接信息，可以判断会员是否支付成功，改变订单状态等。
		String notify_url ="http://zdxx.tunnel.qydev.com/aa.html";
		
		String trade_type = "JSAPI";
		String openid = openId;
		//非必输
		//String product_id = "";
		SortedMap<String, String> packageParams = new TreeMap<String, String>();
		packageParams.put("appid", appid);  
		packageParams.put("mch_id", mch_id);  
		packageParams.put("nonce_str", nonce_str);  
		packageParams.put("body", body);  
		packageParams.put("attach", attach);  
		packageParams.put("out_trade_no", out_trade_no);  
		//这里写的金额为1 分到时修改
		packageParams.put("total_fee", "1");  
		//packageParams.put("total_fee", "finalmoney");  
		packageParams.put("spbill_create_ip", spbill_create_ip);  
		packageParams.put("notify_url", notify_url);  
		packageParams.put("trade_type", trade_type);  
		packageParams.put("openid", openid);  

		RequestHandler reqHandler = new RequestHandler(request, response);
		reqHandler.init(appid, appsecret, partnerkey);
		
		String sign = reqHandler.createSign(packageParams);
		String xml="<xml>"+
				"<appid>"+appid+"</appid>"+
				"<mch_id>"+mch_id+"</mch_id>"+
				"<nonce_str>"+nonce_str+"</nonce_str>"+
				"<sign>"+sign+"</sign>"+
				"<body><![CDATA["+body+"]]></body>"+
				"<attach>"+attach+"</attach>"+
				"<out_trade_no>"+out_trade_no+"</out_trade_no>"+
				"<attach>"+attach+"</attach>"+
				//金额，这里写的1 分到时修改
				"<total_fee>"+1+"</total_fee>"+
				//								"<total_fee>"+finalmoney+"</total_fee>"+
				"<spbill_create_ip>"+spbill_create_ip+"</spbill_create_ip>"+
				"<notify_url>"+notify_url+"</notify_url>"+
				"<trade_type>"+trade_type+"</trade_type>"+
				"<openid>"+openid+"</openid>"+
				"</xml>";
		System.out.println(xml);
		String allParameters = "";
		try {
			allParameters =  reqHandler.genPackage(packageParams);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		String createOrderURL = ParameterUtil.UNIFIED_ORDER_URL;// "https://api.mch.weixin.qq.com/pay/unifiedorder";
		Map<String, Object> dataMap2 = new HashMap<String, Object>();
		String prepay_id="";
		try {
			prepay_id = new GetWxOrderno().getPayNo(createOrderURL, xml);
			if(prepay_id.equals("")){
				request.setAttribute("ErrorMsg", "统一支付接口获取预支付订单出错");
				response.sendRedirect("/wxpay/payerror.jsp");
			}
		} catch (Exception e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		SortedMap<String, String> finalpackage = new TreeMap<String, String>();
		String appid2 = appid;
		String timestamp = SHA1Util.getTimeStamp();
		String nonceStr2 = nonce_str;
		String prepay_id2 = "prepay_id="+prepay_id;
		String packages = prepay_id2;
		finalpackage.put("appId", appid2);  
		finalpackage.put("timeStamp", timestamp);  
		finalpackage.put("nonceStr", nonceStr2);  
		finalpackage.put("package", packages);
		finalpackage.put("signType", "MD5");
		String finalsign = reqHandler.createSign(finalpackage);
		return "redirect:/wxpay/pay.jsp?appid="+appid2+"&timeStamp="+timestamp+"&nonceStr="+nonceStr2+"&package="+packages+"&sign="+finalsign;
	}
	
}
