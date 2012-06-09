
define(["util"], function(Util) {
  describe("Util.arrayToSentence", function() {
    var testArray;
    testArray = ["cheese", "toast", "bread", "a little wine"];
    it("joins into a single string, who gives a fuck about an oxford comma", function() {
      return expect(Util.arrayToSentence(testArray)).toEqual("cheese, toast, bread and a little wine.");
    });
    it("takes an alternate separator argument", function() {
      return expect(Util.arrayToSentence(testArray, {
        separator: "; "
      })).toEqual("cheese; toast; bread and a little wine.");
    });
    it("takes an alternate lastSeparator argument", function() {
      return expect(Util.arrayToSentence(testArray, {
        separator: "; ",
        lastSeparator: " as well as "
      })).toEqual("cheese; toast; bread as well as a little wine.");
    });
    return it("tries to prefix with the proper indefinite article when when items are capitalized", function() {
      testArray = ['Apple', 'Tostada', 'Head Cheese'];
      return expect(Util.arrayToSentence(testArray)).toEqual("an Apple, a Tostada and a Head Cheese.");
    });
  });
  return describe("Util.toIdString", function() {
    it("removes whitespace and looks pretty camelesque", function() {
      expect(Util.toIdString("hey there buddy")).toEqual("heyThereBuddy");
      expect(Util.toIdString("hey-there-buddy")).toEqual("heyThereBuddy");
      return expect(Util.toIdString("Hey there Buddy")).toEqual("heyThereBuddy");
    });
    return it("escapes quotation marks", function() {
      expect(Util.toIdString("Jaques O'Lope")).toEqual("jaquesO%27Lope");
      return expect(Util.toIdString("Jaques O' Lope")).toEqual("jaquesO%27Lope");
    });
  });
});
