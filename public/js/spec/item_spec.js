
define(["item", "itemish"], function(Item, Itemish) {
  var testItems;
  testItems = [
    {
      "name": "Rake",
      "look": "The rake is a bit rusty."
    }, {
      "name": "Leaf",
      "id": "abc123",
      "look": "It seems rather far away."
    }
  ];
  describe("Item", function() {
    beforeEach(function() {});
    return it("has the ID you pass into its constructor", function() {});
  });
  return describe("Itemish", function() {
    it("can be initialized with a data object", function() {
      var data, item;
      data = {
        "My Cool Thing": {
          "look": "Wow, cool",
          "name": "Pretty ok"
        }
      };
      item = new Itemish(data);
      expect(item.id).toEqual("myCoolThing");
      expect(item.name).toEqual("Pretty ok");
      return expect(item.look).toEqual("Wow, cool");
    });
    return it("can be initialized with an object and an id", function() {
      var data, item;
      data = {
        "My Cool Thing": {
          "look": "Wow, cool",
          "name": "Pretty ok"
        }
      };
      item = new Itemish(data["My Cool Thing"], "My Cool Thing");
      expect(item.id).toEqual("myCoolThing");
      expect(item.name).toEqual("Pretty ok");
      return expect(item.look).toEqual("Wow, cool");
    });
  });
});
