-- ----------------------------------------------------------------------------
-- MySQL Workbench Migration
-- Migrated Schemata: test4
-- Source Schemata: test
-- Created: Thu May 15 23:50:05 2014
-- ----------------------------------------------------------------------------

SET FOREIGN_KEY_CHECKS = 0;;

-- ----------------------------------------------------------------------------
-- Schema test4
-- ----------------------------------------------------------------------------
DROP SCHEMA IF EXISTS `test4` ;
CREATE SCHEMA IF NOT EXISTS `test4` ;

-- ----------------------------------------------------------------------------
-- Table test4.auebnexusaccounts
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `test4`.`auebnexusaccounts` (
  `userID` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `firstName` VARCHAR(20) NULL DEFAULT NULL,
  `lastName` VARCHAR(30) NULL DEFAULT NULL,
  `credID` BIGINT(20) UNSIGNED NOT NULL,
  `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login` DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`userID`),
  INDEX `credID` (`credID` ASC),
  CONSTRAINT `auebnexusaccounts_ibfk_1`
    FOREIGN KEY (`credID`)
    REFERENCES `test4`.`credentials` (`credID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

-- ----------------------------------------------------------------------------
-- Table test4.credentials
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `test4`.`credentials` (
  `credID` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `login` VARCHAR(40) NOT NULL,
  `password` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`credID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

-- ----------------------------------------------------------------------------
-- Table test4.eclassaccounts
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `test4`.`eclassaccounts` (
  `eclassID` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `credID` BIGINT(20) UNSIGNED NOT NULL,
  `userID` BIGINT(20) UNSIGNED NOT NULL,
  PRIMARY KEY (`eclassID`),
  UNIQUE INDEX `credID` (`credID` ASC),
  UNIQUE INDEX `userID` (`userID` ASC),
  CONSTRAINT `eclassaccounts_ibfk_1`
    FOREIGN KEY (`credID`)
    REFERENCES `test4`.`credentials` (`credID`),
  CONSTRAINT `eclassaccounts_ibfk_2`
    FOREIGN KEY (`userID`)
    REFERENCES `test4`.`auebnexusaccounts` (`userID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

-- ----------------------------------------------------------------------------
-- Table test4.eclassacctocourses
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `test4`.`eclassacctocourses` (
  `courseID` BIGINT(10) UNSIGNED NOT NULL,
  `eclassID` BIGINT(20) UNSIGNED NOT NULL,
  PRIMARY KEY (`courseID`, `eclassID`),
  INDEX `eclassID` (`eclassID` ASC),
  INDEX `courseID_eclassID` (`courseID` ASC, `eclassID` ASC),
  CONSTRAINT `eclassacctocourses_ibfk_1`
    FOREIGN KEY (`courseID`)
    REFERENCES `test4`.`eclasscourses` (`courseID`),
  CONSTRAINT `eclassacctocourses_ibfk_2`
    FOREIGN KEY (`eclassID`)
    REFERENCES `test4`.`eclassaccounts` (`eclassID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

-- ----------------------------------------------------------------------------
-- Table test4.eclasscourses
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `test4`.`eclasscourses` (
  `courseID` BIGINT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `courseCode` VARCHAR(10) NULL DEFAULT NULL,
  `courseName` VARCHAR(30) NULL DEFAULT NULL,
  `courseDepartment` VARCHAR(30) NULL DEFAULT NULL,
  `courseUrl` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`courseID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

-- ----------------------------------------------------------------------------
-- Table test4.eclassposts
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `test4`.`eclassposts` (
  `postID` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(30) NULL DEFAULT NULL,
  `publicationDate` DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00',
  `deadlineDate` DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00',
  `content` VARCHAR(255) NULL DEFAULT NULL,
  `type` VARCHAR(30) NULL DEFAULT NULL,
  `courseID` BIGINT(10) UNSIGNED NOT NULL,
  `postUrl` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`postID`),
  UNIQUE INDEX `courseID` (`courseID` ASC),
  CONSTRAINT `eclassposts_ibfk_1`
    FOREIGN KEY (`courseID`)
    REFERENCES `test4`.`eclasscourses` (`courseID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

-- ----------------------------------------------------------------------------
-- Table test4.egrammateiaaccounts
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `test4`.`egrammateiaaccounts` (
  `egrammateiaID` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `credID` BIGINT(20) UNSIGNED NOT NULL,
  `userID` BIGINT(20) UNSIGNED NOT NULL,
  PRIMARY KEY (`egrammateiaID`),
  UNIQUE INDEX `credID` (`credID` ASC),
  UNIQUE INDEX `userID` (`userID` ASC),
  CONSTRAINT `egrammateiaaccounts_ibfk_1`
    FOREIGN KEY (`credID`)
    REFERENCES `test4`.`credentials` (`credID`),
  CONSTRAINT `egrammateiaaccounts_ibfk_2`
    FOREIGN KEY (`userID`)
    REFERENCES `test4`.`auebnexusaccounts` (`userID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

-- ----------------------------------------------------------------------------
-- Table test4.venusaccounts
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `test4`.`venusaccounts` (
  `venusID` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `credID` BIGINT(20) UNSIGNED NOT NULL,
  `userID` BIGINT(20) UNSIGNED NOT NULL,
  PRIMARY KEY (`venusID`),
  UNIQUE INDEX `credID` (`credID` ASC),
  UNIQUE INDEX `userID` (`userID` ASC),
  CONSTRAINT `venusaccounts_ibfk_1`
    FOREIGN KEY (`credID`)
    REFERENCES `test4`.`credentials` (`credID`),
  CONSTRAINT `venusaccounts_ibfk_2`
    FOREIGN KEY (`userID`)
    REFERENCES `test4`.`auebnexusaccounts` (`userID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

-- ----------------------------------------------------------------------------
-- Routine test4.authenticateEclass
-- ----------------------------------------------------------------------------
DELIMITER $$

DELIMITER $$
USE `test4`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `authenticateEclass`(IN username VARCHAR(40), IN pass VARCHAR(50), OUT result BOOL)
BEGIN
  SELECT count(*) INTO  result
    FROM `Credentials` INNER JOIN `EclassAccounts`
	ON `Credentials`.credID = `EclassAccounts`.credID
	WHERE `Credentials`.login = username AND 
		  `Credentials`.password = pass;
END$$

DELIMITER ;

-- ----------------------------------------------------------------------------
-- Routine test4.authenticateGrammateia
-- ----------------------------------------------------------------------------
DELIMITER $$

DELIMITER $$
USE `test4`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `authenticateGrammateia`(IN username VARCHAR(40), IN pass VARCHAR(50), OUT result BOOL)
BEGIN
  SELECT count(*) INTO  result
    FROM `Credentials` INNER JOIN `EGrammateiaAccounts`
	ON `Credentials`.credID = `EGrammateiaAccounts`.credID
	WHERE `Credentials`.login = username AND 
		  `Credentials`.password = pass;
END$$

DELIMITER ;

-- ----------------------------------------------------------------------------
-- Routine test4.authenticateNexus
-- ----------------------------------------------------------------------------
DELIMITER $$

DELIMITER $$
USE `test4`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `authenticateNexus`(IN username VARCHAR(40), IN pass VARCHAR(50), OUT result BOOL)
BEGIN
  SELECT count(*) INTO  result
    FROM `Credentials` INNER JOIN `AuebNexusAccounts`
	ON `Credentials`.credID = `AuebNexusAccounts`.credID
	WHERE `Credentials`.login = username AND 
		  `Credentials`.password = pass;
END$$

DELIMITER ;

-- ----------------------------------------------------------------------------
-- Routine test4.authenticateVenus
-- ----------------------------------------------------------------------------
DELIMITER $$

DELIMITER $$
USE `test4`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `authenticateVenus`(IN username VARCHAR(40), IN pass VARCHAR(50), OUT result BOOL)
BEGIN
  SELECT count(*) INTO  result
    FROM `Credentials` INNER JOIN `VenusAccounts`
	ON `Credentials`.credID = `VenusAccounts`.credID
	WHERE `Credentials`.login = username AND 
		  `Credentials`.password = pass;
END$$

DELIMITER ;

-- ----------------------------------------------------------------------------
-- Routine test4.changeEclassPass
-- ----------------------------------------------------------------------------
DELIMITER $$

DELIMITER $$
USE `test4`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `changeEclassPass`(IN userID BIGINT, IN newPass VARCHAR(50))
    MODIFIES SQL DATA
BEGIN
	UPDATE `Credentials` 
	INNER JOIN `EclassAccounts`
	ON `Credentials`.credID = `EclassAccounts`.credID
	SET `Credentials`.password = newPass
	WHERE `EclassAccounts`.userID = userID;
END$$

DELIMITER ;

-- ----------------------------------------------------------------------------
-- Routine test4.changeGrammateiaPass
-- ----------------------------------------------------------------------------
DELIMITER $$

DELIMITER $$
USE `test4`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `changeGrammateiaPass`(IN userID BIGINT, IN newPass VARCHAR(50))
    MODIFIES SQL DATA
BEGIN
	UPDATE `Credentials` 
	INNER JOIN `EGrammateiaAccounts`
	ON `Credentials`.credID = `EGrammateiaAccounts`.credID
	SET `Credentials`.password = newPass
	WHERE `EGrammateiaAccounts`.userID = userID;
END$$

DELIMITER ;

-- ----------------------------------------------------------------------------
-- Routine test4.changeNexusPass
-- ----------------------------------------------------------------------------
DELIMITER $$

DELIMITER $$
USE `test4`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `changeNexusPass`(IN userID BIGINT, IN newPass VARCHAR(50))
    MODIFIES SQL DATA
BEGIN
	UPDATE `Credentials` 
	INNER JOIN `AuebNexusAccounts`
	ON `Credentials`.credID = `AuebNexusAccounts`.credID
	SET `Credentials`.password = newPass
	WHERE `AuebNexusAccounts`.userID = userID;
END$$

DELIMITER ;

-- ----------------------------------------------------------------------------
-- Routine test4.changeVenusPass
-- ----------------------------------------------------------------------------
DELIMITER $$

DELIMITER $$
USE `test4`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `changeVenusPass`(IN userID BIGINT, IN newPass VARCHAR(50))
    MODIFIES SQL DATA
BEGIN
	UPDATE `Credentials` 
	INNER JOIN `VenusAccounts`
	ON `Credentials`.credID = `VenusAccounts`.credID
	SET `Credentials`.password = newPass
	WHERE `VenusAccounts`.userID = userID;
END$$

DELIMITER ;

-- ----------------------------------------------------------------------------
-- Routine test4.connectToEclass
-- ----------------------------------------------------------------------------
DELIMITER $$

DELIMITER $$
USE `test4`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `connectToEclass`(
							 IN userID BIGINT,
							 IN username VARCHAR(40),
							 IN pass VARCHAR(50))
    MODIFIES SQL DATA
BEGIN	
	DECLARE credId bigint;

	INSERT INTO `Credentials` (`login`, `password`)
	VALUES (username, pass);

	SET credId = LAST_INSERT_ID();

	INSERT INTO `EclassAccounts` (`credID`, `userID`)
	VALUES (credID, userID);

END$$

DELIMITER ;

-- ----------------------------------------------------------------------------
-- Routine test4.connectToEGrammateia
-- ----------------------------------------------------------------------------
DELIMITER $$

DELIMITER $$
USE `test4`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `connectToEGrammateia`(
							 IN userID BIGINT,
							 IN username VARCHAR(40),
							 IN pass VARCHAR(50))
    MODIFIES SQL DATA
BEGIN	
	DECLARE credId bigint;

	INSERT INTO `Credentials` (`login`, `password`)
	VALUES (username, pass);

	SET credId = LAST_INSERT_ID();

	INSERT INTO `EGrammateiaAccounts` (`credID`, `userID`)
	VALUES (credID, userID);

END$$

DELIMITER ;

-- ----------------------------------------------------------------------------
-- Routine test4.connectToVenus
-- ----------------------------------------------------------------------------
DELIMITER $$

DELIMITER $$
USE `test4`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `connectToVenus`(
							 IN userID BIGINT,
							 IN username VARCHAR(40),
							 IN pass VARCHAR(50))
    MODIFIES SQL DATA
BEGIN	
	DECLARE credId bigint;

	INSERT INTO `Credentials` (`login`, `password`)
	VALUES (username, pass);

	SET credId = LAST_INSERT_ID();

	INSERT INTO `VenusAccounts` (`credID`, `userID`)
	VALUES (credID, userID);

END$$

DELIMITER ;

-- ----------------------------------------------------------------------------
-- Routine test4.logout
-- ----------------------------------------------------------------------------
DELIMITER $$

DELIMITER $$
USE `test4`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `logout`(IN userID bigint)
BEGIN
	UPDATE `AuebNexusAccount` AS ana
	SET ana.lastlogin = NOW()
	WHERE ana.userID = userID;
END$$

DELIMITER ;

-- ----------------------------------------------------------------------------
-- Routine test4.register
-- ----------------------------------------------------------------------------
DELIMITER $$

DELIMITER $$
USE `test4`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `register`(IN firstName VARCHAR(20),
							 IN lastName VARCHAR(30),
							 IN username VARCHAR(40),
							 IN pass VARCHAR(50))
    MODIFIES SQL DATA
BEGIN	
	DECLARE credId bigint;

	INSERT INTO `Credentials` (`login`, `password`)
	VALUES (username, pass);

	SET credId = LAST_INSERT_ID();

	INSERT INTO `AuebNexusAccounts` (`firstName`,
										`lastName`,
										`credID`)
	VALUES (firstName, lastName, credId);

END$$

DELIMITER ;
SET FOREIGN_KEY_CHECKS = 1;;
