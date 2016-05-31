/**
 * Created by MKS on 22.09.2015.
 */
$(document).ready(function () {
    //ALWAYS
    $("#footer_load").load("footer.html");
    //ALWAYS

    var randomArray = [];
    var userArray = [];
    var level = 0;
    var levelCount = 0;
    var sounds = [];
    var interval;
    var clicks = 0;
    var swOn = true;
    var strictMode = true;

    sounds[0] = new Howl({
        urls: ['contents/simonSound1.mp3']
    });
    sounds[1] = new Howl({
        urls: ['contents/simonSound2.mp3']
    });
    sounds[2] = new Howl({
        urls: ['contents/simonSound3.mp3']
    });
    sounds[3] = new Howl({
        urls: ['contents/simonSound4.mp3']
    });

    $('#io-ui').click(function () {
        if (swOn) {
            console.log('io-indicator true');
            $('#io-indicator').attr('transform', 'translate(' + 84 + ', 0)');
            $('#lvl-count').html('0');
            swOn = false;
        } else {
            console.log('io-indicator false');
            $('#io-indicator').attr('transform', 'translate(' - 84 + ', 0)');
            $('#lvl-count').html('');
            swOn = true;
        }
    });

    $('#strict-ui').click(function () {
        if (strictMode) {
            $('#strict-indicator').attr('transform', 'translate(' + 84 + ', 0)');
            strictMode = false;
        } else {
            $('#strict-indicator').attr('transform', 'translate(' - 84 + ', 0)');
            strictMode = true;
        }
    });

    function overlayWin() {
        el = document.getElementById("overlay-success");
        el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
    }

    function overlayFail() {
        el = document.getElementById("overlay-failed");
        el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
    }

    $('#overlay-success').click(function () {
        overlayWin();
    });
    $('#overlay-failed').click(function () {
        overlayFail();
    });

    var populateRandom = function () {
        randomArray = [];
        for (var i = 0; i < 20; i++) {
            randomArray.push(Math.floor(Math.random() * 4))
        }
    }

    populateRandom();

    var clearInt = function () {
        if (levelCount == level) {
            //overlay();
            clearInterval(interval);
            interval = null;

        }
    };

    var checkSame = function (userArray, tempArray) {
        var isSame = (userArray.length == tempArray.length) && userArray.every(function (element, index) {
                return element === tempArray[index];
            });
        return isSame;
    }

    var doInt = function () {
        if (swOn) {
            return false;
        }
        levelCount = 0;
        interval = setInterval(function () {

            sounds[randomArray[levelCount]].play();
            $("#field-" + randomArray[levelCount]).fadeIn(50).fadeOut(50).fadeIn(50).fadeOut(50).fadeIn(50);
            clearInt();
            levelCount++;

        }, 500);
    };

    $('#start-container').click(function () {
        if (swOn) {
            return false;
        }
        randomArray = [];
        userArray = [];
        level = 0;
        levelCount = 0;
        $('#lvl-count').html(level);
        populateRandom();
        doInt();
    });


    $(".fields").click(function (event) {
        if (swOn) {
            return false;
        }
        clicks++;
        userArray.push(parseInt(event.target.id.slice(-1)));
        sounds[parseInt(event.target.id.slice(-1))].play();
        $("#field-" + parseInt(event.target.id.slice(-1))).fadeIn(50).fadeOut(50).fadeIn(50).fadeOut(50).fadeIn(50);
        var tempArray = randomArray.slice(0, userArray.length);

        if (checkSame(userArray, tempArray)) {
            if (userArray.length == level + 1) {
                level++;
                $('#lvl-count').html(level);
                userArray = [];
                window.setTimeout(doInt,1000); //doInt();
                clicks = 0;
                return;
            }
        } else {
            if (strictMode) {
                overlayFail();
                level = 0;
                userArray = [];
                populateRandom();
                window.setTimeout(doInt,1000); //doInt();
                $('#lvl-count').html(level);
            } else {
                userArray = [];
                overlayFail();
                window.setTimeout(doInt,1000); //doInt();
                $('#lvl-count').html(level);
            }
        }

    });

});