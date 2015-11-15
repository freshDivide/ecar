<?php

// This is the configuration for yiic console application.
// Any writable CConsoleApplication properties can be configured here.

require_once(dirname(__FILE__)."/load_conf.php");

return array(
	'basePath'=>dirname(__FILE__).DIRECTORY_SEPARATOR.'..',
	'name'=>'MIS PROCESS',

    // preloading 'log' component
	'preload'=>array('log'),

	// autoloading model and component classes
	'import'=>array(
		'application.models.*',
		'application.components.*',
        'application.managers.DataInstanceManager',
        'application.managers.*',
        'application.libs.Email',
        'application.libs.*',
	),

	// application components
	'components'=>array(
		'log'=>array(
			'class'=>'CLogRouter',
			'routes'=>array(
				array(
					'class'=>'CFileLogRoute',
					'levels'=>'error, warning',
				),
			),
		),
		'user'=>array(
			// enable cookie-based authentication
			'allowAutoLogin'=>true,
		),
		// uncomment the following to set up database
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
         
        'logging'=>array(
            'class' => 'MISLogging',
            'alarmConfig'=>array("email"=>DEFAULT_ALARM),
            'server'=>LOG_SERVER,
            'app'=>PROJECT,
            'username' => SYS_NAME,
        ), 
	),

	// application-level parameters that can be accessed
	// using Yii::app()->params['paramName']
	'params'=>array(
		// this is used in contact page
		'adminEmail'=>SYS_LEADER,
	),
);
