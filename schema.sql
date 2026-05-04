-- =====================================================
--  Learnify DB Schema
--  Module 4: Database Design
--  Tables: users, courses, enrollments, results
-- =====================================================

CREATE DATABASE IF NOT EXISTS `learnify_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `learnify_db`;

-- -------------------------------------------------------
-- 1. users
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `UserID`       INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `Name`         VARCHAR(100) NOT NULL,
  `Email`        VARCHAR(150) NOT NULL,
  `PasswordHash` VARCHAR(255) NOT NULL,
  `Role`         ENUM('admin','student') NOT NULL DEFAULT 'student',
  `Interests`    VARCHAR(255) DEFAULT NULL COMMENT 'Comma-separated interests for AI recommendations',
  `CreatedAt`    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `uq_email` (`Email`)
) ENGINE=InnoDB;

-- Default admin account  password: admin123
INSERT INTO `users` (`Name`, `Email`, `PasswordHash`, `Role`) VALUES
  ('Admin User', 'admin@learnify.com', '$2y$10$mTc1Pf7poFM2EZtc5hJ5XeEn.UZa013hyes5TW2D6eMjY6CAFqoX6', 'admin');

-- -------------------------------------------------------
-- 2. courses
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS `courses` (
  `CourseID`    INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `CourseName`  VARCHAR(200) NOT NULL,
  `Category`    VARCHAR(100) NOT NULL,
  `Instructor`  VARCHAR(150) NOT NULL,
  `Price`       DECIMAL(8,2) NOT NULL DEFAULT 0.00,
  `Status`      ENUM('Active','Draft') NOT NULL DEFAULT 'Active',
  `Image`       VARCHAR(500) DEFAULT NULL,
  `Description` TEXT DEFAULT NULL,
  `CreatedAt`   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`CourseID`)
) ENGINE=InnoDB;

-- Sample courses
INSERT INTO `courses` (`CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`) VALUES
  ('Complete Web Development Bootcamp', 'Development',      'Dr. Angela Yu',      499.00, 'Active', 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600'),
  ('Machine Learning A-Z', 'AI & Data Science',            'Kirill Eremenko',    649.00, 'Active', 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600'),
  ('UI/UX Design Masterclass 2024', 'Design',              'Gary Simon',         549.00, 'Draft',  'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600'),
  ('Complete Digital Marketing', 'Marketing',              'Rob Percival',        399.00, 'Active', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600'),
  ('iOS & Swift - Complete iOS App', 'Mobile',             'Dr. Angela Yu',      599.00, 'Active', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600');

-- -------------------------------------------------------
-- 3. enrollments
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS `enrollments` (
  `EnrollmentID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `UserID`       INT UNSIGNED NOT NULL,
  `CourseID`     INT UNSIGNED NOT NULL,
  `EnrolledAt`   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`EnrollmentID`),
  UNIQUE KEY `uq_user_course` (`UserID`, `CourseID`),
  CONSTRAINT `fk_enroll_user`   FOREIGN KEY (`UserID`)   REFERENCES `users`(`UserID`)   ON DELETE CASCADE,
  CONSTRAINT `fk_enroll_course` FOREIGN KEY (`CourseID`) REFERENCES `courses`(`CourseID`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -------------------------------------------------------
-- 4. results
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS `results` (
  `ResultID`       INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `EnrollmentID`   INT UNSIGNED NOT NULL,
  `Attendance`     TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Percentage 0-100',
  `Marks`          TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '0-100',
  `PredictedGrade` ENUM('A','B','C','Fail') DEFAULT NULL,
  `UpdatedAt`      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ResultID`),
  UNIQUE KEY `uq_enrollment` (`EnrollmentID`),
  CONSTRAINT `fk_result_enroll` FOREIGN KEY (`EnrollmentID`) REFERENCES `enrollments`(`EnrollmentID`) ON DELETE CASCADE
) ENGINE=InnoDB;
