class Game
  include DataMapper::Resource
  property :id, Serial
  property :published, Boolean, :default => false
  belongs_to :author, 'User'
  has n, :versions

  def published?
    return published
  end

end
