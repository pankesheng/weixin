package com.weixin.common;

import java.util.LinkedList;
import java.util.List;

/**
 * 菜单
 * 
 * @author zouchongjin@sina.com
 * @data 2015年2月27日
 */
public class MenuDto {

	private String url;// 左侧菜单/顶部子应用 --链接地址

	private String title;// 顶部子应用--名称
	private String imgUrl;// 顶部子应用--图标地址

	private String name;// 左侧菜单--名称
	private Boolean open;// 左侧菜单--是否自动展开
	private List<MenuDto> childs;// 左侧菜单--子菜单

	/** 左侧菜单：构建父菜单，默认不展开 */
	public static MenuDto initPMenuDto(String name, MenuDto... sub) {
		return initPMenuDto(name, false, sub);
	}

	/** 左侧菜单：构建父菜单，可设置是否展开 */
	public static MenuDto initPMenuDto(String name, boolean open, MenuDto... sub) {
		List<MenuDto> list = new LinkedList<MenuDto>();
		for (MenuDto m : sub) {
			list.add(m);
		}
		return new MenuDto(name, "#", open, list);
	}

	/** 左侧菜单：添加子菜单 */
	public void addChild(MenuDto child) {
		if (child != null) {
			List<MenuDto> list = getChilds();
			if (list == null) {
				list = new LinkedList<MenuDto>();
			}
			list.add(child);
			setChilds(list);
		}
	}

	public MenuDto() {
		super();
	}

	/** 左侧菜单 */
	public MenuDto(String name, String url) {
		super();
		this.url = url;
		this.name = name;
	}

	/** 左侧菜单 */
	public MenuDto(String name, String url, List<MenuDto> childs) {
		super();
		this.name = name;
		this.url = url;
		this.childs = childs;
	}

	/** 左侧菜单 */
	public MenuDto(String name, String url, Boolean open, List<MenuDto> childs) {
		super();
		this.name = name;
		this.url = url;
		this.open = open;
		this.childs = childs;
	}

	/** 顶部子应用 */
	public MenuDto(String title, String imgUrl, String url) {
		super();
		this.title = title;
		this.imgUrl = imgUrl;
		this.url = url;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getUrl() {
		return url;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getImgUrl() {
		return imgUrl;
	}

	public void setImgUrl(String imgUrl) {
		this.imgUrl = imgUrl;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public Boolean getOpen() {
		return open;
	}

	public void setOpen(Boolean open) {
		this.open = open;
	}

	public List<MenuDto> getChilds() {
		return childs;
	}

	public void setChilds(List<MenuDto> childs) {
		this.childs = childs;
	}

}
