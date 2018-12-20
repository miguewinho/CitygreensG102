$(document).ready(function(){
    get_counter();
});

function get_counter() {
    $.get( "cart_counter", function( data ) {
        $("#cart_size")[0].innerHTML = data;
    });
}