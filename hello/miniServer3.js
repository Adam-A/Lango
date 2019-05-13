const express = require('express')
const port = 51490

function queryHandler(req, res, next) {
    let url = req.url;
    let qObj = req.query;
    console.log(qObj);
    if (qObj.animal != undefined) {
	res.json( {"beast" : qObj.animal} );
	// res.send(qObj.animal)
    }
    else if (qObj.word != undefined) {
	var backwards = "";
	for (var i = (qObj.word.length - 1); i >= 0; i--) {
	    backwards += qObj.word.charAt(i);
	}
	res.json({"palindrome": qObj.word + backwards});
    }
    else {
	next();
    }
}

function fileNotFound(req, res) {
    let url = req.url;
    res.type('text/plain');
    res.status(404);
    res.send('Cannot find '+url);
    }

// put together the server pipeline
const app = express()
app.use(express.static('public'));  // can I find a static file? 
app.get('/query', queryHandler );   // if not, is it a valid query?
app.use( fileNotFound );            // otherwise not found

app.listen(port, function (){console.log('Listening...');} )
 
