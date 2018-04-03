<?php
include("connection.php");

$sql = "SELECT * from station_status" ;

$result = $conn->query($sql);

$tmpsend = array();
if ($result->num_rows > 0) 
{

    // output data of each row
    while($row = $result->fetch_assoc()) 
    {
    	array_push($tmpsend, array(	"station_id" => (int)$row["station_id"],
    						"pump" => (int)$row["pump_status"],
    						"power" => (int)$row["power_status"],
    						"ultrasonic" => (int)$row["ultrasonic_status"],
    						"DO" => (int)$row["do_status"],
    						"pH" => (int)$row["ph_status"],
    						"conductivity" => (int)$row["conductivity_status"],
    						"temperature" => (int)$row["watertemp_status"]));
    }
}

echo json_encode($tmpsend);


$conn->close();

?>
