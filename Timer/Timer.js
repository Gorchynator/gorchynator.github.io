const duration = document.querySelector(`#duration`);
const startButton = document.querySelector(`#startButton`);
const pauseButton = document.querySelector(`#pauseButton`);
const resetButton = document.querySelector(`#resetButton`);
const circle = document.querySelector(`circle`);
const perimeter = 2 * Math.PI * circle.getAttribute(`r`);
let currOffset = 0;
circle.setAttribute(`stroke-dasharray`, perimeter);

class Timer{
    constructor(input, startButton, pauseButton, resetButton, optional) {
        this.input = input;
        this.startButton = startButton;
        this.pauseButton = pauseButton;
        this.resetButton = resetButton;
        //this is how to code an optional input
        if(optional) {
            console.log(`optional input has been detected`);
        }

        this.startButton.addEventListener(`click`, this.start);
        this.pauseButton.addEventListener(`click`, this.pause);
        this.resetButton.addEventListener(`click`, this.reset);
    }

    start = () => {
        if(parseInt(duration.value) === NaN) {
            console.log(`Please input a number`);
        }
        else if(duration.value.includes(`-`)) {
            console.log(`Please input a number larger than 0`);
        }
        else{
            this.initialVal = duration.value;
            this.tick();
            this.t = setInterval(this.tick,10);
            console.log(`Timer has started`);
        }
    }

    tick = () => {
            duration.value = (duration.value - 0.01).toFixed(2);
            circle.setAttribute(`stroke-dashoffset`, currOffset);
            currOffset -= (perimeter/this.initialVal)/100;
            // currOffset = (perimeter * (duration.value/this.initialVal)) - perimeter;
            if(duration.value <= 0) {
                this.pause();
                circle.setAttribute(`stroke-dashoffset`, perimeter);
                console.log(`TIMER IS UP!!`);
            }
    }

    pause = () => {
        clearInterval(this.t);
    }

    reset = () => {
        duration.value = this.initialVal;
        circle.setAttribute(`stroke-dashoffset`, 0);
    }
}

const timer = new Timer(duration, startButton, pauseButton, resetButton);
