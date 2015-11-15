<?php
try{
    defined('YII_DEBUG') or define('YII_DEBUG',true);
    // including Yii
    require_once('/home/work/thirdparty/yii/yii.php');
    // we'll use a separate config file
    $configFile=dirname(dirname(__FILE__)).'/config/console.php';
    // creating and running console application
    Yii::createConsoleApplication($configFile)->run();
}catch(Exteption $e){
    echo $e->getMessage();
}

?>