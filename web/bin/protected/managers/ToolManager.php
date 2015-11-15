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
        $curl = curl_init($url);
        if(is_resource($curl) === true){
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
}
?>
