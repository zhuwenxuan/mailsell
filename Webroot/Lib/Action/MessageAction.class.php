<?php
class MessageAction extends Action{
	public function insert() {
		$model =M("Message");
		$data = $model->create();
		if ($model->add($data)) {
			echo 1;
		} else {
			echo -1;
		}
	}

}
?>