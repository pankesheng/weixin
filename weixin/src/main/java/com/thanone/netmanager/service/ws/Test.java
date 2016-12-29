package com.thanone.netmanager.service.ws;

import net.sf.json.JSONObject;

import org.apache.cxf.jaxws.JaxWsProxyFactoryBean;

public class Test {
	public static void main(String[] args) {
		JaxWsProxyFactoryBean fac = new JaxWsProxyFactoryBean();
		fac.setServiceClass(OhwgWebService.class);
		fac.setAddress("http://192.168.1.158:8082/netmanager/ohwg/User?wsdl");
		OhwgWebService ms = (OhwgWebService) fac.create();
		String result = ms.getToken("sxf2", "123456");
		System.out.println(result);
		JSONObject jsonObject = JSONObject.fromObject(result);
		String token = null;
		if(1==jsonObject.getInt("s")){
			jsonObject = JSONObject.fromObject(jsonObject.getString("d"));
			token = jsonObject.getString("token");
		}
		System.out.println(token);
		result = ms.check(token,"admin", "ohedu123456");
		System.out.println(result);
		jsonObject = JSONObject.fromObject(result);
		if(1 == Integer.parseInt(jsonObject.get("s").toString())){
			Long userId = Long.parseLong(jsonObject.get("d").toString());
			System.out.println("userId:"+userId);
			result = ms.telAcOn("123123",userId, "f2-s6-ge-g9-e9-f5", "192.168.1.158", "啊实打实大声道");
			result = ms.telAcOn("12412412",userId, "f5-e6-g9-s2-f3", "192.168.1.157", "啊实打实大");
			
			
			
			
//			jsonObject = JSONObject.fromObject(result);
//			if(1 == Integer.parseInt(jsonObject.get("s").toString())){
//				Long recordId = Long.parseLong(jsonObject.get("d").toString());
//				System.out.println("recordId:"+recordId);
//				result = ms.telCnsOn(recordId);
//				System.out.println(result);
//				result = ms.telCnsOff(recordId);
//				System.out.println(result);
//				result = ms.telAcOff(recordId);
//				System.out.println(result);
//				
//			}
		}
	}
}
