<?php
class DesignerAction extends Action{

	function _initialize() {
		header ( "Content-Type:text/html; charset=utf-8" );
	}


	public function index() {
        $this->display();
	}
}
?>