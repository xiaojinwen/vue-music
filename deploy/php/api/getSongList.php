<?php
require_once("header.php");
if(isset($_GET["platform"])&&isset($_GET["hostUin"])&&isset($_GET["needNewCode"])&&isset($_GET["disstid"])&&isset($_GET["jsonpCallback"])){
    $post_data = array(
		'g_tk' => $_GET["g_tk"],
		'inCharset' => $_GET["inCharset"],
		'outCharset' => $_GET["outCharset"],
		'notice' => $_GET["notice"],
		'format' => $_GET["format"],
		'disstid' => $_GET["disstid"],
        'platform' => $_GET["platform"],
		'hostUin' => $_GET["hostUin"],
        'type' => $_GET["type"],
        'json' => $_GET["json"],
        'utf8' => $_GET["utf8"],
        'onlysong' => $_GET["onlysongein"],
        'jsonpCallback' => $_GET["jsonpCallback"],
		'needNewCode' => $_GET["needNewCode"]
      );
	$postdata = http_build_query($post_data); 
   
    $header = [
        'Host: c.y.qq.com',
        'Referer: https://c.y.qq.com/',
    ];
    //初始化
     $curl = curl_init();
    //设置抓取的url
    curl_setopt($curl, CURLOPT_URL, 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg?'.$postdata);
    //设置头文件的信息作为数据流输出
    //curl_setopt($curl, CURLOPT_HEADER, 1);
    //设置获取的信息以文件流的形式返回，而不是直接输出。
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
  	curl_setopt($curl, CURLOPT_HTTPHEADER, $header);
    //执行命令
     $data = curl_exec($curl);
    //关闭URL请求
    curl_close($curl);
    //显示获得的数据
  	$str = substr($data,9,$data.len-1);
  	print_r($str);
} else {
	$response["code"]=400;
	$response["message"]="请求参数出错";
	echo json_encode($response);
}
?>