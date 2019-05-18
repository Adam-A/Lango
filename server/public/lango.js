'use strict';
// An element to go into the DOM

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var sourceText = "";
var targetText = "";

function Card(props) {
    return React.createElement(
        "div",
        { className: "textCard" },
        props.children
    );
}

function Txt(props) {
    if (props.phrase == undefined) {
        return React.createElement(
            "p",
            null,
            "Text missing"
        );
    } else return React.createElement(
        "p",
        null,
        props.phrase
    );
}

function Button() {
    return React.createElement(
        "button",
        { onClick: makeStoreAjaxRequest },
        " Save"
    );
}

var CreateCardMain = function (_React$Component) {
    _inherits(CreateCardMain, _React$Component);

    function CreateCardMain(props) {
        _classCallCheck(this, CreateCardMain);

        var _this = _possibleConstructorReturn(this, (CreateCardMain.__proto__ || Object.getPrototypeOf(CreateCardMain)).call(this, props));

        _this.state = { opinion: "korean" };
        _this.checkReturn = _this.checkReturn.bind(_this);
        return _this;
    }

    _createClass(CreateCardMain, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "main",
                null,
                React.createElement(
                    "div",
                    { className: "header" },
                    React.createElement(
                        "h1",
                        { className: "headerText" },
                        "Lango!"
                    )
                ),
                React.createElement(
                    Card,
                    null,
                    React.createElement("textarea", { className: "inputEng", id: "inputEng", placeholder: "English", onKeyPress: this.checkReturn })
                ),
                React.createElement(
                    Card,
                    null,
                    React.createElement(Txt, { phrase: this.state.opinion })
                ),
                React.createElement(Button, { className: "saveButton" }),
                React.createElement(
                    "div",
                    { className: "footer" },
                    React.createElement(
                        "h1",
                        { className: "footerText" },
                        "Test"
                    )
                )
            );
        } // end of render function 

        // onKeyPress function for the textarea element
        // When the charCode is 13, the user has hit the return key

    }, {
        key: "checkReturn",
        value: function checkReturn(event) {
            if (event.charCode == 13) {
                var newPhrase = document.getElementById("inputEng").value;
                document.getElementById("inputEng").value = '';
                var url = "translate?source=" + newPhrase;
                makeTranslationAjaxRequest(url);

                /*we will do translation shit here*/
                this.setState({ opinion: targetText });
            }
        }
    }]);

    return CreateCardMain;
}(React.Component); // end of class


ReactDOM.render(React.createElement(CreateCardMain, null), document.getElementById('root'));

function createAjaxRequest(method, url) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    return xhr;
}

function makeTranslationAjaxRequest(url) {
    var xhr = createAjaxRequest('GET', url);
    if (!xhr) {
        alert('Ajax not supported');
        return;
    }

    xhr.onload = function () {
        //Get JSON string and turn into object.
        var responseStr = xhr.responseText;
        var object = JSON.parse(responseStr);
        //Then call the function that displays
        //the returned JSON text on the page.
        displayTranslation(object.target);
        targetText = object.target;
    };

    xhr.onerror = function () {
        alert('Error: could not make the request.');
    };

    xhr.send();
}

function makeStoreAjaxRequest(url) {
    var xhr = createAjaxRequest('GET', url);
    if (!xhr) {
        alert('Ajax not supported');
        return;
    }

    xhr.onload = function () {
        //Get JSON string and turn into object.
        var responseStr = xhr.responseText;
        var object = JSON.parse(responseStr);
        //Then call the function that displays
        //the returned JSON text on the page.
        console.log(object);
    };

    xhr.onerror = function () {
        alert('Error: could not make the request.');
    };

    xhr.send();
}