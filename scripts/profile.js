$(document).ready(function(){
    $('.pass_show').append('<span class="ptxt">Show</span>');

    get_user_details();
});
      
$(document).on('click','.pass_show .ptxt', function(){ 
    $(this).text($(this).text() == "Show" ? "Hide" : "Show"); 
    $(this).prev().attr('type', function(index, attr){return attr == 'password' ? 'text' : 'password'; }); 
});  

$('#reset_btn').click(function(event) {
    get_user_details();
});

$('#update_btn').click(function(event) {
    update_user_details();
});


$('#passwordModal button.btn.btn-primary').click(function(event) {
    var flag;
    event.preventDefault();
    if(validate()) {
        document.getElementById("alert_pwd2").style.display = "none";
        // replace '#' by server-side script who get the post content 
        $.post('check_password', $('#pwd_form').serialize(), function(data, status, xhr)
            {
                flag = data;
                
                if(data == 0) {
                    document.getElementById("alert_pwd").style.display = "block";
                }
                else if(data == 1) {
                    document.getElementById("alert_pwd").style.display = "none";
                    
                }
            })
            .done(function() {
                if(flag == 1) {
                    setTimeout(function(){
                        $("#passwordModal").modal('toggle');
                        document.getElementById("pwd_changed").style.display = "block";
                        }, 1000);
                }
            })
            .fail(function() {
                // do something here if there is an error ;
                alert( "error" );
            });
        } else {
            document.getElementById("alert_pwd2").style.display = "block";
    }
});

$('#emailModal button.btn.btn-primary').click(function(event) {
    event.preventDefault();
    if(validateEmail(document.getElementById("email_addr").value)) {
        document.getElementById("email_alert").style.display = "none";
        $.post('change_email', $('#email_form').serialize(), function(data, status, xhr)
            {})
            .done(function() {
                setTimeout(function(){
                    $("#emailModal").modal('toggle');
                    document.getElementById("email_changed").style.display = "block";
                    }, 1000);
            })
            .fail(function() {
                alert( "error" );
            });
    } else {
        document.getElementById("email_alert").style.display = "block";
    }
});

function validate() {
    var pwd1 = document.getElementById("new_password1");
    var pwd2 = document.getElementById("new_password2");

    return (pwd1.value == pwd2.value && pwd1.value != "" && pwd2.value != "");
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function get_user_details() {
    $.get( "get_user_details", function( data ) {
        document.getElementById("user_name").innerHTML = JSON.parse(data)["name"];
        document.getElementById("name").value = JSON.parse(data)["name"];
        document.getElementById("username").value = JSON.parse(data)["username"];
        document.getElementById("addr").value = JSON.parse(data)["address"];
        document.getElementById("zipcode").value = JSON.parse(data)["zip_code"];
        document.getElementById("number").value = JSON.parse(data)["phone_number"];
    });
}

function update_user_detaisl() {
    $.get( "profile_update", function( data ) {
    });
}
