package com.weixin.pojo;


public class ViewButton extends Button{
	private String type;  
    private String url;  
  
    public ViewButton() {
		// TODO Auto-generated constructor stub
	}
    
    public ViewButton(String name,String type, String url) {
		super();
    	super.setName(name);
		this.type = type;
		this.url = url;
	}
    
    /**
     * 默认type 为 “view”
     * @param name
     * @param url
     */
    public ViewButton(String name, String url) {
		super();
    	super.setName(name);
		this.type = "view";
		this.url = url;
	}

	public String getType() {  
        return type;  
    }  
  
    public void setType(String type) {  
        this.type = type;  
    }  
  
    public String getUrl() {  
        return url;  
    }  
  
    public void setUrl(String url) {  
        this.url = url;  
    }  
}
