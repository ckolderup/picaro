class Version
  include DataMapper::Resource

  property :id, Serial
  property :label, Text, :required => true #the "version"
  property :title, Text, :required => true
  property :description, Text
  property :source_url, Text
  property :source, Text
  property :changelog, Text
  property :uploaded_at, DateTime, :default => lambda { |r, p| DateTime.now }
  belongs_to :game

  #validates_with_method :script_present

  def script_present
    true unless source_url.nil? && source.nil?
  end

  before :create do |version|
    throw unless script_present
    if version[:source].nil? then
      source = JSON.parse(HTTParty.get(version[:source_url]))
      version[:title] = source[:title]
      version[:description] = source[:description]
    end
  end
end
