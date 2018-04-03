<?php
include("connection.php");

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$user	= $request->username;
$pass	= $request->password;

$sql = "SELECT * from users where username = '$user' and password = '$pass'" ;
// echo $sql;
$result = $conn->query($sql);
// var_dump($result);
if ($result->num_rows > 0) 
{
      session_start();
      $_SESSION['uid']=uniqid('ang_');
      print $_SESSION['uid'];
}

$conn->close();

?>
