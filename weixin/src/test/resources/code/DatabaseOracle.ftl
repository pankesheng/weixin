
<#list tables as t>
/
declare
	num number;
begin
 select count(*) into num from all_tables where TABLE_NAME = '${t.nameUpper}';
	if num =1 then 
		execute immediate 'drop table ${t.nameUpper}';
	end if;
end;
/
CREATE TABLE ${t.name} (
  id number(20) primary key NOT NULL,
  <#list t.columns as c>
  ${c.name}` ${c.type} DEFAULT NULL,
  </#list>
  ctime` date DEFAULT NULL,
  utime` date DEFAULT NULL
);


</#list>