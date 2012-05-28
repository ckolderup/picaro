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

  validates_with_method :source, :method => :script_present?
  validates_with_method :source, :method => :valid_yaml?

  attr_accessor :parsed_data

  def self.new_from_yaml_and_game(yaml, game)
    version = new source: yaml, game: game

    # Properties derived from parsed game source
    if version.valid_yaml? == true
      version.label = version.parsed_data['version'] || 1
      version.title = version.parsed_data['gameName'] || 'Untitled'
      version.description = version.parsed_data['gameDescription'] || ''
    end
    version
  end

  def update_from_yaml(yaml)
    self.source = yaml
    if valid_yaml?
      self.label = parsed_data['version'] || 1
      self.title = parsed_data['gameName'] || 'Untitled'
      self.description = parsed_data['gameDescription'] || ''
      save!
    end
  end

  def script_present?
    if source_url.present? || source.present?
      true
    else
      [false, "There's nothin to this game of yours"]
    end
  end

  def valid_yaml?
    begin
      self.parsed_data = YAML.load(source)
      true
    rescue
      [false, "That game code ain't valid YAML"]
    end
  end

  before :create do |version|
    if version[:source].nil? then
      source = JSON.parse(HTTParty.get(version[:source_url]))
      version[:title] = source[:title]
      version[:description] = source[:description]
    end
  end
end
