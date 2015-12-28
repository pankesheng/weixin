package com.weixin.listener;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import com.weixin.common.Configuration;

public class ApplicationListener implements ServletContextListener {

//	private WebApplicationContext wac = null;
//	private CatalogService catalogService = null;

	public void contextInitialized(ServletContextEvent sce) {
//		wac = WebApplicationContextUtils.getWebApplicationContext(sce.getServletContext());
//		catalogService = (CatalogService) wac.getBean("catalogService");
	
		Configuration.setRealPath(sce.getServletContext().getRealPath(""));
	}

	public void contextDestroyed(ServletContextEvent sce) {
		
	}
	
}