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
-- 表的结构 `car_owner_info`
--

CREATE TABLE IF NOT EXISTS `car_owner_info` (
  `id` int(11) NOT NULL,
  `account` varchar(50) NOT NULL,
  `name` varchar(20) NOT NULL COMMENT '用户姓名',
  `passwd` varchar(20) NOT NULL,
  `mobile_phone` varchar(11) NOT NULL,
  `plate_style_id` int(11) NOT NULL,
  `plate_num` varchar(10) NOT NULL,
  `home_address` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `car_owner_info`
--

INSERT INTO `car_owner_info` (`id`, `account`, `name`, `passwd`, `mobile_phone`, `plate_style_id`, `plate_num`, `home_address`) VALUES
(1, '15129045662', 'user123', '123', '15129045662', 1, '京TNT261', '北京市海淀区知春路24号');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
