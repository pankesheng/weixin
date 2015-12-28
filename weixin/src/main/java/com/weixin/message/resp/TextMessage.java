package com.weixin.message.resp;
/**
 * 文本消息
 * @author admin
 *
 */
public class TextMessage extends BaseMessage{
	private String Content;

	public String getContent() {
		return Content;
	}

	public void setContent(String Content) {
		this.Content = Content;
	}
	
}
