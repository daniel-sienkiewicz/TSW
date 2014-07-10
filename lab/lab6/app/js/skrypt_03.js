var addItem = function addItem() {
    $('#lista li.spec button').click(function() {
        var $newLi = $('<li class="spec">nowy <button>Spec</button></li>');
        $(this).parent().after($newLi);
        addItem();
    });
};

$(document).ready(function() {
    addItem();
});
