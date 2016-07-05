-- phpMyAdmin SQL Dump
-- version 3.4.10.1
-- http://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2016 年 07 月 05 日 16:33
-- 服务器版本: 5.5.20
-- PHP 版本: 5.3.10

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 数据库: `ecar`
--

-- --------------------------------------------------------

--
-- 表的结构 `car_sms_code_platform`
--

CREATE TABLE IF NOT EXISTS `car_sms_code_platform` (
  `id` int(11) NOT NULL,
  `platform_name` varchar(20) NOT NULL,
  `account` varchar(30) NOT NULL,
  `login_passwd` varchar(30) NOT NULL,
  `api_key` varchar(50) NOT NULL,
  `sms_send_api` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `car_sms_code_platform`
--

INSERT INTO `car_sms_code_platform` (`id`, `platform_name`, `account`, `login_passwd`, `api_key`, `sms_send_api`) VALUES
(1, 'huyiwuxian', 'cf_ecar', 'ecar0629', '26b83c917f3963660656779b87ebf099', 'https://106.ihuyi.com/webservice/sms.php');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
