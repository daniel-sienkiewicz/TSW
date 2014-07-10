var__ = require('underscore');


var tekst = "Ala i As i maly Stas \n poszli w las";
var wzor = new RegExp ('(\\s)(a|i|o|u|w|z)(\\s)','g')

var nbsp = function(){
	 return this.replace(wzor, " "+ "$2 &nbsp; ");
}

String.prototype.nbsp = nbsp;
console.log("Tekst przed zamiana: " + tekst);
console.log("Tekst po zaminania: " + tekst.nbsp());