package com.weixin.main;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.weixin.pojo.AccessToken;
import com.weixin.pojo.Button;
import com.weixin.pojo.ComplexButton;
import com.weixin.pojo.Menu;
import com.weixin.pojo.ViewButton;
import com.weixin.util.WeixinUtil;

public class MenuManager {
	 private static Logger log = LoggerFactory.getLogger(MenuManager.class);  
	  
	    public static void main(String[] args) {  
	        // 第三方用户唯一凭证  
	        String appId = "wx4beaf827cc97a96d";  
	        // 第三方用户唯一凭证密钥  
	        String appSecret = "f7f6b851edb551403b9bf66e1f41297b";  
	  
	        // 调用接口获取access_token  
	        AccessToken at = WeixinUtil.getAccessToken(appId, appSecret);  
	  
	        if (null != at) {  
	            // 调用接口创建菜单  
	            int result = WeixinUtil.createMenu(getMenu(), at.getToken());  
	  
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
	        
	        ViewButton baidu = new ViewButton("百度","http://www.baidu.com/");

	        ViewButton sina = new ViewButton("新浪","http://www.sina.com.cn/");
	        
	        ViewButton wy = new ViewButton("网易","http://www.163.com/");
	        
	        ComplexButton cylj = new ComplexButton("常用链接",new Button[]{baidu,sina,wy});

	        
	        ViewButton tqyb = new ViewButton("天气预报", "http://weather.news.sina.com.cn/");
	        
	        ComplexButton shzsbtn = new ComplexButton("生活助手",new Button[] {tqyb });  

	        
	        ViewButton wzgj = new ViewButton("温州公交","http://wenzhou.8684.cn/");
	        
	        ComplexButton gjcxbtn = new ComplexButton("公交查询",new Button[]{wzgj});
	        
	        /** 
	         * 在某个一级菜单下没有二级菜单的情况，menu该如何定义呢？<br> 
	         * 比如，第三个一级菜单项不是“更多体验”，而直接是“幽默笑话”，那么menu应该这样定义：<br> 
	         * menu.setButton(new Button[] { mainBtn1, mainBtn2, btn33 }); 
	         */  
	        Menu menu = new Menu();  
	        menu.setButton(new Button[] { cylj,shzsbtn,gjcxbtn}); 	  
	        return menu;  
	    }  
}
