package com.weixin.message.tempmsg;

public class TempData {
	private String value;
	private String color;
	
	public TempData() {
		// TODO Auto-generated constructor stub
	}
	
	public TempData(String value) {
		super();
		this.value = value;
		this.color = "#173177";
	}
	
	public TempData(String value, String color) {
		super();
		this.value = value;
		this.color = color;
	}

	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
	public String getColor() {
		return color;
	}
	public void setColor(String color) {
		this.color = color;
	}

}
