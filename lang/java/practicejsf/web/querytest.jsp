<%@taglib uri="http://java.sun.com/jsp/jstl/sql" prefix="sql"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<sql:query var="rs" dataSource="jdbc/JSFTest">
	SELECT ID, NAME FROM authors
</sql:query>
<html>
	<head>
		<meta charset="UTF-8" />
		<title>テーブル検索テスト</title>
	</head>
	<body>
		<h1>テーブル検索テスト</h1>
		
		<p><span>ID</span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>名前</span></p>
		<c:forEach var="row" items="${rs.rows}">
			<span>${row.id}</span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>${row.name}</span><br />
		</c:forEach>
			
		<div>
			<ul>
				<li><a href="jdbcintegration.xhtml">JSFバージョン</a></li>
				<li><a href="index.xhtml">home</a></li>
			</ul>
		</div>	
	</body>
</html>
