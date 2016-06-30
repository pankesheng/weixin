package com.weixin.message.event;

/**
 * 
 * @Description: 自定义菜单事件
 * @author Administrator
 * @date 2015-12-16
 */
public class MenuEvent {

	// 事件KEY值，与自定义菜单接口中KEY值对应
	private String EventKey;

	public String getEventKey() {
		return EventKey;
	}

	public void setEventKey(String eventKey) {
		EventKey = eventKey;
	}
}
