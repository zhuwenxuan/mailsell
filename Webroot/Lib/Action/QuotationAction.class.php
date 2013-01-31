<?php
class QuotationAction extends Action{

	function _initialize() {
		header ( "Content-Type:text/html; charset=utf-8" );
		$User = Session::get("user");
		// 判断权限，用户是否登陆
		if (empty ( $User )) {
			$this->redirect('/index.php?s=/Index/detail');
		}
	}


	public function index() {
		$params=array();
		if(!empty( $_REQUEST["bid"])){
			$condition["bid"] = $_REQUEST["bid"];
			$params["bid"] = $_REQUEST["bid"];
		}
		if(!empty( $_REQUEST["cid"])){
			$condition["cid"] = array(array('like',$_REQUEST["cid"].'|%'), array('like','%|'.$_REQUEST["cid"].'|%'), array('like','%|'.$_REQUEST["cid"]), $_REQUEST["cid"],'or');
			$params["cid"] = $_REQUEST["cid"];
		}
		if(!empty( $_REQUEST["keyword"])){
			$condition['name'] = array('like','%'.$_REQUEST["keyword"].'%');
			$params["keyword"] = $_REQUEST["keyword"];
		}

		$condition["visible"]=1;
		$c = M("Cate")->order('orderBy desc')->select();
		$this->assign('clist',$c);

		$b = M("Brand")->select();
		$this->assign('blist',$b);
		
		Session::start();
		$user = $_SESSION ["user"] ;
		$this->assign("user1",$user);
		
		$qList = M("Quotation")->where("visible = 1")->select();
		$pnum=array();
		$cnum=array();
		foreach ($qList as $quota){
			$tempbid = $quota["bid"];
			$pnum[$tempbid]+=1;
			$tempcids = explode("|",$quota["cid"]);
			foreach ($tempcids as $tempcid){
				$cnum[$tempcid]+=1;
			}
		}
		$this->assign('bnum',$pnum);
		$this->assign('cnum',$cnum);

		import("ORG.Util.Page");
		$count =M("Quotation")->where($condition)->count();
		$Page       = new Page($count,10,'/index/bid/'.$params["bid"].'/cid/'.$params["cid"].'/keyword/'.$params["keyword"]);
		$Page->setConfig('theme', '%upPage%   %linkPage%  %downPage%');
		$Page->rollPage=10;
		$show       = $Page->show();
		$q =M("Quotation")->limit($Page->firstRow.','.$Page->listRows)->where($condition)->order('createtime desc')->select();
		foreach ($q as $key=>$qtemp){
			$brand = M("Brand")->getById($qtemp["bid"]);
			$q[$key]["source"] = $brand["city"];
		}
		$this->assign('page',$show); //
		$this->assign('qlist',$q);
		$this->display();
	}

	public function download(){
		$id = $_REQUEST["id"];
		$model = M("Quotation");
		$q = $model->where("id=".$id)->find();
		$q["hit"]+=1;
		$model->save($q);
		redirect("Public/Uploads/".$q["ufile"]) ;
	}

}
?>