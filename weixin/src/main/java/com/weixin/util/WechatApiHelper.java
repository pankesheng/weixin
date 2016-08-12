package com.weixin.util;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import net.sf.json.JSONObject;

import org.apache.commons.lang3.StringUtils;
import org.apache.http.client.ClientProtocolException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.weixin.configuration.WeChatConfiguration;
import com.weixin.configuration.WeChatErrorCode;
import com.weixin.material.NewsMaterial;
import com.weixin.material.OtherMaterial;
import com.weixin.menu.Menu;
import com.weixin.message.resp.Article;
import com.weixin.message.resp.Music;
import com.weixin.pojo.AccessToken;
import com.zcj.web.dto.Page;


public class WechatApiHelper {
	
	private static Logger log = LoggerFactory.getLogger(WechatApiHelper.class);
	
	/**
	 * 发送文本客服消息
	 * @param openid
	 * @param content
	 * @return 返回成功（true）会失败（false）
	 */
	public static boolean sendTextMessage(String openid,String content){
		if (StringUtils.isBlank(content)) {
			return false;
		}
		String jsonMsg = AdvancedUtil.makeTextCustomMessage(openid, content);
		AccessToken accessToken = AdvancedUtil.getAccessToken();
		return AdvancedUtil.sendCustomMessage(accessToken.getAccess_token(), jsonMsg);
	}

	/**
	 * 发送图文客服消息
	 * @param openid
	 * @param articleList
	 * @return 返回成功（true）会失败（false）
	 */
	public static boolean sendNewsMessage(String openid,List<Article> articleList){
		if(articleList==null || articleList.size()==0 || articleList.size()>10){
			return false;
		}
		String jsonMsg = AdvancedUtil.makeNewsCustomMessage(openid, articleList);
		AccessToken accessToken = AdvancedUtil.getAccessToken();
		return AdvancedUtil.sendCustomMessage(accessToken.getAccess_token(), jsonMsg);
	}
	
	/**
	 * 发送音乐消息
	 * @param openid
	 * @param music
	 * @return 返回成功（true）会失败（false）
	 */
	public static boolean send(String openid,Music music){
		String jsonMsg = AdvancedUtil.makeMusicCustomMessage(openid, music);
		AccessToken accessToken = AdvancedUtil.getAccessToken();
		return AdvancedUtil.sendCustomMessage(accessToken.getAccess_token(), jsonMsg);
	}
	
	/**
	 * 创建自定义菜单 
	 * @param menu 菜单 
	 * @return
	 */
	public static boolean createMenu(Menu menu){
		if(menu.getButton()==null || menu.getButton().length==0 || menu.getButton().length>3){
			return false;
		}
		AccessToken accessToken = AdvancedUtil.getAccessToken();
        String url = WeChatConfiguration.MENU_CREATE_URL.replace("ACCESS_TOKEN", accessToken.getAccess_token());  
        String jsonMenu = JSONObject.fromObject(menu).toString();  
        JSONObject jsonObject = CommonUtil.httpsRequest(url, "POST", jsonMenu);  
        if (null != jsonObject) {
            if (0 != jsonObject.getInt("errcode")) {
                System.out.println("创建菜单失败 errcode:{} errmsg:{}"+ jsonObject.getInt("errcode")+jsonObject.getString("errmsg"));
                log.error("创建菜单失败 errcode:{} errmsg:{}", jsonObject.getInt("errcode"), jsonObject.getString("errmsg"));  
                return false;
            }
        }
		return true;
	}
	/***
	 * 
	 * @param menu
	 * @return 如果成功返回空字符串，如果失败返回错误代码和错误信息;
	 */
	public static String createMenuMsg(Menu menu){
		if(menu.getButton()==null || menu.getButton().length==0 || menu.getButton().length>3){
			return "菜单按钮数量不符合";
		}
		AccessToken accessToken = AdvancedUtil.getAccessToken();
        String url = WeChatConfiguration.MENU_CREATE_URL.replace("ACCESS_TOKEN", accessToken.getAccess_token());  
        String jsonMenu = JSONObject.fromObject(menu).toString();  
        JSONObject jsonObject = CommonUtil.httpsRequest(url, "POST", jsonMenu);  
        if (null != jsonObject) {
        	Integer errcode = jsonObject.getInt("errcode");
            if (0 != errcode) {
            	if(StringUtils.isNotBlank(WeChatErrorCode.errorCodeMap.get(errcode))){
            		return WeChatErrorCode.errorCodeMap.get(errcode);
            	}else{
            		return String.format("errcode:{%s} errmsg:{%s}",jsonObject.getInt("errcode"), jsonObject.getString("errmsg"));
            	}
            }
        }
		return "";
	}
	
	public static void main(String[] args) throws ClientProtocolException, IOException {
		AccessToken accessToken = AdvancedUtil.getAccessToken();
		String result = CommonUtil.httpGetRequest(WeChatConfiguration.USER_LIST_URL.replace("ACCESS_TOKEN", accessToken.getAccess_token()));
		System.out.println(result);
		JSONObject jsonObject = new JSONObject().fromObject(result);
		List<String> openids = new ArrayList<String>();
		if(jsonObject.containsKey("data")){
			JSONObject openidJsonObject = (JSONObject) jsonObject.get("data");
			System.out.println(openidJsonObject);
			openids = new Gson().fromJson(openidJsonObject.getString("openid"), new TypeToken<List<String>>(){}.getType());
		}
		for (String openid : openids) {
			if(openid.equals("oXWySjiKx0vEVHmMs-Ul9u8O4_vA")){
				boolean bool = sendTextMessage(openid, "测试文本消息");
				List<Article> articleList = new ArrayList<Article>();
				Article article = new Article("测试图文消息", "测试图文消息测试图文消息测试图文消息测试图文消息测试图文消息", "https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/static/protocol/https/global/img/icons_5c448026.gif", "www.baidu.com");
				articleList.add(article);articleList.add(article);articleList.add(article);
				bool = sendNewsMessage(openid, articleList);
			}
		}
	}

	/**
	 * 根据分页信息获得分页数据
	 * @param type 素材类型 （image,video,voice,news）
	 * @param offset
	 * @param pagesize
	 * @return
	 */
	public static Page getMaterialList( String type,int offset,int pagesize) {
		Page page = new Page();
		if(StringUtils.isBlank(type) || (!"image".equals(type)&&!"news".equals(type) && !"video".equals(type) && !"voice".equals(type))){
			page.setRows(null);
			page.setTotal(0);
			return page;
		}
		AccessToken accessToken = AdvancedUtil.getAccessToken();
		JSONObject jsonObject = AdvancedUtil.getMaterailListJson(accessToken.getAccess_token(), type, offset, pagesize);
		if(jsonObject!=null && jsonObject.containsKey("item")){
			if("news".equals(type)){
				List<NewsMaterial> list = new Gson().fromJson(jsonObject.getString("item"),  new TypeToken<List<NewsMaterial>>(){}.getType());
				page.setRows(list);
			}else{
				List<OtherMaterial> list = new Gson().fromJson(jsonObject.getString("item"),  new TypeToken<List<OtherMaterial>>(){}.getType());
				page.setRows(list);
			}
			page.setTotal(jsonObject.getInt("total_count"));
			return page;
		}
		page.setTotal(0);
		page.setRows(null);
		return page;
	}
}
