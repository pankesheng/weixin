package com.weixin.message.resp;

/**
 * 客服
 * @author pks
 *
 */
public class KfMessage extends BaseMessage{
	
	private TransInfo TransInfo;

	public TransInfo getTransInfo() {
		return TransInfo;
	}

	public void setTransInfo(TransInfo transInfo) {
		TransInfo = transInfo;
	}
		
}