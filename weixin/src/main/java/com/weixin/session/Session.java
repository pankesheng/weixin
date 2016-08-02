package com.weixin.session;

import java.util.ArrayList;
import java.util.List;

public class Session {
	
	public static final int phase_kf = 1;	//客服阶段
	
	private String openid;
	private long endTime;//有效截止时间  比如3点创建 有效期2小时 即这里的值为5点的值
	private int phase;
	public static final int validTime = 3*60*1000;
	
	private List<SessionData> sessionDatas = new ArrayList<SessionData>();

	public String getOpenid() {
		return openid;
	}

	public void setOpenid(String openid) {
		this.openid = openid;
	}

	public long getEndTime() {
		return endTime;
	}

	public void setEndTime(long endTime) {
		this.endTime = endTime;
	}

	public List<SessionData> getSessionDatas() {
		return sessionDatas;
	}

	public void setSessionDatas(List<SessionData> sessionDatas) {
		this.sessionDatas = sessionDatas;
	}

	public int getPhase() {
		return phase;
	}

	public void setPhase(int phase) {
		this.phase = phase;
	}

}
