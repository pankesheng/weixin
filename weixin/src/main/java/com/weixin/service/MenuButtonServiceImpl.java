package com.weixin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.weixin.entity.MenuButton;
import com.weixin.mapper.MenuButtonMapper;
import com.zcj.web.mybatis.service.BasicServiceImpl;

@Component(value="menuButtonService")
public class MenuButtonServiceImpl extends BasicServiceImpl<MenuButton, Long, MenuButtonMapper> implements MenuButtonService{

	@Autowired
	private MenuButtonMapper menuButtonMapper;
	@Override
	protected MenuButtonMapper getMapper() {
		return menuButtonMapper;
	}

}
