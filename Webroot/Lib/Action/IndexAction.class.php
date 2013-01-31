<?php
class IndexAction extends Action{
	public function index() {
		// 	$this->assign("jumpUrl","/Category/index/");
		// 	$this->redirect("/User/toLogin/");
		$this->display();
	}
	public function main(){
		$this->display();
	}
	public function menu(){
		$this->display();
	}
	public function header(){
		$this->display();
	}
	//插入分类
	public function insert(){
		$Category = D("Category");
		if ($Category->create()) {
			if (false !== $Category->add()) {
				$this->assign('msg','数据添加成功');
				$this->success ( '操作成功' );
			} else {
				$Category->error('数据写入错误');
			}
		} else {
			$this->error($Category->getError());
		}
	}
	//用户注册
	public function toInsert(){
		$this->display ( "Index:insertUser" );
	}
	public function doInsertUser(){

		$model = M('Member');
		if($data = $model->create()){
			$reslut1 = M('Member')->where('name = "'.$data['name'].'"')->select();
			if($reslut1!=null){
				$this->error();
			}
			//保存当前数据对象
			if (!empty($_FILES)&&!empty($_FILES['attachment']['name'])) {
				//如果有文件上传 上传附件
				$data['attachment'] = $this->_upload();
				//$this->forward();
			}
			$list = $model->add($data);
			if ($list != false) {
				//	redirect('/index.php?s=/Quotation/index');
				$this->display ( "Index:detail" );
					
			} else {
				$this->error('操作失败：'.$model->getDbError());
			}
		}
	}

	public function doModifyUser(){
		$model = M('Member');
		if($data = $model->create()){
			$old =M('Member')->where("id = ".$data['id'])->find();
			$reslut1 = M('Member')->where('name = "'.$data['name'].'"')->select();
			if($reslut1!=null&&$old['name']!=$data['name']){
				$this->error();
			}
			$passwordold = $old['password'];//旧密码
			$reslut2 = M('Member')->where('email = "'.$data['email'].'"')->select();
			if($reslut2!=null&&$old['email']!=$data['email']){
				$this->error();
			}
			if(empty($data['password'])){//密码为空表示不修改密码
				$data['password']=$passwordold;
			}
			$list = $model->save($data);
			if ($list !== false) {
				$_SESSION ["user"] = $data;
				echo 1;
			} else {
				echo -1;
			}
		}
			
	}
	//跳转到说明页面
	public function detail(){
		$this->display("detail");
	}
	//用户登录
	public function login(){
		//$this->redirect('/index.php?s=/Quotation/index');
		$user = M("Member");
		$name = $_REQUEST['name'];
		$password = $_REQUEST['password'];
		$data = $user->where('name="'.$name.'" and password = "'.$password.'" and status = 1')->find();
		if(!empty($data)){
			$_SESSION ["user"] = $data;
			echo 1;
		}else{
			echo -1;
		}
	}
	public function tologin(){

		$this->display();
	}
	//订阅mail
	public function insertMail(){
		$model = M('Subscriber');
		$subscriber["adress"] = $_REQUEST["adress"];
		$list = $model->add($subscriber);
		if($list!==false){
			echo 1;
		}else{
			echo -1;
		}
	}
	// 文件上传
	protected function _upload() {
		import("@.ORG.UploadFile");
		//导入上传类
		$upload = new UploadFile();
		//设置上传文件大小
		$upload->maxSize = 3292200;
		//设置上传文件类型
		$upload->allowExts = explode(',', 'doc,pdf,txt,gif,jpg,jpeg,png');
		//设置附件上传目录
		$upload->savePath = 'Public/Uploads/';
		//设置上传文件规则
		$upload->saveRule = uniqid;
		if (!$upload->upload()) {
			//捕获上传异常
			$this->error($upload->getErrorMsg());
		} else {
			//取得成功上传的文件信息
			$uploadList = $upload->getUploadFileInfo();
			return  $uploadList[0]['savename'];
		}

	}
	public function logout(){
		$_SESSION ["user"] = "";
		$this->display("tologin");
	}
}
?>