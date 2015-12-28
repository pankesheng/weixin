package com.weixin.common;

public class Configuration {

	private static String contextPath;

	// 通过ApplicationListener初始化
	private static String realPath;

	public static String getContextPath() {
		return contextPath;
	}

	public static void setContextPath(String contextPath) {
		Configuration.contextPath = contextPath;
	}

	public static String getRealPath() {
		return realPath;
	}

	public static void setRealPath(String realPath) {
		Configuration.realPath = realPath;
	}

}
