subdomain :api do |sub|
  get '/game/:slug' do
    #check published or permissioned
    game = Url.get(slug).game

    error 404 if game.nil?
    
    game_info = { 
      :author => game.author.display_name,
      :game => game.versions.first.source
    }
    
    game_info.to_json
  end

  get '/game/:slug/versions' do
    #check published or permissioned
    game = Url.get(slug).game

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

  get '/game/:slug/:version_id' do
    #check published or permissioned
    game = Url.get(slug).game
    error 404 if game.nil?

    version = game.versions.filter { |v| v.id == version_id }.first

    game_info = {
      :author => game.author.display_name,
      :game => version.source
    }

    game_info.to_json
  end

  put '/game/new' do
    error 403 unless logged_in?

    game = Game.new(:author => current_user)
    version = Version.new(:label => params[:label],
                          :source => params[:source],
                          :changelog => params[:changelog],
                          :game => game)
    game.versions.push(version)
    slug = Url.new(:title => version.title, :slug => version.title, :game => game)

    error 422 unless game.save and version.save and slug.save

    response = { :version => "#{ENV['SITE_ROOT']}/game/#{slug.text}/#{version.id}" }
    response.to_json
  end

  post '/game/:slug_text' do
    slug = Url.get(slug_text)
    game = slug.game

    error 403 unless logged_in?
    error 403 if current_user != game.author

    version = Version.new(:label => params[:label], 
                          :source => params[:source], 
                          :changelog => params[:changelog], 
                          :game => game)
    error 422 unless version.save

    game.versions.push(version)
    error 422 unless game.save

    if (version.title != slug.title) then
      slug = Slug.new(:title => version.title, :game => game)
      error 422 unless s.save
    end

    response = { :version => "#{ENV['SITE_ROOT']}/game/#{slug.text}/#{version.id}" }
    response.to_json
  end

  delete '/game/:slug' do
    game = Url.get(slug).game

    error 403 unless logged_in?
    error 403 if (current_user != game.author && !current_user.admin?)
    
    #return status
    response = { :success => game.destroy }
    response.to_json
  end

  delete '/game/:slug/:version_id' do
    game = Url.get(slug).game

    error 403 unless logged_in?
    error 403 if (current_user != game.author && !current_user.admin?)

    version = game.versions.filter {|v| v.id = version_id }

    response = { :success => version.destroy }
    response.to_json
  end
end
