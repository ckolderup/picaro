define [ "util" ], (Util) ->
  describe "Util.arrayToSentence", ->
    testArray = [ "cheese", "toast", "bread", "a little wine" ]

    it "joins into a single string, who gives a fuck about an oxford comma", ->
      expect(Util.arrayToSentence(testArray)).toEqual "cheese, toast, bread and a little wine."

    it "takes an alternate separator argument", ->
      expect(Util.arrayToSentence(testArray, separator: "; ")).toEqual "cheese; toast; bread and a little wine."

    it "takes an alternate lastSeparator argument", ->
      expect(Util.arrayToSentence(testArray, separator: "; ", lastSeparator: " as well as ")).toEqual "cheese; toast; bread as well as a little wine."

    it "tries to prefix with the proper indefinite article when when items are capitalized", ->
      testArray = ['Apple', 'Tostada', 'Head Cheese']
      expect(Util.arrayToSentence(testArray)).toEqual "an Apple, a Tostada and a Head Cheese."


  describe "Util.toIdString", ->
    it "removes whitespace and looks pretty camelesque", ->
      expect(Util.toIdString("hey there buddy")).toEqual "heyThereBuddy"
      expect(Util.toIdString("hey-there-buddy")).toEqual "heyThereBuddy"
      expect(Util.toIdString("Hey there Buddy")).toEqual "heyThereBuddy"

    it "escapes quotation marks", ->
      expect(Util.toIdString("Jaques O'Lope") ).toEqual "jaquesO%27Lope"
      expect(Util.toIdString("Jaques O' Lope")).toEqual "jaquesO%27Lope"



