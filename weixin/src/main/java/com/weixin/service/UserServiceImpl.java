package com.weixin.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.weixin.entity.User;
import com.weixin.mapper.UserMapper;
import com.zcj.web.mybatis.service.BasicServiceImpl;

@Component("userService")
public class UserServiceImpl extends BasicServiceImpl<User, Long, UserMapper> implements UserService {

	@Autowired
	private UserMapper userMapper;

	@Override
	protected UserMapper getMapper() {
		return userMapper;
	}

	@Override
	public List<Integer> findHourses(Map<String, Object> qbuilder) {
		return userMapper.findHourses(qbuilder);
	}

	@Override
	public List<Integer> findRooms(Map<String, Object> qbuilder) {
		return userMapper.findRooms(qbuilder);
	}
	
}
