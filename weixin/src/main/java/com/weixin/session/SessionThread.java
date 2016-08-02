package com.weixin.session;

import java.util.ArrayList;
import java.util.List;

public class SessionThread implements Runnable {

	@Override
	public void run() {
		while (true) {
			// 当前时间戳
			long currentTime = System.currentTimeMillis();
			// 休眠1分钟
			try {
				System.out.println(currentTime);
				if (SessionList.sessionList.isEmpty()) {
					System.out.println("现在还没session,休息10分钟！");
					// 休眠10分钟
					Thread.sleep(10 * 60 * 1000);
				} else {
					// 用来装需要删除的元素
					List<Session> delList = new ArrayList<Session>();
					// 遍历session集合,将时间戳到期的提出
					for (Session session : SessionList.sessionList) {
						// 当前时间大于创建时间加保存时间的session移除
						if (currentTime >session.getEndTime()) {
							delList.add(session);
							System.out.println("要移除的session,openid为:"+ session.getOpenid());
						}
					}
					// 移除要删除的元素
					SessionList.sessionList.removeAll(delList);
					// 休眠1分钟
					Thread.sleep(60 * 1000);
				}
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
	}

}
