package com.weixin.listener;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.weixin.common.Configuration;
import com.weixin.configuration.WeChatConfiguration;
import com.weixin.pojo.AccessToken;
import com.weixin.session.Session;
import com.weixin.session.SessionList;
import com.weixin.util.AccessTokenThread;
import com.weixin.util.AdvancedUtil;
import com.weixin.util.QuartzManager;

public class ApplicationListener implements ServletContextListener {
	private static Logger log = LoggerFactory
			.getLogger(ApplicationListener.class);
//	private WebApplicationContext wac = null;
//	private CatalogService catalogService = null;

	public void contextInitialized(ServletContextEvent sce) {
//		wac = WebApplicationContextUtils.getWebApplicationContext(sce.getServletContext());
//		catalogService = (CatalogService) wac.getBean("catalogService");
//		System.out.println(1);
//		AccessTokenThread.appid = WeChatConfiguration.appId;
//		AccessTokenThread.appsecret = WeChatConfiguration.appSecret;
//		log.info("weixin api appid:{}", AccessTokenThread.appid);
//		log.info("weixin api appsecret:{}", AccessTokenThread.appsecret);
//
//		// 未配置appid、appsecret时给出提示
//		if ("".equals(AccessTokenThread.appid)
//				|| "".equals(AccessTokenThread.appsecret)) {
//			log.error("appid and appsecret configuration error, please check carefully.");
//		} else {
//			// 启动定时获取access_token的线程
//			new Thread(new AccessTokenThread()).start();
//		}
//		Configuration.setRealPath(sce.getServletContext().getRealPath(""));
//		QuartzManager.addJob("accesstokenjob","com.weixin.session.AccesstokenJob", "0/70 * * * * ?");
		AdvancedUtil.getAccessToken();
		
	}

	public void contextDestroyed(ServletContextEvent sce) {
		
	}
	
}