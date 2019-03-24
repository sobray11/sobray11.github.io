Asteroids.game = (function(screens) {

    function showScreen(id, params) {
        console.log("show screen", id);
        let active = document.getElementsByClassName('active');
        for (let i = 0; i < active.length; i++) {
            active[i].classList.remove('active');
        }

        screens[id].run(params);
        document.getElementById(id).classList.add('active');

    }

    function initialize() {
        document.getElementById('sound-check').checked = true;
        document.getElementById('music-check').checked = false;

        let screen = null;

        for (screen in screens) {
            if (screens.hasOwnProperty(screen)) {
                screens[screen].initialize();
            }
        }

        showScreen('main-menu');
        // showScreen('game-play', {reset: true});
    }


    return {
        initialize: initialize,
        showScreen: showScreen,
    }

}(Asteroids.screens));