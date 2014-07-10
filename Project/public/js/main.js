var app = angular.module('PanstwaMiasta', []);

app.factory('socket', function() {
    var socket = io.connect('http://' + location.host);
    return socket;
});

app.controller('graCtrlr', ['$scope', 'socket',
    function($scope, socket) {

        /**
         * Deklaracja potrzebych zmiennych
         */
        $scope.connected = false; // czy gracz jest polaczony
        $scope.dataContainer = ""; //dane wpisane do formularza
        $scope.nikus = false; // podanie niku
        $scope.nik = ""; // nik
        $scope.iloscGraczy = 0; // aktualny licznik graczy
        $scope.gracze = ""; // lista grajacych graczy
        $scope.wynikiTury = []; // wyniki danej tury
        $scope.literka = ""; // wylosowana literka
        $scope.koniec = 1; // czy koniec czasy gry
        $scope.gra = false; // pola do wypelniania "gra"
        $scope.wyniki = false; // wyswietlanie wynikow
        $scope.gotowy = false; // guzik gotowosci przez gracza
        $scope.infoIlosc = false; // informacja o oczekiwaniu na reszte graczy
        $scope.infoInfo = false; // informacja o koncu gry
        $scope.nowaGraG = false; // nowa Gra
        $scope.runda = 1; // okresla ktora jest aktualnie runda
        $scope.czyInformacje = true; // czy wyswietlic wszytskie wyniki
        $scope.czyData = true; // czy wyswietlic informacje o rundzie, literce itp
        $scope.czyWyslano = false; // czy dane zostaly wysyalne do serwera - punkty glowne wyswietlanie
        $scope.odpowiedzi = false; // czy wyswietlac odpowiedzi graczy w danej turze;
        $scope.msgs = []; // wiadomosc na chat
        $scope.wysylanie = true; //flaga sprawdzajaca wysylanie danych d0 serwera
        $scope.czasomierz = 0; // wywietlany czas do konca rundy
        $scope.admin = 0; //czy user jest adminem gry
        $scope.czyGra = false; //czy gra leci
        $scope.gram = false; //czy ja gram

        /**
         * Okienka dialogowe - autor i zasady
         */
        $scope.dial = function(data) {
            if (data == 1) {
                $("#dialog").empty();
                $("#dialog").append("<p>ZASADY:</p><div id='zasady'>Państwa - miasta – rodzaj gry towarzyskiej polegającej na wyszukiwaniu słów z różnych dziedzin rozpoczynających się na zadaną literę</div>");
                $("#dialog").dialog();
            } else if (data == 2) {
                $("#dialog").empty();
                $("#dialog").append("<div>Daniel Sienkiewicz<br />206358</div><div id='bomber'><img src='img/bomber.gif' alt='bomber' /></div>");
                $("#dialog").dialog();
            }
        };

        /**
         * Wyslanie wpisanych danych przez klienta do serwera
         */
        $scope.wyslijDane = function() {
            if ($scope.walidacja()) {

                /** 
                 * Wysłanie danych do serwera
                 */
                $scope.gra = false;
                $("#informacje").empty();
                $("#informacje").append("<strong>Czekam na wysłanie odpowiedzi przez resztę graczy</strong>");
                $("#informacje").show("slow");
                if ($scope.wysylanie) {
                    socket.emit('send data', $scope.dataContainer);
                    $scope.wysylanie = false;
                }
            }
        };

        /**
         * Wyslanie wiadomosci z chat
         */
        $scope.sendMsg = function() {
            if ($scope.msg && $scope.msg.text) {
                socket.emit('send msg', $scope.nik.text + ": " + $scope.msg.text);
                $scope.msg.text = '';
            }
        };

        /**
         * Walidacja danych wpisanych przez klienta
         */
        $scope.walidacja = function() {
            $scope.dataContainer.nik = $scope.nik.text;
            return true;
        };

        /**
         * Wyswietla aktualny czas do konca rundy
         */
        $scope.czasomierzF = function() {
            return $scope.czasomierz;
        };

        /**
         * Wyslanie niku do serwera przez klienta
         */
        $scope.sendNik = function() {
            var flaga = false;

            if ($scope.nik && $scope.nik.text) {

                /**
                 * Sprawdzenie czy nik się nie powtarza
                 */
                for (var i = 0; i < $scope.iloscGraczy; i++) {
                    if ($scope.gracze[i].text == $scope.nik.text) {
                        flaga = true;
                    }
                }

                /**
                 * Wyslanie niku do serwera
                 */
                if (!flaga && !$scope.czyGra) {
                    $scope.gram = true;
                    $("#informacje").hide("slow");
                    $scope.nikus = true;
                    $scope.gotowy = true;
                    $scope.nowaGraG = false;
                    $scope.iloscGraczy++;
                    socket.emit('send player', $scope.nik);
                    flaga = false;
                    $(".bs-example").hide("slow");
                    $("#odpowiedziGraczy").hide();
                }

                /**
                 * Wyswietlenie informacji odnosnie blednego niku lub toczacej sie gry
                 */
                else {
                    $("#informacje").empty();

                    if ($scope.czyGra) {
                        $("#informacje").append("<strong>Trwa gra - poczekaj do konca rundy</strong>");
                    } else {
                        $("#informacje").append("<strong>Taki gracz już gra</strong>");
                    }

                    $("#informacje").show("slow");
                    $scope.nik.text = "";
                }
            }
        };

        /**
         * Gracz klika guzik startujacy gre - serwer czeka na gotowosc wszytskich graczy
         */
        $scope.startGry = function() {
            $scope.gotowy = false;
            $scope.infoIlosc = true;
            socket.emit('start gry', "Startujemy");
        };

        /**
         * Wyswietlenie niku gracza
         */
        $scope.wyswietlNik = function() {
            if ($scope.nikus && $scope.nik.text) {
                return '*** ' + $scope.nik.text + ' ***';
            }
        };

        /**
         * Wyswietlenie ilosci graczy u graczy
         */
        $scope.wyswietlIleGraczy = function() {
            return $scope.iloscGraczy;
        };

        /**
         * Wyswietlenie kotra jest aktualnie runda
         */
        $scope.getRunda = function() {
            return $scope.runda;
        };

        /** 
         * Wyswietlenie wynikow tury
         */
        $scope.wyswietlWynikiTury = function() {
            for (var i = 0; i < $scope.gracze.length; i++) {
                if ($scope.nik !== undefined && $scope.wynikiTury[i] !== undefined && $scope.wynikiTury[i].text == $scope.nik.text) {
                    return "Twoj wynik w tej turze to: " + $scope.wynikiTury[i].wynik;
                }
            }
        };

        /** 
         * Wyswietlenie aktualnych wynikow po pliknieciu w guzik lub schowanie ich
         */
        $scope.aktualneWyniki = function() {
            var gracze = "";
            var lp = 0;

            for (var skoczek in $scope.gracze) {
                lp++;

                if ($scope.gracze[lp - 1].all === undefined) {
                    $scope.gracze[lp - 1].all = 0;
                }

                if ($scope.czyWyslano) {
                    gracze += "<tr><td>" + lp + "</td><td>" + $scope.gracze[lp - 1].text + "</td><td>" + $scope.wynikiTury[lp - 1].all + "</td>";
                } else {
                    gracze += "<tr><td>" + lp + "</td><td>" + $scope.gracze[lp - 1].text + "</td><td>" + 0 + "</td>";
                }
            }

            if ($scope.czyInformacje) {
                $("#informacje").empty();
                $("#informacje").append("<strong>Aktualne wyniki:</strong><div class='table-responsive'><table class='table table-striped'><thead><tr><th>#</th><th>Nik</th><th>Punkty</th></tr></thead><tbody>" + gracze + "</tbody></table></div>");
                $("#informacje").show("slow");
                $scope.czyInformacje = false;
            } else {
                $("#informacje").hide("slow");
                $("#informacje").empty();
                $scope.czyInformacje = true;
            }
        };

        /**
         * Uaktywnienie informacji
         */
        $scope.dataHideShow = function() {
            if ($scope.czyData) {
                $("#data").hide("slow");
                $scope.czyData = false;
            } else {
                $("#data").show("slow");
                $scope.czyData = true;
            }
        };

        /**
         * Wyswietlenie informacji o koncu czasu na runde
         */
        $scope.wyswietlInfo = function() {
            if ($scope.koniec === 0) {
                $scope.gotowy = false;
                $('#info').show("slow");
                $scope.infoInfo = true;
                return "Koniec czasu";
            }
        }

        /**
         * Wyswietlenie informacji o koncu czasu gry
         */
        $scope.timeOut = function() {
            return $scope.koniec;
        }

        /** 
         * Wyswietlenie literki
         */
        $scope.wyswietlLiterke = function() {
            return $scope.literka;
        }

        /**
         * Rozpoczecie nowej tury
         */
        $scope.nowaGra = function() {
            if ($scope.gram) {
                $scope.koniec = 1;
                $('#info').hide("slow");
                $scope.odpowiedzi = false;
                $("#odpowiedziGraczy").hide("slow");
                socket.emit('nowa gra', "Nowa tura");
                $scope.dataContainer.panstwo = "";
                $scope.dataContainer.miasto = "";
                $scope.dataContainer.imie = "";
                $scope.dataContainer.rzecz = "";
                $scope.dataContainer.samochod = "";
                $scope.wyniki = false;
                $scope.gra = false;
                $scope.nowaGraG = false;
                $scope.gotowy = true;
                $scope.infoInfo = false;
                $scope.runda++;
            }
        }

        /**
         * Wyswietla dane graczy po kazdej rundzie
         */
        socket.on('daneTury', function(dataa) {
            if ($scope.gram) {
                var gracze = "";
                $("#informacje").hide("slow");
                $("#odpowiedziGraczy").empty();

                for (i = 0; i < $scope.gracze.length; i++) {
                    var lp = i + 1;
                    var panstwo = typeof dataa[$scope.gracze[i].text].panstwo !== 'undefined' ? dataa[$scope.gracze[i].text].panstwo : "";
                    var miasto = typeof dataa[$scope.gracze[i].text].miasto !== 'undefined' ? dataa[$scope.gracze[i].text].miasto : "";
                    var imie = typeof dataa[$scope.gracze[i].text].imie !== 'undefined' ? dataa[$scope.gracze[i].text].imie : "";
                    var rzecz = typeof dataa[$scope.gracze[i].text].rzecz !== 'undefined' ? dataa[$scope.gracze[i].text].rzecz : "";
                    var samochod = typeof dataa[$scope.gracze[i].text].samochod !== 'undefined' ? dataa[$scope.gracze[i].text].samochod : "";

                    gracze += "<tr><td>" + lp + "</td>" + "<td>" + $scope.gracze[i].text + "</td><td>" + panstwo + "</td><td><img class='wrong' id=" + lp + " name='panstwo' src='img/wrong.png' alt='wrong'></td><td>" + miasto + "</td><td><img class='wrong' id=" + lp + " name='miasto' src='img/wrong.png' alt='wrong'></td><td>" + rzecz + "</td><td><img class='wrong' id=" + lp + " name='rzecz' src='img/wrong.png' alt='wrong'></td><td>" + imie + "</td><td><img class='wrong' id=" + lp + " name='imie' src='img/wrong.png' alt='wrong'></td><td>" + samochod + "</td><td><img class='wrong' id=" + lp + " name='samochod' src='img/wrong.png' alt='wrong'></td></tr>";
                }

                $("#odpowiedziGraczy").append("<strong>Odpowiedzi reszty graczy:</strong><div class='table-responsive'><table class='table table-striped'><thead><tr><th>#</th><th>Nik</th><th>Panstwo</th><th></th><th>Miasto</th><th></th><th>Rzecz</th><th></th><th>Imie</th><th></th><th>Samochod</th><th></th></tr></thead><tbody>" + gracze + "</tbody></table></div>");
                $("#odpowiedziGraczy").show("slow");

                /**
                 * Zgloszenie blednej odpowiedzi
                 */
                $.each($("img"), function(index, value) {
                    $(this).click(function() {
                        $(this).hide("slow");
                        var el = {
                            id: $(this).prop("id"),
                            elem: $(this).prop("name")
                        }
                        socket.emit('zle', el);
                    });
                });
            }
            $scope.$digest();
        });

        /**
         * Odebranie ilosci graczy od serwera
         */
        socket.on('liczbaGraczy', function(data) {
            $scope.iloscGraczy = data.length;
            $scope.gracze = data;
            if ($scope.iloscGraczy > 2 && $scope.admin) {
                $("#admin").removeAttr("disabled");
            }
            $scope.$digest();
        });

        /**
         * Odebranie od serwera czasu
         */
        socket.on('czasomierz', function(data) {
            $scope.czasomierz = data;
            $scope.$digest();
        });

        /**
         * Odebranie konca czasu gry
         */
        socket.on('timeOut', function(data) {
            if ($scope.gram) {
                $scope.koniec = 0;
                $("#wyslij").click();
            }
            $scope.$digest();
        });

        /**
         * Odebranie literki od serwera i start gry
         */
        socket.on('start gry', function(data) {
            if ($scope.gram) {
                $scope.literka = data;
                $scope.wysylanie = true;
                $scope.gra = true;
                $scope.infoIlosc = false;
            }
            $scope.$digest();
        });

        /**
         * Odebranie wynikow tury od serwera
         */
        socket.on('wynikiTury', function(data) {
            $scope.wynikiTury = data;
            $scope.czyWyslano = true;
            $scope.nowaGraG = true;
            $scope.wyniki = true;
            $scope.odpowiedzi = true;
            $scope.$digest();
        });

        /**
         * Chat
         */
        socket.on('rec msg', function(data) {
            $scope.msgs.unshift(data);
            $scope.$digest();
        });

        /**
         * Czy gra
         */
        socket.on('czyGra', function(data) {
            $scope.czyGra = data;
            $scope.$digest();
        });

        /**
         * Akceptacja admina gry
         */
        socket.on('admin', function(data) {
            if ($scope.gracze[data - 1].text == $scope.nik.text) {
                console.log($scope.nik.text + " jest adminem");
                $scope.admin = data;

                $("#gotowosc").empty();
                $("#gotowosc").append("<strong>Jestes adminem - gra zacznie się gdy zdecydujesz, że liczba graczy jest odpowiednia</strong>");
                $("#admin").attr("disabled", "disabled");
                socket.emit('jestemAdminem', 1);
            }
        });

        /**
         * Polaczenie do gry
         */
        socket.on('connect', function() {
            $scope.connected = true;
            $scope.$digest();
        });

        /**
         * Nowa gra
         */
        socket.on('newGame', function(data) {
            $scope.nowaGra();
            $scope.$digest();
        });
    }
]);