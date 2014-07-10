$(document).ready(function () {
    var highest = 1;
    $('div').each(function() {
       	$(this).css("border", highest++);
        $(this).css("border-style", "solid");
    });
});