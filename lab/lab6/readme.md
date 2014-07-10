# Sposób użycia

Zakładamy, że w systemie zainstalowane zostały narzędzia [Bower](http://bower.io/) oraz [Grunt](http://gruntjs.com/).
Jeśli tak nie jest, należy wykonać następujące polecenia:

- `sudo npm install -g bower`
- `sudo npm install -g grunt-cli`

Pod systemem Windows oczywiście pomijamy polecenie `sudo`.

Teraz możemy już zainstalować potrzebne moduły i biblioteki

- `npm install`
- `grunt`

Następnie, w przeglądarce otwieramy kolejno:

- [demo 1](./app/ev_01.html)
- [demo 2](./app/ev_02.html)
- [demo 3](./app/ev_03.html)

Na koniec, aby „posprzątać” niepotrzebne pliki należy wykonać polecenie:

- `grunt clean`

**Uwaga!** Po wykonaniu powyższego polecenia usunięte zostaną również **wszystkie** wykorzystywane zewnętrzne biblioteki i moduły.
Oznacza to, że w celu ponownego obejrzenia przykładów potrzebne będzie wykonanie *od początku* kroków opisanych powyżej (za wyjątkiem instalacji
pakietów `bower` i `grunt-cli`).