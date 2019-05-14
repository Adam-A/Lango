let currentResponse = undefined

function onSubmitClick() {
  let inputText = document.getElementById("word").value;
  let url = "translate?source=" + inputText;
  makeAjaxRequest(url);
}

function onSaveClick(){
    if (currentResponse != undefined) {
	console.log(currentResponse)
      let url = `store?source=${currentResponse.target}&target=${currentResponse.target}`;
      makeAjaxRequest(url);
  }
}
function createAjaxRequest(method, url) {
  let xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  return xhr;
}

function makeAjaxRequest(url) {
  let xhr = createAjaxRequest('GET', url);
  if (!xhr) {
    alert('Ajax not supported');
    return;
  }

  xhr.onload = function() {
    // Get JSON string and turn into object.
    let responseStr = xhr.responseText;
    let object = JSON.parse(responseStr);
    currentResponse = JSON.parse(responseStr)
    // Then call the function that displays
    // the returned JSON text on the page.
    displayTranslation(object.target);
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
