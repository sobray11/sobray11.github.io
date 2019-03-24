Asteroids.screens['game-play'] = (function (game, objects, graphics, input, systems) {

    let lastTimeStamp = performance.now();
    let keepPlaying = false;
    let cSize = { height: 740, width: 1000 };
    let asteroids = [];
    let ships = [];
    let ufos = [];
    let asteroidSizes = { l: 120, m: 75, s: 45 };
    let gameInfo = { level: 1, lives: 3, score: 0, hypersapceTimer: 0 };
    let gameOverInterval = 1600;
    let levelStartInterval = 1600;
    let levelTransistion = false;
    let gameEnd = false;

    let keyboard = input.Keyboard()
    let particleSystem = systems.ParticleSystem(graphics);
    let soundSystem = systems.SoundPlayer();
    soundSystem.loadSounds();

    let playerShip = objects.PlayerShip({
        imageSrc: 'images/ship_125_cropped.png',
        x: 400,
        y: 300,
        rotationRate: 4 / 1000, // radians per second
        acceleration: 80 / 1000,
        maxSpeed: 430 / 1000,
        width: 40,
        height: 40,
        cSize: cSize,
    }, soundSystem);

    let largeUfo = objects.UfoShip({
        imageSrc: 'images/ufosmall.png',
        type: 'large',
        height: 85,
        width: 105,
        accuracy: 700,
        fireRate: 6000,
        speed: 40 / 1000,
        cSize: cSize,
    }, soundSystem);
    let smallUfo = objects.UfoShip({
        imageSrc: 'images/ufosmall.png',
        type: 'small',
        height: 45,
        width: 60,
        accuracy: 100,
        fireRate: 4500,
        speed: 70 / 1000,
        cSize: cSize,
    }, soundSystem);
    largeUfo.reset();
    smallUfo.reset();
    ufos.push(largeUfo);
    ufos.push(smallUfo);

    function distance(x1, y1, x2, y2) {
        dx = Math.abs(x2 - x1);
        dy = Math.abs(y2 - y1);

        if (dx > (cSize.width / 2))
            dx = cSize.width - dx;

        if (dy > (cSize.height / 2))
            dy = cSize.height - dy;

        return Math.sqrt(dx * dx + dy * dy);
    }

    function collides(obj1, obj2) {
        if (!obj1 || !obj2) {
            return false;
        }
        let rad1 = obj1.width / 2;
        let rad2 = obj2.width / 2;
        let radiusSum = rad1 + rad2;
        let dis = distance(obj1.x, obj1.y, obj2.x, obj2.y) + 5;
        if (dis < radiusSum) {
            return true;
        }
        return false;
    }

    function checkCollisions() {
        // playership bullet and asteroid/ufo collision
        let bullets = playerShip.bullets;
        for (let i = 0; i < bullets.length; i++) {
            for (let j = 0; j < asteroids.length; j++) {
                if (collides(bullets[i], asteroids[j])) {
                    asteroidSplit(asteroids[j], bullets[i], j, i);
                }
            }
            for (let j = 0; j < ufos.length; j++) {
                if (ufos[j].active) {
                    if (collides(bullets[i], ufos[j])) {
                        bulletHitUfo(j, i);
                    }
                }
            }
        }
        // asteroid ship collision
        for (let i = 0; i < asteroids.length; i++) {
            for (let j = 0; j < ships.length; j++) {
                if (!ships[j].invunerable && collides(ships[j], asteroids[i])) {
                    asteroidShipCollision(ships[j], asteroids[i], i);
                }
            }
        }
        // ufo ship collision
        for (let i = 0; i < ufos.length; i++) {
            if (ufos[i].active) {
                for (let j = 0; j < ships.length; j++) {
                    if (!ships[j].invunerable && collides(ships[j], ufos[i])) {
                        ufoShipCollision(i, j);
                    }
                }
            }
        }
        // ufo bullet ship
        for (let i = 0; i < ufos.length; i++) {
            let bullets = ufos[i].bullets;
            for (let j = 0; j < bullets.length; j++) {
                for (let k = 0; k < ships.length; k++) {
                    if (!ships[k].invunerable && collides(ships[k], bullets[j])) {
                        bulletHitShip(k, j, i);
                    }
                }
            }
        }
    }

    function ufoShipCollision(ufoPos, shipPos) {
        particleSystem.createShipExplosion(ships[shipPos].x, ships[shipPos].y);
        particleSystem.createShipExplosion(ufos[ufoPos].x, ufos[ufoPos].y);
        soundSystem.shipExplosion();
        ships = [];
        ufos[ufoPos].reset();

        gameInfo.lives -= 1;
        if (gameInfo.lives < 1) {
            gameInfo.lives = 0;
            gameEnd = true;
            ships = []
        } else {
            levelTransistion = true;
        }
    }

    function bulletHitUfo(ufoPos, bulletPos) {
        particleSystem.createShipExplosion(ufos[ufoPos].x, ufos[ufoPos].y);
        soundSystem.ufoExplosion();
        playerShip.removeBullet(bulletPos);
        ufos[ufoPos].reset();
        if (ufos[ufoPos].type === 'large') {
            gameInfo.score += 45;
        } else {
            gameInfo.score += 60;
        }
    }

    function bulletHitShip(shipPos, bPos, ufoPos) {
        particleSystem.createShipExplosion(ships[shipPos].x, ships[shipPos].y);
        soundSystem.shipExplosion();
        ufos[ufoPos].removeBullet(bPos);
        ships = [];

        gameInfo.lives -= 1;
        if (gameInfo.lives < 1) {
            gameInfo.lives = 0;
            gameEnd = true;
            ships = []
        } else {
            levelTransistion = true;
        }
    }

    function asteroidShipCollision(ship, asteroid, aPos) {
        particleSystem.createShipExplosion(ship.x, ship.y);
        soundSystem.shipExplosion();
        ships = [];
        asteroidSplit(asteroid, null, aPos, null);
        gameInfo.lives -= 1;

        asteroids.splice(aPos, 1);

        if (gameInfo.lives < 1) {
            gameInfo.lives = 0;
            gameEnd = true;
            ships = []
        } else {
            levelTransistion = true;
        }
    }

    function createAsteroids(x, y, size, howMany) {
        for (let i = 0; i < howMany; i++) {
            asteroids.push(objects.Asteroid({
                size: size,
                cSize: cSize,
                x: x,
                y: y,
                asteroidSizes: asteroidSizes,
            }));
        }
    }

    function setupAsteroids(howMany) {
        for (let i = 0; i < howMany; i++) {
            let x = Math.floor(Math.random() * cSize.width);
            let y = Math.floor(Math.random() * cSize.height);
            while (Math.abs(500 - x) < 115) {
                x = Math.floor(Math.random() * cSize.width);
            }
            while (Math.abs(320 - y) < 115) {
                y = Math.floor(Math.random() * cSize.height);
            }
            asteroids.push(objects.Asteroid({
                size: asteroidSizes.l,
                cSize: cSize,
                x: x,
                y: y,
                asteroidSizes: asteroidSizes,
            }));
        }
    }

    function asteroidSplit(asteroid, bullet, aPos, bPos) {
        particleSystem.createAsteroidExplosion(asteroid.x, asteroid.y);
        soundSystem.asteroidExplosion();
        playerShip.removeBullet(bPos);
        if (aPos != null) {
            asteroids.splice(aPos, 1);
        }
        if (asteroid.size === asteroidSizes.l) {
            createAsteroids(asteroid.x, asteroid.y, asteroidSizes.m, 3);
            gameInfo.score += 15;
        }
        else if (asteroid.size === asteroidSizes.m) {
            createAsteroids(asteroid.x, asteroid.y, asteroidSizes.s, 4);
            gameInfo.score += 30;
        }
        else if (asteroid.size === asteroidSizes.s) {
            gameInfo.score += 40;
        }
        else {
            console.log('error, unmatched size.', asteroid.size);
        }
    }

    function levelStart() {
        ships = [];
        playerShip.reset();
        ships.push(playerShip);
        asteroids = [];
        setupAsteroids(gameInfo.level);
    }

    function levelReset() {
        playerShip.reset();
        ships.push(playerShip);
    }

    function checkLevelTransition(elaspedTime) {
        if (levelTransistion) {
            levelStartInterval -= elaspedTime;
        }
        if (levelStartInterval < 0) {
            levelTransistion = false;
            levelStartInterval = 1600;
            levelReset();
        }
    }

    function generatePoints(amount) {
        let points = [];
        let count = 0;
        let xStep = cSize.width / amount;
        let yStep = cSize.height / amount;
        for (let i = xStep; i < cSize.width; i += xStep) {
            for (let j = yStep; j < cSize.height; j += yStep) {
                points[count++] = { x: i, y: j };
            }
        }
        return points;
    }

    function findBestLocation() {
        let points = generatePoints(10);
        let dis;
        for (let i = 0; i < points.length; i++) {
            let worstDistance = 1000.0;
            for (let j = 0; j < asteroids.length; j++) {
                dis = distance(points[i].x, points[i].y, asteroids[j].x, asteroids[j].y);
                if (dis < worstDistance) {
                    worstDistance = dis;
                }
            }
            for (let j = 0; j < ufos.length; j++) {
                if (ufos[j].active) {
                    dis = distance(points[i].x, points[i].y, ufos[j].x, ufos[j].y);
                    if (dis < worstDistance) {
                        worstDistance = dis;
                    }
                }
                let bullets = ufos[j].bullets;
                for (let k = 0; k < bullets.length; k++) {
                    dis = distance(points[i].x, points[i].y, bullets[k].x, bullets[k].y);
                    if (dis < worstDistance) {
                        worstDistance = dis;
                    }
                }
            }
            points[i].worstDistance = worstDistance;
        }

        points.sort(function (a, b) { return b.worstDistance - a.worstDistance });
        playerShip.move(points[0].x, points[0].y);
    }

    function hyperspace() {
        if (gameInfo.hypersapceTimer === 1) {
            gameInfo.hypersapceTimer = 0;
            soundSystem.hyperspace();
            findBestLocation();
            playerShip.stopMoving();
        }
    }

    function updateHypersapce(elaspedTime) {
        gameInfo.hypersapceTimer += elaspedTime * .0002;
        if (gameInfo.hypersapceTimer > 1) {
            gameInfo.hypersapceTimer = 1;
        }
    }

    function gameOver() {
        keepPlaying = false;
        gameOverInterval = 1600;
        game.showScreen('game-over', { score: gameInfo.score });
    }

    function processInput(elaspedTime) {
        keyboard.update(elaspedTime);
    }

    function update(elaspedTime) {
        ships.map((x) => x.update(elaspedTime));
        ufos.map((x) => { x.update(elaspedTime); x.updatePlayerLocation({ x: playerShip.x, y: playerShip.y }) });
        asteroids.map((x) => x.update(elaspedTime));
        particleSystem.update(elaspedTime);
        checkCollisions();
        updateHypersapce(elaspedTime);
        checkLevelTransition(elaspedTime);
        if (asteroids.length === 0 && !gameEnd) {
            gameInfo.level += 1;
            levelStart();
        }
        if (gameEnd) {
            gameOverInterval -= elaspedTime;
            if (gameOverInterval < 0) {
                gameOver();
            }
        }
    }

    function render() {
        graphics.clear();
        playerShip.bullets.map((x) => graphics.drawImage(x));
        asteroids.map((x) => graphics.drawImage(x));
        ufos.map((ufo) => { graphics.drawUfo(ufo); ufo.bullets.map((x) => graphics.drawImage(x)); })
        particleSystem.render();
        ships.map((x) => graphics.drawShip(x));
        graphics.drawGameInfo(gameInfo);
    }

    function gameLoop(time) {
        let elaspedTime = time - lastTimeStamp;
        lastTimeStamp = time;

        processInput(elaspedTime);
        update(elaspedTime);
        render();

        if (keepPlaying) {
            requestAnimationFrame(gameLoop);
        }
    }

    function initialize() {
        console.log("initialize gameplay");

        document.getElementById('sound-check').addEventListener('change', function () {
            if (this.checked) {
                soundSystem.enableSoundAffects();
            }
            else {
                soundSystem.disableSoundAffects();
            }
            this.blur();
        });

        document.getElementById('music-check').addEventListener('change', function () {
            if (this.checked) {
                soundSystem.playBackground();
            }
            else {
                soundSystem.pauseBackground();
            }
            this.blur();
        });

        keyboard.register('ArrowLeft', playerShip.rotateLeft);
        keyboard.register('ArrowRight', playerShip.rotateRight);
        keyboard.register(' ', playerShip.fire);
        keyboard.register('ArrowUp', function (elaspedTime) {
            playerShip.addThrust(elaspedTime);
            particleSystem.createThrust(playerShip.x, playerShip.y, playerShip.rotation)
        });
        keyboard.register('z', hyperspace);

        keyboard.register('Escape', function () {
            soundSystem.shipThrustPause();
            playerShip.noThrust();
            keepPlaying = false;
            game.showScreen('pause-game');
        });
    }

    function run(params) {
        gameEnd = false;
        lastTimeStamp = performance.now();
        keepPlaying = true;
        requestAnimationFrame(gameLoop);
        if (params.reset) {
            gameInfo = { level: 1, lives: 3, score: 0, hypersapceTimer: 0 };
            levelStart();
            ufos.map((x) => { x.reset(); x.removeBullet(0); });

        }
    }

    return {
        initialize: initialize,
        run: run
    };

}(Asteroids.game, Asteroids.objects, Asteroids.graphics, Asteroids.input, Asteroids.systems));