package com.weixin.action;

import java.util.ArrayList;
import java.util.List;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

import org.apache.commons.lang3.StringUtils;

public class Test {
	static ScriptEngine jse = new ScriptEngineManager().getEngineByName("JavaScript"); 
	static List<String> fhlist = new ArrayList<String>();
	static {
		fhlist.add("+");
		fhlist.add("-");
		fhlist.add("*");
		fhlist.add("/");
		fhlist.add("(");
		fhlist.add(")");
	}
	public static void main(String[] args) throws ScriptException {
		int a = 1;
		int b = 2;
		int c = 3;
		int d = 4;
		int e = 5;
		int f = 6;
		
		String str = "f4g*a+b*(c+d)+gg-e/x#y+h";
		String newStr = "";
		List<String> result = splitAll(str);
		for (int i = 0; i < result.size(); i++) {
			String string = result.get(i);
			if(fhlist.contains(string)){
				if(StringUtils.isNotBlank(newStr)){
					newStr = newStr+string;
				}
			}else{
				if(string.equals("a")){
					newStr = newStr +a;
				}else if(string.equals("b")){
					newStr = newStr +b;
				}else if(string.equals("c")){
					newStr = newStr +c;
				}else if(string.equals("d")){
					newStr = newStr +d;
				}else if(string.equals("e")){
					newStr = newStr +e;
				}else if(string.equals("f")){
					newStr = newStr +f;
				}else if(string.equals("x#y")){
					newStr = newStr +2;
				}else{
					if(newStr.length()>0){
						if(i==0){
							newStr = newStr.substring(string.length());
						}else if(i==result.size()-1){
							newStr = newStr.substring(0,newStr.length()-1);
						}else{
							if(result.get(i-1).equals("*")||result.get(i-1).equals("/")){
								newStr = newStr + "1";
							}else if(result.get(i-1).equals("+")||result.get(i-1).equals("-")){
								if (result.get(i+1).equals("*")) {
									newStr = newStr + "1";
								}else if(result.get(i+1).equals("/") || result.get(i+1).equals("+")||result.get(i+1).equals("-")){
									newStr = newStr + "0";
								}
							}else if(result.get(i-1).equals("(")){
								
							}
						}
					}
				}
			}
		}
		System.out.println(str);
		System.out.println(newStr);
		System.out.println(jse.eval(newStr));  
		System.out.println(jse.eval("4*1/2"));  
	}
	
	public static List<String> splitAll(String str){
		List<String> temp = new ArrayList<String>();
		temp.add(str);
		for (String fh : fhlist) {
			temp = splitToList(temp,fh);
		}
		return temp;
	}

	private static List<String> splitToList(List<String> temp, String reg) {
		List<String> result = new ArrayList<String>();
		for (String string : temp) {
			string = string+" ";
			String[] s = string.split("\\"+reg);
			for (int i = 0; i < s.length; i++) {
				String a = s[i];
				if (StringUtils.isNotBlank(a)) {
					result.add(a.trim());	
				}
				if(i<s.length-1)result.add(reg);
			}
		}
		return result;
	}
	
}
