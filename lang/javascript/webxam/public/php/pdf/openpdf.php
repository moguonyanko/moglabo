<?php
/**
 * 参考:
 * https://www.geeksforgeeks.org/how-to-open-a-pdf-files-in-web-browser-using-php/
 */

$filename = $_GET['name'];
  
header('Content-type: application/pdf');  
header('Content-Disposition: inline; filename="' . $filename . '"');  
header('Content-Transfer-Encoding: binary');
header('Accept-Ranges: bytes');
  
readfile($filename);
?>