/* 

Author: Christopher Ragasa
Date Last Modified: 7/24/18
Description: Example manipulation queries for Oregon State University - CS 340 Project

*/
-- CREATE ACCOUNT PAGE
-- create an account
INSERT INTO `users` (`firstname`, `lastname`, `username`, `password`, `email`) VALUES
    ('testfirst', 'testlast', 'testuser', 'testpass', 'test@test.com');
INSERT INTO `users` (`firstname`, `lastname`, `username`, `password`, `email`) VALUES
    ([fnameInput], [lnameInput], [usernameInput], [passInput], [emailInput]);




-- WORKOUTS PAGE
-- get all workouts for the workout page
SELECT * FROM workouts;

-- get workouts by muscle group
SELECT * FROM workouts WHERE `musclegroup` = 'Core';
SELECT * FROM workouts WHERE `musclegroup` = [muscleGroupInput];

-- insert new workouts on the workout page
INSERT INTO `workouts` (`name`, `musclegroup`) VALUES ('High Row', 'Back');
INSERT INTO `workouts` (`name`, `musclegroup`) VALUES ([workoutNameInput], [muscleGroupInput]);




-- PLANS PAGE
-- get all workout plans for a specific user
SELECT id, name FROM plans WHERE user_id = 1;
SELECT id, name FROM plans WHERE user_id = [user_id];

-- get all workouts for a specific plan_id
SELECT * FROM has INNER JOIN workouts ON has.workout_id  = workouts.id WHERE plan_id = 1;
SELECT * FROM has INNER JOIN workouts ON has.workout_id  = workouts.id WHERE plan_id = [plan_id];

-- create a new plan on the plan page
INSERT INTO `plans` (`name`, `user_id`) VALUES ('Mass Gainz', 3);
INSERT INTO `plans` (`name`, `user_id`) VALUES ('Mass Gainz', [user_id]);

-- add a new workout to a plan
INSERT INTO `has` (`plan_id`, `workout_id`) VALUES (3, 10);
INSERT INTO `has` (`plan_id`, `workout_id`) VALUES ([plan_id], [workout_id]);

-- remove a workout from a plan
DELETE FROM `has` WHERE `plan_id` = 3 AND `workout_id` = 10;
DELETE FROM `has` WHERE `plan_id` = [plan_id] AND `workout_id` = [workout_id];




-- LOG PAGE
-- check log entries for a user
SELECT * FROM log WHERE user_id = 1;
SELECT * FROM log WHERE user_id = [user_id];

-- update a log entry
UPDATE log SET `reps` = 1, `sets` = 1, `weight` = 1, `date` = '2020-01-01' WHERE id = 1;
UPDATE log SET `reps` = 1, `sets` = 1, `weight` = 1, `date` = '2020-01-01' WHERE id = [log_id];

-- add a new log entry
INSERT INTO `log` (`reps`, `sets`, `weight`, `date`, `user_id`, `workout_id`) VALUES (16, 5, 10, '2022-05-25', 1, 8);
INSERT INTO `log` (`reps`, `sets`, `weight`, `date`, `user_id`, `workout_id`) 
    VALUES ([repsInput], [setsInput], [weightInput], [dateInput], [user_id], [workout_id]);

-- delete a log entry
DELETE FROM `log` WHERE `id` = 1;
DELETE FROM `log` WHERE `id` = [log_id];




