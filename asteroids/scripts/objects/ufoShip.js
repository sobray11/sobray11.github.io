// spec { type, imageSrc, height, width, accuracy, fireRate, speed, cSize }
Asteroids.objects.UfoShip = function (spec, soundSystem) {
    let imageReady = false;
    let image = new Image();
    image.src = spec.imageSrc;

    image.onload = function () {
        imageReady = true;
    }

    let type = {
        large: 'large',
        small: 'small',
    }

    let playerLocation = {x: 0, y: 0};

    let xMovementRate = 0;
    let yMovementRate = 0;
    let fireCountdown = spec.fireRate;
    let bullets = [];
    let screenWrapBuffer = 0;
    let resetRate = 8000;
    let resetTime = 0;
    let active = true;
    let x = 0;
    let y = 0;

    function setDirection() {
        let dir = getRandomDirection();
        let side = Math.floor(Math.random() * (4));
        if (side === 0) {
            x = 0;
            y = Math.floor(Math.random() * spec.cSize.height );
        } else if (side === 1) {
            x = spec.cSize.width;
            y = Math.floor(Math.random() * spec.cSize.height );
        }
        else if (side === 2) {
            x = Math.floor(Math.random() * spec.cSize.width );
            y = 0;
        }
        else {
            y = spec.cSize.height;
            x = Math.floor(Math.random() * spec.cSize.width );
        }
        xMovementRate = dir.x * spec.speed;
        yMovementRate = dir.y * spec.speed;
    }

    function getRandomDecimal(min, max) {
        return Math.random() * (max - min) + min;
    }

    function getRandomDirection() {
        let angle = Math.random() * 2 * Math.PI;
        return {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };
    }

    function reset() {
        if (spec.type === type.large) {
            resetRate = 18000;
        }
        else {
            resetRate = 15000;
        }
        active = false;
        resetTime = resetRate * getRandomDecimal(1, 2);
        setDirection();
    }

    function update(elaspedTime) {
        updateBullets(elaspedTime);
        if (!active) {
            resetTime -= elaspedTime;
            if (resetTime < 0) {
                active = true;
            }
            return;
        }
        fireCountdown -= elaspedTime;
        if (fireCountdown < 0) {
            fireCountdown += spec.fireRate;
            fire();
        }
        x += xMovementRate * elaspedTime;
        y += yMovementRate * elaspedTime;
        if (x > spec.cSize.width + screenWrapBuffer) {
            x = 0;
        }
        if (x < 0 - screenWrapBuffer) {
            x = spec.cSize.width;
        }
        if (y > spec.cSize.height + screenWrapBuffer) {
            y = 0;
        }
        if (y < 0 - screenWrapBuffer) {
            y = spec.cSize.height;
        }
    }

    function fire() {
        soundSystem.ufoFire();
        let xAim = getRandomDecimal(playerLocation.x - spec.accuracy, playerLocation.x + spec.accuracy);
        let yAim = getRandomDecimal(playerLocation.y - spec.accuracy, playerLocation.y + spec.accuracy);
        let xDir = xAim - x;
        let yDir = yAim - y;
        let hyp = Math.sqrt(xDir*xDir + yDir*yDir);
        xDir /= hyp;
        yDir /= hyp;
        yDir *= -1;
        let rot = 0;
        let mRate = 120 / 1000;
        let life = 4000;
        if (spec.type === 'small') {
            mRate = 200 / 1000;
            life = 2600;
        }
        bullets.push(Asteroids.objects.Bullet({
            x: x,
            y: y,
            xDir: xDir,
            yDir: yDir,
            rotation: rot,
            cSize: spec.cSize,
            height: 20,
            width: 20,
            src: 'images/ufoBullet.png',
            moveRate: mRate,
            lifeTime: life,
        }));
    }

    function updateBullets(elaspedTime) {
        bullets.map((x) => x.update(elaspedTime));
        for (let i = 0; i < bullets.length; i++) {
            if (i < bullets.length) {
                if (bullets[i].expired) {
                    bullets.splice(i,1);
                }
            }
        }
    }

    function updatePlayerLocation(loc) {
        playerLocation = loc;
    }

    function removeBullet(pos) {
        bullets.splice(pos, 1);
    }

    let api = {
        update: update,
        reset: reset,
        removeBullet: removeBullet,
        updatePlayerLocation: updatePlayerLocation,
        get imageReady() { return imageReady; },
        get image() { return image; },
        get x() { return x; },
        get y() { return y; },
        get width() { return spec.width; },
        get height() { return spec.height; },
        get rotation() { return rotation; },
        get bullets() { return bullets; },
        get active() { return active; },
        get type() { return spec.type; },
    };
    return api;

}