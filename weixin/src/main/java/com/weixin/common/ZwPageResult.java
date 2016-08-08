package com.weixin.common;

import java.util.List;

import com.zcj.web.dto.Page;
import com.zcj.web.dto.ServiceResult;

/**
 * 掌网列表分页查询的返回值工具类
 * 
 * @author zouchongjin@sina.com
 * @data 2014年8月8日
 */
public class ZwPageResult {

	private int s;
	private List<?> d;
	private int total;

	public ZwPageResult() {
		super();
	}

	public ZwPageResult(int s, List<?> d, int total) {
		super();
		this.s = s;
		this.d = d;
		this.total = total;
	}

	public static String converByServiceResult(ServiceResult sr) {
		ZwPageResult obj = new ZwPageResult();
		if (sr.success()) {
			Page p = (Page) sr.getD();
			obj = new ZwPageResult(sr.getS(), p.getRows(), p.getTotal());
			return ServiceResult.GSON_DT.toJson(obj);
		} else {
			if (sr.getD() != null) {
				return "{\"s\":" + sr.getS() + ",\"d\":\"" + String.valueOf(sr.getD()) + "\"}";
			} else {
				return "{\"s\":" + sr.getS() + "}";
			}
		}
	}

	public int getS() {
		return s;
	}

	public void setS(int s) {
		this.s = s;
	}

	public List<?> getD() {
		return d;
	}

	public void setD(List<?> d) {
		this.d = d;
	}

	public int getTotal() {
		return total;
	}

	public void setTotal(int total) {
		this.total = total;
	}

}
