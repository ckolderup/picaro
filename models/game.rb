class Game
  include DataMapper::Resource
  property :id, Serial
  property :published, Boolean, :default => false
  property :source, Text
  belongs_to :author, 'User'
  has n, :versions
  has n, :urls

  alias :published? :published

  def view_url
    "#{ENV['SITE_ROOT']}/game/#{urls.last.slug}/view"
  end

  def view_version_url(version_id)
    "#{ENV['SITE_ROOT']}/game/#{urls.last.slug}/#{version_id}/view"
  end
end
