<?php
include("connection.php");

$sql = "SELECT * from station_config";

$result = $conn->query($sql);

$tmpsend = array();
if ($result->num_rows > 0) 
{
    $i = 0;
    // output data of each row
    while($row = $result->fetch_assoc()) 
    {
    	array_push($tmpsend, array(	"no" =>$i,
                            "station_id" => (int)$row["station_id"],
    						"delay_reset" => $row["delay_reset"],
    						"duration_pump_error" => $row["duration_pump_error"],
    						"rain_overflow" => (int)$row["rain_overflow"],
    						"rain_work" => (int)$row["rain_work"],
    						"number_data" => (int)$row["number_data"],
    						"mode" => $row["mode"],
                            "ultrasonic_routine" => $row["ultrasonic_routine"],
                            "round_H_1" => $row["round_H_1"],
                            "round_M_1" => $row["round_M_1"],
                            "round_H_2" => $row["round_H_2"],
    						"round_M_2" => $row["round_M_2"]));
        $i++;
    }
}

echo json_encode($tmpsend);


$conn->close();

?>
