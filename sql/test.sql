SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE `task` (
  `task_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `app_id` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '任务所属应用ID: 0-无所属',
  `task_name` varchar(64) NOT NULL COMMENT '定时任务名称',
  `type` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '定时任务类别:1-cron,2-interval',
  `status` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '定时任务状态:0-暂停中,1-启动中',
  `start_time` datetime DEFAULT NULL COMMENT '定时任务开始时间',
  `end_time` datetime DEFAULT NULL COMMENT '定时任务结束时间',
  `limit` int(11) DEFAULT '-1' COMMENT '定时任务执行次数',
  `cron` varchar(128) DEFAULT '' COMMENT '定时任务cron配置',
  `every` int(11) unsigned DEFAULT '0' COMMENT '定时任务执行间隔时间',
  `args` varchar(255) DEFAULT NULL COMMENT '参数',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `created_at` datetime NOT NULL COMMENT '创建时间',
  `updated_at` datetime NOT NULL COMMENT '更新时间',
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`task_id`) USING BTREE
) ENGINE=InnoDB;

CREATE TABLE `task_log` (
  `task_log_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `task_id` int(11) unsigned NOT NULL COMMENT '定时任务表主键id',
  `run_mode` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '运行方式:1-自动,2-手动',
  `result` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '定时任务执行结果状态:0-失败,1-成功',
  `consume_time` int(11) unsigned DEFAULT '0' COMMENT '定时任务执行花费时间',
  `detail` text COMMENT '定时任务执行结果返回',
  `created_at` datetime NOT NULL COMMENT '创建时间',
  `updated_at` datetime NOT NULL COMMENT '更新时间',
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`task_log_id`) USING BTREE,
  KEY `idx_task_id` (`task_id`) USING BTREE
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;
