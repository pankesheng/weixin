package com.xt.ohedu.action.www;

import java.io.PrintWriter;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.xt.ohedu.entity.article.Article;
import com.xt.ohedu.entity.article.Catalog;
import com.xt.ohedu.service.article.ArticleService;
import com.xt.ohedu.service.article.CatalogService;
import com.zcj.web.context.SystemContext;
import com.zcj.web.dto.ServiceResult;
import com.zcj.web.springmvc.action.BasicAction;

@Controller
@RequestMapping("/mobile")
@Scope("prototype")
@Component("mobileIndexAction")
public class MobileIndex extends BasicAction {

	@Resource
	private CatalogService catalogService;
	@Resource
	private ArticleService articleService;

	@RequestMapping("/index")
	public String index(HttpServletRequest request, Model model) {
		
		// key：栏目标识；value：栏目下文章列表
		Map<String, List<Article>> articleMap = new HashMap<String, List<Article>>();
			// 本站公告
			articleMap.put("253", Article.toSetTops(articleService.find(Article.DEFAULT_ORDERBY, articleService.initQbuilder(new String[]{"catalogId", "valid", "verify"}, new Object[]{253, 1, 0}), 10)));
			// 教育动态
			articleMap.put("7", Article.toSetTops(Article.formats(articleService.findByPCatalogId(7L, null, 10), false, true)));
			// 公文发布
			articleMap.put("8", Article.toSetTops(Article.formats(articleService.findByPCatalogId(8L, null, 10), false, true)));
			// 教研师资
			articleMap.put("13",Article.toSetTops(Article.formats(articleService.findByPCatalogId(13L, null, 10), false, true)));
			// 教育信息化
			articleMap.put("10", Article.toSetTops(Article.formats(articleService.findByPCatalogId(10L, null, 10), false, true)));
			// 教育督导
			articleMap.put("20", Article.toSetTops(Article.formats(articleService.findByPCatalogId(20L, null, 10), false, true)));
			// 瓯海民办教育
			articleMap.put("21", Article.toSetTops(Article.formats(articleService.findByPCatalogId(21L, null, 10), false, true)));
			// 招生考试
			articleMap.put("11", Article.toSetTops(Article.formats(articleService.findByPCatalogId(11L, null, 10), false, true)));
			// 教育技术
			articleMap.put("14", Article.toSetTops(Article.formats(articleService.findByPCatalogId(14L, null, 10), false, true)));
		model.addAttribute("articleMap", articleMap);

		return "/WEB-INF/ftl/ohedu/mobile/index.ftl";
	}
	
	@RequestMapping("/menu")
	public String menu(HttpServletRequest request, Model model) {
		
		List<Catalog> clist = catalogService.find(null, catalogService.initQbuilder(new String[]{"webmenu", "valid"}, new Object[]{1, 1}), null);
		if (clist != null && clist.size() > 0) {
			for (Catalog c : clist) {
				c.setChilds(catalogService.find(null, catalogService.initQbuilder(new String[]{"pid", "valid"}, new Object[]{c.getId(), 1}), null));
			}
		}
		model.addAttribute("menuCatalogList", clist);
		
		return "/WEB-INF/ftl/ohedu/mobile/menu.ftl";
	}
	
	@RequestMapping("/lists")
	public String lists(Long id, HttpServletRequest request, Model model) {
		
		Map<String, List<Article>> result = new LinkedHashMap<>();
		List<Catalog> subcat = catalogService.find(null, catalogService.initQbuilder(new String[]{"pid", "valid"}, new Object[]{id, 1}), null);
		if (subcat != null && subcat.size() > 0) {
			for (Catalog c : subcat) {
				result.put(String.valueOf(c.getId()), Article.toSetTops(articleService.find(Article.DEFAULT_ORDERBY, articleService.initQbuilder(new String[]{"catalogId", "valid", "verify"}, new Object[]{c.getId(), 1, 0}), 8)));
			}
		}
		
		model.addAttribute("catalog", catalogService.findById(id));
		model.addAttribute("catList", subcat);// 子栏目列表
		model.addAttribute("artMap", result);// key：栏目ID；value：栏目下的文章列表
		
		return "/WEB-INF/ftl/ohedu/mobile/lists.ftl";
	}
	
	@RequestMapping("/list")
	public String list(Long id, HttpServletRequest request, Model model) {
		
		SystemContext.setPagesize(10);
		
		Map<String, Object> qbuilder = articleService.initQbuilder(new String[]{"catalogId", "valid", "verify"}, new Object[]{id, 1, 0});
		List<Article> artiles = Article.toSetTops(articleService.findByPage(Article.DEFAULT_ORDERBY, qbuilder));
		model.addAttribute("rows", artiles);
		model.addAttribute("obj", catalogService.findById(id));
		
		return "/WEB-INF/ftl/ohedu/mobile/list.ftl";
	}
	
	@RequestMapping("/listajax")
	public void listajax(Long id, Integer p, HttpServletRequest request, Model model, PrintWriter out) {
		
		// 点击更多默认取第二页
		if (p == null) {p = 2;}
		SystemContext.setPagesize(10);
		SystemContext.setOffset((p-1)*10);
		
		Map<String, Object> qbuilder = articleService.initQbuilder(new String[]{"catalogId", "valid", "verify"}, new Object[]{id, 1, 0});
		List<Article> artiles = Article.toSetTops(articleService.findByPage(Article.DEFAULT_ORDERBY, qbuilder));
		
		out.write(ServiceResult.initSuccessJson(artiles));
	}
	
	@RequestMapping("/search")
	public String search(String searchValue, HttpServletRequest request, Model model) {
		
		Map<String, Object> qbuilder = articleService.initQbuilder(new String[]{"searchKey", "valid", "verify"}, new Object[]{"%"+searchValue+"%", 1, 0});
		model.addAttribute("rows", articleService.find(Article.DEFAULT_ORDERBY, qbuilder, 50));
		model.addAttribute("total", articleService.getTotalRows(qbuilder));
		model.addAttribute("searchValue", searchValue);
		
		return "/WEB-INF/ftl/ohedu/mobile/search.ftl";
	}
	
	@RequestMapping("/detail")
	public String detail(Long id, HttpServletRequest request, Model model) {
		Article obj = articleService.findById(id);
		if (obj != null) {
			obj.format(false, true);
		}
		model.addAttribute("obj", obj);
		return "/WEB-INF/ftl/ohedu/mobile/detail.ftl";
	}
	
}
