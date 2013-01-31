<?php
class MailAction extends CommonAction {
	public function index() {
		import ( "ORG.Util.Page" );
		$search = $_REQUEST["keyword"];
		$where = " 1=1 ";
		if(!empty($search)){
			$where .= " AND tittle like '%".$search."%'"  ;
			$this->assign ( 'keyword', $search );
		}
		$count = M ( "Mail" )->where($where)->count ();
		
		$Page = new Page ( $count, 15 ,"&keyword=".$search);
		$show = $Page->show ();
		$mail = M ( "Mail" )->where($where)->limit ( $Page->firstRow . ',' . $Page->listRows )->order ( 'createtime desc' )->select ();
		$this->assign ( 'page', $show ); //
		$this->assign ( 'list', $mail );
		$this->display ( "mail" );
	}
	public function listsubscriber() {
		import ( "ORG.Util.Page" );
		$count = M ( "subscriber" )->count ();
		$Page = new Page ( $count, 15 );
		$show = $Page->show ();
		$subscriber = M ( "subscriber" )->limit ( $Page->firstRow . ',' . $Page->listRows )->order ( 'createtime desc' )->select ();
		$this->assign ( 'page', $show ); //
		$this->assign ( 'list', $subscriber );
		$this->display ( "subscriber" );
	}
	public function delsub() {
		$model = M ( 'subscriber' );
		$condition ['id'] = $_GET ['id'];
		$sub = M ( "subscriber" )->where ( $condition )->delete ();
		$this->listsubscriber ();
	}
	public function togglesub() {
		$model = M ( 'subscriber' );
		$id = $_REQUEST ['id'];
		$sub = M ( "subscriber" )->getById ( $id );
		$sub ["status"] ^= 1;
		$model->save ( $sub );
		$this->listsubscriber ();
	}
	public function toInsert() {
		$id = $_GET ['id'];
		if (! empty ( $id )) {
			$Mail = M ( "Mail" )->getById ( $id );
			$this->assign ( 'mail', $Mail );
		}
		$qs = M ( "Quotation" )->order ( "createtime desc" )->select ();
		$this->assign ( "qs", $qs );
		$this->display ( "insert" );
	}
	// 插入分类
	public function insert() {
		$model = M ( 'Mail' );
		if ($data = $model->create ()) {
			// 保存当前数据对象
			if (! empty ( $_FILES ) && ! empty ( $_FILES ['image1'] ['name'] )) {
				// 如果有文件上传 上传附件
				$uploadList = $this->_upload ();
				$data ['image1'] = $uploadList [0] ['savename'];
				// $this->forward();
			}
			$bparam = explode ( '|', $_POST ['qid'] );
			$data ['qid'] = $bparam [0];
			$data ['qname'] = $bparam [1];
			if (! empty ( $data ['id'] )) {
				if (false !== $model->save ( $data )) {
					$this->index ();
				} else {
					$this->error ( '操作失败：' . $model->getDbError () );
				}
			} else {
				$list = $model->add ( $data );
				if ($list !== false) {
					$this->index ();
				} else {
					$this->error ( '操作失败：' . $model->getDbError () );
				}
			}
		} else {
			$this->error ( $model->getError () );
		}
	}
	public function swfUpload() {
		$uploadList = $this->_upload2 ();
		echo $uploadList [0] ['savename'];
	}
	// 文件上传
	protected function _upload() {
		import ( "@.ORG.UploadFile" );
		// 导入上传类
		$upload = new UploadFile ();
		// 设置上传文件大小
		$upload->maxSize = 129220000;
		// 设置上传文件类型
		$upload->allowExts = explode ( ',', 'jpg,gif,png,jpeg,rar,zip,7z' );
		// 设置附件上传目录
		$upload->savePath = '../Public/Uploads/';
		// 设置需要生成缩略图，仅对图像文件有效
		$upload->thumb = true;
		// 设置引用图片类库包路径
		$upload->imageClassPath = 'ORG.Util.Image';
		// 设置需要生成缩略图的文件后缀
		$upload->thumbPrefix = 'm_'; // 生产2张缩略图
		                             // 设置缩略图最大宽度
		$upload->thumbMaxWidth = '575';
		// 设置缩略图最大高度
		$upload->thumbMaxHeight = '321';
		// 设置上传文件规则
		$upload->saveRule = uniqid;
		// 删除原图
		$upload->thumbRemoveOrigin = true;
		if (! $upload->upload ()) {
			// 捕获上传异常
			$this->error ( $upload->getErrorMsg () );
		} else {
			// 取得成功上传的文件信息
			$uploadList = $upload->getUploadFileInfo ();
			import ( "ORG.Util.Image" );
			
			// 给m_缩略图添加水印, Image::water('原文件名','水印图片地址')
			// Image::water($uploadList[0]['savepath'] . 'm_' .
			// $uploadList[0]['savename'], '../Public/Images/logo2.png');
			return $uploadList;
		}
	}
	protected function _upload2() {
		import ( "@.ORG.UploadFile" );
		// 导入上传类
		$upload = new UploadFile ();
		// 设置上传文件大小
		$upload->maxSize = 129220000;
		// 设置上传文件类型
		$upload->allowExts = explode ( ',', 'jpg,gif,png,jpeg,rar,zip,7z' );
		// 设置附件上传目录
		$upload->savePath = '../Public/Uploads/';
		// 设置需要生成缩略图，仅对图像文件有效
		$upload->thumb = true;
		// 设置引用图片类库包路径
		$upload->imageClassPath = 'ORG.Util.Image';
		// 设置需要生成缩略图的文件后缀
		$upload->thumbPrefix = 'm_'; // 生产2张缩略图
		                             // 设置缩略图最大宽度
		$upload->thumbMaxWidth = '544';
		// 设置缩略图最大高度
		// $upload->thumbMaxHeight = '321';
		// 设置上传文件规则
		$upload->saveRule = uniqid;
		// 删除原图
		$upload->thumbRemoveOrigin = true;
		if (! $upload->upload ()) {
			// 捕获上传异常
			$this->error ( $upload->getErrorMsg () );
		} else {
			// 取得成功上传的文件信息
			$uploadList = $upload->getUploadFileInfo ();
			import ( "ORG.Util.Image" );
			
			// 给m_缩略图添加水印, Image::water('原文件名','水印图片地址')
			// Image::water($uploadList[0]['savepath'] . 'm_' .
			// $uploadList[0]['savename'], '../Public/Images/logo2.png');
			return $uploadList;
		}
	}
	public function delete() {
		$Mail = M ( "Mail" );
		$condition ['id'] = $_GET ['id'];
		$Mail->where ( $condition )->delete ();
		$this->index ();
	}
	public function deleteSubscriber() {
		$Mail = M ( "Subscriber" );
		$condition ['id'] = $_GET ['id'];
		$Mail->where ( $condition )->delete ();
		$this->index ();
	}
	public function toggle() {
		$model = M ( 'Mail' );
		$id = $_GET ['id'];
		$quta = M ( "Mail" )->getById ( $id );
		$quta ["visible"] ^= 1;
		$model->save ( $quta );
		$this->index ();
	}
	public function sendMail() {
		header ( 'Content-type:text/html;charset=utf-8' );
		vendor ( "PHPMailer.class#phpmailer" ); // 从PHPMailer目录导入class.phpmailer.php类文件
		$mailid = $_REQUEST ["id"];
		if (! empty ( $mailid )) {
			$condition ["id"] = $mailid;
		} else {
			$condition ["status"] = 0;
		}
		$maildata = M ( "Mail" )->where ( $condition )->order ( "createtime desc" )->find ();
		$q = M ( "Quotation" )->getById ( $maildata ["qid"] );
		$members = M ( "Member" )->where ( "ismail=1 and status=1" )->select ();
		$fails = array ();
		foreach ( $members as $member ) {
			$this->doSend($maildata,$member,$q,&$fails);
		}
		$this->assign ( "failes", $fails );
		$this->assign("mailid",$mailid);
		// $this->success ( "邮件发送成功" );
		M ( "Mail" )->save ( $maildata );
		$this->display ();
	}
	public function resend(){
		$memberid = $_REQUEST["memberid"];
		$mailid = $_REQUEST["mailid"];
		$memberstr = implode(",", $memberid);
		$maildata = M ( "Mail" )->getById ($mailid);
		$q = M ( "Quotation" )->getById ( $maildata ["qid"] );
		$members = M ( "Member" )->where ( "id in (".$memberstr.")")->select ();
		$fails = array ();
		foreach ( $members as $member ) {
			$this->doSend($maildata,$member,$q,&$fails);
		}
		$this->assign ( "failes", $fails );
		$this->assign("mailid",$mailid);
		// $this->success ( "邮件发送成功" );
		M ( "Mail" )->save ( $maildata );
		$this->display ("sendMail");
	}
	private function doSend($maildata,$member,$q,&$fails){
		header ( 'Content-type:text/html;charset=utf-8' );
		vendor ( "PHPMailer.class#phpmailer" ); // 从PHPMailer目录导入class.phpmai
		$mail = new PHPMailer ( true ); // the true param means it will throw
		// exceptions on errors, which we need
		// to catch
		$mail->IsSMTP (); // telling the class to use SMTP
		$this->assign ( "mail", $maildata );
		$this->assign ( "userid", $member ["id"] );
		$this->assign ( "q", $q );
		$content = $this->fetch ( 'template' );
			
		try {
			$mail->SMTPDebug = false; // 改为2可以开启调试
			$mail->SMTPAuth = true; // enable SMTP authentication
			$mail->Host = "smtp.qiye.163.com"; // sets the SMTP server
			$mail->Port = 25; // set the SMTP port for the GMAIL server
			$mail->CharSet = "UTF-8"; // 这里指定字符集！解决中文乱码问题
			$mail->Encoding = "base64";
			$mail->Username = "sales@splendid-co.com"; // SMTP account
			// username
			$mail->Password = "l384800"; // SMTP account password
			$mail->AddAddress ( $member ["email"] );
			$mail->SetFrom ( 'sales@splendid-co.com', 'splendid&co' ); // 发送者邮箱
			$mail->AddReplyTo ( 'sales@splendid-co.com', 'splendid&co' ); // 回复到这个邮箱
			$mail->Subject = $maildata ["tittle"];
			$mail->MsgHTML ( $content );
			// $mail->AddAttachment('images/phpmailer.gif'); // attachment
			// $mail->AddAttachment('images/phpmailer_mini.gif'); //
			// attachment
			$mail->Send ();
			$maildata ["status"] = 1;
		} catch ( Exception $e ) {
			// 保存失败邮件地址
			$fails [] = $member;
			$maildata ["status"] = 2;
			echo $e->getMessage (); // Boring error messages from anything else!
		}
	}
}
?>