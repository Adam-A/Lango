'use strict';

// An element to go into the DOM

var header = React.createElement(
    "h1",
    { id: "header", className: "header"},
    "Header!"
);

var footer = React.createElement(
    "h1",
    { id: "footer", className: "footer"},
    "Footer!"
);


// A component - function that returns some elements
function FirstCard() {
    return React.createElement(
	"div",
	{ className: "textCard" },
	React.createElement(
	    "p",
	    null,
	    "English"
	)
    );
}

// A component - function that returns some elements
function SecondCard() {
    return React.createElement(
	"div",
	{ className: "textCard" },
	React.createElement(
	    "p",
	    null,
	    "Translation"
	)
    );
}

// Another component
function FirstInputCard() {
    return React.createElement(
	"div",
	{ className: "textCard" },
	React.createElement("textarea", { onKeyDown: checkReturn })
    );
}



var middle = React.createElement(
    "div",
    {className: "middle"},
    React.createElement(FirstInputCard, null),
    React.createElement(FirstCard, null),
    React.createElement(SecondCard, null)

);

// An element with some contents, including a variable
// that has to be evaluated to get an element, and some
// functions that have to be run to get elements.
var main = React.createElement(
    "main",
    {className : "main"},
    header,
    middle,
    footer
);

ReactDOM.render(main, document.getElementById('root'));

// onKeyPress function for the textarea element
// When the charCode is 13, the user has hit the return key
function checkReturn(event) {
    if (event.keyCode == 13) {
        console.log(event.target.value);
    }
}
