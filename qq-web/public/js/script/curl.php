<?php
class ClassName 
{
    public function postCurl($url,$header,$tmp)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL,"http://yost1.banana.co.th/API/Manage/api".$url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $header); 

        curl_setopt($ch, CURLOPT_HEADER, 0); 
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $tmp);
        $response = curl_exec($ch);
        $tmpj = json_decode($response,true);
        curl_close($ch);

        return $tmpj;
    }

    public function getCurl($url,$header)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL,"http://yost1.banana.co.th/API/Manage/api".$url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $header); 
        curl_setopt($ch, CURLOPT_HEADER, 0); 
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        $tmpj = json_decode($response,true);
        curl_close($ch);

        return $tmpj;
    }
}
// it will print whole json string, which you access after json_decocde in php
$myData = file_get_contents('php://input', true);
$tmp = json_decode($myData,true);

$body = array("user" => $tmp['username'],"pass" => $tmp['password']);
$tmp2 = json_encode($body);

$response = ClassName::postCurl($tmp['url'],$tmp['headers'],$tmp2);
//echo json_encode($response);
echo "strdsadsadaing";

?>