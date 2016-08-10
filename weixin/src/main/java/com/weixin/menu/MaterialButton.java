package com.weixin.menu;

public class MaterialButton extends Button{
	private String type ;
	private String media_id;
	
	public MaterialButton() {
		// TODO Auto-generated constructor stub
	}
	    
    public MaterialButton(String name,String type, String media_id) {
		super();
		super.setName(name);
		this.type = type;
		this.media_id = media_id;
	}
    public MaterialButton(String name, String media_id) {
		super();
		super.setName(name);
//		this.type = "media_id";
		this.type = "view_limited";
		this.media_id = media_id;
	}
	
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getMedia_id() {
		return media_id;
	}
	public void setMedia_id(String media_id) {
		this.media_id = media_id;
	}
	
	
	
}
