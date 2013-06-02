DROP TABLE IF EXISTS `geolib`.`categorycount`;
CREATE TABLE  `geolib`.`categorycount` (
  `category` varchar(64) NOT NULL DEFAULT 'unknown',
  `count` BIGINT unsigned DEFAULT '0',
  PRIMARY KEY (`category`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;