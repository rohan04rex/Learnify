-- Learnify Full Database Dump
-- Generated on 2026-03-20 03:50:26.101439

SET FOREIGN_KEY_CHECKS = 0;

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
  ('Admin User', 'admin@learnify.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

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


-- Data for table `users`
INSERT INTO `users` (`UserID`, `Name`, `Email`, `PasswordHash`, `Role`, `Interests`, `CreatedAt`) VALUES (1, 'Admin User', 'admin@learnify.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', NULL, '2026-03-20 02:02:40');
INSERT INTO `users` (`UserID`, `Name`, `Email`, `PasswordHash`, `Role`, `Interests`, `CreatedAt`) VALUES (2, 'Mourique Naskar', 'naskarmourique@gmail.com', '$2y$10$K6N4YfvAVmrrcD7nMMsde.kwawtQRyFOioztmq.klb5K890QOWYo.', 'student', NULL, '2026-03-20 02:07:32');
INSERT INTO `users` (`UserID`, `Name`, `Email`, `PasswordHash`, `Role`, `Interests`, `CreatedAt`) VALUES (3, 'Rohan Ghosh', 'parkcircus@gmail.com', '$2y$10$3vlNrLAoEWZBRtvpgrmwP.Wpf4MrET7MLDmncBuEGFfoKy2wR4eAa', 'student', NULL, '2026-03-20 02:54:25');

-- Data for table `courses`
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (1, 'Full Stack Web Development', 'Development', 'Dr. Angela Yu', 899.00, 'Active', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600', 'Learn HTML, CSS, JS, Node, React, and MongoDB.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (2, 'Python for Data Science', 'AI & Data Science', 'Jose Portilla', 799.00, 'Active', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600', 'Python for data analysis and visualization.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (3, 'Modern React with Redux', 'Development', 'Stephen Grider', 699.00, 'Active', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600', 'Master React and Redux.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (4, 'The Web Developer Bootcamp', 'Development', 'Colt Steele', 999.00, 'Active', 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600', 'The only course you need to learn web development.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (5, 'Angular - The Complete Guide', 'Development', 'Maximilian Schwarzmüller', 849.00, 'Active', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600', 'Master Angular (formerly Angular 2).', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (6, 'Machine Learning A-Z', 'AI & Data Science', 'Kirill Eremenko', 1299.00, 'Active', 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600', 'Hands-on Machine Learning.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (7, 'Deep Learning with Keras', 'AI & Data Science', 'Andrew Ng', 1499.00, 'Active', 'https://images.unsplash.com/photo-1509228468518-180dd4805a44?w=600', 'Neural networks using Keras and TensorFlow.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (8, 'UI/UX Design Masterclass', 'Design', 'Gary Simon', 799.00, 'Active', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600', 'Design great user interfaces.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (9, 'Digital Marketing 2024', 'Marketing', 'Phil Ebiner', 499.00, 'Active', 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600', 'SEO, Social Media, and more.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (10, 'An Entire MBA in 1 Course', 'Business', 'Chris Haroun', 1999.00, 'Active', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600', 'Business management and strategy.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (11, 'Mastering AI & Data Science 11', 'AI & Data Science', 'Brad Traversy', 1583.00, 'Active', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600', 'Comprehensive guide to AI & Data Science taught by Brad Traversy. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (12, 'Mastering Marketing 12', 'Marketing', 'Brad Traversy', 1537.00, 'Active', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600', 'Comprehensive guide to Marketing taught by Brad Traversy. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (13, 'Mastering Photography 13', 'Photography', 'Maximilian Schwarzmüller', 1041.00, 'Active', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600', 'Comprehensive guide to Photography taught by Maximilian Schwarzmüller. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (14, 'Mastering Development 14', 'Development', 'Brad Traversy', 1382.00, 'Active', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600', 'Comprehensive guide to Development taught by Brad Traversy. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (15, 'Mastering Development 15', 'Development', 'Brad Traversy', 771.00, 'Active', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600', 'Comprehensive guide to Development taught by Brad Traversy. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (16, 'Mastering Lifestyle 16', 'Lifestyle', 'Andrew Ng', 382.00, 'Active', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600', 'Comprehensive guide to Lifestyle taught by Andrew Ng. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (17, 'Mastering Office Productivity 17', 'Office Productivity', 'Brad Traversy', 631.00, 'Active', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600', 'Comprehensive guide to Office Productivity taught by Brad Traversy. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (18, 'Mastering Development 18', 'Development', 'Gary Simon', 1127.00, 'Active', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600', 'Comprehensive guide to Development taught by Gary Simon. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (19, 'Mastering Photography 19', 'Photography', 'Brad Traversy', 1009.00, 'Active', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600', 'Comprehensive guide to Photography taught by Brad Traversy. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (20, 'Mastering Marketing 20', 'Marketing', 'Maximilian Schwarzmüller', 1597.00, 'Active', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600', 'Comprehensive guide to Marketing taught by Maximilian Schwarzmüller. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (21, 'Mastering Office Productivity 21', 'Office Productivity', 'Jose Portilla', 866.00, 'Active', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600', 'Comprehensive guide to Office Productivity taught by Jose Portilla. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (22, 'Mastering Photography 22', 'Photography', 'Jose Portilla', 602.00, 'Active', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600', 'Comprehensive guide to Photography taught by Jose Portilla. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (23, 'Mastering Development 23', 'Development', 'Colt Steele', 404.00, 'Active', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600', 'Comprehensive guide to Development taught by Colt Steele. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (24, 'Mastering Health & Fitness 24', 'Health & Fitness', 'Nathan House', 1375.00, 'Active', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600', 'Comprehensive guide to Health & Fitness taught by Nathan House. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (25, 'Mastering Marketing 25', 'Marketing', 'Chris Haroun', 1295.00, 'Active', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600', 'Comprehensive guide to Marketing taught by Chris Haroun. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (26, 'Mastering Personal Development 26', 'Personal Development', 'Jose Portilla', 1339.00, 'Active', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600', 'Comprehensive guide to Personal Development taught by Jose Portilla. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (27, 'Mastering Marketing 27', 'Marketing', 'Nathan House', 479.00, 'Active', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600', 'Comprehensive guide to Marketing taught by Nathan House. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (28, 'Mastering Music 28', 'Music', 'Maximilian Schwarzmüller', 1417.00, 'Active', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600', 'Comprehensive guide to Music taught by Maximilian Schwarzmüller. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (29, 'Mastering Health & Fitness 29', 'Health & Fitness', 'Gary Simon', 1236.00, 'Active', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600', 'Comprehensive guide to Health & Fitness taught by Gary Simon. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (30, 'Mastering Marketing 30', 'Marketing', 'Brad Traversy', 860.00, 'Active', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600', 'Comprehensive guide to Marketing taught by Brad Traversy. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (31, 'Mastering Photography 31', 'Photography', 'Gary Simon', 841.00, 'Active', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600', 'Comprehensive guide to Photography taught by Gary Simon. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (32, 'Mastering Finance 32', 'Finance', 'Dr. Angela Yu', 814.00, 'Active', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600', 'Comprehensive guide to Finance taught by Dr. Angela Yu. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (33, 'Mastering AI & Data Science 33', 'AI & Data Science', 'Gary Simon', 1572.00, 'Active', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600', 'Comprehensive guide to AI & Data Science taught by Gary Simon. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (34, 'Mastering Design 34', 'Design', 'Colt Steele', 341.00, 'Active', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600', 'Comprehensive guide to Design taught by Colt Steele. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (35, 'Mastering Music 35', 'Music', 'Chris Haroun', 299.00, 'Active', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600', 'Comprehensive guide to Music taught by Chris Haroun. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (36, 'Mastering Finance 36', 'Finance', 'Maximilian Schwarzmüller', 325.00, 'Active', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600', 'Comprehensive guide to Finance taught by Maximilian Schwarzmüller. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (37, 'Mastering Design 37', 'Design', 'Phil Ebiner', 1130.00, 'Active', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600', 'Comprehensive guide to Design taught by Phil Ebiner. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (38, 'Mastering Photography 38', 'Photography', 'Phil Ebiner', 1207.00, 'Active', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600', 'Comprehensive guide to Photography taught by Phil Ebiner. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (39, 'Mastering Development 39', 'Development', 'Rob Percival', 629.00, 'Active', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600', 'Comprehensive guide to Development taught by Rob Percival. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (40, 'Mastering Lifestyle 40', 'Lifestyle', 'Jose Portilla', 1315.00, 'Active', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600', 'Comprehensive guide to Lifestyle taught by Jose Portilla. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (41, 'Mastering Finance 41', 'Finance', 'Colt Steele', 1351.00, 'Active', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600', 'Comprehensive guide to Finance taught by Colt Steele. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (42, 'Mastering AI & Data Science 42', 'AI & Data Science', 'Chris Haroun', 1320.00, 'Active', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600', 'Comprehensive guide to AI & Data Science taught by Chris Haroun. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (43, 'Mastering Finance 43', 'Finance', 'Kirill Eremenko', 468.00, 'Active', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600', 'Comprehensive guide to Finance taught by Kirill Eremenko. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (44, 'Mastering Personal Development 44', 'Personal Development', 'Jose Portilla', 505.00, 'Active', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600', 'Comprehensive guide to Personal Development taught by Jose Portilla. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (45, 'Mastering Lifestyle 45', 'Lifestyle', 'Maximilian Schwarzmüller', 603.00, 'Active', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600', 'Comprehensive guide to Lifestyle taught by Maximilian Schwarzmüller. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (46, 'Mastering Business 46', 'Business', 'Brad Traversy', 343.00, 'Active', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600', 'Comprehensive guide to Business taught by Brad Traversy. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (47, 'Mastering Marketing 47', 'Marketing', 'Jose Portilla', 1141.00, 'Active', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600', 'Comprehensive guide to Marketing taught by Jose Portilla. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (48, 'Mastering Music 48', 'Music', 'Maximilian Schwarzmüller', 1358.00, 'Active', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600', 'Comprehensive guide to Music taught by Maximilian Schwarzmüller. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (49, 'Mastering Lifestyle 49', 'Lifestyle', 'Rob Percival', 1101.00, 'Active', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600', 'Comprehensive guide to Lifestyle taught by Rob Percival. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (50, 'Mastering Music 50', 'Music', 'Chris Haroun', 581.00, 'Active', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600', 'Comprehensive guide to Music taught by Chris Haroun. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (51, 'Mastering Business 51', 'Business', 'Nathan House', 1508.00, 'Active', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600', 'Comprehensive guide to Business taught by Nathan House. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (52, 'Mastering Marketing 52', 'Marketing', 'Maximilian Schwarzmüller', 1233.00, 'Active', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600', 'Comprehensive guide to Marketing taught by Maximilian Schwarzmüller. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (53, 'Mastering AI & Data Science 53', 'AI & Data Science', 'Kirill Eremenko', 773.00, 'Active', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600', 'Comprehensive guide to AI & Data Science taught by Kirill Eremenko. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (54, 'Mastering Development 54', 'Development', 'Nathan House', 698.00, 'Active', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600', 'Comprehensive guide to Development taught by Nathan House. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (55, 'Mastering Finance 55', 'Finance', 'Brad Traversy', 1024.00, 'Active', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600', 'Comprehensive guide to Finance taught by Brad Traversy. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (56, 'Mastering Office Productivity 56', 'Office Productivity', 'Chris Haroun', 1003.00, 'Active', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600', 'Comprehensive guide to Office Productivity taught by Chris Haroun. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (57, 'Mastering Photography 57', 'Photography', 'Andrew Ng', 584.00, 'Active', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600', 'Comprehensive guide to Photography taught by Andrew Ng. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (58, 'Mastering Development 58', 'Development', 'Rob Percival', 459.00, 'Active', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600', 'Comprehensive guide to Development taught by Rob Percival. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (59, 'Mastering Development 59', 'Development', 'Colt Steele', 1548.00, 'Active', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600', 'Comprehensive guide to Development taught by Colt Steele. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (60, 'Mastering Lifestyle 60', 'Lifestyle', 'Gary Simon', 1364.00, 'Active', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600', 'Comprehensive guide to Lifestyle taught by Gary Simon. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (61, 'Mastering Business 61', 'Business', 'Jose Portilla', 1321.00, 'Active', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600', 'Comprehensive guide to Business taught by Jose Portilla. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (62, 'Mastering Business 62', 'Business', 'Dr. Angela Yu', 1516.00, 'Active', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600', 'Comprehensive guide to Business taught by Dr. Angela Yu. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (63, 'Mastering Development 63', 'Development', 'Jose Portilla', 825.00, 'Active', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600', 'Comprehensive guide to Development taught by Jose Portilla. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (64, 'Mastering Photography 64', 'Photography', 'Phil Ebiner', 1287.00, 'Active', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600', 'Comprehensive guide to Photography taught by Phil Ebiner. Build real-world projects and gain skills.', '2026-03-20 02:56:22');
INSERT INTO `courses` (`CourseID`, `CourseName`, `Category`, `Instructor`, `Price`, `Status`, `Image`, `Description`, `CreatedAt`) VALUES (65, 'Mastering Development 65', 'Development', 'Rob Percival', 661.00, 'Active', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600', 'Comprehensive guide to Development taught by Rob Percival. Build real-world projects and gain skills.', '2026-03-20 02:56:22');

-- Data for table `enrollments`
INSERT INTO `enrollments` (`EnrollmentID`, `UserID`, `CourseID`, `EnrolledAt`) VALUES (1, 2, 1, '2026-03-20 02:07:50');
INSERT INTO `enrollments` (`EnrollmentID`, `UserID`, `CourseID`, `EnrolledAt`) VALUES (3, 2, 6, '2026-03-20 02:49:14');
INSERT INTO `enrollments` (`EnrollmentID`, `UserID`, `CourseID`, `EnrolledAt`) VALUES (4, 3, 12, '2026-03-20 02:54:54');
INSERT INTO `enrollments` (`EnrollmentID`, `UserID`, `CourseID`, `EnrolledAt`) VALUES (5, 3, 1, '2026-03-20 02:54:56');
INSERT INTO `enrollments` (`EnrollmentID`, `UserID`, `CourseID`, `EnrolledAt`) VALUES (7, 2, 52, '2026-03-20 03:36:36');
INSERT INTO `enrollments` (`EnrollmentID`, `UserID`, `CourseID`, `EnrolledAt`) VALUES (9, 2, 27, '2026-03-20 03:36:38');

SET FOREIGN_KEY_CHECKS = 1;