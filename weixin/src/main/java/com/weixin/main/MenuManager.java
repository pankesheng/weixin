package com.weixin.main;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.weixin.pojo.AccessToken;
import com.weixin.pojo.Button;
import com.weixin.pojo.CommonButton;
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
	        CommonButton btn11 = new CommonButton("天气预报","11");  
	  
	        CommonButton btn12 = new CommonButton("公交查询","12");  
	  
	        CommonButton btn13 = new CommonButton("周边搜索","13");  
	  
	        CommonButton btn14 = new CommonButton("历史上的今天","14");  
	  
	        CommonButton btn21 = new CommonButton("歌曲点播","21");  
	  
	        CommonButton btn22 = new CommonButton("经典游戏","22");  
	  
	        CommonButton btn23 = new CommonButton("美女电台","23");  
	  
	        CommonButton btn24 = new CommonButton("人脸识别","24");  
	  
	        CommonButton btn25 = new CommonButton("聊天唠嗑","25");  
	  
	        CommonButton btn31 = new CommonButton("Q友圈","31");  
	  
	        CommonButton btn32 = new CommonButton("电影排行榜","32");  
	  
	        CommonButton btn33 = new CommonButton("幽默笑话","33");  
	  
	        ViewButton baidubtn = new ViewButton("百度","http://www.baidu.com/");

	        ViewButton sinabtn = new ViewButton("新浪","http://www.sina.com.cn/");
	        
	        ViewButton wybtn = new ViewButton("网易","http://www.163.com/");
	        
	        ComplexButton urlbtn = new ComplexButton("常用链接",new Button[]{baidubtn,sinabtn,wybtn});
	        
	        ComplexButton mainBtn1 = new ComplexButton("生活助手",new Button[] {wybtn,btn11, btn12, btn13, btn14 });  
	  
	        
	        /** 
	         * 在某个一级菜单下没有二级菜单的情况，menu该如何定义呢？<br> 
	         * 比如，第三个一级菜单项不是“更多体验”，而直接是“幽默笑话”，那么menu应该这样定义：<br> 
	         * menu.setButton(new Button[] { mainBtn1, mainBtn2, btn33 }); 
	         */  
	        Menu menu = new Menu();  
	        menu.setButton(new Button[] { urlbtn}); 	  
	        return menu;  
	    }  
}
