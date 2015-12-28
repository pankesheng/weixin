<#-- <#ftl strip_whitespace=true> -->

<#-- <@z.z_substring val="abcdefg" len=3/> -->
<#macro z_substring val len>
<#if (val?length <= len)>
${val}
<#else>
${val[0..len-1]}...
</#if>
</#macro>

<#-- <@z.z_delHTMLTag val="<a>abcdefg</a>" len=3/> -->
<#macro z_delHTMLTag val len=0>
<#assign v='${val?replace("<script[^>]*?>.*?</script>","","ri")?replace("<style[^>]*?>.*?</style>","","ri")?replace("<[^>]+>","","ri")}' />
<#if len=0>
${v}
<#else>
<@z.z_substring val=v len=len />
</#if>
</#macro>

<#-- <@z.z_now /> -->
<#macro z_now>${.now?string("yyyyMMddHHmmssSSS")}</#macro>

