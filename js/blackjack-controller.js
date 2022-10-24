'use strict'


var gDealerHitInterval

function onInit() {
    createDeck()
    shuffleDeck(gDeck)
    firstDivision()
    renderCards()
}

function renderCards() {
    var playerCards = getAllPlayersCards()[1].cards
    var dealerCards = getAllPlayersCards()[0].cards
    var playerStrHTML = `
    <img class="card" src="img/cards/${playerCards[0]}.png" alt="">
    <img class="card" src="img/cards/${playerCards[1]}.png" alt="">
    `
    document.querySelector('.player-cards-container').innerHTML = playerStrHTML
    document.querySelector('.player-count-span').innerText = getAllPlayersCards()[1].count

    var dealerStrHTML = `
<img class="card" src="img/cards/${dealerCards[0]}.png" alt="">
<img class="card backed" src="img/cards/BACK.png" alt="">
`
    document.querySelector('.dealer-cards-container').innerHTML = dealerStrHTML
    document.querySelector('.dealer-count-span').innerText = getAmountFromStr(getAllPlayersCards()[0].cards[0])

    checkBlackJack()
    setTimeout(checkSplit, 500)
}

function renderSplitCards(){
    var playerCards = getAllPlayersCards()[1].cards
    var playerSplitCards = getAllPlayersCards()[2].cards
    var playerStrHTML = `
    <img class="card" src="img/cards/${playerCards[0]}.png" alt="">
    `
    document.querySelector('.player-cards-container').innerHTML = playerStrHTML
    document.querySelector('.player-count-span').innerText = getAllPlayersCards()[1].count

    var playerSplitStrHTML = `
<img class="card" src="img/cards/${playerSplitCards[0]}.png" alt="">
`
    document.querySelector('.player-split-cards-container').innerHTML = playerSplitStrHTML
    document.querySelector('.player-count-split-span').innerText = getAllPlayersCards()[2].count

}

function onHitBtn() {
    var nextCard = hitButton()
    var playerStrHTML = `
    <img class="card" src="img/cards/${nextCard}.png" alt="">
    `
    document.querySelector('.player-cards-container').innerHTML += playerStrHTML
    document.querySelector('.player-count-span').innerText = getAllPlayersCards()[1].count
    countPlayerAces()
    countPlayerAceCorrectly()
    renderScores()
    if (checkIfOver21()) {
        $("#game-over-modal").modal('show');
    }
}

function onSplitHitBtn() {
    var nextCard = splitHitButton()
    var playerStrHTML = `
    <img class="card" src="img/cards/${nextCard}.png" alt="">
    `
    document.querySelector('.player-split-cards-container').innerHTML += playerStrHTML
    document.querySelector('.player-count-split-span').innerText = getAllPlayersCards()[2].count
    countPlayerSplitAces()
    countPlayerSplitAceCorrectly()
    renderScores()
    if (checkIfSplitOver21()) {
        $("#game-over-modal").modal('show');
        document.querySelector('.hand').innerHTML = ''
    }

}

function onAnotherGame() {
    resetAcesCount()
    restartGame()
    $("#game-over-modal").modal('hide');
    renderCards()
}

function onStayBtn() {
    var dealerFlippedCard = getAllPlayersCards()[0].cards[1]
    document.querySelector('.backed').src = `img/cards/${dealerFlippedCard}.png`
    gDealerHitInterval = setInterval(onDealerTurn, 1000)

}

function onDealerTurn() {
    countDealerAces()
    countDealerAceCorrectly()
    renderScores()
    if (!checkIfDealerIsOver17()) {
        var nextCard = dealerTurn()
        var dealerStrHTML = `
         <img class="card" src="img/cards/${nextCard}.png" alt="">
         `
        document.querySelector('.dealer-cards-container').innerHTML += dealerStrHTML
        document.querySelector('.dealer-count-span').innerText = getAllPlayersCards()[0].count
    } else {
        clearInterval(gDealerHitInterval)
        checkVictoriousPlayer()
    }
}

function youWon() {
    document.querySelector('.modal-title').innerText = 'You Won!🏆'
    document.querySelector('.modal-description').innerHTML = 'Youre score is ' + gPlayerCards.count + ' dealer score is ' + gDealerCards.count
    $("#game-over-modal").modal('show');
}

function itsATie() {
    document.querySelector('.modal-title').innerText = 'Its a Tie😁'
    document.querySelector('.modal-description').innerHTML = 'Youre score is ' + gPlayerCards.count + ' dealer score is ' + gDealerCards.count
    $("#game-over-modal").modal('show');
}

function youLost() {
    document.querySelector('.modal-title').innerText = 'You lost☹'
    document.querySelector('.modal-description').innerHTML = 'Youre score is ' + gPlayerCards.count + ' dealer score is ' + gDealerCards.count
    $("#game-over-modal").modal('show');
}

function renderBlackJack() {
    document.querySelector('.modal-title').innerText = 'BlackJack!!♦♥'
    document.querySelector('.modal-description').innerHTML = 'Youre score is ' + gPlayerCards.count + ' exactlly'
    $("#game-over-modal").modal('show');
}

function renderScores() {
    document.querySelector('.player-count-span').innerText = getAllPlayersCards()[1].count
    document.querySelector('.dealer-count-span').innerText = getAllPlayersCards()[0].count

    if (checkIfSplitMode()) {
        console.log('splitscore');
        console.log(getAllPlayersCards()[2].count);
        document.querySelector('.player-count-split-span').innerText = getAllPlayersCards()[2].count
    }
}

function renderSplit() {
    var strHTML =
        `
    <div class="hand">
    <h2>Extra hand: [<span class="player-count-split-span"></span>]</h2>
    <div class="player-split-cards-container">

    </div>
    <div class="buttons-div-row">
        <button onclick="onSplitHitBtn()" type="button" class="btn btn-dark">Hit!</button>
        <button onclick="onSplitStayBtn()" type="button" class="btn btn-dark">Stay</button>
    </div>
</div>
    `

    document.querySelector('.player-container').innerHTML += strHTML
}
