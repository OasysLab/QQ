<?php
include("connection.php");
// 139.59.251.210/api-qq/change_mode.php?StationID=203&mode=230
$StationID=$_GET[StationID];

date_default_timezone_set('Asia/Bangkok');
$now = date('Y-m-d H:i:s');

if(isset($_GET[mode]))
{
	$sql = "UPDATE station_config set mode = '$_GET[mode]' where station_id = $StationID";
	// echo $sql;
	$result = $conn->query($sql);

}

if(isset($_GET[reset]))
{
	$sql = "UPDATE station_config set reset_manual = '$_GET[reset]' where station_id = $StationID";
	// echo $sql;
	$result = $conn->query($sql);
}

if ($result) 
{
   echo "Success";
}

$conn->close();

?>
