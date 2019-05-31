function onLoginClick() {
    let url = 'auth/google';
    let xhr = new XMLHttpRequest();

    xhr.open('GET',url,true);
    xhr.onload = function () { console.log('logged in!'); };
    xhr.onerror = function () { console.log('browser sees error');};
    xhr.send();
}