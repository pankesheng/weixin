package com.weixin.configuration;

import com.weixin.pojo.AccessToken;

/**
 * @ClassName: ParameterUtil
 * @Description: 常量类
 * @author Administrator
 * @date 2015-12-23
 */
public class WeChatConfiguration {
	// 与开发模式接口配置信息中的Token保持一致
	public static String token = "sheng";
	// 用户标识֤
	public static String appId = "wx4beaf827cc97a96d";
	// 用户标识密钥
	public static String appSecret = "f7f6b851edb551403b9bf66e1f41297b";
	//储存接口令牌 accessToken 由于accesstoken每天只能获取2000次，为了节省次数在项目启动的时候获取一次存储下来在即将失效的时候重新获取
	public static AccessToken accessToken ;
	
	public final static String MCH_ID = "12412412412";//商户号
	public final static String API_KEY = "4532452345";//API密钥
	public final static String SIGN_TYPE = "SHA1";//签名加密方式
	public final static String CERT_PATH = "D:/apiclient_cert.p12";//微信支付证书存放路径地址
	//微信支付统一接口的回调action
	public final static String NOTIFY_URL = "http://pweixin.tunnel.qydev.com/weixin/wxpay/notify.ajax";
	//真实域名
	public final static String DOMAIN_URL = "http://pweixin.tunnel.qydev.com/weixin";
	
	public final static String PAY_ACTION = "http://pweixin.tunnel.qydev.com/weixin/wxpay/topay.ajax";
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
	
	/**
	 * 客服相关
	 */
	//获取在线客服列表信息(GET)
	public final static String KF_ONLINE_LIST_URL = "https://api.weixin.qq.com/cgi-bin/customservice/getonlinekflist?access_token=ACCESS_TOKEN";
	//获取所有客服账号(GET)
	public final static String KF_ALL_URL = "https://api.weixin.qq.com/cgi-bin/customservice/getkflist?access_token=ACCESS_TOKEN";
	//添加客服账号(POST)
	public final static String KF_ADD_URL = "https://api.weixin.qq.com/customservice/kfaccount/add?access_token=ACCESS_TOKEN";
	//修改客服账号(POST)
	public final static String KF_UPDATE_URL = "https://api.weixin.qq.com/customservice/kfaccount/update?access_token=ACCESS_TOKEN";
	//删除客服账号(GET)
	public final static String KF_DELETE_URL = "https://api.weixin.qq.com/customservice/kfaccount/del?access_token=ACCESS_TOKEN";
	//设置客服头像(POST/FORM)
	public final static String KF_UPLOADHEADIMG_URL = "http://api.weixin.qq.com/customservice/kfaccount/uploadheadimg?access_token=ACCESS_TOKEN&kf_account=KFACCOUNT";
	//发送客服消息(POST)
	public final static String KF_MESSAGE_CUSTOM_SEND_URL = "https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=ACCESS_TOKEN";
	
	//发送模板消息
	public final static String TEMP_SEND_URL = "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=ACCESS_TOKEN";

	/**
	 *  用户相关
	 */
	//获取用户列表信息(GET)  默认从头开始拉取 每次最多10000条，在获取下一批的时候 添加参数&next_openid=NEXT_OPENID 
	public final static String USER_LIST_URL = "https://api.weixin.qq.com/cgi-bin/user/get?access_token=ACCESS_TOKEN";
	
	
	
	
}
