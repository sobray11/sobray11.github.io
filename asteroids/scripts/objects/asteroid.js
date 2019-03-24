// spec: { size, cSize, x, y, asteroidSizes }
//size: L: 100, M: 50, S: 30

Asteroids.objects.Asteroid = function (spec) {

    let asteroidSizes = spec.asteroidSizes;

    let imageReady = false;
    let image = new Image();
    image.src = 'images/asteroid2.png';
    if (spec.size !== asteroidSizes.l) {
        image.src = 'images/asteroid2small.png';
    }

    image.onload = function () {
        imageReady = true;
    }

    let moveRate = 30 * (150 / 1000) / spec.size;
    let x = spec.x;
    let y = spec.y;
    let dirs = nextCircleVector();
    let xDir = dirs.x;
    let yDir = dirs.y;
    let rotationRate = (Math.random() * (2 / 1000));

    if (Math.floor(Math.random() * 2) === 1) {
        rotationRate *= -1;
    }
    let rotation = 0;

    function nextCircleVector() {
        let angle = Math.random() * 2 * Math.PI;
        return {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };
    }

    
    function update(elapsedTime) {
        x += xDir * elapsedTime * moveRate;
        y -= yDir * elapsedTime * moveRate;
        if (x > spec.cSize.width) {
            x = 0;
        }
        if (x < 0) {
            x = spec.cSize.width;
        }
        if (y > spec.cSize.height) {
            y = 0;
        }
        if (y < 0) {
            y = spec.cSize.height;
        }
        rotation += (rotationRate * elapsedTime);
    }

    let api = {
        update: update,
        get imageReady() { return imageReady; },
        get image() { return image },
        get rotation() { return rotation },
        get x() { return x; },
        get y() { return y; },
        get height() {return spec.size; },
        get width() { return spec.size; },
        get size() { return spec.size; },
    }
    return api;
}