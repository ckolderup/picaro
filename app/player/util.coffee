define [ "jquery" ], ($) ->

  arrayToSentence: (array, separator, lastSeparator) ->
    separator or (separator = ", ")
    lastSeparator or (lastSeparator = " and ")
    length = array.length
    string = ""
    i = 0

    while i < length
      firstLetter = array[i][0]
      if firstLetter.toUpperCase() is firstLetter
        vowels = [ "A", "E", "I", "O", "U" ]
        (if $.inArray(firstLetter, vowels) > 0 then string += "an " else string += "a ")
      string += array[i]
      firstLetter = array[i][0]
      if i is (length - 2)
        string += lastSeparator
      else string += separator  if i < (length - 1)
      i++
    string + "."

  arrayEquality: (a, b) ->
    if a.length is b.length
      i = 0
      while i < a.length
        if typeof a[i] is "object"
          return false unless Equals(a[i], b[i])
        else return false unless a[i] is b[i]
        i++
      true
    else
      false

  toIdString: (string) ->
    escape string.replace /[-\s](.)?/g, (match, chr) ->
      if chr then chr.toUpperCase() else ''
    .replace /^[A-Z]/, (chr) ->
      if chr then chr.toLowerCase() else chr

  createId: (object) ->
    object.id || object.name

  actionId: (item, action) ->
    action + "-" + item.id

  splitActionId: (domNode) ->
    $(domNode).data("action-id").split "-"

  getQueryParams: ->
    queryString = location.search.replace('?', '').split('&')
    queryObj = {}

    for piece in queryString
      name = piece.split('=')[0];
      value = piece.split('=')[1];
      queryObj[name] = value;
    queryObj