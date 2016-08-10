/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50549
Source Host           : localhost:3306
Source Database       : weixin

Target Server Type    : MYSQL
Target Server Version : 50549
File Encoding         : 65001

Date: 2016-08-08 09:04:31
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for t_menubutton
-- ----------------------------
DROP TABLE IF EXISTS `t_menubutton`;
CREATE TABLE `t_menubutton` (
  `id` bigint(20) NOT NULL,
  `pid` bigint(20) DEFAULT NULL,
  `btn_list` tinyint(4) DEFAULT NULL,
  `btn_name` varchar(50) NOT NULL,
  `btn_type` varchar(50) DEFAULT NULL,
  `btn_url` varchar(200) DEFAULT NULL,
  `btn_key` varchar(50) DEFAULT NULL,
  `btn_state` tinyint(4) DEFAULT '1',
  `btn_order` int(10) DEFAULT NULL,
  `ctime` datetime DEFAULT NULL,
  `utime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

alter table t_menubutton add btn_media_id varchar(100) ;
alter table t_menubutton add btn_media_name varchar(100);
