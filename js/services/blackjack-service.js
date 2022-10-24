'use strict'


const COINS_STORAGE_KEY = 'coinsDB'

var gIsSplitMode = false
var gDealerAcesCounted = 0
var gPlayerAcesCounted = 0
var gPlayerSplitAcesCounted = 0
var gDeck = []
var gDealerCards = {
    cards: [],
    count: 0,
    acesCount: 0
}
var gPlayerCards = {
    cards: [],
    count: 0,
    acesCount: 0
}

var gPlayerSplitCards = {
    cards: [],
    count: 0,
    acesCount: 0
}

var gCoins = 500

function resetAcesCount() {
    gIsSplitMode = false
    gPlayerSplitAcesCounted = 0
    gDealerAcesCounted = 0
    gPlayerAcesCounted = 0
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
}

function getAmountFromStr(str) {
    var amount = str.charAt(0)
    if (amount === '1' && str.charAt(1) === '0') amount = 10
    if (amount === 'K' || amount === 'Q' || amount === 'J') amount = 10
    else if (amount === 'A') amount = 11
    return +amount
}

function getAllPlayersCards() {
    return [gDealerCards, gPlayerCards, gPlayerSplitCards]
}

function hitButton() {
    var nextCard = gDeck.pop()
    gPlayerCards.cards.push(nextCard)
    gPlayerCards.count += getAmountFromStr(nextCard)
    return nextCard
}

function splitHitButton() {
    var nextCard = gDeck.pop()
    gPlayerSplitCards.cards.push(nextCard)
    gPlayerSplitCards.count += getAmountFromStr(nextCard)
    return nextCard
}

function checkIfOver21() {
    return (gPlayerCards.count > 21)
}

function checkIfSplitOver21() {
    return (gPlayerSplitCards.count > 21)
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

function checkVictoriousPlayer() {
    if (gDealerCards.count > 21 || (gPlayerCards.count > gDealerCards.count && gPlayerCards.count < 22)) youWon()
    else if (gPlayerCards.count === gDealerCards.count) itsATie()
    else if (gPlayerCards.count < gDealerCards.count) youLost()
}

function countDealerAceCorrectly() {
    if (gDealerCards.count > 21) {
        for (var i = 0; i < gDealerCards.cards.length; i++) {
            if (gDealerCards.cards[i].charAt(0) === 'A') {
                if (gDealerCards.acesCount > gDealerAcesCounted) {
                    gDealerAcesCounted++
                    gDealerCards.count -= 10
                }

            }
        }
    }
}

function countPlayerAceCorrectly() {
    if (gPlayerCards.count > 21) {
        for (var i = 0; i < gPlayerCards.cards.length; i++) {
            if (gPlayerCards.cards[i].charAt(0) === 'A') {
                if (gPlayerCards.acesCount > gPlayerAcesCounted) {
                    gPlayerAcesCounted++
                    gPlayerCards.count -= 10
                }

            }
        }
    }

}

function countPlayerSplitAceCorrectly() {
    if (gPlayerSplitCards.count > 21) {
        for (var i = 0; i < gPlayerSplitCards.cards.length; i++) {
            if (gPlayerSplitCards.cards[i].charAt(0) === 'A') {
                if (gPlayerSplitCards.acesCount > gPlayerSplitAcesCounted) {
                    gPlayerSplitAcesCounted++
                    gPlayerSplitCards.count -= 10
                }

            }
        }
    }

}


function countDealerAces() {
    console.log('counting');
    var aceCount = 0;
    for (var i = 0; i < gDealerCards.cards.length; i++) {
        if (gDealerCards.cards[i].charAt(0) === 'A') {
            aceCount++
        }
    }
    gDealerCards.acesCount = aceCount
    console.log('gDealerCards.acesCount', gDealerCards.acesCount);
}


function countPlayerAces() {
    var aceCount = 0;
    for (var i = 0; i < gPlayerCards.cards.length; i++) {
        if (gPlayerCards.cards[i].charAt(0) === 'A') {
            console.log(gPlayerCards.cards[i].charAt(0));
            aceCount++
        }
    }
    gPlayerCards.acesCount = aceCount
    console.log('gPlayerCards.acesCount', gPlayerCards.acesCount)
}

function countPlayerSplitAces() {
    var aceCount = 0
    for (var i = 0; i < gPlayerSplitCards.cards.length; i++) {
        if (gPlayerSplitCards.cards[i].charAt(0) === 'A') {
            aceCount++
        }
    }
    gPlayerSplitCards.acesCount = aceCount
}

function checkBlackJack() {
    if (gPlayerCards.count === 21 && gDealerCards !== 21) renderBlackJack()
}

function checkSplit() {
    if (gPlayerCards.cards[0].charAt(0) === gPlayerCards.cards[1].charAt(0)) {
        alert('split')
        if(confirm('do you want to split?')){
                gIsSplitMode = true
        gPlayerSplitCards.cards.push(gPlayerCards.cards[0])
        var poppedCard = gPlayerCards.cards.pop()
        var amount = getAmountFromStr(poppedCard)
        gPlayerCards.count -= amount
        gPlayerSplitCards.count = getAmountFromStr(gPlayerSplitCards.cards[0])
        renderSplit()
        renderSplitCards()
        renderScores()
        } return
    
    }
}

function checkIfSplitMode() {
    return gIsSplitMode
}

function reduceChips(chipsNum){
    gCoins -= chipsNum
    return gCoins
}