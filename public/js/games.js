
define(["jquery"], function($) {
  return $('a.delete-game').click(function() {
    if (confirm("Are you sure you want to delete this game?")) {
      return $(this.parentElement).submit();
    } else {
      return false;
    }
  });
});
