<!DOCTYPE html>
<html lang="ja">
<head>
	<meta charset="UTF-8" />
	<title>PHP Syntax Practice</title>
</head>
<body>
	<h1>PHP Syntax Practice</h1>
	<h2>Array</h2>
<?php

$hoge = [1,2,3,4,5];

for($i = 0, $size = count($hoge); $i < $size; $i++){
	print($hoge[$i]);
}

class foo{}

$foofoo = new foo();

print($foo);

$fooarray = [
	//$foofoo => "foo" /* error */
	1 => "foofoofoo"
];

?>
</body>
