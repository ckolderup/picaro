class Game
  include DataMapper::Resource
  property :id, Serial
  property :published, Boolean, :default => false
  belongs_to :author, 'User'
  has n, :versions
  has n, :urls

  def published?
    return published
  end

  before :create do |game|
    puts "creating game"
  end

  before :save do |game|
    puts "saving game"
  end
end
