package com.weixin.material;

public class NewsMaterial extends BasicMaterial {
	
	private NewsContent content;

	private String name ;
	
	public NewsContent getContent() {
		return content;
	}

	public void setContent(NewsContent content) {
		this.content = content;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
}
