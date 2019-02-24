
function solveMaze(m, s, x, y) {


    let maze = m;
    let size = s;
    let queue = [];
    let tempMaze = [];

    for (let i = 0; i < size; i++) {
        tempMaze.push([]);
        for (let j = 0; j < size; j++) {
            tempMaze[i].push(false);
        }
    }

    // add start point to the queue
    queue.unshift(createPoint(x, y, null));
    tempMaze[y][x] = true;
    let endPoint;

    // while the queue is not empty
    while (queue.length > 0) {
        // p = remove point from queue
        let p = queue.pop();

        if (p.x === size - 1 && p.y === size - 1) {
            endPoint = p;
            console.log("Solved");
            break;
        }
        // add all neighboring points that are possible and haven't been visited
        if (canVisit(p.x - 1, p.y, p.x, p.y, tempMaze, maze, size)) {
            queue.unshift(createPoint(p.x - 1, p.y, p));
            tempMaze[p.y][p.x - 1] = true;
        }
        if (canVisit(p.x + 1, p.y, p.x, p.y, tempMaze, maze, size)) {
            queue.unshift(createPoint(p.x + 1, p.y, p));
            tempMaze[p.y][p.x + 1] = true;
        }
        if (canVisit(p.x, p.y - 1, p.x, p.y, tempMaze, maze, size)) {
            queue.unshift(createPoint(p.x, p.y - 1, p));
            tempMaze[p.y - 1][p.x] = true;
        }
        if (canVisit(p.x, p.y + 1, p.x, p.y, tempMaze, maze, size)) {
            queue.unshift(createPoint(p.x, p.y + 1, p));
            tempMaze[p.y + 1][p.x] = true;
        }
    }
    let temp = endPoint;
    let moves = [];
    while (temp != null) {
        moves.push({x: temp.x, y: temp.y});
        temp = temp.p;
    }

    updateMaze(moves, maze, size);
    if (x === 0 & y === 0) {
        for (let i = 0; i < moves.length; i++) {
            let m = moves[i];
            maze[m.y][m.x].originalPath = true;
        }
    }
}

function canVisit(x, y, px, py, tempMaze, maze, size) {
    if (x < 0 || y < 0 || x >= size || y >= size) {
        return false;
    }
    if (tempMaze[y][x]) {
        return false;
    }
    if (px === x) {
        if (py > y) {
            if (maze[py][px].edges.n != null) {
                return true;
            }
        }
        if (py < y) {
            if (maze[py][px].edges.s != null) {
                return true;
            }
        }
    }
    if (py === y) {
        if (px > x) {
            if (maze[py][px].edges.w != null) {
                return true;
            }
        }
        if (px < x) {
            if (maze[py][px].edges.e != null) {
                return true;
            }
        }
    }
    return false;
}

function createPoint(x, y, prev) {
    point = {
        x: x,
        y: y,
        p: prev
    }
    return point;
}

function updateMaze(moves, maze, size) {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            maze[i][j].shortest = false;
            maze[i][j].hint = false;
        }
    }
    for (let i = 0; i < moves.length; i++) {
        let m = moves[i];
        maze[m.y][m.x].shortest = true;
        if (i == (moves.length - 2)) {
            maze[m.y][m.x].hint = true;
        }
    }
}
