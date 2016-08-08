package com.weixin.action;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.weixin.common.Configuration;
import com.weixin.common.MenuDto;
import com.zcj.web.dto.ServiceResult;
import com.zcj.web.springmvc.action.BasicAction;

@Controller
@RequestMapping("/index")
@Scope("prototype")
@Component("indexAction")
public class IndexAction extends BasicAction {


	@RequestMapping("/index")
	public String index(HttpServletRequest request, Model model) {
		return "/WEB-INF/ftl/admin/index.ftl";
	}

	@RequestMapping("/top")
	public String top(Model model) {
		return "/WEB-INF/ftl/admin/top.ftl";
	}

	@RequestMapping("/container")
	public String container(Model model) {
		return "/WEB-INF/ftl/admin/container.ftl";
	}

	@RequestMapping("/left")
	public String left(Model model) {
		return "/WEB-INF/ftl/admin/left.ftl";
	}

	@RequestMapping("/start")
	public String start(Model model) {
		return "/WEB-INF/ftl/admin/start.ftl";
	}

	// 登录后的菜单列表
	@RequestMapping("/menu")
	public void menu(HttpServletRequest request, PrintWriter out) {

		MenuDto m11 = new MenuDto("自定义菜单", Configuration.getContextPath() + "/menubutton/tolist.do");
		MenuDto m1 = MenuDto.initPMenuDto("测试", m11);

		List<MenuDto> menu = new ArrayList<MenuDto>();
		menu.add(m1);

		String result = ServiceResult.initSuccessJson(menu);
		out.write(result);
	}

}
