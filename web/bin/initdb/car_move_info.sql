-- phpMyAdmin SQL Dump
-- version 3.4.10.1
-- http://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2016 年 07 月 05 日 16:32
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
-- 表的结构 `car_move_info`
--

CREATE TABLE IF NOT EXISTS `car_move_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `style_id` int(100) DEFAULT '0',
  `plate_num` varchar(10) NOT NULL,
  `car_address` varchar(100) NOT NULL,
  `message` varchar(100) NOT NULL,
  `car_owner_phone` varchar(11) DEFAULT NULL,
  `sms_code` varchar(6) DEFAULT NULL,
  `time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- 转存表中的数据 `car_move_info`
--

INSERT INTO `car_move_info` (`id`, `style_id`, `plate_num`, `car_address`, `message`, `car_owner_phone`, `sms_code`, `time`) VALUES
(2, 1, '京TNT261', 'address', 'message', '17600850093', '232059', '2016-07-05 23:05:19');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
