package com.thanone.netmanager.service.ws;

import org.apache.cxf.jaxws.JaxWsProxyFactoryBean;

public class Test {
	public static void main(String[] args) {
		JaxWsProxyFactoryBean fac = new JaxWsProxyFactoryBean();
		fac.setServiceClass(OhwgWebService.class);
		fac.setAddress("http://192.168.1.158:8080/netmanager/ohwg/User?wsdl");
		OhwgWebService ms = (OhwgWebService) fac.create();
		String result = ms.check("admin", "ohedu123456");
		System.out.println(result);
	}
}
