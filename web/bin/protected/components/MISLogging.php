<?php
/**
* Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
*
* @file		Logger.php
* @author	huangchuan@baidu.com
* @brief	the client of logging 
**/

class MISLogging extends CApplicationComponent
//class CLogging extends CApplicationComponent
{
    /**
    *session id,client auto generated
    */
    private $sid;
    /**
    *username,default is $_SESSION['uuap']['username']
    */
    private $username;
    /**
    *log client name
    */
    private $app;
    /**
    *log server address
    */
    private $server;
    /**
    *type of log content,system log or application log
    */
    private $logType;
    /**
    *access limit, 0 is all, 1 is group, 2 is owner
    */
    private $logLimit;
    /**
    * array(
    *		'email'=>'huangchuan, yangfangwei',
    *		'message'=>'huangchuan'
    *	)
    */
    private $alarmConfig;
    /**
    * default alarm level
    */
    private $alarmLevel = array("WARN","ERROR","FATAL");

    public function init()
    {
        $this->sid = $this->generate_sid();
        if(!(YII_DEBUG)) {
            set_exception_handler(array($this, "onException"));
            set_error_handler(array($this, "onError"));
        }
    }

    /**
     * 重置sid
     */
    public function resetSid() {
        $this->sid			=	$this->generate_sid();
    }


    public function write_log($level,$title,$content=null)
    {
        if($level == 'info' || $level == 'INFO')
            $level = 'INFO';
        else if($level == 'debug' || $level == 'DEBUG')
            $level = 'DEBUG';
        else if($level == 'warn' || $level == 'WARN')
            $level = 'WARN';
        else if($level == 'error' || $level == 'ERROR')
            $level = 'ERROR';
        else if($level == 'fatal' || $level == 'FATAL')
            $level = 'FATAL';
        else
            return false;

        $trace			= debug_backtrace();
        $filename		= $trace[0]['file'];
        $lineno			= $trace[0]['line'];
        return $this->raw($level, $title, $content, $filename, $lineno);
    }
    
    public function logDebug($title,$content=null)
    {
        $trace			= debug_backtrace();
        $filename		= $trace[0]['file'];
        $lineno			= $trace[0]['line'];
        return $this->raw("DEBUG", $title, $content, $filename, $lineno);
    }

    public function logInfo($title,$content=null)
    {
        $trace    = debug_backtrace();
        $filename = $trace[0]['file'];
        $lineno   = $trace[0]['line'];
        return $this->raw("INFO", $title, $content, $filename, $lineno);
    }
    
    public function logWarn($title,$content=null)
    {
        $trace    = debug_backtrace();
        $filename = $trace[0]['file'];
        $lineno   = $trace[0]['line'];
        return $this->raw("WARN", $title, $content, $filename, $lineno);
    }
    
    public function logError($title,$content=null)
    {
        $trace    = debug_backtrace();
        $filename = $trace[0]['file'];
        $lineno   = $trace[0]['line'];
        return $this->raw("ERROR", $title, $content, $filename, $lineno);
    }
    
    public function logFatal($title,$content=null)
    {
        $trace    = debug_backtrace();
        $filename = $trace[0]['file'];
        $lineno   = $trace[0]['line'];
        return $this->raw("FATAL", $title, $content, $filename, $lineno);
    }
    
    public function raw($level, $title, $content, $filename, $lineno)
    {
        $logType		= isset($this->logType)?$this->logType:0;
        $logLimit		= isset($this->logLimit)?$this->logLimit:0;
        $title_utf8 = trim(mb_convert_encoding($title, "utf-8", "utf8, gb2312, gbk"));
        $alarmConfig    = isset($this->alarmConfig)?$this->alarmConfig:null;
        if(in_array($level,$this->alarmLevel))      {   
            $alarmConfig        =   @isset($this->alarmConfig)?json_encode($this->alarmConfig):null;  
        }else{ 
            $alarmConfig        =   null;  
        }
        if(is_array($content))
        {
            $content_utf8 = @json_encode($content);
        }
        else if(is_object($content)){
            $content_utf8 = (array)$content;
        }
        else
        {
            $content_utf8=trim(mb_convert_encoding($content,"utf-8","utf8, gb2312, gbk"));
        }
        if($this->sid === 0 || !isset($this->sid)){
            $this->sid=$this->generate_sid();
        }
        $username = $this->username;
        $param = array(
            "created"		=> microtime(true),
            "sid"			=> $this->sid,
            "level"			=> $level,
            "username"		=> $username,
            "filename"		=> $filename,
            "lineno"		=> $lineno,
            "title"			=> $title_utf8,
            "content"		=> $content_utf8,
            "logType"		=> $logType,
            "logLimit"		=> $logLimit,
            "alarmConfig"	=> $alarmConfig,
        );
        
        if(defined(BAE_ENABLE)  &&  BAE_ENABLE){
            $filter = array("INFO","ERROR","WARN","FATAL");
            $params = array();
            if(!in_array($level, $filter)){
                return;
            }

            $params["content"] = json_encode($param);
            $params["appName"] = $this->app;
            $url = $this->server;

            $httpproxy = BaeFetchUrl::getInstance(array('timeout'=>100000,'conn_timeout'=>10000,'max_response_size'=> 512000));
            $ret = $httpproxy->post($url, $params);
            return ;
        }

        $param  =   escapeshellarg(json_encode($param)); 
        $fp     =   popen(dirname(__FILE__) ."/agent ".$this->app." ".$this->server." ".$param."  > /dev/null &", 'w');  
        pclose($fp);
    }

    public function getLogBySid($sid){
        $params = array();
        $params['sid'] = $sid;
        $url = substr($this->server,0,strrpos(trim($this->server), "/"))."/debugbysid";
        if(defined(BAE_ENABLE)  &&  BAE_ENABLE){
            $httpproxy = BaeFetchUrl::getInstance(array('timeout'=>100000,'conn_timeout'=>10000,'max_response_size'=> 512000));
            $ret = $httpproxy->post($url, $params);
            return $ret;
        }
        $ret = self::sendRequestByLocal($url, "post", $params);
        if(intval($ret['status']) === 0){
            return $ret;
        }else{
            return false;
        }
    }

    private function sendRequestByLocal($url,$method,$params=array()){
        if(trim($url)==''||!in_array($method,array('get','post'))||!is_array($params)){
            return false;
        }
        $curl=curl_init();
        curl_setopt($curl,CURLOPT_RETURNTRANSFER,1);
        curl_setopt($curl,CURLOPT_HEADER,0 );
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

    private function generate_sid()
    {
        return md5($this->guid());
    }

    private function guid(){
        if (function_exists('com_create_guid')){
            return com_create_guid();
        }else{
            mt_srand((double)microtime()*10000);//optional for php 4.2.0 and up.
            $charid = strtoupper(md5(uniqid(rand(), true)));
            $hyphen = chr(45);// "-"
            $uuid =substr($charid, 0, 8).$hyphen
                .substr($charid, 8, 4).$hyphen
                .substr($charid,12, 4).$hyphen
                .substr($charid,16, 4).$hyphen
                .substr($charid,20,12);
            return $uuid;
        }
    }

    public function getSid()
    {
        return $this->sid;
    }

    /*
     *  兼容mis老代码
     */
    public function sid()
    {
        return $this->sid;
    }

    public function setSid($sid)
    {
        $this->sid=$sid;
    }
    
    /**
     *设置/获取报警配置
     */
    public function setAlarmConfig($alarmConfig){
        $this->alarmConfig= $alarmConfig;
    }
    public function getAlarmConfig(){
        return $this->alarmConfig;
    }

    /**
     *设置/获取应用名字
     */
    public function setApp($app){
        $this->app = $app;
    }
    public function App(){
        return $this->app;
    }

    /**
     *设置/获取 soap接口
     */
    public function setServer($server){
        $this->server= $server;
    }
    public function getServer(){
        return $this->server;
    }

    /**
     *设置/获取用户名
     */
    public function setUsername($username){
        $this->username= $username;
    }
    public function getUsername(){
        return $this->username;
    }

    /*
     * 兼容老的log方法
     */
    public function setUser($username) {
        $this->username = $username;
    }

    /**
    * set /get logType
    */
    public function setLogType($logType)
    {
        $this->logType=$logType;
    }
    public function getLogType()
    {
        return $this->logType;
    }

    /**
    * set/get logLimit
    */
    public function setLogLimit($logLimit)
    {
        $this->logLimit=$logLimit;
    }
    public function getLogLimit()
    {
        return $this->logLimit;
    }

    /**
    * set/get alarmLevel
    */
    public function setAlarmLevel($level)
    {
        $this->alarmLevel=$level;
    }
    public function getAlarmLevel()
    {
        return $this->alarmLevel;
    }

    public function logResult($result) {
        $trace    = debug_backtrace();  
        $filename = $trace[0]['file'];  
        $lineno   = $trace[0]['line'];  
        $title    = $result["msg"];     
        $content  = $result["data"];    
        switch(intval($result["status"])) {
        case 0:
            return $this->raw("INFO", $title, $content, $filename, $lineno);
        case 1:
            return $this->raw("WARN", $title, $content, $filename, $lineno);
        default:
            return $this->raw("ERROR", $title, $content, $filename, $lineno);
        }                      
    }

    /*
    * 这儿onException排除异常后不再发日志，不然的话就可能死循环
    * 选择写日志文件的形式
    */
    public function onException($ex) {
        $fp = fopen(trim(SYS_LOG_PATH)."/clogging.log", "a");
        flock($fp, LOCK_EX);
        fwrite($fp, "日志服务发生异常:".$ex->getMessage()."\n\t\ttrace: ".$ex->getTraceAsString()."\n");
        flock($fp, LOCK_UN);
        fclose($fp);
    }

    /*
     * 这儿的OnError逻辑不正常，去掉
     */
    public function onError($errno, $errstr, $errfile, $errline, $errcontext) {
        //return ;
        /* Don't execute PHP internal error handler */
        return true;
    }
}
