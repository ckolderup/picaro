define [ "inventory" ], (Inventory) ->
  testItems = [
    { "name": "Rake", "id": "rake", "look": ["The rake is a bit rusty."]},
    { "name": "Leaf", "id": "leaf", "look": ["It seems rather far away."]}
  ]

  describe "Inventory", ->
    afterEach -> Inventory._items = {}

    it "has a size of zero to start", ->
      expect(Inventory.size()).toEqual 0

    it "should grow when added to", ->
      Inventory.add testItems[0]
      expect(Inventory.size()).toEqual 1
      Inventory.add testItems[1]
      expect(Inventory.size()).toEqual 2

    it "should return the item you ask for", ->
      Inventory.add testItems[0]
      expect(Inventory.get 'rake').toEqual testItems[0]

    it "should remove the item you specify", ->
      Inventory.add testItems[1]
      Inventory.add testItems[0]
      expect(Inventory.remove 'leaf').toBeTrue
      expect(Inventory.list()).toEqual [testItems[0]]

    it "should return false and do nothing when you try to remove something it doesn't contain", ->
      Inventory.add testItems[1]
      expect(Inventory.size()).toEqual 1
      expect(Inventory.remove 'jankNotFound').toBeFalse
      expect(Inventory.size()).toEqual 1

    it "includes what you added to it", ->
      expect(Inventory.include testItems[1]).toBeFalse
      Inventory.add testItems[1]
      expect(Inventory.include testItems[1]).toBeTrue

    it "lists its contents", ->
      Inventory.add item for item in testItems
      expect(Inventory.list()).toEqual testItems

