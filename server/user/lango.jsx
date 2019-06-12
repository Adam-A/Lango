'use strict';
// An element to go into the DOM

function Card(props) {
    return <div className="textCard">
    	   {props.children}
	</div>;
}

class CardFront extends React.Component {
    render(props) {
        return(
            <div className='card-side side-front'>
               <img className = "flipImage" id = "flipImage" src = "assets/noun_Refresh_2310283.svg"></img>
                <p className='translatedTextReview'>{this.props.text}</p>
            </div>
        )
    }
}

// React component for the back side of the card
let rightAnswer;
let wrongAnswer;
class CardBack extends React.Component {

    componentDidMount() {
        rightAnswer = document.querySelector('.rightAnswerHidden');
        wrongAnswer = document.querySelector('.wrongAnswer');
    }
    displayAnswer(props) {
        return(
            <div>
                <div className='rightAnswerHidden'>
                    <p className='rightAnswerText'>{this.props.text.right}</p>
                </div>
                <p className='wrongAnswer'>{this.props.text.wrong}</p>
            </div>
        );
    }

    render(props) {
        let displayAnswer = this.displayAnswer();
        return(
            <div className='card-side side-back'>
                {displayAnswer}
            </div>
        )
    }
}

let card;
let image;
class ReviewCard extends React.Component {
/*        return <div className="textCardReview">
               {props.children}
        </div>;*/
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        card = document.querySelector('.card-body');
        image = document.querySelector('.flipImage');
    }

    flip = () => {
        console.log("test");
        if (!card) {
            console.log('null?')
        }
            card.classList.toggle('card-body-is-flipped');
            image.classList.toggle('flipImageIsFlipped');
    };
    render() {
        let answer = {
            right: this.props.phrase.right,
            wrong: this.props.phrase.wrong
        };
        return (
            <div className='textCardReview'>
             
                <div className='card-body' id='cardBody' onKeyPress={this.flip} onClick={this.flip}>
                    <CardBack text={answer}/>
            
                    <CardFront text={this.props.phrase.translated}/>
                </div>
            </div>
        )
    }

}

function InputCard(props) {
        return <div className="inputCardReview">
                {props.children}
            </div>;
}


function Txt(props) {
	 if (props.phrase == undefined) {
	    return <p>Text missing</p>;
	} else return <p className="translatedText">{props.phrase}</p>;
}


function TxtReview(props) {
    if (props.phrase == undefined) {
       return <p>Text missing</p>;
   } else return <p className="translatedTextReview">{props.phrase}</p>;
}



function StartReviewButton() {
    return (
        <button >Start Review</button>
    );
}

class CreateCardMain extends React.Component {

  constructor(props) {
      super(props);
      this.sourceText = "";
      this.targetText = "";
      this.state = { opinion: "Korean"}
      this.checkReturn = this.checkReturn.bind(this);
      this.saveCard = this.saveCard.bind(this);
  }

  componentDidMount() {
      // Call this only when virtual DOM has loaded the footerText id
      // with the textContent. Otherwise the below function tries assigning
      // the username retreived from database to a null value and breaks everything.
      displayUsernameFooter(this.props.objectInfo.username);
  }

  render() {
      let handleStartReviewClick = this.props.objectInfo.handleStartReviewClick;
      return (
      <main className = "main">

        <div className = "header">
        <button className = "startReviewButton" onClick = {() => handleStartReviewClick()}>Start Review</button>
            <h1 className = "headerText">Lango!</h1>
        </div>
        <div className = "middle">
            <div className="cardContainer">
            <Card>
                <textarea className = "inputEng" id="inputEng" placeholder = "English" onKeyPress={this.checkReturn} />
            </Card>

            <Card>
                <Txt phrase={this.state.opinion} />
            </Card>
            </div>

            <div className="saveContainer">
            <button className = "saveButton" onClick = {this.saveCard}>Save</button>
            </div>
        </div>

        <div className = "footer" id = "footer">
        <h1 className = "footerText" id = "footerText" >UserName</h1>
        </div>

      </main>

    );
    } // end of render function

    // onKeyPress function for the textarea element
    // When the charCode is 13, the user has hit the return key
    saveCard() {
        if (this.sourceText  && this.targetText ) {
            let url = `store?source=${this.sourceText.toLowerCase()}&target=${this.targetText}`;
            this.makeStoreAjaxRequest(url);
        } else {
            document.getElementById("inputEng").placeholder = "Can't store empty inputs!";
            //Let user know that they can't save non existant things!
        }
    }
     checkReturn(event) {
	 if (event.charCode == 13) {
        this.sourceText = document.getElementById("inputEng").value;
        document.getElementById("inputEng").value = '';
        let url = "translate?source=" + this.sourceText.trim().toLowerCase();
        this.makeTranslationAjaxRequest(url)

        }
	 }
      createAjaxRequest(method, url) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        return xhr;
      }

       makeTranslationAjaxRequest(url) {
        let xhr = this.createAjaxRequest('GET', url);
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
          if (object.target) {
            this.setState({opinion: object.target});
            this.targetText = object.target;
          } else {
            //error
          }
        }.bind(this);

        xhr.onerror = function() {
          alert('Error: could not make the request.');
        };

        xhr.send();
      }

       makeStoreAjaxRequest(url) {
          let xhr = this.createAjaxRequest('GET', url);
          if (!xhr) {
          alert('Ajax not supported');
          return;
          }

          xhr.onload = function() {
          //Get JSON string and turn into object.
          let responseStr = xhr.responseText;
          console.log(responseStr);
          let object = JSON.parse(responseStr);
          //Then call the function that displays
          //the returned JSON text on the page.
          console.log(object);
	  document.getElementById("inputEng").placeholder = object.msg;
          };

          xhr.onerror = function() {
          alert('Error: could not make the request.');
          };

          xhr.send();
      }


  } // end of class

class ReviewCardMain extends React.Component {
  constructor(props) {
    super(props);
    this.sourceText = "";
    this.targetText = "";
    this.state = {
        cardIndex: 0,
        opinion: (this.props.objectInfo.cards[0]) ? this.props.objectInfo.cards[0].target : "Korean"
    }
    //this.checkReturn = this.checkReturn.bind(this);
    //this.saveCard = this.saveCard.bind(this);
  }

  // test
  componentDidMount() {
      // Call this only when virtual DOM has loaded the footerText id
      // with the textContent. Otherwise the below function tries assigning
      // the username retreived from database to a null value and breaks everything.
      displayUsernameFooter(this.props.objectInfo.username);
      this.setState({
          cardIndex: 0,
          opinion: (this.props.objectInfo.cards[0]) ? this.props.objectInfo.cards[0].target : "Korean"
      });
  }

    render() {
        let handleStartReviewClick = this.props.objectInfo.handleStartReviewClick;
        let answer = {
            translated: this.state.opinion,
            right: "CORRECT!",
            wrong: this.props.objectInfo.cards[this.state.cardIndex].source
        };

        if (this.props.objectInfo.cards[0]) {
            console.log("Testing props: ", this.props.objectInfo.cards[0].target);
        }
        return (


                <main className = "main">

          <div className = "header">
          <button className = "addButton" onClick = {() => handleStartReviewClick()}>Add</button>
              <h1 className = "headerText">Lango!</h1>
          </div>
          <div className = "middleReview">
              <div className="cardContainerReview">

              <ReviewCard phrase={answer}/>

              <InputCard>
                  <textarea className = "inputEngReview" id="inputEngReview" placeholder = "English" onKeyPress={this.checkCorrect}/>
              </InputCard>
              </div>

              <div className="nextContainerReview">
              <button className = "nextButtonReview" onClick = {this.nextCard} >Next</button>
              </div>
          </div>

          <div className = "footerReview" id = "footer">
          <h1 className = "footerText" id = "footerText" >UserName</h1>
          </div>

        </main>


        );
    } // end of render

    nextCard = () => {
        rightAnswer.classList.add('rightAnswerHidden');
        rightAnswer.classList.remove('rightAnswer');

        wrongAnswer.classList.add('wrongAnswer');
        wrongAnswer.classList.remove('wrongAnswerHidden');
        if (this.props.objectInfo.cards.length == 0) {
            alert("Add cards first before reviewing!");
        }
        else {
            if (this.state.cardIndex == this.props.objectInfo.cards.length - 1) {
                this.setState({
                    cardIndex: 0,
                    opinion: this.props.objectInfo.cards[0].target
                });
            } else {
                this.setState({
                    cardIndex: this.state.cardIndex + 1,
                    opinion: this.props.objectInfo.cards[this.state.cardIndex + 1].target,
                });
            }
        }
    }; // end of function

    checkCorrect = () => {
        if (event.charCode == 13) {
            let currentText = document.getElementById("inputEngReview").value.trim().toLowerCase();
            document.getElementById("inputEngReview").value = '';
            if (this.props.objectInfo.cards.length == 0) {
                alert("Add cards first before reviewing!");
            } else {


                let originalSource = this.props.objectInfo.cards[this.state.cardIndex].source;
                if (currentText === originalSource) {
                    console.log("Correct!");
                    console.log("The source text was " + originalSource);
                    console.log("and the input text was " + currentText);
                    rightAnswer.classList.add('rightAnswer');
                    rightAnswer.classList.remove('rightAnswerHidden');

                    wrongAnswer.classList.add('wrongAnswerHidden');
                    wrongAnswer.classList.remove('wrongAnswer');
                  
                    card.classList.toggle('card-body-is-flipped');
                    image.classList.toggle('flipImageIsFlipped');
                    //got it correct, increment db
                } else {
                    console.log("Wrong!");
                    console.log("The source text was " + originalSource);
                    console.log("and the input text was " + currentText);
                    rightAnswer.classList.add('rightAnswerHidden');
                    rightAnswer.classList.remove('rightAnswer');

                    wrongAnswer.classList.add('wrongAnswer');
                    wrongAnswer.classList.remove('wrongAnswerHidden');
                    //wrong
                }
            }
            // Play the CSS flip animation.
         
            // let url = "translate?source=" + this.sourceText.toLowerCase();
            // this.makeTranslationAjaxRequest(url)
        }
    }

} // end of class


let latestCard = false;

class ToggleCardView extends React.Component {

    constructor(props) {
        super(props);

        // this.handleAddCardClick = this.handleAddCardClick().bind(this);
        this.state = {
            isReviewing: true,
            username: "placeholder",
            cardList: null
            // cardList: [{target: "You should not be seeing this!"}]
        };

    }

    handleStartReviewClick() {
        latestCard = false;
        this.setState({
            isReviewing: !this.state.isReviewing,
            cardList: null

        });
    }

    createAjaxRequestToggle(method, url) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        return xhr;
    }

    makeDataAjaxRequestToggle(url) {
        let xhr = this.createAjaxRequestToggle('GET', url);
        if (!xhr) {
            alert('Ajax not supported');
            return;
        }
        xhr.onload = function() {
            //Get JSON string and turn into object.
            let responseStr = xhr.responseText;
            let object = JSON.parse(responseStr);
            //Then call the function that displays
            console.log(object);
            //the returned JSON text on the page.
            if (object.username && object.id) {
                console.log("Is cardList undefined? Let's see: ", object.cards);
                if (!latestCard) {
                    latestCard = true;
                    this.setState({
                        cardList: object.cards,
                        username: object.username
                    });
                }
            } else {
                //error
            }
        }.bind(this);

        xhr.onerror = function() {
            alert('Error: could not make the request.');
        };

        xhr.send();

    } // end of function

/*
    handleAddCardClick() {
        this.setState({isReviewing: false});
    }
*/

    // When the AJAX request for user data finishes,
    // this will run and update the cardList state.

    // TODO: check if user has 0 cards
    render() {
        let handleStartReviewClick = this.handleStartReviewClick;
        const isReviewing = this.state.isReviewing;
        let currentView;
        let objectInfo = {
            cards : this.state.cardList,
            handleStartReviewClick : handleStartReviewClick.bind(this),
            username: this.state.username
        };
        if (this.state.cardList) {
            if (isReviewing) {
                console.log("Inside togglecardview: testing for objectInfo: ", objectInfo.cards);
                // displayUsernameFooter(this.state.username);
                currentView = <ReviewCardMain objectInfo={objectInfo}/>;
            } else {
                currentView = <CreateCardMain objectInfo={objectInfo}/>;
            }

            return (
                currentView
            );
        }
        else {
            this.makeDataAjaxRequestToggle("request");
            return <p>Waiting...</p>

        }
    } // end of render
} // end of class

function createAjaxRequest(method, url) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    return xhr;
}

function makeDataAjaxRequest(url) {
        let xhr = createAjaxRequest('GET', url);
        if (!xhr) {
            alert('Ajax not supported');
            return;
        }
        xhr.onload = function() {
            //Get JSON string and turn into object.
            let responseStr = xhr.responseText;
            let object = JSON.parse(responseStr);
            // latestCard = object.cards;
            //Then call the function that displays
            //the returned JSON text on the page.
            if (object.username && object.id) {
                console.log("Let's see if cardList is undef: ", object.cards);
                // this.setState({cardList: object.cards});
                displayUsernameFooter(object.username, function() {
                    // this.setState({cardList: object.cards});
                    console.log("Last line of ajax callback");
                });
            } else {
                //error
            }
        }.bind(this);

        xhr.onerror = function() {
            alert('Error: could not make the request.');
        };

        xhr.send();

} // end of function

function displayUsernameFooter(translatedText) {
    let outputText = document.getElementById("footerText");
    outputText.textContent = translatedText;
}


ReactDOM.render(
    <ToggleCardView />,
    document.getElementById('root')
);