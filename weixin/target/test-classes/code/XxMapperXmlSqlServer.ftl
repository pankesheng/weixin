<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="${packages}.mapper.${modules}.${classes}Mapper">
	
	<!-- <cache /> -->
	
	<!-- 大于等于(&gt;=);小于等于(&lt;=); -->
	<sql id="qbuilder">
		<where>
			<if test="qbuilder.id != null">${tables}.id = ${r"#"}{qbuilder.id}</if>
		</where>
	</sql>
	
	<select id="find" resultType="${classes}">
		<choose> 
			<when test="start != null and size != null">
				SELECT w1.*
				FROM 
					(
						SELECT TOP (${r"#"}{start}+${r"#"}{size}) row_number() OVER (
							<choose>
								<when test="orderby != null">ORDER BY ${r"${orderby}"}</when>
								<otherwise>ORDER BY id</otherwise>
							</choose>
						) n, id
						FROM ${tables}
						<if test="qbuilder != null">
							<include refid="qbuilder"/>
						</if>
					) w2
					INNER JOIN ${tables} w1 ON w1.id=w2.id AND w2.n > ${r"#"}{start}
				ORDER BY w2.n ASC
			</when>
			<otherwise>
				SELECT <if test="start == null and size != null">TOP (${r"#"}{size})</if> * FROM ${tables}
				<if test="qbuilder != null">
					<include refid="qbuilder"/>
				</if>
				<choose>
					<when test="orderby != null">ORDER BY ${r"${orderby}"}</when>
					<otherwise>ORDER BY id</otherwise>
				</choose>
			</otherwise>
		</choose>
	</select>
	
	<select id="getTotalRows" resultType="int">
		SELECT COUNT(*) FROM ${tables}
		<if test="qbuilder != null">
			<include refid="qbuilder"/>
		</if>
	</select>
	
	<select id="findById" resultType="${classes}">
		SELECT * FROM ${tables} WHERE id = ${r"#"}{id}
	</select>
	
	<!-- ,jdbcType=LONGVARCHAR -->
	<insert id="insert">
		INSERT INTO ${tables}
			(id,<#list fields as f>${f.name},</#list>ctime,utime)
		VALUES
			(${r"#"}{object.id},<#list fields as f>${r"#"}{object.${f.name}},</#list>getdate(),getdate())
	</insert>
	
	<update id="update">
		UPDATE ${tables}
		SET
			<#list fields as f>
			${f.name} = ${r"#"}{object.${f.name}},
			</#list>
			utime = getdate()
		WHERE id = ${r"#"}{object.id}
	</update>
	
	<delete id="delete">
		DELETE FROM ${tables} WHERE id = ${r"#"}{id}
	</delete>
	
	<delete id="deleteByIds">
		DELETE FROM ${tables} WHERE id in 
		<foreach item="id" index="index" collection="ids" open="(" separator="," close=")">
			${r"#"}{id}
		</foreach>
	</delete>
	
	<delete id="cleanTable">
		DELETE FROM ${tables}
	</delete>

</mapper>
