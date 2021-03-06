//variables that hold the value
let cards = [];
let suits = ["spades", "hearts", "clubs", "diams"];
let numb = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

let playerCard = [];
let dealerCard = [];

let cardCount = 0;
let mydollars = 100;
let endplay = false;

//assigning object to variable so I can it call after
let message = document.getElementById('message');
let output = document.getElementById('output');
let dealerHolder = document.getElementById('dealerHolder');
let playerHolder = document.getElementById('playerHolder');
let pValue = document.getElementById('pValue');
let dValue = document.getElementById('dValue');
let dollarValue = document.getElementById('dollars');


//this event listener is made for user to change bet amount 
document.getElementById('mybet').onchange = function () {
    if (this.value < 0) {
        this.value = 0;
    }
    if (this.value > mydollars) {
        this.value = mydollars;
    }
    message.innerHTML = "Bet changed to $" + this.value;
}


//Building deck of cards by looping through arrays 
for (s in suits) {
    let suit = suits[s][0].toUpperCase();
    let bgcolor = (suit == "S" || suit == "C") ? "black" : "red";
    for (n in numb) {
        let cardValue = (n > 9) ? 10 : parseInt(n) + 1;
        let card = {
            suit: suit,
            icon: suits[s],
            bgcolor: bgcolor,
            cardnum: numb[n],
            cardvalue: cardValue
        }
        cards.push(card);
    }
}


function Start() {
    shuffleDeck(cards);
    dealNew();
    document.getElementById('start').style.display = 'none';
    dollarValue.innerHTML = mydollars;
}


// Dispalying to user messages acoding to the game outcome
function dealNew() {
    dValue.innerHTML = "?";
    playerCard = [];
    dealerCard = [];
    dealerHolder.innerHTML = "";
    playerHolder.innerHTML = "";
    let betvalue = document.getElementById('mybet').value;
    mydollars = mydollars - betvalue;
    document.getElementById('dollars').innerHTML = mydollars;
    document.getElementById('myactions').style.display = 'block';
    message.innerHTML = "Get up to 21 and beat the dealer to win.<br>Current bet is $" + betvalue;
    document.getElementById('mybet').disabled = true;
    document.getElementById('maxbet').disabled = true;
    deal();
    document.getElementById('btndeal').style.display = 'none';
}


//this function is preventing from going over the max of cards
function redeal() {
    cardCount++;
    if (cardCount > 40) {
        console.log("NEW DECK");
        shuffleDeck(cards);
        cardCount = 0;
        message.innerHTML = "New Shuffle";
    }
}

//Dealing two cards for each dealer and player
function deal() {
    for (x = 0; x < 2; x++) {
        dealerCard.push(cards[cardCount]);
        dealerHolder.innerHTML += cardOutput(cardCount, x);
        if (x == 0) {
            //covering one dealer cards
            dealerHolder.innerHTML += '<div id="cover" style="left:100px;"></div>';
        }
        redeal();
        playerCard.push(cards[cardCount]);
        playerHolder.innerHTML += cardOutput(cardCount, x);
        redeal();
    }
    let playervalue = checktotal(playerCard);

    //checking if player got Blackjack
    if (playervalue == 21 && playerCard.length == 2) {
        playend();
    }
    pValue.innerHTML = playervalue;
}


function cardOutput(n, x) {
    let hpos = (x > 0) ? x * 60 + 100 : 100;
    return '<div class="icard ' + cards[n].icon + '" style="left:' + hpos + 'px;">  <div class="top-card suit">' + cards[n].cardnum + '<br></div>  <div class="content-card suit"></div>  <div class="bottom-card suit">' + cards[n].cardnum +
        '<br></div> </div>';
}

//
function maxbet() {
    document.getElementById('mybet').value = mydollars;
    message.innerHTML = "Bet changed to $" + mydollars;
}


//Function will take player choice and will tale it ad an argumnet that will pass through
//We are taking this argument and passing through 'switch' statement
function cardAction(a) {
    console.log(a);
    switch (a) {
        case 'hit':
            playucard();
            break;
        case 'hold':
            playend();
            break;
        case 'double':
            let betvalue = parseInt(document.getElementById('mybet').value);
            if ((mydollars - betvalue) < 0) {
                betvalue = betvalue + mydollars;
                mydollars = 0;
            } else {
                mydollars = mydollars - betvalue;
                betvalue = betvalue * 2;
            }
            document.getElementById('dollars').innerHTML = mydollars;
            document.getElementById('mybet').value = betvalue;
            playucard();
            playend();
            break;
        default:
            console.log('done');
            playend();
    }
}


//adding new card to a player card array
function playucard() {
    playerCard.push(cards[cardCount]);
    //updaing HTML
    playerHolder.innerHTML += cardOutput(cardCount, (playerCard.length - 1));
    //updating cards to make sure we have enough cards incrementing
    redeal();
    let rValu = checktotal(playerCard);
    pValue.innerHTML = rValu;
    if (rValu > 21) {
        message.innerHTML = "busted!";
        playend();
    }
}

function playend() {
    endplay = true;
    document.getElementById('cover').style.display = 'none';
    document.getElementById('myactions').style.display = 'none';
    document.getElementById('btndeal').style.display = 'block';
    document.getElementById('mybet').disabled = false;
    document.getElementById('maxbet').disabled = false;
    message.innerHTML = "Game Over<br>";
    let payoutJack = 1;
    let dealervalue = checktotal(dealerCard);
    dValue.innerHTML = dealervalue;

    while (dealervalue < 17) {
        dealerCard.push(cards[cardCount]);
        dealerHolder.innerHTML += cardOutput(cardCount, (dealerCard.length - 1));
        redeal();
        dealervalue = checktotal(dealerCard);
        dValue.innerHTML = dealervalue;
    }

    //checking who won
    let playervalue = checktotal(playerCard);
    if (playervalue == 21 && playerCard.length == 2) {
        message.innerHTML = "Player Blackjack";
        payoutJack = 1.5;
    }

    let betvalue = parseInt(document.getElementById('mybet').value) * payoutJack;
    if ((playervalue < 22 && dealervalue < playervalue) || (dealervalue > 21 && playervalue < 22)) {
        message.innerHTML += '<span style="color:red;">You WIN! You won $' + betvalue + '</span>';
        mydollars = mydollars + (betvalue * 2);
    } else if (playervalue > 21) {
        message.innerHTML += '<span style="color:purple;">Dealer Wins! You lost $' + betvalue + '</span>';
    } else if (playervalue == dealervalue) {
        message.innerHTML += '<span style="color:blue;">PUSH</span>';
        mydollars = mydollars + betvalue;
    } else {
        message.innerHTML += '<span style="color:red;">Dealer Wins! You lost $' + betvalue + '</span>';
    }
    pValue.innerHTML = playervalue;
    dollarValue.innerHTML = mydollars;
}


//Checking total of array values 
function checktotal(arr) {
    let rValue = 0;
    let aceAdjust = false;
    for (let i in arr) {
        if (arr[i].cardnum == 'A' && !aceAdjust) {
            aceAdjust = true;
            rValue = rValue + 10;
        }
        rValue = rValue + arr[i].cardvalue;
    }

    if (aceAdjust && rValue > 21) {
        rValue = rValue - 10;
    }

    return rValue;
}


//Shuffling deck of cards, using Math.random that will return a random order
function shuffleDeck(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function outputCard() {
    output.innerHTML += "<span style='color:" + cards[cardCount].bgcolor + "'>" + cards[cardCount].cardnum + "&" + cards[cardCount].icon + ";</span>  ";
}