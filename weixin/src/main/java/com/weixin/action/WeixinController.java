package com.weixin.action;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.weixin.pojo.SNSUserInfo;
import com.weixin.pojo.WeChatOauth2Token;
import com.weixin.service.CoreService;
import com.weixin.util.AdvancedUtil;
import com.weixin.util.ParameterUtil;
import com.weixin.util.SignUtil;

@Controller
@RequestMapping(value="")
public class WeixinController {
	
	@RequestMapping(value = "coreServlet", method = RequestMethod.GET)
	public void coreServletGet(HttpServletRequest request,HttpServletResponse response) throws ServletException, IOException {
		 // 微信加密签名  
        String signature = request.getParameter("signature");  
        // 时间戳  
        String timestamp = request.getParameter("timestamp");  
        // 随机数  
        String nonce = request.getParameter("nonce");  
        // 随机字符串  
        String echostr = request.getParameter("echostr");  
  
        PrintWriter out = response.getWriter();  
        // 通过检验signature对请求进行校验，若校验成功则原样返回echostr，表示接入成功，否则接入失败  
        if (SignUtil.checkSignature(signature, timestamp, nonce)) {  
            out.print(echostr);  
        }  
        out.close();  
        out = null;  
     } 
	
	@RequestMapping(value = "coreServlet", method = RequestMethod.POST)
	public void coreServletPost(HttpServletRequest request,HttpServletResponse response) throws ServletException, IOException {
		// 将请求、响应的编码均设置为UTF-8（防止中文乱码）  
        request.setCharacterEncoding("UTF-8");  
        response.setCharacterEncoding("UTF-8");  
        // 调用核心业务类接收消息、处理消息  
        String respMessage = CoreService.processRequest(request);  
        // 响应消息  
        PrintWriter out = response.getWriter();  
        out.print(respMessage); 
        System.out.println(respMessage);
        out.close();  
    }  
	
	@RequestMapping(value="/oauth2")
	public void oauth2(HttpServletRequest request, HttpServletResponse response) throws Exception{
		request.setCharacterEncoding("gb2312");
		response.setCharacterEncoding("gb2312");//[/align][align=left]  // 用户同意授权后，能获取到code
		String code = request.getParameter("code");//[/align][align=left]  // 用户同意授权
		if (!"authdeny".equals(code)) {
			// 获取网页授权access_token
			WeChatOauth2Token weixinOauth2Token = AdvancedUtil.getOauth2AccessToken(ParameterUtil.appId, ParameterUtil.appSecret, code);
			// 网页授权接口访问凭证
			String accessToken = weixinOauth2Token.getAccessToken();
			// 用户标识
			String openId = weixinOauth2Token.getOpenId();
			// 获取用户信息
			SNSUserInfo snsUserInfo = AdvancedUtil.getSNSUserInfo(accessToken, openId);//[/align][align=left]   // 设置要传递的参数
			request.setAttribute("snsUserInfo", snsUserInfo);
		}
		// 跳转到index2.jsp
		request.getRequestDispatcher("index2.jsp").forward(request, response);
	}
	
}
