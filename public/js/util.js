
define(["jquery", "game"], function($, Game) {
  return {
    arrayToSentence: function(array, options) {
      var firstLetter, i, lastSeparator, obj, separator, string, vowels, word, _i, _len;
      if (options == null) {
        options = {};
      }
      separator = options.separator || ", ";
      lastSeparator = options.lastSeparator || " and ";
      string = "";
      for (i = _i = 0, _len = array.length; _i < _len; i = ++_i) {
        obj = array[i];
        word = this.typeOf(obj) === "string" ? obj : obj.name;
        firstLetter = word[0];
        if (firstLetter.toUpperCase() === firstLetter) {
          vowels = "AEIOU".split('');
          string += _.include(vowels, firstLetter) ? "an " : "a ";
        }
        string += Game.current.inlineActions && obj.linkifiedName ? obj.linkifiedName() : word;
        firstLetter = word[0];
        if (i === array.length - 2) {
          string += lastSeparator;
        } else {
          if (i < array.length - 1) {
            string += separator;
          }
        }
      }
      return string + ".";
    },
    arrayEquality: function(a, b) {
      var i;
      if (a.length === b.length) {
        i = 0;
        while (i < a.length) {
          if (typeof a[i] === "object") {
            if (!Equals(a[i], b[i])) {
              return false;
            }
          } else {
            if (a[i] !== b[i]) {
              return false;
            }
          }
          i++;
        }
        return true;
      } else {
        return false;
      }
    },
    toIdString: function(string) {
      return escape(string.replace(/[-\s](.)?/g, function(match, chr) {
        if (chr) {
          return chr.toUpperCase();
        } else {
          return '';
        }
      })).replace(/^[A-Z]/, function(chr) {
        if (chr) {
          return chr.toLowerCase();
        } else {
          return chr;
        }
      });
    },
    createId: function(object) {
      return object.id || object.name;
    },
    actionId: function(item, action) {
      return action + '-' + item.id;
    },
    splitActionId: function(domNode) {
      return $(domNode).data("action-id").split("-");
    },
    stringChomp: function(string) {
      return string.replace(/(\n|\r)+$/, '');
    },
    getQueryParams: function() {
      var name, piece, queryObj, queryString, value, _i, _len;
      queryString = location.search.replace('?', '').split('&');
      queryObj = {};
      for (_i = 0, _len = queryString.length; _i < _len; _i++) {
        piece = queryString[_i];
        name = piece.split('=')[0];
        value = piece.split('=')[1];
        queryObj[name] = value;
      }
      return queryObj;
    },
    typeOf: function(obj) {
      var classToType, myClass, name, _i, _len, _ref;
      if (obj === void 0 || obj === null) {
        return String(obj);
      }
      classToType = new Object;
      _ref = "Boolean Number String Function Array Date RegExp".split(" ");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        classToType["[object " + name + "]"] = name.toLowerCase();
      }
      myClass = Object.prototype.toString.call(obj);
      if (myClass in classToType) {
        return classToType[myClass];
      }
      return "object";
    }
  };
});
