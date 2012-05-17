get '/game/:slug/view' do
  game = Url.first(:slug => params[:slug]).andand.game
  error 404 if game.nil?

  version = game.last_available_version
  error 404 if version.nil?

  haml :game_detail, :locals => { :game => game, :version => version }
end

get '/game/:slug/:version_id/view' do
  game = Url.first(:slug => params[:slug]).andand.game
  version = Version.get(params[:version_id])
  error 404 if game.nil? or version.nil? or !game.versions.include?(version)
  error 404 unless version.published? || game.author == current_user

  haml :game_detail, :locals => { :game => game, :version => version }
end

get '/game/:slug/src' do
  game = Url.first(:slug => params[:slug]).andand.game
  error 404 if game.nil?

  version = game.last_available_version
  error 404 if version.nil?

  if data = game_data(game.id)
    yaml = YAML.load data
    yaml.to_json
  end
end

get '/games/by/:username' do
  user = User.first(:username => params[:username])
  error 404 if user.nil?

  games = Game.all(:author => user)
  error 404 if games.nil? #but might want to instead push a specific message

  haml :game_list, :locals => { :title => "Games by #{user.display_name}",
                                :games => games }
end

get '/games' do
  versions = Version.all(:limit => 15, :order => [ :uploaded_at.desc ])
  error 404 if versions.nil? #but we might want to add a placeholder instead

  haml :game_list, :locals => { :title => "Recent Games",
                                :games => versions.map{|v| v.game }.uniq }
end
