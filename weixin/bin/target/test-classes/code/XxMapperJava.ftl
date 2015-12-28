package ${packages}.mapper.${modules};

import ${packages}.entity.${modules}.${classes};
import com.zcj.web.mybatis.mapper.BasicMapper;
import com.zcj.web.mybatis.mapper.BasicRepository;

@BasicRepository
public interface ${classes}Mapper extends BasicMapper<${classes}, Long> {

}
