define ["item", "itemish"], (Item, Itemish) ->
  testItems = [
    { "name": "Rake", "look": "The rake is a bit rusty."},
    { "name": "Leaf", "id": "abc123", "look": "It seems rather far away."}
  ]

  # itemObjs = new Item itemData for itemData in testItems

  describe "Item", ->
    beforeEach ->

    it "has the ID you pass into its constructor", ->
      # expect(itemObjs[0].id).toEqual "abc123"

  describe "Itemish", ->
    it "can be initialized with a data object", ->
      data =
        "My Cool Thing":
          "look": "Wow, cool",
          "name": "Pretty ok"

      item = new Itemish data

      expect(item.id).toEqual "myCoolThing"
      expect(item.name).toEqual "Pretty ok"
      expect(item.look).toEqual "Wow, cool"

    it "can be initialized with an object and an id", ->
      data =
        "My Cool Thing":
          "look": "Wow, cool",
          "name": "Pretty ok"

      item = new Itemish data["My Cool Thing"], "My Cool Thing"
      expect(item.id).toEqual "myCoolThing"
      expect(item.name).toEqual "Pretty ok"
      expect(item.look).toEqual "Wow, cool"