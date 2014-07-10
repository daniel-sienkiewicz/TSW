$(document).ready(function () {
    $('body').html(function(i, v) {
        return v.replace(/brzydkie/g, '<span style="color:#FF0000;">CENZURA</span>');  
    });
});