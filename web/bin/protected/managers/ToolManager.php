<?php
/**
 * A encapsulated class used to common functions
 * @date 2014-11-26
 * @author renbaozhan
*/
class ToolManager {


    public function ArrayResult($status, $msg, $data = NULL) {
        return array(
            "status" => $status,
            "msg" => $msg,
            "data" => $data);
    }

    public static function post($url, $post = null, $retries = 1){
        #$curl = curl_init($url);
        $curl = curl_init();
        if(is_resource($curl) === true){
                curl_setopt($curl, CURLOPT_URL, $url);
                curl_setopt($curl, CURLOPT_HEADER, 0);
                curl_setopt($curl, CURLOPT_FAILONERROR, true);
                curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
                curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
                curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

                if(isset($post) === true){
                        curl_setopt($curl, CURLOPT_POST, true);
                        curl_setopt($curl, CURLOPT_POSTFIELDS, (is_array($post) === true) ? http_build_query($post, "", "&"): $post);
                }

                $result = false;

                while(($result === false) && ($retries > 0)){
                    $retries--;
                    $result = curl_exec($curl);
                }

                curl_close($curl);
        }
        return $result;
    }

    public static function xml_to_array($xml){
        $reg = "/<(\w+)[^>]*>([\\x00-\\xFF]*)<\\/\\1>/";
        if(preg_match_all($reg, $xml, $matches)){
            $count = count($matches[0]);
            for($i = 0; $i < $count; $i++){
                $subxml= $matches[2][$i];
                $key = $matches[1][$i];
                if(preg_match($reg, $subxml)){
                    $arr[$key] = ToolManager::xml_to_array($subxml);
                }else{
                    $arr[$key] = $subxml;
                }
            }
        }
        return $arr;
    }

    public static function gen_sms_code($length = 6 , $numeric = 0) {
        PHP_VERSION < '4.2.0' && mt_srand((double)microtime() * 1000000);
        if($numeric) {
            $hash = sprintf('%0'.$length.'d', mt_rand(0, pow(10, $length) - 1));
        } else {
            $hash = '';
            $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789abcdefghjkmnpqrstuvwxyz';
            $max = strlen($chars) - 1;
            for($i = 0; $i < $length; $i++) {
                $hash .= $chars[mt_rand(0, $max)];
            }
        }
        return $hash;
    } 


    public static function caculateDistanceByLatLon($lat1, $lng1, $lat2, $lng2){
        $EARTH_RADIUS = 6378.137;  
        $radLat1 = $lat1 * 3.1415926535898 / 180.0;  
        $radLat2 = $lat2 * 3.1415926535898 / 180.0;  
        $a = $radLat1 - $radLat2;  
        $b = $lng1 * 3.1415926535898 / 180.0 - $lng2 * 3.1415926535898 / 180.0;  
        $s = 2 * asin(sqrt(pow(sin($a/2),2) +  
        cos($radLat1)*cos($radLat2)*pow(sin($b/2),2)));  
        $s = $s *$EARTH_RADIUS;  
        $s = round($s * 10000) / 10000;  

        return $s;  
    }

    public static function genOrderNum(){
        $yCode = array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J');
        $orderSn = $yCode[intval(date('Y')) - 2011] . strtoupper(dechex(date('m'))) . date('d') . substr(time(), -5) . substr(microtime(), 2, 5) . sprintf('%02d', rand(0, 99));
        return $orderSn;
    }
}
?>
