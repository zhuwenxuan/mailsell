<?php
class PromotionModel extends RelationModel {
	protected $_link = array(
			'product'=>array(
					'mapping_type'    =>BELONGS_TO,
					'class_name'     =>'Product',
					'foreign_key' =>'pid',
			),
	);

}