const reset = document.querySelector(`.reset`);
const {Engine, Render, Runner, World, Bodies, Body, Events} = Matter;
const engine = Engine.create();
engine.world.gravity.y = 0;
const counter = document.querySelector(`h1`);
// const rowInput = document.querySelector(`.rows`);
// const colInput = document.querySelector(`.cols`);
const {world} = engine;
const width = window.innerWidth;
const height = window.innerHeight;
const rows = 10;
const cols = 10;
const cellWidth = width / cols;
const cellHeight = height / rows;
let buttonCount = 0;
counter.innerText = `Number of Button Presses: ${buttonCount}`

//Adding Borders
const borders = [
    Bodies.rectangle(width/2, 0, width, 5, {isStatic: true, label: `border`, render: {fillStyle: `black`}}),
    Bodies.rectangle(width/2, height, width, 5, {isStatic: true, label: `border`, render: {fillStyle: `black`}}),
    Bodies.rectangle(width, height/2, 5, height, {isStatic: true, label: `border`, render: {fillStyle: `black`}}),
    Bodies.rectangle(0, height/2, 5, height, {isStatic: true, label: `border`, render: {fillStyle: `black`}})
]
World.add(world, borders);
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        wireframes: false,
        width,
        height 
    }
});
Render.run(render);
Runner.run(Runner.create(), engine);

const makeMaze = () => {
    console.log(`im here`);
    //maze generation
    const grid = Array(rows).fill(null).map(() => Array(cols).fill(false));
    const vert = Array(rows).fill(null).map(() => Array(cols - 1).fill(false));
    const hor = Array(rows - 1).fill(null).map(() => Array(cols).fill(false));
    const startRow = Math.floor(Math.random() * rows);
    const startCol = Math.floor(Math.random() * cols);

    const shuffle = (arr) => {
        let counter = arr.length;
        while(counter > 0) {
            const i = Math.floor(Math.random() * counter);
            counter--;
            const temp = arr[counter];
            arr[counter] = arr[i];
            arr[i] = temp;
        }
        return arr;
    }

    const cellStep = (row, col) => {
        //if cell has been visited, return
        if(grid[row] [col]) return;
        //when visiting cell, mark as visited
        grid[row] [col] = true;
        //create random order of neighbours
        const neighbours = shuffle([
            [row - 1, col, `up`],
            [row + 1, col, `down`],
            [row, col - 1, `left`],
            [row, col + 1, `right`]
        ]);
        //for each neighbour
        for(let neighbour of neighbours) {
            const [nextRow, nextCol, direction] = neighbour;
            //check if out of bounds
            if(nextRow < 0 || nextRow >= rows || nextCol < 0 || nextCol >= cols) {
                continue;
            }
            //is neighbour marked as visited
            if(grid[nextRow] [nextCol]) {
                continue;
            }
            //remove wall
            if(direction === `left`) {
                vert[row] [col - 1] = true;
            }
            else if(direction === `right`) {
                vert[row] [col] = true;
            }
            else if(direction === `up`) {
                hor[row - 1] [col] = true;
            }
            else {
                hor[row] [col] = true;
            }
            //move to next cell
            cellStep(nextRow, nextCol);
        }
    };
    cellStep(startRow, startCol);

    //draw walls
    hor.forEach((row, rowIndex) => {
        row.forEach((open, colIndex) => {
            if(open) {
                return;
            }
            const horWall = Bodies.rectangle((colIndex * cellWidth) + (cellWidth / 2), (rowIndex * cellHeight) + cellHeight, cellWidth, 10, {isStatic: true, label: `wall`, render:{fillStyle: `black`}});
            World.add(world, horWall);
        });
    });
    vert.forEach((row, rowIndex) => {
        row.forEach((open, colIndex) => {
            if(open) {
                return;
            }
            const vertWall = Bodies.rectangle((colIndex * cellWidth) + cellWidth, (rowIndex * cellHeight) + (cellHeight / 2), 10, cellHeight, {isStatic: true, label: `wall`, render: {fillStyle: `black`}});
            World.add(world, vertWall);
        })
    })
}

    //creating goal and player
    const goal = Bodies.rectangle(width - (cellWidth / 2), height - (cellHeight / 2), cellWidth * 0.6, cellHeight * 0.6, {isStatic: true, label: `goal`, render: {fillStyle: `red`}});
    const player = Bodies.circle(cellWidth / 2, cellHeight / 2, Math.min(cellHeight, cellWidth) * 0.3, {label: `player`, render: {fillStyle: `blue`}});
    World.add(world, goal);
    World.add(world, player);

    //movement
    const move = key => {
        const {x, y} = player.velocity;
        if(key === `w` || key === `ArrowUp`) {
            Body.setVelocity(player, {x, y: y - 5});
            buttonCount++;
            counter.innerText = `Number of Button Presses: ${buttonCount}`;
        }
        else if(key === `a` || key === `ArrowLeft`) {
            Body.setVelocity(player, {x: x - 5, y});
            buttonCount++;
            counter.innerText = `Number of Button Presses: ${buttonCount}`;
        }
        else if(key === `s` || key === `ArrowDown`) {
            Body.setVelocity(player, {x, y: y + 5});
            buttonCount++;
            counter.innerText = `Number of Button Presses: ${buttonCount}`;
        }
        else if(key === `d` || key === `ArrowRight`) {
            Body.setVelocity(player, {x: x + 5, y});
            buttonCount++;
            counter.innerText = `Number of Button Presses: ${buttonCount}`;
        }
    }
    document.addEventListener(`keydown`, event => {move(event.key)});

    //winning
    Events.on(engine, `collisionStart`, event => {
        event.pairs.forEach((collision) => {
            const labels = [`player`, `goal`];
            if(labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)) {
                document.querySelector(`.winner`).classList.remove(`hidden`);
                world.gravity.y = 1;
                world.bodies.forEach(body => {
                    if(body.label === `wall` || body.label === `goal`) {
                        Body.setStatic(body, false);
                    }
                });
            }
        });
    });

reset.addEventListener(`click`, makeMaze());