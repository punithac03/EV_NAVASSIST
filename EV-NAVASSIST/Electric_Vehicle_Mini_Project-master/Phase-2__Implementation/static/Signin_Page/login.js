document.addEventListener("DOMContentLoaded", function() {
    var form = document.getElementById("signin-form");
    form.addEventListener("submit", function(event) {
      if (!validateForm()) {
        event.preventDefault(); 
      }
    });
  
    function validateForm() {
      var username = document.getElementById("username").value;
      var password = document.getElementById("password").value;
  
      if (username.trim() === "") {
        alert("Please enter a username");
        return false;
      }
  
      if (password.trim() === "") {
        alert("Please enter a password");
        return false;
      }
  
      return true;
    }
  });
  
  