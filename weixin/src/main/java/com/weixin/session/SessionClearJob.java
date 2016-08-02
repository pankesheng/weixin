package com.weixin.session;

import java.util.ArrayList;
import java.util.List;

import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.scheduling.quartz.QuartzJobBean;

import com.weixin.util.QuartzManager;

public class SessionClearJob extends QuartzJobBean{

	@Override
	protected void executeInternal(JobExecutionContext context)
			throws JobExecutionException {
		long currentTime = System.currentTimeMillis();
		// 休眠1分钟
		if (SessionList.sessionList.isEmpty()) {
			System.out.println("暂无session信息！");
		} else {
			// 用来装需要删除的元素
			List<Session> delList = new ArrayList<Session>();
			// 遍历session集合,将时间戳到期的提出
			for (Session session : SessionList.sessionList) {
				System.out.println(session.getEndTime());
				// 当前时间大于创建时间加保存时间的session移除
				if (currentTime >session.getEndTime()) {
					delList.add(session);
				}
			}
			// 移除要删除的元素
			SessionList.sessionList.removeAll(delList);
			for (Session session : delList) {
				QuartzManager.removeJob("session"+session.getOpenid());
			}
		}
	}
}
