get '/game/:slug/script' do
  game = Url.first(:slug => params[:slug]).andand.game
  error 404 if game.nil?
  
  game_info = { 
    :author => game.author.display_name,
    :game => game.versions.last.source
  }
  
  game_info.to_json
end

get '/game/:slug/versions' do
  game = Url.first(:slug => params[:slug]).andand.game
  error 404 if game.nil?

  version_index = game.versions.map {|version|
    { 
      :label => version.label,
      :url => "#{ENV['SITE_ROOT']}/game/#{slug}/#{version.id}",
      :changelog => version.changelog
    }
  }

  version_index.to_json
end

get '/game/:slug/script/:version_id' do
  game = Url.first(:slug => params[:slug]).andand.game
  error 404 if game.nil?

  version = game.versions.filter { |v| v.id == version_id }.first

  game_info = {
    :author => game.author.display_name,
    :game => version.source
  }

  game_info.to_json
end

post '/game/new' do
  error 403 unless logged_in?

  game = Game.new(:author => current_user)
  version = Version.new(:title => params[:title],
                        :description => params[:description],
                        :label => params[:label],
                        :source => params[:source],
                        :source_url => params[:source_url],
                        :changelog => params[:changelog],
                        :game => game)
  game.versions.push(version)

  url = Url.new(:title => version.title, :game => game)

  error 422 unless game.save && version.save && url.save

  response = { :version => "#{ENV['SITE_ROOT']}/game/#{url.slug}/#{version.id}" }
  response.to_json
end

post '/game/:slug_text' do
  slug = Url.first(:slug => params[:slug_text])
  error 404 if slug.nil?
  puts "found slug"

  game = slug.game
  error 404 if game.nil?
  puts "found game"

  error 403 unless logged_in?
  error 403 if current_user != game.author

  version = Version.new(:title => params[:title],
                        :description => params[:description],
                        :label => params[:label], 
                        :source => params[:source],
                        :source_url => params[:source_url],
                        :changelog => params[:changelog], 
                        :game => game)
  game.versions.push(version)

  error 422 unless game.save && version.save

  if (version.title != slug.title) then
    url = Url.new(:title => version.title, :game => game)
    error 422 unless url.save
  end

  response = { :version => "#{ENV['SITE_ROOT']}/game/#{url.slug}/#{version.id}" }
  response.to_json
end

delete '/game/:slug' do
  game = Url.first(:slug => params[:slug]).andand.game

  error 403 unless logged_in?
  error 403 if (current_user != game.author && !current_user.admin?)
  
  response = { :success => game.destroy }
  response.to_json
end

delete '/game/:slug/:version_id' do
  game = Url.first(:slug => params[:slug]).andand.game
  error 404 if game.nil?

  error 403 unless logged_in?
  error 403 if (current_user != game.author && !current_user.admin?)

  version = game.versions.filter {|v| v.id = version_id }
  error 404 if version.nil?

  response = { :success => version.destroy }
  response.to_json
end
