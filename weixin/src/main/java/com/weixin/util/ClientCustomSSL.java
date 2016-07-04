package com.weixin.util;

import java.io.File;
import java.io.FileInputStream;
import java.security.KeyStore;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.SortedMap;
import java.util.TreeMap;

import javax.net.ssl.SSLContext;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.SSLContexts;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import com.weixin.configuration.WeChatConfiguration;

/**
 * This example demonstrates how to create secure connections with a custom SSL
 * context.
 */
public class ClientCustomSSL {
	public static String GetBizSign(HashMap<String, String> bizObj)
			throws SDKRuntimeException {
		HashMap<String, String> bizParameters = new HashMap<String, String>();

		List<Map.Entry<String, String>> infoIds = new ArrayList<Map.Entry<String, String>>(
				bizObj.entrySet());
		System.out.println(infoIds);
		Collections.sort(infoIds, new Comparator<Map.Entry<String, String>>() {
			public int compare(Map.Entry<String, String> o1,
					Map.Entry<String, String> o2) {
				return (o1.getKey()).toString().compareTo(o2.getKey());
			}
		});
		System.out.println("--------------------");
		System.out.println(infoIds);
		for (int i = 0; i < infoIds.size(); i++) {
			Map.Entry<String, String> item = infoIds.get(i);
			if (item.getKey() != "") {
				bizParameters.put(item.getKey().toLowerCase(), item.getValue());
			}
		}
		// bizParameters.put("key", "12345678123456781234567812345671");
		String bizString = CommonUtil.FormatBizQueryParaMap(bizParameters,
				false);
		bizString += "&key=12345678123456781234567812345671";
		System.out.println("***************");

		System.out.println(bizString);

		// return SHA1Util.Sha1(bizString);
		return MD5Util.MD5Encode(bizString, "UTF-8");

	}

	/**
	 * 微信创建订单
	 * 
	 * @param nonceStr
	 * @param orderDescribe
	 * @param orderNo
	 * @param price
	 * @param timeStart
	 * @param timeExpire
	 * @return
	 * @throws SDKRuntimeException
	 */
	public static String CreateNativePackage(String nonceStr,
			String orderDescribe, String orderNo, String price,
			String timeStart, String timeExpire, RequestHandler reqHandler) throws SDKRuntimeException {
		SortedMap<String, String> nativeObj = new TreeMap<String, String>();
		nativeObj.put("appid", WeChatConfiguration.appId); // 公众账号Id
		nativeObj.put("mch_id",WeChatConfiguration.MCH_ID); // 商户号
		nativeObj.put("nonce_str", nonceStr); // 随机字符串
		nativeObj.put("body", orderDescribe); // 商品描述
		nativeObj.put("attach", "tradeno"); // 附加数据
		nativeObj.put("out_trade_no", orderNo); // 商户订单号(全局唯一)
		nativeObj.put("total_fee", price); // 总金额(单位为分，不能带小数点)
		nativeObj.put("spbill_create_ip", "192.168.0.144"); // 终端Ip
		nativeObj.put("time_start", timeStart); // 交易起始时间
		nativeObj.put("time_expire", timeExpire); // 交易结束时间
		nativeObj.put("notify_url",WeChatConfiguration.NOTIFY_URL); // 回调通知地址
		nativeObj.put("trade_type", "NATIVE"); // 交易类型

		String sign = reqHandler.createSign(nativeObj);

		nativeObj.put("sign", sign.toUpperCase());

		return CommonUtil.ArrayToXml(nativeObj);
	}

	/**
	 * 微信订单支付查询
	 * 
	 * @param nonceStr
	 * @param orderDescribe
	 * @param orderNo
	 * @param price
	 * @param timeStart
	 * @param timeExpire
	 * @return
	 * @throws SDKRuntimeException
	 */
	public static String SearchNativePackage(String transactionId,
			String outTradeNo, String nonceStr, RequestHandler reqHandler) throws SDKRuntimeException {
		SortedMap<String, String> nativeObj = new TreeMap<String, String>();
		nativeObj.put("appid", WeChatConfiguration.appId); // 公众账号Id
		nativeObj.put("mch_id", WeChatConfiguration.MCH_ID);// 商户号
		nativeObj.put("nonce_str", nonceStr);// 随机字符串
		if (transactionId != null && !"".equals(transactionId)) {
			nativeObj.put("transaction_id", transactionId);
		}
		if (outTradeNo != null && !"".equals(outTradeNo)) {
			nativeObj.put("out_trade_no", outTradeNo);// 随机字符串
		}
		String sign = reqHandler.createSign(nativeObj);
		nativeObj.put("sign", sign.toUpperCase());
		return CommonUtil.ArrayToXml(nativeObj);
	}

	/**
	 * 微信退款
	 * 
	 * @param outTradeNo
	 * @param outRefundNo
	 * @param totalFee
	 * @param refundFee
	 * @param reqHandler 
	 * @return
	 * @throws SDKRuntimeException
	 */
	public static String RefundNativePackage(String outTradeNo,
			String outRefundNo, String totalFee, String refundFee,
			String nonceStr, RequestHandler reqHandler) throws SDKRuntimeException {
		SortedMap<String, String> nativeObj = new TreeMap<String, String>();
		nativeObj.put("appid", WeChatConfiguration.appId);// 公众账号Id
		nativeObj.put("mch_id", WeChatConfiguration.MCH_ID);// 商户号
		nativeObj.put("nonce_str", nonceStr);// 随机字符串
		nativeObj.put("out_trade_no", outTradeNo);// 商户订单号(全局唯一)
		nativeObj.put("out_refund_no", outRefundNo);// 商户退款单号(全局唯一)
		nativeObj.put("total_fee", totalFee);// 总金额(单位为分，不能带小数点)
		nativeObj.put("refund_fee", refundFee);// 退款金额(单位为分，不能带小数点)
		nativeObj.put("op_user_id", WeChatConfiguration.MCH_ID);
		String sign = reqHandler.createSign(nativeObj);
		nativeObj.put("sign", sign.toUpperCase());
		return CommonUtil.ArrayToXml(nativeObj);
	}

	/**
	 * 微信待支付
	 * 
	 * @param nonceStr
	 * @param orderDescribe
	 * @param orderNo
	 * @param price
	 * @param timeStart
	 * @param timeExpire
	 * @return
	 * @throws SDKRuntimeException
	 */
	public static String CreateJsApiPackage(String nonceStr,String orderDescribe,String orderNo,String price,String timeStart,String timeExpire,String openId, RequestHandler reqHandler) throws SDKRuntimeException {  
		SortedMap<String, String> nativeObj = new TreeMap<String, String>();
		nativeObj.put("appid", WeChatConfiguration.appId);//公众账号Id  
		nativeObj.put("openid", openId);//公众账号Id  
		nativeObj.put("mch_id", WeChatConfiguration.MCH_ID);//商户号  
		nativeObj.put("nonce_str", nonceStr);//随机字符串  
		nativeObj.put("body", orderDescribe);//商品描述  
		nativeObj.put("attach", "tradeno");//附加数据  
		nativeObj.put("out_trade_no", orderNo);//商户订单号(全局唯一)  
		nativeObj.put("total_fee", price);//总金额(单位为分，不能带小数点)  
		nativeObj.put("spbill_create_ip","192.168.0.144");//终端Ip  
		nativeObj.put("time_start", timeStart);//交易起始时间  
		nativeObj.put("time_expire", timeExpire);//交易结束时间  
		nativeObj.put("notify_url",WeChatConfiguration.NOTIFY_URL);//通知地址  
		nativeObj.put("trade_type", "JSAPI");//交易类型  
		String sign = reqHandler.createSign(nativeObj);
		nativeObj.put("sign", sign.toUpperCase());  
		return CommonUtil.ArrayToXml(nativeObj);  
	}
	/**
	 * 微信关闭订单
	 * 
	 * @param nonceStr
	 * @param orderDescribe
	 * @param orderNo
	 * @param price
	 * @param timeStart
	 * @param timeExpire
	 * @param openId
	 * @return
	 * @throws SDKRuntimeException
	 */
	public static String CreateCloseOrder(String outTradeNo, String nonceStr, RequestHandler reqHandler)
			throws SDKRuntimeException {
		SortedMap<String, String> nativeObj = new TreeMap<String, String>();
		nativeObj.put("appid", WeChatConfiguration.appId);// 公众账号Id
		nativeObj.put("mch_id", WeChatConfiguration.MCH_ID);// 商户号
		nativeObj.put("out_trade_no", outTradeNo);// 商户订单号(全局唯一)
		nativeObj.put("nonce_str", nonceStr);// 随机字符串
		String sign = reqHandler.createSign(nativeObj);
		nativeObj.put("sign", sign.toUpperCase());
		return CommonUtil.ArrayToXml(nativeObj);
	}
	
	public static String doRefund(String url,String data) throws Exception {
        KeyStore keyStore  = KeyStore.getInstance("PKCS12");
        FileInputStream instream = new FileInputStream(new File(WeChatConfiguration.CERT_PATH));//P12文件目录
        try {
            keyStore.load(instream, WeChatConfiguration.MCH_ID.toCharArray());
        } finally {
            instream.close();
        }
        SSLContext sslcontext = SSLContexts.custom()
                .loadKeyMaterial(keyStore, WeChatConfiguration.MCH_ID.toCharArray())//这里也是写密码的
                .build();
        SSLConnectionSocketFactory sslsf = new SSLConnectionSocketFactory(
                sslcontext,
                new String[] { "TLSv1" },
                null,
                SSLConnectionSocketFactory.BROWSER_COMPATIBLE_HOSTNAME_VERIFIER);
        CloseableHttpClient httpclient = HttpClients.custom().setSSLSocketFactory(sslsf).build();
        try {
        	HttpPost httpost = new HttpPost(url); // 设置响应头信息
        	httpost.addHeader("Connection", "keep-alive");
        	httpost.addHeader("Accept", "*/*");
        	httpost.addHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        	httpost.addHeader("Host", "api.mch.weixin.qq.com");
        	httpost.addHeader("X-Requested-With", "XMLHttpRequest");
        	httpost.addHeader("Cache-Control", "max-age=0");
        	httpost.addHeader("User-Agent", "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0) ");
    		httpost.setEntity(new StringEntity(data, "UTF-8"));
            CloseableHttpResponse response = httpclient.execute(httpost);
            try {
                HttpEntity entity = response.getEntity();
                String jsonStr = EntityUtils.toString(response.getEntity(), "UTF-8");
                EntityUtils.consume(entity);
               return jsonStr;
            } finally {
                response.close();
            }
        } finally {
            httpclient.close();
        }
    }
	
}
