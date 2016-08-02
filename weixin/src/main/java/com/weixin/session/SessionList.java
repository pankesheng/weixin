package com.weixin.session;

import java.util.ArrayList;
import java.util.List;

import com.weixin.util.QuartzManager;

/** 
 * session集合 
 */  
public class SessionList {
	/** 
	 * session集合 
	 */  
	public static List<Session> sessionList = new ArrayList<Session>();

	
	/** 
     * 查找session中是否有指定项 
     * @param openid session标识 
     * @return 若存在openid相同的session,返回在集合中对应的位置,若不存在返回-1 
     */  
	public static int search(String openid,int phase) {
		int size = sessionList.size();
		for (int i = 0; i < size; i++) {
			if (sessionList.get(i).getOpenid().equals(openid) && sessionList.get(i).getPhase()==phase)
				return i;
		}
		return -1;
	}
	
	/** 
     * 移除session 
     */  
    public static void remove(String openid,int phase) {  
        int i = search(openid,phase);  
        if (i>=0)  
            sessionList.remove(i);  
    }  
    /** 
     * 向session中存入数据 
     * @param name 
     * @param value 
     * @param openid 
     */  
    public static void setSeesion(String openid,int phase,String name, Object value){  
        System.out.println("setSeesion " + name + " " + value + " " + openid);  
        int i = search(openid,phase);
        if (i>=0){
        	long endtime = System.currentTimeMillis()+Session.validTime;
            SessionData data = new SessionData();  
            data.setName(name);  
            data.setValue(value);
            sessionList.get(i).getSessionDatas().add(data);
            sessionList.get(i).setEndTime(endtime);
            QuartzManager.removeJob("phase"+phase+openid);
            QuartzManager.addJobByLongTime("phase"+phase+openid, "com.weixin.session.SessionClearJob", endtime+2000);
        }  
    } 
    
    /**
     * 重置定时任务时间
     * @param fromUserName
     * @param phase
     */
	public static void resetQuartz(String openid, int phase) {
		int i = search(openid, phase);
		if(i>=0){
			long endtime = System.currentTimeMillis()+Session.validTime;
			sessionList.get(i).setEndTime(endtime);
            QuartzManager.removeJob("phase"+phase+openid);
            QuartzManager.addJobByLongTime("phase"+phase+openid, "com.weixin.session.SessionClearJob", endtime+2000);
		}
	}  
    
    /** 
     * 创建session  
     * @param openid 
     */  
    public static void setSeesion(String openid,int phase){  
        System.out.println("setSeesion " + openid);  
        int i = search(openid,phase);   
        if (i<0){   
            //建立线程   
            Session session = new Session();  
            //两个小时会话  
            session.setEndTime(System.currentTimeMillis()+Session.validTime);  
            //session唯一标识  
            session.setOpenid(openid);
            session.setPhase(phase);
            //添加session  
            sessionList.add(session);  
        }  
    }  
    /** 
     * 根据name,获取session对象中键值对 
     * @param name 
     * @param openid 
     */  
    public static Object getSession(String openid,int phase,String name){  
        int i = search(openid,phase);   
        if (i>=0) {  
            SessionData sessionData=null;  
            for (SessionData sData : sessionList.get(i).getSessionDatas()) {  
                if (sData.getName().equals(name)) {  
                    sessionData=sData;  
                }  
            }  
            if (sessionData!=null){  
                Object value = sessionData.getValue();  
                return value;  
            }   
        }  
        return null;  
    }  
    /** 
     * 根据name,移除session对象中键值对 
     * @param name 
     * @param openid 
     */  
    public static void removeData(String openid,int phase,String name){  
        int i = search(openid,phase);   
        if (i>0){  
            sessionList.get(i).getSessionDatas().remove(name);  
        }  
    }

}
