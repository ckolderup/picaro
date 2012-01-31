define(['jquery', 'Inventory'], function($, Inventory) {
  var Room = {};

  Room.get = function(room, roomNum) {                                                     // begin room-switching/initializing function
    $("ul").not("#footer ul").not("#move-compass ul").each(function() {                  // reload all the room-specific lists
        $(this).empty();
    });

    var roomID = roomNum;
    $("#header h2").html(room.Name);

    var roomDescription = room.Description;                                                //re-populate nav links
    var itemNames = $.map(room.items, function(item) {return item.Name});
    $(document).trigger("updateStatus", roomDescription + "<br/ ><br/>You see " + util.toArrayToSentence(itemNames));

    $("#move a").attr("href", "#");
    $("#move li").addClass("disabled");
    $.each(room.paths, function() {
       if(this.Direction === "North") {
         $("#move-compass-north a").attr("href", this.Name);
         $("#move-compass-north, #move-compass-north a").removeClass("disabled");
       }

       if(this.Direction === "South") {
         $("#move-compass-south a").attr("href", this.Name);
         $("#move-compass-south, #move-compass-south a").removeClass("disabled");
       }

       if(this.Direction === "East") {
         $("#move-compass-east a").attr("href", this.Name);
         $("#move-compass-east, #move-compass-east a").removeClass("disabled");
       }

       if(this.Direction === "West") {
         $("#move-compass-west a").attr("href", this.Name);
         $("#move-compass-west, #move-compass-west a").removeClass("disabled");
       }
    });


    for (var i in Inventory) {                                                           //re-populate item lists
         $("#action-use ul, #action-look ul").append("<li><a href='#' class='item'>" + Inventory[i] + " <small>(held)</small></a></li>"); //append if it's in the Inventory
    }

    $.each(room.items, function() {

         if(this.Use) {
                  $("#action-use ul").append("<li><a href='#' class='item'>" + this.Name + "</a></li>");
         }

         if(this.Look){
                  var inInventory = jQuery.inArray(this.Name, Inventory);                 // don't append it if it's in the Inventory
                  if(inInventory === -1) {
                  $("#action-look ul").append("<li><a href='#' class='item'>" + this.Name + "</a></li>");
                  }
         }

         if(this.Take) {
                  var inInventory = jQuery.inArray(this.Name, Inventory);
                  if(inInventory === -1) {
                  $("#action-take ul").append("<li><a href='#' class='item'>" + this.Name + "</a></li>");
                  }
         }

         if(this.Talk) {
                  $("#action-talk ul").append("<li><a href='#' class='item'>" + this.Name + "</a></li>");
         }

         if(this.Attack) {
                  $("#action-attack ul").append("<li><a href='#' class='item'>" + this.Name + "</a></li>");
         }

    });

    $(".ui-action ul li a").bind('click', function() {                          // re-bind click event to new links. is there a way around having this here?
         var that = $(this);
         var action = that.parent().parent().attr("id");
         var item = that.clone().find("small").remove().end().text();
         $(".ui-overlay, .ui-action").fadeOut();
         $(".active").removeClass("active");
         if(action === "Take") {
                  that.remove();
         }
         itemAction(action, item, roomID);
    })
  }

  return Room;
});