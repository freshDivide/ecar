<?php
// change the following paths if necessary
#$yii=dirname(__FILE__).'/../../thirdparty/yii/yii.php';
$yii=dirname(__FILE__).'/../common/yii-1.1.8.r3324/framework/yii.php';
$config=dirname(__FILE__).'/protected/config/main.php';

// remove the following line when in production mode
defined('YII_DEBUG') or define('YII_DEBUG',true);

require_once($yii);
yii::createWebApplication($config)->run();

