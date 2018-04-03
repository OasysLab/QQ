<?php
include("connection.php");
// 139.59.251.210/api-qq/send_db_status.php?StationID=203&pump=230
$StationID=$_GET[StationID];

date_default_timezone_set('Asia/Bangkok');
$now = date('Y-m-d H:i:s');

if(isset($_GET[pump]))
{
	$sql = "UPDATE station_status set pump_status = '$_GET[pump]', pump_status_update = '$now' where station_id = $StationID";
	// echo $sql;
	$result = $conn->query($sql);

}
if(isset($_GET[power_sen]))
{
	$sql = "UPDATE station_status set power_status = '$_GET[power_sen]', pewer_status_update = '$now' where station_id = $StationID";
	// echo $sql;
	$result = $conn->query($sql);
}
if(isset($_GET[ultrasonic]))
{
	$sql = "UPDATE station_status set ultrasonic_status = '$_GET[ultrasonic]', ultrasonic_status_update = '$now' where station_id = $StationID";
	// echo $sql;
	$result = $conn->query($sql);
}
if(isset($_GET[doxigen]))
{
	$sql = "UPDATE station_status set do_status = '$_GET[doxigen]', do_status_update = '$now' where station_id = $StationID";
	// echo $sql;
	$result = $conn->query($sql);
}
if(isset($_GET[ph]))
{
	$sql = "UPDATE station_status set ph_status = '$_GET[ph]', ph_status_update = '$now' where station_id = $StationID";
	// echo $sql;
	$result = $conn->query($sql);
}
if(isset($_GET[conductivity]))
{
	$sql = "UPDATE station_status set conductivity_status = '$_GET[conductivity]', conductivity_status_update = '$now' where station_id = $StationID";
	// echo $sql;
	$result = $conn->query($sql);
}
if(isset($_GET[watertemp]))
{
	$sql = "UPDATE station_status set watertemp_status = '$_GET[watertemp]', watertemp_status_update = '$now' where station_id = $StationID";
	// echo $sql;
	$result = $conn->query($sql);
}
if(isset($_GET[signal]))
{
	$sql = "UPDATE station_status set signal_strenge = '$_GET[signal]', signal_strenge_update = '$now' where station_id = $StationID";
	// echo $sql;
	$result = $conn->query($sql);
}

if ($result) 
{
   echo "Success";
}

$conn->close();

?>
