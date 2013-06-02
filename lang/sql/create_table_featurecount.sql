DROP TABLE IF EXISTS `geolib`.`featurecount`;
CREATE TABLE  `geolib`.`featurecount` (
  `feature` varchar(255) NOT NULL,
  `category` varchar(64) NOT NULL DEFAULT 'unknown',
  `count` BIGINT unsigned DEFAULT '0',
  PRIMARY KEY (`feature`,`category`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;