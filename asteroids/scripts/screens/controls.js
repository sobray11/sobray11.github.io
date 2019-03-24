Asteroids.screens['controls'] = (function(game) {

    function initialize() {
        document.getElementById('controls-back-button').addEventListener(
            'click',
            function() { game.showScreen('main-menu'); }
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