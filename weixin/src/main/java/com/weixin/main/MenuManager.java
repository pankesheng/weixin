package com.weixin.main;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.weixin.configuration.WeChatConfiguration;
import com.weixin.menu.Button;
import com.weixin.menu.ClickButton;
import com.weixin.menu.ComplexButton;
import com.weixin.menu.Menu;
import com.weixin.menu.ViewButton;
import com.weixin.pojo.AccessToken;
import com.weixin.util.AdvancedUtil;
import com.weixin.util.MenuUtil;

public class MenuManager {
	 private static Logger log = LoggerFactory.getLogger(MenuManager.class);  
	  
	    public static void main(String[] args) {  
	        // 第三方用户唯一凭证  
	        String appId = WeChatConfiguration.appId;  
	        // 第三方用户唯一凭证密钥  
	        String appSecret = WeChatConfiguration.appSecret;  
	  
	        // 调用接口获取access_token  
	        AccessToken at = AdvancedUtil.getAccessToken(appId, appSecret);  
	  
	        if (null != at) {  
	            // 调用接口创建菜单  
	            int result = MenuUtil.createMenu(getMenu(), at.getAccess_token());  
	  
	            // 判断菜单创建结果  
	            if (0 == result)  {
	            	System.out.println("菜单创建成功！");
	                log.info("菜单创建成功！");  
	            }
	            else {
	            	System.out.println("菜单创建失败，错误码：" + result);
	                log.info("菜单创建失败，错误码：" + result);  
	            }
	        }  
	    }  
	  
	    /** 
	     * 组装菜单数据 
	     *  
	     * @return 
	     */  
	    @SuppressWarnings("unused")
		private static Menu getMenu() {  
	        
//	    	appid	是	公众号的唯一标识
//	    	redirect_uri	是	授权后重定向的回调链接地址
//	    	response_type	是	返回类型，请填写code
//	    	scope	是	应用授权作用域，snsapi_base （不弹出授权页面，直接跳转，只能获取用户openid），snsapi_userinfo （弹出授权页面，可通过openid拿到昵称、性别、所在地。并且，即使在未关注的情况下，只要用户授权，也能获取其信息）
//	    	state	否	重定向后会带上state参数，开发者可以填写任意参数值
//	    	#wechat_redirect	否	直接在微信打开链接，可以不填此参数。做页面302重定向时候，必须带此参数
	        ViewButton tqyb = new ViewButton("天气预报", "http://weather.news.sina.com.cn/");

	        ViewButton baidubtn = new ViewButton("百度","http://www.baidu.com");
	        ViewButton paymainbtn = new ViewButton("测试支付",WeChatConfiguration.DOMAIN_URL+"/wxpay/paymain.ajax");
	    	String redirect_uri = WeChatConfiguration.DOMAIN_URL+"/wxpay/oauth2.ajax";//  : -> %3A      / -> %2F
	    	
	    	ViewButton getUserInfoBtn = new ViewButton("测试授权","https://open.weixin.qq.com/connect/oauth2/authorize?appid="+WeChatConfiguration.appId+"&redirect_uri="+redirect_uri.replaceAll(":", "%3A").replaceAll("/", "%2F")+"&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect");
	    	ViewButton refundbtn = new ViewButton("测试退款",(WeChatConfiguration.DOMAIN_URL+"/wxpay/refund.ajax").replaceAll(":", "%3A").replaceAll("/", "%2F"));
	    	ViewButton testbtn = new ViewButton("测试入口",(WeChatConfiguration.DOMAIN_URL+"/wxpay/test/index.ajax").replaceAll(":", "%3A").replaceAll("/", "%2F"));

	        ComplexButton shzsbtn = new ComplexButton("生活助手",new Button[] {tqyb });  
	        ComplexButton cb = new ComplexButton("测试功能", new Button[]{getUserInfoBtn,paymainbtn});
	        
	        ComplexButton kfComplexButton = new ComplexButton("在线客服",new Button[]{new ClickButton("在线客服", "zxkf")});
	        
	        Menu menu = new Menu();  
	        menu.setButton(new Button[] {kfComplexButton }); 	  
	        return menu;  
	    }  
}
