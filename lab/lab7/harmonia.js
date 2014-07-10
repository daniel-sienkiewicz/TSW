var zwin = function(e){
    //console.log('zwijam');
    e.style.display = "none";
};

var rozwin = function(e){
    //console.log('rozwijam');
    e.style.display = "";
};

var click = function(e){
    var content = e.target.nextElementSibling;
    
    if(content.style.display === "none"){
        rozwin(content);
        e.target.clicked = true;
    }
    else if(content.style.display === ""){
        zwin(content);
        e.target.clicked = false;
    }
};

var mouseone = function(e){
    var content = e.target.nextElementSibling;
    console.log('Clicked ' + e.target.clicked);
    console.log('Style ' + content.style.display);
    
    if(e.target.clicked === false && content.style.display === "none"){
        rozwin(content);
    }
};

var mousetwoo = function(e)
{
    var content = e.target.nextElementSibling;
    console.log('Clicked ' + e.target.clicked);
    console.log('Style ' + content.style.display);
    if(e.target.clicked === false && content.style.display === ""){
        zwin(content);
    }
}

var harmonia = function(){
    var hd = document.querySelectorAll("div.hd");
    var bd = document.querySelectorAll("div.bd");

    Array.prototype.forEach.call(bd, hide);

    for (var i = 0; i < hd.length; i++) {
        console.log("Naglowek: " + i);
        addEvent(hd[i], 'click', click);
        addEvent(hd[i], 'mouseover', mouseone);
        addEvent(hd[i], 'mouseout', mousetwoo);
    }
};

var hide = function(e){
    e.style.display = 'none';
    e.previousElementSibling.clicked = false;
};

domReady(harmonia);