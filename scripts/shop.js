/*Global vars*/ 
var response; 
var category = "";

function get_products(callback) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200) {
        response = JSON.parse(this.responseText);
        callback();
      }
  };
  xhttp.open("GET", "/get_products_list?category=" + category, true);
  xhttp.send();
}

function print_products() {
  if(response == undefined) {
    return false;
  }
  
  if(category == "") {
    for (var cat in response) {
      create_elements(response[cat])
    }
  }
  else {
    create_elements(response);
  }
}

function create_elements(object) {
  parent = document.getElementById("row-list");
  for(key in object) {
    var div1 = document.createElement("div");
    div1.classList = "col-lg-4 col-md-6 mb-4"
    
    var div2 = document.createElement("div");
    div2.classList = "card h-100";
    div1.appendChild(div2);

    var a1 = document.createElement("a");
    a1.href = "#";
    var img = document.createElement("img");
    img.classList = "card-img-top";
    img.src = object[key].image;
    img.alt = "";
    a1.appendChild(img);
    div2.appendChild(a1);

    var div3 = document.createElement("div");
    div3.classList = "card-body";
    div2.appendChild(div3);

    var h4 = document.createElement("h4");
    h4.classList = "card-title";
    var a2 = document.createElement("a");
    a2.href = "#";
    var nameNode = document.createTextNode(object[key].name);
    a2.appendChild(nameNode);
    h4.appendChild(a2);
    div3.appendChild(h4);

    var h5 = document.createElement("h5");
    var priceNode = document.createTextNode(object[key].price);
    h5.appendChild(priceNode);
    div3.appendChild(h5);

    var p1 = document.createElement("p");
    var pNode = document.createTextNode(object[key].description);
    p1.appendChild(pNode);
    div3.appendChild(p1);

    var inner = [
    ].join('');

    var div4 = document.createElement("div");
    div4.classList = "card-footer";
    div4.innerHTML = inner;
    div2.appendChild(div4);

    //Adds button
    var html = [
      '<label class="btn btn-lg btn-success active">',
        '<input type="radio" name="options" id="option1" autocomplete="off" checked>',
        '<i class="fa fa-check"></i> Added',
      '</label>',
      '<label class="btn btn-lg btn-danger">',
        '<input type="radio" name="options" id="option2" autocomplete="off">',
        '<i class="fa fa-plus"></i> Add to cart',
      '</label>'
    ].join('');

    var div5 = document.createElement("div");
    div5.setAttribute('class', 'center-footer');
    div5.setAttribute('data-toggle', 'buttons');
    div5.innerHTML = html;

    div4.appendChild(div5);

    parent.appendChild(div1);
  }
}

function clear_page() {
  document.getElementById("row-list").innerHTML = "";
}

function init() {
  var items = document.getElementsByClassName("list-group-item");

  for( var i = 0; i < items.length; i++) {
    items[i].addEventListener("click", function() {
      var current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace(" active", "");
      if(this.innerHTML != "Filter by category" && this.id != "search") {
        this.className += " active";
      }
    })
  }
}

function set_category(elem) {
  if(elem.id == "all") {
    category = "";
  } else {
    category = elem.id;
  }
  
  clear_page();
  get_products(print_products);
}

document.onload = get_products(print_products);
window.onload = init;