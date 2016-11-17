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
		private static Menu getMenu() {  
	        
	        ClickButton cb1 = new ClickButton("添加通讯录", "addtxl");
	        ClickButton cb2 = new ClickButton("查询通讯录", "showtxl");
	        ComplexButton cb = new ComplexButton("通讯录", new Button[]{cb1,cb2});
	        Menu menu = new Menu();  
	        menu.setButton(new Button[] {cb}); 	  
	        return menu;  
	    }  
}
