Asteroids.screens['main-menu'] = (function(game) {


    function initialize() {
        document.getElementById('new-game-button').addEventListener(
            'click',
            function() { game.showScreen('game-play', {reset: true}); });
        
        document.getElementById('high-scores-button').addEventListener(
            'click',
            function() { game.showScreen('high-scores'); });
        
        document.getElementById('controls-button').addEventListener(
            'click',
            function() { game.showScreen('controls'); });
        
        document.getElementById('credits-button').addEventListener(
            'click',
            function() { game.showScreen('credits'); });
    }

    function run() {
        // nothing to do
    }

    return {
        initialize: initialize,
        run: run,
    }

}(Asteroids.game));