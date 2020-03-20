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