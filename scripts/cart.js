var subtotal = [];

$(document).ready(function(){
    get_cart();
});

function get_cart() {
    $.get( "get_cart", function( data ) {
        if(data == "null") {
            document.getElementById("info_p").style.display = "block";
        } else {
            document.getElementById("info_p").style.display = "none";
        }
        draw(JSON.parse(data));
        set_quantity();
        var input = document.getElementsByTagName("input");
        for (var item in input) {
            update_quantity(input[item]);
        }
    });
    
}

function set_quantity() {
    $.get( "check_cart", function( data ) {
        var input = document.getElementsByTagName("input");
        var response = JSON.parse(data);
        for(var i in input) {
            for(var item in response) {
                if(input[i].id == response[item].name) {  
                    input[i].value = response[item].quantity;
                    update_quantity(input[i]);
                }
            }
        }
    });
}

function btn_click(elem) {
    change_cart(elem.id, elem.value);
    update_quantity(elem);
}

function update_quantity(elem) {
    
    var price = document.getElementById("p_" + elem.name);
    var sub = parseFloat(parseFloat(price.name) * parseFloat(elem.value)).toFixed(2);

    var html1 = [
        '<br>',
        '<span>Subtotal: <strong>', sub, '€</strong></span>'
    ].join('');

    document.getElementById("c_" + elem.name).innerHTML = html1;

    subtotal[elem.name - 1] = sub;

    var total = 0;
    for(i = 0; i < subtotal.length; i++) {
        total += parseFloat(subtotal[i]);
    }

    var html2 = [
        '<span class="text">Subtotal</span>',
		'<span class="price">', parseFloat(total).toFixed(2), '€</span>'
    ].join('');

    document.getElementById("cart_subtotal").innerHTML = html2;

    var html3 = [
        '<span class="text">Total</span>',
		'<span class="price">', parseFloat(total+4.99).toFixed(2), '€</span>'
    ].join('');

    document.getElementById("cart_total").innerHTML = html3;
}

function change_cart(p_name, p_qty) {
    /*
    $.post( "update_quantity", {product : p_name, quantity : p_qty}, function( data ) {
        alert(data);
    });
    */

    $.post( "update_quantity", { product: p_name, qty: p_qty } );


}

function draw(elements) {
    var count = elements.length - 1;
    
    for(var item in elements) {
        var parent = document.getElementById("items");

        var container = document.createElement("div");
        container.classList = "product";
        parent.appendChild(container);

        var row1 = document.createElement("div");
        row1.classList = "row";
        container.appendChild(row1);

        var col1 = document.createElement("div");
        col1.classList = "col-md-3";
        row1.appendChild(col1);

        var img = document.createElement("img");
        img.classList = "img-fluid mx-auto d-block image";
        img.src = elements[item].reduced_image;
        col1.appendChild(img);

        var col2 = document.createElement("div");
        col2.classList = "col-md-8";
        row1.appendChild(col2);

        var info = document.createElement("div");
        info.classList = "info";
        col2.appendChild(info);

        var row2 = document.createElement("div");
        row2.classList = "row";
        info.appendChild(row2);

        var col3 = document.createElement("div");
        col3.classList = "col-md-4 product-name";
        row2.appendChild(col3);

        var p_name = document.createElement("div");
        p_name.classList = "product-name";
        col3.appendChild(p_name);

        var a1 = document.createElement("a");
        a1.href = "#";
        var a1Node = document.createTextNode(elements[item].name);
        a1.appendChild(a1Node);
        p_name.appendChild(a1);

        var p_info = document.createElement("div");
        p_info.classList = "product-info";
        p_name.appendChild(p_info);

        var p = elements[item].price;
        p = p.substring(0, p.length - 1)

        var html1 = [
            '<div>Stock: <span class="value">', elements[item].quantity, '</span></div>',
            '<div><a id="p_', count+1, '" name="', p,'"></a>Price: <span class="value">', elements[item].price, '/kg</span></div>'
        ].join('');

        p_info.innerHTML = html1;

        var col4 = document.createElement("div");
        col4.classList = "col-md-4 quantity";
        row2.appendChild(col4);

        var html2 = [
            '<label for="quantity">Quantity:</label>',
            '<input id="', elements[item].name, '" name="', count+1, '" onchange="btn_click(this)" type="number" value ="1" min="1" class="form-control quantity-input">'
        ].join('');

        col4.innerHTML = html2;

        var col5 = document.createElement("div");
        col5.id = "c_" + (count+1);
        col5.classList = "col-md-3";
        row2.appendChild(col5);

        var col6 = document.createElement("div");
        col6.classList = "col-md-1";
        row2.appendChild(col6);

        var html4 = [
            '<br>',
            '<button name="', elements[item].name, '" onclick="remove_product(this)" class="btn btn-outline-danger btn-sm"><i class="fa fa-trash-alt"></i></button>'
        ].join('');

        col6.innerHTML = html4;

        if(count > 0) {
            var hr = document.createElement("hr");
            hr.classList = "custom-style";
            hr.align = "center";
            parent.appendChild(hr);
        }

        count--;
    }
}

function update_counter() {
    $.get( "cart_counter", function( data ) {
        $("#cart_size")[0].innerHTML = data;
    });
}

function remove_product(elem) {
    $.post( "remove_from_cart", { product: elem.name }, function(data, status){
        update_counter();
        clear();
        get_cart();
    });
}

function clear() {
    document.getElementById("items").innerHTML = "";
}


function payment() {
    alert("Payment successfull!");
    $.get( "add_to_history", function(data) {
      });
}