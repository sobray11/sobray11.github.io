Asteroids.systems.SoundPlayer = function () {

    sounds = {};
    shipFireSound = 'sounds/shipFire.wav';
    ufoFireSound = 'sounds/ufoFire.wav';
    asteroidExplosionSound = 'sounds/asteroidExplosion.wav';
    shipExplosionSound = 'sounds/shipExplosion.mp3';
    ufoExplosionSound = 'sounds/ufoExplosion.wav';
    hyperspaceSound = 'sounds/hyperspace.mp3';
    backgroundSound = 'sounds/background.mp3';
    thrustSound = 'sounds/thrust.mp3';
    soundAffects = true;

    function enableSoundAffects() {
        soundAffects = true;
    }

    function disableSoundAffects() {
        soundAffects = false;
    }

    function loadSound(source) {
        let sound = new Audio();
        sound.addEventListener('play', function () {

        });
        sound.addEventListener('pause', function () {

        });

        sound.src = source;
        return sound;
    }

    function loadSounds() {
        sounds[shipFireSound] = loadSound(shipFireSound);
        sounds[shipFireSound].volume = 0.5;
        sounds[ufoFireSound] = loadSound(ufoFireSound);
        sounds[ufoFireSound].volume = 0.6;
        sounds[asteroidExplosionSound] = loadSound(asteroidExplosionSound);
        sounds[shipExplosionSound] = loadSound(shipExplosionSound);
        sounds[ufoExplosionSound] = loadSound(ufoExplosionSound);
        sounds[hyperspaceSound] = loadSound(hyperspaceSound);
        sounds[backgroundSound] = loadSound(backgroundSound);
        sounds[thrustSound] = loadSound(thrustSound);
        sounds[thrustSound].volume = 0.8;
        sounds[backgroundSound].volume = 0.35;
        sounds[backgroundSound].addEventListener('ended', function () {
            sounds[backgroundSound].currentTime = 0;
            playSound(backgroundSound);
        });
    }


    function pauseSound(sound) {
        sounds[sound].pause();
    }

    function playSound(sound) {
        sounds[sound].play();
    }

    function shipThrust() {
        if (soundAffects) {
            if (sounds[thrustSound].currentTime > 25) {
                sounds[thrustSound].currentTime = 0;
            }
            playSound(thrustSound);
        }
    }

    function shipThrustPause() {
        if (soundAffects) {
            if (sounds[thrustSound].currentTime > 25) {
                sounds[thrustSound].currentTime = 0;
            }
            pauseSound(thrustSound);
        }
    }

    function shipFire() {
        if (soundAffects){
            playSound(shipFireSound);
        }
    }

    function ufoFire() {
        if (soundAffects){
            playSound(ufoFireSound);
        }
    }

    function asteroidExplosion() {
        if (soundAffects){
            sounds[asteroidExplosionSound].currentTime = 0;
            playSound(asteroidExplosionSound);
        }
    }

    function shipExplosion() {
        pauseSound(thrustSound);
        if (soundAffects){
            sounds[shipExplosionSound].currentTime = 0;
            playSound(shipExplosionSound);
        }
    }

    function ufoExplosion() {
        if (soundAffects){
            sounds[ufoExplosionSound].currentTime = 0;
            playSound(ufoExplosionSound);
        }
    }

    function hyperspace() {
        if (soundAffects){
            playSound(hyperspaceSound);
        }
    }

    function playBackground() {
        playSound(backgroundSound);
    }

    function pauseBackground() {
        pauseSound(backgroundSound);
    }

    let api = {
        loadSounds: loadSounds,
        shipFire: shipFire,
        shipThrust: shipThrust,
        shipThrustPause: shipThrustPause,
        ufoFire: ufoFire,
        shipExplosion: shipExplosion,
        asteroidExplosion: asteroidExplosion,
        ufoExplosion: ufoExplosion,
        hyperspace: hyperspace,
        playBackground: playBackground,
        pauseBackground: pauseBackground,
        disableSoundAffects: disableSoundAffects,
        enableSoundAffects: enableSoundAffects,
        get soundAffects() { return soundAffects; },
    }
    return api;
}