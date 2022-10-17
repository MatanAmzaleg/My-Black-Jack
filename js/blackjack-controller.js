'use strict'


var gDealerHitInterval

function onInit() {
    createDeck()
    shuffleDeck(gDeck)
    firstDivision()
    renderCards()
}

function renderCards() {
    console.log(getAllPlayersCards());
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

}

function onHitBtn() {
    var nextCard = hitButton()
    var playerStrHTML = `
    <img class="card" src="img/cards/${nextCard}.png" alt="">
    `
    document.querySelector('.player-cards-container').innerHTML += playerStrHTML
    document.querySelector('.player-count-span').innerText = getAllPlayersCards()[1].count
    if (checkIfOver21()) {
        console.log(document.querySelector("#game-over-modal"));
        $("#game-over-modal").modal('show');
    }
}

function onAnotherGame() {
    restartGame()
    $("#game-over-modal").modal('hide');
    renderCards()
}

function onStayBtn() {
    var dealerFlippedCard = getAllPlayersCards()[0].cards[1]
    console.log(dealerFlippedCard);
    console.log(document.querySelector('.backed').src );
    document.querySelector('.backed').src = `img/cards/${dealerFlippedCard}.png`
    gDealerHitInterval = setInterval(onDealerTurn, 1000)

}

function onDealerTurn() {
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