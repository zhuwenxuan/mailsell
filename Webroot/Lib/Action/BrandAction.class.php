<?php
class BrandAction extends Action{
	public function index() {
		$brands =M("Brand")->where("img!=''")->select();
		$brandgroup = Array();
		$indexs = array();
		foreach ($brands as $brand) {
			if(array_key_exists($brand["index"],$brandgroup)){
				array_push($brandgroup[$brand["index"]], $brand);
			}else{
				$brandgroup[$brand["index"]]=Array();
				$indexs[] = $brand["index"];
				array_push($brandgroup[$brand["index"]], $brand);
			}
		}
		$this->assign("indexs",$indexs);
		$this->assign('brandgroup',$brandgroup);
		$this->display();
	}
	public function detail() {
		$id = $_REQUEST['id'];
		$data = M('Brand')->where('id = '.$id)->find();
		$this->assign("brand",$data);
		
		$indexs = array();
		$brands =M("Brand")->select();
		
		$brandgroup = Array();
		foreach ($brands as $brand) {
			if(array_key_exists($brand["index"],$brandgroup)){
				array_push($brandgroup[$brand["index"]], $brand);
			}else{
				$brandgroup[$brand["index"]]=Array();
				$indexs[] = $brand["index"];
				array_push($brandgroup[$brand["index"]], $brand);
			}
		}
		$this->assign("indexs",$indexs);
		$this->assign('brandgroup',$brandgroup);
		
		$this->display();
	}
}
?>