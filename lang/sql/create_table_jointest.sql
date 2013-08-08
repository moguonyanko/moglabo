DROP TABLE IF EXISTS `mapattribute`; 
CREATE TABLE `mapattribute` (
	`featureid` varchar(64) NOT NULL,
	`attribute` varchar(255),
	PRIMARY KEY (`featureid`, `attribute`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO mapattribute VALUES ('0', 'usao');
INSERT INTO mapattribute VALUES ('1', 'wanwan');
INSERT INTO mapattribute VALUES ('2', 'nekoneko');
INSERT INTO mapattribute VALUES ('100', 'modi');

DROP TABLE IF EXISTS `mapprimitive`; 
CREATE TABLE `mapprimitive` (
	`featureid` varchar(64) NOT NULL,
	`coords` varchar(255),
	PRIMARY KEY (`featureid`, `coords`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO mapprimitive VALUES ('0', '0,0_0,0_0,0');
INSERT INTO mapprimitive VALUES ('1', '30,2_45,55_-100,0');
INSERT INTO mapprimitive VALUES ('2', '0,1_10,2_2,4');
INSERT INTO mapprimitive VALUES ('50', '-24,111_112,-45_100,200');


