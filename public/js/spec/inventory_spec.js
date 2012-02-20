
define(["inventory"], function(Inventory) {
  var testItems;
  testItems = [
    {
      "name": "Rake",
      "id": "rake",
      "look": ["The rake is a bit rusty."]
    }, {
      "name": "Leaf",
      "id": "leaf",
      "look": ["It seems rather far away."]
    }
  ];
  return describe("Inventory", function() {
    afterEach(function() {
      return Inventory._items = {};
    });
    it("has a size of zero to start", function() {
      return expect(Inventory.size()).toEqual(0);
    });
    it("should grow when added to", function() {
      Inventory.add(testItems[0]);
      expect(Inventory.size()).toEqual(1);
      Inventory.add(testItems[1]);
      return expect(Inventory.size()).toEqual(2);
    });
    it("should return the item you ask for", function() {
      Inventory.add(testItems[0]);
      return expect(Inventory.get('rake')).toEqual(testItems[0]);
    });
    it("should remove the item you specify", function() {
      Inventory.add(testItems[1]);
      Inventory.add(testItems[0]);
      expect(Inventory.remove('leaf')).toBeTrue;
      return expect(Inventory.list()).toEqual([testItems[0]]);
    });
    it("should return false and do nothing when you try to remove something it doesn't contain", function() {
      Inventory.add(testItems[1]);
      expect(Inventory.size()).toEqual(1);
      expect(Inventory.remove('jankNotFound')).toBeFalse;
      return expect(Inventory.size()).toEqual(1);
    });
    it("includes what you added to it", function() {
      expect(Inventory.include(testItems[1])).toBeFalse;
      Inventory.add(testItems[1]);
      return expect(Inventory.include(testItems[1])).toBeTrue;
    });
    return it("lists its contents", function() {
      var item, _i, _len;
      for (_i = 0, _len = testItems.length; _i < _len; _i++) {
        item = testItems[_i];
        Inventory.add(item);
      }
      return expect(Inventory.list()).toEqual(testItems);
    });
  });
});
