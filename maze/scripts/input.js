Maze.input.Keyboard = function () {
    let that = {
        keys: {},
        handlers: {}
    };

    function keyPress(e) {
        that.keys[e.key] = e.timeStamp;
    }

    // function keyRelease(e) {
    //     that.keys[e.key] = e.timeStamp;
    // }

    that.update = function (elapsedTime) {
        for (let key in that.keys) {
            if (that.keys.hasOwnProperty(key)) {
                if (that.handlers[key]) {
                    that.handlers[key](elapsedTime);
                }
            }
            delete that.keys[key];
        }
    };

    that.register = function (key, handler) {
        that.handlers[key] = handler;
    };

    that.clear = function () {
        console.log("CLEAR KEYS");
        that.keys = {};
    }

    window.addEventListener('keydown', keyPress);
    // window.addEventListener('keyup', keyRelease);

    return that;
}
