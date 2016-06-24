package com.weixin.message.resp;
/**
 * @Description: 图片消息
 * @author Administrator
 * @date 2015-12-16
 */
public class ImageMessage extends BaseMessage {
	//图片
	private Image Image;

	public Image getImage() {
		return Image;
	}

	public void setImage(Image image) {
		Image = image;
	}
}
