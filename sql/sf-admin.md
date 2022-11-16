# sf-admin数据库文档

<a name="返回顶部"></a>

## 大纲

* [menu](#menu)

* [req_log](#req_log)

* [role](#role)

* [role_menu](#role_menu)

* [task](#task)

* [task_log](#task_log)

* [user](#user)

* [user_role](#user_role)

## menu[↑](#返回顶部)<a name="menu"></a>

> 表注释: 系统菜单信息表

|字段|类型|空|默认值|EXTRA|注释|
|:---:|:---:|:---:|:---:|:---:|:---:|
|menu_id|int(11) unsigned|NO||auto_increment|主键|
|parent_id|int(11) unsigned|NO|0||父菜单ID|
|name|varchar(255)|NO|||菜单名称|
|router|varchar(255)|NO|||菜单地址|
|perms|varchar(255)|NO|||权限标识|
|type|tinyint(4) unsigned|NO|0||类型，0：目录、1：菜单、2：按钮|
|icon|varchar(255)|NO|||图标|
|rank|int(11) unsigned|NO|0||顺序|
|view_path|varchar(255)|NO|||视图地址，对应vue文件|
|keepalive|tinyint(4) unsigned|NO|1||路由缓存|
|is_show|tinyint(4) unsigned|NO|1||是否显示在菜单栏|
|created_at|datetime|NO|CURRENT_TIMESTAMP||创建时间|
|updated_at|datetime|NO|CURRENT_TIMESTAMP|on update CURRENT_TIMESTAMP|更新时间|
|deleted_at|datetime|YES|||删除时间|

**索引**

|键名|类型|唯一|字段|基数|排序规则|空|注释|
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
|PRIMARY|BTREE|YES|menu_id|47|A|NO||

## req_log[↑](#返回顶部)<a name="req_log"></a>

|字段|类型|空|默认值|EXTRA|注释|
|:---:|:---:|:---:|:---:|:---:|:---:|
|req_log_id|int(11)|NO||auto_increment|主键|
|admin_id|int(11)|NO|||用户id|
|ip|varchar(255)|NO|||请求ip地址|
|param|text|NO|||请求参数|
|action|varchar(100)|NO|||请求路径|
|method|varchar(15)|NO|||请求方式|
|status|int(11)|NO|||返回状态值|
|consume_time|int(11)|NO|0||消耗时间|
|created_at|datetime|NO|CURRENT_TIMESTAMP||创建时间|

**索引**

|键名|类型|唯一|字段|基数|排序规则|空|注释|
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
|PRIMARY|BTREE|YES|req_log_id|0|A|NO||
|idx_admin_id|BTREE|NO|admin_id|0|A|NO||

## role[↑](#返回顶部)<a name="role"></a>

> 表注释: 系统角色信息表

|字段|类型|空|默认值|EXTRA|注释|
|:---:|:---:|:---:|:---:|:---:|:---:|
|role_id|int(11)|NO||auto_increment|主键|
|name|varchar(255)|NO|||名称|
|label|varchar(50)|NO|||标签|
|remark|varchar(255)|NO|||备注|
|created_at|datetime|NO|CURRENT_TIMESTAMP||创建时间|
|updated_at|datetime|NO|CURRENT_TIMESTAMP||更新时间|
|deleted_at|datetime|YES|||删除时间|

**索引**

|键名|类型|唯一|字段|基数|排序规则|空|注释|
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
|PRIMARY|BTREE|YES|role_id|0|A|NO||
|IDX_223de54d6badbe43a5490450c3|BTREE|YES|name|0|A|NO||
|IDX_f2d07943355da93c3a8a1c411a|BTREE|YES|label|0|A|NO||

## role_menu[↑](#返回顶部)<a name="role_menu"></a>

> 表注释: 系统角色和菜单关联表

|字段|类型|空|默认值|EXTRA|注释|
|:---:|:---:|:---:|:---:|:---:|:---:|
|role_menu_id|int(11) unsigned|NO||auto_increment|主键|
|role_id|int(11) unsigned|NO|||角色id|
|menu_id|int(11) unsigned|NO|||菜单id|
|created_at|datetime|NO|CURRENT_TIMESTAMP||创建时间|
|updated_at|datetime|NO|CURRENT_TIMESTAMP|on update CURRENT_TIMESTAMP|更新时间|
|deleted_at|datetime|YES|||删除时间|

**索引**

|键名|类型|唯一|字段|基数|排序规则|空|注释|
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
|PRIMARY|BTREE|YES|role_menu_id|0|A|NO||

## task[↑](#返回顶部)<a name="task"></a>

> 表注释: 定时任务信息表

|字段|类型|空|默认值|EXTRA|注释|
|:---:|:---:|:---:|:---:|:---:|:---:|
|task_id|int(11) unsigned|NO||auto_increment||
|app_id|int(11) unsigned|NO|0||所属应用ID: 0-无所属|
|task_name|varchar(64)|NO|||名称|
|user_id|int(11) unsigned|NO|||用户id|
|type|tinyint(1) unsigned|NO|0||类别:1-cron,2-interval|
|status|tinyint(1) unsigned|NO|0||状态:0-暂停中,1-启动中|
|start_time|datetime|YES|||开始时间|
|end_time|datetime|YES|||结束时间|
|limit|int(11)|NO|-1||执行次数|
|cron|varchar(128)|NO|||cron配置|
|every|int(11) unsigned|NO|0||执行间隔时间|
|args|varchar(255)|NO|||参数|
|email_notice|varchar(255)|NO|||异常邮件通知地址（多个地址用逗号隔开）'|
|remark|varchar(255)|NO|||备注|
|created_at|datetime|NO|CURRENT_TIMESTAMP||创建时间|
|updated_at|datetime|NO|CURRENT_TIMESTAMP|on update CURRENT_TIMESTAMP|更新时间|
|deleted_at|datetime|YES|||删除时间|

**索引**

|键名|类型|唯一|字段|基数|排序规则|空|注释|
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
|PRIMARY|BTREE|YES|task_id|0|A|NO||

## task_log[↑](#返回顶部)<a name="task_log"></a>

> 表注释: 定时任务日志表

|字段|类型|空|默认值|EXTRA|注释|
|:---:|:---:|:---:|:---:|:---:|:---:|
|task_log_id|int(11) unsigned|NO||auto_increment||
|task_id|int(11) unsigned|NO|||任务表主键id|
|run_mode|tinyint(1) unsigned|NO|0||方式:1-自动,2-手动|
|result|tinyint(1) unsigned|NO|0||任务执行结果状态:0-失败,1-成功|
|consume_time|int(11) unsigned|NO|0||任务执行花费时间|
|detail|text|NO|||任务执行结果返回|
|created_at|datetime|NO|CURRENT_TIMESTAMP||创建时间|
|updated_at|datetime|NO|CURRENT_TIMESTAMP|on update CURRENT_TIMESTAMP|更新时间|
|deleted_at|datetime|YES|||删除时间|

**索引**

|键名|类型|唯一|字段|基数|排序规则|空|注释|
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
|PRIMARY|BTREE|YES|task_log_id|0|A|NO||
|idx_task_id|BTREE|NO|task_id|0|A|NO||

## user[↑](#返回顶部)<a name="user"></a>

> 表注释: 系统用户信息表

|字段|类型|空|默认值|EXTRA|注释|
|:---:|:---:|:---:|:---:|:---:|:---:|
|user_id|int(11)|NO||auto_increment|用户id|
|username|varchar(64)|NO|||登录账号|
|password|varchar(255)|NO|||密码|
|name|varchar(64)|NO|||真实姓名|
|status|tinyint(4)|NO|1||状态：0：禁用，1：启用|
|head_img|varchar(255)|NO|||头像|
|email|varchar(64)|NO|||邮箱|
|phone|varchar(64)|NO|||电话|
|remark|varchar(255)|NO|||备注|
|created_at|datetime|NO|CURRENT_TIMESTAMP||创建时间|
|updated_at|datetime|NO|CURRENT_TIMESTAMP|on update CURRENT_TIMESTAMP|更新时间|
|deleted_at|datetime|YES|||删除时间|

**索引**

|键名|类型|唯一|字段|基数|排序规则|空|注释|
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
|PRIMARY|BTREE|YES|user_id|0|A|NO||
|IDX_9e7164b2f1ea1348bc0eb0a7da|BTREE|YES|username|0|A|NO||

## user_role[↑](#返回顶部)<a name="user_role"></a>

> 表注释: 系统用户角色关联表

|字段|类型|空|默认值|EXTRA|注释|
|:---:|:---:|:---:|:---:|:---:|:---:|
|user_role_id|int(11)|NO||auto_increment|主键|
|user_id|int(11)|NO|||用户id|
|role_id|int(11)|NO|||角色id|
|created_at|datetime|NO|CURRENT_TIMESTAMP||创建时间|
|updated_at|datetime|NO|CURRENT_TIMESTAMP|on update CURRENT_TIMESTAMP|更新时间|
|deleted_at|datetime|YES|||删除时间|

**索引**

|键名|类型|唯一|字段|基数|排序规则|空|注释|
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
|PRIMARY|BTREE|YES|user_role_id|0|A|NO||
