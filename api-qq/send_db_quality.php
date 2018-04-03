<?php
include("connection.php");
// 139.59.251.210/api-qq/send_db_quality.php?StationID=203&D_O=0&pH=0&Conductivity=0&temp=99
$StationID=$_GET[StationID];
$D_O=$_GET[D_O];
$pH=$_GET[pH];
$Conductivity=$_GET[Conductivity];
$temp = $_GET[temp];

date_default_timezone_set('Asia/Bangkok');
$now = date('Y-m-d H:i:s');

$sql = "INSERT INTO quality_data VALUES (	'$now',
											'$StationID',
											'$D_O',
											'$pH',
											'$Conductivity',
											'$temp'
										)";
// echo $sql;
$result = $conn->query($sql);

if ($result) 
{
	echo "Success";
	$sql = "SELECT * from station_config where station_id = $StationID";

	$result = $conn->query($sql);
	if ($result->num_rows > 0) 
	{
	    // output data of each row
	    while($row = $result->fetch_assoc()) 
	    {
	    	$tmp_h1 = (int)$row["round_H_1"];
	    	if($row['every_hour'] == 1)
	    	{
	    		if($tmp_h1 == 23)
	    		{
	    			$tmp_h1 = 0;
	    		}
	    		else
	    		{
	    			$tmp_h1++;
	    		}
	    		$sql = "UPDATE station_config set 	round_H_1 = '$tmp_h1',
                                    				round_M_1 = '0',
				                                    round_H_2 = '99',
				                                    round_M_2 = '99'
													where station_id = $StationID";
				// echo $sql;
				$result = $conn->query($sql);
				if ($result) 
				{
					echo "update time";
				}
	    	}
	    	
	    }
	}
}

$conn->close();

?>
