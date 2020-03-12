// Sample API functions for the Flying Dutchman database.

// We use (global) variables to store the data. This is not generally advisable, but has the advantage that the data is easy to access through simple APIs. Also, when storing as local storage, all data is stored as strings, which might be adding some complexity.
function allUserNames() {
  var nameCollect = [];
  for (i = 0; i < DB.users.length; i++) {
    nameCollect.push(DB.users[i].username);
  }
  return nameCollect;
}

// =====================================================================
// This is an example of a file that will return an array with some specific details about a selected user name (not the first name/alst name). It will also add details from another "database" which contains the current account status for the person.
function userDetails(userName) {
  var userCollect = [];
  var userID;
  var userIndex;
  var account;

  // First we find the user ID of the selected user. We also save the index number for the record in the JSON structure.
  for (i = 0; i < DB.users.length; i++) {
    if (DB.users[i].username == userName) {
      userID = DB.users[i].user_id;
      userIndex = i;
    }
  }
  if (userID == null) return "empty";
  // We get the current account status from another table in the database, account. We store this in a variable here for convenience.
  for (i = 0; i < DB.account.length; i++) {
    if (DB.account[i].user_id == userID) {
      account = DB.account[i].creditSEK;
    }
  }

  // This is the way to add the details you want from the DATABASE into your own data structure. If you want to change the details, then just add or remove items accordingly below.
  userCollect.push(
    DB.users[userIndex].user_id,
    DB.users[userIndex].username,
    DB.users[userIndex].first_name,
    DB.users[userIndex].last_name,
    DB.users[userIndex].email,
    DB.users[userIndex].password,

    account
  );

  return userCollect;
}

// =====================================================================
// This function will change the credit amount in the user's account. Note that the amount given as argument is the new balance and not the changed amount (± balance).
function changeBalance(userName, newAmount) {
  // We use this variable to store the userID, since that is the link between the two data bases.
  var userID;

  // First we find the userID in the user data base.
  for (i = 0; i < DB.users.length; i++) {
    if (DB.users[i].username == userName) {
      userID = DB.users[i].user_id;
    }
  }

  // Then we match the userID with the account list and change the account balance.
  for (i = 0; i < DB.account.length; i++) {
    if (DB.account[i].user_id == userID) {
      // This changes the value in the JSON object.
      DB.account[i].creditSEK = newAmount;
    }
  }
}

// returns a copy of the current inventory
function getInventory() {
  // JSON stringify and JSON parse is required to produce a deep copy of the object => Otherwise we will modify the same object
  return JSON.parse(JSON.stringify(DB.inventory));
}

// returns the beverage and its quantity retrieved by the beverage nr
function getInventoryItemByNr(beverageNr) {
  // extract the beverage from the database for which the beverage nr matches
  let [beverage] = DB.inventory.filter(
    inventoryItem => inventoryItem.nr === beverageNr
  );
  return beverage;
}

// Upates the inventory of the bar given the passed state of the inventory
function updateInventory(inventoryState) {
  DB.inventory = inventoryState;
  fillMenus();
}

// Computes the update of the inventory given the passed order
// Returns the new and the old state of the inventory
// Doesn't actually update the inventory
function modifyInventory(order) {
  // clone the inventory object before modifying it
  let newInventory = getInventory();

  // adjust the quantities of the inventory according to the passed beverages
  order.beverages.forEach(beverage => {
    newInventory.forEach(inventoryItem => {
      // if the beverage from the order matches with its counterpart from the database => reduce its quanity by 1
      if (inventoryItem.nr === beverage.nr) {
        inventoryItem.quantity -= 1;
      }
    });
  });

  return [DB.inventory, newInventory];
}

// =====================================================================
// Returns a list of all the names of the beverages in the database.
function allBeverages() {
  // Using a local variable to collect the items.
  let collector = [];

  // beverages types
  const beverageTypes = ["beers", "wines", "spirits"];

  // The DB is stored in the variable BEVERAGES
  for (j = 0; j < beverageTypes.length; j++) {
    // beverages of type: beverageTypes[j]
    let beverages = BEVERAGES[beverageTypes[j]];

    for (i = 0; i < beverages.length; i++) {
      // add the whole object to the list
      collector.push([beverages[i]]);
    }
  }

  return collector;
}

// =====================================================================
// Returns a list of all the names of the beverages in the database.
function allBeveragesJSON() {
  // Using a local variable to collect the items.
  let collector = [];

  // beverages types
  const beverageTypes = ["beers", "wines", "spirits"];

  // The DB is stored in the variable BEVERAGES
  for (j = 0; j < beverageTypes.length; j++) {
    // beverages of type: beverageTypes[j]
    let beverages = BEVERAGES[beverageTypes[j]];

    for (i = 0; i < beverages.length; i++) {
      collector.push(beverages[i]);
    }
  }

  return collector;
}

function beveragesJSON(type) {
  // Using a local variable to collect the items.
  let collector = [];

  // The DB is stored in the variable BEVERAGES
  // extract the coarse beverage type: type
  let beverages = BEVERAGES[type];

  // select all beverages of type: type
  for (i = 0; i < beverages.length; i++) {
    collector.push(beverages[i]);
  }

  return collector;
}

function getBeverageByNr(beverageNr) {
  // local variable to collect the beverage
  let beverage;

  // beverages types
  const beverageTypes = ["beers", "wines", "spirits"];

  // The DB is stored in the variable BEVERAGES
  for (j = 0; j < beverageTypes.length; j++) {
    // beverages of type: beverageTypes[j]
    let beverages = BEVERAGES[beverageTypes[j]];

    for (i = 0; i < beverages.length; i++) {
      // return the beverage for which the beverage.nr matches the parameter beverageNr
      if (beverages[i].nr === beverageNr) {
        beverage = beverages[i];
      }
    }
  }

  return beverage;
}

// =====================================================================
// This function returns the names of all strong beverages (i.e. all that contain a percentage of alcohol higher than the strength given in percent.
function allStrongBeverages(strength) {
  // Using a local variable to collect the items.
  let collector = [];

  // beverages types
  const beverageTypes = ["beers", "wines", "spirits"];

  // The DB is stored in the variable BEVERAGES
  for (j = 0; j < beverageTypes.length; j++) {
    // beverages of type: beverageTypes[j]
    let beverages = BEVERAGES[beverageTypes[j]];

    for (i = 0; i < beverages.length; i++) {
      if (percentToNumber(beverages[i].alcoholstrength) > strength) {
        collector.push([
          beverages[i].name,
          beverages[i].category,
          beverages[i].priceinclvat,
          beverages[i].packaging,
          beverages[i].countryoforiginlandname,
          beverages[i].alcoholstrength
        ]);
      }
    }
  }

  return collector;
}

// =====================================================================
// Lists all beverage types in the database. As you will see, there are quite a few, and you might want select only a few of them for your data.
function beverageTypes() {
  // variable to store the fine beverages types
  let types = [];

  // coarse beverages types
  const beverageTypes = ["beers", "wines", "spirits"];

  // The DB is stored in the variable BEVERAGES, with "spirits" as key element.
  for (j = 0; j < beverageTypes.length; j++) {
    // beverages of type: beverageTypes[j]
    let beverages = BEVERAGES[beverageTypes[j]];

    for (i = 0; i < beverages.length; i++) {
      let text = beverages[i].category;
      addToSet(types, text);
    }
  }
  return types;
}

// =====================================================================
// Adds an item to a set, only if the item is not already there. The set is modelled using an array.
function addToSet(set, item) {
  if (!set.includes(item)) {
    set.push(item);
  }
  return set;
}

// User information
function allUsers() {
  // Using a local variable to collect the items.
  var collector = [];
  var i;
  // DATABASE is the name of the database in the file database.js
  for (i = 0; i < DB.users.length; i++) {
    collector.push([
      DB.users[i].user_id,
      DB.users[i].credentials,
      DB.users[i].password,
      DB.users[i].username,
      DB.users[i].first_name,
      DB.users[i].last_name,
      DB.users[i].email,
      DB.users[i].phone
    ]);
  }
  //
  return collector;
}

//Sold beverages

function allSold() {
  // Using a local variable to collect the items.
  var collector = [];
  var i;
  // The DB is stored in the variable DB2, with "spirits" as key element.
  for (i = 0; i < DB.sold.length; i++) {
    collector.push([
      DB.sold[i].transaction_id,
      DB.sold[i].user_id,
      DB.sold[i].beer_id,
      DB.sold[i].timestamp
    ]);
  }
  //
  return collector;
}

//Required Beverages
// =====================================================================
// Returns a list of all the names of the beverages in the DB.
function BeveragesList() {
  // Using a local variable to collect the items.
  let collector = [];

  // beverages types
  const beverageTypes = ["beers", "wines", "spirits"];

  // The DB is stored in the variable BEVERAGES
  for (j = 0; j < beverageTypes.length; j++) {
    // beverages of type: beverageTypes[j]
    let beverages = BEVERAGES[beverageTypes[j]];

    for (i = 0; i < beverages.length; i++) {
      collector.push([
        beverages[i].name,
        beverages[i].category,
        beverages[i].priceinclvat,
        beverages[i].packaging,
        beverages[i].countryoforiginlandname,
        beverages[i].alcoholstrength,
        beverages[i].articleid,
        beverages[i].nr
      ]);
    }
  }
  return collector;
}

//Beverages quantity
// quantity of beverages
function BeverageCount() {
  // Using a local variable to collect the items.
  var collector = [];
  var i;
  // DATABASE is the name of the database in the file database.js
  for (i = 0; i < DB.inventory.length; i++) {
    collector.push([DB.inventory[i].nr, DB.inventory[i].quantity]);
  }
  //
  return collector;
}

// =====================================================================
// Convenience function to change "xx%" into the percentage in whole numbers (non-strings).
function percentToNumber(percentStr) {
  return Number(percentStr.slice(0, -1));
}
