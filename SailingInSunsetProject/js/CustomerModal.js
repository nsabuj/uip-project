// ==========================================================================================================
// Customer Modal Functionality
// The file gives functionality to the Modal on the customer.html page
//
// ==========================================================================================================
window.onload = function() {
  var modal = document.querySelector(".modal");
  var trigger = document.querySelector(".trigger");
  var trigger2 = document.querySelector(".trigger2");
  var noButton = document.querySelector(".noToggle");
  var closeButton = document.querySelector(".close-button");

  function toggleModal() {
    modal.classList.toggle("show-modal");
  }

  function windowOnClick(event) {
    if (event.srcElement === trigger2) {
      $("#login-form").hide();
      $("#checkout-form").show();
    } else if (event.srcElement === trigger) {
      $("#checkout-form").hide();
      $("#login-form").show();
    }
    if (event.target === modal) {
      toggleModal();
    }
  }
  
  trigger.addEventListener("click", toggleModal);
  trigger2.addEventListener("click", toggleModal);
  noButton.addEventListener("click", toggleModal);
  closeButton.addEventListener("click", toggleModal);
  window.addEventListener("click", windowOnClick);
};
