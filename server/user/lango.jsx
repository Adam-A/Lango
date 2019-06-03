'use strict';
// An element to go into the DOM
import React from 'react';

function Card(props) {
    return <div className="textCard">
    	   {props.children}
	</div>;
	}
	
function DisplayCard(props) {
    return <div className={"textCard"}>Test</div>;
}

function Txt(props) {
	 if (props.phrase == undefined) {
	    return <p>Text missing</p>;
	} else return <p className="translatedText">{props.phrase}</p>;
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

  render() {return (
      <main className = "main">
          
        <div className = "header">
        <button className = "startReviewButton" >Start Review</button>
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
        <h1 className = "footerText" >UserName</h1>
        </div>

      </main>

    );
    } // end of render function 

    // onKeyPress function for the textarea element
    // When the charCode is 13, the user has hit the return key
    saveCard() {
        if (this.sourceText  && this.targetText ) {
            let url = `store?source=${this.sourceText}&target=${this.targetText}`;
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
        let url = "translate?source=" + this.sourceText;
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
    render() {return (
        <main className = "main">

            <div className = "header">
                <button className = "addCardButton" >Add</button>
                <h1 className = "headerText">Lango!</h1>
            </div>
            <div className = "middle">
                <div className="cardContainer">
                    <DisplayCard>
                    </DisplayCard>

                    <DisplayCard>
                    </DisplayCard>
                </div>

                <div className="nextContainer">
                    <button className = "nextButton" /* onClick = */ >Next</button>
                </div>
            </div>

            <div className = "footer" id = "footer">
                <h1 className = "footerText" >UserName</h1>
            </div>

        </main>

    );
    } // end of render function
}

function ToggleCardsView(props) {
    const isCreating = props.view;
    if (isCreating) {
        return <CreateCardMain/>;
    }
    else {
        return <ReviewCardMain/>;
    }
}

ReactDOM.render(
    <ToggleCardsView view={true}/>,
    document.getElementById('root')
);