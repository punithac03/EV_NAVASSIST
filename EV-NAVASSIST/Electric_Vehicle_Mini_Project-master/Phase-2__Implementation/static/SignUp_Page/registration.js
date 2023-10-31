document.querySelector("form").addEventListener("submit", function (event) {
  event.preventDefault(); 
  if (validateForm()) {
    this.submit();
  }
});

function validateForm() {
        // Username validation
        var usernameInput = document.getElementById("username");
        var username = usernameInput.value.trim();
        var usernameRegex = /^[a-zA-Z0-9]{8,}$/;
        if (!usernameRegex.test(username)) {
          alert(
            "Username must be alphanumeric and have at least 8 characters."
          );
          return false;
        }

        // First name and last name validation
        var firstnameInput = document.getElementById("firstname");
        var lastnameInput = document.getElementById("lastname");
        var firstname = firstnameInput.value.trim();
        var lastname = lastnameInput.value.trim();
        var nameRegex = /^[a-zA-Z]+$/;
        if (!nameRegex.test(firstname) || !nameRegex.test(lastname)) {
          alert("First name and last name should not contain special characters or digits.");
          return false;
        }

        // Email validation
        var emailInput = document.getElementById("email");
        var email = emailInput.value.trim();
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          alert("Please enter a valid email address.");
          return false;
        }

        // Contact number validation
        var contactInput = document.getElementById("contact-number");
        var contactNumber = contactInput.value.trim();
        var contactRegex = /^\d{10}$/;
        if (!contactRegex.test(contactNumber)) {
          alert("Please enter a valid 10-digit contact number.");
          return false;
        }

        // Password validation
        var passwordInput = document.getElementById("password");
        var confirmPasswordInput = document.getElementById("confirm-password");
        var password = passwordInput.value;
        var confirmPassword = confirmPasswordInput.value;
        var passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
        if (!passwordRegex.test(password)) {
          alert(
            "Password should be strong and contain at least one special character, one uppercase letter, one lowercase letter, and one digit."
          );
          return false;
        }

        // Check for password and confirm password match
        if (password !== confirmPassword) {
          alert("Password and confirm password do not match.");
          return false;
        }

        return true; 
      }
  