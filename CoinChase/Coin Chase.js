function isTouching(a, b) {
    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();

    return !(
        aRect.top + aRect.height < bRect.top ||
        aRect.top > bRect.top + bRect.height ||
        aRect.left + aRect.width < bRect.left ||
        aRect.left > bRect.left + bRect.width
    );
}

const player = document.querySelector(`#player`);
const copperCoin = document.querySelector(`#copper-coin`);
const silverCoin = document.querySelector(`#silver-coin`);
const goldCoin = document.querySelector(`#gold-coin`);
const counter = document.querySelector(`h1`);
let points = 0;
counter.innerText = `Score: ${points}`;

//getting value of pos without "px"
const extractPos = (pos) => {
    if(!pos) return 0;
    return parseInt(pos.slice(0,-2));
};
//movement and coin interactions
window.addEventListener(`keyup`, function(e) {
    if(e.key === `ArrowDown` || e.key === `Down`){ //second option for ie and Edge
    const currTop = extractPos(player.style.top);
    player.style.top = `${currTop + 50}px`;
    }
    else if(e.key === `ArrowUp` || e.key === `Up`){
        const currTop = extractPos(player.style.top);
        player.style.top = `${currTop - 50}px`; 
    }
    else if(e.key === `ArrowRight` || e.key === `Right`){
        const currLeft = extractPos(player.style.left);
        player.style.left = `${currLeft + 50}px`;
        player.style.transform = `scale(1,1)`;
    }
    else if(e.key === `ArrowLeft` || e.key === `Left`){
        const currLeft = extractPos(player.style.left);
        player.style.left = `${currLeft - 50}px`; 
        player.style.transform = `scale(-1,1)`;
    }
    if(isTouching(player, copperCoin)){
        moveCoin(copperCoin);
        points ++;
    }
    if(isTouching(player, silverCoin)){
        moveCoin(silverCoin);
        points += 5;
    }
    if(isTouching(player, goldCoin)){
        moveCoin(goldCoin);
        points += 10;
    }
    counter.innerText = `Score: ${points}`;
});
//randomise coin positions
const moveCoin = function(coinType){
    const top = Math.floor(Math.random()*window.innerHeight);
    const left = Math.floor(Math.random()*window.innerWidth);
    coinType.style.top = `${top}px`;
    coinType.style.left = `${left}px`;
}

moveCoin(copperCoin)
moveCoin(silverCoin)
moveCoin(goldCoin)