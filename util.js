var util = {};

util.toArrayToSentence = function(array, separator, lastSeparator) {
  separator || (separator = ', ');
  lastSeparator || (lastSeparator = ' and ');
  var length = array.length, string = '';

  for (var i = 0; i < length; i++) {
    var firstLetter = array[i][0];
    if (firstLetter.toUpperCase() === firstLetter) {
      var vowels = ['A','E','I','O','U']
      // if it starts with a vowel, prend "an", otherwise "a". TODO: handle plurals here (i.e. "some")
      jQuery.inArray(firstLetter, vowels) > 0 ? string += "an " : string += "a ";
    }

    string += array[i];
    firstLetter = array[i][0]

    if (i === (length - 2)) { string += lastSeparator; }
    else if (i < (length - 1)) { string += separator; }
  }

  return string + ".";
}