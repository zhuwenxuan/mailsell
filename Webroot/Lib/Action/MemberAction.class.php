<?php
class MemberAction extends CommonAction{
	public function index() {
		import("ORG.Util.Page");
		$count =D("Member")->count();
		$Page       = new Page($count,10);
		$show       = $Page->show();
		$b =D("Member")->limit($Page->firstRow.','.$Page->listRows)->select();
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
			$this->assign ( 'brand', $Member );
		}
        $this->display("insert");
	}
	
	public function toggle(){
		$model = M('Member');
		$id = $_GET ['id'];
		$quta = M ( "Member" )->getById ($id);
		$quta["status"] ^= 1;
		$model->save($quta);
		$this->index();
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


}
?>