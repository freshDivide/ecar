-- phpMyAdmin SQL Dump
-- version 3.4.10.1
-- http://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2016 年 08 月 10 日 03:07
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
  `area_full_name` varchar(20) NOT NULL,
  PRIMARY KEY (`area_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=17 ;

--
-- 转存表中的数据 `car_avaliable_area`
--

INSERT INTO `car_avaliable_area` (`area_id`, `area_name`, `area_full_name`) VALUES
(1, '京', '北京'),
(2, '津', '天津'),
(3, '冀', '河北'),
(4, '鲁', '山东'),
(5, '豫', '河南'),
(6, '晋', ''),
(7, '黑', ''),
(8, '吉', ''),
(9, '辽', ''),
(10, '蒙', ''),
(11, '陕', ''),
(12, '甘', ''),
(13, '宁', ''),
(14, '新', ''),
(15, '藏', ''),
(16, '皖', '');

-- --------------------------------------------------------

--
-- 表的结构 `car_avaliable_city`
--

CREATE TABLE IF NOT EXISTS `car_avaliable_city` (
  `city_area_id` int(50) NOT NULL,
  `city_name` varchar(50) NOT NULL,
  KEY `area_id` (`city_area_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `car_avaliable_city`
--

INSERT INTO `car_avaliable_city` (`city_area_id`, `city_name`) VALUES
(1, '朝阳区'),
(1, '海淀区'),
(1, '通州区'),
(1, '房山区'),
(1, '丰台区'),
(1, '昌平区'),
(1, '大兴区'),
(1, '顺义区'),
(1, '西城区'),
(1, '延庆区'),
(1, '石景山区'),
(1, '怀柔区'),
(1, '密云区'),
(1, '东城区'),
(1, '平谷区'),
(1, '门头沟区'),
(2, '北辰区'),
(2, '塘沽区');

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
  `time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=33 ;

--
-- 转存表中的数据 `car_move_info`
--

INSERT INTO `car_move_info` (`id`, `style_id`, `plate_num`, `car_address`, `message`, `car_owner_phone`, `time`) VALUES
(25, 1, '京TNT261', '北京市海淀区上地西里', '请尽快挪车', '15129045662', '2016-08-01 18:51:24'),
(6, 1, '京TNT261', '北京邮电大学', 'adasda', '15129045662', '2016-07-25 08:14:32'),
(7, 0, '京TNT261', '空', 'abcde', NULL, '2016-07-25 10:17:14'),
(8, 0, '京TNT261', '北京邮电大学', 'ABC的', NULL, '2016-07-25 10:18:02'),
(9, 0, '京TNT261', '北京邮电大学', '123123123', NULL, '2016-07-25 10:20:08'),
(10, 0, '京TNT261', '北京市海淀区知春里24号', 'abcde', NULL, '2016-07-25 10:21:24'),
(11, 1, '京TNT261', 'address', 'asdasd', NULL, '2016-07-25 10:22:59'),
(24, 1, '京TNT261', '北京市海淀区上地西里', '请尽快挪车', '15129045662', '2016-08-01 18:51:23'),
(20, 1, '京TNT261', '北京市海淀区上地西里', '请尽快挪车', '15129045662', '2016-07-30 21:44:11'),
(21, 1, '京TNT261', '空', 'abcde', '15129045662', '2016-07-30 21:45:45'),
(22, 1, '京TNT261', '空', 'abcde', '15129045662', '2016-07-30 21:46:11'),
(23, 1, '京TNT261', '北京市海淀区上地西里', '请尽快挪车', '15129045662', '2016-08-01 18:51:19'),
(26, 1, '京TNT261', '空', 'asdasd', '15129045662', '2016-08-01 19:48:48'),
(27, 1, '京TNT261', '空', 'asdsad', '15129045662', '2016-08-01 19:50:37'),
(28, 1, '京TNT261', '北京西站', '测试', '15129045662', '2016-08-01 20:21:55'),
(29, 0, '京TNT 261', 'BB Club(东城南路)', 'Jj', NULL, '2016-08-01 20:29:08'),
(30, 1, '京TNT261', '', '', '15129045662', '2016-08-01 21:15:36'),
(31, 0, '辽aaaffa', '', '测试', NULL, '2016-08-03 11:52:29'),
(32, 0, '黑dgfss', '', '', NULL, '2016-08-03 12:04:46');

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
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

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
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='用于存储车牌类型信息及样例图片' AUTO_INCREMENT=3 ;

--
-- 转存表中的数据 `car_plate_style`
--

INSERT INTO `car_plate_style` (`style_id`, `style_name`, `sample_address`) VALUES
(1, '蓝色车牌：中型以下载客、载货汽车和专项作业车', 'image/moveCar/bluePlate.jpg'),
(2, '黄色车牌：大型汽车、挂车和教练车', 'image/moveCar/yellowPlate.jpg');

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
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- 转存表中的数据 `car_protocol_info`
--

INSERT INTO `car_protocol_info` (`id`, `protocol_name`, `title`, `content`) VALUES
(1, 'move_car_protocol', 'move car protocol title', '挪车服务使用协议... ...');

-- --------------------------------------------------------

--
-- 表的结构 `car_sms_code`
--

CREATE TABLE IF NOT EXISTS `car_sms_code` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `receive_phone` varchar(11) NOT NULL,
  `sms_code` varchar(10) NOT NULL,
  `time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=37 ;

--
-- 转存表中的数据 `car_sms_code`
--

INSERT INTO `car_sms_code` (`id`, `receive_phone`, `sms_code`, `time`) VALUES
(4, '13141314041', '613886', '2016-07-19 21:22:08'),
(5, '13141314041', '567988', '2016-07-19 21:22:29'),
(6, '13141314041', '175694', '2016-07-19 21:22:30'),
(7, '18811611356', '540683', '2016-07-19 21:26:40'),
(8, '18811611356', '681242', '2016-07-19 21:26:41'),
(9, '18811611356', '636238', '2016-07-19 21:26:44'),
(10, '18811611356', '626491', '2016-07-19 21:49:05'),
(11, '13141313041', '714954', '2016-07-19 21:51:31'),
(12, '18811611356', '949962', '2016-07-19 21:51:41'),
(13, '13141313041', '287464', '2016-07-19 21:53:49'),
(14, '15652915134', '688246', '2016-07-19 21:56:53'),
(20, '18811611356', '933622', '2016-07-21 14:06:31'),
(22, '18811611356', '486979', '2016-07-24 23:18:32'),
(24, '13141313041', '484995', '2016-07-25 08:07:17'),
(25, '18811611356', '537479', '2016-07-28 20:54:11'),
(27, '18811611356', '833035', '2016-07-28 23:11:36'),
(30, '18811611356', '632977', '2016-08-01 20:16:36'),
(34, '18513622575', '967228', '2016-08-03 11:50:04');

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
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `car_sms_code_platform`
--

INSERT INTO `car_sms_code_platform` (`id`, `platform_name`, `account`, `login_passwd`, `api_key`, `sms_send_api`) VALUES
(1, 'huyiwuxian', 'cf_ecar', 'ecar0629', '26b83c917f3963660656779b87ebf099', 'https://106.ihuyi.com/webservice/sms.php'),
(1, 'huyiwuxian', 'cf_ecar', 'ecar0629', '26b83c917f3963660656779b87ebf099', 'https://106.ihuyi.com/webservice/sms.php');

-- --------------------------------------------------------

--
-- 表的结构 `car_wash_order_info`
--

CREATE TABLE IF NOT EXISTS `car_wash_order_info` (
  `order_id` varchar(20) NOT NULL,
  `userid` varchar(100) NOT NULL,
  `shop_id` int(10) NOT NULL,
  `pay_status` int(11) NOT NULL DEFAULT '0',
  `pay_money` float NOT NULL DEFAULT '0',
  `reply_status` int(1) NOT NULL DEFAULT '0',
  `description_conform` int(10) NOT NULL DEFAULT '0',
  `service_quality` int(10) NOT NULL DEFAULT '0',
  `anonymity` tinyint(1) NOT NULL DEFAULT '0',
  `reply_text` varchar(1000) NOT NULL DEFAULT '',
  `reply_image` mediumblob NOT NULL,
  `reply_time` varchar(30) NOT NULL DEFAULT '',
  `washing_time` varchar(20) NOT NULL DEFAULT '',
  `washing` varchar(200) NOT NULL DEFAULT '',
  `message` varchar(200) NOT NULL DEFAULT '',
  `consume_status` int(11) NOT NULL DEFAULT '0',
  `create_time` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`order_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `car_wash_order_info`
--

INSERT INTO `car_wash_order_info` (`order_id`, `userid`, `shop_id`, `pay_status`, `pay_money`, `reply_status`, `description_conform`, `service_quality`, `anonymity`, `reply_text`, `reply_image`, `reply_time`, `washing_time`, `washing`, `message`, `consume_status`, `create_time`) VALUES
('123456789', '12345', 1, 0, 0, 1, 4, 5, 1, '这个店真心一般,下次不去了。。。。。。。', 0x313233342c34353637, '16-08-09 05:49:38', '2016.08.10.09.00', '1', '可能晚到1个小时左右', 0, ''),
('F809674704220679', '12345', 1, 0, 0, 1, 4, 5, 0, '5star2', '', '16-08-09 05:49:50', '2016.08.10.09.00', '1', '可能晚到1个小时左右', 0, '16-08-09 06:31:10'),
('F809674903479013', '12345', 1, 0, 0, 1, 0, 3, 0, '', '', '', '2016.08.10.09.00', '1', '可能晚到1个小时左右', 0, '16-08-09 06:31:30'),
('F809675201917617', '12345', 1, 0, 0, 1, 0, 4, 0, '', '', '', '2016.08.10.09.00', '1', '可能晚到1个小时左右', 0, '16-08-09 06:32:00'),
('F809675217476211', '12345', 1, 0, 0, 1, 0, 1, 0, '', '', '', '2016.08.10.09.00', '1', '可能晚到1个小时左右', 0, '16-08-09 06:32:01'),
('F809675231021308', '12345', 1, 0, 0, 1, 0, 2, 0, '', '', '', '2016.08.10.09.00', '1', '可能晚到1个小时左右', 0, '16-08-09 06:32:03'),
('F809675242966704', '12345', 1, 0, 0, 0, 0, 0, 0, '', '', '', '2016.08.10.09.00', '1', '可能晚到1个小时左右', 0, '16-08-09 06:32:04');

-- --------------------------------------------------------

--
-- 表的结构 `car_wash_range`
--

CREATE TABLE IF NOT EXISTS `car_wash_range` (
  `range_id` int(50) NOT NULL,
  `range_name` varchar(50) NOT NULL,
  `range_threshold` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `car_wash_range`
--

INSERT INTO `car_wash_range` (`range_id`, `range_name`, `range_threshold`) VALUES
(1, '500米范围内', 500),
(2, '1公里范围内', 1000),
(3, '5公里范围内', 5000);

-- --------------------------------------------------------

--
-- 表的结构 `car_wash_type`
--

CREATE TABLE IF NOT EXISTS `car_wash_type` (
  `service_id` int(100) NOT NULL,
  `service_name` varchar(100) NOT NULL,
  `service_price` float NOT NULL,
  `service_discount` float NOT NULL,
  PRIMARY KEY (`service_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `car_wash_type`
--

INSERT INTO `car_wash_type` (`service_id`, `service_name`, `service_price`, `service_discount`) VALUES
(1, '标准洗车', 25, 10),
(2, '中级洗车', 35, 10);

-- --------------------------------------------------------

--
-- 表的结构 `pay_type`
--

CREATE TABLE IF NOT EXISTS `pay_type` (
  `id` int(50) NOT NULL,
  `type` varchar(50) NOT NULL,
  `icon_url` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `pay_type`
--

INSERT INTO `pay_type` (`id`, `type`, `icon_url`) VALUES
(1, 'zhifubao', 'image/washCar/zhifubao.jpg'),
(2, 'weixin', 'image/washCar/weixin.jpg');

-- --------------------------------------------------------

--
-- 表的结构 `shop_info`
--

CREATE TABLE IF NOT EXISTS `shop_info` (
  `shop_id` int(10) NOT NULL AUTO_INCREMENT,
  `shop_name` varchar(100) NOT NULL,
  `shop_image_url` varchar(200) NOT NULL,
  `shop_star` int(11) NOT NULL,
  `shop_phone` varchar(26) NOT NULL,
  `shop_start_time` varchar(20) NOT NULL,
  `shop_end_time` varchar(20) NOT NULL,
  `shop_payment` varchar(20) NOT NULL,
  `shop_about_us` text NOT NULL,
  `shop_services` varchar(200) NOT NULL,
  `shop_wash_type` varchar(100) NOT NULL,
  `shop_province` varchar(100) NOT NULL,
  `shop_city` varchar(100) NOT NULL,
  `shop_address` varchar(300) NOT NULL,
  `shop_lat` float NOT NULL,
  `shop_lon` float NOT NULL,
  `shop_fans` mediumtext NOT NULL,
  PRIMARY KEY (`shop_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- 转存表中的数据 `shop_info`
--

INSERT INTO `shop_info` (`shop_id`, `shop_name`, `shop_image_url`, `shop_star`, `shop_phone`, `shop_start_time`, `shop_end_time`, `shop_payment`, `shop_about_us`, `shop_services`, `shop_wash_type`, `shop_province`, `shop_city`, `shop_address`, `shop_lat`, `shop_lon`, `shop_fans`) VALUES
(1, '海淀区超人养车', 'image/washCar/shop_img_url_1.jpg', 5, '13100001234', '8:00', '18:00', '1|2|3|4', '    关于本店的一些文字性介绍，关于本店的一些文字性介绍，关于本店的一些文字性介绍，关于本店的一些文字性介绍，关于本店的一些文字性介绍，关于本店的一些文字性介绍。\r\n    关于本店的一些文字性介绍，关于本店的一些文字性介绍，关于本店的一些文字性介绍，关于本店的一些文字性介绍，关于本店的一些文字性介绍。\r\n    关于本店的一些文字性介绍，关于本店的一些文字性介绍，关于本店的一些文字性介绍，关于本店的一些文字性介绍，关于本店的一些文字性介绍，关于本店的一些文字性介绍。', '洗车,贴膜,打蜡', '1|2', '北京市', '海淀区', '北京市海淀区上地西里10号超人养车服务中心', 116.301, 40.0509, '12345|45678'),
(2, '海淀区洁美汽车美容服务中心', 'image/washCar/shop_img_url_2.jpg', 4, '13100001235', '8:00', '20:00', '1|2|3|4', '    关于本店的一些文字性介绍，关于本店的一些文字性介绍，关于本店的一些文字性介绍，关于本店的一些文字性介绍，关于本店的一些文字性介绍，关于本店的一些文字性介绍。\r\n    关于本店的一些文字性介绍，关于本店的一些文字性介绍，关于本店的一些文字性介绍，关于本店的一些文字性介绍，关于本店的一些文字性介绍。\r\n    关于本店的一些文字性介绍，关于本店的一些文字性介绍，关于本店的一些文字性介绍，关于本店的一些文字性介绍，关于本店的一些文字性介绍，关于本店的一些文字性介绍。', '洗车,贴膜,打蜡', '1|2', '北京市', '海淀区', '北京市海淀区回龙观东大街10号洁美汽车美容服务中心', 116.336, 40.0708, '45678');

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
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='use information' AUTO_INCREMENT=3 ;

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
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `yiisession`
--

INSERT INTO `yiisession` (`id`, `expire`, `data`) VALUES
('29qks88g90tdi7kdm3kgr7ps87', 1470746973, '');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
