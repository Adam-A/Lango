'use strict';

let sourceText = "";
let targetText = "";


const e = React.createElement;

class LikeButton extends React.Component {
    constructor(props) {
	super(props);
	this.state = { liked: false };
    }

    render() {
	if (this.state.liked) {
	    return 'You liked this.';
	}

	return e(
	    'button',
	    { onClick: () => this.setState({ liked: true }) },
	    'Like'
	);
    }
}

const domContainer = document.querySelector('#like_button_container');
ReactDOM.render(e(LikeButton), domContainer);

function onSubmitClick() {
    let inputText = document.getElementById("phraseForm").value;
    sourceText = inputText;
    let url = "translate?source=" + inputText;
    makeTranslationAjaxRequest(url);
}

function onSaveClick(){
    if (sourceText != undefined && targetText != undefined) {
	let url = `store?source=${sourceText}&target=${targetText}`;
	makeStoreAjaxRequest(url);
    }

}
function createAjaxRequest(method, url) {
  let xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  return xhr;
}

function makeTranslationAjaxRequest(url) {
  let xhr = createAjaxRequest('GET', url);
  if (!xhr) {
    alert('Ajax not supported');
    return;
  }

    xhr.onload = function() {
	//Get JSON string and turn into object.
	let responseStr = xhr.responseText;
	let object = JSON.parse(responseStr);
	//Then call the function that displays
	//the returned JSON text on the page.
	displayTranslation(object.target);
	targetText = object.target;
  };

  xhr.onerror = function() {
    alert('Error: could not make the request.');
  };

  xhr.send();
}

function makeStoreAjaxRequest(url) {
    let xhr = createAjaxRequest('GET', url);
    if (!xhr) {
	alert('Ajax not supported');
	return;
    }

    xhr.onload = function() {
	//Get JSON string and turn into object.
	let responseStr = xhr.responseText;
	let object = JSON.parse(responseStr);
	//Then call the function that displays
	//the returned JSON text on the page.
	console.log(object);
    };

    xhr.onerror = function() {
	alert('Error: could not make the request.');
    };

    xhr.send();
}

function displayTranslation(translatedText) {
  let outputText = document.getElementById("outputGoesHere");
  outputText.textContent = "Translated Output: " + translatedText;
}
