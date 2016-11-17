package com.weixin.action;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.NumberFormat;

public class Test2 {
	public static void main(String[] args) {
		String str = "86.44566666";
		BigDecimal bd = new BigDecimal(Double.parseDouble(str));
		System.out.println(bd.setScale(2, BigDecimal.ROUND_HALF_UP)
				.doubleValue());
		System.out.println("=================");
		DecimalFormat df = new DecimalFormat("#.00");
		System.out.println(df.format(86.5654));
		System.out.println("=================");
		System.out.println(String.format("%.2f", Double.parseDouble(str)));
		System.out.println("=================");
		NumberFormat nf = NumberFormat.getNumberInstance();
		nf.setMaximumFractionDigits(2);
		System.out.println(nf.format(Double.parseDouble(str)));

	}
}
