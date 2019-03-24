Asteroids.screens['game-over'] = (function(game) {

    let highscores = [];

    function initialize() {
        document.getElementById('gameover-back-button').addEventListener(
            'click',
            function() { game.showScreen('main-menu'); }
        );
        document.getElementById('gameover-new-game-button').addEventListener(
            'click',
            function() { game.showScreen('game-play', {reset: true}); }
        );
    }

    function run(params) {
        document.getElementById("game-over-score").innerHTML = "Score: " + params.score;
        let previousScores = localStorage.getItem('highscores');
        if (previousScores !== null) {
            highscores = JSON.parse(previousScores);
        }
        highscores.push(params.score);
        highscores.sort(function(a,b) {return b - a;});
        highscores.slice(0,5);
        localStorage['highscores'] = JSON.stringify(highscores);

    }

    return {
        initialize : initialize,
        run : run
    };

}(Asteroids.game));