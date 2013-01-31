<?php
class CommonAction extends Action{
		function _initialize() {
		header ( "Content-Type:text/html; charset=utf-8" );
		$User = Session::get("user");
		// 判断权限，用户是否登陆
		if (empty ( $User  )) {
			$this->redirect ( "/User/tologin" );
		}
	}
	

}
?>