// Initialization

var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var validator = require('validator'); // See documentation at https://github.com/chriso/validator.js
var app = express();
var schedule = require('node-schedule');
var sendgrid  = require('sendgrid')("comp20f14team4", "!!Wh@t3v!!");

// See https://stackoverflow.com/questions/5710358/how-to-get-post-query-in-express-node-js
app.use(bodyParser.json());
// See https://stackoverflow.com/questions/25471856/express-throws-error-as-body-parser-deprecated-undefined-extended
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + ''));

// Mongo initialization
var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/test';
var mongo = require('mongodb');
var db = mongo.Db.connect(mongoUri, function(error, databaseConnection) {
	db = databaseConnection;
});

var j = schedule.scheduleJob({hour: 0, minute: 0, dayOfWeek: 0}, function(){
    weeklySweep();
});

app.get('/', function(req, res){
	res.sendFile('index.html'); 
});

app.get('/meditation', function(req, res){
	res.sendFile(__dirname + '/meditation1.html');
});

app.get('/checkin', function(req, res){
	res.sendFile(__dirname + '/checkin.html');
});

/*
 * Call at the end of every week to:
 * 		- set weekly points, gym hours, and meditation hours to 0
 * 		- reset matches
 * 		- update matches won
 */
 function weeklySweep() {
 	//sweep goals
	db.collection('goals', function(er, collection) {
		if(er) {
			response.sendStatus(500);
		}
		collection.remove({}, function(err){
			if(err){
				response.sendStatus(500);
			}
		});
	});

	//update matches won with whomever won
	//set matches back to ""
	//find new matches
	//update all weekly point totals to 0
	db.collection('usrs', function(er, collection) {
		if(!er) {
			collection.find().toArray(function(err, person) {
				opponent = collection.find({"login": person[i].match});
				if (opponent[i].points_w < person[i].points_w) {
					collection.update({"login" : person[i].login}, {$inc: {"matches_won" : 1}}, function(err) {});
				}
			});

			collection.update({ "_id" : { $exists : true } }, {$set: {match : ""}});

			collection.find().toArray(function(err, person) {
				for (i in person) {
					var newMatch;
					if (person[i].match == "") {
						newMatch = setMatchLogin(person[i].points, person[i].login)
					} else {
						newMatch = person[i].match;
					}
					collection.update({"login" : person[i].login}, {$set: {
						"points_w" : 0, 
						"gym_hr_w" : 0,
						"med_hr_w" : 0,
						"match" : newMatch
					}},
					function(err){});
				}
			});

			
		}
	});
}

function setMatchLogin(pointval, userToMatch) {
	db.collection('usrs', function(er, collection) {
		if(!er) {
			var matchuser;
			collection.find({"points" : { $gt: pointval-50, $lt: pointval+50 } }).toArray(function(err, person) {
				while(1) {
					i = Math.floor(Math.random() * person.length);	//make sure there's no off by one error segfault not in array thing
					if (person[i].match == "") {
						matchuser = person[i].login;
						break;
					}
				}
			});
			collection.update({"login": matchuser}, {$set: {"match": userToMatch}}, function(err){});
			return matchuser;
		}
	});
}

//create account from user sign up
app.post('/createAccount', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "X-Requested-With");
	if (!request.body.login || !request.body.password 
		|| !request.body.email) {
		response.sendStatus(500);
	}
	var image;
	if (!request.body.image) {
		image = "images/kitten.jpg";
	} else {
		image = request.body.image;
	}
	db.collection('usrs', function(er, collection) {
		if(!er) {
			collection.insert({"login" : request.body.login, 
				"password" : request.body.password, "email": request.body.email, 
				"image":image, "points": 0, "points_w":0, 
				"gym_hr_total":0, "gym_hr_w":0, "med_hr_total":0, "med_hr_w": 0, 
				"matches_won":0, "match": ""}, function(err){
				if(err) {
					response.sendStatus(500);
				}
			});

			var emailText = "Hello " + request.body.login + "!\n Welcome to Healthy Habits. We're super jazzed that you've decided to join us. Our mission is to help people improve their health--both physical fitness and mental health. Now you can keep track of just how much you're accomplishing and let your competitive edge bring out the health nut in you! \n Cheers! \n Your friends from Healthy Habits :)"

			var email     = new sendgrid.Email({
			  to:       request.body.email,
			  from:     'dnguyenbls2012@gmail.com',
			  subject:  'Welcome to Healthy Habits!',
			  text:     emailText
			});
			sendgrid.send(email, function(err, json) {
			  if (err) { return console.error(err); }
			  console.log(json);
			});
		}
	});
	response.redirect('/');
});


/*
 * FOR UPDATING:
 *		points
 * 		gym hours
 * 		meditation hours
 */
app.post('/update', function(request, response) { // similar to checkin and meditation page? 
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "X-Requested-With");
    if (!request.body.login)
    	response.sendStatus(500);

    var toUpdate;

	db.collection('usrs', function(er, collection) {
		if(!er) {
			collection.find({"login" : request.body.login}, function(err, cursor) {
				if(!err) {
					try {
						if(request.body.points){
							collection.update({"login": request.body.login}, {$inc: {
								"points": parseFloat(request.body.points),
								"points_w" : parseFloat(request.body.points)
							}}, function(err) {
								if (!err) {
									response.sendStatus(200);
								} else {
									response.sendStatus(404);
								}
							});
						}
						if(request.body.gym_hr){
							collection.update({"login" : request.body.login}, {$inc: {
								"gym_hr_w" : parseFloat(request.body.gym_hr),
								"gym_hr_total" : parseFloat(request.body.gym_hr)
							}}, function(err) {
								if (!err) {
									response.sendStatus(200);
								} else {
									response.sendStatus(404);
								}
							});
						}
						if(request.body.med_hr) {
							collection.update({"login" : request.body.login}, {$inc: {
								"med_hr_w" : parseFloat(request.body.med_hr),
								"med_hr_total" : parseFloat(request.body.med_hr)
							}}, function(err) {
								if (!err) {
									response.sendStatus(200);
								} else {
									response.sendStatus(404);
								}
							});	
						}
					} catch (e) {
						console.log(e);
					}
				}
			});
	
		}
		else {
			response.sendStatus(500);
		}
	});
});

//returns all info on a certain user
app.get('/profile.json', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "X-Requested-With");

	if (!request.query.login) {
		response.sendStatus(500);
		console.log("login undefined");
		console.log("login: "+ request.query.login)
	}

	db.collection('usrs', function(er, collection) {
		console.log("database querried");
		if(er) {
			response.sendStatus(500);
			console.log("database access error");
		}
		collection.findOne({"login": request.query.login}, {"password": 0}, function(err, doc) {
			console.log(doc);
			response.json(doc);
		});
	});
});

//returns user login and points in sorted order for highscore
app.get('/highscores.json', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "X-Requested-With");
	db.collection('usrs', function(er, collection) {
		if (er) {
			response.sendStatus(500);
		}
		collection.find().sort({"points" : -1}).toArray(function(err, cursor) {
			if (err) {
				response.sendStatus(500);
			}
			var toReturn = [];
			for (i in cursor){
				toReturn[i] = {"points": cursor[i].points, "login": cursor[i].login};
			}
			console.log(toReturn);
			response.json(toReturn);
		});
	});
});

//add to goal list
app.post('/addgoal', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "X-Requested-With");
	if (!request.body.login || !request.body.goal) {
		response.sendStatus(500);
	}
	db.collection('goals', function(er, collection) {
		if (er) {
			response.sendStatus(500);
		}
		collection.insert({"login": request.body.login, "goal" : request.body.goal, "complete": 0}, 
			function(err){
				if (err) { 
					response.sendStatus(500);
				}
			});
		response.sendStatus(200);
	});
});

//find all goals for specific login
app.get('/goals.json', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "X-Requested-With");

	console.log("in goals.json");

	if (!request.query.login) {
		console.log("login is undefined");
		response.sendStatus(500);
	}
	db.collection('goals', function(er, collection) {
		if(er) {
			console.log("collection error");
			response.sendStatus(500);
		}
		collection.find({"login":request.query.login}).toArray(function(err, cursor){
			if(err){
				console.log("find error");
				response.sendStatus(500);
			}
			response.json(cursor);
		});
	});
});

app.post('/completeGoal', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "X-Requested-With");
	if (!request.body.login || !request.body.goal) {
		response.sendStatus(500);
	}

	db.collection('goals', function(er, collection){
		if(er){
			response.sendStatus(500);
		}
		collection.update({"login":request.body.login, "goal":request.body.goal}, {$set: {complete : 1}}, 
			function(err){
				if(err){
					response.sendStatus(500);
				}
			});
		response.sendStatus(200);
	});


});


app.listen(process.env.PORT || 3000);