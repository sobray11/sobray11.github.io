Asteroids.graphics = (function () {

    let canvas = document.getElementById('id-canvas');
    let context = canvas.getContext('2d');
    context.font = '30px serif';
    context.strokeStyle = 'rgb(65, 201, 8)';
    context.fillStyle = 'rgb(65, 201, 8)';
    context.lineWidth = 3;

    function drawImage(object) {
        if (object.imageReady) {
            context.save();
            context.translate(object.x, object.y);
            context.rotate(object.rotation);
            context.translate(-object.x, -object.y);
            context.drawImage(
                object.image,
                object.x - object.width / 2,
                object.y - object.height / 2,
                object.width, object.height
            );
            context.restore();
        }
    }

    function drawUfo(object) {
        if (object.imageReady && object.active) {
            context.save();
            context.drawImage(
                object.image,
                object.x - object.width / 2,
                object.y - object.height / 2,
                object.width, object.height
            );
            context.restore();
        }
    }

    function drawShip(object) {
        if (object.imageReady && object.shouldDraw) {
            context.save();
            context.translate(object.x, object.y);
            context.rotate(object.rotation);
            context.translate(-object.x, -object.y);
            context.drawImage(
                object.image,
                object.x - object.width / 2,
                object.y - object.height / 2,
                object.width, object.height
            );
            if (object.hyperSpace) {
                context.strokeStyle = 'rgb(53, 167, 255)';
                context.beginPath();
                context.arc(object.x, object.y, object.width, 0, 2 * Math.PI);
                context.stroke();
                context.strokeStyle = 'rgb(65, 201, 8)';
            }
            context.restore();
        }
    }

    function drawGameInfo(gameInfo) {
        let spaceBetween = 245;
        context.fillText('Level: ' + gameInfo.level, 15, 30);
        context.fillText('Lives: ' + gameInfo.lives, 15 + spaceBetween, 30);
        context.fillText('Score: ' + gameInfo.score, 15 + (spaceBetween * 2), 30);
        context.fillText('Hyperspace: ', 15 + (spaceBetween * 3), 30);

        context.strokeRect(15 + (spaceBetween * 3) + 155, 12, 85, 20);
        context.fillRect(15 + (spaceBetween * 3) + 155, 12, Math.floor(85 * gameInfo.hypersapceTimer), 20);
    }

    function drawParticle(image, center, rotation, size) {
        context.save();

        context.translate(center.x, center.y);
        context.rotate(rotation);
        context.translate(-center.x, -center.y);

        context.drawImage(
            image,
            center.x - size.x / 2,
            center.y - size.y / 2,
            size.x, size.y);

        context.restore();
    }

    function clear() {
        // context.fillStyle = 'rgb(57, 112, 63)';
        context.clearRect(0, 0, canvas.width, canvas.height);
    }



    let api = {
        clear: clear,
        drawImage: drawImage,
        drawGameInfo: drawGameInfo,
        drawParticle: drawParticle,
        drawShip: drawShip,
        drawUfo: drawUfo,
    }
    return api;
}());