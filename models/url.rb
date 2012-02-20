require 'dm-types'
require 'dm-is-slug'

class Url
  include DataMapper::Resource

  property :id, Serial
  property :title, Text
  is :slug, :source => :title
  belongs_to :game

end
