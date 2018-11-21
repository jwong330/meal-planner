/* 

Author: Christopher Ragasa
Date Last Modified: 7/9/18
Description: Data dump for Oregon State University - CS 340 Project

*/
DROP TABLE IF EXISTS `plan_workout_junction`;
DROP TABLE IF EXISTS `log`;
DROP TABLE IF EXISTS `plans`;
DROP TABLE IF EXISTS `workouts`;



-- Table structure for table `users`
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `firstname` varchar(255) DEFAULT NULL,
    `lastname` varchar(255) DEFAULT NULL,
    `username` varchar(255) DEFAULT NULL,
    `password` varchar(255) DEFAULT NULL,
    `email` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `username` (`username`),
    UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB;

-- Dump data for table `users`
LOCK TABLES `users` WRITE;
INSERT INTO `users` (`firstname`, `lastname`, `username`, `password`, `email`) VALUES
    ('Chris', 'Ragasa', 'ragasac', 'password', 'email1@email.com'),
    ('Elon', 'Musk', 'tesla', 'password', 'email2@email.com'),
    ('TestFirst1', 'TestLast1', 'testUser1', 'password', 'email3@email.com'),
    ('TestFirst2', 'TestLast2', 'testUser2', 'password', 'email4@email.com'),
    ('TestFirst3', 'TestLast3', 'testUser3', 'password', 'email5@email.com'),
    ('TestFirst4', 'TestLast4', 'testUser4', 'password', 'email6@email.com'),
    ('TestFirst5', 'TestLast5', 'testUser5', 'password', 'email7@email.com'),
    ('TestFirst6', 'TestLast6', 'testUser6', 'password', 'email8@email.com'),
    ('TestFirst7', 'TestLast7', 'testUser7', 'password', 'email9@email.com'),
    ('TestFirst8', 'TestLast8', 'testUser8', 'password', 'email10@email.com'),
    ('Albert', 'Einstein', 'genius', 'password', 'email11@email.com');
UNLOCK TABLES;

-- Table structure for table `workouts`
CREATE TABLE `workouts` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `musclegroup` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB;

-- Dump data for table `workouts`
LOCK TABLES `workouts` WRITE;
INSERT INTO `workouts` (`name`, `musclegroup`) VALUES
    ('Deadlift', 'Back'),
    ('Pull-ups', 'Back'),
    ('Lat Pulldown', 'Back'),
    ('Chest Supported Row', 'Back'),
    ('Incline Dumbbell Curl', 'Biceps'),
    ('Cable Curl', 'Biceps'),
    ('Isolation EZ Bar Curl', 'Biceps'),
    ('Bench Press', 'Chest'),
    ('Dip', 'Chest'),
    ('Incline Bench Press', 'Chest'),
    ('Cable Fly', 'Chest'),
    ('Cable Pushdown', 'Triceps'),
    ('Close Grip Bench Press', 'Triceps'),
    ('Skullcrusher', 'Triceps'),
    ('Lateral Dumbbell Raise', 'Shoulders'),
    ('Dumbbell Overhead Press', 'Shoulders'),
    ('Reverse Pec Fly', 'Shoulders'),
    ('Facepull', 'Shoulders'),
    ('Back Squat', 'Legs'),
    ('Dumbbell Lunge', 'Legs'),
    ('Bulgarian Split Squat', 'Legs'),
    ('Standing Calf Extension', 'Legs'),
    ('Deadbug', 'Core'),
    ('Russian Twist', 'Core'),
    ('Landmine 180', 'Core'),
    ('Reverse Crunch', 'Core'),
    ('Hollow Rock', 'Core');
UNLOCK TABLES;

-- Table structure for table `plans`
CREATE TABLE `plans` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `user_id` int(11),
    PRIMARY KEY (`id`),
    CONSTRAINT `plans_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Dump data for table `plans`
LOCK TABLES `plans` WRITE;
INSERT INTO `plans` (`name`, `user_id`) VALUES
    ('Low Reps, Heavy Weight', 1),
    ('Heavy Gains', 1),
    ('10% Gains', 1),
    ('20% Gains', 1),
    ('30% Gains', 1),
    ('40% Gains', 1),
    ('999% Gains', 4),
    ('Cool Workout', 4),
    ('Best Workout', 4),
    ('Fun Workout', 4),
    ('Horrible Workout', 4),
    ('Not a workout', 4),
    ('Kinobody', 4),
    ('GregG', 4),
    ('I only do cardio', 3),
    ('What is cardio?', 1),
    ('Core Crusher', 2);
UNLOCK TABLES;

-- Table structure for `log`
CREATE TABLE `log` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `reps` int(11) DEFAULT NULL,
    `sets` int(11) DEFAULT NULL,
    `weight` int(11) DEFAULT NULL,
    `date` date DEFAULT NULL,
    `user_id` int(11),
    `workout_id` int(11),
    PRIMARY KEY (`id`),
    CONSTRAINT `log_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `log_ibfk_2` FOREIGN KEY (`workout_id`) REFERENCES `workouts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Dump data for table `log`
LOCK TABLES `log` WRITE;
INSERT INTO `log` (`reps`, `sets`, `weight`, `date`, `user_id`, `workout_id`) VALUES
    (10, 3, 50, '2018-07-10', 1, 8),
    (6, 4, 50, '2018-07-10', 2, 8),
    (6, 4, 12, '2018-07-10', 2, 8),
    (6, 4, 13, '2018-07-10', 2, 8),
    (6, 4, 15, '2018-07-10', 2, 8),
    (6, 4, 16, '2018-07-10', 2, 8),
    (6, 4, 21, '2018-07-10', 2, 8),
    (6, 4, 91, '2018-07-10', 2, 8),
    (6, 4, 100, '2018-07-10', 2, 8),
    (6, 4, 51, '2018-07-10', 2, 8),
    (6, 4, 54, '2018-07-10', 2, 8),
    (6, 4, 52, '2018-07-10', 2, 8),
    (8, 5, 77, '2018-07-10', 3, 7);
UNLOCK TABLES;

-- Table structure for `has`
CREATE TABLE `plan_workout_junction` (
    `plan_id` int(11),
    `workout_id` int(11),
    CONSTRAINT `plan_workout_pk` PRIMARY KEY (`plan_id`, `workout_id`),
    CONSTRAINT `has_ibfk_1` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`) ON DELETE CASCADE,
    CONSTRAINT `has_ibfk_2` FOREIGN KEY (`workout_id`) REFERENCES `workouts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Dump data for table `has`
LOCK TABLES `plan_workout_junction` WRITE;
INSERT INTO `plan_workout_junction` VALUES
    (1, 1),
    (1, 2),
    (2, 1),
    (2, 10),
    (2, 12),
    (2, 15);
UNLOCK TABLES;