<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<link rel="stylesheet" type="text/css" href="${contextPath}/admin/stylesheets/common.css?v=${sversion}" media="screen" />
	<link rel="stylesheet" type="text/css" href="${contextPath}/admin/stylesheets/table.css?v=${sversion}" media="screen" />
	<script type="text/javascript" src="${contextPath}/ext/jquery/jquery-1.8.1.min.js"></script>
	
	<script type="text/javascript" src="${contextPath}/ext/json/json2.js"></script>
	
	<script type="text/javascript" src="${contextPath}/ext/layer/layer.min.js"></script>
	<script type="text/javascript" src="${contextPath}/admin/ext/jquery/selectbox.js"></script>
	<script type="text/javascript" src="${contextPath}/admin/ext/zw/check.js?v=${sversion}"></script>
	<script type="text/javascript" src="${contextPath}/admin/javascripts/zcommon.js?v=${sversion}" basepath="${contextPath}" baseinit="ajaxCheckLogin"></script>

</head>
<body>
<div class="place">
    <span class="label-span">位置：</span>
    <ul id="place-list" class="place-ul">
        <li>自定义菜单按钮 - 编辑</li>
    </ul>
</div>
<div class="body-warp">
    <div class="panel">
        <div class="panel-title">
            <i class="form-icon"></i>
            <span class="title-text">自定义菜单按钮</span>
        </div>
        <div class="panel-body">
		    <form id="saveform" method="post">
		    	<input type="hidden" name="id" value="${(obj.id)!}"/>
		        <table class="form-table">
		        	<tr>
		        		<td><label class="form-label">菜单按钮所属</label></td>
		        		<td>
		        			<select class="form-select" id="pid" name="pid" onchange="pidchange();">
		        				<option value="" <#if !obj?? || !obj.pid??>selected</#if>>一级菜单按钮</option>
		        				<#list list as o>
		        					<option value="${o.id}" <#if (obj.pid)?? && obj.pid==o.id>selected</#if> >${o.btn_name}</option>
		        				</#list>
		        			</select>
		        		</td>
		        	</tr>
		        	<tr id="listtr" <#if (obj.pid)??>style="display:none;"</#if>>
		        		<td><label class="form-label">是否作为列表项</label></td>
						<td>
							<select class="form-select" id="btn_list" name="btn_list" onchange="btnlistchange();">
								<option value="1" <#if (obj.btn_list)?? && obj.btn_list==1>selected</#if>>是</option>
								<option value="0" <#if !(obj.btn_list)?? ||((obj.btn_list)?? && obj.btn_list==0) >selected</#if>>否</option>
							</select>
						</td>
		        	</tr>
			        <tr>
		                <td><label class="form-label">名称<b class="red">*</b></label></td>
		                <td><input class="form-control" name="btn_name" type="text" data-check="must|max-len:50" value="${(obj.btn_name)!}"/></td>
		            </tr>
		            <tr id="typetr" <#if !(obj.pid)??>style="display:none;"</#if>>
		            	<td><label class="form-label">类型</label></td>
		            	<td>
		            		<select class="form-select" id="btn_type" name="btn_type" onchange="btntypechange();">
		            			<option value="">请选择类型</option>
		            			<#list typekeys as type>
		            				<option value="${type}" <#if (obj.btn_type)?? && obj.btn_type==type>selected</#if> >${typemap[type]}</option>
		   						</#list>
		            		</select>
		            	</td>
		            </tr>
					<tr id="keytr" <#if !(obj.id)?? || ((obj.btn_type)?? && obj.btn_type!="click")>style="display:none;"</#if> >
						<td><label class="form-label">触发key值</label></td>
						<td>
							<select class="form-select" name="btn_key">
								<option value="">请选择key值</option>
								<#list keykeys as key>
									<option value="${key}" <#if (obj.btn_key)?? && obj.btn_key==key>selected</#if>>${keymap[key]}</option>
								</#list>
							</select>
						</td>
					</tr>
					<tr id="urltr" <#if !(obj.id)?? || ((obj.btn_type)?? && obj.btn_type!="view")>style="display:none;"</#if>>
						<td><label class="form-label">url地址</label></td>
						<td><input type="text" class="form-control" name="btn_url" data-check="max-len:200" value="${(obj.btn_url)!}" /></td>
					</tr>
					<tr id="materialtr" <#if !(obj.id)?? || ((obj.btn_type)?? && obj.btn_type!="material")>style="display:none;"</#if>>
						<td><label class="form-label">选择素材</label></td>
						<td>
							<input type="text" class="form-control" id="btn_media_name" onclick="tochoosemedia();" name="btn_media_name" value="${(obj.btn_media_name)!}" />
							<input type="hidden" name="btn_media_id" id="btn_media_id" value="${(obj.btn_media.id)!}" />
						</td>
					</tr>
					<tr>
						<td><label class="form-label">排序号</label></td>
						<td><input type="text" class="form-control" name="btn_order" data-check="n" value="${(obj.btn_order)!}" /></td>
					</tr>
			        <tr>
		                <td><label class="form-label">状态<b class="red">*</b></label></td>
		                <td>
		                    <select class="form-select" name="btn_state" data-check="must" >
		                        <option value="1" <#if (obj.btn_state)?? && obj.btn_state=="1">selected</#if>>启用</option>
		                        <option value="0" <#if (obj.btn_state)?? && obj.btn_state=="0">selected</#if>>停用</option>
		                    </select>
		                </td>
		            </tr>
		            <tr>
		                <td><label class="form-label">&nbsp;</label></td>
		                <td>
		                    <input class="btn btn-success btn-large" type="button" onclick="_save()" value="提交">
		                    <input class="btn btn-danger btn-large" type="reset" value="重置">
		                    <input class="btn btn-danger btn-large return-btn" type="button" onclick="_back()" value="返回">
		                </td>
		            </tr>
		        </table>
		    </form>
        </div>
    </div>
</div>
<script type="text/javascript">

function pidchange(){
	var pid = $("#pid").val();
	if(pid){
		$("#listtr").attr("style","display:none;");
		$("#typetr").removeAttr("style");
		var btn_type = $("#btn_type").val();
		if(btn_type=="click"){
			$("#keytr").removeAttr("style");
		}else if(btn_type=="view"){
			$("#urltr").removeAttr("style");
		}else if(btn_type=="material"){
			$("#materialtr").removeAttr("style");
		}
	}else{
		$("#listtr").removeAttr("style");
	}
}

function btnlistchange(){
	var btn_list = $("#btn_list").val();
	if(btn_list==1){
		$("#typetr").attr("style","display:none;");
		$("#keytr").attr("style","display:none;");
		$("#urltr").attr("style","display:none;");
		$("#materialtr").attr("style","display:none;");
	}else{
		$("#typetr").removeAttr("style");
		var btn_type = $("#btn_type").val();
		if(btn_type=="click"){
			$("#keytr").removeAttr("style");
		}else if(btn_type=="view"){
			$("#urltr").removeAttr("style");
		}else if(btn_type=="material"){
			$("#materialtr").removeAttr("style");
		}
	}
}

function btntypechange(){
	var btn_type = $("#btn_type").val();
	if(btn_type=="click"){
		$("#keytr").removeAttr("style");
		$("#urltr").attr("style","display:none;");
		$("#materialtr").attr("style","display:none;");
	}else if(btn_type=="view"){
		$("#urltr").removeAttr("style");
		$("#keytr").attr("style","display:none;");
		$("#materialtr").attr("style","display:none;");
	}else if(btn_type=='material'){
		$("#materialtr").removeAttr("style");
		$("#urltr").attr("style","display:none;");
		$("#keytr").attr("style","display:none;");
	}
}

function tochoosemedia(){
	z_openIframe('选择素材', 1000, 650, '${contextPath}/menubutton/tomateriallist.do?type=news');
}

function _choose(obj){
	$("#btn_media_id").val(obj.media_id);
	$("#btn_media_name").val(obj.media_name+"【"+obj.updateDate+"】");
	layer.closeAll();
}

function _save() {
	if($("#saveform").check()){
		var post = $("#saveform").serialize();
		var url = "${contextPath}/menubutton/modify.ajax";
		if(!confirm("是否确认保存？"))return ;
		$.post(url,post,function(data){
			if(data.s==1){
				alert(data.d||"保存成功！");
				_back();
			}else{
				alert(data.d||"保存失败！");
			}
		},"json");
	}
}
function _back() {
	window.location.href = '${contextPath}/menubutton/tolist.do';
}
</script>
</body>
</html>