package com.weixin.util;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import javax.net.ssl.HttpsURLConnection;

import net.sf.json.JSONArray;
import net.sf.json.JSONException;
import net.sf.json.JSONObject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.weixin.configuration.WeChatConfiguration;
import com.weixin.material.BasicMaterial;
import com.weixin.material.NewsMaterial;
import com.weixin.material.OtherMaterial;
import com.weixin.material.UploadMaterail;
import com.weixin.message.resp.Article;
import com.weixin.message.resp.Music;
import com.weixin.pojo.AccessToken;
import com.weixin.pojo.JsApiTicket;
import com.weixin.pojo.KfInfo;
import com.weixin.pojo.OnLineKf;
import com.weixin.pojo.SNSUserInfo;
import com.weixin.pojo.WeChatGroup;
import com.weixin.pojo.WeChatMedia;
import com.weixin.pojo.WeChatOauth2Token;
import com.weixin.pojo.WeChatQRCode;
import com.weixin.pojo.WeChatUserInfo;
import com.weixin.pojo.WeChatUserList;

public class AdvancedUtil {
	private static Logger log = LoggerFactory.getLogger(AdvancedUtil.class);
	
	/**
	 * 获取在线客服列表
	 * @param accessToken
	 * @return
	 */
	public static List<OnLineKf> getOnLineKfList(String accessToken){
		String url = WeChatConfiguration.KF_ONLINE_LIST_URL.replace("ACCESS_TOKEN", accessToken);
		String result = CommonUtil.httpRequest(url);
		if(result.equals("{\"kf_online_list\":[]}")){
			Random random = new Random();
			int case1 = random.nextInt(10);
			int case2 = random.nextInt(10);
			int auto1 = random.nextInt(5);
			int auto2 = random.nextInt(5);
			result = "{\"kf_online_list\": [{\"kf_account\": \"test1@test\",\"status\": 1,\"kf_id\": \"1001\",\"auto_accept\": "+auto1+",\"accepted_case\": "+case1+"},{\"kf_account\": \"test2@test\",\"status\": 1,\"kf_id\": \"1002\",\"auto_accept\": "+auto2+",\"accepted_case\": "+case2+"}]}";
		};
		System.out.println(result);
		JSONObject jsonObject = JSONObject.fromObject(result);
		List<OnLineKf> fkList = new ArrayList<OnLineKf>();
		if(jsonObject.containsKey("kf_online_list")){
			fkList = new Gson().fromJson(jsonObject.getString("kf_online_list"), new TypeToken<List<OnLineKf>>(){}.getType());
		}
		return fkList;
	}
	
	/**
	 * 获取公众号所有客服人员
	 * @param accessToken
	 * @return
	 */
	public static List<KfInfo> getKfList(String accessToken){
		String url = WeChatConfiguration.KF_ALL_URL.replace("ACCESS_TOKEN", accessToken);
		String result = CommonUtil.httpGetRequest(url);
		System.out.println(result);
//		result = "{\"kf_list\":[{\"kf_account\":\"kf2001@gh_a7ccf31b9f9c\",\"kf_headimgurl\":\"http://mmbiz.qpic.cn/mmbiz/QfooYeGw5iacpapMaCAmAG5ahqjf5ibAQVGFyWmd9W3aO1GPg5KMxzX8NhWdl0eugLksjzibjyXlqnOkuvpicFg9Uw/300?wx_fmt=jpeg\",\"kf_id\":2001,\"kf_nick\":\"测试客服\",\"kf_wx\":\"pankesheng157\"},{\"kf_account\":\"kf2002@gh_a7ccf31b9f9c\",\"kf_headimgurl\":\"http://mmbiz.qpic.cn/mmbiz/QfooYeGw5iacpapMaCAmAG5ahqjf5ibAQVb3tKAyXicC6sq2L6nILmdncFBKeQiaG2JHuHsabibxFYs3iajvyovctYhA/300?wx_fmt=png\",\"kf_id\":2002,\"kf_nick\":\"测试客服2\",\"kf_wx\":\"lisfan\"},{\"kf_account\":\"kf2004@gh_a7ccf31b9f9c\",\"kf_headimgurl\":\"http://mmbiz.qpic.cn/mmbiz/QfooYeGw5iacpapMaCAmAG5ahqjf5ibAQVIbJG48QWkMuD5wic2yYXG1vJsYqRXPIgOKFhbS998giaRu8fBAbXNFuw/300?wx_fmt=png\",\"kf_id\":2004,\"kf_nick\":\"舟岛小鲜\",\"kf_wx\":\"yecool\"}]}";
		JSONObject jsonObject = JSONObject.fromObject(result);
		List<KfInfo> kfList = new ArrayList<KfInfo>();
		if(jsonObject.containsKey("kf_list")){
			kfList = new Gson().fromJson(jsonObject.getString("kf_list"), new TypeToken<List<KfInfo>>(){}.getType());
		}
		return kfList;
	}

	/**
	 * @Description: 组装文本客服消息
	 * @param openId
	 *            消息发送对象
	 * @param content
	 *            文本消息内容
	 * @return
	 * @throws
	 * @author Administrator
	 * @date 2015-12-22
	 */
	public static String makeTextCustomMessage(String openId, String content) {
		// 对消息内容中的双引号进行转义
		content = content.replace("\"", "\\\"");
		String jsonMsg = "{\"touser\":\"%s\",\"msgtype\":\"text\",\"text\":{\"content\":\"%s\"}}";
		return String.format(jsonMsg, openId, content);
	}

	/**
	 * @Description: 组装图片客服消息
	 * @param openId
	 *            消息发送对象
	 * @param mediaId
	 *            媒体文件id
	 * @return
	 * @throws
	 * @author Administrator
	 * @date 2015-12-22
	 */
	public static String makeImageCustomMessage(String openId, String mediaId) {
		String jsonMsg = "{\"touser\":\"%s\",\"msgtype\":\"image\",\"image\":{\"media_id\":\"%s\"}}";
		return String.format(jsonMsg, openId, mediaId);
	}

	/**
	 * @Description: 组装语音客服消息
	 * @param openId
	 *            消息发送对象
	 * @param mediaId
	 *            媒体文件id
	 * @return
	 * @throws
	 * @author Administrator
	 * @date 2015-12-22
	 */
	public static String makeVoiceCustomMessage(String openId, String mediaId) {
		String jsonMsg = "{\"touser\":\"%s\",\"msgtype\":\"voice\",\"voice\":{\"media_id\":\"%s\"}}";
		return String.format(jsonMsg, openId, mediaId);
	}

	/**
	 * @Description: 组装视频客服消息
	 * @param openId
	 *            消息发送对象
	 * @param mediaId
	 *            媒体文件id
	 * @param thumbMediaId
	 * @return
	 * @throws
	 * @author Administrator
	 * @date 2015-12-22
	 */
	public static String makeVideoCustomMessage(String openId, String mediaId,
			String thumbMediaId) {
		String jsonMsg = "{\"touser\":\"%s\",\"msgtype\":\"video\",\"video\":{\"media_id\":\"%s\",\"thumb_media_id\":\"%s\"}}";
		return String.format(jsonMsg, openId, mediaId, thumbMediaId);
	}

	/**
	 * @Description: 组装音乐客服消息
	 * @param openId
	 *            消息发送对象
	 * @param music
	 *            音乐对象
	 * @return
	 * @throws
	 * @author Administrator
	 * @date 2015-12-22
	 */
	public static String makeMusicCustomMessage(String openId, Music music) {
		String jsonMsg = "{\"touser\":\"%s\",\"msgtype\":\"music\",\"music\":%s}";
		jsonMsg = String.format(jsonMsg, openId, JSONObject.fromObject(music)
				.toString());
		// 将jsonMsg中的thumbmediaid替换为thumb_media_id
		jsonMsg = jsonMsg.replace("thumbmediaid", "thumb_media_id");
		return jsonMsg;
	}

	/**
	 * @Description: 组装图文客服消息
	 * @param openId
	 *            消息发送对象
	 * @param articleList
	 *            图文消息列表
	 * @return
	 * @throws
	 * @author Administrator
	 * @date 2015-12-22
	 */
	public static String makeNewsCustomMessage(String openId,
			List<Article> articleList) {
		String jsonMsg = "{\"touser\":\"%s\",\"msgtype\":\"news\",\"news\":{\"articles\":%s}}";
		jsonMsg = String.format(
				jsonMsg,
				openId,
				JSONArray.fromObject(articleList).toString()
						.replaceAll("\"", "\\\""));
		// 将jsonMsg中的picUrl替换为picurl
		jsonMsg = jsonMsg.replace("picUrl", "picurl");
		return jsonMsg;
	}

	/**
	 * @Description: 发送客服消息
	 * @param accessToken
	 *            接口访问凭证
	 * @param jsonMsg
	 *            json格式的客服消息（包括touser、msgtype和消息内容）
	 * @return
	 * @throws
	 * @author Administrator
	 * @date 2015-12-22
	 */
	public static boolean sendCustomMessage(String accessToken, String jsonMsg) {
		log.info("消息内容：{}", jsonMsg);
		boolean result = false;
		// 拼接请求地址
		String requestUrl =WeChatConfiguration.KF_MESSAGE_CUSTOM_SEND_URL;//"https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=ACCESS_TOKEN";
		requestUrl = requestUrl.replace("ACCESS_TOKEN", accessToken);
		// 发送客服消息
		JSONObject jsonObject = CommonUtil.httpsRequest(requestUrl, "POST",jsonMsg);
		if (null != jsonObject) {
			int errorCode = jsonObject.getInt("errcode");
			String errorMsg = jsonObject.getString("errmsg");
			if (0 == errorCode) {
				result = true;
				log.info("客服消息发送成功 errcode:{} errmsg:{}", errorCode, errorMsg);
			} else {
				log.error("客服消息发送失败 errcode:{} errmsg:{}", errorCode, errorMsg);
			}
		}
		return result;
	}

	/**
	 * 获取access_token
	 * 
	 * @param appid
	 *            凭证
	 * @param appsecret
	 *            密钥
	 * @return
	 */
	public static AccessToken getAccessToken(String appid, String appsecret) {
		System.out.println("accesstoken过期，重启获取accesstoken");
		AccessToken accessToken = null;
		String requestUrl = WeChatConfiguration.TOKEN_URL.replace("APPID",
				appid).replace("APPSECRET", appsecret);
		JSONObject jsonObject = CommonUtil
				.httpsRequest(requestUrl, "GET", null);
		// 如果请求成功
		if (null != jsonObject) {
			try {
				accessToken = new AccessToken();
				accessToken.setAccess_token(jsonObject.getString("access_token"));
				int expires_in = jsonObject.getInt("expires_in");
				long endtime = new Date().getTime()+expires_in*1000-500*1000;
				accessToken.setExpires_in(expires_in);
				accessToken.setEndtime(endtime);
			} catch (JSONException e) {
				accessToken = null;
				// 获取token失败
				System.out.println("获取token失败 errcode:{} errmsg:{}"
						+ jsonObject.getInt("errcode")
						+ jsonObject.getString("errmsg"));
				log.error("获取token失败 errcode:{} errmsg:{}",
						jsonObject.getInt("errcode"),
						jsonObject.getString("errmsg"));
			}
		}
		return accessToken;
	}

	/**
	 * @Description: 获取网页授权凭证
	 * @param appId
	 *            公众账号的唯一标识
	 * @param appSecret
	 *            公众账号的密钥
	 * @param code
	 * @return
	 * @throws
	 * @author Administrator
	 * @date 2015-12-22
	 */
	public static WeChatOauth2Token getOauth2AccessToken(String appId,
			String appSecret, String code) {
		WeChatOauth2Token wat = null;
		// 拼接请求地址
		String requestUrl = WeChatConfiguration.OAUTH2_ACCESSTOKEN_URL;// "https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code";
		requestUrl = requestUrl.replace("APPID", appId);
		requestUrl = requestUrl.replace("SECRET", appSecret);
		requestUrl = requestUrl.replace("CODE", code);

		// 获取网页授权凭证
		JSONObject jsonObject = CommonUtil
				.httpsRequest(requestUrl, "GET", null);
		if (null != jsonObject) {
			try {
				wat = new WeChatOauth2Token();
				wat.setAccessToken(jsonObject.getString("access_token"));
				wat.setExpiresIn(jsonObject.getInt("expires_in"));
				wat.setRefreshToken(jsonObject.getString("refresh_token"));
				wat.setOpenId(jsonObject.getString("openid"));
				wat.setScope(jsonObject.getString("scope"));
			} catch (Exception e) {
				wat = null;
				int errorCode = jsonObject.getInt("errcode");
				String errorMsg = jsonObject.getString("errmsg");
				log.error("获取网页授权凭证失败 errcode:{} errmsg:{}", errorCode,
						errorMsg);
			}
		}
		return wat;
	}

	/**
	 * @Description: 刷新网页授权凭证
	 * @param appId
	 *            公众账号的唯一标识
	 * @param refreshToken
	 * @return
	 * @throws
	 * @author Administrator
	 * @date 2015-12-22
	 */
	public static WeChatOauth2Token refreshOauth2AccessToken(String appId,
			String refreshToken) {
		WeChatOauth2Token wat = null;
		// 拼接请求地址			 
		String requestUrl = WeChatConfiguration.OAUTH2_REFRESHTOKEN_URL; //"https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=APPID&grant_type=refresh_token&refresh_token=REFRESH_TOKEN";
		requestUrl = requestUrl.replace("APPID", appId);
		requestUrl = requestUrl.replace("REFRESH_TOKEN", refreshToken);
		// 刷新网页授权凭证
		JSONObject jsonObject = CommonUtil
				.httpsRequest(requestUrl, "GET", null);
		if (null != jsonObject) {
			try {
				wat = new WeChatOauth2Token();
				wat.setAccessToken(jsonObject.getString("access_token"));
				wat.setExpiresIn(jsonObject.getInt("expires_in"));
				wat.setRefreshToken(jsonObject.getString("refresh_token"));
				wat.setOpenId(jsonObject.getString("openid"));
				wat.setScope(jsonObject.getString("scope"));
			} catch (Exception e) {
				wat = null;
				int errorCode = jsonObject.getInt("errcode");
				String errorMsg = jsonObject.getString("errmsg");
				log.error("刷新网页授权凭证失败 errcode:{} errmsg:{}", errorCode,
						errorMsg);
			}
		}
		return wat;
	}

	/**
	 * @Description: 通过网页授权获取用户信息
	 * @param accessToken
	 *            网页授权接口调用凭证
	 * @param openId
	 *            用户标识
	 * @return
	 * @throws
	 * @author Administrator
	 * @date 2015-12-22
	 */
	@SuppressWarnings({ "unchecked", "deprecation" })
	public static SNSUserInfo getSNSUserInfo(String accessToken, String openId) {
		SNSUserInfo snsUserInfo = null;
		// 拼接请求地址
		// access_token 是 调用接口凭证
		// openid 是 普通用户的标识，对当前公众号唯一
		// lang 否 返回国家地区语言版本，zh_CN 简体，zh_TW 繁体，en 英语
		String requestUrl = WeChatConfiguration.SNS_USERINFO_URL; //"https://api.weixin.qq.com/sns/userinfo?access_token=ACCESS_TOKEN&openid=OPENID&lang=zh_CN";
		requestUrl = requestUrl.replace("ACCESS_TOKEN", accessToken).replace(
				"OPENID", openId);
		// 通过网页授权获取用户信息
		JSONObject jsonObject = CommonUtil
				.httpsRequest(requestUrl, "GET", null);
		if (null != jsonObject) {
			try {
				snsUserInfo = new SNSUserInfo();
				// 用户的标识
				snsUserInfo.setOpenId(jsonObject.getString("openid"));
				// 昵称
				snsUserInfo.setNickname(jsonObject.getString("nickname"));
				// 性别（1是男性，2是女性，0是未知）
				snsUserInfo.setSex(jsonObject.getInt("sex"));
				// 用户所在国家
				snsUserInfo.setCountry(jsonObject.getString("country"));
				// 用户所在省份
				snsUserInfo.setProvince(jsonObject.getString("province"));
				// 用户所在城市
				snsUserInfo.setCity(jsonObject.getString("city"));
				// 用户头像
				snsUserInfo.setHeadImgUrl(jsonObject.getString("headimgurl"));
				//unionid (在公众号绑定到微信开放平台的时候才能获取到该值)
//				snsUserInfo.setUnionid(jsonObject.getString("unionid"));
				// 用户特权信息
				snsUserInfo.setPrivilegeList(JSONArray.toList(jsonObject.getJSONArray("privilege"), List.class));
			} catch (Exception e) {
				snsUserInfo = null;
				int errorCode = jsonObject.getInt("errcode");
				String errorMsg = jsonObject.getString("errmsg");
				log.error("获取用户信息失败 errcode:{} errmsg:{}", errorCode, errorMsg);
			}
		}
		return snsUserInfo;
	}

	/**
	 * @Description: 创建临时带参二维码
	 * @param accessToken
	 *            接口访问凭证
	 * @param expireSeconds
	 *            二维码有效时间，单位为秒，最大不超过1800
	 * @param sceneId
	 *            场景ID
	 * @return
	 * @throws
	 * @author Administrator
	 * @date 2015-12-22
	 */
	public static WeChatQRCode createTemporaryQRCode(String accessToken,
			int expireSeconds, int sceneId) {
		WeChatQRCode weixinQRCode = null;
		// 拼接请求地址
		String requestUrl = "https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=ACCESS_TOKEN";
		requestUrl = requestUrl.replace("ACCESS_TOKEN", accessToken);
		// 需要提交的json数据
		String jsonMsg = "{\"expire_seconds\": %d, \"action_name\": \"QR_SCENE\", \"action_info\": {\"scene\": {\"scene_id\": %d}}}";
		// 创建临时带参二维码
		JSONObject jsonObject = CommonUtil.httpsRequest(requestUrl, "POST",
				String.format(jsonMsg, expireSeconds, sceneId));

		if (null != jsonObject) {
			try {
				weixinQRCode = new WeChatQRCode();
				weixinQRCode.setTicket(jsonObject.getString("ticket"));
				weixinQRCode.setExpireSeconds(jsonObject
						.getInt("expire_seconds"));
				log.info("创建临时带参二维码成功 ticket:{} expire_seconds:{}",
						weixinQRCode.getTicket(),
						weixinQRCode.getExpireSeconds());
			} catch (Exception e) {
				weixinQRCode = null;
				int errorCode = jsonObject.getInt("errcode");
				String errorMsg = jsonObject.getString("errmsg");
				log.error("创建临时带参二维码失败 errcode:{} errmsg:{}", errorCode,
						errorMsg);
			}
		}
		return weixinQRCode;
	}

	/**
	 * @Description: 创建永久带参二维码
	 * @param accessToken
	 *            接口访问凭证
	 * @param sceneId
	 *            场景ID
	 * @return
	 * @throws
	 * @author Administrator
	 * @date 2015-12-22
	 */
	public static String createPermanentQRCode(String accessToken, int sceneId) {
		String ticket = null;
		// 拼接请求地址
		String requestUrl = "https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=ACCESS_TOKEN";
		requestUrl = requestUrl.replace("ACCESS_TOKEN", accessToken);
		// 需要提交的json数据
		String jsonMsg = "{\"action_name\": \"QR_LIMIT_SCENE\", \"action_info\": {\"scene\": {\"scene_id\": %d}}}";
		// 创建永久带参二维码
		JSONObject jsonObject = CommonUtil.httpsRequest(requestUrl, "POST",
				String.format(jsonMsg, sceneId));

		if (null != jsonObject) {
			try {
				ticket = jsonObject.getString("ticket");
				log.info("创建永久带参二维码成功 ticket:{}", ticket);
			} catch (Exception e) {
				int errorCode = jsonObject.getInt("errcode");
				String errorMsg = jsonObject.getString("errmsg");
				log.error("创建永久带参二维码失败 errcode:{} errmsg:{}", errorCode,
						errorMsg);
			}
		}
		return ticket;
	}

	/**
	 * @Description: 根据ticket换取二维码
	 * @param ticket
	 *            二维码ticket
	 * @param savePath
	 *            保存路径
	 * @return
	 * @throws
	 * @author Administrator
	 * @date 2015-12-22
	 */
	public static String getQRCode(String ticket, String savePath) {
		String filePath = null;
		// 拼接请求地址
		String requestUrl = "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=TICKET";
		requestUrl = requestUrl.replace("TICKET",
				CommonUtil.urlEncodeUTF8(ticket));
		try {
			URL url = new URL(requestUrl);
			HttpsURLConnection conn = (HttpsURLConnection) url.openConnection();
			conn.setDoInput(true);
			conn.setRequestMethod("GET");

			if (!savePath.endsWith("/")) {
				savePath += "/";
			}
			// 将ticket作为文件名
			filePath = savePath + ticket + ".jpg";

			// 将微信服务器返回的输入流写入文件
			BufferedInputStream bis = new BufferedInputStream(
					conn.getInputStream());
			FileOutputStream fos = new FileOutputStream(new File(filePath));
			byte[] buf = new byte[8096];
			int size = 0;
			while ((size = bis.read(buf)) != -1)
				fos.write(buf, 0, size);
			fos.close();
			bis.close();

			conn.disconnect();
			log.info("根据ticket换取二维码成功，filePath=" + filePath);
		} catch (Exception e) {
			filePath = null;
			log.error("根据ticket换取二维码失败：{}", e);
		}
		return filePath;
	}

	/**
	 * @Description: 获取用户信息
	 * @param accessToken
	 *            接口访问凭证
	 * @param openId
	 *            用户标识
	 * @return
	 * @throws
	 * @author Administrator
	 * @date 2015-12-22
	 */
	public static WeChatUserInfo getUserInfo(String accessToken, String openId) {
		WeChatUserInfo weixinUserInfo = null;
		// 拼接请求地址
		String requestUrl = WeChatConfiguration.USER_INFO_URL; // "https://api.weixin.qq.com/cgi-bin/user/info?access_token=ACCESS_TOKEN&openid=OPENID&lang=zh_CN";
		requestUrl = requestUrl.replace("ACCESS_TOKEN", accessToken).replace(
				"OPENID", openId);
		// 获取用户信息
		JSONObject jsonObject = CommonUtil
				.httpsRequest(requestUrl, "GET", null);

		if (null != jsonObject) {
			try {
				weixinUserInfo = new WeChatUserInfo();
				// 用户的标识
				weixinUserInfo.setOpenId(jsonObject.getString("openid"));
				// 关注状态（1是关注，0是未关注），未关注时获取不到其余信息
				weixinUserInfo.setSubscribe(jsonObject.getInt("subscribe"));
				// 用户关注时间
				weixinUserInfo.setSubscribeTime(jsonObject
						.getString("subscribe_time"));
				// 昵称
				weixinUserInfo.setNickname(jsonObject.getString("nickname"));
				// 用户的性别（1是男性，2是女性，0是未知）
				weixinUserInfo.setSex(jsonObject.getInt("sex"));
				// 用户所在国家
				weixinUserInfo.setCountry(jsonObject.getString("country"));
				// 用户所在省份
				weixinUserInfo.setProvince(jsonObject.getString("province"));
				// 用户所在城市
				weixinUserInfo.setCity(jsonObject.getString("city"));
				// 用户的语言，简体中文为zh_CN
				weixinUserInfo.setLanguage(jsonObject.getString("language"));
				// 用户头像
				weixinUserInfo
						.setHeadImgUrl(jsonObject.getString("headimgurl"));
			} catch (Exception e) {
				if (0 == weixinUserInfo.getSubscribe()) {
					log.error("用户{}已取消关注", weixinUserInfo.getOpenId());
				} else {
					int errorCode = jsonObject.getInt("errcode");
					String errorMsg = jsonObject.getString("errmsg");
					log.error("获取用户信息失败 errcode:{} errmsg:{}", errorCode,
							errorMsg);
				}
			}
		}
		return weixinUserInfo;
	}

	/**
	 * @Description: 获取关注者列表
	 * @param accessToken
	 *            调用接口凭证
	 * @param nextOpenId
	 *            第一个拉取的openId，不填默认从头开始拉取
	 * @return
	 * @throws
	 * @author Administrator
	 * @date 2015-12-22
	 */
	@SuppressWarnings({ "unchecked", "deprecation" })
	public static WeChatUserList getUserList(String accessToken,
			String nextOpenId) {
		WeChatUserList weixinUserList = null;
		if (null == nextOpenId) {
			nextOpenId = "";
		}
		// 拼接请求地址
		String requestUrl = "https://api.weixin.qq.com/cgi-bin/user/get?access_token=ACCESS_TOKEN&next_openid=NEXT_OPENID";
		requestUrl = requestUrl.replace("ACCESS_TOKEN", accessToken).replace(
				"NEXT_OPENID", nextOpenId);
		// 获取关注者列表
		JSONObject jsonObject = CommonUtil
				.httpsRequest(requestUrl, "GET", null);
		// 如果请求成功
		if (null != jsonObject) {
			try {
				weixinUserList = new WeChatUserList();
				weixinUserList.setTotal(jsonObject.getInt("total"));
				weixinUserList.setCount(jsonObject.getInt("count"));
				weixinUserList.setNextOpenId(jsonObject
						.getString("next_openid"));
				JSONObject dataObject = (JSONObject) jsonObject.get("data");
				weixinUserList.setOpenIdList(JSONArray.toList(
						dataObject.getJSONArray("openid"), List.class));
			} catch (JSONException e) {
				weixinUserList = null;
				int errorCode = jsonObject.getInt("errcode");
				String errorMsg = jsonObject.getString("errmsg");
				log.error("获取关注者列表失败 errcode:{} errmsg:{}", errorCode, errorMsg);
			}
		}
		return weixinUserList;
	}

	/**
	 * @Description: 查询分组
	 * @param accessToken
	 *            调用接口凭证
	 * @return
	 * @throws
	 * @author Administrator
	 * @date 2015-12-22
	 */
	@SuppressWarnings({ "unchecked", "deprecation" })
	public static List<WeChatGroup> getGroups(String accessToken) {
		List<WeChatGroup> weixinGroupList = null;
		// 拼接请求地址
		String requestUrl = "https://api.weixin.qq.com/cgi-bin/groups/get?access_token=ACCESS_TOKEN";
		requestUrl = requestUrl.replace("ACCESS_TOKEN", accessToken);
		// 查询分组
		JSONObject jsonObject = CommonUtil
				.httpsRequest(requestUrl, "GET", null);

		if (null != jsonObject) {
			try {
				weixinGroupList = JSONArray.toList(
						jsonObject.getJSONArray("groups"), WeChatGroup.class);
			} catch (JSONException e) {
				weixinGroupList = null;
				int errorCode = jsonObject.getInt("errcode");
				String errorMsg = jsonObject.getString("errmsg");
				log.error("查询分组失败 errcode:{} errmsg:{}", errorCode, errorMsg);
			}
		}
		return weixinGroupList;
	}

	/**
	 * @Description: 创建分组
	 * @param accessToken
	 *            接口访问凭证
	 * @param groupName
	 *            分组名称
	 * @return
	 * @throws
	 * @author Administrator
	 * @date 2015-12-22
	 */
	public static WeChatGroup createGroup(String accessToken, String groupName) {
		WeChatGroup weixinGroup = null;
		// 拼接请求地址
		String requestUrl = "https://api.weixin.qq.com/cgi-bin/groups/create?access_token=ACCESS_TOKEN";
		requestUrl = requestUrl.replace("ACCESS_TOKEN", accessToken);
		// 需要提交的json数据
		String jsonData = "{\"group\" : {\"name\" : \"%s\"}}";
		// 创建分组
		JSONObject jsonObject = CommonUtil.httpsRequest(requestUrl, "POST",
				String.format(jsonData, groupName));

		if (null != jsonObject) {
			try {
				weixinGroup = new WeChatGroup();
				weixinGroup.setId(jsonObject.getJSONObject("group")
						.getInt("id"));
				weixinGroup.setName(jsonObject.getJSONObject("group")
						.getString("name"));
			} catch (JSONException e) {
				weixinGroup = null;
				int errorCode = jsonObject.getInt("errcode");
				String errorMsg = jsonObject.getString("errmsg");
				log.error("创建分组失败 errcode:{} errmsg:{}", errorCode, errorMsg);
			}
		}
		return weixinGroup;
	}

	/**
	 * @Description: 修改分组名
	 * @param accessToken
	 *            接口访问凭证
	 * @param groupId
	 *            分组id
	 * @param groupName
	 *            修改后的分组名
	 * @return
	 * @throws
	 * @author Administrator
	 * @date 2015-12-22
	 */
	public static boolean updateGroup(String accessToken, int groupId,
			String groupName) {
		boolean result = false;
		// 拼接请求地址
		String requestUrl = "https://api.weixin.qq.com/cgi-bin/groups/update?access_token=ACCESS_TOKEN";
		requestUrl = requestUrl.replace("ACCESS_TOKEN", accessToken);
		// 需要提交的json数据
		String jsonData = "{\"group\": {\"id\": %d, \"name\": \"%s\"}}";
		// 修改分组名
		JSONObject jsonObject = CommonUtil.httpsRequest(requestUrl, "POST",
				String.format(jsonData, groupId, groupName));
		if (null != jsonObject) {
			int errorCode = jsonObject.getInt("errcode");
			String errorMsg = jsonObject.getString("errmsg");
			if (0 == errorCode) {
				result = true;
				log.info("修改分组名成功 errcode:{} errmsg:{}", errorCode, errorMsg);
			} else {
				log.error("修改分组名失败 errcode:{} errmsg:{}", errorCode, errorMsg);
			}
		}
		return result;
	}

	/**
	 * @Description: 移动用户分组
	 * @param accessToken
	 *            接口访问凭证
	 * @param openId
	 *            用户标识
	 * @param groupId
	 *            分组id
	 * @return
	 * @throws
	 * @author Administrator
	 * @date 2015-12-22
	 */
	public static boolean updateMemberGroup(String accessToken, String openId,
			int groupId) {
		boolean result = false;
		// 拼接请求地址
		String requestUrl = "https://api.weixin.qq.com/cgi-bin/groups/members/update?access_token=ACCESS_TOKEN";
		requestUrl = requestUrl.replace("ACCESS_TOKEN", accessToken);
		// 需要提交的json数据
		String jsonData = "{\"openid\":\"%s\",\"to_groupid\":%d}";
		// 移动用户分组
		JSONObject jsonObject = CommonUtil.httpsRequest(requestUrl, "POST",
				String.format(jsonData, openId, groupId));

		if (null != jsonObject) {
			int errorCode = jsonObject.getInt("errcode");
			String errorMsg = jsonObject.getString("errmsg");
			if (0 == errorCode) {
				result = true;
				log.info("移动用户分组成功 errcode:{} errmsg:{}", errorCode, errorMsg);
			} else {
				log.error("移动用户分组失败 errcode:{} errmsg:{}", errorCode, errorMsg);
			}
		}
		return result;
	}

	/**
	 * @Description: 上传媒体文件
	 * @param accessToken
	 *            接口访问凭证
	 * @param type
	 *            媒体文件类型（image、voice、video和thumb）
	 * @param mediaFileUrl
	 *            媒体文件的url
	 * @return
	 * @throws
	 * @author Administrator
	 * @date 2015-12-22
	 */
	public static WeChatMedia uploadMedia(String accessToken, String type,
			String mediaFileUrl) {
		WeChatMedia weixinMedia = null;
		// 拼装请求地址
		String uploadMediaUrl = "http://file.api.weixin.qq.com/cgi-bin/media/upload?access_token=ACCESS_TOKEN&type=TYPE";
		uploadMediaUrl = uploadMediaUrl.replace("ACCESS_TOKEN", accessToken)
				.replace("TYPE", type);

		// 定义数据分隔符
		String boundary = "------------7da2e536604c8";
		try {
			URL uploadUrl = new URL(uploadMediaUrl);
			HttpURLConnection uploadConn = (HttpURLConnection) uploadUrl
					.openConnection();
			uploadConn.setDoOutput(true);
			uploadConn.setDoInput(true);
			uploadConn.setRequestMethod("POST");
			// 设置请求头Content-Type
			uploadConn.setRequestProperty("Content-Type",
					"multipart/form-data;boundary=" + boundary);
			// 获取媒体文件上传的输出流（往微信服务器写数据）
			OutputStream outputStream = uploadConn.getOutputStream();

			URL mediaUrl = new URL(mediaFileUrl);
			HttpURLConnection meidaConn = (HttpURLConnection) mediaUrl
					.openConnection();
			meidaConn.setDoOutput(true);
			meidaConn.setRequestMethod("GET");

			// 从请求头中获取内容类型
			String contentType = meidaConn.getHeaderField("Content-Type");
			// 根据内容类型判断文件扩展名
			String fileExt = CommonUtil.getFileExt(contentType);
			// 请求体开始
			outputStream.write(("--" + boundary + "\r\n").getBytes());
			outputStream
					.write(String
							.format("Content-Disposition: form-data; name=\"media\"; filename=\"file1%s\"\r\n",
									fileExt).getBytes());
			outputStream.write(String.format("Content-Type: %s\r\n\r\n",
					contentType).getBytes());

			// 获取媒体文件的输入流（读取文件）
			BufferedInputStream bis = new BufferedInputStream(
					meidaConn.getInputStream());
			byte[] buf = new byte[8096];
			int size = 0;
			while ((size = bis.read(buf)) != -1) {
				// 将媒体文件写到输出流（往微信服务器写数据）
				outputStream.write(buf, 0, size);
			}
			// 请求体结束
			outputStream.write(("\r\n--" + boundary + "--\r\n").getBytes());
			outputStream.close();
			bis.close();
			meidaConn.disconnect();

			// 获取媒体文件上传的输入流（从微信服务器读数据）
			InputStream inputStream = uploadConn.getInputStream();
			InputStreamReader inputStreamReader = new InputStreamReader(
					inputStream, "utf-8");
			BufferedReader bufferedReader = new BufferedReader(
					inputStreamReader);
			StringBuffer buffer = new StringBuffer();
			String str = null;
			while ((str = bufferedReader.readLine()) != null) {
				buffer.append(str);
			}
			bufferedReader.close();
			inputStreamReader.close();
			// 释放资源
			inputStream.close();
			inputStream = null;
			uploadConn.disconnect();

			// 使用JSON-lib解析返回结果
			JSONObject jsonObject = JSONObject.fromObject(buffer.toString());
			weixinMedia = new WeChatMedia();
			weixinMedia.setType(jsonObject.getString("type"));
			// type等于thumb时的返回结果和其它类型不一样
			if ("thumb".equals(type))
				weixinMedia.setMediaId(jsonObject.getString("thumb_media_id"));
			else
				weixinMedia.setMediaId(jsonObject.getString("media_id"));
			weixinMedia.setCreatedAt(jsonObject.getInt("created_at"));
		} catch (Exception e) {
			weixinMedia = null;
			log.error("上传媒体文件失败：{}", e);
		}
		return weixinMedia;
	}

	/**
	 * @Description: 下载媒体文件
	 * @param accessToken
	 *            接口访问凭证
	 * @param mediaId
	 *            媒体文件标识
	 * @param savePath
	 *            文件在服务器上的存储路径
	 * @return
	 * @throws
	 * @author Administrator
	 * @date 2015-12-22
	 */
	public static String getMedia(String accessToken, String mediaId,
			String savePath) {
		String filePath = null;
		// 拼接请求地址
		String requestUrl = "http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=ACCESS_TOKEN&media_id=MEDIA_ID";
		requestUrl = requestUrl.replace("ACCESS_TOKEN", accessToken).replace(
				"MEDIA_ID", mediaId);
		System.out.println(requestUrl);
		try {
			URL url = new URL(requestUrl);
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setDoInput(true);
			conn.setRequestMethod("GET");

			if (!savePath.endsWith("/")) {
				savePath += "/";
			}
			// 根据内容类型获取扩展名
			String fileExt = CommonUtil.getFileExt(conn
					.getHeaderField("Content-Type"));
			// 将mediaId作为文件名
			filePath = savePath + mediaId + fileExt;

			BufferedInputStream bis = new BufferedInputStream(
					conn.getInputStream());
			FileOutputStream fos = new FileOutputStream(new File(filePath));
			byte[] buf = new byte[8096];
			int size = 0;
			while ((size = bis.read(buf)) != -1)
				fos.write(buf, 0, size);
			fos.close();
			bis.close();

			conn.disconnect();
			log.info("下载媒体文件成功，filePath=" + filePath);
		} catch (Exception e) {
			filePath = null;
			log.error("下载媒体文件失败：{}", e);
		}
		return filePath;
	}
	

	/***
	 * 素材管理相关
	 */
	/**
	 * 
	 * @param accessToken 访问令牌
	 * @param file	文件地址
	 * @param title	素材标题
	 * @param introduction	素材描述
	 * @return 
	 */
	public static UploadMaterail uploadMaterail(String accessToken,File file,String title,String introduction){
		try {
			//这块是用来处理如果上传的类型时video的类型的
			JSONObject json = new JSONObject();
			json.put("title", title);
			json.put("introduction", introduction);
			
			//请求地址
			String uploadMediaUrl = WeChatConfiguration.MATERIAL_ADD_MATERIAL.replace("ACCESS_TOKEN", accessToken);
			URL url = new URL(uploadMediaUrl);
			String result = null;
			long filelength = file.length();
			String fileName = file.getName();
			String suffix = fileName.substring(fileName.lastIndexOf("."),fileName.length());
			String type = "";//根据后缀suffix进行判断类型
			if("bmp".equals(suffix) || "png".equals(suffix) || "jpeg".equals(suffix) || "jpg".equals(suffix)||"gif".equals(suffix)){
				type = "images";
			}else if("mp3".equals(suffix) || "wma".equals(suffix) || "wav".equals(suffix) ||"amr".equals(suffix)){
				type = "voice";
			}else if("mp4".equals(suffix)){
				type = "video";
			}
			
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod("POST");
			conn.setDoInput(true);
			conn.setDoOutput(true);
			conn.setUseCaches(false); //post方式不能使用缓存
			//设置请求头信息
			conn.setRequestProperty("Connection", "Keep-Alive");
			conn.setRequestProperty("Charset", "UTF-8");
			
			//设置边界，这里的boundary 是http协议里面的分割符，（http协议 boundary）
			String boundary = "----------" + System.currentTimeMillis(); 
			conn.setRequestProperty("Content-Type", "multipart/form-data;boundary="+boundary);
			
			//请求正文信息
			//第一部分
			StringBuilder sb = new StringBuilder();
			
			//这块是post提交type值也就是文件对应的mime类型的值
			sb.append("--");//必须多两道线 http协议要求的，用来分隔提交的参数用的
			sb.append(boundary);
			sb.append("\r\n");
			sb.append("Content-Disposition: form-data;name=\"type\" \r\n\r\n"); //这里是参数名，参数名和值之间要用两次  
			sb.append(type+"\r\n"); //参数的值  
			
			//这块是上传video是必须的参数，你们可以在这里根据文件类型做if/else 判断  
            if("video".equals(type)){
				sb.append("--"); // 必须多两道线  
	            sb.append(boundary);  
	            sb.append("\r\n");  
	            sb.append("Content-Disposition: form-data;name=\"description\" \r\n\r\n");  
	            sb.append(json.toString()+"\r\n");  
            }
            /** 
             * 这里重点说明下，上面两个参数完全可以写在url地址后面 就想我们平时url地址传参一样， 
             * http://api.weixin.qq.com/cgi-bin/material/add_material?access_token=##ACCESS_TOKEN##&type=""&description={} 这样，如果写成这样，上面的 
             * 那两个参数的代码就不用写了，不过media参数能否这样提交我没有试，感兴趣的可以试试 
             */  
              
            sb.append("--"); // 必须多两道线  
            sb.append(boundary);  
            sb.append("\r\n");  
            //这里是media参数相关的信息，这里是否能分开下我没有试，感兴趣的可以试试  
            sb.append("Content-Disposition: form-data;name=\"media\";filename=\""+ fileName + "\";filelength=\"" + filelength + "\" \r\n");  
            sb.append("Content-Type:application/octet-stream\r\n\r\n");  
//          System.out.println(sb.toString());  
            byte[] head = sb.toString().getBytes("utf-8");  
            // 获得输出流  
            OutputStream out = new DataOutputStream(conn.getOutputStream());  
            // 输出表头  
            out.write(head);  
            // 文件正文部分  
            // 把文件已流文件的方式 推入到url中  
            DataInputStream in = new DataInputStream(new FileInputStream(file));  
            int bytes = 0;  
            byte[] bufferOut = new byte[1024];  
            while ((bytes = in.read(bufferOut)) != -1) {  
                out.write(bufferOut, 0, bytes);  
            }  
            in.close();  
            // 结尾部分，这里结尾表示整体的参数的结尾，结尾要用"--"作为结束，这些都是http协议的规定  
            byte[] foot = ("\r\n--" + boundary + "--\r\n").getBytes("utf-8");// 定义最后数据分隔线  
            out.write(foot);  
            out.flush();  
            out.close();  
            StringBuffer buffer = new StringBuffer();  
            BufferedReader reader = null;  
            // 定义BufferedReader输入流来读取URL的响应  
            reader = new BufferedReader(new InputStreamReader(  
            		conn.getInputStream()));  
            String line = null;  
            while ((line = reader.readLine()) != null) {  
                buffer.append(line);  
            }  
            if (result == null) {  
                result = buffer.toString();  
            }  
            // 使用JSON-lib解析返回结果  
            JSONObject jsonObject = JSONObject.fromObject(result);
            UploadMaterail materail = new UploadMaterail();
            if(jsonObject!=null && jsonObject.containsKey("media_id")){
            	materail.setMedia_id(jsonObject.getString("media_id"));
            	if(jsonObject.containsKey("url")){
            		materail.setUrl(jsonObject.getString("url"));
            	}
            }
            return materail;
        } catch (IOException e) { 
            e.printStackTrace(); 
            return null;
        }
	}
	
	/**
	 * 根据分页信息 类型获得jsonObejct对象 在这个方法中可以自由在jsonObject 获取素材总数等信息
	 * @param accessToken
	 * @param type
	 * @param offset
	 * @param count
	 * @return
	 */
	public static JSONObject getMaterailListJson(String accessToken,String type,int offset,int count){
		String url = WeChatConfiguration.MATERIAL_BATCHGET_URL.replace("ACCESS_TOKEN", accessToken);
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("type", type);
		params.put("offset", offset);
		params.put("count", count);
		String result = CommonUtil.httpPostRequest(url, params);
		JSONObject jsonObject = JSONObject.fromObject(result);
		return jsonObject;
	}
	
	/**
	 * 根据分页信息 类型获取素材列表信息，不包含素材数量等信息
	 * @param accessToken
	 * @param type
	 * @param offset
	 * @param count
	 * @return
	 */
	public static List<BasicMaterial> getMaterailList(String accessToken,String type,int offset,int count){
		String url = WeChatConfiguration.MATERIAL_BATCHGET_URL.replace("ACCESS_TOKEN", accessToken);
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("type", type);
		params.put("offset", offset);
		params.put("count", count);
		String result = CommonUtil.httpPostRequest(url, params);
		JSONObject jsonObject = JSONObject.fromObject(result);
		if(jsonObject!=null && jsonObject.containsKey("item")){
			List<BasicMaterial> list = new ArrayList<BasicMaterial>();
			if("news".equals(type)){
				list = new Gson().fromJson(jsonObject.getString("item"),  new TypeToken<List<NewsMaterial>>(){}.getType());
			}else{
				list = new Gson().fromJson(jsonObject.getString("item"),  new TypeToken<List<OtherMaterial>>(){}.getType());
			}
			return list;
		}
		return null;
	}
	
	/**
	 * 获取保存的accesstoken 如果accesstoken为null 或者过去重新获取accesstoken
	 * @return
	 */
	public static AccessToken getAccessToken(){
		AccessToken accessToken = WeChatConfiguration.accessToken;
		if(accessToken==null || accessToken.getEndtime()<new Date().getTime()){
			accessToken = AdvancedUtil.getAccessToken(WeChatConfiguration.appId, WeChatConfiguration.appSecret);
			WeChatConfiguration.accessToken = accessToken;
		}
		return accessToken;
	}
	
	
	 public static JsApiTicket getJsApiTicket(String accessToken) {  
       JsApiTicket jsApiTicket = null;  
       String requestUrl = WeChatConfiguration.JSAPI_TICKET_URL.replace("ACCESS_TOKEN", accessToken);  
       JSONObject jsonObject = CommonUtil.httpsRequest(requestUrl, "GET", null);  
       // 如果请求成功  
       if (null != jsonObject) {  
           try {  
               jsApiTicket = new JsApiTicket();  
               jsApiTicket.setTicket(jsonObject.getString("ticket")); 
               int expires_in = jsonObject.getInt("expires_in");
               long endtime = new Date().getTime()+expires_in*1000 - 500*1000;
               jsApiTicket.setExpires_in(expires_in);
               jsApiTicket.setEndtime(endtime);
           } catch (JSONException e) {  
               accessToken = null;  
               // 获取jsApiTicket失败  
               log.error("获取jsApiTicket失败 errcode:{} errmsg:{}", jsonObject.getInt("errcode"), jsonObject.getString("errmsg"));  
           }  
       }  
       return jsApiTicket;  
   }
	
	/**
	 * 获取jsapiticket 如果为空或者过期 重新发起请求获取
	 * @return
	 */
	public static JsApiTicket getJsApiTicket(){
		JsApiTicket jsApiTicket = WeChatConfiguration.jsapi_ticket;
		if(jsApiTicket==null || jsApiTicket.getEndtime()<jsApiTicket.getEndtime()){
			AccessToken accessToken = AdvancedUtil.getAccessToken();
			jsApiTicket = AdvancedUtil.getJsApiTicket(accessToken.getAccess_token());
			WeChatConfiguration.jsapi_ticket = jsApiTicket;
		}
		return jsApiTicket;
	}
	
	
	public static void main(String args[]) {
		String type = "image";
		AccessToken accessToken = AdvancedUtil.getAccessToken(WeChatConfiguration.appId, WeChatConfiguration.appSecret);
		JSONObject jsonObject = getMaterailListJson(accessToken.getAccess_token(), type, 0, 50);
		if(jsonObject!=null && jsonObject.containsKey("item")){
			List<BasicMaterial> list = new ArrayList<BasicMaterial>();
			//List<String> itemList = new Gson().fromJson(jsonObject.getString("item"), new TypeToken<List<String>>(){}.getType());
			if("news".equals(type)){
				list = new Gson().fromJson(jsonObject.getString("item"),  new TypeToken<List<NewsMaterial>>(){}.getType());
			}else{
				list = new Gson().fromJson(jsonObject.getString("item"),  new TypeToken<List<OtherMaterial>>(){}.getType());
			}
			System.out.println(list.size());
		}
//			List<String> itemList = new Gson().fromJson(jsonObject.getString("item"), new TypeToken<List<String>>(){}.getType());
//			List<BasicMaterial> list = new ArrayList<BasicMaterial>();
//			for (String itemStr : itemList) {
//				JSONObject itemJson = JSONObject.fromObject(itemStr);
//				if(itemJson.containsKey("content")){
//					String newsJson = itemJson.getJSONObject("content").getString("news_item");
//					List<MaterialNews> news = new Gson().fromJson(newsJson, new TypeToken<List<MaterialNews>>(){}.getType());
//					ImageMaterial im = new ImageMaterial();
//					im.setNews_item(news);
//					im.setMedia_id(itemJson.getString("media_id"));
//					im.setUpdate_time(itemJson.getString("update_time"));
//					list.add(im);
//				}else{
//					OtherMaterial om = new OtherMaterial();
//					om.setMedia_id(itemJson.getString("media_id"));
//					om.setUpdate_time(itemJson.getString("update_time"));
//					om.setName(itemJson.getString("name"));
//					om.setUrl(itemJson.getString("url"));
//					list.add(om);
//				}
//			}
//		}
		
		//		File file = new File("E:/images/404.jpg");
//		WeChatMaterail materail = uploadMaterail(accessToken.getAccess_token(), file, "标题", "描述");
//		System.out.println(materail.getMedia_id()); 
//		
//		// 获取接口访问凭证
//		String accessToken = CommonUtil.getToken("APPID", "APPSECRET")
//				.getAccessToken();
//
//		/**
//		 * 发送客服消息（文本消息）
//		 */
//		// 组装文本客服消息
//		String jsonTextMsg = makeTextCustomMessage(
//				"oEdzejiHCDqafJbz4WNJtWTMbDcE",
//				"点击查看<a href=\"http://blog.csdn.net/lyq8479\">柳峰的博客</a>");
//		// 发送客服消息
//		sendCustomMessage(accessToken, jsonTextMsg);
//
//		/**
//		 * 发送客服消息（图文消息）
//		 */
//		Article article1 = new Article();
//		article1.setTitle("微信上也能斗地主");
//		article1.setDescription("");
//		article1.setPicUrl("http://www.egouji.com/xiaoq/game/doudizhu_big.png");
//		article1.setUrl("http://resource.duopao.com/duopao/games/small_games/weixingame/Doudizhu/doudizhu.htm");
//		Article article2 = new Article();
//		article2.setTitle("傲气雄鹰\n80后不得不玩的经典游戏");
//		article2.setDescription("");
//		article2.setPicUrl("http://www.egouji.com/xiaoq/game/aoqixiongying.png");
//		article2.setUrl("http://resource.duopao.com/duopao/games/small_games/weixingame/Plane/aoqixiongying.html");
//		List<Article> list = new ArrayList<Article>();
//		list.add(article1);
//		list.add(article2);
//		// 组装图文客服消息
//		String jsonNewsMsg = makeNewsCustomMessage(
//				"oEdzejiHCDqafJbz4WNJtWTMbDcE", list);
//		// 发送客服消息
//		sendCustomMessage(accessToken, jsonNewsMsg);
//
//		/**
//		 * 创建临时二维码
//		 */
//		WeChatQRCode weixinQRCode = createTemporaryQRCode(accessToken, 900,
//				111111);
//		// 临时二维码的ticket
//		System.out.println(weixinQRCode.getTicket());
//		// 临时二维码的有效时间
//		System.out.println(weixinQRCode.getExpireSeconds());
//
//		/**
//		 * 根据ticket换取二维码
//		 */
//		String ticket = "gQEg7zoAAAAAAAAAASxodHRwOi8vd2VpeGluLnFxLmNvbS9xL2lIVVJ3VmJsTzFsQ0ZuQ0Y1bG5WAAIEW35+UgMEAAAAAA==";
//		String savePath = "G:/download";
//		// 根据ticket换取二维码
//		getQRCode(ticket, savePath);
//
//		/**
//		 * 获取用户信息
//		 */
//		WeChatUserInfo user = getUserInfo(accessToken,
//				"oEdzejiHCDqafJbz4WNJtWTMbDcE");
//		System.out.println("OpenID：" + user.getOpenId());
//		System.out.println("关注状态：" + user.getSubscribe());
//		System.out.println("关注时间：" + user.getSubscribeTime());
//		System.out.println("昵称：" + user.getNickname());
//		System.out.println("性别：" + user.getSex());
//		System.out.println("国家：" + user.getCountry());
//		System.out.println("省份：" + user.getProvince());
//		System.out.println("城市：" + user.getCity());
//		System.out.println("语言：" + user.getLanguage());
//		System.out.println("头像：" + user.getHeadImgUrl());
//
//		/**
//		 * 获取关注者列表
//		 */
//		WeChatUserList weixinUserList = getUserList(accessToken, "");
//		System.out.println("总关注用户数：" + weixinUserList.getTotal());
//		System.out.println("本次获取用户数：" + weixinUserList.getCount());
//		System.out.println("OpenID列表："
//				+ weixinUserList.getOpenIdList().toString());
//		System.out.println("next_openid：" + weixinUserList.getNextOpenId());
//
//		/**
//		 * 查询分组
//		 */
//		List<WeChatGroup> groupList = getGroups(accessToken);
//		// 循环输出各分组信息
//		for (WeChatGroup group : groupList) {
//			System.out.println(String.format("ID：%d 名称：%s 用户数：%d",
//					group.getId(), group.getName(), group.getCount()));
//		}
//
//		/**
//		 * 创建分组
//		 */
//		WeChatGroup group = createGroup(accessToken, "公司员工");
//		System.out.println(String.format("成功创建分组：%s id：%d", group.getName(),
//				group.getId()));
//
//		/**
//		 * 修改分组名
//		 */
//		updateGroup(accessToken, 100, "同事");
//
//		/**
//		 * 移动用户分组
//		 */
//		updateMemberGroup(accessToken, "oEdzejiHCDqafJbz4WNJtWTMbDcE", 100);
//
//		/**
//		 * 上传多媒体文件
//		 */
//		WeChatMedia weixinMedia = uploadMedia(accessToken, "voice",
//				"http://localhost:8080/WeChatmpapi/test.mp3");
//		System.out.println(weixinMedia.getMediaId());
//		System.out.println(weixinMedia.getType());
//		System.out.println(weixinMedia.getCreatedAt());
//
//		/**
//		 * 下载多媒体文件
//		 */
//		getMedia(
//				accessToken,
//				"N7xWhOGYSLWUMPzVcGnxKFbhXeD_lLT5sXxyxDGEsCzWIB2CcUijSeQOYjWLMpcn",
//				"G:/download");
	}
	
	
	
}