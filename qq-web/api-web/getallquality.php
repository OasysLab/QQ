<?php
include("connection.php");

$sql = "SELECT * from quality_data order by received_time desc limit 0,100" ;

$result = $conn->query($sql);

$tmpsend = array();
if ($result->num_rows > 0) 
{

    // output data of each row
    while($row = $result->fetch_assoc()) 
    {
    	array_push($tmpsend, array(	"station_id" => (int)$row["station_id"],
    						"time_receive" => (string)$row["received_time"],
    						"doxigen" => $row["d_oxygen"],
    						"ph" => $row["ph"],
    						"conductivity" => $row["conductivity"],
    						"temperature" => $row["temperature"]));
    }
}

echo json_encode($tmpsend);


$conn->close();

?>
