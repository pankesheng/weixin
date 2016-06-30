package com.weixin.util;

import java.util.List;

import org.apache.cxf.jaxws.JaxWsProxyFactoryBean;

import cn.com.webxml.ArrayOfString;
import cn.com.webxml.WeatherWebServiceSoap;


public class WebService {
	public static void main(String[] args) {
		JaxWsProxyFactoryBean fac = new JaxWsProxyFactoryBean();
		fac.setServiceClass(WeatherWebServiceSoap.class);
		fac.setAddress("http://www.webxml.com.cn/WebServices/WeatherWebService.asmx?wsdl");
		WeatherWebServiceSoap ms = (WeatherWebServiceSoap) fac.create();
		ArrayOfString a = ms.getSupportCity("浙江");
		List<String> list = a.getString();
		for (String string : list) {
			System.out.println(string);
		}
		a = ms.getSupportProvince();
		list = a.getString();
		for (String string : list) {
			System.out.println(string);
		}
	}
}
