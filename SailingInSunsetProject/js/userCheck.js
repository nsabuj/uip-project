// ==========================================================================================================
// Customer View : user and login checks
//
// The file checks currently active user and gives login functionality on the customer.html page
//
// ==========================================================================================================

// Function to check login credentials

function checkUser() {
  // get user details
  var credentials = userDetails(document.getElementById("username").value);
  // If credentials empty then user does not exist
  if (credentials != "empty") {
    // check if password matches
    if (credentials[5] == md5(document.getElementById("password").value)) {
      $(document).ready(function() {
        // show cart on login
        $("#cartSection").show("slow");
        // Reflect login on modal
        // $("#logged").html("Logged In");
        $("#loggedInImage").show();
        // add user to session
        window.sessionStorage.setItem("currentUser", credentials[1]);
        // show logged text on modal
        $("#logged").show();
        // change vip button to Hi, Name
        $("#vip").html("Hi, " + credentials[2]);
        $("#vip").prop("disabled", true);
        $("#signout").show();

        setTimeout(function() {
          $("#modal").removeClass("show-modal");
          $("#signin").hide();
          $("#loggedInImage").hide();
        }, 1700);
      });
      // show account balance
      document.getElementById("account").innerHTML = parseFloat(
        credentials[6]
      ).toFixed(2);
    } else {
      $("#error").html("Incorrect Password!");
      $("#error").show();
    }
  } else {
    $("#error").html("Username does not exist!");
    $("#error").show();
  }
}

// On refresh, check user session and do maintenance (keep state)
$(document).ready(function() {
  // check if there is user session
  if (window.sessionStorage.getItem("currentUser") != null) {
    // console.log(window.sessionStorage.getItem("currentUser"));

    $(document).ready(function() {
      // get user details
      var credentials = userDetails(
        window.sessionStorage.getItem("currentUser")
      );
      // keep showing cart as session is active
      $("#cartSection").show();
      // update session storage
      window.sessionStorage.setItem("currentUser", credentials[1]);
      // vip button update
      $("#vip").html("Hi, " + credentials[2]);
      $("#vip").prop("disabled", true);
      $("#signout").show();
      //  set account credit
      document.getElementById("account").innerHTML = parseFloat(
        credentials[6]
      ).toFixed(2);
      drawCart();
    });
    $("#signin").hide();
  } else {
    // logged out
    $("#cartSection").hide();
    $("#vip").prop("disabled", false);
    $("#signout").hide();
    $("#signin").show();
  }

  // On click event on VIP button
  $("#vip").click(function() {
    // Hide modal text
    if (window.sessionStorage.getItem("language") == "en") {
      $("#modalHeading").text("Please Login");
    } else {
      $("#modalHeading").text("Bitte einloggen");
    }
    $("#signin").show();
    $("#error").hide();
    $("#loggedInImage").hide();
    $("#logged").hide();
    // if login is not visible then show
    if ($("#login").is(":visible") === false) {
      $("#login").show("slow");
    } else {
      $("#login").hide("slow");
    }
  });
  // On click event on for menu Tab list
  $(".nav-list li").click(function() {
    // when clicked on tab, add active to that tab and remove active from all siblings
    $(this)
      .addClass("active")
      .siblings()
      .removeClass("active");
  });
});

// Check Recharge Input Box and stop value from going below 0 and above 100000
function rechargeInput() {
  var rechargeBox = document.getElementById("recharge");
  // console.log(recharge.value)
  if (rechargeBox.value < 0) {
    rechargeBox.value = 0;
  }
  if (rechargeBox.value > 100000) {
    rechargeBox.value = 100000;
  }
}

function signout() {
  window.sessionStorage.clear();
  location.reload(true);
}
