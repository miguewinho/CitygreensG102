/*Password repetition check*/
var password = document.getElementById("password")
  , confirm_password = document.getElementById("password2")
  , registration_form = document.getElementById("form");

function validatePassword(){
  if(password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Passwords Don't Match");
    document.getElementById("icon").className = "fa fa-exclamation-triangle";
    document.getElementById("icon").style.color = "#C70039";
    
  } else {
    confirm_password.setCustomValidity("");
    document.getElementById("icon").className = "fa fa-check-circle";
    document.getElementById("icon").style.color = " #11B022";
  }
}

/*Checks if email address is already in the database*/
var emailBox = document.getElementById("email");
var warning = document.getElementById("warning");

function userExists() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
          if(this.responseText == "True") {
            warning.style.display = "block";
          } else {
            warning.style.display = "none";
          }
        }
    };
    xhttp.open("POST", "/user_exists?email=" + emailBox.value, true);
    xhttp.send();

}

/*Checks the validity of the for*/
function checkValidity() {
  if(warning.style.display == "none") {
    return true;
  } else {
    return false;
  }
}


email.onchange = userExists;
password.onchange = validatePassword;
confirm_password.onkeyup = validatePassword;
registration_form.onsubmit = checkValidity;