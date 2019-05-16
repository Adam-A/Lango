"use strict";

const express = require('express');
const http = require('http');

const APIrequest = require('request');
const APIkey = "AIzaSyD5oG-6TYOgYT4gq-y5vg-YcNy14mCtjuc";  // ADD API KEY HERE
const url = "https://translation.googleapis.com/language/translate/v2?key=" + APIkey;

const port = 51490;
const sqlite3 = require("sqlite3").verbose();  // use sqlite
const fs = require("fs"); // file system
const dbFileName = "Flashcards.db";
// makes the object that represents the database in our code
const db = new sqlite3.Database(dbFileName);  // object, not database.
// Initialize table.
// If the table already exists, causes an error.
// Fix the error by removing or renaming Flashcards.db
const cmdStr = 'CREATE TABLE flashcards (user INT, source TEXT, target TEXT, seen INT, correct INT)'
db.run(cmdStr,tableCreationCallback);


// An object containing the data expressing the query to the
// translate API.
// Below, gets stringified and put into the body of an HTTP PUT request.
let requestObject = {
    "source": "en",
    "target": "ko",
    "q": ["Hello!"]
};

// Always use the callback for database operations and print out any
// error messages you get.
// This database stuff is hard to debug, give yourself a fighting chance.
function tableCreationCallback(err) {
    if (err) {
	console.log("Table creation error",err);
    } else {
	console.log("Database created");
	//db.close();
    }
}

console.log("English phrase: ", requestObject.q[0]);

function translateQueryHandler(req, res, next) {
    let qObj = req.query;
    console.log(qObj);
    if (qObj.source != undefined) {
        requestObject.q = [qObj.source];
        translateAPI(res);
    } else {
        next();
    }
}

function storeQueryHandler(req,res, next) {
    let url = req.url;
    let qObj = req.query;
    console.log(qObj);
    if (qObj.source != '' && qObj.target != '') {
	//Setting default values (right now ID is 0, but we will change that later)
	let sqliteQuery = `INSERT INTO flashcards VALUES (0, "${qObj.source}", "${qObj.target}",0,0)`;
        db.run(sqliteQuery, function(err) {
            if (err) {
                return console.log(err.message);
            }
            dumpDB();
            res.json({"msg":"saved"});
        });
    }
}

function dumpDB() {
    db.all ( 'SELECT * FROM flashcards', dataCallback);
    function dataCallback( err, data ) {console.log(data)}
}

function translateAPI (res) {
    APIrequest(
        { // HTTP header stuff
            url: url,
            method: "POST",
            headers: {"content-type": "application/json"},
            // will turn the given object into JSON
            json: requestObject
        },
        // callback function for API request
        APIcallback
    );

    function APIcallback (err, APIresHead, APIresBody) {
        if ((err) || (APIresHead.statusCode != 200)) {
            // API is not working
            console.log("Got API error");
            console.log(APIresBody);
        }
        else {
            if (APIresHead.error) {
                // API worked but is not giving you data
                console.log(APIresHead.error);
            }
            else {
                console.log("In source language: ",
                    APIresBody.data.translations[0].translatedText);
                console.log("\n\nJSON was:");
                console.log(JSON.stringify(APIresBody, undefined, 2));
                // print it out as a string, nicely formatted
                res.json({
                    "source" : requestObject.q[0], // Or wherever you have your english phrase contained
                    "target" : APIresBody.data.translations[0].translatedText
                });
            }
        }
    }
}

function fileNotFound(req, res) {
    let url = req.url;
    res.type('text/plain');
    res.status(404);
    res.send('Cannot find '+url);
}

// put together the server pipeline
const app = express();
app.use(express.static('public'));  // can I find a static file?
app.get('/translate', translateQueryHandler );   // if not, is it a valid query?
app.get('/store', storeQueryHandler ); 
app.use( fileNotFound );            // otherwise not found
app.listen(port, function () { console.log('Listening on port ') + port; } );
//db.close()
