<?php
include("connection.php");

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$station_id             = $request->data->station_id;
$delay_reset            = $request->data->delay_reset;
$duration_pump_error    = $request->data->duration_pump_error;
$rain_overflow          = $request->data->rain_overflow;
$rain_work              = $request->data->rain_work;
$number_data            = $request->data->number_data;
$mode                   = $request->data->mode;
$ultrasonic_routine     = $request->data->ultrasonic_routine;
$round_H_1              = $request->data->round_H_1;
$round_M_1              = $request->data->round_M_1;
$round_H_2              = $request->data->round_H_2;
$round_M_2              = $request->data->round_M_2;

$sql = "UPDATE station_config set   delay_reset = '$delay_reset',
                                    duration_pump_error = '$duration_pump_error',
                                    rain_overflow = '$rain_overflow',
                                    rain_work = '$rain_work',
                                    number_data = '$number_data',
                                    mode = '$mode',
                                    ultrasonic_routine = '$ultrasonic_routine',
                                    round_H_1 = '$round_H_1',
                                    round_M_1 = '$round_M_1',
                                    round_H_2 = '$round_H_2',
                                    round_M_2 = '$round_M_2'
                                    where station_id = $station_id";
// echo $sql;
$result = $conn->query($sql);

if ($result) 
{
   echo json_encode(array('status' => true ));
}

$conn->close();

?>
