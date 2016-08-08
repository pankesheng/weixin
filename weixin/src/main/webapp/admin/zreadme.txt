
admin/*
	
	Build：19607
	
	19607：修改 ext/jquery/selectbox.js
	
	
admin/javascripts/zcommon.js

	2015-07-23	V1.0	初始化
	2015-08-13	V1.1	解决文件上传时部分浏览器出错的问题
	2015-08-31	V1.2	迁移前端资源文件目录到admin文件夹（原为admin4文件夹）
	2015-09-02	V1.3	新增 z_ajaxoper(url, oper) 方法，功能：调用后台 AJAX 操作，完成后：刷新列表、关闭所有弹窗、并弹出操作结果。
	2015-12-24	V1.4	废弃 z_delete(dataString, url)  和 function z_oper(dataString, url, oper)  方法
						新增 z_delete2(dataString, url) 和 function z_oper2(dataString, url, oper) 方法，解决选择数量过多时出错的问题
	2016-01-18	V1.5	新增支持FastDFS上传文件，详见： z_initFlieUpload_fastdfs(uploadButtonId, basePath, saveCatalog, resultPathInputId, buttonText) 方法
	2016-04-12	V1.6	修改 z_alert_success(value) 的内部实现，tip方式改成alert方式，为了解决在云平台中的跨域问题