"use strict";

const express = require('express');
const http = require('http');
const APIrequest = require('request');
const APIkey = "AIzaSyD5oG-6TYOgYT4gq-y5vg-YcNy14mCtjuc";  // ADD API KEY HERE
const url = "https://translation.googleapis.com/language/translate/v2?key=" + APIkey;
const port = 51490;

// An object containing the data expressing the query to the
// translate API.
// Below, gets stringified and put into the body of an HTTP PUT request.
let requestObject = {
    "source": "en",
    "target": "ja",
    "q": ["Hello!"]
};

console.log("English phrase: ", requestObject.q[0]);

function queryHandler(req, res, next) {
    let url = req.url;
    let qObj = req.query;
    console.log(qObj);
    if (qObj.animal != undefined) {
        res.json( {"beast" : qObj.animal} );
        // res.send(qObj.animal)
    }
    else if (qObj.english != undefined) {
        requestObject.q = [qObj.english];
        myFunc(res);
        // res.json({"palindrome": qObj.word + backwards});
    }
    else {
        next();
    }
}

function myFunc (res) {
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
                console.log("In Japanese: ",
                    APIresBody.data.translations[0].translatedText);
                console.log("\n\nJSON was:");
                console.log(JSON.stringify(APIresBody, undefined, 2));
                // print it out as a string, nicely formatted
                res.json({
                    "English" : requestObject.q[0], // Or wherever you have your english phrase contained
                    "Japanese" : APIresBody.data.translations[0].translatedText
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
app.get('/translate', queryHandler );   // if not, is it a valid query?
app.use( fileNotFound );            // otherwise not found
app.listen(port, function (){console.log('Listening on port ') + port;} );