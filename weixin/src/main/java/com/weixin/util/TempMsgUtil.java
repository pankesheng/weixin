package com.weixin.util;

import java.util.HashMap;
import java.util.Map;

import net.sf.json.JSONObject;

import com.google.gson.Gson;
import com.weixin.configuration.WeChatConfiguration;
import com.weixin.message.tempmsg.TempMsg;
import com.weixin.message.tempmsg.TempData;
import com.weixin.pojo.AccessToken;

public class TempMsgUtil {
	
	/**订单支付通知 template_id*/
	private static final String PAYMENTNOTICE_TEMPLATE_ID = "NfSUdgHV7km-OLgm6d6eqTY8QcJXuie7stk25A9bpNs";
	/**购买成功通知*/
	private static final String BUY_SUCCESS_TEMPLATE_ID = "NyJJW_kpLS4zDgbV1jXytXmrO6LX128jOE2OdGyMFxE";
	/**订单付款成功通知*/
	private static final String PAYMENT_SUCCESS_TEMPLATE_ID = "bwN8h8QG7CUqYUbgRHScLfZI9mSW4Qt6R1qsDzcMkdA";
	
	public static String getPayMentNoticeJson(){
		Map<String, TempData> map = new HashMap<String, TempData>();
		map.put("first", new TempData("恭喜你购买成功！"));
		map.put("keynote1", new TempData("巧克力"));
		map.put("keynote2", new TempData("39.8元"));
		map.put("keynote3", new TempData("2014年9月22日"));
		map.put("remark", new TempData("欢迎再次光临！"));
		TempMsg ct = new TempMsg("openid","ngqIpbwh8bUfcSsECmogfXcV14J0tQlEpBO27izEYtY","http://www.baidu.com",map);
		String s = new Gson().toJson(ct);
		return s;
	}
	
	/**发送订单支付通知
	 * @param openid 接受者openid
	 * @param url	
	 * @param title	标题
	 * @param orderNo	订单号码
	 * @param goodName	商品名称
	 * @param goodCount	商品数量
	 * @param money	支付金额
	 * @param remark	描述
	 * @return
	 */
	public static boolean sendPayMentNoticeMsg(String openid,String url,String title,String orderNo,String goodName,String goodCount,String money,String remark){
		Map<String, TempData> data = new HashMap<String, TempData>();
		data.put("first", new TempData(title));
		data.put("keyword1", new TempData(orderNo));
		data.put("keyword2", new TempData(goodName));
		data.put("keyword3", new TempData(goodCount));
		data.put("keyword4", new TempData(money));
		data.put("remark", new TempData(remark));
		TempMsg tm = new TempMsg(openid, PAYMENTNOTICE_TEMPLATE_ID, url, data);
		JSONObject jsonObject = sendTempMsg(new Gson().toJson(tm));
		if (jsonObject!=null) {
			int errcode = jsonObject.getInt("errcode");
			if(errcode==0){
				return true;
			}else{
				return false;
			}
		}
		return false;
	}
	
	/**购买成功通知
	 * @param openid 接受者openid
	 * @param url 点击跳转
	 * @param title 标题
	 * @param product 商品名称
	 * @param price	商品价格
	 * @param time	购买时间
	 * @param remark 描述
	 * @return
	 */
	public static boolean sendBuySuccessNoticeMsg(String openid,String url,String title,String product,String price,String time,String remark){
		Map<String, TempData> data = new HashMap<String, TempData>();
		data.put("first", new TempData(title));
		data.put("product", new TempData(product));
		data.put("price", new TempData(price));
		data.put("time", new TempData(time));
		data.put("remark", new TempData(remark));
		TempMsg tm = new TempMsg(openid, BUY_SUCCESS_TEMPLATE_ID, url, data);
		JSONObject jsonObject = sendTempMsg(new Gson().toJson(tm));
		if (jsonObject!=null) {
			int errcode = jsonObject.getInt("errcode");
			if(errcode==0){
				return true;
			}else{
				return false;
			}
		}
		return false;
	}
	
	/**订单付款成功通知
	 * @param openid 接受者openid
	 * @param url
	 * @param title	标题
	 * @param orderNo	订单号
	 * @param time	支付时间
	 * @param money	支付金额
	 * @param paytype 支付方式
	 * @param remark 描述
	 * @return
	 */
	public static boolean sendPayMentSuccessNoticeMsg(String openid,String url,String title,String orderNo,String time,String money,String paytype,String remark){
		Map<String, TempData> data = new HashMap<String, TempData>();
		data.put("first", new TempData(title));
		data.put("keyword1", new TempData(orderNo));
		data.put("keyword2", new TempData(time));
		data.put("keyword3", new TempData(money));
		data.put("keyword4", new TempData(paytype));
		data.put("remark", new TempData(remark));
		TempMsg tm = new TempMsg(openid, PAYMENT_SUCCESS_TEMPLATE_ID, url, data);
		JSONObject jsonObject = sendTempMsg(new Gson().toJson(tm));
		if (jsonObject!=null) {
			int errcode = jsonObject.getInt("errcode");
			if(errcode==0){
				return true;
			}else{
				return false;
			}
		}
		return false;
	}
	
	public static JSONObject sendTempMsg(String json){
		AccessToken accessToken = AdvancedUtil.getAccessToken();
		String requestUrl = WeChatConfiguration.TEMP_SEND_URL.replace("ACCESS_TOKEN", accessToken.getAccess_token());
		JSONObject jsonObject = CommonUtil.httpsRequest(requestUrl, "POST", json);
		return jsonObject;
	}
	
	public static void main(String[] args) {
		sendPayMentNoticeMsg("ovthJv3camiwWeDhb4t36CtOLpPE", "http://www.baidu.com", "测试标题", "12312414", "测试商品1", "9999", "9999", "测试描述");
	}
	
}
