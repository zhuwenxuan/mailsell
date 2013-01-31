<?php
class UserAction extends Action{
	public function login() {
		$user["name"]=$_POST["username"];
		$user["password"]=$_POST["pwd"];
		$user = M ( "User" )->where($user)->find();
		if(!empty($user)){
			Session::start();
			$_SESSION ["user"] = $user;
			$this->success ( "登录成功！" );
			$this->redirect("/Index/index");
		}else{
			$this->error ( "用户名密码错误！" );
			$this->tologin();
		}
			
	}
	public function logout(){
		Session::start();
		$_SESSION ["uid"] = "";
		$this->success ( "注销成功！" );
		$this->redirect("/User/toLogin/");
	}
	public function modfyPwd(){
		$this->display();
	}
	public function dopwd(){
		$user = M ( "User" )->getById ($_REQUEST["id"]);
		$user["password"]=$_REQUEST["password"];
		M ( "User" )->save($user);
		$this->success ( "修改成功！" );
		//$this->redirect("/Index/index");
	}
	public function tologin(){
		$this->display("login");
	}
}
?>