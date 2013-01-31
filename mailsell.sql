/*
MySQL Data Transfer
Source Host: localhost
Source Database: mailsell
Target Host: localhost
Target Database: mailsell
Date: 2012/6/12 21:17:20
*/

SET FOREIGN_KEY_CHECKS=0;
-- ----------------------------
-- Table structure for brand
-- ----------------------------
CREATE TABLE `brand` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `index` varchar(32) NOT NULL DEFAULT 'A',
  `name` varchar(20) NOT NULL COMMENT '品牌名称',
  `city` varchar(20) NOT NULL,
  `img` varchar(200) NOT NULL COMMENT '品牌图片地址',
  `qnum` int(32) NOT NULL DEFAULT '0',
  `intro` varchar(5000) NOT NULL COMMENT '品牌介绍',
  `visible` int(2) NOT NULL DEFAULT '1' COMMENT '是否可见，1：可见（默认），2：不可见',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for cate
-- ----------------------------
CREATE TABLE `cate` (
  `id` int(32) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `intro` varchar(32) NOT NULL,
  `visible` int(2) NOT NULL DEFAULT '1' COMMENT '是否可见，1：可见（默认），2：不可见',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for member
-- ----------------------------
CREATE TABLE `member` (
  `id` int(32) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `password` varchar(32) NOT NULL,
  `status` int(32) NOT NULL DEFAULT '1' COMMENT '1:可用，0不可用',
  `telphone` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for quotation
-- ----------------------------
CREATE TABLE `quotation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL COMMENT '??id',
  `name` varchar(32) NOT NULL DEFAULT '报价单',
  `bname` varchar(20) NOT NULL DEFAULT '品牌',
  `cname` varchar(50) NOT NULL DEFAULT '分类',
  `bid` int(11) NOT NULL COMMENT '??id',
  `ufile` varchar(500) NOT NULL COMMENT '????',
  `state` int(11) NOT NULL DEFAULT '1',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `visible` int(2) NOT NULL DEFAULT '1' COMMENT '是否可见，1：可见（默认），0：不可见',
  `leibie` varchar(32) DEFAULT NULL,
  `jiage` varchar(32) DEFAULT NULL,
  `shuliang` varchar(32) DEFAULT NULL,
  `miaoshu` varchar(32) DEFAULT NULL,
  `leixing` varchar(32) DEFAULT NULL,
  `xingbie` varchar(32) DEFAULT NULL,
  `deadline` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for user
-- ----------------------------
CREATE TABLE `user` (
  `id` int(32) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL COMMENT '名称',
  `password` varchar(32) NOT NULL COMMENT 'qq号',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records 
-- ----------------------------
INSERT INTO `brand` VALUES ('19', 'A', '11', '111', '4fd39e12aebcf.jpg', '0', '11', '1', '2012-06-10 17:38:09');
INSERT INTO `brand` VALUES ('3', 'B', '美国TOPCO2', '美国3', '4f61f6996ddde.jpg', '0', 'Topco Sales是源自美国的全球知名成人用品品牌，美国Topco Sales开拓性想法，发明闻名全球的CyberSkin材料，用官能的艺术结合了高科技材料创造栩栩如生的仿真成人玩具及相关性用品，并将潮流推向了好莱坞。 　　目前产品包括男性用品、女性用品、情趣香水、润滑济等，近年来，这些产品也得到了国内消费者的认可，成为追求高端品质性爱生活人们的最爱。 品牌地位:在全球属于最顶尖的塔尖型企业,世界范围内的五大顶级品牌之一。', '1', '2012-06-10 17:38:13');
INSERT INTO `brand` VALUES ('16', 'C', '以比赞', '中国', '4f61fef79861b.gif', '0', '以比赞是北京以比赞服饰有限公司旗下的情趣品牌内衣品牌，授权飞升吧电子商务有限公司销售。', '1', '2012-06-10 17:38:17');
INSERT INTO `brand` VALUES ('17', 'D', '以比赞', '中国', '4f61ff194e58a.gif', '0', '以比赞是北京以比赞服饰有限公司旗下的情趣品牌内衣品牌，授权飞升吧电子商务有限公司销售。', '1', '2012-06-10 17:38:19');
INSERT INTO `brand` VALUES ('5', 'E', 'Ultrazone', '美国', '4f61f76e218ef.gif', '0', 'UltraZone是来自美国的高端情趣用品品牌。品牌特点是注重细节，专注于走精品路线。　通过性感的外观与优秀的震动能力让人感受到愉悦，满足追求高品质生活人士的高标准情趣要求。', '1', '2012-06-10 17:38:21');
INSERT INTO `brand` VALUES ('6', 'F', 'SkinSation', '美国', '4f61f904daddf.gif', '0', 'SkinSation是来自美国的高端创意型情趣用品品牌，SkinSation品牌以其逼真的造型和真人1：1倒模的真实体验感为特色，以重视产品选材为特点，着重于真实的触感，致力于达到和真人体温及手感99.9%的相似度。', '1', '2012-06-10 17:38:25');
INSERT INTO `brand` VALUES ('7', 'G', '爱侣', '中国', '4f61f93adbbef.gif', '0', '\"爱侣\"，中国第一个成人用品民族品牌，国内成人用品产业的开拓者和引领者。\"爱侣\"始创于1994年，迄今已有17年历史。 深厚的经验积累、专业的工艺技术、完善的售后保障，让\"爱侣\"获得国际国内无数消费者的信赖和肯定。全国各大城市均有爱侣牌健慰器的地区代理商或市级经销商，不仅在国内市场占据着巨大优势，同时还销住日本、欧美等近二十七个国家。', '1', '2012-06-10 17:38:27');
INSERT INTO `brand` VALUES ('8', 'A', '欲望都市', '美国', '4f61f980056aa.gif', '0', '欲望都市（LustyCity）是一个走在国际前沿的品牌，以设计灵魂演绎时尚性爱经典，采用世界领先的材质、工艺和制作标准，秉承“优雅、精致、时尚” 的产品风格，无限激发使用者情欲美感和愉悦体验。轻松的都市情调和婉约的性感气息交相辉映，折射出灵动悠闲的新生代魅力，唤起女性最原始的冲动，在理性和感性的交叉地带，做一个“时尚欲望俏佳人”。', '1', '2012-06-10 17:38:31');
INSERT INTO `brand` VALUES ('9', 'A', '4Utoys', '香港', '4f61f9a6f29d6.jpg', '0', '“创愉悦，享生活”，作为世界情趣王国的资深专家，香港创享国际深深了解：人们渴望得到更完美的情趣体验。4U系列品牌的应运而生，只为让这一美好理 想变为现实，让人们更恣意畅快享受精彩绝伦的情趣旅程。“For you all the toys”，4Utoys专注于引导更多人踏上曼妙的情趣之旅；4Ugreen倡导“玩具就选绿色的”，把绿色环保理念带给真正追求高质量情趣生活的 人；4Umachine主张“追求极致性爱体验”，在爆发式的性爱高潮中为人们提供高潮潜能的无限超越。随着4U品牌的发展壮大，4U家族将诞生一个又一 个活力十足的新成员，在不断创造愉悦意境的过程中，让人们快乐享受切实而富有品质的情趣生活。', '1', '2012-06-10 17:38:34');
INSERT INTO `brand` VALUES ('10', 'A', '英国Mantric', '英国', '4f61fa1a6b0a5.jpg', '0', '英国知名品牌', '1', '2012-06-10 17:38:37');
INSERT INTO `brand` VALUES ('15', 'A', '美国私乐', '美国', '4f61febcc0761.jpg', '0', '美国著名品牌', '1', '2012-06-10 17:38:40');
INSERT INTO `brand` VALUES ('24', 'A', '', '', '', '0', '', '1', '2012-06-10 18:40:38');
INSERT INTO `brand` VALUES ('20', 'A', '333', '333', '4fd46a0323105.jpg', '0', '333', '1', '2012-06-10 17:38:44');
INSERT INTO `brand` VALUES ('21', 'A', '555', '555', '4fd46a13b8162.jpg', '0', '55', '1', '2012-06-10 17:38:47');
INSERT INTO `brand` VALUES ('22', 'A', '333', '333', '4fd46bbb4cb30.jpg', '0', '333', '1', '2012-06-10 17:41:15');
INSERT INTO `brand` VALUES ('23', 'A', '111', '111', '4fd46bd8b942c.jpg', '0', '11', '1', '2012-06-10 17:41:45');
INSERT INTO `brand` VALUES ('25', 'I', '55', '55 ', '4fd4b13ce63fe.jpg', '0', ' tt', '1', '2012-06-10 22:37:49');
INSERT INTO `cate` VALUES ('3', '11', '1', '1', '0000-00-00 00:00:00');
INSERT INTO `cate` VALUES ('2', '444', '444', '1', '0000-00-00 00:00:00');
INSERT INTO `cate` VALUES ('4', '2222', '22222222', '1', '0000-00-00 00:00:00');
INSERT INTO `cate` VALUES ('5', '33', '333', '1', '0000-00-00 00:00:00');
INSERT INTO `cate` VALUES ('6', '3', '333', '1', '0000-00-00 00:00:00');
INSERT INTO `cate` VALUES ('7', '333', '44', '1', '0000-00-00 00:00:00');
INSERT INTO `cate` VALUES ('8', 'ee', 'e', '1', '0000-00-00 00:00:00');
INSERT INTO `cate` VALUES ('9', 'ee', 'eee', '1', '2012-06-10 18:12:11');
INSERT INTO `cate` VALUES ('10', '鹅鹅', '鹅鹅', '1', '2012-06-10 18:50:17');
INSERT INTO `member` VALUES ('2', '2', '', '0', null);
INSERT INTO `member` VALUES ('3', '3', '', '0', null);
INSERT INTO `member` VALUES ('4', '34', '', '0', null);
INSERT INTO `member` VALUES ('5', 'admin', '11', '1', null);
INSERT INTO `member` VALUES ('6', '134', '123', '1', null);
INSERT INTO `member` VALUES ('7', 'rrr', 'rrr', '1', null);
INSERT INTO `member` VALUES ('8', 'qqq', 'qqq', '1', null);
INSERT INTO `member` VALUES ('9', 'admin', '1111', '1', null);
INSERT INTO `member` VALUES ('10', 'admin', '4444', '1', null);
INSERT INTO `member` VALUES ('11', 'admin', '4444', '1', null);
INSERT INTO `member` VALUES ('12', 'admin', '1', '1', null);
INSERT INTO `member` VALUES ('13', 'admin', '1', '1', null);
INSERT INTO `member` VALUES ('14', 'admin', '1', '1', null);
INSERT INTO `member` VALUES ('15', 'admin', '1', '1', null);
INSERT INTO `member` VALUES ('16', 'admin', '333', '1', null);
INSERT INTO `quotation` VALUES ('1', '22', '报价单', '德国弟威思', '23021', '2', '4f6d736dac836.jpg', '1', '2012-06-10 18:24:30', '1', null, null, null, null, null, null, null);
INSERT INTO `quotation` VALUES ('5', '2', '报价单', '德国弟威思', '11', '2', '4f635f24ca89f.jpg', '1', '2012-06-10 18:24:31', '1', null, null, null, null, null, null, null);
INSERT INTO `quotation` VALUES ('6', '6', '报价单', '美国TOPCO', 'ee', '3', '4f6367f2bb220.jpg', '1', '2012-06-10 18:24:32', '1', null, null, null, null, null, null, null);
INSERT INTO `quotation` VALUES ('7', '5', '报价单', '以比赞', '1112123', '17', '4f6370f73c166.jpg', '1', '2012-06-10 18:24:33', '1', null, null, null, null, null, null, null);
INSERT INTO `quotation` VALUES ('15', '8', '报价单', 'SkinSation', 'gggg', '6', '4f6375c584839.jpg', '1', '2012-06-10 18:24:34', '1', null, null, null, null, null, null, null);
INSERT INTO `quotation` VALUES ('9', '5', '报价单', '以比赞', '1112123', '16', '4f637250c65c8.jpg', '1', '2012-06-10 18:24:35', '1', null, null, null, null, null, null, null);
INSERT INTO `quotation` VALUES ('10', '8', '报价单', '以比赞', 'wowocai', '16', '4f63727f66342.jpg', '1', '2012-06-10 18:24:36', '1', null, null, null, null, null, null, null);
INSERT INTO `quotation` VALUES ('14', '6', '报价单', '爱侣', '我的参评', '7', '4f6375ac4ee64.jpg', '1', '2012-06-10 18:24:37', '1', null, null, null, null, null, null, null);
INSERT INTO `quotation` VALUES ('12', '9', '报价单', '爱侣', 'tttt', '7', '4f6372bfad8e6.jpg', '1', '2012-06-10 18:24:40', '1', null, null, null, null, null, null, null);
INSERT INTO `quotation` VALUES ('13', '15', '报价单', '美国TOPCO', 'fffff', '3', '4f63733258ee4.jpg', '1', '2012-06-10 18:24:42', '1', null, null, null, null, null, null, null);
INSERT INTO `quotation` VALUES ('16', '6', '报价单', '以比赞', '333', '17', '4f637a8ca842b.jpg', '1', '2012-06-10 18:24:43', '1', null, null, null, null, null, null, null);
INSERT INTO `quotation` VALUES ('17', '22', '报价单', 'SkinSation', '111', '6', '4f956df02bc42.jpg', '1', '2012-06-10 18:24:45', '1', null, null, null, null, null, null, null);
INSERT INTO `quotation` VALUES ('20', '0', '5555', '以比赞', '', '17', '', '1', '2012-06-10 18:24:49', '1', null, null, null, null, null, null, null);
INSERT INTO `quotation` VALUES ('23', '3', '333', '美国TOPCO2', '11|444|2222|33|3|333|ee|ee|鹅鹅', '3', '', '1', '2012-06-10 22:09:09', '1', null, null, null, null, null, null, null);
INSERT INTO `quotation` VALUES ('24', '0', '5555', '以比赞', '', '17', '4fd4ab4f17f9b.raR', '1', '2012-06-10 22:12:31', '1', null, null, null, null, null, null, null);
INSERT INTO `quotation` VALUES ('25', '3', 'eeee', '以比赞', '11|444', '16', '4fd72a7874a8b.raR', '1', '2012-06-12 19:39:36', '1', 'ee', 'ee', 'ee', 'eee', null, null, null);
INSERT INTO `user` VALUES ('1', 'admin', '22');
