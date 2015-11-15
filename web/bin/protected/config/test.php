<?php

return CMap::mergeArray(
    require(dirname(__FILE__).'/main.php'),
    array(
        'import'=>array(
            'application.tests.*',
        ),
        'components'=>array(
            'fixture'=>array(
                'class'=>'system.test.CDbFixtureManager',
             ),
            'db'=>array(
                'class'=>'application.components.DBAConnection',
                'connectionString' => 'mysql:host=localhost;dbname=test;port=3306',
                'emulatePrepare' => true,
                'dbaTimeout'=>5,
                'username' => 'root',
                'password' => '123456',
                'charset' => 'utf8',
            ),
        ),
    )
);
