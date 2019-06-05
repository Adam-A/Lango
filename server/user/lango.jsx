'use strict';
// An element to go into the DOM

function Card(props) {
    return <div className="textCard">
    	   {props.children}
	</div>;
    }
    

function ReviewCard(props) {
        return <div className="textCardReview">
               {props.children}
        </div>;
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

  render() {
      let handleStartReviewClick = this.props.handleStartReviewClick;
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
        let url = "translate?source=" + this.sourceText.toLowerCase();
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
    this.state = { opinion: "Korean"}
    //this.checkReturn = this.checkReturn.bind(this);
    //this.saveCard = this.saveCard.bind(this);
    }

    render() {
        let handleStartReviewClick = this.props.props.handleStartReviewClick;
        console.log("Testing props: ", this.props);
        this.setState({opinion: this.props.props.cardList[0].target});
        return (
            
        
                <main className = "main">
          
          <div className = "header">
          <button className = "addButton" onClick = {() => handleStartReviewClick()}>Add</button>
              <h1 className = "headerText">Lango!</h1>
          </div>
          <div className = "middleReview">
              <div className="cardContainerReview">
             
  
              <ReviewCard>

                  <TxtReview phrase={this.state.opinion}/>
                  <img className = "flipImage" src = "assets/noun_Refresh_2310283.svg"></img>
              </ReviewCard>

              <InputCard>
                  <textarea className = "inputEngReview" id="inputEng" placeholder = "English" /> {/*onKeyPress={this.checkReturn} */}
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

    nextCard() {

        //next card work goes here
    }
} // end of class


class ToggleCardView extends React.Component {

    constructor(props) {
        super(props);
    
        // this.handleAddCardClick = this.handleAddCardClick().bind(this);
        this.state = {
            isReviewing: true,
            cardList: []
        };
        
    }

    handleStartReviewClick() {
     
        this.setState({isReviewing: !this.state.isReviewing});
    }
/*
    handleAddCardClick() {
        this.setState({isReviewing: false});
    }
*/

    render() {
        makeDataAjaxRequest("request");
        let handleStartReviewClick = this.handleStartReviewClick;
        const isReviewing = this.state.isReviewing;
        let currentView;
        let props = {
            cardList : this.cardList,
            handleStartReviewClick : handleStartReviewClick.bind(this)
        };
        if (isReviewing) {
            currentView = <ReviewCardMain props = {props} />;
        }
        else {
            currentView = <CreateCardMain props = {props} />;
        }

        return (
            
            currentView
        );
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
            //Then call the function that displays
            console.log(object);
            //the returned JSON text on the page.
            if (object.username && object.id) {
                this.setState({cardList: object.cards});
                displayUsernameFooter(object.username);
            } else {
                //error
            }
        };

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