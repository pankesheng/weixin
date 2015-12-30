package com.weixin.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;

import com.weixin.message.resp.Article;
import com.weixin.message.resp.Music;
import com.weixin.message.resp.MusicMessage;
import com.weixin.message.resp.NewsMessage;
import com.weixin.message.resp.TextMessage;
import com.weixin.util.MessageUtil;
/** 
 * 核心服务类 
 *  
 */  
public class CoreService {
	/** 
     * 处理微信发来的请求 
     *  
     * @param request 
     * @return 
     */  
	
	public static String processRequest(HttpServletRequest request) {
		String respMessage = null;  
        try {  
            // 默认返回的文本消息内容  
            String respContent = "请求处理异常，请稍候尝试！";  
  
            // xml请求解析  
            Map<String, String> requestMap = MessageUtil.parseXml(request);  
  
            // 发送方帐号（open_id）  
            String fromUserName = requestMap.get("FromUserName");  
            // 公众帐号  
            String toUserName = requestMap.get("ToUserName");  
            // 消息类型  
            String msgType = requestMap.get("MsgType");  
            // 创建文本消息
            TextMessage textMessage = new TextMessage();  
            textMessage.setToUserName(fromUserName);  
            textMessage.setFromUserName(toUserName);  
            textMessage.setCreateTime(new Date().getTime()); 
            // 创建图文消息  
            NewsMessage newsMessage = new NewsMessage(); 
            newsMessage.setToUserName(fromUserName);  
            newsMessage.setFromUserName(toUserName);  
            newsMessage.setCreateTime(new Date().getTime()); 
            // 文本消息  
            if (msgType.equals(MessageUtil.REQ_MESSAGE_TYPE_TEXT)) {  
                respContent = "您发送的是文本消息！"; 
                // 文本消息内容  
                String content = requestMap.get("Content");  
                // 判断用户发送的是否是单个QQ表情  
                if(isQqFace(content)) {  
                    // 回复文本消息  
                    textMessage.setMsgType(MessageUtil.RESP_MESSAGE_TYPE_TEXT);  
                    // 用户发什么QQ表情，就返回什么QQ表情  
                    textMessage.setContent(content);  
                    // 将文本消息对象转换成xml字符串  
                    respMessage = MessageUtil.textMessageToXml(textMessage);  
                }else if(content.equals("文章")){
                    newsMessage.setMsgType(MessageUtil.RESP_MESSAGE_TYPE_NEWS);  
                    List<Article> articleList = new ArrayList<Article>();
                    articleList.add(new Article("导体的电阻", "导体的电阻", "http://vodxz.ohedu.net/group1/M01/02/51/CoMME1aCP1yAXg6FAAHB2Gbslpo759.jpg", "http://zk.ohedu.net/course/player.action?subjectId=&courseId=1468362388638720"));
                    newsMessage.setArticleCount(articleList.size());  
                    newsMessage.setArticles(articleList);  
                    respMessage = MessageUtil.newsMessageToXml(newsMessage);  
                }else if(content.equals("音乐")){
                    MusicMessage musicMessage = new MusicMessage();
                    musicMessage.setToUserName(fromUserName);  
                    musicMessage.setFromUserName(toUserName);  
                    musicMessage.setCreateTime(new Date().getTime()); 
                    musicMessage.setMsgType(MessageUtil.RESP_MESSAGE_TYPE_MUSIC);
                    
                    Music music = new Music();
                    music.setTitle("再给我放一首");
                    music.setDescription("再给我放一首");
                    music.setHQMusicUrl("http://sc.111ttt.com/up/mp3/316747/3DD9D473452F8A6C8CFB771614636B31.mp3");
                    music.setMusicUrl("http://sc.111ttt.com/up/mp3/316747/3DD9D473452F8A6C8CFB771614636B31.mp3");
                    
                    musicMessage.setMusic(music);
                    respMessage = MessageUtil.musicMessageToXml(musicMessage);
                }else{
                    textMessage.setMsgType(MessageUtil.RESP_MESSAGE_TYPE_TEXT);  
                    textMessage.setContent("暂时只有输入“音乐”，“文章”，以及单个表情的时候才有返回。");  
                    respMessage = MessageUtil.textMessageToXml(textMessage);
                }
            }  
            // 图片消息  
            else if (msgType.equals(MessageUtil.REQ_MESSAGE_TYPE_IMAGE)) {
            	String picUrl = requestMap.get("PicUrl"); 
            	respContent = "您发送的是图片消息！";  
                textMessage.setContent(respContent+"(图片地址:"+picUrl+")");
                textMessage.setMsgType(MessageUtil.RESP_MESSAGE_TYPE_TEXT);  
                respMessage = MessageUtil.textMessageToXml(textMessage);
            }  
            // 地理位置消息  
            else if (msgType.equals(MessageUtil.REQ_MESSAGE_TYPE_LOCATION)) {  
            	String label = requestMap.get("Label");
            	String scale = requestMap.get("Scale");
            	String location_x = requestMap.get("Location_X");
			    String location_y = requestMap.get("Location_Y");
            	respContent = "您发送的是地理位置消息！";
                textMessage.setContent(respContent+"(位置信息："+label+",缩放大小："+scale+",地理纬度："+location_x+",地理经度："+location_y+")");   
                textMessage.setMsgType(MessageUtil.RESP_MESSAGE_TYPE_TEXT);  
                respMessage = MessageUtil.textMessageToXml(textMessage);
            }  
            // 链接消息  
            else if (msgType.equals(MessageUtil.REQ_MESSAGE_TYPE_LINK)) {
                respContent = "您发送的是链接消息！";  
                textMessage.setMsgType(MessageUtil.RESP_MESSAGE_TYPE_TEXT);  
                respMessage = MessageUtil.textMessageToXml(textMessage);
            }  
            // 音频消息  
            else if (msgType.equals(MessageUtil.REQ_MESSAGE_TYPE_VOICE)) {  
            	String mediaId = requestMap.get("MediaId");
                respContent = "您发送的是音频消息！";  
                textMessage.setContent(respContent);  
                textMessage.setMsgType(MessageUtil.RESP_MESSAGE_TYPE_TEXT);  
                respMessage = MessageUtil.textMessageToXml(textMessage);
            }  
            // 事件推送  
            else if (msgType.equals(MessageUtil.REQ_MESSAGE_TYPE_EVENT)) {  
                // 事件类型  
                String eventType = requestMap.get("Event");  
                // 订阅  
                if (eventType.equals(MessageUtil.EVENT_TYPE_SUBSCRIBE)) {   
                    textMessage.setMsgType(MessageUtil.RESP_MESSAGE_TYPE_TEXT);  
                    textMessage.setContent("欢迎你关注了该测试号。。。。。。");  
                    respMessage = MessageUtil.textMessageToXml(textMessage);
                }  
                // 取消订阅  
                else if (eventType.equals(MessageUtil.EVENT_TYPE_UNSUBSCRIBE)) {  
                    // TODO 取消订阅后用户再收不到公众号发送的消息，因此不需要回复消息  
                }  
                // 自定义菜单点击事件  
                else if (eventType.equals(MessageUtil.EVENT_TYPE_CLICK)) {  
                	// 事件KEY值，与创建自定义菜单时指定的KEY值对应  
                	String eventKey = requestMap.get("EventKey");
                    textMessage.setMsgType(MessageUtil.RESP_MESSAGE_TYPE_TEXT);  
                    if(eventKey.equals("11")){
                    	textMessage.setContent("");
                    }
                    respMessage = MessageUtil.textMessageToXml(textMessage);
                }  
            }  
        } catch (Exception e) {  
            e.printStackTrace();  
        }  
  
        return respMessage;  
    
	}
	
	/** 
	 * 判断是否是QQ表情 
	 *  
	 * @param content 
	 * @return 
	 */  
	public static boolean isQqFace(String content) {  
	    boolean result = false;  
	  
	    // 判断QQ表情的正则表达式  
	    String qqfaceRegex = "/::\\)|/::~|/::B|/::\\||/:8-\\)|/::<|/::$|/::X|/::Z|/::'\\(|/::-\\||/::@|/::P|/::D|/::O|/::\\(|/::\\+|/:--b|/::Q|/::T|/:,@P|/:,@-D|/::d|/:,@o|/::g|/:\\|-\\)|/::!|/::L|/::>|/::,@|/:,@f|/::-S|/:\\?|/:,@x|/:,@@|/::8|/:,@!|/:!!!|/:xx|/:bye|/:wipe|/:dig|/:handclap|/:&-\\(|/:B-\\)|/:<@|/:@>|/::-O|/:>-\\||/:P-\\(|/::'\\||/:X-\\)|/::\\*|/:@x|/:8\\*|/:pd|/:<W>|/:beer|/:basketb|/:oo|/:coffee|/:eat|/:pig|/:rose|/:fade|/:showlove|/:heart|/:break|/:cake|/:li|/:bome|/:kn|/:footb|/:ladybug|/:shit|/:moon|/:sun|/:gift|/:hug|/:strong|/:weak|/:share|/:v|/:@\\)|/:jj|/:@@|/:bad|/:lvu|/:no|/:ok|/:love|/:<L>|/:jump|/:shake|/:<O>|/:circle|/:kotow|/:turn|/:skip|/:oY|/:#-0|/:hiphot|/:kiss|/:<&|/:&>";  
	    Pattern p = Pattern.compile(qqfaceRegex);  
	    Matcher m = p.matcher(content);  
	    if (m.matches()) {  
	        result = true;  
	    }  
	    return result;
	}  

}
