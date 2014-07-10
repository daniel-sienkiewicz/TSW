var app = angular.module('czatApka', []);

app.factory('socket', function () {
    var socket = io.connect('http://' + location.host);
    return socket;
});

app.controller('chatCtrlr', ['$scope', 'socket',
    function ($scope, socket) {
        var tagsToReplace = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;'
        };

        var replaceTag = function (tag) {
            return tagsToReplace[tag] || tag;
        };

        var safe_tags_replace = function (str) {
            return str.replace(/[&<>]/g, replaceTag);
        };

        $scope.msgs = [];
        $scope.user = "";
        $scope.pokojeNazwy = [];
        $scope.czyWybranyPokoj = false;
        $scope.aktualnyPokoj = "brak";
        
        var chat;

        $scope.sendMsg = function () {
            if ($scope.msg && $scope.msg.text) {
                chat.emit('message', $scope.user + ": " + safe_tags_replace($scope.msg.text.substring(0, 20)));
                $scope.msg.text = '';
            }
        };

        $scope.wyswietlNik = function () {
                return '*** ' + $scope.user +  " (" + $scope.aktualnyPokoj + ') ***';
        };

        $scope.nowyPokoj = function(){
            socket.emit('nowy', $scope.pokoj.text);
            $scope.aktualnyPokoj = $scope.pokoj.text;
            chat = io.connect('http://' + location.host + '/' + $scope.pokoj.text);
            $scope.pokoj.text = "";
            $("#pisanie").show("slow");

            chat.on('message', function (data) {
                $scope.msgs.unshift(data);
                $scope.$digest();
            });
        }

        $scope.zmienPokoj = function(dataa){
            alert("Zmieniono pokoj na " + dataa);
            $("#pisanie").show("slow");
            $scope.aktualnyPokoj = dataa;

            if(chat){
                chat.disconnect();
            }

            chat = io.connect('http://' + location.host + '/' + dataa);

            chat.on('message', function (data) {
                $scope.msgs.unshift(data);
                $scope.$digest();
            });
        }

        socket.on('username', function (data) {
            $scope.user = data;
            $scope.$digest();
        });

        socket.on('p', function (data) {
            $scope.pokojeNazwy = data;
            $("#pokoje").empty();
            $("#pokoje").append("<p>Dostępne pokoje:</p><ul>");
            for(var i = 0; i < $scope.pokojeNazwy.length; i++){
                $("#pokoje").append("<li name=" + $scope.pokojeNazwy[i] + ">" + $scope.pokojeNazwy[i] + "</li>");
            }
            $("#pokoje").append("</ul>");

            $.each($("li"), function( index, value ) {
                $(this).click(function() {
                    $scope.zmienPokoj($(this).attr( "name" ));
                });
            });

            $scope.$digest();
        });
    }
]);