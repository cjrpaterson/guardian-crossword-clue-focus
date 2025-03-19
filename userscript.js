// ==UserScript==
// @name         Guardian Crossword Focus
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Show only the current clue (for the activated cells in the grid) in Guardian crosswords
// @author       Akash
// @match        https://www.theguardian.com/crosswords/quick/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const clueRegex = /^\d+-(across|down)-crosswords\/quick\/\d+$/;

    let interval = setInterval(function () {
        if (isReady()) {
           clearInterval(interval);
           init()
           return
        }
    }, 100)

    function isReady() {
        const el = [...document.querySelectorAll("div")].find(div =>
            clueRegex.test(div.id)
        );
        return el != null && el.textContent != null && el.textContent.length != null && el.textContent.length > 0
    }

    function init() {
        document.addEventListener('keyup', () => {
            hideAllCluesExceptSelected()
        })

        document.addEventListener('click', () => {
            hideAllCluesExceptSelected()
        })

        const firstClue = [...document.querySelectorAll("div")].find(div =>
            clueRegex.test(div.id)
        );
        firstClue.click()
    }


    function hideAllCluesExceptSelected() {
        document.querySelectorAll('div[data-link-name="Crosswords"] div').forEach(el => {
            if (clueRegex.test(el.id)) {
                const isSelected = el.getAttribute("aria-selected") === "true";

                if (isSelected) {
                    // Show the spans for the selected clue
                    el.querySelectorAll("span").forEach(span => {
                        span.style.display = "";
                    });
                } else {
                    // Hide the second <span> for non-selected clues
                    const secondSpan = el.querySelectorAll("span")[1];
                    if (secondSpan) {
                        secondSpan.style.display = "none";
                    }
                }
            }
        });
    }
})();
