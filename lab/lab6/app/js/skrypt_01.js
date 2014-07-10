$(document).ready(function () {
    $('#lista li.spec button').click(function () {
        var $newLi = $('<li class="spec">nowy <button>Spec</button></li>');
        $(this).parent().after($newLi);
    });
});
