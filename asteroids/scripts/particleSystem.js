Asteroids.systems.ParticleSystem = function(graphics) {

    let ready = false;
    let imagesReady = 0;
    let imageAmount = 3;
    let ap1 = new Image();
    ap1.src = 'images/asteroidParticle.png';
    let ap2 = new Image();
    ap2.src = 'images/particle1.png';
    let tp1 = new Image();
    tp1.src = 'images/thrust.png';

    ap1.onload = function () {
        imagesReady += 1;
        if (imagesReady === imageAmount) {
            ready = true;
        }
    }

    ap2.onload = function () {
        imagesReady += 1;
        if (imagesReady === imageAmount) {
            ready = true;
        }
    }

    tp1.onload = function () {
        imagesReady += 1;
        if (imagesReady === imageAmount) {
            ready = true;
        }
    }

    let particleAmounts = {
        asteroid: 50,
        thrust: 2,
        ship: 50,

    }

    let particleSizes = {
        asteroid: {low: 5, high: 12},
        thrust: {low: 2, high: 10},
        ship: {low: 8, high: 20},

    }
    let particleSpeeds = {
        asteroid: {low: 100, high: 200},
        thrust: { low: 100, high: 120},
        ship: {low: 150, high: 220},
    }
    let particleLiftimes = {
        asteroid: {low: 0.2, high: 0.8},
        thrust: {low: 0.2, high: 0.3},
        ship: {low: 0.8, high: 1.5},
    }
    
    let particleTypes = {
        asteroid: 1,
        asteroid2: 2,
        thrust: 3,
        ship: 4,
    }

    let nextName = 0;
    let particles = {};

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
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

    function getThrustDirection(angle) {
        let xVariation = getRandomDecimal(-0.3, 0.3);
        let yVariation = getRandomDecimal(-0.3,0.3);
        return {
            x: (Math.sin(angle) * -1) + xVariation,
            y: Math.cos(angle) + yVariation,
        };
    }

    function create(type, center, sizeRange, speedRange, lifeRange, dir) {
        let size = getRandomInt(sizeRange.low, sizeRange.high);
        if (dir == null) {
            dir = getRandomDirection();
        }
        let p = {
            center: { x: center.x, y: center.y },
            size: { x: size, y: size },
            direction: dir,
            speed: getRandomInt(speedRange.low, speedRange.high), // pixels per second
            rotation: 0,
            lifetime: getRandomDecimal(lifeRange.low, lifeRange.high), // seconds
            alive: 0,
            type: type,
        };
        return p;
    }


    function createShipExplosion(x, y) {
        for (let i = 0; i < particleAmounts.ship; i++) {
            particles[nextName++] = 
                create(i % 2 === 0 ? 1 : 3, {x: x, y: y}, particleSizes.ship, particleSpeeds.ship, particleLiftimes.ship);
        }
    }

    // spec: x, y
    function createAsteroidExplosion(x, y) {
        for (let i = 0; i < particleAmounts.asteroid; i++) {
            particles[nextName++] = 
                create(i % 3 === 0 ? 2 : 1, {x: x, y: y}, particleSizes.asteroid, particleSpeeds.asteroid, particleLiftimes.asteroid);
        }
    }

    function createThrust(x, y, rotation) {
        let xOffset = Math.sin(rotation) * -12;
        let yOffset = Math.cos(rotation) * 12;
        // let yOffset = 
        for (let i = 0; i < particleAmounts.thrust; i++) {
            let direction = getThrustDirection(rotation);
            particles[nextName++] = 
                create(particleTypes.thrust, {x: x + xOffset, y: y + yOffset}, particleSizes.thrust, particleSpeeds.thrust, particleLiftimes.thrust, direction);
        }
    }

    function update(elapsedTime) {
        let removeMe = [];

        elapsedTime = elapsedTime / 1000;

        Object.getOwnPropertyNames(particles).forEach(value => {
            let particle = particles[value];

            particle.alive += elapsedTime;
            particle.center.x += (elapsedTime * particle.speed * particle.direction.x);
            particle.center.y += (elapsedTime * particle.speed * particle.direction.y);

            particle.rotation += particle.speed / 500;

            if (particle.alive > particle.lifetime) {
                removeMe.push(value);
            }
        });

        for (let particle = 0; particle < removeMe.length; particle++) {
            delete particles[removeMe[particle]];
        }
    }

    function render() {
        if (ready) {
            let image = ap1;
            Object.getOwnPropertyNames(particles).forEach(function (value) {
                let particle = particles[value];
                // console.log('particle');
                if (particle.type === particleTypes.asteroid) {
                    image = ap1;
                }
                if (particle.type === particleTypes.asteroid2) {
                    image = ap2;
                }
                if (particle.type === particleTypes.thrust) {
                    image = tp1;
                }
                graphics.drawParticle(image, particle.center, particle.rotation, particle.size);
            });
        }
    }



    let api = {
        update: update,
        createShipExplosion: createShipExplosion,
        createAsteroidExplosion: createAsteroidExplosion,
        createThrust: createThrust,
        render: render,
        get particles() { return particles; },

    }
    return api;
}