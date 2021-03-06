/**
 * @prettier
 *
 * Please use one of two files in the root of this repository.
 * At some point I may bundle all the files together.
 */

if (CCModLoader === undefined) var CCModLoader = {};
CCModLoader.dev = true;
CCModLoader.baseURL = "https://faynealdan.github.io/CCModLoader/";
CCModLoader.fileURL =
  CCModLoader.baseURL + (CCModLoader.dev ? "dev" : "stable") + "/";
CCModLoader.modURL =
  CCModLoader.baseURL + (CCModLoader.dev ? "dev" : "") + "CCModLoader.js";
CCModLoader.optionsURL = CCModLoader.fileURL + "config.html";

CCModLoader.launch = function () {
  CCModLoader.init = function () {
    CCModLoader.isLoaded = true;
    CCModLoader.modCount = 0;
    CCModLoader.config = {};
    CCModLoader.loadedMods = [CCModLoader.modURL];

    eval(
      "Game.WriteSave = " +
        Game.WriteSave.toString().replace(
          "Game.bakeryName",
          "CCModLoader.GetBakeryNameForSaving()"
        )
    );

    CCModLoader.addButton();
    CCModLoader.doCheck();

    CCModLoader.loadConfig();
    Game.customLoad.push(CCModLoader.loadConfig);
    Game.customSave.push(CCModLoader.saveConfig);

    CCModLoader.loadMods();
    CCModLoader.doCheck();
    CCModLoader.countNotif();
  };

  CCModLoader.addButton = function () {
    // can't use #topbar or we don't get insertBefore
    var topBar = l("links").parentElement;
    var before = l("topbarTwitter").parentElement;
    var div = document.createElement("div");
    div.innerHTML = '<a id="topbarCCModLoader">mods</a>';
    topBar.insertBefore(div, before);
    Game.attachTooltip(
      l("topbarCCModLoader"),
      '<div style="padding:8px;width:250px;text-align:center;">Configure CC Mod Loader</div>',
      "this"
    );
    Game.customChecks.push(CCModLoader.doCheck);
  };

  CCModLoader.doCheck = function () {
    CCModLoader.fixName();
    let count = CCModLoader.modCount;
    let btn = l("topbarCCModLoader");
    btn.innerHTML = `<b style="font-weight:bold">${count}</b> mod${
      count == 1 ? "" : "s"
    }`;
  };

  CCModLoader.fixName = function () {
    if (Game.bakeryName.toUpperCase().substr(0, 4) == "<IMG") {
      let temp = Game.bakeryName;
      let s = temp.indexOf('"') + 1;
      let e = temp.indexOf('"', s);

      Game.bakeryName = temp.substr(s, e - s);
      Game.bakeryNameRefresh();
    }
  };

  CCModLoader.GetBakeryNameForSaving = function () {
    let name = Game.bakeryName;
    let url = CCModLoader.modURL;
    if (CCModLoader.config.cacheBypass) url += "?" + Math.random();
    return CCModLoader.config.saveHack
      ? `<IMG alt="${name}" src="" onerror="Game.LoadMod('${url}')" />`
      : Game.bakeryName;
  };

  CCModLoader.loadMods = function () {
    if (!CCModLoader.config.autoLoad) return;
    for (var mod of CCModLoader.config.mods)
      if (mod.enabled) CCModLoader.loadMod(mod.url);
  };

  CCModLoader.loadMod = function (url) {
    if (CCModLoader.loadedMods.indexOf(url) >= 0) return;
    Game.LoadMod(url);
    CCModLoader.modCount++;
    CCModLoader.loadedMods.push(url);
  };

  CCModLoader.saveConfig = function () {
    Game.localStorageSet("CCModLoader", JSON.stringify(CCModLoader.config));
  };

  CCModLoader.loadConfig = function () {
    CCModLoader.config = CCModLoader.defaultConfig();
    if (Game.localStorageGet("CCModLoader")) {
      var config = {};
      try {
        config = JSON.parse(Game.localStorageGet("CCModLoader"));
      } catch {}
      for (var pref in config) {
        CCModLoader.config[pref] = config[pref];
      }
    }
  };

  CCModLoader.defaultConfig = function () {
    return {
      autoLoad: true,
      saveHack: false,
      cacheBypass: false, // hidden setting
      mods: [],
    };
  };

  CCModLoader.getOptionsMenu = function () {
    var options = [];
    options.push('<div class="listing">');
    options.push('<a class="option');
    if (!CCModLoader.config.saveHack) options.push(" off");
    options.push('" id="CCModLoader-savehack" ' + Game.clickStr);
    options.push('="CCModLoader.toggleSaveHack()">Save Injection</a>');
    options.push(
      // '<label>Modifies your bakery name to include a "hack" that loads CC Mod Loader automatically when your file loads.</label>'
      "<label>Saves CC Mod Loader onto your save file so it's automatically loaded when your file loads.</label>"
    );
    options.push("<br/>");
    options.push("Mod list will eventually go here. Not yet implemented!");
    options.push("</div>");
    return options.join("");
  };

  CCModLoader.countNotif = function () {
    var count = CCModLoader.modCount;
    var title = count + " Mods Auto-Loaded";
    var desc = "Configure Mod Loader from top menu";
    var time = 5;
    if (count == 1) title = "1 Mod Auto-Loaded";
    var popup = title;
    if (count == 0) {
      title = "Welcome to CC Mod Loader";
      desc = "Add mods to load from the top menu, next to the Twitter link.";
      popup = "No Mods Auto-Loaded";
      time = 0;
    }
    if (Game.prefs.popups) Game.Popup(popup);
    else Game.Notify(title, desc, [16, 5], time);
  };

  CCModLoader.init();
};

if (!CCModLoader.isLoaded) CCModLoader.launch();
