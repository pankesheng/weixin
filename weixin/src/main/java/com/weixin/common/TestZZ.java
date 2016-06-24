package com.weixin.common;
/**
 * 正则
 * @author pks
 *
 */
public class TestZZ {
	public static void main(String[] args) {
		String a ="a1235A";
		System.out.println(a.matches("^a[0-9]*A$"));
		System.out.println("shivkoirala".matches("[a-z]{11}"));
		
	}
}
