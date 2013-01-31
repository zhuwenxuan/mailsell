<?php
class MemberAction extends CommonAction{
	public function index() {
		import("ORG.Util.Page");
		$count =D("Member")->count();
		$Page       = new Page($count,10);
		$show       = $Page->show();
		$b =D("Member")->limit($Page->firstRow.','.$Page->listRows)->order("createtime desc")->select();
		$this->assign('page',$show); //
		$this->assign('list',$b);
		$this->display("main");
	}
	public function delete(){
		$Member = M("Member");
		$condition ['id'] = $_GET ['id'];
		$Member->where($condition)->delete();
		$this->redirect("/Member/index/");
	}
	public function toInsert() {
		$id = $_GET ['id'];
		if (! empty ( $id )) {
			$Member = M ( "Member" )->getById ($id);
			$this->assign ( 'member', $Member );
		}
		$this->display("insert");
	}

	public function toggle(){
		$model = M('Member');
		$id = $_REQUEST ['id'];
		$quta = M ( "Member" )->getById ($id);
		$quta["status"] ^= 1;
		$model->save($quta);
		echo 1;
	}
	public function toggle2(){
		$model = M('Member');
		$id = $_REQUEST ['id'];
		$quta = M ( "Member" )->getById ($id);
		$quta["ismail"] ^= 1;
		$model->save($quta);
		echo 1;
	}
	//插入分类
	public function insert(){
		$model = M('Member');
		if($data = $model->create()){
			//保存当前数据对象
			$data['city'] = $_POST['city'];
			$data['name'] = $_POST['name'];
			$data['intro'] = $_POST['intro'];
			if (! empty ($data['id'])) {
				if (false !== $model->save ($data)) {
					$this->success('操作成功');
				} else {
					$this->error('操作失败：'.$model->getDbError());
				}
			} else {
				$list = $model->add($data);
				if ($list !== false) {
					$this->success('操作成功');
				} else {
					$this->error('操作失败：'.$model->getDbError());
				}
			}
		}else{
			$this->error($model->getError());
		}
	}

	public function setAuth(){
		$auth = $_REQUEST("auth");
		$id = $_REQUEST("id");
		$conditon["id"] = $id;
		$member = M("Member")->where($conditon)->find();
		if(!empty($member)){
			$member["status"]= $auth;
			M("Member")->save($member);
		}
		$this->index();
	}
	public function reset111(){
		$id = $_REQUEST["id"];
		$conditon["id"] = $id;
		$member = M("Member")->where($conditon)->find();
		if(!empty($member)){
			$member["password"]= "123456";
			M("Member")->save($member);
		}
		echo "操作成功!";
	}

}
?>