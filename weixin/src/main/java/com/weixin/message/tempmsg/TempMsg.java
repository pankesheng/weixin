package com.weixin.message.tempmsg;

import java.util.Map;

public class TempMsg {
	private String touser;
	private String template_id;
	private String url;
	private Map<String, TempData> data;
	
	public TempMsg() {
		// TODO Auto-generated constructor stub
	}
	
	public TempMsg(String touser, String template_id, String url,
			Map<String, TempData> data) {
		super();
		this.touser = touser;
		this.template_id = template_id;
		this.url = url;
		this.data = data;
	}

	public String getTouser() {
		return touser;
	}

	public void setTouser(String touser) {
		this.touser = touser;
	}

	public String getTemplate_id() {
		return template_id;
	}

	public void setTemplate_id(String template_id) {
		this.template_id = template_id;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public Map<String, TempData> getData() {
		return data;
	}

	public void setData(Map<String, TempData> data) {
		this.data = data;
	}
	
}
