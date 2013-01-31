<?php
import ( "@.Action.CommonAction" );
class IndexAction extends CommonAction{
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


    
}
?>