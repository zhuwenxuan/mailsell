<?php
class CateAction extends CommonAction{
	public function index() {
		$b =D("Cate")->order('orderBy desc')->select();
		$this->assign('list',$b);
		$this->display("main");
	}
	public function delete(){
		$Cate = M("Cate");
		$condition ['id'] = $_GET ['id'];
		$Cate->where($condition)->delete();
		$this->redirect("/Cate/index/");
	}
	public function toInsert() {
		$id = $_GET ['id'];
		if (! empty ( $id )) {
			$Cate = M ( "Cate" )->getById ($id);
			$this->assign ( 'cate', $Cate );
		}
        $this->display("insert");
	}
	public function reOrder(){
		$id = $_REQUEST ['id'];
		$num = $_REQUEST['num'];
		if (! empty ( $id )) {
			$model = M ( "Cate" );
			$Cate = $model->getById ($id);
			$Cate["orderBy"]=$num;
			$model->save($Cate);
		}
		$this->index();
	}
	//插入分类
	public function insert(){
		$model = M('Cate');
		if($data = $model->create()){
			//保存当前数据对象
			if (!empty($_FILES)&&!empty($_FILES['img']['name'])) {
				//如果有文件上传 上传附件
				$data['img'] = $this->_upload();
				//$this->forward();
			}
			$data['bcity'] = $_POST['bcity'];
			$data['bname'] = $_POST['bname'];
			$data['bintro'] = $_POST['bintro'];
			if (! empty ($data['id'])) {
				if (false !== $model->save ($data)) {
					$this->index();
				} else {
					$this->error('操作失败：'.$model->getDbError());
				}
			} else {
				$list = $model->add($data);
				if ($list !== false) {
					$this->index();
				} else {
					$this->error('操作失败：'.$model->getDbError());
				}
			}
		}else{
			$this->error($model->getError());
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
		$upload->allowExts = explode(',', 'jpg,gif,png,jpeg');
		//设置附件上传目录
		$upload->savePath = '../Public/Uploads/';
		//设置需要生成缩略图，仅对图像文件有效
		$upload->thumb = true;
		// 设置引用图片类库包路径
		$upload->imageClassPath = 'ORG.Util.Image';
		//设置需要生成缩略图的文件后缀
		$upload->thumbPrefix = 'm_,s_';  //生产2张缩略图
		//设置缩略图最大宽度
		$upload->thumbMaxWidth = '400,100';
		//设置缩略图最大高度
		$upload->thumbMaxHeight = '400,100';
		//设置上传文件规则
		$upload->saveRule = uniqid;
		//删除原图
		$upload->thumbRemoveOrigin = true;
		if (!$upload->upload()) {
			//捕获上传异常
			$this->error($upload->getErrorMsg());
		} else {
			//取得成功上传的文件信息
			$uploadList = $upload->getUploadFileInfo();
			import("ORG.Util.Image");

			//给m_缩略图添加水印, Image::water('原文件名','水印图片地址')
// 			Image::water($uploadList[0]['savepath'] . 'm_' . $uploadList[0]['savename'], '../Public/Images/logo2.png');
			return  $uploadList[0]['savename'];
		}

	}

}
?>