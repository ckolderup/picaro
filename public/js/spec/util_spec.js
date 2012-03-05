
define(["util"], function(Util) {
  return describe("Util.arrayToSentence", function() {
    var testArray;
    testArray = ["cheese", "toast", "bread", "a little wine"];
    it("joins into a single string, who gives a fuck about an oxford comma", function() {
      return expect(Util.arrayToSentence(testArray)).toEqual("cheese, toast, bread and a little wine.");
    });
    it("takes an alternate separator argument", function() {
      return expect(Util.arrayToSentence(testArray, "; ")).toEqual("cheese; toast; bread and a little wine.");
    });
    return it("takes an alternate final separator argument", function() {
      return expect(Util.arrayToSentence(testArray, "; ", " as well as ")).toEqual("cheese; toast; bread as well as a little wine.");
    });
  });
});
