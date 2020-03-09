let DB;

function initDatabase() {
  // upon window loaded
  $(window).on("load", function() {
    // initial setup of DATABASE database => load object from local storage
    DB = readLocalStorage("DATABASE");

    // if the object doesn't exists cloned it and assign it to DB
    if (!DB) {
      DB = JSON.parse(JSON.stringify(DATABASE));
    } else {
      // To only run drawCart function on the index page
      if (
        location.href.split("/").pop() == "index.html" ||
        location.href.split("/").pop() == ""
      ) {
        drawCart();
      }
    }
  });
}

$(window).on("beforeunload", function() {
  // save current state of the database by saving it to the local storage
  writeLocalStorage("DATABASE", DB);
});

function resetDatabase() {
  // reset the database to the initial state
  DB = JSON.parse(JSON.stringify(DATABASE));

  // trigger a screen reload
  location.reload();
}

// writes the database to the local storage
function writeLocalStorage(databaseName, database) {
  // writes the database object to the local storage
  window.localStorage.setItem(databaseName, JSON.stringify(database));
}

// reads the database from the local storage
function readLocalStorage(databaseName) {
  // retrieve the database by the name of the object
  return JSON.parse(window.localStorage.getItem(databaseName));
}
