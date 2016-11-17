package com.weixin.entity;

import com.zcj.util.coder.java.query.QueryColumnType;
import com.zcj.util.coder.page.PageColumnType;
import com.zcj.util.coder.page.PageType;
import com.zcj.web.mybatis.entity.BasicEntity;

@PageType(name="通讯录")
public class User extends BasicEntity {

	/**
	 * 
	 */
	private static final long serialVersionUID = 7790918147908990780L;
	
	@QueryColumnType(listQuery=true,value="=")
	@PageColumnType(name="几栋",grid=true,must=true,check="n")
	private Integer hourse_num;
	@QueryColumnType(listQuery = true,value="=")
	@PageColumnType(name="房间号",grid=true,must=true,check="n")
	private Integer room_num;
	@QueryColumnType(listQuery=true,value="like")
	@PageColumnType(name="姓名",grid=true,must=true,check="max-len:100")
	private String name;
	@QueryColumnType(listQuery=true,value="like")
	@PageColumnType(name="电话",grid=true,check="max-len:100")
	private String phone;
	private String account;
	private String password;
	private String remark;
	
	
	
	public Integer getHourse_num() {
		return hourse_num;
	}
	public void setHourse_num(Integer hourse_num) {
		this.hourse_num = hourse_num;
	}
	public Integer getRoom_num() {
		return room_num;
	}
	public void setRoom_num(Integer room_num) {
		this.room_num = room_num;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getAccount() {
		return account;
	}
	public void setAccount(String account) {
		this.account = account;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}

}
