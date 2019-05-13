function onButtonClick() {
    var inputText = document.getElementById("word").value;
    var url = "query?word=" + inputText;
    makeAjaxRequest(url);
}

function createAjaxRequest(method, url) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    return xhr;
}

function makeAjaxRequest(url) {
    var xhr = createAjaxRequest('GET', url);
    if (!xhr) {
	alert('Ajax not supported');
	return;
    }

    xhr.onload = function() {
	// Get JSON string and turn into object.
	var responseStr = xhr.responseText;
	var object = JSON.parse(responseStr);

	// Then call the function that displays
	// the returned JSON text on the page.
	displayPalindrome(object.palindrome);
    };

    xhr.onerror = function() {
	alert('Error: could not make the request.');
    };

    xhr.send();
}

function displayPalindrome(palindrome) {
    var outputText = document.getElementById("outputGoesHere");
    outputText.textContent = "Output: " + palindrome;
}
