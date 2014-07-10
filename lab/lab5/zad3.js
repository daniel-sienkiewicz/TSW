var__ = require('underscore');


var myObject = {
	szablon:
		'<table border="{border}">' +
  		'  <tr><td>{first}</td><td>{last}</td></tr><tr><td>{first}</td><td>{last}</td></tr><tr><td>{first}</td><td>{last}</td></tr>' +
  		'</table>',
  	podstaw: function(d){
  		this.szablon = this.szablon.replace(/{first}/g, d.first);
  		this.szablon = this.szablon.replace(/{last}/g, d.last);
  		this.szablon = this.szablon.replace(/{pesel}/g, d.pesel);
  		console.log(this.szablon);
  	}
}

var dane = {
    first: "Jan",
    last:  "Kowalski",
    pesel: "97042176329"
};

myObject.podstaw(dane);