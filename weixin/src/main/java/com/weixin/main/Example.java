package com.weixin.main;

import com.weixin.util.CommonUtil;
import com.weixin.util.ParameterUtil;
import com.weixin.util.WxPayHelper;

public class Example {
	 public static void main(String args[]) {
		try {
			WxPayHelper wxPayHelper = new WxPayHelper();
			//先设置基本信息
			wxPayHelper.SetAppId(ParameterUtil.appId);
			wxPayHelper.SetAppKey("2Wozy2aksie1puXUBpWD8oZxiD1DfQuEaiC7KcRATv1Ino3mdopKaPGQQ7TtkNySuAmCaDCrw4xhPY5qKTBl7Fzm0RgR3c0WaVYIXZARsxzHV2x7iwPPzOz94dnwPWSn");
			wxPayHelper.SetPartnerKey(ParameterUtil.API_KEY);
			wxPayHelper.SetSignType(ParameterUtil.SIGN_TYPE);
			//设置请求package信息      下附注释：
			wxPayHelper.SetParameter("bank_type", "WX");
			wxPayHelper.SetParameter("body", "商品描述");
			wxPayHelper.SetParameter("partner",ParameterUtil.MCH_ID);
			wxPayHelper.SetParameter("out_trade_no", CommonUtil.CreateNoncestr());
			wxPayHelper.SetParameter("total_fee", "1");
			wxPayHelper.SetParameter("fee_type", "1");//支付币种 暂 仅支持 1 人民币
			wxPayHelper.SetParameter("notify_url", "htttp://www.baidu.com");//支付完成后微信通知结果url 绝对路径
			wxPayHelper.SetParameter("spbill_create_ip", "127.0.0.1");//用户浏览器ip
			wxPayHelper.SetParameter("input_charset", "UTF-8");//

			System.out.println("生成app支付package:");
			System.out.println(wxPayHelper.CreateAppPackage("test"));
			System.out.println("生成jsapi支付package:");
			System.out.println(wxPayHelper.CreateBizPackage());
			System.out.println("生成原生支付url:");
			System.out.println(wxPayHelper.CreateNativeUrl("abc"));
			System.out.println("生成原生支付package:");
			System.out.println(wxPayHelper.CreateNativePackage("0", "ok"));

		} catch (Exception e) {
			System.out.println(e.getMessage());
		}

	}
}
