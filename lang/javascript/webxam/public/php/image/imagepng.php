<?php 
$image = imagecreatefrompng('./square.png');
header('Content-Type: image/png');
header('Cache-Control: no-store');
imagepng($image);
imagedestroy($image);
?>
