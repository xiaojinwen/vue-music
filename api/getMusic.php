<?php
require_once("header.php");
 
	function getFile($url, $save_dir = '', $filename = '', $type = 0) {
		if (trim($url) == '') {
			return false;
		}
		if (trim($save_dir) == '') {
			$save_dir = './';
		}
		if (0 !== strrpos($save_dir, '/')) {
			$save_dir.= '/';
		}
		//创建保存目录
		if (!file_exists($save_dir) && !mkdir($save_dir, 0777, true)) {
			return false;
		}
		//获取远程文件所采用的方法
		if ($type) {
			$ch = curl_init();
			$timeout = 5;
			curl_setopt($ch, CURLOPT_URL, $url);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
			$content = curl_exec($ch);
			curl_close($ch);
		} else {
			ob_start();
			readfile($url);
			$content = ob_get_contents();
			ob_end_clean();
		}
		$size = strlen($content);
		//文件大小
		$fp2 = @fopen($save_dir . $filename, 'a');
		fwrite($fp2, $content);
		fclose($fp2);
		unset($content, $url);
		return array(
				'file_name' => $filename,
				'save_path' => $save_dir . $filename
		);
	}


function randIP(){
  $ip_long = array(
    array('607649792', '608174079'), //36.56.0.0-36.63.255.255
    array('1038614528', '1039007743'), //61.232.0.0-61.237.255.255
    array('1783627776', '1784676351'), //106.80.0.0-106.95.255.255
    array('2035023872', '2035154943'), //121.76.0.0-121.77.255.255
    array('2078801920', '2079064063'), //123.232.0.0-123.235.255.255
    array('-1950089216', '-1948778497'), //139.196.0.0-139.215.255.255
    array('-1425539072', '-1425014785'), //171.8.0.0-171.15.255.255
    array('-1236271104', '-1235419137'), //182.80.0.0-182.92.255.255
    array('-770113536', '-768606209'), //210.25.0.0-210.47.255.255
    array('-569376768', '-564133889'), //222.16.0.0-222.95.255.255
  );
  $rand_key = mt_rand(0, 9);
  $ip= long2ip(mt_rand($ip_long[$rand_key][0], $ip_long[$rand_key][1]));
  $headers['CLIENT-IP'] = $ip; 
  $headers['X-FORWARDED-FOR'] = $ip; 

  $headerArr = array(); 
  foreach( $headers as $n => $v ) { 
    $headerArr[] = $n .':' . $v;  
  }
  return $ip;    
}

if(isset($_GET["platform"])&&isset($_GET["hostUin"])&&isset($_GET["needNewCode"])&&isset($_GET["songmid"])&&isset($_GET["filename"])){
    $post_data = array(
		'g_tk' => $_GET["g_tk"],
		'inCharset' => $_GET["inCharset"],
		'outCharset' => $_GET["outCharset"],
		'notice' => $_GET["notice"],
		'format' => $_GET["format"],
		'songmid' => $_GET["songmid"],
		'uin' => $_GET["uin"],
        'platform' => $_GET["platform"],
		'hostUin' => $_GET["hostUin"],
        'cid' => $_GET["cid"],
        'guid' => $_GET["guid"],
        'filename' => $_GET["filename"],
		'needNewCode' => $_GET["needNewCode"]
      );
	$postdata = http_build_query($post_data); 
   //此函数提供了国内的IP地址
  $ip = randIP();
    $header = [
        'Host: c.y.qq.com',
        'Referer: https://c.y.qq.com/',
      	'CLIENT-IP: '.$ip,
     	 'X-FORWARDED-FOR: '.$ip
    ];
    //初始化
    $curl = curl_init();
    //设置抓取的url
	curl_setopt($curl, CURLOPT_URL, 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg?'.$postdata);
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
  	print_r($data);
} else {
	$response["code"]=400;
	$response["message"]="请求参数出错";
	echo json_encode($response);
}
?>