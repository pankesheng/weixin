/*
Navicat MySQL Data Transfer

Source Server         : 192.168.1.119
Source Server Version : 50525
Source Host           : localhost:3306
Source Database       : pm2

Target Server Type    : MYSQL
Target Server Version : 50525
File Encoding         : 65001

Date: 2015-12-09 08:45:12
*/

CREATE DATABASE IF NOT EXISTS pm2 DEFAULT CHARSET utf8 COLLATE utf8_general_ci;
use pm2;

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `t_remark`
-- ----------------------------
DROP TABLE IF EXISTS `t_remark`;
CREATE TABLE `t_remark` (
  `id` bigint(20) NOT NULL,
  `workId` bigint(20) DEFAULT NULL,
  `content` text,
  `ip` varchar(100) DEFAULT NULL,
  `ctime` datetime DEFAULT NULL,
  `utime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_remark
-- ----------------------------

-- ----------------------------
-- Table structure for `t_task`
-- ----------------------------
DROP TABLE IF EXISTS `t_task`;
CREATE TABLE `t_task` (
  `id` bigint(20) NOT NULL,
  `pid` bigint(20) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `user` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `timePre` int(11) DEFAULT NULL,
  `timeReal` int(11) DEFAULT NULL,
  `ctime` datetime DEFAULT NULL,
  `utime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_task
-- ----------------------------

-- ----------------------------
-- Table structure for `t_tasklog`
-- ----------------------------
DROP TABLE IF EXISTS `t_tasklog`;
CREATE TABLE `t_tasklog` (
  `id` bigint(20) NOT NULL,
  `taskId` bigint(20) DEFAULT NULL,
  `ip` varchar(100) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `user` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `timePre` int(11) DEFAULT NULL,
  `ctime` datetime DEFAULT NULL,
  `utime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_tasklog
-- ----------------------------

-- ----------------------------
-- Table structure for `t_user`
-- ----------------------------
DROP TABLE IF EXISTS `t_user`;
CREATE TABLE `t_user` (
  `id` bigint(20) NOT NULL,
  `realname` varchar(100) DEFAULT NULL,
  `state` int(11) DEFAULT NULL,
  `ip` varchar(100) DEFAULT NULL,
  `ctime` datetime DEFAULT NULL,
  `utime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_user
-- ----------------------------

-- ----------------------------
-- Table structure for `t_work`
-- ----------------------------
DROP TABLE IF EXISTS `t_work`;
CREATE TABLE `t_work` (
  `id` bigint(20) NOT NULL,
  `user` varchar(100) DEFAULT NULL,
  `workBeginTime` date DEFAULT NULL,
  `workEndTime` date DEFAULT NULL,
  `timeReal` int(11) DEFAULT NULL,
  `taskId` bigint(20) DEFAULT NULL,
  `remark` text,
  `ctime` datetime DEFAULT NULL,
  `utime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_work
-- ----------------------------

-- ----------------------------
-- Table structure for `t_worklog`
-- ----------------------------
DROP TABLE IF EXISTS `t_worklog`;
CREATE TABLE `t_worklog` (
  `id` bigint(20) NOT NULL,
  `workId` bigint(20) DEFAULT NULL,
  `ip` varchar(100) DEFAULT NULL,
  `user` varchar(100) DEFAULT NULL,
  `workBeginTime` date DEFAULT NULL,
  `workEndTime` date DEFAULT NULL,
  `timeReal` int(11) DEFAULT NULL,
  `taskId` bigint(20) DEFAULT NULL,
  `ctime` datetime DEFAULT NULL,
  `utime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_worklog
-- ----------------------------
