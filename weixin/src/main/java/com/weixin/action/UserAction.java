package com.weixin.action;

import java.io.PrintWriter;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.weixin.common.ZwPageResult;
import com.weixin.entity.User;
import com.weixin.service.UserService;
import com.zcj.util.UtilConvert;
import com.zcj.util.UtilString;
import com.zcj.web.dto.ServiceResult;
import com.zcj.web.springmvc.action.BasicAction;

@Controller
@RequestMapping("/user")
@Scope("prototype")
@Component("userAction")
public class UserAction extends BasicAction {

	@Resource
	private UserService userService;

	@RequestMapping("/tolist")
	public String tolist(Model model) {
		Map<String, Object> qbuilder = new HashMap<String, Object>();
		List<Integer> hourseList = userService.findHourses(qbuilder);
		List<Integer> roomList = userService.findRooms(qbuilder);
		model.addAttribute("hourseList", hourseList);
		model.addAttribute("roomList", roomList);
		return "/WEB-INF/ftl/admin/user/user_list.ftl";
	}

	@RequestMapping("/list")
	public void list(Integer searchHourse_num, Integer searchRoom_num, String searchName, String searchPhone, PrintWriter out) {
		Map<String, Object> qbuilder = new HashMap<String, Object>();
		if (searchHourse_num != null) {
			qbuilder.put("hourse_num", searchHourse_num);
		}
		if (searchRoom_num != null) {
			qbuilder.put("room_num", searchRoom_num);
		}
		if (UtilString.isNotBlank(searchName)) {
			qbuilder.put("name", "%" + searchName + "%");
		}
		if (UtilString.isNotBlank(searchPhone)) {
			qbuilder.put("phone", "%" + searchPhone + "%");
		}
		page.setRows(userService.findByPage(null, qbuilder));
		page.setTotal(userService.getTotalRows(qbuilder));
		out.write(ZwPageResult.converByServiceResult(ServiceResult.initSuccess(page)));
	}

	@RequestMapping("/toadd")
	public String toadd(Model model) {
		return "/WEB-INF/ftl/admin/user/user_modify.ftl";
	}

	@RequestMapping("/tomodify/{id}")
	public String tomodify(@PathVariable Long id, Model model) {
		model.addAttribute("obj", userService.findById(id));
		return "/WEB-INF/ftl/admin/user/user_modify.ftl";
	}

	@RequestMapping("/delete")
	public void delete(HttpServletRequest request, String ids, PrintWriter out) {
		if (UtilString.isBlank(ids)) {
			out.write(ServiceResult.initErrorJson("请选择需要删除的记录！"));
			return;
		}
		Long[] s = UtilConvert.string2Long(ids.split(","));
		userService.deleteByIds(Arrays.asList(s));
		out.write(ServiceResult.initSuccessJson(null));
	}
	
	@RequestMapping("/modify")
	public void modify(HttpServletRequest request, Long id, User obj, PrintWriter out) {
		if (obj == null||obj.getHourse_num()==null||obj.getRoom_num()==null||StringUtils.isBlank(obj.getName())) {
			out.write(ServiceResult.initErrorParamJson());
			return ;
		}
		if (id == null) {
			obj.setId(UtilString.getLongUUID());
			userService.insert(obj);
		} else {
			User user = userService.findById(id);
			if(user==null){
				out.write(ServiceResult.initErrorJson("数据不存在！"));
				return ;
			}
			user.setHourse_num(obj.getHourse_num());
			user.setRoom_num(obj.getRoom_num());
			user.setName(obj.getName());
			user.setAccount(obj.getAccount());
			user.setPassword(obj.getPassword());
			user.setPhone(obj.getPhone());
			user.setRemark(obj.getRemark());
			userService.update(user);
		}
		out.write(ServiceResult.initSuccessJson(null));
	}

}
