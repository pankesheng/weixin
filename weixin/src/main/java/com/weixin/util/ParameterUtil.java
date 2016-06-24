package com.weixin.util;

/**
 * @ClassName: ParameterUtil
 * @Description: 常量类
 * @author Administrator
 * @date 2015-12-23
 */
public class ParameterUtil {
	// 与开发模式接口配置信息中的Token保持一致
	public static String token = "sheng";
	// 用户标识֤
	public static String appId = "wx4beaf827cc97a96d";
	// 用户标识密钥
	public static String appSecret = "f7f6b851edb551403b9bf66e1f41297b";
	
	
	public final static String MCH_ID = "";//商户号
	public final static String API_KEY = "";//API密钥
	public final static String SIGN_TYPE = "MD5";//签名加密方式
	public final static String CERT_PATH = "D:/apiclient_cert.p12";//微信支付证书存放路径地址
	//微信支付统一接口的回调action
	public final static String NOTIFY_URL = "http://14.117.25.80:8016/wxweb/config/pay!paySuccess.action";
	//微信支付成功支付后跳转的地址
	public final static String SUCCESS_URL = "http://14.117.25.80:8016/wxweb/contents/config/pay_success.jsp";
	//oauth2授权时回调action
	public final static String REDIRECT_URI = "http://14.117.25.80:8016/GoMyTrip/a.jsp?port=8016";
	/**
	 * 微信基础接口地址
	 */
	 //获取token接口(GET)
	 public final static String TOKEN_URL = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET";
	 //oauth2授权接口(GET)
	 public final static String OAUTH2_URL = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code";
	 //刷新access_token接口（GET）
	 public final static String REFRESH_TOKEN_URL = "https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=APPID&grant_type=refresh_token&refresh_token=REFRESH_TOKEN";
	// 菜单创建接口（POST）
	 public final static String MENU_CREATE_URL = "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=ACCESS_TOKEN";
	// 菜单查询（GET）
	 public final static String MENU_GET_URL = "https://api.weixin.qq.com/cgi-bin/menu/get?access_token=ACCESS_TOKEN";
	// 菜单删除（GET）
	public final static String MENU_DELETE_URL = "https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=ACCESS_TOKEN";
	/**
	 * 微信支付接口地址
	 */
	//微信支付统一接口(POST)
	public final static String UNIFIED_ORDER_URL = "https://api.mch.weixin.qq.com/pay/unifiedorder";
	//微信退款接口(POST)
	public final static String REFUND_URL = "https://api.mch.weixin.qq.com/secapi/pay/refund";
	//订单查询接口(POST)
	public final static String CHECK_ORDER_URL = "https://api.mch.weixin.qq.com/pay/orderquery";
	//关闭订单接口(POST)
	public final static String CLOSE_ORDER_URL = "https://api.mch.weixin.qq.com/pay/closeorder";
	//退款查询接口(POST)
	public final static String CHECK_REFUND_URL = "https://api.mch.weixin.qq.com/pay/refundquery";
	//对账单接口(POST)
	public final static String DOWNLOAD_BILL_URL = "https://api.mch.weixin.qq.com/pay/downloadbill";
	//短链接转换接口(POST)
	public final static String SHORT_URL = "https://api.mch.weixin.qq.com/tools/shorturl";
	//接口调用上报接口(POST)
	public final static String REPORT_URL = "https://api.mch.weixin.qq.com/payitil/report";
	
	
	
	// 测试账户关注微信号 
	public static String focusedAppId="orAn7t3lAMl4PMYkYqC0dcObA-Qk";
	//BAE mysql 数据库名
	public static String dbName="YgisbLsPKqqhUTCDUPUV";
	//数据库驱动
	public static String driver="com.mysql.jdbc.Driver";
	//BAE上mysql数据库地址
	public static String host="sqld.duapp.com";
	//BAE上mysql固定端口号
	public static String port="4050";
	//BAE API KEY
	public static String apiKey="f4a60048526046e2a48102e95b6bc2ea";
	//BAE Secret Key
	public static String secretKey="a173a7a750024731bc37f1f353bdfced";
	
}
