package com.weixin.session;

public class SessionData {
	private String name;
	private Object value;
	
	public SessionData() {
		// TODO Auto-generated constructor stub
	}
	
	public SessionData(String name, Object value) {
		super();
		this.name = name;
		this.value = value;
	}

	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Object getValue() {
		return value;
	}
	public void setValue(Object value) {
		this.value = value;
	}
	
	
}
