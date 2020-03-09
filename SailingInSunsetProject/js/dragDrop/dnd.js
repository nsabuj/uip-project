// ================================================================================================
// This File contains the drag and drog library for this project
// ================================================================================================

// Default function which disables the "allowDrop" property which is set by default
function allowDrop(event) {
  // This makes the item accept drop actions.
  event.preventDefault();
}
// A standard function. It packages the ID of the source into the data transfer package. The type of the transferred data is pure text.
function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

// ================================================================================================
// Drag and Drop for Bartender View
// ================================================================================================
// Send the ID (beverage nr.) of the source as a part of the data transfer object
function dragItem(event) {
  // the beverage number is the ID of the element
  event.dataTransfer.setData("nr", event.target.id);
}

function dragTable(event) {
  // set the ID of the table as the transfer information
  event.dataTransfer.setData("tabledId", event.target.id);
}

function dropItemOnTable(event, element) {
  // The default action is to not accept drops => disables it
  event.preventDefault();

  // copy the element instead of just moving it
  event.dataTransfer.dropEffect = "copy";

  // attempt to retrieve the data passed in the dragged object
  let beverageNr = event.dataTransfer.getData("nr");

  // check if the beverageNr exists otherwise an illegal object has been dropped on the table (e.g., another table instead of on the checkout)
  if (beverageNr) {
    // get the table and order ID of the current table
    const orderId = "o" + element.id.split("")[1];

    // update the current order with the new beverage
    addToOrder(orderId, beverageNr);
  }
}

function dropTableOnCheckout(event) {
  // The default action is to not accept drops => disables it
  event.preventDefault();

  // copy the element instead of just moving it
  event.dataTransfer.dropEffect = "copy";

  // try to access the supposingly passed data
  const tabledId = event.dataTransfer.getData("tabledId");

  // check if the tableId exists otherwise an illegal object has been dropped on the checkout (e.g., an item has been dropped on the checkout instead of the table)
  if (tabledId) {
    // create the orderId from the tableId passed using the dropped object
    const orderId = `o${tabledId[1]}`;

    // call the payOrder function from the orders.js script to pay for the table's order
    payOrder(orderId);
  }
}

// ================================================================================================
// Drag and Drop for Customer View
// ================================================================================================

function handleDragEnter(ev) {
  // ev.target is the current hover target.
  ev.target.classList.add("over");
}

function handleDragLeave(ev) {
  ev.target.classList.remove("over"); // this / e.target is previous target element.
}

function dropMenu(ev) {
  // The default action is to not accept drops => disables it
  ev.preventDefault();
  ev.target.classList.remove("over");

  ev.dataTransfer.dropEffect = "copy";

  const data = ev.dataTransfer.getData("text");

  const nodeCopy = document.getElementById(data).cloneNode(true);
  var actualNode = document.getElementById("cartId-"+data);
  
  var currentAmount =$(actualNode).find(".qty").html();
  console.log(actualNode,getInventoryItemByNr(data),currentAmount)
  if(getInventoryItemByNr(data).quantity<=0){
    console.log("Here")
    return;
  } else {
    dropCartOrder(DB.cart.slice(),nodeCopy.id);
  }
  console.log("Here2")
  

}

// Function to iterate over the cart saved in the database and update the view;
function drawCart() {
  let collection = "";
  let sum = 0;
  DB.cart.forEach(id => {
    var beverage = getBeverageByNr(id.nr);

    sum += parseFloat(beverage.priceinclvat) * parseFloat(id.qty);
    collection +=
      // set the beverage nr as the id of the div
      '<div id="cartId-' +
      id.nr +
      '" draggable="false" ondragstart="return false;" style="display: flex;">'+
      '<div style="flex:2;margin-right: 10px;"><i class="fa fa-remove" onclick="removeFromCart(this)"></i>' +
      // set both names of the beverage and the price
      `${beverage.name} (${beverage.name2}) -` +
      ' <span class="price">' +
      beverage.priceinclvat +
      "</span></div>" +
      '<div style="float:right;"><span class="subtract" onClick="subtractCartItem(this)"><a '+
      'class="'+'cartChangeButton minus'+'">-</a></span><span class="qty">' +
      id.qty +
      '</span><span class="add" onClick="addCartItem(this)"><a class="'+'cartChangeButton'+'">+</a></span></div>' +
      "</div><hr>";
  });
  // Add collection to cart
  $("#cart").html(collection);
  // get element that was dropped last so that it can be highlighted on cart
  var el = document.getElementById(
    "cartId-" + window.sessionStorage.getItem("latestItem")
  );
  if (el != null) {
    // save origional color
    var originalColor = el.style.background;
    // change background to new color
    el.style.background = 'mediumaquamarine';
    // timeout for 1 second and revert back to old color
    setTimeout(function() {
      el.style.background = originalColor;
    }, 1000);
    // remove latest Item from session storage
    window.sessionStorage.removeItem("latestItem");
  }
  // Adding sum calculated using array stored in database(localstorage)
  $("#total").text(sum.toFixed(2));
}

// ================================================================================================
// End Of File
// ================================================================================================
