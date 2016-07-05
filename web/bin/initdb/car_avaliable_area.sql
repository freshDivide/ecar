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
-- 表的结构 `car_avaliable_area`
--

CREATE TABLE IF NOT EXISTS `car_avaliable_area` (
  `area_id` int(11) NOT NULL AUTO_INCREMENT,
  `area_name` varchar(5) NOT NULL,
  PRIMARY KEY (`area_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=17 ;

--
-- 转存表中的数据 `car_avaliable_area`
--

INSERT INTO `car_avaliable_area` (`area_id`, `area_name`) VALUES
(1, '京'),
(2, '津'),
(3, '冀'),
(4, '鲁'),
(5, '豫'),
(6, '晋'),
(7, '黑'),
(8, '吉'),
(9, '辽'),
(10, '蒙'),
(11, '陕'),
(12, '甘'),
(13, '宁'),
(14, '新'),
(15, '藏'),
(16, '皖');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
