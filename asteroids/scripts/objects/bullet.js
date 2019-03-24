// spec: { x, y, xDir, yDir, cSize, height, width, src, moveRate, lifeTime}

Asteroids.objects.Bullet = function (spec) {
    let moveRate = spec.moveRate;
    let lifeTime = spec.lifeTime;
    let height = spec.height;
    let width = spec.width;
    let expired = false;
    let rot = spec.rotation;

    let imageReady = false;
    let image = new Image();
    image.src = spec.src;

    image.onload = function () {
        imageReady = true;
    }

    function update(elapsedTime) {
        spec.x += spec.xDir * elapsedTime * moveRate;
        spec.y -= spec.yDir * elapsedTime * moveRate;
        lifeTime -= elapsedTime;
        if (lifeTime < 0) {
            expired = true;
        }
        if (spec.x > spec.cSize.width) {
            spec.x = 0;
        }
        if (spec.x < 0) {
            spec.x = spec.cSize.width;
        }
        if (spec.y > spec.cSize.height) {
            spec.y = 0;
        }
        if (spec.y < 0) {
            spec.y = spec.cSize.height;
        }
    }

    let api = {
        update: update,
        get imageReady() { return imageReady; },
        get image() { return image },
        get rotation() { return rot },
        get x() { return spec.x; },
        get y() { return spec.y; },
        get height() {return height; },
        get width() { return width; },
        get expired() { return expired; },
    }
    return api;
}