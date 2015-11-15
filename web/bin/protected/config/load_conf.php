<?php 

session_cache_limiter('private, must-revalidate');

define('PATH_CONF', dirname(__FILE__).'/../../../conf/');
define('PATH_EXTRA_CONF', dirname(__FILE__).'/../../../extra-conf/');

mb_internal_encoding('utf-8');
mb_regex_encoding('utf-8');

if(get_magic_quotes_gpc())
{
	//filter(&$_GET);
	//filter(&$_POST);
	//filter(&$_COOKIE);
	//filter(&$_REQUEST);
}

function read_conf($confs)
{
    $confs = (array)$confs;
    
    foreach($confs as $conf_file) {
		$the_config = parse_ini_file($conf_file);
		foreach($the_config as $key=>$value)
		{
			if($value == 'NULL') $value = '';
			if(is_int($value)) $value = intval($value);
			define($key, $value);
		}
    }
}

function filter($input)
{
	if (is_array($input))
	{
		while (list($k, $v) = each($input))
		{
			if (is_array($input[$k]))
			{
				while (list($k2, $v2) = each($input[$k]))
				{
					$input[$k][$k2] = stripslashes($v2);
				}
				@reset($input[$k]);
			}
			else
			{
				$input[$k] = stripslashes($v);
			}
		}
		@reset($input);
	}
}

#读取配置
read_conf(array(PATH_EXTRA_CONF.'dynamic.ini', PATH_EXTRA_CONF. 'private.ini'));
read_conf(array(PATH_CONF.'public_'. PUBLIC_INI_FLAG . '.ini'));

