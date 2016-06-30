package com.weixin.pojo;

public class WeChatPayResult {
	private String appid;		//微信分配的公众账号ID（企业号corpid即为此appId）
	private String bankType;	//银行类型，采用字符串类型的银行标识，银行类型见银行列表
	private String cashFee;		//现金支付金额订单现金支付金额，详见支付金额
	private String feeType;		//货币类型，符合ISO4217标准的三位字母代码，默认人民币：CNY，其他值列表详见货币类型
	private String isSubscribe;	//用户是否关注公众账号，Y-关注，N-未关注，仅在公众账号类型支付有效
	private String mchId;		//微信支付分配的商户号
	private String openid;		//用户在商户appid下的唯一标识
	private String nonceStr;	//随机字符串，不长于32位
	private String resultCode;	//SUCCESS/FAIL
	private String outTradeNo;	//商户系统的订单号，与请求一致。
	private String returnCode;	//SUCCESS/FAIL此字段是通信标识，非交易标识，交易是否成功需要查看result_code来判断
	private String sign;		//签名，详见签名算法
	private String timeEnd;		//支付完成时间，格式为yyyyMMddHHmmss，如2009年12月25日9点10分10秒表示为20091225091010。其他详见时间规则
	private String totalFee;	//订单总金额，单位为分
	private String tradeType;	//银行类型，采用字符串类型的银行标识，银行类型见银行列表
	private String transactionId;//微信支付订单号
	public String getAppid() {
		return appid;
	}
	public void setAppid(String appid) {
		this.appid = appid;
	}
	public String getBankType() {
		return bankType;
	}
	public void setBankType(String bankType) {
		this.bankType = bankType;
	}
	public String getCashFee() {
		return cashFee;
	}
	public void setCashFee(String cashFee) {
		this.cashFee = cashFee;
	}
	public String getFeeType() {
		return feeType;
	}
	public void setFeeType(String feeType) {
		this.feeType = feeType;
	}
	public String getIsSubscribe() {
		return isSubscribe;
	}
	public void setIsSubscribe(String isSubscribe) {
		this.isSubscribe = isSubscribe;
	}
	public String getMchId() {
		return mchId;
	}
	public void setMchId(String mchId) {
		this.mchId = mchId;
	}
	public String getOpenid() {
		return openid;
	}
	public void setOpenid(String openid) {
		this.openid = openid;
	}
	public String getNonceStr() {
		return nonceStr;
	}
	public void setNonceStr(String nonceStr) {
		this.nonceStr = nonceStr;
	}
	public String getResultCode() {
		return resultCode;
	}
	public void setResultCode(String resultCode) {
		this.resultCode = resultCode;
	}
	public String getOutTradeNo() {
		return outTradeNo;
	}
	public void setOutTradeNo(String outTradeNo) {
		this.outTradeNo = outTradeNo;
	}
	public String getReturnCode() {
		return returnCode;
	}
	public void setReturnCode(String returnCode) {
		this.returnCode = returnCode;
	}
	public String getSign() {
		return sign;
	}
	public void setSign(String sign) {
		this.sign = sign;
	}
	public String getTimeEnd() {
		return timeEnd;
	}
	public void setTimeEnd(String timeEnd) {
		this.timeEnd = timeEnd;
	}
	public String getTotalFee() {
		return totalFee;
	}
	public void setTotalFee(String totalFee) {
		this.totalFee = totalFee;
	}
	public String getTradeType() {
		return tradeType;
	}
	public void setTradeType(String tradeType) {
		this.tradeType = tradeType;
	}
	public String getTransactionId() {
		return transactionId;
	}
	public void setTransactionId(String transactionId) {
		this.transactionId = transactionId;
	}
}
