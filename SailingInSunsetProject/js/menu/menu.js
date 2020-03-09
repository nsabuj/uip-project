$(function() {
  // hide all menus apart from the all drinks menu
  $("#allDrinks").show();
  $("#beers").hide();
  $("#wines").hide();
  $("#spirits").hide();

  // set all drinks to active
  $("#allDrink").addClass("active");
  $("#beer").removeClass("active");
  $("#wine").removeClass("active");
  $("#spirit").removeClass("active");

  $("#allDrink").click(function() {
    // show all drinks menu
    $("#allDrinks").show();
    $("#beers").hide();
    $("#wines").hide();
    $("#spirits").hide();

    // highlight all drinks tab
    $("#allDrink").addClass("active");
    $("#beer").removeClass("active");
    $("#wine").removeClass("active");
    $("#spirit").removeClass("active");
  });

  $("#beer").click(function() {
    // show beer menu
    $("#allDrinks").hide();
    $("#beers").show();
    $("#wines").hide();
    $("#spirits").hide();

    // highlight beer tab
    $("#allDrink").removeClass("active");
    $("#beer").addClass("active");
    $("#wine").removeClass("active");
    $("#spirit").removeClass("active");
  });

  $("#wine").click(function() {
    // show wine menu
    $("#allDrinks").hide();
    $("#beers").hide();
    $("#wines").show();
    $("#spirits").hide();

    // highlight wine tab
    $("#allDrink").removeClass("active");
    $("#beer").removeClass("active");
    $("#wine").addClass("active");
    $("#spirit").removeClass("active");
  });

  $("#spirit").click(function() {
    // show spirits menu
    $("#allDrinks").hide();
    $("#beers").hide();
    $("#wines").hide();
    $("#spirits").show();

    // highlight spirits tab
    $("#allDrink").removeClass("active");
    $("#beer").removeClass("active");
    $("#wine").removeClass("active");
    $("#spirit").addClass("active");
  });
});

function initMenu() {
  $(window).on("load", function() {
    fillMenus();
  });
}

// fills the menus with the beverages
function fillMenus() {
  // empty all menu elements
  $("#allDrinks").empty();
  $("#beers").empty();
  $("#wines").empty();
  $("#spirits").empty();

  // fill / draw the menu content
  $(getAllDrinks(allBeveragesJSON())).appendTo("#allDrinks");
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
      "<strong>" + drinkTypes[i].toUpperCase() + "</strong><br><hr>";

    // and then the resulting list for the type.
    //
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
      "<strong>" + relevantTypes[i].toUpperCase() + "</strong><br><hr>";

    // and then the resulting list for the type.
    collection += getDrink(relevantTypes[i], drinks) + "<br>";
  }
  return collection;
}

function getDrink(type, arr) {
  // variable to keep track of the final result
  let collection = "";
  // collect all drinks of the desired type
  for (let i = 0; i < arr.length; i++) {
    // if the drink is of the desired type add it
    if (arr[i].category === type) {
      // retrieve the beverage from the inventory
      let beverage = getInventoryItemByNr(arr[i].nr);

      // menu item text
      let menuItemText = "";

      // set the beverage nr as the id of the div
      menuItemText += `<div id="${arr[i].nr}"`;

      if (beverage.quantity === 0) {
        menuItemText += ` title="SOLD OUT!" style="color:red"`;
        menuItemText +=
          // disable the draggability
          ` draggable="false">` +
          // set both names of the beverage and the price
          `${arr[i].name} (${arr[i].name2}) - ${arr[i].priceinclvat}</div>`;

        // add the text and finish this loop early
        collection += menuItemText;
        continue;
      } else if (beverage.quantity === 1) {
        // message red alarming warning for the last item
        menuItemText += ` title="Attention! Last item!" style="color:orange"`;
      } else if (beverage.quantity < 5) {
        // set a warning as a title if there are less than 5 items
        menuItemText += ` title="Attention! Only ${
          beverage.quantity
        } items left!"`;
      } else {
        // set the alcohol strength if there are sufficient items left
        menuItemText += ` title="Alcohol Strength: ${arr[i].alcoholstrength}"`;
      }

      menuItemText +=
        // set the draggability of the item
        ` draggable="true" ondragstart="dragItem(event)">` +
        // set both names of the beverage and the price
        `${arr[i].name} (${arr[i].name2}) - ${arr[i].priceinclvat}</div>`;

      collection += menuItemText;
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
