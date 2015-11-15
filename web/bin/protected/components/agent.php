#! /home/work/thirdparty/php5/bin/php
<?php
class Agent
{
    private $server;
    private $filter = array("INFO","ERROR","WARN","DEBUG","FATAL");

    public function __construct($server){
        $this->server   = $server;
    }
    
    public function send($type, $log)
    {
        $logItem = (array)json_decode($log);
        $level   = strtoupper($logItem["level"]);
        if(!in_array($level, $this->filter)){
            return ;
        }
        $params = array();
        $params["content"] = $log;
        $params["appName"] = $type;
        $this->sendHttpRequest($this->server,"post",$params);
    }

    private function sendHttpRequest($url,$method,$params=array()){
        if(trim($url)==''||!in_array($method,array('get','post'))||!is_array($params)){
            return false;
        }
        $curl=curl_init();
        curl_setopt($curl,CURLOPT_RETURNTRANSFER,1);
        curl_setopt($curl,CURLOPT_HEADER,0 ) ;
        switch($method){
            case 'get':
                $str='?';
                foreach($params as $k=>$v){
                    $str.=$k.'='.$v.'&';
                }
                $str=substr($str,0,-1);
                $url.=$str;
                curl_setopt($curl,CURLOPT_URL,$url);
            break;
            case 'post':
                curl_setopt($curl,CURLOPT_URL,$url);
                curl_setopt($curl,CURLOPT_POST,1 );
                curl_setopt($curl,CURLOPT_POSTFIELDS,$params);
            break;
            default:
                $result='';
            break;
        }
        if(!isset($result)){

            $result=curl_exec($curl);
        }
        curl_close($curl);
        return $result;
    }
}
$type   =   trim($argv[1]);
$server =   trim($argv[2]);
$log    =   trim($argv[3]);
$agent  =   new Agent($server);
$agent->send($type, $log);
