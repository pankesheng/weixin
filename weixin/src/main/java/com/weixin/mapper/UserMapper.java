package com.weixin.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.weixin.entity.User;
import com.zcj.web.mybatis.mapper.BasicMapper;
import com.zcj.web.mybatis.mapper.BasicRepository;

@BasicRepository
public interface UserMapper extends BasicMapper<User, Long> {

	List<Integer> findHourses(@Param("qbuilder") Map<String, Object> qbuilder);

	List<Integer> findRooms(@Param("qbuilder") Map<String, Object> qbuilder);

}
