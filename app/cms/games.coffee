define ["jquery"], ($) ->
  $('a.delete-game').click ->
    if confirm "Are you sure you want to delete this game?"
      $(this.parentElement).submit()
    else
      false

