class Version
  include DataMapper::Resource

  property :id, Serial
  property :label, Text
  property :title, Text
  property :description, Text
  property :source, Text
  property :changelog, Text
  property :uploaded_at, DateTime, :default => lambda { DateTime.now }
  belongs_to :game

  before :create do |version|
    #parse title, description from source
  end
end
