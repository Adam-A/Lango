To login, please head to http://server162.site:51490/login.html

Our server .js file is "flashcardServer.js"

EDIT AS OF 12 JUNE 2019: Re-submission with correct code and issue explained
Original problem: After logging in, browser simply returns a blank page.

The reason why the redirect was not happening was our mistake.
The way our rendering works is that it performs a react toggle between
two different classes: one that displays the page where you review cards,
and one that displays the page where you create cards to add to your deck.
The review card class displays card frontside text as well as backside text.
Both classes are rendered by passing in props to them from a parent class
called ToggleCardView that controls this displaying logic.

What happened was that we did not have a check in place if the user has no cards upon
rendering the review card page's backside. More specifically, in its constructor,
we had these lines of code:

let answer = {
    translated: this.state.opinion,
    right: "CORRECT!",
    wrong: this.props.objectInfo.cards[this.state.cardIndex].source
};

Notably, objectInfo is passed in as props, and objectInfo itself contains a property called cards.
That is where we store all of our cards retreived from the database as an array. 

However, in the case where the user created no cards to begin with, then objectInfo.cards is simply
an empty array. Thus, when it attempts to access the .source property of .cards, it gets a null value error
because the array is empty: it has no properties like .source!

After inspecting this in the chrome debugger, this is without a doubt the cause of the blank redirect.
A simple fix then is as follows:

let answer = {
    translated: this.state.opinion,
    right: "CORRECT!",
    wrong: (this.props.objectInfo.cards.length == 0)
            ? "Add new cards first."
            : this.props.objectInfo.cards[this.state.cardIndex].source
};

Here, we just simply now have a check for the length of the card array.
If it is 0, then that means no new cards have been added. Thus, select placeholder text to display
on the review card backside. Otherwise, proceed as normal once a card has been added.