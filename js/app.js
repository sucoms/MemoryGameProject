// objects
let cardsArray = ['fa-anchor', 'fa-anchor', 'fa-bicycle', 'fa-bolt', 'fa-cube', 'fa-diamond', 'fa-diamond', 'fa-plane', 'fa-leaf', 'fa-bomb', 'fa-leaf', 'fa-bomb', 'fa-bolt', 'fa-bicycle', 'fa-plane', 'fa-cube'];

let lock = false;
let firstClick = null, secondClick = null;
// clicking n1 & n2
let li1 = null, li2 = null;
//moving
let turns = 0;
let lastturns = document.querySelector('#final-turns');
let lastTime = document.querySelector('#final-time');
let counter = document.querySelector('.turns');
let machedCard = 0;

// stars
const allStars = document.querySelectorAll('.fa-star');
console.log(allStars, "STAR");

// Time
let time = document.querySelector('.displayTime');
let startGame = 0;
let gameInterval;

let modal = document.querySelector('.pop-up')

const buttonRestart = document.getElementsByClassName('restart');

// functions
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


//Timer found here and ispired by it https://stackoverflow.com/questions/20618355/the-simplest-possible-javascript-countdown-timer
function timer() {
    let minutes = 0;
    let seconds = 0;
    gameInterval = setInterval(function () {
        seconds = parseInt(seconds, 10) + 1;
        minutes = parseInt(minutes, 10);
        if (seconds >= 60) {
            minutes += 1;
            seconds = 0;
        }

        seconds = seconds < 10 ? "0" + seconds : seconds;
        minutes = minutes < 10 ? "0" + minutes : minutes;

        time.innerHTML = minutes + ":" + seconds;
        lastTime.textContent = time.textContent;
    }, 1000);
}

function endGame() {
    clearInterval(gameInterval);
}


function displaySymbol(el) {
    el.classList.add("open");
    el.classList.add("show");
}


function closeUnmatched() {
    let els = document.getElementsByClassName('unMatch');
    Array.from(els).forEach(el => {
        el.classList.remove('unMatch');
        el.classList.remove('show');
        el.classList.remove('open');
    });
}


function clickRestart() {
    firstClick = null;
    secondClick = null;
}

function rating() {
    if (turns === 15) {
        document.querySelector('.gold').classList.remove('hide');
        return true;
    } else if (turns === 20) {
        allStars[0].classList.add('hide')
        allStars[3].classList.add('hide');
        document.querySelector('.silver').classList.remove('hide');
        document.querySelector('.gold').classList.add('hide');
    } else if (turns === 25) {
        allStars[1].classList.add('hide');
        allStars[4].classList.add('hide');
        document.querySelector('.bronze').classList.remove('hide');
        document.querySelector('.silver').classList.add('hide');

    }
}


function turnsCounter() {
    turns++;
    counter.innerHTML = turns;
    lastturns.innerHTML = turns;
    if (turns <= 25 && turns !== 0) {
        rating()
    }
}


function restartValue() {
    // show again stars
    for (let i = 0; i < 3; i++) {
        allStars[i].classList.remove('hide');
    }
    //show again cups
    for (let i = 0; i < 3; i++) {
        allStars[i].classList.remove('hide');
    }

    machedCard = 0;
    startGame = 0;
    turns = 0;
    counter.textContent = 0;
    li1 = null;
    li2 = null;
    modal.classList.remove('showed');
    modal.classList.add('hide');
}

//how the game works


// newCard
const newCard = cardClass => {
    // we create a new li element with a class "card"
    let li = document.createElement("li");
    li.classList.add("card");
    // i element aplied to fa class and aplied to cards array
    let icon = document.createElement("i");
    li.appendChild(icon);
    icon.classList.add("fa");
    icon.classList.add(cardClass);
    return li;
};


const pickCard = card => {

    card.addEventListener('click', function (e) {
        // click to start game
        if (startGame === 0) {
            timer();
            startGame++;
        }

        let li = e.currentTarget;
        //ignoring opened ones
        if (lock || li.classList.contains('open') && li.classList.contains('show')) {
            return true;
        }

        let icon = li.getElementsByClassName('fa')[0].className;

        if (firstClick === null && secondClick === null) {

            firstClick = icon;
            li1 = li;

        } else if (firstClick !== null && secondClick === null) {
            secondClick = icon;
            li2 = li;
            if (firstClick === secondClick) {
                li1.classList.add('match');
                li1.classList.add('true');
                li2.classList.add('match');
                li2.classList.add('true');
                machedCard++;
                if (machedCard === 8) {
                    endGame()
                    modal.classList.remove('hide')
                    modal.classList.add('showed')
                }

            } else {
                li1.classList.add('unMatch');
                li2.classList.add('unMatch');
                setTimeout(function () {
                    closeUnmatched()
                }, 750)
            }
            turnsCounter();
            clickRestart();
        }
        displaySymbol(li);
    })
};


function gameStart() {
    restartValue();
    // restart, stopping the time, clearing everything, empty board
    clickRestart();
    endGame();
    time.innerHTML = '00:00';
    let list = document.getElementsByClassName("deck");
    list[0].innerHTML = '';

    // shuffle
    let cardsShuffled = shuffle(cardsArray);

    for (let card of cardsShuffled) {
        let li = newCard(card);
        list[0].appendChild(li);
    }
    let cards = list[0].getElementsByClassName("card")
    for (let card of cards) {
        pickCard(card);
    }

}

gameStart();


Array.from(buttonRestart).forEach(el => {
    el.addEventListener('click', function () {
        gameStart()
    })
});
