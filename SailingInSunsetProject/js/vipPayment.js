// ==========================================================================================================
// Customer View : payment module
//
// The file implements payment functionality on the customer.html page
//
// ==========================================================================================================

function vipPayment(user) {
  if (window.sessionStorage.getItem("language") == "en") {
    $("#modalHeading").text("Transaction Message");
  } else {
    $("#modalHeading").text("Transaktionsnachricht");
  }
  $("#recharge").hide();
  $("#rechargeButton").hide();
  $("#yes").hide();
  $("#no").hide();
  // total bill
  var total = document.getElementById("total").innerText;
  // user credit
  var credit = document.getElementById("account").innerText;
  // new credit
  var newCredit = (credit - total).toFixed(2);

  // check if empty cart, display error
  if (total == 0) {
    if (window.sessionStorage.getItem("language") == "en") {
      document.getElementById("cart-message").innerHTML =
        "Cart is empty. Please drag items into cart.";
    } else {
      document.getElementById("cart-message").innerHTML =
        "Einkaufswagen ist leer. Bitte ziehen Sie Artikel in den Warenkorb.";
    }

    document.getElementById("cart-message").style =
      "color:rgba(30, 28, 28, 0.61);";
    return;
  }
  // if transaction possible then update balance and do maintenance
  if (newCredit > 0) {
    $("#yes").show();
    $("#no").show();
    if (window.sessionStorage.getItem("language") == "en") {
      document.getElementById("cart-message").innerHTML =
        "Are you sure you want to proceed?";
    } else {
      document.getElementById("cart-message").innerHTML =
        "Sind Sie sicher, dass Sie fortfahren möchten?";
    }
    document.getElementById("cart-message").style =
      "color:rgba(30, 28, 28, 0.61);";
    window.sessionStorage.setItem("newCredit", newCredit);
  } else {
    // error if balance not enough
    $("#recharge").show();
    $("#rechargeButton").show();
    if (window.sessionStorage.getItem("language") == "en") {
      document.getElementById("cart-message").innerHTML =
        "Please recharge Your Account";
    } else {
      document.getElementById("cart-message").innerHTML =
        "Vänligen ladda ditt konto";
    }

    document.getElementById("cart-message").style =
      "color:rgba(30, 28, 28, 0.61);";
  }
}

function closeModal() {
  var modal = document.querySelector(".modal");
  modal.classList.toggle("show-modal");
}
function doTransaction() {
  var newCredit = window.sessionStorage.getItem("newCredit");
  // user details
  var credentials = userDetails(window.sessionStorage.getItem("currentUser"));
  var user = credentials[1];
  changeBalance(user, newCredit);
  // document.getElementById("cart-message").innerHTML="Transaction Successful. Current Balance is : " + newCredit +
  // ". You can collect your drink from the VIP section, "+credentials[2]+". Cheers.";
  // document.getElementById("cart-message").style="color:green;";
  document.getElementById("cart-message").innerHTML =
    '<img id="' +
    "checkoutTick" +
    '" src="' +
    "../images/tick.gif" +
    '" ></img>';
  window.sessionStorage.removeItem("currentUser");
  updateText("vip");
  $("#vip").prop("disabled", false);
  DB.cart = [];
  drawCart();
  $("#account").html("00.00");
  $("#total").html("00.00");
  actionStack.invalidateAll();
  checkUndoRedo();
  setTimeout(function() {
    $("#modal").removeClass("show-modal");
    $("#yes").hide("slow");
    $("#no").hide("slow");
    location.reload();
  }, 1700);
  // closeModal();
  $("#cartSection").hide("slow");
  $("#signout").hide();
}

// Function to Top Up account
function rechargeAccount() {
  var topupAmount = document.getElementById("recharge").value;
  if (topupAmount != "") {
    var credentials = userDetails(window.sessionStorage.getItem("currentUser"));
    var user = credentials[1];
    var oldBalance = parseFloat(credentials[6]);
    var newBalance = (oldBalance + parseFloat(topupAmount)).toFixed(2);
    changeBalance(user, newBalance);
    $("#account").html(newBalance);
    document.getElementById("cart-message").innerHTML =
      '<img id="' +
      "checkoutTick" +
      '" src="' +
      "../images/tick.gif" +
      '" ></img>';
    setTimeout(function() {
      $("#modal").removeClass("show-modal");
    }, 1700);
  }
}
