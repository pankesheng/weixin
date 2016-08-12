package com.weixin.pojo;

public class AccessToken {

	private String access_token;
	private int expires_in;
	private String refresh_token;
	private String openid;
	private String scope;
	private String unionid;
	private long endtime;

	public String getAccess_token() {
		return access_token;
	}

	public void setAccess_token(String access_token) {
		this.access_token = access_token;
	}
	
	public int getExpires_in() {
		return expires_in;
	}

	public void setExpires_in(int expires_in) {
		this.expires_in = expires_in;
	}

	public String getRefresh_token() {
		return refresh_token;
	}

	public void setRefresh_token(String refresh_token) {
		this.refresh_token = refresh_token;
	}

	public String getOpenid() {
		return openid;
	}

	public void setOpenid(String openid) {
		this.openid = openid;
	}

	public String getScope() {
		return scope;
	}

	public void setScope(String scope) {
		this.scope = scope;
	}

	public String getUnionid() {
		return unionid;
	}

	public void setUnionid(String unionid) {
		this.unionid = unionid;
	}

	public long getEndtime() {
		return endtime;
	}

	public void setEndtime(long endtime) {
		this.endtime = endtime;
	}

	@Override
	public String toString() {
		return "AccessToken [access_token=" + access_token + ", expires_in="
				+ expires_in + ", refresh_token=" + refresh_token + ", openid="
				+ openid + ", scope=" + scope + ", unionid=" + unionid + "]";
	}
}
