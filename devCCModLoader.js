/**
 * @prettier
 */

Game.Win("Third-party");
if (CCModLoader === undefined) var CCModLoader = {};
if (typeof CCSE == "undefined")
  Game.LoadMod("https://klattmose.github.io/CookieClicker/CCSE.js");
CCModLoader.name = "CC Mod Loader";
CCModLoader.version = "1.0-dev";
CCModLoader.GameVersion = "2.022";
CCModLoader.modURL =
  "https://faynealdan.github.io/CCModLoader/devCCModLoader.js";

CCModLoader.launch = function () {
  CCModLoader.init = function () {
    CCModLoader.isLoaded = true;
    CCModLoader.modCount = 0;
    CCModLoader.config = {};
    CCModLoader.loadedMods = [
      "https://klattmose.github.io/CookieClicker/CCSE.js",
      CCModLoader.modURL,
    ];

    if (Game.bakeryName.toUpperCase().substr(0, 4) == "<IMG") {
      var temp = Game.bakeryName;
      var s = temp.indexOf('"') + 1;
      var e = temp.indexOf('"', s);

      Game.bakeryName = temp.substr(s, e - s);
      Game.bakeryNameRefresh();
    }

    eval(
      "Game.WriteSave = " +
        Game.WriteSave.toString().replace(
          "Game.bakeryName",
          "CCModLoader.GetBakeryNameForSaving()"
        )
    );

    CCModLoader.loadConfig();
    CCSE.customLoad.push(CCModLoader.loadConfig);
    CCSE.customSave.push(CCModLoader.saveConfig);

    CCModLoader.loadMods();

    CCModLoader.ReplaceGameMenu();
    CCModLoader.countNotif();
  };

  CCModLoader.GetBakeryNameForSaving = function () {
    return !CCModLoader.config.saveHack
      ? Game.bakeryName
      : '<IMG src="' +
          Game.bakeryName +
          '" onerror=\'Game.LoadMod("' +
          CCModLoader.modURL +
          (CCModLoader.config.cacheBypass ? "?" + Math.random() : "") +
          "\")' />";
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
    CCSE.save.OtherMods.CCModLoader = CCModLoader.config;
  };

  CCModLoader.loadConfig = function () {
    CCModLoader.config = CCModLoader.defaultConfig();
    if (CCSE.save.OtherMods.CCModLoader) {
      var config = CCSE.save.OtherMods.CCModLoader;
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

  CCModLoader.ReplaceGameMenu = function () {
    Game.customOptionsMenu.push(function () {
      CCSE.AppendCollapsibleOptionsMenu(
        CCModLoader.name,
        CCModLoader.getOptionsMenu()
      );
    });
    Game.customStatsMenu.push(function () {
      CCSE.AppendStatsVersionNumber(CCModLoader.name, CCModLoader.version);
      CCSE.AppendStatsGeneral(
        '<div class="listing"><b>Mods loaded :</b> ' +
          CCModLoader.modCount +
          "</div>"
      );
    });
    Game.customInfoMenu.push(function () {
      CCSE.PrependCollapsibleInfoMenu(
        "Loaded mods (" + CCModLoader.name + ")",
        CCModLoader.loadedMods
          .map(function (mod) {
            return (
              '<div class="listing">' +
              mod.replace(/</g, "&lt;").replace(/>/g, "&gt;") +
              "</div>"
            );
          })
          .join("")
      );
    });
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

  CCModLoader.toggleSaveHack = function () {
    CCModLoader.config.saveHack = !CCModLoader.config.saveHack;
    var btn = document.getElementById("CCModLoader-savehack");
    if (btn)
      btn.className = "option" + (CCModLoader.config.saveHack ? "" : " off");
    CCModLoader.Tick();
  };

  CCModLoader.Tick = function () {
    PlaySound("snd/tick.mp3");
  };

  CCModLoader.countNotif = function () {
    var count = CCModLoader.modCount;
    var title = count + " Mods Auto-Loaded";
    var desc = "Configure CC Mod Loader in Options";
    if (count == 1) title = "1 Mod Auto-Loaded";
    var popup = title;
    if (count == 0) {
      title = "Welcome to CC Mod Loader";
      desc = "Configure your mods in Options";
      popup = "No Mods Auto-Loaded";
    }
    if (Game.prefs.popups) Game.Popup(popup);
    else Game.Notify(title, desc, [16, 5], 5);
  };

  if (
    CCSE.ConfirmGameVersion(
      CCModLoader.name,
      CCModLoader.version,
      CCModLoader.GameVersion
    )
  )
    CCModLoader.init();
};

if (!CCModLoader.isLoaded) {
  if (CCSE && CCSE.isLoaded) CCModLoader.launch();
  else {
    if (!CCSE) var CCSE = {};
    if (!CCSE.postLoadHooks) CCSE.postLoadHooks = [];
    CCSE.postLoadHooks.push(CCModLoader.launch);
  }
}
