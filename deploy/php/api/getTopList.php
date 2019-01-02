<?php
require_once("header.php");
if(isset($_GET["platform"])&&isset($_GET["needNewCode"])&&isset($_GET["_"])&&isset($_GET["format"])){
    $post_data = array(
        'platform' => $_GET["platform"],
        'needNewCode' => $_GET["needNewCode"],
        '_' => $_GET["_"],
        'format' => $_GET["format"],
        'g_tk' => $_GET["g_tk"],
        'inCharset' => $_GET["inCharset"],
         'outCharset' => $_GET["outCharset"],
       	 'notice' => $_GET["notice"] 
      );
	$postdata = http_build_query($post_data); 
   
    $header = [
        'Host:c.y.qq.com',
        'Referer: https://c.y.qq.com/',
    ];
    //初始化
     $curl = curl_init();
    //设置抓取的url
    curl_setopt($curl, CURLOPT_URL, 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg?'.$postdata);
    //设置头文件的信息作为数据流输出
    //curl_setopt($curl, CURLOPT_HEADER, 1);
    //设置获取的信息以文件流的形式返回，而不是直接输出。
    //curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
  	curl_setopt($curl, CURLOPT_HTTPHEADER, $header);
    //执行命令
     $data = curl_exec($curl);
    //关闭URL请求
    curl_close($curl);
    //显示获得的数据
	//print_r(json_encode($data));
} else {
	$response["code"]=400;
	$response["message"]="请求参数出错";
	echo json_encode($response);
}
?>