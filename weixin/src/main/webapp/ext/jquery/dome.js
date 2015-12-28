
function _submit() {
	if(!window.confirm("确定提交?"))return;
	$.ajax({url:"<%=request.getContextPath() %>/2020",data:{username:"123",password:"456"},type:"post",dataType:"json", success: function(data){
        if(data.s!=1){
          alert(data.d);
          return;
        }
        alert(data.d||"操作成功！");
        window.location.href="<%=request.getContextPath() %>/2011";
	}});
	
	$.post("test.php", { "func": "getNameAndTime" }, function(data){
		if(data.s!=1){
			alert(data.d);
			return;
        }
        alert(data.d||"操作成功！");
	}, "json");
}
function Jquery_js() {
	$(document).ready(function(){
	   show();
	});
	
	$(function(){
		show();
	});
	
	;(function($, undefined) { 
		"use strict";
		
	    // 使用 $ 作为 jQuery 别名的代码，不会受到外部的$的定义的影响
	})(jQuery);
	
	$("input[name='obj.csny']");
	
	// id以conf_开头的所有input表单里的值的串
	$("input[id^='conf_']").map(function(){return $(this).val();}).get().join("-");
	
	$("[verifykey='ntype']:checked").val();// 返回radio选中的值
	$("[verifykey='ntype'] option:selected").val();// 返回select选中的值
	$("[verifykey='ntype'] option:first").prop("selected", 'selected');// 选中第一个
	$("[verifykey='ntype'] option[value='123']").prop("selected", 'selected');// 选择值为123的项
	
	$("[verifykey='ntype'] input:checked");// 选择的
	$("[verifykey='ntype'] input:checkbox").not("input:checked");// 未选中的
	
	$(selector).attr("id");			//返回属性id的值
	$(selector).attr("id", "123");	//改变属性id的值
	$(selector).removeAttr("id");	//移除属性id
	
	$(selector).prop("disabled", false);
	$(selector).prop("checked", true);
	$(selector).removeProp("disabled");
	
	$(selector).html();				//返回被选元素的HTML内容
	$(selector).html(content); 		//改变被选元素的（内部）HTML 
	$(selector).text();				//得到匹配元素集合中每个元素的文本内容结合,包括他们的后代。
	$(selector).text(content);		//设置匹配元素集合中每个元素的文本内容为指定的文本内容。
	$(selector).val();				//获取匹配的元素集合中第一个元素的当前值。
	$(selector).val(context);		//设置匹配的元素集合中每个元素的值。
	$(selector).data('foo', 52);	//绑定任意相关数据
	$(selector).data('foo');		//52
	$(selector).append(content); 	//在被选元素的结尾（内部）追加内容
	$(selector).prepend(content); 	//在被选元素的开头（内部）插入内容
	$(selector).after(content); 	//在被选元素之后添加 HTML 
	$(selector).before(content); 	//在被选元素之前添加 HTML 
	
	// 尺寸
	$(selector).width(); 	//设置或返回元素的宽度（不包括内边距、边框或外边距）。
	$(selector).height(); 	//设置或返回元素的高度（不包括内边距、边框或外边距）。
	$(selector).innerWidth();	//返回元素的宽度（包括内边距）。
	$(selector).innerHeight();	//返回元素的高度（包括内边距）。
	$(selector).outerWidth(); 	//返回元素的宽度（包括内边距和边框）。
	$(selector).outerHeight(); 	//返回元素的高度（包括内边距和边框）。
	$(selector).outerWidth(true); 	//返回元素的宽度（包括内边距、边框和外边距）。
	$(selector).outerHeight(true); 	//返回元素的高度（包括内边距、边框和外边距）。
	$(document).width();	// 返回HTML文档的宽度
	
	$(selector).parent();	//返回被选元素的直接父元素。
	$(selector).parents();	//返回被选元素的所有祖先元素，它一路向上直到文档的根元素 (<html>)。
	$("span").parentsUntil("div");	//返回介于 <span> 与 <div> 元素之间的所有祖先元素。
	$("div").find("span");	//返回属于 <div> 后代的所有 <span> 元素。
	
	$(selector).hide();
	$(selector).show();
	$(selector).toggle();//隐藏或显示
	$(selector).focus();//获得焦点
	$(selector).focus(function(){});	//获得焦点时执行方法
	
	$(selector).error(function(){});	//绑定一个事件处理器到“错误”JavaScript事件上。如：图片URL错误时触发方法里的事件
}
