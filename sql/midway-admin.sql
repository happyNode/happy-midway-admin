SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for menu
-- ----------------------------
DROP TABLE IF EXISTS `menu`;
CREATE TABLE `menu` (
  `menu_id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `parent_id` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '父菜单ID',
  `name` varchar(255) NOT NULL COMMENT '菜单名称',
  `router` varchar(255) NOT NULL COMMENT '菜单地址',
  `perms` varchar(255) NOT NULL COMMENT '权限标识',
  `type` tinyint(4) unsigned NOT NULL DEFAULT '0' COMMENT '类型，0：目录、1：菜单、2：按钮',
  `icon` varchar(255) NOT NULL DEFAULT '' COMMENT '图标',
  `rank` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '顺序',
  `view_path` varchar(255) NOT NULL COMMENT '视图地址，对应vue文件',
  `keepalive` tinyint(4) unsigned NOT NULL DEFAULT '1' COMMENT '路由缓存',
  `is_show` tinyint(4) unsigned NOT NULL DEFAULT '1' COMMENT '是否显示在菜单栏',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`menu_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='系统菜单信息表';

BEGIN;
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (1, 0, '系统', '/sys', '', 0, 'system', 255, '', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES ( 3, 1, '权限管理', '/sys/permssion', '', 0, 'permission', 0, '', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (4, 3, '用户列表', '/sys/permssion/user', '', 1, 'peoples', 0, 'views/system/permission/user', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (5, 4, '新增', '', 'sys:user:add', 2, '', 0, '', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (6, 4, '删除', '', 'sys:user:delete', 2, '', 0, '', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (7, 3, '菜单列表', '/sys/permssion/menu', '', 1, 'menu', 0, 'views/system/permission/menu', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (8, 7, '新增', '', 'sys:menu:add', 2, '', 0, '', 1, 0);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (9, 7, '删除', '', 'sys:menu:delete', 2, '', 0, '', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (10, 7, '查询', '', 'sys:menu:list,sys:menu:info', 2, '', 0, '', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (17, 16, '测试', '', 'sys:menu:list,sys:menu:update,sys:menu:info,sys:menu:add', 2, '', 0, '', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (19, 7, '修改', '', 'sys:menu:update', 2, '', 0, '', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (23, 3, '角色列表', '/sys/permission/role', '', 1, 'role', 0, 'views/system/permission/role', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (25, 23, '删除', '', 'sys:role:delete', 2, '', 0, '', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (26, 44, '饿了么文档', 'http://element-cn.eleme.io/#/zh-CN/component/installation', '', 1, 'international', 0, 'views/charts/keyboard', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (27, 44, 'TypeORM中文文档', 'https://www.bookstack.cn/read/TypeORM-0.2.20-zh/README.md', '', 1, 'international', 2, 'views/error-log/components/ErrorTestB', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (28, 23, '新增', '', 'sys:role:add', 2, '', 0, '', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (29, 23, '修改', '', 'sys:role:update', 2, '', 0, '', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (32, 23, '查询', '', 'sys:role:list,sys:role:page,sys:role:info', 2, '', 0, '', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (33, 4, '部门查询', '', 'sys:dept:list,sys:dept:info', 2, '', 0, '', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (34, 4, '查询', '', 'sys:user:page,sys:user:info', 2, '', 0, '', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (35, 4, '更新', '', 'sys:user:update', 2, '', 0, '', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (36, 4, '部门转移', '', 'sys:dept:transfer', 2, '', 0, '', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (37, 1, '系统监控', '/sys/monitor', '', 0, 'monitor', 0, '', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (38, 37, '请求追踪', '/sys/monitor/log', '', 1, 'log', 0, 'views/system/monitor/req-log', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (39, 4, '部门新增', '', 'sys:dept:add', 2, '', 0, '', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (40, 4, '部门删除', '', 'sys:dept:delete', 2, '', 0, '', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (41, 4, '部门更新', '', 'sys:dept:update', 2, '', 0, '', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (20, 4, '部门移动排序', '', 'sys:dept:move', 2, '', 255, '', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (44, 0, '文档', '/document', '', 0, 'documentation', 0, '', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (51, 37, '在线用户', '/sys/monitor/online', '', 1, 'people', 0, 'views/system/monitor/online', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (52, 51, '查询', '', 'sys:online:list', 2, '', 0, '', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (53, 51, '下线', '', 'sys:online:kick', 2, '', 0, '', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (54, 38, '查询', '', 'sys:log:req:page,sys:log:req:search', 2, '', 0, '', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (55, 37, '登录日志', '/sys/monitor/login-log', '', 1, 'guide', 0, 'views/system/monitor/login-log', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (56, 55, '查询', '', 'sys:log:login:page', 2, '', 0, '', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (57, 1, '任务调度', '/sys/schedule', '', 0, 'task', 0, '', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (58, 57, '定时任务', '/sys/schedule/task', '', 1, 'schedule', 0, 'views/system/schedule/task', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (59, 58, '查询', '', 'sys:task:page,sys:task:info', 2, '', 0, '', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (60, 58, '新增', '', 'sys:task:add', 2, '', 0, '', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (61, 58, '更新', '', 'sys:task:update', 2, '', 0, '', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (62, 58, '执行一次', '', 'sys:task:once', 2, '', 0, '', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (63, 58, '运行', '', 'sys:task:start', 2, '', 0, '', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (64, 58, '暂停', '', 'sys:task:stop', 2, '', 0, '', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (65, 58, '删除', '', 'sys:task:delete', 2, '', 0, '', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (66, 57, '任务日志', '/sys/schedule/log', '', 1, 'schedule-log', 0, 'views/system/schedule/log', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (67, 66, '查询', '', 'sys:log:task:page', 2, '', 0, '', 1, 1);
INSERT INTO `menu` (menu_id,parent_id,`name`,router,perms,type,icon,rank,view_path,keepalive,is_show) VALUES (68, 4, '更改密码', '', 'sys:user:password', 2, '', 255, '', 1, 1);
COMMIT;

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` varchar(255) NOT NULL COMMENT '名称',
  `label` varchar(50) NOT NULL COMMENT '标签',
  `remark` varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`role_id`) USING BTREE,
  UNIQUE KEY `IDX_223de54d6badbe43a5490450c3` (`name`) USING BTREE,
  UNIQUE KEY `IDX_f2d07943355da93c3a8a1c411a` (`label`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='系统角色信息表';

BEGIN;
INSERT INTO `role` (role_id, `name`,label)  VALUES (1, 'root', '超级管理员');
COMMIT;

-- ----------------------------
-- Table structure for role_menu
-- ----------------------------
DROP TABLE IF EXISTS `role_menu`;
CREATE TABLE `role_menu` (
  `role_menu_id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `role_id` int(11) unsigned NOT NULL COMMENT '角色id',
  `menu_id` int(11) unsigned NOT NULL COMMENT '菜单id',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`role_menu_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='系统角色和菜单关联表';

-- ----------------------------
-- Table structure for task
-- ----------------------------
DROP TABLE IF EXISTS `task`;
CREATE TABLE `task` (
  `task_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `app_id` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '所属应用ID: 0-无所属',
  `task_name` varchar(64) NOT NULL COMMENT '名称',
  `user_id` int(11) unsigned NOT NULL COMMENT '用户id',
  `type` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '类别:1-cron,2-interval',
  `status` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '状态:0-暂停中,1-启动中',
  `start_time` datetime DEFAULT NULL COMMENT '开始时间',
  `end_time` datetime DEFAULT NULL COMMENT '结束时间',
  `limit` int(11) NOT NULL DEFAULT '-1' COMMENT '执行次数',
  `cron` varchar(128) NOT NULL DEFAULT '' COMMENT 'cron配置',
  `every` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '执行间隔时间',
  `args` varchar(255) NOT NULL DEFAULT '' COMMENT '参数',
  `email_notice` varchar(255) NOT NULL DEFAULT '' COMMENT '异常邮件通知地址（多个地址用逗号隔开）''',
  `remark` varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`task_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='定时任务信息表';

-- ----------------------------
-- Table structure for task_log
-- ----------------------------
DROP TABLE IF EXISTS `task_log`;
CREATE TABLE `task_log` (
  `task_log_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `task_id` int(11) unsigned NOT NULL COMMENT '任务表主键id',
  `run_mode` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '方式:1-自动,2-手动',
  `result` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '任务执行结果状态:0-失败,1-成功',
  `consume_time` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '任务执行花费时间',
  `detail` text CHARACTER SET utf8 NOT NULL COMMENT '任务执行结果返回',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`task_log_id`) USING BTREE,
  KEY `idx_task_id` (`task_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='定时任务日志表';

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `username` varchar(64) NOT NULL COMMENT '登录账号',
  `password` varchar(255) NOT NULL COMMENT '密码',
  `name` varchar(64) NOT NULL COMMENT '真实姓名',
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态：0：禁用，1：启用',
  `head_img` varchar(255) NOT NULL COMMENT '头像',
  `email` varchar(64) NOT NULL COMMENT '邮箱',
  `phone` varchar(64) NOT NULL COMMENT '电话',
  `remark` varchar(255) NOT NULL COMMENT '备注',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`user_id`) USING BTREE,
  UNIQUE KEY `IDX_9e7164b2f1ea1348bc0eb0a7da` (`username`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='系统用户信息表';

BEGIN;
INSERT INTO `user`(user_id,username,`password`,`name`,head_img,email,phone,`status`,remark) VALUES (1,  'admin', '$2a$12$UaCEtAu.F5IfcVqk6apaqugPMkrFKJ9zJSaA0.c4hQTy4MzKQhLP2','admin', 'http://image.si-yee.com/思忆/20200924_021100.png', 'ddzyan@163.com', '18268416544',1,'');
COMMIT;

-- ----------------------------
-- Table structure for user_role
-- ----------------------------
DROP TABLE IF EXISTS `user_role`;
CREATE TABLE `user_role` (
  `user_role_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `user_id` int(11) NOT NULL COMMENT '用户id',
  `role_id` int(11) NOT NULL COMMENT '角色id',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`user_role_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='系统用户角色关联表';

BEGIN;
INSERT INTO `user_role` (user_role_id,user_id,role_id) VALUES (1, 1, 1);
COMMIT;

CREATE TABLE `req_log` (
  `req_log_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `admin_id` int(11) NOT NULL COMMENT '用户id',
  `ip` varchar(255) NOT NULL COMMENT '请求ip地址',
  `param` text NOT NULL COMMENT '请求参数',
  `action` varchar(100) NOT NULL COMMENT '请求路径',
  `method` varchar(15) NOT NULL COMMENT '请求方式',
  `status` int(11) NOT NULL COMMENT '返回状态值',
  `consume_time` int(11) NOT NULL DEFAULT '0' COMMENT '消耗时间',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`req_log_id`) USING BTREE,
  KEY `idx_admin_id` (`admin_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='请求日志信息表';

SET FOREIGN_KEY_CHECKS = 1;
