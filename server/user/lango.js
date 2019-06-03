'use strict';
// An element to go into the DOM

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
        { className: "translatedText" },
        props.phrase
    );
}

function StartReviewButton() {
    return React.createElement(
        "button",
        null,
        "Start Review"
    );
}

var CreateCardMain = function (_React$Component) {
    _inherits(CreateCardMain, _React$Component);

    function CreateCardMain(props) {
        _classCallCheck(this, CreateCardMain);

        var _this = _possibleConstructorReturn(this, (CreateCardMain.__proto__ || Object.getPrototypeOf(CreateCardMain)).call(this, props));

        _this.sourceText = "";
        _this.targetText = "";
        _this.state = { opinion: "Korean" };
        _this.checkReturn = _this.checkReturn.bind(_this);
        _this.saveCard = _this.saveCard.bind(_this);
        return _this;
    }

    _createClass(CreateCardMain, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "main",
                { className: "main" },
                React.createElement(
                    "div",
                    { className: "header" },
                    React.createElement(
                        "button",
                        { className: "startReviewButton" },
                        "Start Review"
                    ),
                    React.createElement(
                        "h1",
                        { className: "headerText" },
                        "Lango!"
                    )
                ),
                React.createElement(
                    "div",
                    { className: "middle" },
                    React.createElement(
                        "div",
                        { className: "cardContainer" },
                        React.createElement(
                            Card,
                            null,
                            React.createElement("textarea", { className: "inputEng", id: "inputEng", placeholder: "English", onKeyPress: this.checkReturn })
                        ),
                        React.createElement(
                            Card,
                            null,
                            React.createElement(Txt, { phrase: this.state.opinion })
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "saveContainer" },
                        React.createElement(
                            "button",
                            { className: "saveButton", onClick: this.saveCard },
                            "Save"
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "footer", id: "footer" },
                    React.createElement(
                        "h1",
                        { className: "footerText" },
                        "UserName"
                    )
                )
            );
        } // end of render function 

        // onKeyPress function for the textarea element
        // When the charCode is 13, the user has hit the return key

    }, {
        key: "saveCard",
        value: function saveCard() {
            if (this.sourceText && this.targetText) {
                var url = "store?source=" + this.sourceText + "&target=" + this.targetText;
                this.makeStoreAjaxRequest(url);
            } else {
                document.getElementById("inputEng").placeholder = "Can't store empty inputs!";
                //Let user know that they can't save non existant things!
            }
        }
    }, {
        key: "checkReturn",
        value: function checkReturn(event) {
            if (event.charCode == 13) {
                this.sourceText = document.getElementById("inputEng").value;
                document.getElementById("inputEng").value = '';
                var url = "translate?source=" + this.sourceText;
                this.makeTranslationAjaxRequest(url);
            }
        }
    }, {
        key: "createAjaxRequest",
        value: function createAjaxRequest(method, url) {
            var xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            return xhr;
        }
    }, {
        key: "makeTranslationAjaxRequest",
        value: function makeTranslationAjaxRequest(url) {
            var xhr = this.createAjaxRequest('GET', url);
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
                if (object.target) {
                    this.setState({ opinion: object.target });
                    this.targetText = object.target;
                } else {
                    //error
                }
            }.bind(this);

            xhr.onerror = function () {
                alert('Error: could not make the request.');
            };

            xhr.send();
        }
    }, {
        key: "makeStoreAjaxRequest",
        value: function makeStoreAjaxRequest(url) {
            var xhr = this.createAjaxRequest('GET', url);
            if (!xhr) {
                alert('Ajax not supported');
                return;
            }

            xhr.onload = function () {
                //Get JSON string and turn into object.
                var responseStr = xhr.responseText;
                console.log(responseStr);
                var object = JSON.parse(responseStr);
                //Then call the function that displays
                //the returned JSON text on the page.
                console.log(object);
                document.getElementById("inputEng").placeholder = object.msg;
            };

            xhr.onerror = function () {
                alert('Error: could not make the request.');
            };

            xhr.send();
        }
    }]);

    return CreateCardMain;
}(React.Component); // end of class

var ReviewCardMain = function (_React$Component2) {
    _inherits(ReviewCardMain, _React$Component2);

    function ReviewCardMain() {
        _classCallCheck(this, ReviewCardMain);

        return _possibleConstructorReturn(this, (ReviewCardMain.__proto__ || Object.getPrototypeOf(ReviewCardMain)).apply(this, arguments));
    }

    _createClass(ReviewCardMain, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "p",
                null,
                "test: just loaded ReviewCardMain"
            );
        } // end of render

    }]);

    return ReviewCardMain;
}(React.Component); // end of class

var ToggleCardView = function (_React$Component3) {
    _inherits(ToggleCardView, _React$Component3);

    function ToggleCardView() {
        _classCallCheck(this, ToggleCardView);

        return _possibleConstructorReturn(this, (ToggleCardView.__proto__ || Object.getPrototypeOf(ToggleCardView)).apply(this, arguments));
    }

    _createClass(ToggleCardView, [{
        key: "render",

        /*
            constructor(props) {
                super(props);
                this.handleStartReviewClick = this.handleStartReviewClick().bind(this);
                this.handleAddCardClick = this.handleAddCardClick().bind(this);
                this.state = {isReviewing: false};
            }
        
            handleStartReviewClick() {
                this.setState({isReviewing: true});
            }
        
            handleAddCardClick() {
                this.setState({isReviewing: false});
            }
        */

        value: function render() {
            var isReviewing = true;
            var currentView = void 0;
            if (isReviewing) {
                currentView = React.createElement(AddView, null);
            } else {
                currentView = React.createElement(ReviewView, null);
            }

            return currentView;
        } // end of render

    }]);

    return ToggleCardView;
}(React.Component); // end of class

function AddView() {
    return React.createElement(CreateCardMain, null);
}

function ReviewView() {
    return React.createElement(ReviewCardMain, null);
}

ReactDOM.render(React.createElement(ToggleCardView, null), document.getElementById('root'));