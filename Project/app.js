/**
 * Zalaczenie bibliotek oraz utworzenie serwera
 */
var express = require("express");
var app = express();

var httpServer = require("http").createServer(app);

var socketio = require("socket.io");
var io = socketio.listen(httpServer);
var path = require('path');

var redis = require("redis"),
    client = redis.createClient();

/** 
 * Deklaracja potrzebych zmiennych
 */
var results = []; // wyniki graczy
var data = []; // aktualna lista graczy
var start = 0; // licznik graczy, ktorzy dali start gry
var litereczki = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'W', 'Z']; // literki do losowania
var czas = 200; // czas rundy
var timeOuterID = 0; //do resetowania czasu
var litera = ""; // wylosowana litera do gry
var runda = 0; // okresla ktora runda
var history = []; // historia chatu
var maxCzas = 15 * 1000; // maksylamny czas na runde - 10 s
var pozostalyCzas = maxCzas; // pozostaly czas do konca rundy
var odeszlo = 0; //ilosc graczy ktorzy opuscili gre
var czyGra = false; //czy trwa rozgrywka
var wrong = []; //bledne odpowiedi

/**
 * Wykorzystanie wlasciwego kodu oraz zaleznosci
 */
app.use(express.static("public"));
app.use(express.static("bower_components"));
app.use(express.static(path.join(__dirname, 'bower_components/jquery/dist')));

/**
 * Baza danych REDIS
 */
var runSample = function(data, type) {
    var d = new Date();
    var action = "";

    if (type == 1) {
        action = "login";
    } else {
        action = "logout";
    }

    console.log("Dodaje do bazy");
    client.rpush(data, action + ": " + d, function(err, reply) {});
    client.get(data, function(err, reply) {});
};

/** 
 * DEBUG danych
 */
/*var wypiszDane = function(data) {
    console.log("Dane:");
    console.log("Nik: " + data);
    console.log("Panstwo: " + results[data].panstwo);
    console.log("Miasto: " + results[data].miasto);
    console.log("Rzecz: " + results[data].rzecz);
    console.log("Imie: " + results[data].imie);
    console.log("Samochod: " + results[data].samochod);
} */

/** 
 * Funkcja sprawdzajaca i oceniajaca
 */
var sprawdzWyniki = function() {
    console.log("Sprawdzam wyniki");

    /**
     * DEBUG Wydrukowanie danych graczy
     */
    console.log("Otrzymane dane od userow:");
    for (var i = 0; i < data.length; i++) {
        // console.log("Nik: " + data[i].text);
        // console.log("Panstwo: " + results[data[i].text].panstwo);
        // console.log("Miasto: " + results[data[i].text].miasto);
        // console.log("Rzecz: " + results[data[i].text].rzecz);
        // console.log("Imie: " + results[data[i].text].imie);
        // console.log("Samochod: " + results[data[i].text].samochod);
        if (results[data[i].text]) {
            results[data[i].text].wynik = 0;
        }
    }

    /**
     * Wlasciwy algorytm sprawdzajacy
     */
    var flaga = 0;
    var flagaPuste = 0;
    for (var i = 0; i < data.length; i++) {

        /**
         * Sprawdzanie poprawnosci pola "panstwo"
         */
        if (results[data[i].text] && results[data[i].text].panstwo !== undefined && results[data[i].text].panstwo.length > 1 && results[data[i].text].panstwo.substring(0, 1).toUpperCase() == litera) {
            for (var j = 0; j < data.length; j++) {
                if (i != j) {
                    if (results[data[j].text].panstwo !== undefined && results[data[j].text].panstwo.length > 1 && results[data[i].text].panstwo.toUpperCase() == results[data[j].text].panstwo.toUpperCase()) {
                        flaga = 1;
                    }

                    if (results[data[j].text].panstwo === undefined || results[data[j].text].panstwo == "") {
                        flagaPuste += 1;
                    }
                }
            }

            if (flaga == 1) {
                results[data[i].text].wynik += 5;
            } else if (flagaPuste == data.length - 1) {
                results[data[i].text].wynik += 15;
            } else {
                results[data[i].text].wynik += 10;
            }

            flaga = 0;
            flagaPuste = 0;
        }

        flaga = 0;
        flagaPuste = 0;

        /**
         * Sprawdzanie poprawnosci pola "miasto"
         */
        if (results[data[i].text] && results[data[i].text].miasto !== undefined && results[data[i].text].miasto.substring(0, 1).toUpperCase() == litera && results[data[i].text].miasto.length > 1) {
            for (var j = 0; j < data.length; j++) {
                if (i != j) {
                    if (results[data[j].text].miasto !== undefined && results[data[j].text].miasto.length > 1 && results[data[i].text].miasto.toUpperCase() == results[data[j].text].miasto.toUpperCase()) {
                        flaga = 1;
                    }

                    if (results[data[j].text].miasto === undefined || results[data[j].text].miasto == "") {
                        flagaPuste += 1;
                    }
                }
            }

            if (flaga == 1) {
                results[data[i].text].wynik += 5;
            } else if (flagaPuste == data.length - 1) {
                results[data[i].text].wynik += 15;
            } else {
                results[data[i].text].wynik += 10;
            }

            flaga = 0;
            flagaPuste = 0;
        }

        /**
         * Sprawdzanie poprawnosci pola "rzecz"
         */
        if (results[data[i].text] && results[data[i].text].rzecz !== undefined && results[data[i].text].rzecz.substring(0, 1).toUpperCase() == litera && results[data[i].text].rzecz.length > 1) {
            for (var j = 0; j < data.length; j++) {
                if (i != j) {
                    if (results[data[j].text].rzecz !== undefined && results[data[j].text].rzecz.length > 1 && results[data[i].text].rzecz.toUpperCase() == results[data[j].text].rzecz.toUpperCase()) {
                        flaga = 1;
                    }

                    if (results[data[j].text].rzecz === undefined || results[data[j].text].rzecz == "") {
                        flagaPuste += 1;
                    }
                }
            }

            if (flaga == 1) {
                results[data[i].text].wynik += 5;
            } else if (flagaPuste == data.length - 1) {
                results[data[i].text].wynik += 15;
            } else {
                results[data[i].text].wynik += 10;
            }

            flaga = 0;
            flagaPuste = 0;
        }

        /**
         * Sprawdzanie poprawnosci pola "imie"
         */
        if (results[data[i].text] && results[data[i].text].imie !== undefined && results[data[i].text].imie.substring(0, 1).toUpperCase() == litera && results[data[i].text].imie.length > 1) {
            for (var j = 0; j < data.length; j++) {
                if (i != j) {
                    if (results[data[j].text].imie !== undefined && results[data[j].text].imie.length > 1 && results[data[i].text].imie.toUpperCase() == results[data[j].text].imie.toUpperCase()) {
                        flaga = 1;
                    }

                    if (results[data[j].text].imie === undefined || results[data[j].text].imie == "") {
                        flagaPuste += 1;
                    }
                }
            }

            if (flaga == 1) {
                results[data[i].text].wynik += 5;
            } else if (flagaPuste == data.length - 1) {
                results[data[i].text].wynik += 15;
            } else {
                results[data[i].text].wynik += 10;
            }

            flaga = 0;
            flagaPuste = 0;
        }

        /**
         * Sprawdzanie poprawnosci pola "samochod"
         */
        if (results[data[i].text] && results[data[i].text].samochod !== undefined && results[data[i].text].samochod.substring(0, 1).toUpperCase() == litera && results[data[i].text].samochod.length > 1) {
            for (var j = 0; j < data.length; j++) {
                if (i != j) {
                    if (results[data[j].text].samochod !== undefined && results[data[j].text].samochod.length > 1 && results[data[i].text].samochod.toUpperCase() == results[data[j].text].samochod.toUpperCase()) {
                        flaga = 1;
                    }

                    if (results[data[j].text].samochod === undefined || results[data[j].text].samochod == "") {
                        flagaPuste += 1;
                    }
                }
            }

            if (flaga == 1) {
                results[data[i].text].wynik += 5;
            } else if (flagaPuste == data.length - 1) {
                results[data[i].text].wynik += 15;
            } else {
                results[data[i].text].wynik += 10;
            }

            flaga = 0;
            flagaPuste = 0;
        }

        if (runda == 0 && results[data[i].text]) {
            results[data[i].text].all = results[data[i].text].wynik;
        } else {
            results[data[i].text].all += results[data[i].text].wynik;
        }
    }

    /** 
     * DEBUG Wydrukowanie wynikow graczy
     */
    console.log("Wyniki:");
    for (var i = 0; i < data.length; i++) {
        console.log("Nik: " + data[i].text);
        console.log("Wynik: " + results[data[i].text].wynik);
        console.log("Wynik All: " + results[data[i].text].all);
    }
}

/**
 * Wlasciwa logika
 */
io.sockets.on('connection', function(socket) {
    /**
     * nik gracza - bezpieczenstwo
     */
    var playername = "";

    io.sockets.emit('liczbaGraczy', data);
    io.sockets.emit('czyGra', czyGra);

    /**
     * czy gracz jest adminem rozgrywki
     */
    var admin = 0;

    /**
     * Przyjecie wpisanych danych od klientow
     */
    socket.on('send data', function(dataContainer) {
        var i = 0;

        if (playername !== undefined) {
            console.log(dataContainer);
            console.log("Odebralem dane od " + playername);

            /**
             * Przypisanie danych wyslanych do gracza
             */
            if (dataContainer)
                results[dataContainer.nik] = dataContainer;
            else results[playername] = {};

            res = {}; // do wysylania danych z konkretnej rundy

            /** 
             * Debug do sprawdzenia danych
             */
            //wypiszDane(dataContainer.nik);

            /**
             * Zliczanie czy wszytscy wyslali wyniki
             */
            for (var skoczek in results) {
                i++;
            }

            /**
             * DEBUG - sprawdzenie czy wszyscy aktywni gracze wyslali odpowiedzi
             */
            console.log("Wyslane: " + i + " Uczestniczy: " + data.length);

            if ((i - odeszlo) === data.length) {
                sprawdzWyniki();

                for (var i = 0; i < data.length; i++) {
                    data[i].wynik = results[data[i].text].wynik;

                    if (data[i].all === undefined || data[i].all === null) {
                        data[i].all = 0;
                    }

                    data[i].all += results[data[i].text].all;

                    /**
                     * Obiekt JSON do wyslania dla userow z odpowiedziami wszystkich graczy
                     */
                    res[data[i].text] = {
                        panstwo: results[data[i].text].panstwo,
                        miasto: results[data[i].text].miasto,
                        rzecz: results[data[i].text].rzecz,
                        imie: results[data[i].text].imie,
                        samochod: results[data[i].text].samochod
                    };
                }

                /**
                 * Zerowanie czasu
                 */
                clearInterval(timeOuterID);
                pozostalyCzas = maxCzas;
                czas = 2000;

                console.log("Koniec tury");
                io.sockets.emit('wynikiTury', data);
                io.sockets.emit('daneTury', res);

                /**
                 * Czas na ocenianie odpowiedzi innych graczy
                 */
                var czasOceny = data.length * 5000;
                var ocenianie = setTimeout(function() {
                    io.sockets.emit('newGame', "nowa");
                    czyGra = false;
                    io.sockets.emit('czyGra', czyGra);
                }, czasOceny);
            }
        }
    });

    /**
     * Start gry - jak wszytsy dadza guzik START
     */
    socket.on('start gry', function(dataContainer) {
        console.log("Startujemy gre");
        console.log("Runda: " + runda);
        var literka = "";
        start++;
        console.log("Start: " + start);

        /** 
         * Minimum 3 graczy
         */
        if (data.length > 2) {
            if (start - odeszlo === data.length) {
                czyGra = true;
                literka = Math.floor(Math.random() * 100) % litereczki.length;
                console.log("Wylosowalem literke: " + litereczki[literka]);
                litera = litereczki[literka];
                io.sockets.emit('start gry', litera);
                start = 0;

                io.sockets.emit("czasomierz", pozostalyCzas / 1000);

                /**
                 * Liczenia czasu rundy
                 */
                timeOuterID = setInterval(function() {
                    if (pozostalyCzas > 0) {
                        io.sockets.emit('czyGra', czyGra);
                        io.sockets.emit("czasomierz", pozostalyCzas / 1000);
                        pozostalyCzas = pozostalyCzas - 1 * 1000;
                    } else {
                        io.sockets.emit("timeOut", "koniec");
                        pozostalyCzas = maxCzas;
                        clearInterval(timeOuterID);
                        czyGra = false;
                    }
                }, 1000);
            }
        }
    });

    /**
     * Nowa Gra
     */
    socket.on('nowa gra', function(dataContainer) {
        console.log("Nowa tura");
        console.log("Start: " + start);
        results = [];
        runda = 0;
        odeszlo = 0;
    });

    /**
     * Dodanie nowego gracza do listy i wyslanie aktualniej ilosci graczy
     */
    socket.on('send player', function(dataCount) {
        console.log("Dolaczyl nowy gracz: " + dataCount.text);

        /**
         * Dodanie informacji o zalogowaniu sie gracza
         */
        runSample(dataCount.text, 1);
        playername = dataCount.text;
        data.push(dataCount);
        io.sockets.emit('liczbaGraczy', data);

        /**
         * Nadanie admina gry
         */
        if (data.length == 1) {
            admin = 1;
            io.sockets.emit('admin', 1);
        }
    });

    /** 
     * Chat
     */
    socket.on('send msg', function(data) {
        history.unshift(data);
        io.sockets.emit('rec msg', data);
    });

    /**
     * Wyslanie informacji kto jest adminem gdy pierwotny sie wyloguje
     */
    socket.on('jestemAdminem', function(data) {
        admin = 1;
    });

    /**
     * Zgloszone zle dane przez innych graczy
     */
    socket.on('zle', function(dataa) {
        console.log("Jest zla odpowiedz:");
        console.log(dataa.id + " " + dataa.elem);

        /**
         * Liczenie bledow
         */
        switch (dataa.elem) {
            case "panstwo":
                if (results[data[dataa.id - 1].text].wrongPanstwo === undefined) {
                    results[data[dataa.id - 1].text].wrongPanstwo = 1;
                } else {
                    results[data[dataa.id - 1].text].wrongPanstwo += 1;
                }
                break;
            case "miasto":
                if (results[data[dataa.id - 1].text].wrongMiasto === undefined) {
                    results[data[dataa.id - 1].text].wrongMiasto = 1;
                } else {
                    results[data[dataa.id - 1].text].wrongMiasto += 1;
                }
                break;
            case "rzecz":
                if (results[data[dataa.id - 1].text].wrongRzecz === undefined) {
                    results[data[dataa.id - 1].text].wrongRzecz = 1;
                } else {
                    results[data[dataa.id - 1].text].wrongRzecz += 1;
                }
                break;
            case "imie":
                if (results[data[dataa.id - 1].text].wrongImie === undefined) {
                    results[data[dataa.id - 1].text].wrongImie = 1;
                } else {
                    results[data[dataa.id - 1].text].wrongImie += 1;
                }
                break;
            case "samochod":
                if (results[data[dataa.id - 1].text].wrongSamochod === undefined) {
                    results[data[dataa.id - 1].text].wrongSamochod = 1;
                } else {
                    results[data[dataa.id - 1].text].wrongSamochod += 1;
                }
                break;
        }

        /**
         * DEBUG - wydruk bledow
         */
        console.log(results[data[dataa.id - 1].text].wrongPanstwo);
        console.log(results[data[dataa.id - 1].text].wrongMiasto);
        console.log(results[data[dataa.id - 1].text].wrongRzecz);
        console.log(results[data[dataa.id - 1].text].wrongImie);
        console.log(results[data[dataa.id - 1].text].wrongSamochod);

        /**
         * Jezeli conajmniej 2 graczy stwierdzi blad zostaje odebrane 15 pkt
         */
        if (results[data[dataa.id - 1].text].wrongPanstwo == 2) {
            console.log("User " + data[dataa.id - 1].text + " klamal");
            data[[dataa.id - 1]].all -= 15;
            results[data[dataa.id - 1].text].wrongPanstwo = 3;
        }

        if (results[data[dataa.id - 1].text].wrongMiasto == 2) {
            console.log("User " + data[dataa.id - 1].text + " klamal");
            data[dataa.id - 1].all -= 15;
            results[data[dataa.id - 1].text].wrongMiasto = 3;
        }

        if (results[data[dataa.id - 1].text].wrongRzecz == 2) {
            console.log("User " + data[dataa.id - 1].text + " klamal");
            data[dataa.id - 1].all -= 15;
            results[data[dataa.id - 1].text].wrongRzecz = 3;
        }

        if (results[data[dataa.id - 1].text].wrongImie == 2) {
            console.log("User " + data[dataa.id - 1].text + " klamal");
            data[dataa.id - 1].all -= 15;
            results[data[dataa.id - 1].text].wrongImie = 3;
        }

        if (results[data[dataa.id - 1].text].wrongSamochod == 2) {
            console.log("User " + data[dataa.id - 1].text + " klamal");
            data[dataa.id - 1].all -= 15;
            results[data[dataa.id - 1].text].wrongSamochod = 3;
        }

        io.sockets.emit('wynikiTury', data);
    });

    /**
     * Rozlaczenie sie gracza
     */
    socket.on('disconnect', function() {
        if (playername != "") {
            console.log("Gracz " + playername + " nas opuscil");

            /**
             * Dodanie informacji do bazy o wylogowaniu sie gracza
             */
            runSample(playername, 2);
            results[playername] = {};
            for (i = 0; i < data.length; i++) {
                if (data[i].text == playername) {
                    var doUsuniecia = i;
                }
            }

            /**
             * Usuniecie gracza z listy graczy
             */
            data.splice(doUsuniecia, 1);
            io.sockets.emit('liczbaGraczy', data);

            if (admin) {
                io.sockets.emit('admin', 1);
            }
            odeszlo++;
            console.log("Usunieto gracza nr " + doUsuniecia);
        }
    });
});

/**
 * Nasluch - port 3000
 */
httpServer.listen(3000, function() {
    console.log('Serwer HTTP działa na pocie 3000');
});