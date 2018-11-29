//Set up express
var express = require("express");
var app = express();

//var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var hbs = require("express-handlebars");
var session = require("express-session");
var path = require("path");
var bodyParser = require("body-parser");
var moment = require("moment");
app.use(express.static("public"));
//Allows to use req.body in accessing DOM elements
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var routes = require("./routes/index.js");

//Set up mysql database
var mysql = require("./dbcon.js");

//Set up viewing engine
app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layouts"
  })
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

//Set up port
app.set("port", 58825);

app.use("/", routes);

/******************************************
ROUTES FOR HOME
*******************************************/
//Display home page
app.get("/home", function(req, res, next) {
  res.render("home");
});

/******************************************
ROUTES FOR CREATE ACCOUNT
*******************************************/
//Display workouts page
app.get("/account", function(req, res, next) {
  res.render("account");
});

//Create an account - Insert new entry into users database using form submit
app.post("/insert-account", function(req, res, next) {
  mysql.pool.query(
    "INSERT INTO users (`firstname`, `lastname`, `username`, `password`, `email`) VALUES (?, ?, ?, ?, ?)",
    [
      req.body.fnameEntry.toString(),
      req.body.lnameEntry.toString(),
      req.body.userEntry.toString(),
      req.body.passwordEntry.toString(),
      req.body.emailEntry.toString()
    ],
    function(err, result) {
      if (err) {
        next(err);
        return;
      }
    }
  );
  res.render("home");
});

/******************************************
ROUTES FOR LOGIN
*******************************************/
app.get("/", function(req, res, next) {
  res.render("login");
});

app.get("/login-check", function(req, res, next) {
  context = {};
  mysql.pool.query(
    "SELECT * FROM users WHERE username = ?",
    [req.query.username],
    function(err, result) {
      if (err) {
        next(err);
        return;
      }
      //Check if the username exists
      if (result.length == 0) {
        console.log("Invalid username.");
        res.render("login");
      } else {
        //Check if passwords match
        if (result[0].password == req.query.password) {
          //Create an array to store the username
          params = [];
          addItem = {
            username: req.query.username
          };
          params.push(addItem);
          context.results = params;
          //Render the page with the username
          console.log(context);
          res.render("home", context);
        }
        //Otherwise, passwords don't match, return back to login screen
        else {
          res.render("login");
        }
      }
    }
  );
});

/******************************************
ROUTES FOR ADMIN
*******************************************/
//Display admin page
app.get("/admin", function(req, res, next) {
  var context = {};
  mysql.pool.query("SELECT * FROM users", function(err, rows, fields) {
    if (err) {
      next(err);
      return;
    }

    //Create a params array that keeps track of each entry in Workouts table
    var params = [];
    //Loop through the entries and add them to the params array
    for (var row in rows) {
      var addItem = {
        id: rows[row].id,
        firstname: rows[row].firstname,
        lastname: rows[row].lastname,
        username: rows[row].username,
        password: rows[row].password,
        email: rows[row].email
      };
      params.push(addItem);
    }

    context.results = params;
    res.render("admin", context);
  });
});

/******************************************
ROUTES FOR WORKOUTS
*******************************************/

//Display workouts page
app.get("/workouts", function(req, res, next) {
  var context = {};
  mysql.pool.query("SELECT * FROM workouts", function(err, rows, fields) {
    if (err) {
      next(err);
      return;
    }

    //Create a params array that keeps track of each entry in Workouts table
    var params = [];
    //Loop through the entries and add them to the params array
    for (var row in rows) {
      var addItem = {
        name: rows[row].name,
        musclegroup: rows[row].musclegroup,
        id: rows[row].id
      };
      params.push(addItem);
    }

    //Create an array of distinct muscle groups
    var distinctMuscleGroups = [];
    for (var row in rows) {
      if (distinctMuscleGroups.indexOf(rows[row].musclegroup) === -1) {
        distinctMuscleGroups.push(rows[row].musclegroup);
      }
    }

    //Convert -- Put each muscle group into array of objects format for Handlebars compatibility
    var mgroups = [];
    for (each in distinctMuscleGroups) {
      var addMuscle = {
        musclegroup: distinctMuscleGroups[each]
      };
      mgroups.push(addMuscle);
    }

    context.results = params;
    context.muscles = mgroups;
    //console.log(context);

    res.render("workouts", context);
  });
});

//Display workouts page after search
app.get("/workouts-search", function(req, res, next) {
  var context = {};
  var muscleGroupQuery = req.query.muscleGroupName;

  mysql.pool.query("SELECT * FROM workouts", function(err, rows, fields) {
    if (err) {
      next(err);
      return;
    }

    //Create an array of distinct muscle groups
    var distinctMuscleGroups = [];
    for (var row in rows) {
      if (distinctMuscleGroups.indexOf(rows[row].musclegroup) === -1) {
        distinctMuscleGroups.push(rows[row].musclegroup);
      }
    }

    //Convert -- Put each muscle group into array of objects format for Handlebars compatibility
    var mgroups = [];
    for (each in distinctMuscleGroups) {
      var addMuscle = {
        musclegroup: distinctMuscleGroups[each]
      };
      mgroups.push(addMuscle);
    }

    //Create a params array that keeps track of each entry in Workouts table
    var params = [];
    //Loop through the entries and add them to the params array
    for (var row in rows) {
      var addItem = {
        name: rows[row].name,
        musclegroup: rows[row].musclegroup,
        id: rows[row].id
      };

      if (addItem.musclegroup === muscleGroupQuery) {
        params.push(addItem);
      }
    }

    context.results = params;
    context.muscles = mgroups;
    //console.log(context);

    res.render("workouts", context);
  });
});

//Insert a new workout onto the workouts page
app.post("/insert-workout", function(req, res, next) {
  var context = {};
  mysql.pool.query(
    "INSERT INTO workouts (`name`, `musclegroup`) VALUES (?, ?)",
    [req.query.exercise, req.query.musclegroup],
    function(err, result) {
      if (err) {
        next(err);
        return;
      }
      context.inserted = result.insertId;
      res.send(JSON.stringify(context));
    }
  );
});

//Delete a workout from the workouts table
app.delete("/delete-workout", function(req, res, next) {
  var context = {};

  mysql.pool.query("DELETE FROM workouts WHERE id=?", [req.query.id], function(
    err,
    result
  ) {
    if (err) {
      next(err);
      return;
    }
    context.results = "Deleted " + result.changedRows + " rows.";
    res.render("home", context);
  });
});
/******************************************
 *******************************************/

/******************************************
ROUTES FOR PLANS
*******************************************/
//Display plans page
app.get("/plans", function(req, res, next) {
  var context = {};
  mysql.pool.query("SELECT * FROM plans; SELECT * FROM users", function(
    err,
    rows,
    fields
  ) {
    if (err) {
      next(err);
      return;
    }

    context.results = rows[0];
    context.uniqueusers = rows[1];
    res.render("plans", context);
  });
});

//Insert a new plan into the plans table
app.post("/insert-plan", function(req, res, next) {
  var context = {};
  mysql.pool.query(
    "INSERT INTO plans (`name`, `user_id`) VALUES (?, ?)",
    [req.query.name, req.query.user_id],
    function(err, result) {
      if (err) {
        next(err);
        return;
      }
      context.inserted = result.insertId;
      res.send(JSON.stringify(context));
    }
  );
});

//Delete a plan from the plans table
app.delete("/delete-plans", function(req, res, next) {
  var context = {};

  mysql.pool.query("DELETE FROM plans WHERE id=?", [req.query.id], function(
    err,
    result
  ) {
    if (err) {
      next(err);
      return;
    }
    context.results = "DELETED " + result.changedRows + "ROWS";
    res.render("home", context);
  });
});
/******************************************
 *******************************************/

/******************************************
ROUTES FOR LOG
*******************************************/
app.get("/log", function(req, res, next) {
  var context = {};
  //Get data from database
  mysql.pool.query(
    "SELECT * FROM log; SELECT id, username FROM users ORDER BY id ASC; SELECT id, name FROM workouts ORDER BY id ASC",
    function(err, rows, fields) {
      if (err) {
        next(err);
        return;
      }

      //Create a params array that keeps track of each entry of the results
      var params = [];
      //Loop through results and add them to the params array
      for (var row in rows[0]) {
        var addItem = {
          id: rows[0][row].id,
          reps: rows[0][row].reps,
          sets: rows[0][row].sets,
          weight: rows[0][row].weight,
          date: rows[0][row].date,
          user_id: rows[0][row].user_id,
          workout_id: rows[0][row].workout_id
        };
        params.push(addItem);
      }

      //Create a params array that keeps track of user ids
      var paramsUsers = [];
      for (var row in rows[1]) {
        var addItem = {
          id: rows[1][row].id,
          username: rows[1][row].username
        };
        paramsUsers.push(addItem);
      }

      //Create a params array that keeps track of workout ids
      var paramsWorkouts = [];
      for (var row in rows[2]) {
        var addItem = {
          id: rows[2][row].id,
          name: rows[2][row].name
        };
        paramsWorkouts.push(addItem);
      }

      context.results = params;
      context.resultsUsers = paramsUsers;
      context.resultsWorkouts = paramsWorkouts;

      res.render("log", context);
    }
  );
});

//Insert a new log entry into the log table
app.post("/insert-log", function(req, res, next) {
  var context = {};
  mysql.pool.query(
    "INSERT INTO log (`reps`, `sets`, `weight`, `date`, `user_id`, `workout_id`) VALUES (?, ?, ?, ?, ?, ?)",
    [
      req.query.reps,
      req.query.sets,
      req.query.weight,
      req.query.date,
      req.query.userID,
      req.query.workoutID
    ],
    function(err, result) {
      if (err) {
        next(err);
        return;
      }
      context.inserted = result.insertId;
      res.send(JSON.stringify(context));
    }
  );
});

//Delete a workout from the log
app.delete("/delete-log-entry", function(req, res, next) {
  var context = {};
  mysql.pool.query("DELETE FROM log WHERE id=?", [req.query.id], function(
    err,
    result
  ) {
    if (err) {
      next(err);
      return;
    }
    context.results = "DELETED " + result.changedRows + " ROWS";
    res.render("log", context);
  });
});

//Update a workout from the log
app.get("/update-log", function(req, res, next) {
  var context = {};
  mysql.pool.query("SELECT * FROM log WHERE id=?", [req.query.id], function(
    err,
    result
  ) {
    if (err) {
      next(err);
      return;
    }
    if (result.length === 1) {
      //Store current values in an array so that null values are not entered
      var curVals = result[0];
      mysql.pool.query(
        "UPDATE log SET reps=?, sets=?, weight=?, date=? WHERE id=? ",
        [
          req.query.numReps || curVals.reps,
          req.query.numSets || curVals.sets,
          req.query.numWeight || curVals.weight,
          req.query.dateEntry || curVals.date,
          req.query.id
        ],
        function(err, result) {
          if (err) {
            next(err);
            return;
          }
          context.results = "UPDATED " + result.changedRows + " ROWS";

          mysql.pool.query("SELECT * FROM log", function(err, rows, fields) {
            if (err) {
              next(err);
              return;
            }
            //Create a params array that keeps track of each entry of the results
            var params = [];
            //Loop through results and add them to the params array
            for (var row in rows) {
              var addItem = {
                id: rows[row].id,
                reps: rows[row].reps,
                sets: rows[row].sets,
                weight: rows[row].weight,
                date: rows[row].date,
                user_id: rows[row].user_id,
                workout_id: rows[row].workout_id
              };
              params.push(addItem);
            }
            context.results = params;
            res.render("log", context);
          });
        }
      );
    }
  });
});
/******************************************
 *******************************************/

app.use(function(req, res) {
  res.status(404);
  res.render("404");
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render("500");
});

app.listen(app.get("port"), function() {
  console.log(
    "Express started on " + app.get("port") + "; press Ctrl-C to terminate."
  );
});

module.exports = app;
