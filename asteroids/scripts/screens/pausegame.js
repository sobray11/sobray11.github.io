Asteroids.screens['pause-game'] = (function(game) {

    function initialize() {
        document.getElementById('pausegame-quit-button').addEventListener(
            'click',
            function() { game.showScreen('main-menu'); }
        );
        document.getElementById('pausegame-resume-button').addEventListener(
            'click',
            function() { game.showScreen('game-play', {reset: false}); }
        );
    }

    function run() {
        // empty function
    }

    return {
        initialize : initialize,
        run : run
    };

}(Asteroids.game));