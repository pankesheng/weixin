package com.weixin.pojo;

/**
 * 一级菜单button
 * @author pks
 *
 */
public class ComplexButton extends Button{
	private Button[] sub_button;  
	  
	
	public ComplexButton() {
		// TODO Auto-generated constructor stub
	}
	
    public ComplexButton(String name,Button[] sub_button) {
		super();
		super.setName(name);
		this.sub_button = sub_button;
	}



	public Button[] getSub_button() {  
        return sub_button;  
    }  
  
    public void setSub_button(Button[] sub_button) {  
        this.sub_button = sub_button;  
    }  
}
