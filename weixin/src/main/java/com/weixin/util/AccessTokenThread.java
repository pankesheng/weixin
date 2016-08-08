package com.weixin.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.weixin.configuration.WeChatConfiguration;
import com.weixin.pojo.AccessToken;

public class AccessTokenThread implements Runnable{

	 private static Logger log = LoggerFactory.getLogger(AccessTokenThread.class);  
	    // 第三方用户唯一凭证  
	    public static String appid = "";  
	    // 第三方用户唯一凭证密钥  
	    public static String appsecret = "";  
	  
	    public void run() {  
	        while (true) {  
	            try {  
		            AccessToken accessToken = AdvancedUtil.getAccessToken(appid, appsecret);  
	                if (null != accessToken) {  
	                	WeChatConfiguration.accessToken = accessToken;
	                    System.out.println(WeChatConfiguration.accessToken.getAccess_token());
	                	log.info("获取access_token成功，有效时长{}秒 token:{}", accessToken.getExpires_in(), accessToken.getAccess_token());  
	                    // 休眠6500秒  
	                    Thread.sleep((accessToken.getExpires_in() - 700) * 1000);  
	                } else {  
	                    // 如果access_token为null，60秒后再获取  
	                    Thread.sleep(60 * 1000);  
	                }  
	            } catch (InterruptedException e) {  
	                try {  
	                    Thread.sleep(60 * 1000);  
	                } catch (InterruptedException e1) {  
	                    log.error("{}", e1);  
	                }  
	                log.error("{}", e);  
	            }  
	        }  
	    }  
}
