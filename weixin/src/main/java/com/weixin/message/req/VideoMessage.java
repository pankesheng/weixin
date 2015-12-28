package com.weixin.message.req;

/**
 * 视频类
 * 
 */
public class VideoMessage extends BaseMessage {
	private String mediaId;
	private String thumbMediaId;
	
	public String getMediaId() {
		return mediaId;
	}
	public void setMediaId(String mediaId) {
		this.mediaId = mediaId;
	}
	public String getThumbMediaId() {
		return thumbMediaId;
	}
	public void setThumbMediaId(String thumbMediaId) {
		this.thumbMediaId = thumbMediaId;
	}

	
}
