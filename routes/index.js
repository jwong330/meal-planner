var express = require('express');
var router = express.Router();
var mysql = require('../dbcon.js');

//Display workouts page
router.get('/',function(req,res,next){
    res.render('login');
});

module.exports = router;