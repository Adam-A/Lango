'use strict';
// An element to go into the DOM

let sourceText = "";
let targetText = "";

function Card(props) {
    return <div className="textCard">
    	   {props.children}
	</div>;
	}
	

function Txt(props) {
	 if (props.phrase == undefined) {
	    return <p>Text missing</p>;
	    }
	 else return <p>{props.phrase}</p>;
     }

function Button(){
    return <button onClick={makeStoreAjaxRequest}> Save</button>;
}


class CreateCardMain extends React.Component {

  constructor(props) {
      super(props);
      this.state = { opinion: "korean"}
      this.checkReturn = this.checkReturn.bind(this);
      }

  render() {return (
      <main>
    
        <div className = "header">
            <h1 className = "headerText">Lango!</h1>
        </div>

        <Card>
 	        <textarea className = "inputEng" id="inputEng" placeholder = "English" onKeyPress={this.checkReturn} />
        </Card>

        <Card>
 	        <Txt phrase={this.state.opinion} /> 
        </Card>

        <Button className = "saveButton"></Button>
      
        <div className = "footer">
            <h1 className = "footerText">Test</h1>
        </div>

      </main>
      );
    } // end of render function 

    // onKeyPress function for the textarea element
    // When the charCode is 13, the user has hit the return key
     checkReturn(event) {
	 if (event.charCode == 13) {
        let newPhrase = document.getElementById("inputEng").value;
        document.getElementById("inputEng").value = '';
        let url = "translate?source=" + newPhrase;
        makeTranslationAjaxRequest(url)
      
        /*we will do translation shit here*/
	    this.setState({opinion: targetText} );
	    }
	 }


  } // end of class


ReactDOM.render(
    <CreateCardMain />,
    document.getElementById('root')
);


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
