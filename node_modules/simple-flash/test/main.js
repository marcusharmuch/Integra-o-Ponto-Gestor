var should = require('should');
var request = require('request');

var express = require('express');
var session = require('express-session');
var app = express();
var server;

var flash = require('../index');

// Add cookies support to preserve session over request
var cookieJar = request.jar();

describe('Testing set and get messages from route:', function(){
	before(function(){

		app.use(session({secret: 'simple-flash', saveUninitialized: true, resave: false}));
		app.use(flash());

		// add some messages
		app.get('/basic', function(req,res){
			req.flash('info','Info message');
			req.flash('error','Error message');
			req.flash('success','Success message');
			req.flash('awesome','Awesom message');

			res.json(res.locals.flash());
		})

		app.get('/redirect', function(req,res){
			req.flash('info','Info message');
			req.flash('error','Error message');
			req.flash('success','Success message');
			req.flash('awesome','Awesom message');

			res.redirect('/redirect/result');
		})

		app.get('/redirect/result', function(req,res){
			res.json(res.locals.flash());
		})

		server = app.listen(8000);
	});

	it('Test basic messages in session', function(done){
		request({url: 'http://localhost:8000/basic', jar: cookieJar}, function(err,response,body){
			should(response.statusCode).be.eql(200);
			var messages = JSON.parse(body);
			messages.length.should.be.eql(4);
			done();
		})
	});

	it('Test request without messages', function(done){
		request({url: 'http://localhost:8000/redirect/result', jar: cookieJar}, function(err,response,body){
			should(response.statusCode).be.eql(200);
			should(JSON.parse(body).length).be.eql(0);
			done();
		})
	});

	it('Test request messages with redirect', function(done){
		request({url: 'http://localhost:8000/redirect', jar: cookieJar}, function(err,response,body){
			should(response.statusCode).be.eql(200);
			should(JSON.parse(body).length).be.eql(4);
			done();
		})
	});

	after(function(){
		server.close();
	});
});