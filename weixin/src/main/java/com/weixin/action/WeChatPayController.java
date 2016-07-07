package com.weixin.action;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.URLEncoder;
import java.security.KeyStore;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.SortedMap;
import java.util.TreeMap;

import javax.net.ssl.SSLContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.SSLContexts;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.dom4j.Document;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.weixin.configuration.WeChatConfiguration;
import com.weixin.pojo.ReturnHist;
import com.weixin.pojo.SNSUserInfo;
import com.weixin.pojo.WeChatOauth2Token;
import com.weixin.pojo.WeChatPayResult;
import com.weixin.util.AdvancedUtil;
import com.weixin.util.ClientCustomSSL;
import com.weixin.util.CommonUtil;
import com.weixin.util.GetWxOrderno;
import com.weixin.util.HttpConnect;
import com.weixin.util.HttpResponse;
import com.weixin.util.RequestHandler;
import com.weixin.util.SDKRuntimeException;
import com.weixin.util.SHA1Util;
import com.weixin.util.XMLUtil;
import com.zcj.util.UtilString;
import com.zcj.web.dto.ServiceResult;

@Controller
@RequestMapping(value = "/wxpay")
public class WeChatPayController {
	
	
	@RequestMapping("/test/index")
	public String testIndex(Model model){
		model.addAttribute("orderNo", UtilString.getLongUUID());
		return "/wxpay/testindex.jsp";
	}
	
	@RequestMapping(value = "/oauth2")
	public String oauth2(Model model, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");// [/align][align=left] //
												// 用户同意授权后，能获取到code
		String code = request.getParameter("code");// [/align][align=left] //
													// 用户同意授权
		if (!"authdeny".equals(code)) {
			// 获取网页授权access_token
			WeChatOauth2Token weixinOauth2Token = AdvancedUtil.getOauth2AccessToken(WeChatConfiguration.appId,WeChatConfiguration.appSecret, code);
			// 网页授权接口访问凭证
			String accessToken = weixinOauth2Token.getAccessToken();
			// 用户标识
			String openId = weixinOauth2Token.getOpenId();
			// 获取用户信息
			SNSUserInfo snsUserInfo = AdvancedUtil.getSNSUserInfo(accessToken,openId);// [/align][align=left] // 设置要传递的参数
			request.setAttribute("snsUserInfo", snsUserInfo);
			model.addAttribute("snsUserInfo", snsUserInfo);
		}
		return "/wxpay/index2.jsp";
	}

	// userId 用户id
	// orderNo 订单编号
	// descr 商品描述
	// money 金额，double类型
	@RequestMapping("/paymain")
	public void paymain(HttpServletRequest request,
			HttpServletResponse response, Long userId, Long orderNo,
			String descr, Double money, PrintWriter out) throws IOException {
		String appid = WeChatConfiguration.appId;
		String backUri = WeChatConfiguration.PAY_ACTION;
		orderNo = UtilString.getLongUUID();
//		money = 0.01;
//		descr = "测试商品0001";
		if (orderNo == null) {
			out.write(ServiceResult.initErrorJson("订单号不能为空!"));
			return;
		}
		if (money == null) {
			out.write(ServiceResult.initErrorJson("金额不能为空！"));
			return;
		}
		// 授权后要跳转的链接所需的参数一般有会员号，金额，订单号之类，
		// 最好自己带上一个加密字符串将金额加上一个自定义的key用MD5签名或者自己写的签名,
		// 比如 Sign = %3D%2F%CS%
		// orderNo = appid+SHA1Util.getTimeStamp();
		backUri = backUri + "?userId=" + userId + "&orderNo=" + orderNo	+ "&describe=" + descr + "&money=" + money;
		// URLEncoder.encode 后可以在backUri 的url里面获取传递的所有参数
		backUri = URLEncoder.encode(backUri);
		// scope 参数视各自需求而定，这里用scope=snsapi_base 不弹出授权页面直接授权目的只获取统一支付接口的openid
		String url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appid
				+ "&redirect_uri=" + backUri
				+ "&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect";
		response.sendRedirect(url);
	}

	@RequestMapping(value = "/topay")
	public String topay(HttpServletRequest request,
			HttpServletResponse response, String userId, String orderNo,
			String money, String describe, String code, Model model) {
		float sessionmoney = Float.parseFloat(money);
		String finalmoney = String.format("%.2f", sessionmoney);
		finalmoney = finalmoney.replace(".", "");
		// 商户相关资料
		String appid = WeChatConfiguration.appId;
		String appsecret = WeChatConfiguration.appSecret;
		String partner = WeChatConfiguration.MCH_ID;
		String partnerkey = WeChatConfiguration.API_KEY;

		String openId = "";
		String URL = "https://api.weixin.qq.com/sns/oauth2/access_token?appid="
				+ appid + "&secret=" + appsecret + "&code=" + code
				+ "&grant_type=authorization_code";
		Map<String, Object> dataMap = new HashMap<String, Object>();
		HttpResponse temp = HttpConnect.getInstance().doGetStr(URL);
		String tempValue = "";
		if (temp == null) {
			return "redirect:/wxpay/payerror.jsp";
		} else {
			try {
				tempValue = temp.getStringResult();
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			JSONObject jsonObj = JSONObject.fromObject(tempValue);
			if (jsonObj.containsKey("errcode")) {
				System.out.println(tempValue);
				return "redirect:/wxpay/payerror.jsp";
			}
			openId = jsonObj.getString("openid");
		}

		// 获取openId后调用统一支付接口https://api.mch.weixin.qq.com/pay/unifiedorder
		String currTime = CommonUtil.getCurrTime();
		// 8位日期
		String strTime = currTime.substring(8, currTime.length());
		// 四位随机数
		String strRandom = CommonUtil.buildRandom(4) + "";
		// 10位序列号,可以自行调整。
		String strReq = strTime + strRandom;

		// 商户号
		String mch_id = partner;
		// 子商户号 非必输
		// String sub_mch_id="";
		// 设备号 非必输
		String device_info = "";
		// 随机数
		String nonce_str = strReq;
		// 商品描述
		// String body = describe;

		// 商品描述根据情况修改
		String body = describe;
		// 附加数据
		String attach = userId;
		// 商户订单号
		String out_trade_no = orderNo;
		int intMoney = Integer.parseInt(finalmoney);

		// 总金额以分为单位，不带小数点
		int total_fee = intMoney;
		// 订单生成的机器 IP
		String spbill_create_ip = request.getRemoteAddr();
		// 订 单 生 成 时 间 非必输
		// String time_start ="";
		// 订单失效时间 非必输
		// String time_expire = "";
		// 商品标记 非必输
		// String goods_tag = "";

		// 这里notify_url是 支付完成后微信发给该链接信息，可以判断会员是否支付成功，改变订单状态等。
		String notify_url = WeChatConfiguration.NOTIFY_URL;
		String trade_type = "JSAPI";
		String openid = openId;
		// 非必输
		// String product_id = "";
		SortedMap<String, String> packageParams = new TreeMap<String, String>();
		packageParams.put("appid", appid);
		packageParams.put("mch_id", mch_id);
		packageParams.put("nonce_str", nonce_str);
		packageParams.put("body", body);
		packageParams.put("attach", attach);
		packageParams.put("out_trade_no", out_trade_no);
		// 这里写的金额为1 分到时修改
		packageParams.put("total_fee", String.valueOf(total_fee));
		// packageParams.put("total_fee", "finalmoney");
		packageParams.put("spbill_create_ip", spbill_create_ip);
		packageParams.put("notify_url", notify_url);
		packageParams.put("trade_type", trade_type);
		packageParams.put("openid", openid);

		RequestHandler reqHandler = new RequestHandler(request, response);
		reqHandler.init(appid, appsecret, partnerkey);

		String sign = reqHandler.createSign(packageParams);
		String xml = "<xml>" + "<appid>" + appid + "</appid>" + "<mch_id>"
				+ mch_id + "</mch_id>" + "<nonce_str>" + nonce_str
				+ "</nonce_str>" + "<sign>" + sign + "</sign>"
				+ "<body>" + body + "</body>" + "<attach>" + attach
				+ "</attach>" + "<out_trade_no>" + out_trade_no
				+ "</out_trade_no>" + "<attach>"
				+ attach
				+ "</attach>"
				+
				// 金额，这里写的1 分到时修改
				"<total_fee>"
				+ total_fee
				+ "</total_fee>"
				+
				// "<total_fee>"+finalmoney+"</total_fee>"+
				"<spbill_create_ip>" + spbill_create_ip + "</spbill_create_ip>"
				+ "<notify_url>" + notify_url + "</notify_url>"
				+ "<trade_type>" + trade_type + "</trade_type>" + "<openid>"
				+ openid + "</openid>" + "</xml>";
//		System.out.println(xml);
		String allParameters = "";
		try {
			allParameters = reqHandler.genPackage(packageParams);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		String createOrderURL = WeChatConfiguration.UNIFIED_ORDER_URL;//"https://api.mch.weixin.qq.com/pay/unifiedorder";
		Map<String, Object> dataMap2 = new HashMap<String, Object>();
		String prepay_id = "";
		try {
			prepay_id = new GetWxOrderno().getPayNo(createOrderURL, xml);
			System.out.println("prepay_id:" + prepay_id);
			System.out.println("orderNo:" + orderNo);
			if (prepay_id.equals("")) {
				model.addAttribute("ErrorMsg", "统一支付接口获取预支付订单出错！");
				return "redirect:/wxpay/payerror.jsp";
			}
		} catch (Exception e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		SortedMap<String, String> finalpackage = new TreeMap<String, String>();
		String appid2 = appid;
		String timestamp = SHA1Util.getTimeStamp();
		String nonceStr2 = nonce_str;
		String prepay_id2 = "prepay_id=" + prepay_id;
		String packages = prepay_id2;
		finalpackage.put("appId", appid2);
		finalpackage.put("timeStamp", timestamp);
		finalpackage.put("nonceStr", nonceStr2);
		finalpackage.put("package", packages);
		finalpackage.put("signType", "MD5");
		String finalsign = reqHandler.createSign(finalpackage);
		return "redirect:/wxpay/pay.jsp?appid=" + appid2 + "&timeStamp=" + timestamp + "&nonceStr=" + nonceStr2 + "&package=" + packages + "&sign=" + finalsign;
	}

	@RequestMapping("/notify")
	public void notify(Model model, HttpServletRequest request,
			HttpServletResponse response, String appid) throws Exception {
		String inputLine;
		String notityXml = "";
		String resXml = "";
		try {
			while ((inputLine = request.getReader().readLine()) != null) {
				notityXml += inputLine;
			}
			request.getReader().close();
		} catch (Exception e) {
			e.printStackTrace();
		}
//		System.out.println("接收到的报文：" + notityXml);
		Map m = XMLUtil.doXMLParse(notityXml);
		WeChatPayResult wpr = new WeChatPayResult();
		wpr.setAppid(m.get("appid").toString());
		wpr.setBankType(m.get("bank_type").toString());
		wpr.setCashFee(Integer.parseInt(m.get("cash_fee").toString()));
		wpr.setFeeType(m.get("fee_type").toString());
		wpr.setIsSubscribe(m.get("is_subscribe").toString());
		wpr.setMchId(m.get("mch_id").toString());
		wpr.setNonceStr(m.get("nonce_str").toString());
		wpr.setOpenid(m.get("openid").toString());
		wpr.setOutTradeNo(m.get("out_trade_no").toString());
		wpr.setResultCode(m.get("result_code").toString());
		wpr.setReturnCode(m.get("return_code").toString());
		wpr.setSign(m.get("sign").toString());
		wpr.setTimeEnd(m.get("time_end").toString());
		wpr.setTotalFee(Integer.parseInt(m.get("total_fee").toString()));
		wpr.setTradeType(m.get("trade_type").toString());
		wpr.setTransactionId(m.get("transaction_id").toString());
		if ("SUCCESS".equals(wpr.getResultCode())) {
			// 支付成功
			resXml = "<xml>" + "<return_code><![CDATA[SUCCESS]]></return_code>"
					+ "<return_msg><![CDATA[OK]]></return_msg>" + "</xml> ";
		} else {
			resXml = "<xml>" + "<return_code><![CDATA[FAIL]]></return_code>"
					+ "<return_msg><![CDATA[报文为空]]></return_msg>" + "</xml> ";
		}
//		System.out.println("微信支付回调数据结束");
		BufferedOutputStream out = new BufferedOutputStream(response.getOutputStream());
		out.write(resXml.getBytes());
		out.flush();
		out.close();
	}

	@RequestMapping("refund")
	public void refund(HttpServletResponse response,String out_trade_no,Double total_fee1,Double refund_fee1) throws SDKRuntimeException {
//		total_fee1 = 1d;
//		refund_fee1 = 1d;
//		out_trade_no = "1728854433046528";
		total_fee1 = total_fee1/100;
		refund_fee1 = refund_fee1/100;
		String out_refund_no = UtilString.getUUID();// 退款单号，随机生成 ，但长度应该跟文档一样（32位）(卖家信息校验不一致，请核实后再试)
		int total_fee = (int) (total_fee1*100);//订单的总金额,以分为单位（填错了貌似提示：同一个out_refund_no退款金额要一致）
		int refund_fee = (int) (refund_fee1*100);;// 退款金额，以分为单位（填错了貌似提示：同一个out_refund_no退款金额要一致）
		String nonce_str = CommonUtil.buildRandom(4) + "";// 随机字符串
		//微信公众平台文档：“基本配置”--》“开发者ID”
		String appid = WeChatConfiguration.appId;
		//微信公众平台文档：“基本配置”--》“开发者ID”
		String appsecret = WeChatConfiguration.appSecret;
		//商户号
		//微信公众平台文档：“微信支付”--》“商户信息”--》“商户号”，将该值赋值给partner
		String mch_id = WeChatConfiguration.MCH_ID;
		String op_user_id = mch_id;//就是MCHID
		//微信公众平台："微信支付"--》“商户信息”--》“微信支付商户平台”（登录）--》“API安全”--》“API密钥”--“设置密钥”（设置之后的那个值就是partnerkey，32位）
		String partnerkey = WeChatConfiguration.API_KEY;
		RequestHandler reqHandler = new RequestHandler(null, null);
		reqHandler.init(appid, appsecret, partnerkey);
		String xml = ClientCustomSSL.RefundNativePackage(out_trade_no, out_refund_no, String.valueOf(total_fee), String.valueOf(refund_fee), nonce_str,reqHandler);
		String createOrderURL = WeChatConfiguration.REFUND_URL;//"https://api.mch.weixin.qq.com/secapi/pay/refund";
		try {
			String refundResult= ClientCustomSSL.doRefund(createOrderURL, xml);
			System.out.println("退款产生的json字符串："+ refundResult);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public void refundQuery(){
		
	}
}
