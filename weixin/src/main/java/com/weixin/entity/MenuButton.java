package com.weixin.entity;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * 微信自定义菜单按钮
 * 注：一级菜单最多同时出现3个，如果超出3个将创建失败！
 * @author pks
 *
 */
public class MenuButton {
	public static final String KEY_ZXKF = "zxkf";	//在线客服
	public static final String TYPE_CLICK = "click";//点击事件按钮
	public static final String TYPE_VIEW = "view";	//视图按钮
	public static final Map<String, String> KEY_MAP = new HashMap<String, String>();
	public static final Map<String, String> TYPE_MAP = new HashMap<String, String>();
	static{
		KEY_MAP.put(KEY_ZXKF,KEY_ZXKF);
		
		TYPE_MAP.put(TYPE_CLICK,TYPE_CLICK);	
		TYPE_MAP.put(TYPE_VIEW,TYPE_VIEW);
	}
	
	private Long id ;
	private Long pid;		//如果pid为空则处于一级菜单状态 
	private Integer btn_list;//是否作为列表项
	private String btn_name;	//按钮名称
	private String btn_type;	//类型：有 view 类型和click 类型
	private String btn_url;		//type类型为 view  点击后的跳转地址
	private String btn_key;		//type类型为 click 事件触发的key值
	private Integer btn_state ; //是否启用
	private String btn_order; //排序号
	private Date ctime ;	//创建时间
	private Date utime ;	//更新时间
	
	private MenuButton show_parent;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Long getPid() {
		return pid;
	}
	public void setPid(Long pid) {
		this.pid = pid;
	}
	public Integer getBtn_list() {
		return btn_list;
	}
	public void setBtn_list(Integer btn_list) {
		this.btn_list = btn_list;
	}
	public String getBtn_name() {
		return btn_name;
	}
	public void setBtn_name(String btn_name) {
		this.btn_name = btn_name;
	}
	public String getBtn_type() {
		return btn_type;
	}
	public void setBtn_type(String btn_type) {
		this.btn_type = btn_type;
	}
	public String getBtn_url() {
		return btn_url;
	}
	public void setBtn_url(String btn_url) {
		this.btn_url = btn_url;
	}
	public String getBtn_key() {
		return btn_key;
	}
	public void setBtn_key(String btn_key) {
		this.btn_key = btn_key;
	}
	public Integer getBtn_state() {
		return btn_state;
	}
	public void setBtn_state(Integer btn_state) {
		this.btn_state = btn_state;
	}
	public String getBtn_order() {
		return btn_order;
	}
	public void setBtn_order(String btn_order) {
		this.btn_order = btn_order;
	}
	public Date getCtime() {
		return ctime;
	}
	public void setCtime(Date ctime) {
		this.ctime = ctime;
	}
	public Date getUtime() {
		return utime;
	}
	public void setUtime(Date utime) {
		this.utime = utime;
	}
	public MenuButton getShow_parent() {
		return show_parent;
	}
	public void setShow_parent(MenuButton show_parent) {
		this.show_parent = show_parent;
	}
	
}
