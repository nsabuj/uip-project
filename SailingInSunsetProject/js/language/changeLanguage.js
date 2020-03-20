let language = "en";

function initInternationalization() {
    // initially set the language
    $(window).on("load", function() {
        var currentLanguage = window.sessionStorage.getItem("language");
        if (currentLanguage != null) {
            this.language = currentLanguage;
        } else {
            this.language = "en";
            window.sessionStorage.setItem("language", "en");
        }

        // update all texts

        updateContent(location.pathname.split("/").slice(-1));
    });
}

function changeLanguageTo(select) {
    // store the new language
    this.language = select.getAttribute("value");
    window.sessionStorage.setItem("language", select.getAttribute("value"));

    // update all texts
    updateContent(location.pathname.split("/").slice(-1));
}

function updateText(id) {
    // retrieve element to be changed by ID
    el = document.getElementById(id);

    // change the placeholder and innerHTML text
    el.innerHTML = DB_LANGUAGES[this.language][id];
    el.placeholder = DB_LANGUAGES[this.language][id];
}

function updateUndoRedoText(id) {
    // retrieve element to be changed by ID
    el = document.getElementById(id);
    var icon = "";
    if (id == "undoButton") {
        icon = ' <i class="' + "fa fa-undo" + '"></i>';
    }
    if (id == "redoButton") {
        icon = ' <i class="' + "fa fa-repeat" + '"></i>';
    }
    // change the placeholder and innerHTML text
    el.innerHTML = DB_LANGUAGES[this.language][id] + icon;
    el.placeholder = DB_LANGUAGES[this.language][id];
}

// updates a full section of texts (e.g., the menu texts). Sections are contained in a separate object in the languages file
function updateSection(section, keys) {
    keys.forEach(key => {
        // retrieve element to be changed by ID
        el = document.getElementById(key);

        // change the placeholder and innerHTML text
        el.innerHTML = DB_LANGUAGES[this.language][section][key];
        el.placeholder = DB_LANGUAGES[this.language][section][key];
    });
}

function updateOrderTexts(section, className) {
    const newText = DB_LANGUAGES[this.language][section][className];

    // retrieve all HTML elements with className as class
    // convert to Array to be able to iterate over it
    const elements = Array.from(document.getElementsByClassName(className));

    // change the value for all elements to newText
    elements.forEach(element => {
        // change the placeholder and innerHTML text
        element.innerHTML = newText;
        element.placeholder = newText;
    });
}

function updateContent(page) {
    // select all elements from the DOM with class = "flag" (i.e. all round language buttons)
    const arr = Array.from(document.getElementsByClassName("flag"));

    for (i = 0; i < arr.length; i++) {
        // set the opacity of the selected language to 1.0
        // decrease the opacity of all other language buttons
        if (arr[i].getAttribute("value") == this.language) {
            arr[i].style.opacity = 1;
        } else {
            arr[i].style.opacity = 0.5;
        }
    }
    if (page == "bar.html") {
        //
        // Bartender View
        //
        // call the updateText function for each item
        updateText("title");
        updateText("welcomeMessage");
        updateText("undoButton");
        updateText("redoButton");
        updateText("resetButton");
        updateText("HistoryBtn");
        updateText("InventoryBtn");

        // change the menu tab texts
        updateSection("menuTabs", ["allDrink", "beer", "wine", "spirit"]);

        // change the cashier texts
        updateSection("cashier", ["cashierText", "checkoutText"]);

        // change the table texts
        updateSection("table", ["t1Name", "t2Name", "t3Name"]);

        // change order texts
        updateOrderTexts("order", "orderText");
    } else {
        //
        // Customer View
        //
        updateText("username");
        updateText("password");
        updateText("signin");

        if (window.sessionStorage.getItem("currentUser") == null) {
            updateText("vip");
        }

        updateText("allTab");
        updateText("wineTab");
        updateText("beerTab");
        updateText("spiritTab");
        updateText("checkout");
        updateText("orderHeading");
        updateText("credit");
        updateText("yes");
        updateText("no");
        updateText("recharge");
        updateText("rechargeButton");
        updateText("signout");
        var classNameArray = document.getElementsByClassName("availability");
        for (let item of classNameArray) {
            item.innerHTML = DB_LANGUAGES[this.language]["availability"];
        }
        updateUndoRedoText("undoButton");
        updateUndoRedoText("redoButton");
    }



}