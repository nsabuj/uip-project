// ==========================================================================================================
// Customer Menu Functionality
// Used Library given by Lars
// The file gives functionality to the Main Menu on the customer.html page
//
// ==========================================================================================================

$(function() {
  $("#allmenu").show();
  $("#wines").hide();
  $("#spirits").hide();
  $("#beers").hide();
  // Define click for all
  $("#allTab").click(function() {
    $("#allmenu").show("slow");
    $("#wines").hide("slow");
    $("#spirits").hide("slow");
    $("#beers").hide("slow");
  });
  // Define click for wines
  $("#wineTab").click(function() {
    $("#allmenu").hide("slow");
    $("#wines").show("slow");
    $("#spirits").hide("slow");
    $("#beers").hide("slow");
  });
  // Define click for spirits
  $("#spiritTab").click(function() {
    $("#allmenu").hide("slow");
    $("#wines").hide("slow");
    $("#spirits").show("slow");
    $("#beers").hide("slow");
  });
  // Define click for beers
  $("#beerTab").click(function() {
    $("#allmenu").hide("slow");
    $("#wines").hide("slow");
    $("#spirits").hide("slow");
    $("#beers").show("slow");
  });
});

function initCustomerMenu() {
  $(window).on("load", function() {
    // add content to all menus
    fillCustomerMenus();
    // Change color of Availability text if quantity 0 and make it non draggable
    $(".availabilityText").each(function() {
      // console.log(this);
      if ($(this).html() <= 0) {
        $(this).css("color", "#f72846");
        $(this)
          .siblings(".availability")
          .css("color", "#f72846");
        $(this)
          .parent()
          .attr("draggable", false);
      }
    });
  });
}

// fills the menus with the beverages
function fillCustomerMenus() {
  // empty all menu elements
  $("#allmenu").empty();
  $("#beers").empty();
  $("#wines").empty();
  $("#spirits").empty();
  // Initialize menu cards with specific menu items
  $(getAllDrinks(allBeveragesJSON())).appendTo("#allmenu");
  $(getDrinks(beveragesJSON("beers"))).appendTo("#beers");
  $(getDrinks(beveragesJSON("wines"))).appendTo("#wines");
  $(getDrinks(beveragesJSON("spirits"))).appendTo("#spirits");
}

function getAllDrinks(allDrinks) {
  // variable to keep track of the final result
  let collection = "";

  // array containing the type of drinks that exist in the bar
  const drinkTypes = beverageTypes();

  for (let i = 0; i < drinkTypes.length; i++) {
    // For each type, the proper name and a horisontal ruler is added to the output.
    collection +=
      "<strong>" +
      drinkTypes[i].toUpperCase() +
      `</strong><br><hr style="border-color: #ffffff3b">`;

    // and then the resulting list for the type.
    collection += getDrink(drinkTypes[i], allDrinks) + "<br>";
  }
  return collection;
}

function getDrinks(drinks) {
  // variable to keep track of the final result
  let collection = "";

  // array containing the type of drinks that exist in the bar
  const drinkTypes = beverageTypes();
  let relevantTypes = [];

  drinks.forEach(drink => {
    drinkTypes.forEach(type => {
      if (drink.category === type) {
        addToSet(relevantTypes, type);
      }
    });
  });

  for (let i = 0; i < relevantTypes.length; i++) {
    // For each type, the proper name and a horisontal ruler is added to the output.
    collection +=
      "<strong>" + relevantTypes[i].toUpperCase() + `</strong><br><hr style="border-color: #ffffff3b">`;

    // and then the resulting list for the type.
    collection += getDrink(relevantTypes[i], drinks) + "<br>";
  }
  return collection;
}

function getDrink(type, arr) {
  // variable to keep track of the final result
  let collection = "";
  var currentLanguage = window.sessionStorage.getItem("language");
  var availabilitySpan = ``;
  // Because this span element is created after initial page load, the first langugae set event has to be done manually. Subsequent changes are
  // from our internationzilation library
  if (currentLanguage == null || currentLanguage == "en") {
    availabilitySpan = `<span class="availability">In Stock : </span>`;
  } else {
    availabilitySpan = `<span class="availability">Auf Lager : </span>`;
  }

  // collect all drinks of the desired type
  for (let i = 0; i < arr.length; i++) {
    // if the drink is of the desired type add it
    if (arr[i].category === type) {
      let beverage = getInventoryItemByNr(arr[i].nr);
      collection +=
        // set the beverage nr as the id of the div
        `<div class="menuItems" id="${
          arr[i].nr
        }" draggable="true" ondragstart="drag(event)">` +
        // set both names of the beverage and the price
        `${arr[i].name} (${arr[i].name2}) -` +
        ' <span class="price">' +
        arr[i].priceinclvat +
        "</span>" +
        `<span onclick="showDetails(this)" style="display: inline-block;float: right;"><i class="fa fa-plus"></i></span>` +
        `<span class="availabilityText">${beverage.quantity}</span>` +
        availabilitySpan +
        `<div id="details" class="details" style="display:none;"></div></div>`;
    }
  }

  return collection;
}

// =====================================================================
// Adds an item to a set, only if the item is not already there. The set is modelled using an array.
function addToSet(set, item) {
  if (!set.includes(item)) {
    set.push(item);
  }
  return set;
}
// Show beverage details on menu
function showDetails(item) {
  // getting beverage details from new loader
  var details = getBeverageByNr(
    $(item)
      .parent()
      .attr("id")
  );
  var itemDetails = $(item).siblings("#details");
  var detailContent =
    `<div><strong>Country of Origin:</strong> ${
      details.countryoforiginlandname
    }</div><div><strong>Alcohol Strength:</strong> ${
      details.alcoholstrength
    }</div>` +
    `<div><strong>Packaging:</strong> ${
      details.packaging
    }</div><div><strong>Producer:</strong> ${details.producer}</div>` +
    `<div><strong>Price:</strong> ${
      details.priceinclvat
    }</div><div><strong>Year Introduced:</strong> ${details.introduced}</div>`;
  $(itemDetails).html(detailContent);
  if (itemDetails.data("selected") != "yes") {
    itemDetails.show("slow");
    itemDetails.data("selected", "yes");
  } else {
    itemDetails.hide("slow");
    itemDetails.data("selected", "no");
  }
  console.log(details);
}
