<%--
  Created by IntelliJ IDEA.
  User: nealmangaokar
  Date: 9/27/17
  Time: 12:33 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
    <title>DoTA 2 Hero Chooser</title>
</head>
<body>

    <c:set var = "Hero" value="${requestScope.best_hero}"/>
    <c:set var = "stats" value="${requestScope.allHeroStats}"/>
    <c:out value="${stats}" />


</body>
</html>
