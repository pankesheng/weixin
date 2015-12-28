package ${packages}.service.${modules};

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import ${packages}.entity.${modules}.${classes};
import ${packages}.mapper.${modules}.${classes}Mapper;
import com.zcj.web.mybatis.service.BasicServiceImpl;

@Component("${classes?lower_case}Service")
public class ${classes}ServiceImpl extends BasicServiceImpl<${classes}, Long, ${classes}Mapper> implements ${classes}Service {

	@Autowired
	private ${classes}Mapper ${classes?lower_case}Mapper;

	@Override
	protected ${classes}Mapper getMapper() {
		return ${classes?lower_case}Mapper;
	}
	
}
