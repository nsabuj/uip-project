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

    if (page == "customer.html") {
        //
        // Customer View
        //
        // console.log("This is the customer page");
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
    else{
        // console.log("This is the index page");
        updateText("customerButton");
        updateText("barButton");

    }
}

/* bartender page */
$(function() {
    $('.switch-lang').click(function(e) {

        var lang = $(this).attr('id');
        localStorage.setItem("language", lang);
        translateContent(location.pathname.split("/").slice(-1));
    });
});




function initInternationalizationCustom() { /* Initialization of multilingual feature  */

    $(window).on("load", function() {
        var currentLanguage = localStorage.getItem("language");
        if (currentLanguage == null) {
            localStorage.setItem("language", "en"); /* if language is not selected. set english as default language */
        }



        translateContent(location.pathname.split("/").slice(-1)); /* translate words. Definition of this function is below */
    });
}


function translateContent(page) { /* take a parameter, pagename*/

    $('.change-lang').each(function(i, obj) { /* change-lang is a common class in all translateable content, it helps to select the content */

        updateTextBylang($(this).attr("id"), page); /* updateTextBylang is also part of the translation, used separetly for avoiding complexity */
    })

} /* end of the function */

function updateTextBylang(id, page) { /* recievces two parameter. id of element and page name */

    var currentLanguage = localStorage.getItem("language");

    el = document.getElementById(id);
    page = camelCase(page[0].substring(0, page[0].indexOf('.'))); /* tranforming the page name to camelcase*/

    if (currentLanguage !== null) { /* if language any launage selected */

        $('#' + id).html(DB_LANGUAGES[currentLanguage][page][id]); /* replace the text in each element with the text from language object */

    }

}

function camelCase(str) {
    var text = str.replace(/-([a-z])/g,
        function(g) { return g[1].toUpperCase(); }); /* convert string to camelcase  */
    return text;
}
