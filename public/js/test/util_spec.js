define(["util"], function(Util) {

  describe("Util.arrayToSentence", function() {
    it ("joins into a single string, who gives a fuck about an oxford comma", function() {
      expect(Util.arrayToSentence(["cheese", "toast", "bread", "a little wine"])).toEqual("cheese, toast, bread and a little wine.")
    });

    it ("takes an alternate separator argument", function() {
      expect(Util.arrayToSentence(["cheese", "toast", "bread", "a little wine"], '; ')).toEqual("cheese; toast; bread and a little wine.")
    });

    it ("takes an alternate final separator argument", function() {
      expect(Util.arrayToSentence(["cheese", "toast", "bread", "a little wine"], '; ', ' as well as ')).toEqual("cheese; toast; bread as well as a little wine.")
    });

  });
});