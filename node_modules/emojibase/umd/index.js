(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("Emojibase", ["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.Emojibase = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  _exports.__esModule = true;
  _exports.appendSkinToneIndex = appendSkinToneIndex;
  _exports.fetchFromCDN = fetchFromCDN;
  _exports.fetchMetadata = fetchMetadata;
  _exports.fetchShortcodes = fetchShortcodes;
  _exports.flattenEmojiData = flattenEmojiData;
  _exports.fromCodepointToUnicode = fromCodepointToUnicode;
  _exports.fromHexcodeToCodepoint = fromHexcodeToCodepoint;
  _exports.fromUnicodeToHexcode = fromUnicodeToHexcode;
  _exports.generateEmoticonPermutations = generateEmoticonPermutations;
  _exports.joinShortcodes = joinShortcodes;
  _exports.joinShortcodesToEmoji = joinShortcodesToEmoji;
  _exports.stripHexcode = stripHexcode;
  _exports.fetchEmojis = _exports.UNICODE_VERSIONS = _exports.TEXT = _exports.SUPPORTED_LOCALES = _exports.SKIN_KEY_MEDIUM_LIGHT = _exports.SKIN_KEY_MEDIUM_DARK = _exports.SKIN_KEY_MEDIUM = _exports.SKIN_KEY_LIGHT = _exports.SKIN_KEY_DARK = _exports.SEQUENCE_REMOVAL_PATTERN = _exports.NON_LATIN_LOCALES = _exports.MEDIUM_SKIN = _exports.MEDIUM_LIGHT_SKIN = _exports.MEDIUM_DARK_SKIN = _exports.MALE = _exports.LIGHT_SKIN = _exports.LATEST_UNICODE_VERSION = _exports.LATEST_EMOJI_VERSION = _exports.LATEST_CLDR_VERSION = _exports.GROUP_KEY_TRAVEL_PLACES = _exports.GROUP_KEY_SYMBOLS = _exports.GROUP_KEY_SMILEYS_EMOTION = _exports.GROUP_KEY_PEOPLE_BODY = _exports.GROUP_KEY_OBJECTS = _exports.GROUP_KEY_FOOD_DRINK = _exports.GROUP_KEY_FLAGS = _exports.GROUP_KEY_COMPONENT = _exports.GROUP_KEY_ANIMALS_NATURE = _exports.GROUP_KEY_ACTIVITIES = _exports.FIRST_UNICODE_EMOJI_VERSION = _exports.FEMALE = _exports.EMOTICON_OPTIONS = _exports.EMOJI_VERSIONS = _exports.EMOJI = _exports.DARK_SKIN = void 0;

  function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

  function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

  // Generated with Packemon: https://packemon.dev
  // Platform: browser, Support: stable, Format: umd
  function appendSkinToneIndex(shortcode, emoji, prefix) {
    if (prefix === void 0) {
      prefix = '';
    }

    return shortcode + "_" + prefix + (Array.isArray(emoji.tone) ? emoji.tone.join('-') : emoji.tone);
  }

  function fetchFromCDN(path, options) {
    if (options === void 0) {
      options = {};
    }

    var _options = options,
        _options$local = _options.local,
        local = _options$local === void 0 ? false : _options$local,
        _options$version = _options.version,
        version = _options$version === void 0 ? 'latest' : _options$version,
        opts = _objectWithoutPropertiesLoose(_options, ["local", "version"]);

    if (process.env.NODE_ENV !== "production") {
      if (!path || path.slice(-5) !== '.json') {
        throw new Error('A valid JSON dataset is required to fetch.');
      }

      if (!version) {
        throw new Error('A valid release version is required.');
      }
    }

    var storage = local ? localStorage : sessionStorage;
    var cacheKey = "emojibase/" + version + "/" + path;
    var cachedData = storage.getItem(cacheKey); // Check the cache first

    if (cachedData) {
      return Promise.resolve(JSON.parse(cachedData));
    }

    return fetch("https://cdn.jsdelivr.net/npm/emojibase-data@" + version + "/" + path, _extends({
      credentials: 'omit',
      mode: 'cors',
      redirect: 'error'
    }, opts)).then(function (response) {
      if (!response.ok) {
        throw new Error('Failed to load Emojibase dataset.');
      }

      return response.json();
    }).then(function (data) {
      try {
        storage.setItem(cacheKey, JSON.stringify(data));
      } catch (error) {// Do not allow quota errors to break the app
      }

      return data;
    });
  }

  var fetchEmojis = function fetchEmojis(locale, options) {
    if (options === void 0) {
      options = {};
    }

    try {
      var _options3 = options,
          _options3$compact = _options3.compact,
          compact = _options3$compact === void 0 ? false : _options3$compact,
          _options3$flat = _options3.flat,
          flat = _options3$flat === void 0 ? false : _options3$flat,
          _options3$shortcodes = _options3.shortcodes,
          presets = _options3$shortcodes === void 0 ? [] : _options3$shortcodes,
          opts = _objectWithoutPropertiesLoose(_options3, ["compact", "flat", "shortcodes"]);

      return Promise.resolve(fetchFromCDN(locale + "/" + (compact ? 'compact' : 'data') + ".json", opts)).then(function (emojis) {
        function _temp2() {
          return flat ? flattenEmojiData(emojis, shortcodes) : joinShortcodes(emojis, shortcodes);
        }

        var shortcodes = [];

        var _temp = function () {
          if (presets.length > 0) {
            return Promise.resolve(Promise.all(presets.map(function (preset) {
              var promise;

              if (preset.includes('/')) {
                var _preset$split = preset.split('/'),
                    customLocale = _preset$split[0],
                    customPreset = _preset$split[1];

                promise = fetchShortcodes(customLocale, customPreset, opts);
              } else {
                promise = fetchShortcodes(locale, preset, opts);
              } // Ignore as the primary dataset should still load


              return promise.catch(function () {
                return {};
              });
            }))).then(function (_Promise$all) {
              shortcodes = _Promise$all;
            });
          }
        }();

        return _temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _exports.fetchEmojis = fetchEmojis;
  var SEQUENCE_REMOVAL_PATTERN = /200D|FE0E|FE0F/g; // Use numbers instead of string values, as the filesize is greatly reduced.

  _exports.SEQUENCE_REMOVAL_PATTERN = SEQUENCE_REMOVAL_PATTERN;
  var TEXT = 0;
  _exports.TEXT = TEXT;
  var EMOJI = 1;
  _exports.EMOJI = EMOJI;
  var FEMALE = 0;
  _exports.FEMALE = FEMALE;
  var MALE = 1;
  _exports.MALE = MALE;
  var LIGHT_SKIN = 1;
  _exports.LIGHT_SKIN = LIGHT_SKIN;
  var MEDIUM_LIGHT_SKIN = 2;
  _exports.MEDIUM_LIGHT_SKIN = MEDIUM_LIGHT_SKIN;
  var MEDIUM_SKIN = 3;
  _exports.MEDIUM_SKIN = MEDIUM_SKIN;
  var MEDIUM_DARK_SKIN = 4;
  _exports.MEDIUM_DARK_SKIN = MEDIUM_DARK_SKIN;
  var DARK_SKIN = 5;
  _exports.DARK_SKIN = DARK_SKIN;
  var GROUP_KEY_SMILEYS_EMOTION = 'smileys-emotion';
  _exports.GROUP_KEY_SMILEYS_EMOTION = GROUP_KEY_SMILEYS_EMOTION;
  var GROUP_KEY_PEOPLE_BODY = 'people-body';
  _exports.GROUP_KEY_PEOPLE_BODY = GROUP_KEY_PEOPLE_BODY;
  var GROUP_KEY_ANIMALS_NATURE = 'animals-nature';
  _exports.GROUP_KEY_ANIMALS_NATURE = GROUP_KEY_ANIMALS_NATURE;
  var GROUP_KEY_FOOD_DRINK = 'food-drink';
  _exports.GROUP_KEY_FOOD_DRINK = GROUP_KEY_FOOD_DRINK;
  var GROUP_KEY_TRAVEL_PLACES = 'travel-places';
  _exports.GROUP_KEY_TRAVEL_PLACES = GROUP_KEY_TRAVEL_PLACES;
  var GROUP_KEY_ACTIVITIES = 'activities';
  _exports.GROUP_KEY_ACTIVITIES = GROUP_KEY_ACTIVITIES;
  var GROUP_KEY_OBJECTS = 'objects';
  _exports.GROUP_KEY_OBJECTS = GROUP_KEY_OBJECTS;
  var GROUP_KEY_SYMBOLS = 'symbols';
  _exports.GROUP_KEY_SYMBOLS = GROUP_KEY_SYMBOLS;
  var GROUP_KEY_FLAGS = 'flags';
  _exports.GROUP_KEY_FLAGS = GROUP_KEY_FLAGS;
  var GROUP_KEY_COMPONENT = 'component';
  _exports.GROUP_KEY_COMPONENT = GROUP_KEY_COMPONENT;
  var SKIN_KEY_LIGHT = 'light';
  _exports.SKIN_KEY_LIGHT = SKIN_KEY_LIGHT;
  var SKIN_KEY_MEDIUM_LIGHT = 'medium-light';
  _exports.SKIN_KEY_MEDIUM_LIGHT = SKIN_KEY_MEDIUM_LIGHT;
  var SKIN_KEY_MEDIUM = 'medium';
  _exports.SKIN_KEY_MEDIUM = SKIN_KEY_MEDIUM;
  var SKIN_KEY_MEDIUM_DARK = 'medium-dark';
  _exports.SKIN_KEY_MEDIUM_DARK = SKIN_KEY_MEDIUM_DARK;
  var SKIN_KEY_DARK = 'dark'; // Important release versions and locales in generating accurate data.

  _exports.SKIN_KEY_DARK = SKIN_KEY_DARK;
  var LATEST_EMOJI_VERSION = '13.1';
  _exports.LATEST_EMOJI_VERSION = LATEST_EMOJI_VERSION;
  var LATEST_UNICODE_VERSION = '13.0.0';
  _exports.LATEST_UNICODE_VERSION = LATEST_UNICODE_VERSION;
  var LATEST_CLDR_VERSION = '39';
  _exports.LATEST_CLDR_VERSION = LATEST_CLDR_VERSION;
  var FIRST_UNICODE_EMOJI_VERSION = '6.0.0';
  _exports.FIRST_UNICODE_EMOJI_VERSION = FIRST_UNICODE_EMOJI_VERSION;
  var EMOJI_VERSIONS = ['1.0', '2.0', '3.0', '4.0', '5.0', '11.0', '12.0', '12.1', '13.0', '13.1'];
  _exports.EMOJI_VERSIONS = EMOJI_VERSIONS;
  var UNICODE_VERSIONS = ['6.0', '6.1', '6.2', '6.3', '7.0', '8.0', '9.0', '10.0', '11.0', '12.0', '12.1', '13.0'];
  _exports.UNICODE_VERSIONS = UNICODE_VERSIONS;
  var SUPPORTED_LOCALES = ['da', // Danish
  'de', // German
  'en', // English
  'en-gb', // English (Great Britain)
  'es', // Spanish
  'es-mx', // Spanish (Mexico)
  'et', // Estonian
  'fi', // Finnish
  'fr', // French
  'hu', // Hungarian
  'it', // Italian
  'ja', // Japanese
  'ko', // Korean
  'lt', // Lithuanian
  'ms', // Malay
  'nb', // Norwegian
  'nl', // Dutch
  'pl', // Polish
  'pt', // Portuguese
  'ru', // Russian
  'sv', // Swedish
  'th', // Thai
  'uk', // Ukrainian
  'zh', // Chinese
  'zh-hant' // Chinese (Traditional)
  ];
  _exports.SUPPORTED_LOCALES = SUPPORTED_LOCALES;
  var NON_LATIN_LOCALES = ['ja', 'ko', 'ru', 'th', 'uk', 'zh', 'zh-hant']; // Special options for emoticon permutations.

  _exports.NON_LATIN_LOCALES = NON_LATIN_LOCALES;
  var EMOTICON_OPTIONS = {
    // 🧙‍♂️ man mage
    ':{>': {
      withNose: false
    },
    // 💔 broken heart
    '</3': {
      isFace: false
    },
    // ❤️ red heart
    '<3': {
      isFace: false
    },
    // 🤘 sign of the horns
    '\\m/': {
      isFace: false
    },
    // 👹 ogre
    '0)': {
      withNose: false
    }
  };
  _exports.EMOTICON_OPTIONS = EMOTICON_OPTIONS;
  var ALIASES = {
    discord: 'joypixels',
    slack: 'iamcal'
  };

  function fetchShortcodes(locale, preset, options) {
    if (preset === 'cldr-native' && !NON_LATIN_LOCALES.includes(locale)) {
      return Promise.resolve({});
    }

    return fetchFromCDN(locale + "/shortcodes/" + (ALIASES[preset] || preset) + ".json", options);
  }

  function joinShortcodesToEmoji(emoji, shortcodeDatasets) {
    if (shortcodeDatasets.length === 0) {
      return emoji;
    }

    var list = new Set(emoji.shortcodes);
    shortcodeDatasets.forEach(function (dataset) {
      var shortcodes = dataset[emoji.hexcode];

      if (Array.isArray(shortcodes)) {
        shortcodes.forEach(function (code) {
          return list.add(code);
        });
      } else if (shortcodes) {
        list.add(shortcodes);
      }
    });
    emoji.shortcodes = Array.from(list);

    if (emoji.skins) {
      emoji.skins.forEach(function (skin) {
        joinShortcodesToEmoji(skin, shortcodeDatasets);
      });
    }

    return emoji;
  }

  function flattenEmojiData(data, shortcodeDatasets) {
    if (shortcodeDatasets === void 0) {
      shortcodeDatasets = [];
    }

    var emojis = [];
    data.forEach(function (emoji) {
      if (emoji.skins) {
        // Dont include nested skins array
        var skins = emoji.skins,
            baseEmoji = _objectWithoutPropertiesLoose(emoji, ["skins"]);

        emojis.push(joinShortcodesToEmoji(baseEmoji, shortcodeDatasets)); // Push each skin modification into the root list

        skins.forEach(function (skin) {
          var skinEmoji = _extends({}, skin); // Inherit tags from parent if they exist


          if (baseEmoji.tags) {
            skinEmoji.tags = [].concat(baseEmoji.tags);
          }

          emojis.push(joinShortcodesToEmoji(skinEmoji, shortcodeDatasets));
        });
      } else {
        emojis.push(joinShortcodesToEmoji(emoji, shortcodeDatasets));
      }
    });
    return emojis;
  }

  function joinShortcodes(emojis, shortcodeDatasets) {
    if (shortcodeDatasets.length === 0) {
      return emojis;
    }

    emojis.forEach(function (emoji) {
      joinShortcodesToEmoji(emoji, shortcodeDatasets);
    });
    return emojis;
  }

  function fetchMetadata(locale, options) {
    return fetchFromCDN(locale + "/meta.json", options);
  }

  function fromCodepointToUnicode(codepoint) {
    return String.fromCodePoint.apply(String, codepoint);
  }

  function fromHexcodeToCodepoint(code, joiner) {
    if (joiner === void 0) {
      joiner = '-';
    }

    return code.split(joiner).map(function (point) {
      return Number.parseInt(point, 16);
    });
  }

  function fromUnicodeToHexcode(unicode, strip) {
    if (strip === void 0) {
      strip = true;
    }

    var hexcode = [];
    Array.from(unicode).forEach(function (codepoint) {
      // @ts-expect-error
      var hex = codepoint.codePointAt(0).toString(16).toUpperCase();

      while (hex.length < 4) {
        hex = "0" + hex;
      }

      if (!strip || strip && !hex.match(SEQUENCE_REMOVAL_PATTERN)) {
        hexcode.push(hex);
      }
    });
    return hexcode.join('-');
  }

  function generateEmoticonPermutations(emoticon, options) {
    if (options === void 0) {
      options = {};
    }

    var _options2 = options,
        _options2$isFace = _options2.isFace,
        isFace = _options2$isFace === void 0 ? true : _options2$isFace,
        _options2$withNose = _options2.withNose,
        withNose = _options2$withNose === void 0 ? true : _options2$withNose;
    var list = [emoticon]; // Uppercase variant

    if (emoticon.toUpperCase() !== emoticon) {
      list.push.apply(list, generateEmoticonPermutations(emoticon.toUpperCase(), options));
    }

    if (isFace) {
      // Backwards slash mouth variant
      if (emoticon.includes('/')) {
        list.push.apply(list, generateEmoticonPermutations(emoticon.replace('/', '\\'), options));
      } // Bracket and curly brace mouth variants


      if (emoticon.includes(')')) {
        list.push.apply(list, generateEmoticonPermutations(emoticon.replace(')', ']'), options));
        list.push.apply(list, generateEmoticonPermutations(emoticon.replace(')', '}'), options));
      }

      if (emoticon.includes('(')) {
        list.push.apply(list, generateEmoticonPermutations(emoticon.replace('(', '['), options));
        list.push.apply(list, generateEmoticonPermutations(emoticon.replace('(', '{'), options));
      } // Eye variant


      if (emoticon.includes(':')) {
        list.push.apply(list, generateEmoticonPermutations(emoticon.replace(':', '='), options));
      } // Nose variant for ALL


      if (withNose) {
        list.forEach(function (emo) {
          if (!emo.includes('-')) {
            list.push(emo.slice(0, emo.length - 1) + "-" + emo.slice(-1));
          }
        });
      }
    } // Sort from longest to shortest


    list.sort(function (a, b) {
      return b.length - a.length;
    });
    return Array.from(new Set(list));
  }

  var STRIP_PATTERN = new RegExp("(-| )?(" + SEQUENCE_REMOVAL_PATTERN.source + ")", 'g');
  /**
   * Remove variation selectors and zero width joiners, while fixing any multi dash issues.
   */

  function stripHexcode(hexcode) {
    return hexcode.replace(STRIP_PATTERN, '');
  }
  /**
   * @copyright   2017-2019, Miles Johnson
   * @license     https://opensource.org/licenses/MIT
   */

});
//# sourceMappingURL=index.js.map
