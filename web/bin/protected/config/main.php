<?php

// uncomment the following to define a path alias
// Yii::setPathOfAlias('local','path/to/local-folder');

// This is the main Web application configuration. Any writable
// CWebApplication properties can be configured here.

require_once(dirname(__FILE__)."/load_conf.php");

return array(
    'basePath'=>dirname(__FILE__).DIRECTORY_SEPARATOR.'..',
    'name'=>'MIS Register System',
    'defaultController'=>'system',

	'preload'=>array('session','log'),

    // autoloading model and component classes
    'import'=>array(
        'application.models.*',
        'application.components.*',
		'application.managers.*',
        'application.controllers.*',
        'application.db.*',
        'application.libs.*',
        'application.libs.gwfp.*',
        'application.libs.uic.*',
        'application.libs.passport.*',
        'application.libs.passport.util.*',
        'application.libs.passport.interact.*',
    ),

    // application components
    'components'=>array(
        'log'=>array(
            'class'=>'CLogRouter',
            'routes'=>array(
                array(
                      'class'=>'CFileLogRoute',
                      'levels'=>'trace,info',
                      'categories'=>'system.*',
                ),
            )
        ),
        'tree'=>array(
            'class'=>'application.managers.TreeManager',
        ),
        'db'=>array(
            'class'=>'application.components.DBAConnection',

            //===== DBA 配置 =====
            'dbaConnections'=>array( // 连接字符串数组, 挨个连接, 失败则尝试下一个.
                DBA_CONNECTION_1,
                DBA_CONNECTION_2,
                DBA_CONNECTION_3,
                DBA_CONNECTION_4,
            ),  
            'username'=>DBA_USER,
            'password'=>DBA_PASS,
            'dbaTimeout'=>5, // 每个连接的超时设置, 超过这个时间认为连接失败, 自动尝试下一个连接.

            //===== 本地数据库配置 =====
            //去掉下边的的注释后, DBA 配置失效
            //'connectionString'=>'mysql:host='.DB_HOST.';dbname='.DB_NAME.";port=".DB_PORT.";unix_socket=/home/work/thirdparty/mysql5/tmp/mysql.sock",
            //'username'=>DB_USERNAME,
            //'password'=>DB_PASSWORD,

			'charset' =>'utf8'
        ),

        'urlManager'=>array(  
            'urlFormat'=>'path',  
            'showScriptName' => false, //去除index.php  
            'urlSuffix'=>'.html', //加上.html  
            'rules'=>array(
 '<controller:\w+>/<id:\d+>'=>'<controller>/view',
 '<controller:\w+>/<action:\w+>/<id:\d+>'=>'<controller>/<action>',
 '<controller:\w+>/<action:\w+.html>'=>'<controller>/<action>',
 ),
        ),  

        'viewRenderer'=>array(
            'class'=>'application.components.SmartyViewRenderer',

            //包含 Smarty.class.php 的路径
            'smartyPath'=>dirname(__FILE__).'/../../../common/Smarty-3.1.3/libs',
        ),

        'errorHandler'=>array(
            'errorAction'=>'system/error',
        ),
        
        'logging'=>array(
            'class' => 'MISLogging',
            'alarmConfig'=>array("email"=>DEFAULT_ALARM),
            'server'=>LOG_SERVER,
            'app'=>PROJECT,
            'username' => SYS_NAME,
        ), 
        "cache"=>array(
            'class' => 'system.caching.CDbCache',
        ),
        'session' => array(
            'class' => 'system.web.CDbHttpSession',
            'connectionID' => 'db',
            'autoStart'=> false
        ), 
    ),
);
