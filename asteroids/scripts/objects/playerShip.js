Asteroids.objects.PlayerShip = function (spec, soundSystem) {
    let imageReady = false;
    let image = new Image();
    image.src = spec.imageSrc;

    image.onload = function () {
        imageReady = true;
    }

    let xMovementRate = 0;
    let yMovementRate = 0;
    let rotation = 0;
    let bullets = [];
    let fireRate = 300;
    let fireCountdown = 0;
    let invunerableTime = 2500;
    let hyperSpaceTime = 1500;
    let hyperSpace = false;
    let invunerable = false;
    let shouldDraw = true;
    let thrustTime = 0;

    function reset() {
        spec.x = 500;
        spec.y = 320;
        rotation = 0;
        xMovementRate = 0;
        yMovementRate = 0;
        fireCountdown = 0;
        invunerable = true;
        hyperSpace = false;
        bullets = [];
        thrustTime = 0;
    }

    function stopMoving() {
        xMovementRate = 0;
        yMovementRate = 0;
    }
    function move(x, y) {
        spec.x = x;
        spec.y = y;
        hyperSpace = true;
    }

    function addThrust(elaspedTime) {
        let max = spec.maxSpeed;
        let xDir = Math.sin(rotation);
        let yDir = Math.cos(rotation);
        xMovementRate += (spec.acceleration / elaspedTime) * xDir;
        yMovementRate -= (spec.acceleration / elaspedTime) * yDir;
        if (xMovementRate > max) {
            xMovementRate = max;
        }
        if (xMovementRate < (-max)) {
            xMovementRate = -max;
        }
        if (yMovementRate > max) {
            yMovementRate = max;
        }
        if (yMovementRate < (-max)) {
            yMovementRate = -max;
        }
        thrustTime += elaspedTime;
    }

    function update(elaspedTime) {
        if (thrustTime > 1) {
            soundSystem.shipThrust();
        }
        thrustTime -= elaspedTime;
        if (thrustTime < 0) {
            soundSystem.shipThrustPause();
            thrustTime = 0;
        }
        if (invunerable) {
            invunerableTime -= elaspedTime;
            let temp = Math.floor(invunerableTime / 150);
            if (temp % 2 === 0) {
                shouldDraw = false;
            }
            else {
                shouldDraw = true;
            }
            if (invunerableTime < 0) {
                invunerable = false;
                shouldDraw = true;
                invunerableTime = 2500;
            }
        }
        if (hyperSpace) {
            hyperSpaceTime -= elaspedTime;
            if (hyperSpaceTime < 0) {
                hyperSpace = false;
                hyperSpaceTime = 1500;
            }
        }
        fireCountdown -= elaspedTime;
        if (fireCountdown < 0) {
            fireCountdown = 0;
        }
        bullets.map((x) => x.update(elaspedTime));
        updateBullets();
        spec.x += xMovementRate * elaspedTime;
        spec.y += yMovementRate * elaspedTime;
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

    function rotateLeft(elaspedTime) {
        rotation -= (spec.rotationRate * elaspedTime);
    }

    function rotateRight(elaspedTime) {
        rotation += (spec.rotationRate * elaspedTime);
    }

    function fire() {
        if (fireCountdown < 1) {
            fireCountdown += fireRate;
            createBullet();
        }
    }

    function noThrust() {
        thrustTime = 0;
    }

    function createBullet() {
        soundSystem.shipFire();
        bullets.push(Asteroids.objects.Bullet({
            x: spec.x,
            y: spec.y,
            xDir: Math.sin(rotation),
            yDir: Math.cos(rotation),
            rotation: rotation,
            cSize: spec.cSize,
            height: 20,
            width: 20,
            src: 'images/missle1.png',
            moveRate: 550 / 1000,
            lifeTime: 1000,
        }));
    }

    function removeBullet(pos) {
        bullets.splice(pos, 1);
    }

    function updateBullets() {
        for (let i = 0; i < bullets.length; i++) {
            if (i < bullets.length) {
                if (bullets[i].expired) {
                    bullets.splice(i, 1);
                }
            }
        }
    }

    let api = {
        addThrust: addThrust,
        rotateRight: rotateRight,
        rotateLeft: rotateLeft,
        fire: fire,
        update: update,
        reset: reset,
        stopMoving: stopMoving,
        move: move,
        removeBullet: removeBullet,
        noThrust, noThrust,
        get imageReady() { return imageReady; },
        get image() { return image; },
        get x() { return spec.x; },
        get y() { return spec.y; },
        get width() { return spec.width; },
        get height() { return spec.height; },
        get rotation() { return rotation; },
        get invunerable() { return invunerable; },
        get shouldDraw() { return shouldDraw; },
        get hyperSpace() { return hyperSpace; },
        get bullets() { return bullets; },
    };
    return api;

}