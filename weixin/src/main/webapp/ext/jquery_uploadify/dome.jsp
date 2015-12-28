<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<script type="text/javascript" src="<%=request.getContextPath() %>/ext/jquery/jquery-1.8.1.min.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath() %>/ext/json/json2.js"></script>
	<link rel="stylesheet" type="text/css" href="<%=request.getContextPath() %>/ext/jquery_uploadify/uploadify.css" media="screen" />
	<script type="text/javascript" src="<%=request.getContextPath() %>/ext/jquery_uploadify/jquery.uploadify.js"></script>
	<script>
		$(document).ready(function(){
			
			$('#upload2').uploadify({
				
				uploader: '<%=request.getContextPath() %>/file/upload.ajax',
				formData: { type: "Downloads-test" },
				swf: '<%=request.getContextPath() %>/ext/jquery_uploadify/uploadify.swf',
				
				// buttonImage: basePath+'/ext/jquery_uploadify/upload-btn.png',
				buttonText: '上传',
				removeTimeout: 0.1,
				// width : 100,
				// height : 32,
				
				multi: false,
				// fileSizeLimit: '100MB',// 文件大小限制
				// fileTypeExts: '*.gif;*.jpg;*.png;*.bmp;*.jpeg',// 默认为所有类型
				
				onUploadSuccess: function(file, data, response){
					var data2 = JSON.parse(data);
					if(data2.s){
						$("#linkUrl").val('<%=request.getContextPath() %>'+data2.d.savePath);
					}else{
						alert(data2.d);
					}
				}
				
			});
			
		});
	</script>
	<title>Uploadify--附件上传</title>
</head>
<body>

	<table>
		<tr>
			<td class="label"><label>文件上传：</label></td>
			<td>
				<input type="text" value="" id="linkUrl" name="linkUrl" size="50">
				<input id="upload2" type="file"/>
			</td>
			<td></td>
		</tr>
	</table>

</body>
</html>