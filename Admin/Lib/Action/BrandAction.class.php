<?php
class BrandAction extends CommonAction{
	public function index() {
		import("ORG.Util.Page");
		$params=array();
		if(!empty( $_REQUEST["index"])){
			$condition["index"] = $_REQUEST["index"];
			$params["index"] = $_REQUEST["index"];
		}
		if(!empty( $_REQUEST["keyword"])){
			$condition['name'] = array('like','%'.$_REQUEST["keyword"].'%');
			$params["keyword"] = $_REQUEST["keyword"];
		}
		$indexs = array("A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z");
		$count =D("Brand")->where($condition)->count();
		$Page       = new Page($count,10,'/index/index/'.$params["index"].'/keyword/'.$params["keyword"]);
		$show       = $Page->show();
		$b =D("Brand")->where($condition)->limit($Page->firstRow.','.$Page->listRows)->order('createtime desc')->select();
		$this->assign("indexs",$indexs);
		$this->assign('page',$show); //
		$this->assign('list',$b);
		$this->display("main");
	}
	public function delete(){
		$Brand = M("Brand");
		$condition ['id'] = $_GET ['id'];
		$Brand->where($condition)->delete();
		$this->index();
	}
	public function toInsert() {
		$id = $_GET ['id'];
		if (! empty ( $id )) {
			$Brand = M ( "Brand" )->getById ($id);
			$this->assign ( 'brand', $Brand );
		}
		$indexs = array("A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z");
		$this->assign("indexs",$indexs);
		$this->display("insert");
	}
	//插入分类
	public function insert(){
		$model = M('Brand');
		if($data = $model->create()){
			//保存当前数据对象
			if (!empty($_FILES)&&!empty($_FILES['img']['name'])) {
				//如果有文件上传 上传附件
				$data['img'] = $this->_upload();
				//$this->forward();
			}
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
    //搜索提示
    public function search(){
        $key = $_GET ['key'];
        $arr = M("brand")->where("name like '%".$key."%'")->field("id,name")->select();
        echo json_encode($arr);
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
		$upload->thumb = false;
		// 设置引用图片类库包路径
		$upload->imageClassPath = 'ORG.Util.Image';
		//设置需要生成缩略图的文件后缀
		//	$upload->thumbPrefix = 'm_,s_';  //生产2张缩略图
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