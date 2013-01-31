<?php
class MessageWidget extends Widget {
	public function render($data) {
		//	$widgetId = $data["id"];
		//	$widget = M("Widget")->find($widgetId);
		//	$param = $widget["param"];
		$content =  $this->renderFile('Message',$data);
		return $content;
	}

}
