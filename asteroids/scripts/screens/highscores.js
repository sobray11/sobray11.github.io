Asteroids.screens['high-scores'] = (function(game, input) {

    let keyboard = input.Keyboard();

    let highscores = [];

    function initialize() {
        console.log('intitalize high scores');
        document.getElementById('high-scores-back-button').addEventListener(
            'click',
            function() { game.showScreen('main-menu'); }
        );
        keyboard.register('Escape', function () {
            game.showScreen('main-menu');
        });
        let temp = localStorage.getItem('highscores');
        if (temp !== null) {
            highscores = JSON.parse(temp);
        }
    }

    function run() {
        let temp = localStorage.getItem('highscores');
        if (temp !== null) {
            highscores = JSON.parse(temp);
        }
        document.getElementById("score-1").innerHTML = highscores[0] ? highscores[0] : 0;
        document.getElementById("score-2").innerHTML = highscores[1] ? highscores[1] : 0;
        document.getElementById("score-3").innerHTML = highscores[2] ? highscores[2] : 0;
        document.getElementById("score-4").innerHTML = highscores[3] ? highscores[3] : 0;
        document.getElementById("score-5").innerHTML = highscores[4] ? highscores[4] : 0;
    }

    return {
        initialize : initialize,
        run : run
    };

}(Asteroids.game, Asteroids.input));