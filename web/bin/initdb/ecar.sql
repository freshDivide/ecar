-- phpMyAdmin SQL Dump
-- version 3.4.10.1
-- http://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2016 年 07 月 06 日 05:51
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

-- --------------------------------------------------------

--
-- 表的结构 `car_license_prefix`
--

CREATE TABLE IF NOT EXISTS `car_license_prefix` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sytle_id` int(100) NOT NULL,
  `license_prefix` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- 转存表中的数据 `car_license_prefix`
--

INSERT INTO `car_license_prefix` (`id`, `sytle_id`, `license_prefix`) VALUES
(1, 1, '京'),
(2, 1, '津'),
(3, 1, '冀');

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
(1, '蓝色车牌：中型以下载客、载货汽车和专项作业车', '/image/moveCar/bluePlate.jpg'),
(2, '黄色车牌：大型汽车、挂车和教练车', '/image/moveCar/yellowPlate.jpg');

-- --------------------------------------------------------

--
-- 表的结构 `car_protocol_info`
--

CREATE TABLE IF NOT EXISTS `car_protocol_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `protocol_name` varchar(50) NOT NULL,
  `title` varchar(50) NOT NULL,
  `content` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- 转存表中的数据 `car_protocol_info`
--

INSERT INTO `car_protocol_info` (`id`, `protocol_name`, `title`, `content`) VALUES
(1, 'move_car_protocol', 'move car protocol title', '挪车服务使用协议... ...');

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

-- --------------------------------------------------------

--
-- 表的结构 `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'key',
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT 'name',
  `password` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT 'password',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'user create time',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='use information' AUTO_INCREMENT=3 ;

--
-- 转存表中的数据 `user`
--

INSERT INTO `user` (`id`, `name`, `password`, `create_time`) VALUES
(1, 'admin', '123456', '2015-11-15 15:48:48'),
(2, 'ren', '123456', '2015-11-15 15:48:48');

-- --------------------------------------------------------

--
-- 表的结构 `yiisession`
--

CREATE TABLE IF NOT EXISTS `yiisession` (
  `id` char(32) NOT NULL,
  `expire` int(11) DEFAULT NULL,
  `data` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `yiisession`
--

INSERT INTO `yiisession` (`id`, `expire`, `data`) VALUES
('k3plqsnp648lm6rf3ihhq4dnl2', 1467784867, '');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
