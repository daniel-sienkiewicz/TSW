$(document).ready(function () {
    var result = "";
    $("li").each(function() {
       result += $(this).text();
    });
    alert(result);
});