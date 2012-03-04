
define(["jquery", "room", "vendor/underscore"], function($, Room) {
  var Editor;
  Editor = {
    drawRoom: function(roomName, x, y) {
      var destination, direction, item, itemDots, positionOffset, room, roomDiv, _i, _len, _ref, _ref2, _results;
      room = Room.findByName(roomName);
      if (room.drawn) return;
      room.drawn = true;
      positionOffset = 125;
      roomDiv = $("<div data-room-id='" + room.name + "' data-content='" + (_.escape(room.description)) + "' class='room'><h4>" + room.name + " </h3></div>");
      if (room.starter) roomDiv.append('&#9823;');
      roomDiv.popover({
        placement: 'left',
        title: roomName,
        animation: false
      });
      itemDots = '';
      _ref = room.items;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        itemDots += "&#9817;";
      }
      roomDiv.append(itemDots);
      roomDiv.css("left", x).css('top', y);
      $(".rooms").append(roomDiv);
      _ref2 = room.paths;
      _results = [];
      for (direction in _ref2) {
        destination = _ref2[direction];
        switch (direction) {
          case "North":
          case "N":
            roomDiv.addClass('path-north');
            _results.push(this.drawRoom(destination, x, y - positionOffset));
            break;
          case "South":
          case "S":
            roomDiv.addClass('path-south');
            _results.push(this.drawRoom(destination, x, y + positionOffset));
            break;
          case "East":
          case "E":
            roomDiv.addClass('path-east');
            _results.push(this.drawRoom(destination, x + positionOffset, y));
            break;
          case "West":
          case "W":
            roomDiv.addClass('path-west');
            _results.push(this.drawRoom(destination, x - positionOffset, y));
            break;
          default:
            _results.push(void 0);
        }
      }
      return _results;
    },
    resetGameData: function(game) {
      var gameObject;
      gameObject = game;
      Room.all = game.rooms;
      $('.hero-unit h2').html(game.gameName);
      $('.hero-unit p').html(game.gameDescription);
      $("#roomNum").html(game.rooms.length);
      $(".rooms").empty();
      return this.drawRoom(Room.starter().name, 120, 180);
    }
  };
  $(function() {
    var myCodeMirror;
    myCodeMirror = CodeMirror.fromTextArea(document.getElementById("code"), {
      mode: "yaml",
      theme: "monokai",
      onChange: function(mirror, changes) {
        var jsGameObject;
        mirror.save();
        try {
          jsGameObject = jsyaml.load(mirror.getTextArea().value);
          if (typeof jsGameObject === 'object') {
            return Editor.resetGameData(jsGameObject);
          }
        } catch (error) {
          return console.log("Game Not so Good at this Point", error);
        }
      }
    });
    return Editor.resetGameData(jsyaml.load($('#code').html()));
  });
  return Editor;
});
