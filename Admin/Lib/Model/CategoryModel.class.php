<?php
class CategoryModel extends RelationModel {
	protected $_link = array ('products' =>
			array ('mapping_type' => HAS_MANY,
					'class_name' => 'Product',
					'mapping_name' => 'products' ,
					)
			)

	;
	protected $_auto = array (
			array ('path', 'getPath', 3, 'callback' ),
			);

	function getPath() {
		$pid = $_POST ['cparentid'];
		$mi = $this->field ( 'id,path' )->getById ( $pid );
		$path = $pid != 0 ? $mi ['path'] . $mi ['id'] . '-' : 0;
		return $path;
	}

	// 自动验证设置
	protected $_validate = array (array ('cname', 'require', '标题必须！', 1 ) );

}