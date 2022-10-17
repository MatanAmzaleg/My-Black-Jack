'use strict'


var gDeck = []
var gDealerCards = {
    cards: [],
    count: 0
}
var gPlayerCards = {
    cards: [],
    count: 0
}




function createDeck() {
    const nums = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'A', 'J', 'Q', 'K']
    const shapes = ['C', 'D', 'H', 'S']
    var deck = []

    for (var i = 0; i < shapes.length; i++) {
        for (var j = 0; j < nums.length; j++) {
            deck.push(nums[j] + '-' + shapes[i])
        }
    }
    for (var i = 0; i < 3; i++) {
        gDeck += deck.concat(deck)
    }
    console.log(deck.concat(deck));
    gDeck = gDeck.split(",")
    return gDeck
}

function shuffleDeck() {
    let currentIndex = gDeck.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [gDeck[currentIndex], gDeck[randomIndex]] = [
            gDeck[randomIndex], gDeck[currentIndex]];
    }

    console.log(gDeck);
    return gDeck;
}

function firstDivision() {
    for (var i = 0; i < 2; i++) {
        var firstCard = gDeck.pop()
        var secondCard = gDeck.pop()
        gDealerCards.cards.push(firstCard)
        gDealerCards.count += getAmountFromStr(firstCard)
        gPlayerCards.cards.push(secondCard)
        gPlayerCards.count += getAmountFromStr(secondCard)
    }
    console.log('gDealerCards', gDealerCards.cards, 'gPlayerCards', gPlayerCards.cards, 'gDeck', gDeck);
    console.log(gDealerCards.count, gPlayerCards.count);
}

function getAmountFromStr(str) {
    var amount = str.charAt(0)
    if (amount === '1' && str.charAt(1) === '0') amount = 10
    if (amount === 'K' || amount === 'Q' || amount === 'J') amount = 10
    else if (amount === 'A') amount = 11
    return +amount
}

function getAllPlayersCards() {
    return [gDealerCards, gPlayerCards]
}

function hitButton() {
    var nextCard = gDeck.pop()
    gPlayerCards.cards.push(nextCard)
    gPlayerCards.count += getAmountFromStr(nextCard)
    console.log(gPlayerCards, nextCard);
    return nextCard
}

function checkIfOver21() {
    return (gPlayerCards.count > 21)
}

function restartGame() {
    gDealerCards.cards = [], gDealerCards.count = 0
    gPlayerCards.cards = [], gPlayerCards.count = 0
    createDeck()
    shuffleDeck(gDeck)
    firstDivision()
}

function checkIfDealerIsOver17() {
    return (gDealerCards.count >= 17)
}

function dealerTurn() { 
        var nextCard = gDeck.pop()
        gDealerCards.cards.push(nextCard)
        gDealerCards.count += getAmountFromStr(nextCard)
        return nextCard

}

function checkVictoriousPlayer(){
    if(gDealerCards.count > 21 || gPlayerCards.count > gDealerCards.count){
        document.querySelector('.modal-title').innerText = 'You Won!🏆'
        document.querySelector('.modal-description').innerHTML = 'Youre score is ' + gPlayerCards.count + ' dealer score is ' + gDealerCards.count
        $("#game-over-modal").modal('show');
    }
    else if(gPlayerCards.count === gDealerCards.count){
        document.querySelector('.modal-title').innerText = 'Its a Tie😁'
        document.querySelector('.modal-description').innerHTML = 'Youre score is ' + gPlayerCards.count + ' dealer score is ' + gDealerCards.count
        $("#game-over-modal").modal('show');
    }
    else if(gPlayerCards.count < gDealerCards.count){
        document.querySelector('.modal-title').innerText = 'You lose☹'
        document.querySelector('.modal-description').innerHTML = 'Youre score is ' + gPlayerCards.count + ' dealer score is ' + gDealerCards.count
        $("#game-over-modal").modal('show');
    }
}