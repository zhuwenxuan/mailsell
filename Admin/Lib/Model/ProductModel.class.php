<?php
class ProductModel extends RelationModel {
	protected $_link = array(
			'category'=>array(
					'mapping_type'    =>BELONGS_TO,
					'class_name'     =>'Category',
					'foreign_key' =>'cid',
			),
			'brank'=>array(
					'mapping_type'    =>BELONGS_TO,
					'class_name'     =>'Brank',
					'foreign_key' =>'bid',
// 					'mapping_fields' =>'id',
			),
	);
	
	protected $_validate  =  array(
	// 			array(验证字段,验证规则,错误提示,验证条件,附加规则,验证时间)
			array('bname','require','品牌名称必须！'),
			array('bcity','require','品牌产地必须！'),
			array('bname','','品牌名称已经存在！',1,'unique',1),
	);
	

}