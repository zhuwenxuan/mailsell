<?php
class MailAction extends Action {
	public function index() {
		$id = $_REQUEST ["id"];
		$mail = M ( "Mail" )->where ( "id=" . $id )->find ();
		$this->assign ( "mail", $mail );
		$q = M ( "Quotation" )->getById ( $mail ["qid"] );
		$this->assign ( "q", $q );
		$this->display ( "mail" );
	}
	public function unsub() {
		$model = M ( 'Member' );
		$id = $_GET ['id'];
		if ($data = $model->create ()) {
			$member = $model->getByEmail($data["email"]);
			$member["unsubreason"] = $data["unsubreason"];
			$member["how2no"] = $data["how2no"];
			$member["ismail"] = 0;
			$model->save($member);
		} else {
			$this->error ( $model->getError () );
		}
		redirect(__APP__);
	}
	public function tounsub(){
		$this->display("unsub");
	}
}
?>