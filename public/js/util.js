
define(["jquery"], function($) {
  return {
    arrayToSentence: function(array, separator, lastSeparator) {
      var firstLetter, i, length, string, vowels;
      separator || (separator = ", ");
      lastSeparator || (lastSeparator = " and ");
      length = array.length;
      string = "";
      i = 0;
      while (i < length) {
        firstLetter = array[i][0];
        if (firstLetter.toUpperCase() === firstLetter) {
          vowels = ["A", "E", "I", "O", "U"];
          if ($.inArray(firstLetter, vowels) > 0) {
            string += "an ";
          } else {
            string += "a ";
          }
        }
        string += array[i];
        firstLetter = array[i][0];
        if (i === (length - 2)) {
          string += lastSeparator;
        } else {
          if (i < (length - 1)) string += separator;
        }
        i++;
      }
      return string + ".";
    },
    arrayEquality: function(a, b) {
      var i;
      if (a.length === b.length) {
        i = 0;
        while (i < a.length) {
          if (typeof a[i] === "object") {
            if (!Equals(a[i], b[i])) return false;
          } else {
            if (a[i] !== b[i]) return false;
          }
          i++;
        }
        return true;
      } else {
        return false;
      }
    },
    actionId: function(item, action) {
      return action + "-" + item.id;
    },
    splitActionId: function(domNode) {
      return $(domNode).data("action-id").split("-");
    }
  };
});
