Maze.graphics = (function() {

    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');
    context.strokeStyle = 'rgb(153, 115, 67)';
    let mRatio;
    let canvasSize = 600;

    let imageReady = false;
    let backgroundImage = new Image();
    backgroundImage.src = 'images/background.png';

    backgroundImage.onload = function() {
        imageReady = true;
    }

    function drawEndStar(x, y, r, n, inset) {
        context.save();
        context.fillStyle = 'rgb(255, 187, 40)';
        context.beginPath();
        context.translate(x, y);
        context.moveTo(0,0-r);
        for (var i = 0; i < n; i++) {
            context.rotate(Math.PI / n);
            context.lineTo(0, 0 - (r*inset));
            context.rotate(Math.PI / n);
            context.lineTo(0, 0 - r);
        }
        context.closePath();
        context.fill();
        context.restore();
    }

    function drawCell(cell, size) {
        let ratio = canvasSize / size;
        mRatio = ratio;
    
        if (cell.edges.n === null) {
            context.moveTo(cell.x * (ratio), cell.y * (ratio));
            context.lineTo((cell.x + 1) * (ratio), cell.y * (ratio));
        }
    
        if (cell.edges.s === null) {
            context.moveTo(cell.x * (ratio), (cell.y + 1) * (ratio));
            context.lineTo((cell.x + 1) * (ratio), (cell.y + 1) * (ratio));
        }
    
        if (cell.edges.e === null) {
            context.moveTo((cell.x + 1) * (ratio), cell.y * (ratio));
            context.lineTo((cell.x + 1) * (ratio), (cell.y + 1) * (ratio));
        }
    
        if (cell.edges.w === null) {
            context.moveTo(cell.x * (ratio), cell.y * (ratio));
            context.lineTo(cell.x * (ratio), (cell.y + 1) * (ratio));
        }
    }


    function drawHero(hero, size) {
        if (hero.imageReady) {
            let width = (canvasSize * 0.66) / size;
            let height = (canvasSize * 0.833) / size;
            let yOffest = (mRatio - width) / 2;
            let xOffset = (mRatio - height) / 2;
            context.drawImage(hero.image, 
                (hero.location.x * (canvasSize / size)) + yOffest, 
                (hero.location.y * (canvasSize / size)) + xOffset,
                width,
                height);
        }
    }

    function drawMaze(maze, size, flags) {
        context.strokeStyle = 'rgb(104, 60, 0)';
        context.lineWidth = mRatio * .1;
        context.beginPath();
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                drawCell(maze[row][col], size);
            }
        }
        context.stroke();

        if (flags.breadCrumbs) {
            context.beginPath();
            for (let row = 0; row < size; row++) {
                for (let col = 0; col < size; col++) {
                    if (maze[row][col].visited) {
                        cell = maze[row][col];
                        radius = (mRatio / 5);
                        x = (cell.x * mRatio) + mRatio / 2;
                        y = (cell.y * mRatio) + mRatio / 2;
                        context.moveTo(x + radius, y);
                        context.arc(x, y, radius, 0, 2 * Math.PI);
                    }
                }
            }
            context.fillStyle = 'rgba(104, 60, 0, .5)';
            context.fill();
        }

        if (flags.shortestPath) {
            context.beginPath();
            for (let row = 0; row < size; row++) {
                for (let col = 0; col < size; col++) {
                    if (maze[row][col].shortest) {
                        cell = maze[row][col];
                        radius = (mRatio / 5);
                        x = (cell.x * mRatio) + mRatio / 2;
                        y = (cell.y * mRatio) + mRatio / 2;
                        context.moveTo(x + radius, y);
                        context.arc(x, y, radius, 0, 2 * Math.PI);
                    }
                }
            }
            context.fillStyle = 'rgb(255, 187, 40)';
            context.fill();
        }

        if (flags.hint) {
            context.beginPath();
            for (let row = 0; row < size; row++) {
                for (let col = 0; col < size; col++) {
                    if (maze[row][col].hint) {
                        cell = maze[row][col];
                        radius = (mRatio / 7);
                        x = (cell.x * mRatio) + mRatio / 2;
                        y = (cell.y * mRatio) + mRatio / 2;
                        drawEndStar(x, y, radius, 7, 2);
                        // context.moveTo(x + radius, y);
                        // context.arc(x, y, radius, 0, 2 * Math.PI);
                    }
                }
            }
            context.strokeStyle = 'rgb(0, 0, 0)';
            context.fillStyle = 'rgb(255, 187, 40)';
            context.fill();
        }


        drawEndStar(((size - 1) * mRatio) + mRatio / 2, ((size - 1) * mRatio) + mRatio / 2, mRatio / 5, 7, 2);

        context.strokeStyle = 'rgb(0, 0, 0)';
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(599, 0);
        context.lineTo(599, 599);
        context.lineTo(0, 599);
        context.closePath();
        context.stroke();
    }

    function drawGameOver(score) {
        context.fillStyle = 'rgb(91, 183, 229)';
        context.fillRect(0, 150, 600, 300);
        context.fillStyle = 'rgb(0, 0, 0)';
        context.font = '36px sans-serif';
        context.fillText('Maze Solved!', 200, 300);
        context.fillText("Score: " + score, 220, 340);
    }

    function clear() {
        // context.fillStyle = 'rgb(57, 112, 63)';
        // context.fillRect(0, 0, canvas.width, canvas.height);
        if (imageReady) {
            context.drawImage(backgroundImage, 0,0, canvas.width, canvas.height);
        }
    }



    let api = {
        clear: clear,
        drawCell: drawCell,
        drawMaze: drawMaze,
        drawHero: drawHero,
        drawGameOver: drawGameOver,
    }
    return api;
}());