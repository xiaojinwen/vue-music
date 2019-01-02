<?php
header('Access-Control-Allow-Origin:*');
header('Access-Control-Allow-Credentials:true'); 
header('Content-Type:application:json;charset=utf8');  
header('Access-Control-Allow-Methods:POST,GET'); 
header('Access-Control-Allow-Headers:Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'); 
global $return;
$return = array(
	'制作者qq'=>'1058330410'
);
	header('Access-Control-Allow-Origin:*');  
if($_SERVER['REQUEST_METHOD']== 'OPTIONS'){ 
 exit;
}
$response=array();//定义JSON响应数组
global $headers;
$headers = array(); 
foreach ($_SERVER as $key => $value) { 
	if ('HTTP_' == substr($key, 0, 5)) { 
		$headers[str_replace('_', '-', substr($key, 5))] = $value; 
	} 
}
?>