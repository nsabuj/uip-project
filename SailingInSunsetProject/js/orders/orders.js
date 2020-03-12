// ==========================================================================================================
// This file contains the Order functionality for the Customer views/
// ==========================================================================================================

//  Called when an item is dropped onto cart. Called in dnd.js
function dropCartOrder(cartArray, id) {
  var oldArray = JSON.parse(JSON.stringify(cartArray));
  var found = false;
  // To detect newest item. Will be used to toggle color change on dropped item in cart
  window.sessionStorage.setItem("latestItem",id);
  // If item already exists, increase quantity
  for (var i = 0; i < cartArray.length; i++) {
    if (cartArray[i].nr == id) {
      found = true;
      cartArray[i].qty++;
      break;
    }
  }
  // else push new item into array with quantity 1
  if (found == false) {
    cartArray.push({ nr: id, qty: 1 });
  }
  (DB.inventory).forEach(item => {
    if(id == item.nr){
      item.quantity = item.quantity-1;
    }
  });
  addToCart(oldArray.slice(0),cartArray.slice(0));
  
}

// Called when plus sign on cart item clicked
function addCartItem(element) {
  // Find id of element from attribute id
  var id = $(element).parent().parent().closest("div").attr("id").split("-")[1];
    var currentAmount =$(element).siblings(".qty").html();
    // console.log(currentAmount)
    var oldArray = JSON.parse(JSON.stringify(DB.cart));
  // Increase quantity by one
  for (var i = 0; i < DB.cart.length; i++) {
    if (DB.cart[i].nr == id) {
      // Check if items in cart = items in inventory
      console.log(currentAmount)
      if((getInventoryItemByNr(id).quantity)<=0){
          return;
        }
        (DB.inventory).forEach(item => {
          if(id == item.nr){
            item.quantity = item.quantity-1;
          }
        });
        DB.cart[i].qty++;
      break;
    }
  }
  addToCart(oldArray.slice(0), DB.cart.slice(0));
}

// Called when plus minus on cart item clicked
function subtractCartItem(element) {
  var id = $(element).parent().parent()
    .closest("div")
    .attr("id")
    .split("-")[1];
    
  var oldArray =  JSON.parse(JSON.stringify(DB.cart));
  for (var i = 0; i < DB.cart.length; i++) {
    if (DB.cart[i].nr == id && DB.cart[i].qty > 1) {
      (DB.inventory).forEach(item => {
        if(id == item.nr){
          item.quantity = item.quantity+1;
        }
      });  
        DB.cart[i].qty--;
        break;
    }
  }
  addToCart(oldArray.slice(0), DB.cart.slice(0));
}

// Called when cross sign on cart item clicked
function removeFromCart(element) {
  
  var id = $(element).parent().parent()
    .closest("div")
    .attr("id")
    .split("-")[1];
  // Update inventory on item removal
  console.log($(element).parent().parent().find(".qty").html(),element)
  var currentAmount = parseInt($(element).parent().parent().find(".qty").html());
    (DB.inventory).forEach(item => {
      if(id == item.nr){
        // console.log("heree")
        item.quantity = item.quantity+currentAmount;
        // console.log(item.quantity)
      }
    })  
  var oldArray =  JSON.parse(JSON.stringify(DB.cart));
  for (var i = 0; i < DB.cart.length; i++) {
    if (DB.cart[i].nr == id) {
      DB.cart.splice(i, 1);
      break;
    }
  }
  addToCart(oldArray.slice(0), DB.cart.slice(0));
}

function addToCart(oldArray, newArray) {
  // extract the old order
  let oldOrder = JSON.parse(JSON.stringify(oldArray));
  let newOrder = JSON.parse(JSON.stringify(newArray));

  // push old and new order states pair to stack
  pushAction(
    function(redo, data) {
      if (redo) {
        DB.cart = JSON.parse(JSON.stringify(data[1]));
      } else {
        DB.cart = JSON.parse(JSON.stringify(data[0]));
      }
    },
    [oldOrder, newOrder]
  );

  // redraw the cart
  drawCart();

  // check undo and redo possibility
  checkUndoRedo();
}

function undoCartUpdate() {
  // undo the last action
  actionStack.undo();

  // redraw the cart
  drawCart();

  // check undo and redo possibility
  checkUndoRedo();
}

function redoCartUpdate() {
  // redo the last action
  actionStack.redo();

  // redraw the cart
  drawCart();

  // check undo and redo possibility
  checkUndoRedo();
}

