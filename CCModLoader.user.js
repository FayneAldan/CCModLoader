// ==UserScript==
// @name CC Mod Loader
// @namespace CCModLoader
// @version 1
// @include http://orteil.dashnet.org/cookieclicker/
// @include https://orteil.dashnet.org/cookieclicker/
// @include http://orteil.dashnet.org/cookieclicker/beta/
// @include https://orteil.dashnet.org/cookieclicker/beta/
// @include http://cookieclicker.eu/cookieclicker/
// @include https://cookieclicker.eu/cookieclicker/
// @updateURL https://faynealdan.github.io/CCModLoader/CCModLoader.user.js
// @grant none
// ==/UserScript==

window.eval(
  `(${function () {
    var checkReady = setInterval(function () {
      if (Game.ready) {
        Game.LoadMod("https://faynealdan.github.io/CCModLoader/CCModLoader.js");
        clearInterval(checkReady);
      }
    }, 1000);
  }.toString()})()`
);
