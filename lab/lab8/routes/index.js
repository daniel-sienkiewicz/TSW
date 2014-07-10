exports.index = function (req, res) {
    req.session.puzzle = req.session.puzzle || req.app.get('puzzle');
    res.render('index', {
        title: 'Mastermind'
    });
};

exports.about = function (req, res) {
    req.session.puzzle = req.session.puzzle || req.app.get('puzzle');
    res.render('about', {
        title: 'Mastermind'
    });
};

exports.play = function (req, res) {
    console.log("UWAGA GRAMY");
    var newGame = function () {
        var i, data = [],
            puzzle = req.session.puzzle;
        for (i = 0; i < puzzle.size; i += 1) {
            data.push(Math.floor(Math.random() * puzzle.dim));
        }

        console.log("Wylosowane liczby: " + data);

        req.session.puzzle.data = data;
        return {
            "retMsg": "coś o aktualnej koniguracji…"
        };
    };
    // poniższa linijka jest zbędna (przy założeniu, że
    // play zawsze używany będzie po index) – w końcowym
    // rozwiązaniu można ją usunąć.
    req.session.puzzle = req.session.puzzle || req.app.get('puzzle');
    /*
     * req.params[2] === wartość size
     * req.params[4] === wartość dim
     * req.params[6] === wartość max
     */
    if (req.params[2]) {
        req.session.puzzle.size = req.params[2];
    }
    res.json(newGame());
};

exports.mark = function (req, res) {
    var data = req.session.puzzle.data;
    console.log("Wylosowane liczby: " + data);

    var markAnswer = function () {
        //**************Sprawdzanie odpowiedzi****************
        console.log("UWAGA SPRAWDZAM");
        var soGood = 0;
        var good = 0;
        var win = false;
        var move = req.params[0].split('/');
        move = move.slice(0, move.length - 1);

        tmp = data.slice();

        // Zlote gwiazdki
        for(var i = 0; i < move.length; i++){
            if(move[i] == tmp[i]){
                soGood++;
                tmp[i] = -1;
                move[i] = -2;
            }
        }

        // Czarne gwiazdki
        for(var i = 0; i < move.length; i++){
            for(var j = 0; j < move.length; j++){
                if(move[j] == tmp[i]){
                    tmp[i] = -3;
                    move[j] = -4;
                    good++;
                }
            }
        }

        // Wygrana
        if(soGood == move.length){
            console.log("WIN");
            win = true;
        } 
        
        // DEBUG
        console.log("Liczby: " + data);
        console.log("Dane: " + move);
        console.log("Dobrze: " + soGood);
        console.log("Prawie dobrze: " + good);
        console.log("Win?: " + win);

        // Zwracane informacje do klienta (JSON)
        return {
            "retVal": {"soGood": soGood, "good": good, "win": win},
            "retMsg": "coś o ocenie – np „Brawo” albo „Buuu”"
        };

        //*****************************************************
    };
    res.json(markAnswer());
};