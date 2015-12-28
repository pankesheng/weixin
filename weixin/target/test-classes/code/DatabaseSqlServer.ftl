
<#list tables as t>
CREATE TABLE [${databasename}].[dbo].[${t.name}](
  [id] [bigint] NOT NULL PRIMARY KEY,
  <#list t.columns as c>
  [${c.name}] ${c.type} NULL,
  </#list>
  [ctime] [datetime] NULL,
  [utime] [datetime] NULL
)


</#list>