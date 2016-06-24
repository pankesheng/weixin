package com.weixin.common;

import java.util.ArrayList;
import java.util.List;

public class SortTest {
	public static void main(String[] args) {
		List<objBean> a = new ArrayList<objBean>();
		objBean obj = new objBean();
		obj.setName("1");
		obj.setOrders(1);
		a.add(obj);
		obj = new objBean();
		obj.setName("2");
		obj.setOrders(1);
		a.add(obj);
		obj = new objBean();
		obj.setName("3");
		obj.setOrders(2);
		a.add(obj);
		obj = new objBean();
		obj.setName("4");
		obj.setOrders(null);
		a.add(obj);
		obj = new objBean();
		obj.setName("5");
		obj.setOrders(1);
		a.add(obj);
		obj = new objBean();
		obj.setName("6");
		obj.setOrders(2);
		a.add(obj);
		SortList<objBean> sortList = new SortList<objBean>();  
		sortList.Sort(a, "getOrders", "asc");
		for (int i = 0; i < a.size(); i++) {
			System.out.println(a.get(i).getName());
		}
	}
}
class objBean {
	private Integer orders;
	private String name;
	public Integer getOrders() {
		return orders;
	}
	public void setOrders(Integer orders) {
		this.orders = orders;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
}
