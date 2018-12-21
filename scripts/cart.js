$(document).ready(function(){
    $.get( "get_cart", function( data ) {
        draw(JSON.parse(data));
    });
});

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
        img.src = "https://static.greatbigcanvas.com/images/square/panoramic-images/oranges-on-a-tree-santa-paula-ventura-county-california,2005446.jpg?max=128";
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

        var html1 = [
            '<div>Stock: <span class="value">', elements[item].quantity, '</span></div>',
            '<div>Price: <span class="value">', elements[item].price, '/kg</span></div>'
        ].join('');

        p_info.innerHTML = html1;

        var col4 = document.createElement("div");
        col4.classList = "col-md-4 quantity";
        row2.appendChild(col4);

        var html2 = [
            '<label for="quantity">Quantity:</label>',
            '<input id="quantity" type="number" value ="1" class="form-control quantity-input">'
        ].join('');

        col4.innerHTML = html2;

        var col5 = document.createElement("div");
        col5.classList = "col-md-3";
        row2.appendChild(col5);

        var html3 = [
            '<br>',
			'<span>Subtotal: <strong>2,19€</strong></span>'
        ].join('');

        col5.innerHTML = html3;

        var col6 = document.createElement("div");
        col6.classList = "col-md-1";
        row2.appendChild(col6);

        var html4 = [
            '<br>',
			'<button type="button" class="btn btn-outline-danger btn-sm"><i class="fa fa-trash-alt"></i></button>'
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