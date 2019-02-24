Maze.objects.Hero = function(loc, size) {

    let imageReady = false;
    let image = new Image();
    if (size <= 10) {
        image.src = 'images/totoroLarge.png';
    } else {
        image.src = 'images/totoro1.png';
    }
    
    let location = loc;

    image.onload = function() {
        imageReady = true;
    }

    function moveLeft() {
        if (location.edges.w) {
            location.visited = true;
            location = location.edges.w;
        }
    }

    function moveRight() {
        if (location.edges.e) {
            location.visited = true;
            location = location.edges.e;
        }
    }

    function moveUp() {
        if (location.edges.n) {
            location.visited = true;
            location = location.edges.n;
        }
    }

    function moveDown() {
        if (location.edges.s) {
            location.visited = true;
            location = location.edges.s;
        }
    }


    let api = {
        moveUp: moveUp,
        moveDown: moveDown,
        moveLeft: moveLeft,
        moveRight: moveRight,
        get imageReady() { return imageReady; },
        get image() {return image; },
        get location() {return location; },

    };
    return api;
}