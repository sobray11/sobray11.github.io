Maze.main = (function (graphics, input, objects) {

    let size;
    let maze = [];
    let hero;
    let keyboard = input.Keyboard();
    let flags = {
        breadCrumbs: false,
        hint: false,
        shortestPath: false,
        gameOver: false,
    }
    let current;
    let score;
    let highScores = [0,0,0,0,0];
    let gameTime;
    let interval = 1000;

    var sizeOptions = document.getElementById('size-options');
    document.getElementById('new-game-button').onclick = function() {
        setup();
    };

    sizeOptions.onchange = function() {
        setup();
        sizeOptions.blur();
    };

    var htmlScore = document.getElementById('current-score');
    var htmlTime = document.getElementById('current-time');

    function setup() {
        
        size = sizeOptions.value;
        maze = [];
        current = {x: -1, y: -1};
        score = 2;
        htmlScore.innerHTML = score;
        gameTime = 0;
        interval = 1000;
        htmlTime.innerHTML = gameTime;

        setFlags();
        keyboard.clear();
        
        for (let row = 0; row < size; row++) {
            maze.push([]);
            for (let col = 0; col < size; col++) {
                maze[row].push({
                    x: col,
                    y: row,
                    edges: {
                        n: null,
                        s: null,
                        e: null,
                        w: null
                    },
                    placed: false,
                    visited: false,
                    scored: false,
                    shortest: false,
                    hint: false,
                    originalPath: false,
                })
            }
        }
        hero = objects.Hero(maze[0][0], size);
        registerKeys();
        generateMaze();
    }

    function setFlags() {
        flags.breadCrumbs = false;
        flags.hint = false;
        flags.shortestPath = false;
        flags.gameOver = false;
    }

    function registerKeys() {
        keyboard.register('k', hero.moveDown);
        keyboard.register('i', hero.moveUp);
        keyboard.register('j', hero.moveLeft);
        keyboard.register('l', hero.moveRight);
        keyboard.register('s', hero.moveDown);
        keyboard.register('w', hero.moveUp);
        keyboard.register('a', hero.moveLeft);
        keyboard.register('d', hero.moveRight);
        keyboard.register('ArrowDown', hero.moveDown);
        keyboard.register('ArrowUp', hero.moveUp);
        keyboard.register('ArrowLeft', hero.moveLeft);
        keyboard.register('ArrowRight', hero.moveRight);
        keyboard.register('b', function() {flags.breadCrumbs = !flags.breadCrumbs;});
        keyboard.register('p', function() {flags.shortestPath = !flags.shortestPath;});
        keyboard.register('h', function() {flags.hint = !flags.hint;});
    }

    function generateMaze() {
        let frontier = {};

        let x = Math.floor(Math.random() * size);
        let y = Math.floor(Math.random() * size);
        maze[y][x].placed = true;
        addNeighbors(maze[y][x], frontier);

        while (Object.keys(frontier).length > 0) {
            //randomly choose a cell in the frontier
            let pos = getRandomItem(frontier);
            let frontierCell = frontier[pos];
            let frontierX = frontierCell.x;
            let frontierY = frontierCell.y;

            //randomly pick a wall from the frontier cell that connects a cell in the maze
            let walls = findWalls(frontierX, frontierY);
            pos = Math.floor(Math.random() * walls.length);
            let wall = walls[pos];

            //remove the wall
            let wallX = parseInt(wall.split(',')[0]);
            let wallY = parseInt(wall.split(',')[1]);
            removeWall(frontierX, frontierY, wallX, wallY);

            //add the cell to the maze
            maze[frontierY][frontierX].placed = true;

            //remove cell from the frontier
            delete frontier[frontierX + ',' + frontierY];

            // add neighbors
            addNeighbors(maze[frontierY][frontierX], frontier);
        }
    }

    function getRandomItem(set) {
        let items = Object.keys(set);
        return items[Math.floor(Math.random() * items.length)];
    }

    function findWalls(x, y) {
        let walls = [];
        if (x - 1 >= 0) {
            if (maze[y][x - 1].placed) {
                walls.push((x - 1) + ',' + y);
            }
        }
        if (y - 1 >= 0) {
            if (maze[y - 1][x].placed) {
                walls.push((x) + ',' + (y - 1));
            }
        }
        if (x + 1 < size) {
            if (maze[y][x + 1].placed) {
                walls.push((x + 1) + ',' + (y));
            }
        }
        if (y + 1 < size) {
            if (maze[y + 1][x].placed) {
                walls.push((x) + ',' + (y + 1));
            }
        }
        return walls;
    }

    function addNeighbors(cell, frontier) {
        if (cell.x - 1 >= 0) {
            if (!maze[cell.y][cell.x - 1].placed) {
                frontier[toString(cell.x - 1, cell.y)] = { x: cell.x - 1, y: cell.y };
            }
        }
        if (cell.y - 1 >= 0) {
            if (!maze[cell.y - 1][cell.x].placed) {
                frontier[toString(cell.x, cell.y - 1)] = { x: cell.x, y: cell.y - 1 };
            }
        }
        if (cell.x + 1 < size) {
            if (!maze[cell.y][cell.x + 1].placed) {
                frontier[toString(cell.x + 1, cell.y)] = { x: cell.x + 1, y: cell.y };
            }
        }
        if (cell.y + 1 < size) {
            if (!maze[cell.y + 1][cell.x].placed) {
                frontier[toString(cell.x, cell.y + 1)] = { x: cell.x, y: cell.y + 1 };
            }
        }
    }

    function toString(x, y) {
        return String(String(x) + ',' + String(y));
    }

    function removeWall(x1, y1, x2, y2) {
        if (x1 === x2) {
            if (y1 > y2) {
                maze[y1][x1].edges.n = maze[y2][x2];
                maze[y2][x2].edges.s = maze[y1][x1];
            }
            if (y1 < y2) {
                maze[y1][x1].edges.s = maze[y2][x2];
                maze[y2][x2].edges.n = maze[y1][x1];
            }
        }
        if (y1 === y2) {
            if (x1 > x2) {
                maze[y1][x1].edges.w = maze[y2][x2];
                maze[y2][x2].edges.e = maze[y1][x1];
            }
            if (x1 < x2) {
                maze[y1][x1].edges.e = maze[y2][x2];
                maze[y2][x2].edges.w = maze[y1][x1];
            }
        }
    }

    function gameOver() {
        if (!flags.gameOver) {
            flags.gameOver = true;
            console.log("game over");
            updateHighScores();
        }
    }

    function updateHighScores() {
        highScores.push(score + 5);
        highScores.sort(function(a,b){return b-a});
        highScores.slice(0,5);
        document.getElementById('score-1').innerText = highScores[0];
        document.getElementById('score-2').innerText = highScores[1];
        document.getElementById('score-3').innerText = highScores[2];
        document.getElementById('score-4').innerText = highScores[3];
        document.getElementById('score-5').innerText = highScores[4];
    }

    function processInput() {
        if (!flags.gameOver) {
            keyboard.update();
            if (hero.location.x === size - 1 && hero.location.y === size - 1) {
                gameOver();
            }
        } 
    }

    function update(elaspedTime) {
        if (hero.location.x != current.x || hero.location.y != current.y) {
            current.x = hero.location.x;
            current.y = hero.location.y;
            if (!maze[current.y][current.x].scored) {
                maze[current.y][current.x].scored = true;
                if (maze[current.y][current.x].originalPath) {
                    score += 5;
                }
                else {
                        score -= 2;
                }
                htmlScore.innerHTML = score;
            }
            solveMaze(maze, size, hero.location.x, hero.location.y);
        }
        interval -= elaspedTime;
        if (!flags.gameOver) {
            if (interval < 0) {
                interval += 1000;
                gameTime += 1;
                htmlTime.innerHTML = gameTime;
            }
        }
    }

    function render() {
        graphics.clear();
        graphics.drawMaze(maze, size, flags);
        graphics.drawHero(hero, size);
        if (flags.gameOver) {
            graphics.drawGameOver(score);
        }
    }
    
    function gameLoop(time) {
        let elaspedTime = time - previousTime;
        previousTime = time;
        processInput();
        update(elaspedTime);
        render();

        requestAnimationFrame(gameLoop);
    }

    setup();
    let previousTime = performance.now();
    requestAnimationFrame(gameLoop);


}(Maze.graphics, Maze.input, Maze.objects));