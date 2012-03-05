define [ "util" ], (Util) ->
  describe "Util.arrayToSentence", ->
    testArray = [ "cheese", "toast", "bread", "a little wine" ]

    it "joins into a single string, who gives a fuck about an oxford comma", ->
      expect(Util.arrayToSentence(testArray)).toEqual "cheese, toast, bread and a little wine."

    it "takes an alternate separator argument", ->
      expect(Util.arrayToSentence(testArray, "; ")).toEqual "cheese; toast; bread and a little wine."

    it "takes an alternate final separator argument", ->
      expect(Util.arrayToSentence(testArray, "; ", " as well as ")).toEqual "cheese; toast; bread as well as a little wine."