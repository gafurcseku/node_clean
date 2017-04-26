CREATE TABLE IF NOT EXISTS `serviceholder` (
`userID` int(11) NOT NULL AUTO_INCREMENT,
`userName` varchar(100) NOT NULL,
`userEmail` varchar(100) NOT NULL UNIQUE,
`userPass` varchar(100) NOT NULL,
`userPhone` varchar(100) NOT NULL,
PRIMARY KEY (`userID`)
)
