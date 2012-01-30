require 'dm-types'

class Url
  include DataMapper::Resource

  property :title, String
  property :slug, Slug, :key => true
  has 1, :game

end
