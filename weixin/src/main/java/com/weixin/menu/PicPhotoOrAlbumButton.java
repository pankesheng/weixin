package com.weixin.menu;

/**
 * 弹出拍照或者相册发图
 * @author pks
 *
 */
public class PicPhotoOrAlbumButton extends Button{
	private String type;  
    private String key;  
  
    public PicPhotoOrAlbumButton() {
		// TODO Auto-generated constructor stub
	}
    
    public PicPhotoOrAlbumButton(String name,String type, String key) {
		super();
		super.setName(name);
		this.type = type;
		this.key = key;
	}
    /**
     * 默认type 为 “click”
     * @param name
     * @param key
     */
    public PicPhotoOrAlbumButton(String name, String key) {
		super();
		super.setName(name);
		this.type = "pic_photo_or_album";
		this.key = key;
	}

	public String getType() {  
        return type;  
    }  
  
    public void setType(String type) {  
        this.type = type;  
    }  
  
    public String getKey() {  
        return key;  
    }  
  
    public void setKey(String key) {  
        this.key = key;  
    }
}
