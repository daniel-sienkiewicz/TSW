$(document).ready(function () {
    var even = true;
    $('#lista').click(function (event) {
        var $newLi = $('<li class="spec">nowy <button>Spec</button></li>'),
            $tgt = $(event.target);
        if ($tgt.is('button')) {
            $tgt.parent().after($newLi);
        }
        $(this).css({
            backgroundColor: even === true ? '#ccc' : '#eee'
        });
        even = !even;
    });
});
