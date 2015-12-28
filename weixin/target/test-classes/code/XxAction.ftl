package ${packages}.action.${modules};

import java.io.PrintWriter;
import java.util.Arrays;
import java.util.HashMap;
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
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import ${packages}.common.ZwPageResult;
import ${packages}.entity.${modules}.${classes};
import ${packages}.service.${modules}.${classes}Service;
import com.zcj.web.dto.ServiceResult;
import com.zcj.web.springmvc.action.BasicAction;

@Controller
@RequestMapping("/${classes?lower_case}")
@Scope("prototype")
@Component("${classes?lower_case}Action")
public class ${classes}Action extends BasicAction {

	@Resource
	private ${classes}Service ${classes?lower_case}Service;

	@RequestMapping("/tolist")
	public String tolist(Model model) {

		return "/WEB-INF/ftl/admin/${modules}/${classes?lower_case}_list.ftl";
	}

	@RequestMapping("/list")
	public void list(String searchKey, PrintWriter out) {
		Map<String, Object> qbuilder = new HashMap<String, Object>();
		if (StringUtils.isNotBlank(searchKey)) {
			qbuilder.put("name", "%" + searchKey + "%");
		}
		page.setRows(${classes?lower_case}Service.findByPage(null, qbuilder));
		page.setTotal(${classes?lower_case}Service.getTotalRows(qbuilder));
		out.write(ZwPageResult.converByServiceResult(ServiceResult.initSuccess(page)));
	}

	@RequestMapping("/toadd")
	public String toadd(Model model) {
		return "/WEB-INF/ftl/admin/${modules}/${classes?lower_case}_modify.ftl";
	}

	@RequestMapping("/tomodify/{id}")
	public String tomodify(@PathVariable Long id, Model model) {
		model.addAttribute("obj", ${classes?lower_case}Service.findById(id));
		return "/WEB-INF/ftl/admin/${modules}/${classes?lower_case}_modify.ftl";
	}

	@RequestMapping("/delete")
	public void delete(HttpServletRequest request, String idsJson, PrintWriter out) {
		if (StringUtils.isBlank(idsJson)){
			out.write(ServiceResult.initErrorJson("请选择需要删除的记录！"));
			return ;
		}
		List<Long> ids = new Gson().fromJson(idsJson, new TypeToken<List<Long>>() {}.getType());
		if(ids==null||ids.size()==0){
			out.write(ServiceResult.initErrorJson("请选择需要删除的记录！"));
			return ;
		}
		${classes?lower_case}Service.deleteByIds(ids);
		out.write(ServiceResult.initSuccessJson(null));
	}

	@RequestMapping("/modify")
	public void modify(HttpServletRequest request, Long id, ${classes} obj, PrintWriter out) {
		// TODO 
		out.write(ServiceResult.initSuccessJson(null));
	}

}
