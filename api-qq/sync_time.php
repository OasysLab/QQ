<?php
// 139.59.251.210/api-qq/sync_time.php

date_default_timezone_set('Asia/Bangkok');
$now = date('Y-m-d H:i:s');

$tmpsend = array(	"Y" => (int)date('Y'),
					"m" => (int)date('m'),
					"d" => (int)date('d'),
					"H" => (int)date('H'),
					"i" => (int)date('i'),
					"s" => (int)date('s'));

echo json_encode($tmpsend);
?>
