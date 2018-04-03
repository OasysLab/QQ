<?php
include("connection.php");
// 139.59.251.210/api-qq/get_station_config.php?StationID=203
$stationID=$_GET[StationID];

$sql = "SELECT * from station_config where station_id = $stationID";

$result = $conn->query($sql);

if ($result->num_rows > 0) 
{
    // output data of each row
    while($row = $result->fetch_assoc()) 
    {
    	$tmpsend = array(	"reset" => (int)$row["delay_reset"],
    						"duration" => (int)$row["duration_pump_error"],
    						"overflow" => (int)$row["rain_overflow"],
    						"work" => (int)$row["rain_work"],
    						"number_data" => (int)$row["number_data"],
    						"mode" => (int)$row["mode"],
    						"time_sync" => (int)$row["time_sync"],
    						"routine" => (int)$row["ultrasonic_routine"],
    						"reset_manual" => (bool)$row["reset_manual"],
    						"round_H" => array(	(int)$row["round_H_1"],
												// (int)$row["round_H_2"],
												// (int)$row["round_H_3"],
												// (int)$row["round_H_4"],
												// (int)$row["round_H_5"],
												// (int)$row["round_H_6"],
												// (int)$row["round_H_7"],
												// (int)$row["round_H_8"],
												// (int)$row["round_H_9"],
												// (int)$row["round_H_10"],
												// (int)$row["round_H_11"],
												// (int)$row["round_H_12"],
												// (int)$row["round_H_13"],
												// (int)$row["round_H_14"],
												// (int)$row["round_H_15"],
												// (int)$row["round_H_16"],
												// (int)$row["round_H_17"],
												// (int)$row["round_H_18"],
												// (int)$row["round_H_19"],
												// (int)$row["round_H_20"],
												// (int)$row["round_H_21"],
												// (int)$row["round_H_22"],
												// (int)$row["round_H_23"],
												(int)$row["round_H_2"]),
    						"round_M" => array(	(int)$row["round_M_1"],
												// (int)$row["round_M_2"],
												// (int)$row["round_M_3"],
												// (int)$row["round_M_4"],
												// (int)$row["round_M_5"],
												// (int)$row["round_M_6"],
												// (int)$row["round_M_7"],
												// (int)$row["round_M_8"],
												// (int)$row["round_M_9"],
												// (int)$row["round_M_10"],
												// (int)$row["round_M_11"],
												// (int)$row["round_M_12"],
												// (int)$row["round_M_13"],
												// (int)$row["round_M_14"],
												// (int)$row["round_M_15"],
												// (int)$row["round_M_16"],
												// (int)$row["round_M_17"],
												// (int)$row["round_M_18"],
												// (int)$row["round_M_19"],
												// (int)$row["round_M_20"],
												// (int)$row["round_M_21"],
												// (int)$row["round_M_22"],
												// (int)$row["round_M_23"],
												(int)$row["round_M_2"]));
    }
}

echo json_encode($tmpsend);


$conn->close();

?>
