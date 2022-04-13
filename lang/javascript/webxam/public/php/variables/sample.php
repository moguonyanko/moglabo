<?php 
echo $_POST['name'], '<br />';
echo $_GET['appid'], '<br />'; // POSTで送信されたformからでも取得できる。
echo $_REQUEST['age'], '<br />';
echo $_COOKIE['samplecookie'];
?>
