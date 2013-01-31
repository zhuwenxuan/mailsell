<?php
class QuotationAction extends CommonAction{
	public function toInsert() {
		$id = $_GET ['id'];
		if (! empty ( $id )) {
			$Quotation = M ( "Quotation" )->getById ($id);
			$this->assign ( 'quota', $Quotation );
			$cateids = explode("|", $Quotation["cid"]);
			$this->assign('cateids',$cateids);
		}
		$c = M("Cate")->select();
		$this->assign('clist',$c);

		$b = M("Brand")->select();
		$this->assign('blist',$b);
		$this->display("insert");
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
		$c = M("Cate")->select();
		$this->assign('clist',$c);

		$b = M("Brand")->select();
		$this->assign('blist',$b);

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
		$this->assign('page',$show); //
		$this->assign('list',$q);
		$this->display('main');
	}
	//插入分类
	public function insert(){
		$model = M('Quotation');
		if($data = $model->create()){
			//保存当前数据对象
			if (!empty($_FILES)&&!empty($_FILES['ufile']['name'])) {
				//如果有文件上传 上传附件
				$uploadFile = $this->_upload();
				$data['ufile'] = $uploadFile['savename'];
				$size = $uploadFile['size'];
				$size = $size/1024;
				if($size>100){
					$data['size'] =number_format($size/1024,2)."M";
				}else{
					$data['size'] =number_format($size,2)."k";
				}
				//$this->forward();
			}
			$data['id'] = $_POST['id'];
			$cparams = $_POST['cid'];
			$data['intro'] = $_POST['intro'];
			$data['cid'] ="";
			foreach($cparams as $cparam){
				$tempc = explode('|', $cparam);
				$data['cid'] .= $tempc[0]."|";
				$data['cname'] .= $tempc[1]."|";
			}
			$data['cid'] = trim($data['cid'], "|");
			$data['cname'] = trim($data['cname'], "|");

			//改填写乱七八糟的属性了，日！
			$data['param1'] = isset($_POST['param1'])?"1":"";
			$data['param2'] = isset($_POST['param2'])?"1":"";
			$data['param3'] = isset($_POST['param3'])?"1":"";
			$data['param4'] = isset($_POST['param4'])?"1":"";
			$data['param5'] = isset($_POST['param5'])?"1":"";
			$data['param6'] = isset($_POST['param6'])?"1":"";
			$data['param7'] = isset($_POST['param7'])?"1":"";
			$data['param8'] = isset($_POST['param8'])?"1":"";
			if (! empty ($data['id'])) {
				if (false !== $model->save ($data)) {
					$this->redirect("/Quotation/index");
				} else {
					$this->error('操作失败：'.$model->getDbError());
				}
			} else {
				$list = $model->add($data);
				if ($list !== false) {
					$this->redirect("/Quotation/index");
				} else {
					$this->error('操作失败：'.$model->getDbError());
				}
			}
		}
	}
	public function toggle(){
		$model = M('Quotation');
		$id = $_GET ['id'];
		$quta = M ( "Quotation" )->getById ($id);
		$quta["visible"] ^= 1;
		$model->save($quta);
		$this->index();
	}

	// 文件上传
	protected function _upload() {
		import("@.ORG.UploadFile");
		//导入上传类
		$upload = new UploadFile();
		//设置上传文件大小
		$upload->maxSize = 529220000;
		//设置上传文件类型
		$upload->allowExts = explode(',', 'zip,rar');
		//设置附件上传目录
		$upload->savePath = '../Public/Uploads/';
		//设置上传文件规则
		$upload->saveRule = uniqid;
		if (!$upload->upload()) {
			//捕获上传异常
			$this->error($upload->getErrorMsg());
		} else {
			//取得成功上传的文件信息
			$uploadList = $upload->getUploadFileInfo();
			return  $uploadList[0];
		}

	}

	public function delete() {
		$id = $_GET ['id'];
		if (! empty ( $id )) {
			$Quotation = M ( "Quotation" );
			$condition ['id'] =$id ;
			if (false !== $Quotation->where ( $condition )->delete ()) {
				$this->assign ( 'jumpUrl', __URL__ . '/index' );
				$this->index();
			} else {
				$this->error ( '操作失败：' . $Quotation->getDbError () );
			}
		} else {
			$this->error ( '请选择删除分类！' );
		}
	}
}
?>