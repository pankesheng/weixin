<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="zh-cn">
<head>
    <meta charset="UTF-8">
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <title></title>
    <style type="text/css">
        html, body{
            background-color: #eeedec;
            height: 100%;
            padding: 0;
            margin: 0;
        }
        p{
            margin: 10px 0;
        }
        .not-found{
            width: 100%;
            height: 100%;
        }
        .btn{
            display: inline-block;
            *display: inline;
            *zoom: 1;
            height: 28px;
            padding: 0px 25px;
            line-height: 28px;
            color: #fff;
            background-color: #498ef5;
            border: 1px solid #2871f5;
            border-radius: 2px;
            text-decoration: none;
            cursor: pointer;
        }
        .tip{
            display: inline-block;
            *display: inline;
            *zoom: 1;
            margin-left: 10px;
            font-family: Microsoft YaHei, '微软雅黑', MicrosoftJhengHei;
        }
    </style>
</head>
<body>
    <div class="not-found">
        <table width="100%" height="100%">
            <tr>
                <td align="center" valign="middle">
                    <div class="failed">
                        <img src="<%=request.getContextPath() %>/admin/images/failed-tip.png" alt="success-tip" />
                        <div class="tip">
                            <p>${error }</p>
                            <P>您可以选择</p>
                            <a href="<%=request.getContextPath() %>/login.jsp" class="btn">返回首页</a>
                        </div>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>