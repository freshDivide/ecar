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
-- 表的结构 `car_plate_style`
--

CREATE TABLE IF NOT EXISTS `car_plate_style` (
  `style_id` int(100) NOT NULL AUTO_INCREMENT,
  `style_name` varchar(100) NOT NULL COMMENT '车牌样式名称',
  `sample_address` varchar(150) NOT NULL COMMENT '车牌样例地址',
  PRIMARY KEY (`style_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='用于存储车牌类型信息及样例图片' AUTO_INCREMENT=3 ;

--
-- 转存表中的数据 `car_plate_style`
--

INSERT INTO `car_plate_style` (`style_id`, `style_name`, `sample_address`) VALUES
(1, '蓝色车牌：中型以下载客、载货汽车和专项作业车', 'http://localhost:10002/image/moveCar/bluePlate.jpg'),
(2, '黄色车牌：大型汽车、挂车和教练车', 'http://localhost:10002/image/moveCar/yellowPlate.jpg');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
