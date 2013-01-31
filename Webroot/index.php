<?php
//定义项目名称和路径
define('APP_NAME', 'Webroot');
define('APP_PATH', '../');
define('THINK_PATH', './ThinkPHP');
// 加载框架入口文件
require( THINK_PATH."/ThinkPHP.php");
App::run();