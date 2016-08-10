package com.weixin.action;

import java.io.PrintWriter;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.weixin.common.ZwPageResult;
import com.weixin.entity.MenuButton;
import com.weixin.material.MaterialNews;
import com.weixin.material.NewsMaterial;
import com.weixin.menu.Button;
import com.weixin.menu.ClickButton;
import com.weixin.menu.ComplexButton;
import com.weixin.menu.MaterialButton;
import com.weixin.menu.Menu;
import com.weixin.menu.ViewButton;
import com.weixin.service.MenuButtonService;
import com.weixin.util.WechatApiHelper;
import com.zcj.util.UtilString;
import com.zcj.web.dto.ServiceResult;
import com.zcj.web.springmvc.action.BasicAction;

@Controller
@RequestMapping(value="menubutton")
public class MenuButtonAction extends BasicAction {
	
	@Autowired
	private MenuButtonService menuButtonService;
	
	@RequestMapping("/tolist")
	public String tolist(HttpServletRequest request,Model model){
		Map<String, Object> qbuilder = new HashMap<String, Object>();
		qbuilder.put("btn_list", 1);
		List<MenuButton> list = menuButtonService.find("btn_order asc", qbuilder, null);
		model.addAttribute("list", list);
		return "/WEB-INF/ftl/admin/weixin/menu_list.ftl";
	}
	
	@RequestMapping("/list")
	public void list(HttpServletRequest request,String btn_name,Integer btn_state,Long pid,PrintWriter out){
		Map<String, Object> qbuilder = new HashMap<String, Object>();
		if(StringUtils.isNotBlank(btn_name)){
			qbuilder.put("btn_name", "%"+btn_name.trim()+"%");
		}
		if(btn_state!=null){
			qbuilder.put("btn_state", btn_state);
		}
		if(pid!=null){
			qbuilder.put("pid", pid);
		}
		List<MenuButton> list = menuButtonService.findByPage("btn_order asc", qbuilder);
		for (MenuButton obj : list) {
			if(obj.getPid()!=null){
				MenuButton parent = menuButtonService.findById(obj.getPid());
				obj.setShow_parent(parent==null?new MenuButton():parent);
			}else{
				obj.setShow_parent(new MenuButton());
			}
		}
		int total = menuButtonService.getTotalRows(qbuilder);
		page.setRows(list);
		page.setTotal(total);
		out.write(ZwPageResult.converByServiceResult(ServiceResult.initSuccess(page)));
	}
	
	@RequestMapping("/toadd")
	public String toadd(HttpServletRequest request,Model model){
		Map<String, Object> qbuilder = new HashMap<String, Object>();
		qbuilder.put("btn_list", 1);
		qbuilder.put("state", 1);
		List<MenuButton> list = menuButtonService.find("btn_order asc", qbuilder, null);
		model.addAttribute("list", list);
		List<String> key_map_keys = new ArrayList<String>();
        for (Iterator<Map.Entry<String, String>> it = MenuButton.KEY_MAP.entrySet().iterator(); it.hasNext();) {
            Map.Entry<String, String> entry = (Map.Entry<String, String>) it.next();
            key_map_keys.add(entry.getKey());
        }
        List<String> type_map_keys = new ArrayList<String>();
        for (Iterator<Map.Entry<String, String>> it = MenuButton.TYPE_MAP.entrySet().iterator(); it.hasNext();) {
            Map.Entry<String, String> entry = (Map.Entry<String, String>) it.next();
            type_map_keys.add(entry.getKey());
        }
        model.addAttribute("keykeys", key_map_keys);
        model.addAttribute("typekeys", type_map_keys);
		model.addAttribute("keymap", MenuButton.KEY_MAP);
		model.addAttribute("typemap", MenuButton.TYPE_MAP);
		return "/WEB-INF/ftl/admin/weixin/menu_modify.ftl";
	}
	
	@RequestMapping("/tomodify")
	public String tomodify(HttpServletRequest request,Long id , Model model){
		if(id==null){
			return "404.jsp";
		}
		MenuButton obj = menuButtonService.findById(id);
		model.addAttribute("obj", obj);
		Map<String, Object> qbuilder = new HashMap<String, Object>();
		qbuilder.put("btn_list", 1);
		qbuilder.put("state", 1);
		List<MenuButton> list = menuButtonService.find("btn_order asc", qbuilder, null);
		model.addAttribute("list", list);
		List<String> key_map_keys = new ArrayList<String>();
        for (Iterator<Map.Entry<String, String>> it = MenuButton.KEY_MAP.entrySet().iterator(); it.hasNext();) {
            Map.Entry<String, String> entry = (Map.Entry<String, String>) it.next();
            key_map_keys.add(entry.getKey());
        }
        List<String> type_map_keys = new ArrayList<String>();
        for (Iterator<Map.Entry<String, String>> it = MenuButton.TYPE_MAP.entrySet().iterator(); it.hasNext();) {
            Map.Entry<String, String> entry = (Map.Entry<String, String>) it.next();
            type_map_keys.add(entry.getKey());
        }
        model.addAttribute("keykeys", key_map_keys);
        model.addAttribute("typekeys", type_map_keys);
		model.addAttribute("keymap", MenuButton.KEY_MAP);
		model.addAttribute("typemap", MenuButton.TYPE_MAP);
		return "/WEB-INF/ftl/admin/weixin/menu_modify.ftl";
	}
	
	@RequestMapping("/modify")
	public void modify(HttpServletRequest request,MenuButton obj,PrintWriter out){
		if(StringUtils.isBlank(obj.getBtn_name())){
			out.write(ServiceResult.initErrorJson("名称不能为空！"));
			return ;
		}
		if(obj.getPid()!=null){
			obj.setBtn_list(0);
			MenuButton pbutton = menuButtonService.findById(obj.getPid());
			if(pbutton==null){
				out.write(ServiceResult.initErrorJson("该一级菜单已经不存在，请重新选择！"));
				return ;
			}else {
				if(pbutton.getPid()!=null){
					out.write(ServiceResult.initErrorJson("选择失败，您不能将此按钮归属到二级按钮中去！"));
					return ;
				}
			}
			if(StringUtils.isBlank(obj.getBtn_type())|| !MenuButton.TYPE_MAP.containsKey(obj.getBtn_type())){
				out.write(ServiceResult.initErrorJson("按钮类型错误！"));
				return ;
			}
			if(MenuButton.TYPE_CLICK.equals(obj.getBtn_type())){
				obj.setBtn_url(null);
				if(StringUtils.isBlank(obj.getBtn_key()) || !MenuButton.KEY_MAP.containsKey(obj.getBtn_key())){
					out.write(ServiceResult.initErrorJson("没有该事件触发类型！"));
					return ;
				}
			}else if(MenuButton.TYPE_VIEW.equals(obj.getBtn_type())){
				obj.setBtn_key(null);
				if(StringUtils.isBlank(obj.getBtn_url())){
					out.write(ServiceResult.initErrorJson("请填写url地址！"));
					return ;
				}
			}
		}else{
			if(obj.getBtn_list()==null||obj.getBtn_list()==0){
				if(StringUtils.isBlank(obj.getBtn_type())|| !MenuButton.TYPE_MAP.containsKey(obj.getBtn_type())){
					out.write(ServiceResult.initErrorJson("按钮类型错误！"));
					return ;
				}
				if(MenuButton.TYPE_CLICK.equals(obj.getBtn_type())){
					obj.setBtn_url(null);
					obj.setBtn_media_id(null);
					obj.setBtn_media_name(null);
					if(StringUtils.isBlank(obj.getBtn_key()) || !MenuButton.KEY_MAP.containsKey(obj.getBtn_key())){
						out.write(ServiceResult.initErrorJson("没有该事件触发类型！"));
						return ;
					}
				}else if(MenuButton.TYPE_VIEW.equals(obj.getBtn_type())){
					obj.setBtn_key(null);
					obj.setBtn_media_id(null);
					obj.setBtn_media_name(null);
					if(StringUtils.isBlank(obj.getBtn_url())){
						out.write(ServiceResult.initErrorJson("请填写url地址！"));
						return ;
					}
				}else if(MenuButton.TYPE_MATERIAL.equals(obj.getBtn_type())){
					obj.setBtn_key(null);
					obj.setBtn_url(null);
					if(StringUtils.isBlank(obj.getBtn_media_id()) || StringUtils.isBlank(obj.getBtn_media_name())){
						out.write(ServiceResult.initErrorJson("请选择素材！"));
						return ;
					}
				}
			}else{
				obj.setBtn_type(null);
				obj.setBtn_key(null);
				obj.setBtn_url(null);
			}
		}
		if(obj.getId()==null){
			obj.setId(UtilString.getLongUUID());
			menuButtonService.insert(obj);
		}else{
			menuButtonService.update(obj);
		}
		out.write(ServiceResult.initSuccessJson(null));
	}
	
	@RequestMapping("/remove")
	public void remove(HttpServletRequest request,String ids,PrintWriter out){
		if(StringUtils.isBlank(ids)){
			out.write(ServiceResult.initErrorJson("请选择要删除的信息！"));
			return ;
		}
		List<Long> idList = UtilString.stringToLongList(ids);
		if(idList.size()==1){
			menuButtonService.delete(idList.get(0));
		}else{
			menuButtonService.deleteByIds(idList);
		}
		out.write(ServiceResult.initSuccessJson(null));
	}
	
	@RequestMapping("/createMenu")
	public void createMenu(HttpServletRequest request,PrintWriter out){
		Map<String, Object> qbuilder = new HashMap<String, Object>();
		qbuilder.put("btn_state", 1);
		qbuilder.put("pidisnull", " ");
		List<MenuButton> buttons = menuButtonService.find("btn_order asc", qbuilder, 3);
		Button[] r1 = new Button[buttons.size()];
		for (int i = 0; i < buttons.size(); i++) {
			MenuButton b1 = buttons.get(i);
			if(b1.getBtn_list()!=null && b1.getBtn_list()==1){
				List<MenuButton> children = menuButtonService.find("btn_order asc", menuButtonService.initQbuilder(new String[]{"btn_state","pid"}, new Object[]{1,b1.getId()}), 5);
				Button[] r2 = new Button[children.size()];
				for (int j = 0; j < children.size(); j++) {
					MenuButton b2 = children.get(j);
					if(MenuButton.TYPE_CLICK.equals(b2.getBtn_type())){
						ClickButton cb = new ClickButton(b2.getBtn_name(), b2.getBtn_key());
						r2[j] = cb;
					}else if(MenuButton.TYPE_VIEW.equals(b2.getBtn_type())){
						ViewButton vb = new ViewButton(b2.getBtn_name(), b2.getBtn_url());
						r2[j] = vb;
					}else if(MenuButton.TYPE_MATERIAL.equals(b2.getBtn_type())){
						MaterialButton mb = new MaterialButton(b2.getBtn_name(), b2.getBtn_media_id());
						r2[i] = mb;
					}
				}
				ComplexButton cb = new ComplexButton(b1.getBtn_name(), r2);
				r1[i] = cb;
			}else{
				if(MenuButton.TYPE_CLICK.equals(b1.getBtn_type())){
					ClickButton cb = new ClickButton(b1.getBtn_name(), b1.getBtn_key());
					r1[i] = cb;
				}else if(MenuButton.TYPE_VIEW.equals(b1.getBtn_type())){
					ViewButton vb = new ViewButton(b1.getBtn_name(), b1.getBtn_url());
					r1[i] = vb;
				}else if(MenuButton.TYPE_MATERIAL.equals(b1.getBtn_type())){
					MaterialButton mb = new MaterialButton(b1.getBtn_name(), b1.getBtn_media_id());
					r1[i] = mb;
				}
			}
		}
		Menu menu = new Menu();
		menu.setButton(r1);
		String result = WechatApiHelper.createMenuMsg(menu);
		if(StringUtils.isBlank(result)){
			out.write(ServiceResult.initSuccessJson(null));
		}else{
			out.write(ServiceResult.initErrorJson(result));
		}
	}
	
	@RequestMapping("/tomateriallist")
	public String tomateriallist(HttpServletRequest request,String type,Model model){
		model.addAttribute("type", type);
		String returnUrl = "404.jsp";
		if("news".equals(type)){
			returnUrl = "/WEB-INF/ftl/admin/weixin/material_news_list.ftl";
		}
		return returnUrl;
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping("/materiallist")
	public void getMaterialList(PrintWriter out,String type) throws ParseException{
		page = WechatApiHelper.getMaterialList(type,0,20);
		if(page.getRows()!=null){
			if(StringUtils.isNotBlank(type) && "news".equals(type)){
				List<NewsMaterial> list = (List<NewsMaterial>) page.getRows();
				for (NewsMaterial obj : list) {
					obj.setUpdateDate(new Date(Long.parseLong(obj.getUpdate_time())*1000));
					List<MaterialNews> news = obj.getContent().getNews_item();
					for (MaterialNews obj2 : news) {
						if("1".equals(obj2.getShow_cover_pic())){
							obj.setName(obj2.getTitle());
						}
					}
				}
				page.setRows(list);
			}
		}
		out.write(ZwPageResult.converByServiceResult(ServiceResult.initSuccess(page)));
	}
}
