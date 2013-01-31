<?php
class MessageAction extends CommonAction{
	public function index() {
		import("ORG.Util.Page");
		$count =D("Message")->count();
		$Page       = new Page($count,10);
		$show       = $Page->show();
		$b =D("Message")->limit($Page->firstRow.','.$Page->listRows)->order('createtime desc')->select();
		$this->assign('page',$show); //
		$this->assign('list',$b);
		$this->display("main");
	}
	public function delete(){
		$Message = M("Message");
		$condition ['id'] = $_GET ['id'];
		$Message->where($condition)->delete();
		$this->redirect("/Message/index/");
	}

}
?>