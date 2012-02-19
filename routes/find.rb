get '/game/:slug/view' do
  game = Url.get(params[:slug]).andand.game
  error 404 if game.nil?
  version = game.versions.last
  show_game(game, version)
end

get '/game/:slug/:version_id/view' do
  game = Url.get(params[:slug]).andand.game
  version = Version.get(params[:version_id])
  error 404 if game.nil? or version.nil? or !game.versions.include?(version)

  show_game(game, version)
end

def show_game(game, version)
  haml :game_detail, :locals => { :game => game, :version => game.versions.last }
end

get '/games/by/:username' do
  user = User.first(:username => params[:username])
  games = Game.all(:author => user)
  haml :game_list, :locals => { :title => "Games by #{user.display_name}",
                                :games => games }
end

get '/games/recent' do
  versions = Version.all(:limit => 15, :order => [ :uploaded_at.desc ])
  haml :game_list, :locals => { :title => "Recent Games", 
                                :games => versions.map {|v| v.game } }
end

get '/game/new' do
  force_login :next => request.fullpath

  haml :game_edit, :locals => { :game => nil, :version => nil,
                                :upload_to => "#{ENV['SITE_ROOT']}/game/new", 
                                :upload_method => "POST" }
end

get '/game/:slug/edit' do
  force_login :next => request.fullpath

  game = Url.get(params[:slug]).andand.game
  error 404 if game.nil?
  error 403 if game.author != current_user

  latest_version = game.versions.last

  haml :game_edit, :locals => { :game => game, :version => latest_version,
                                :upload_to => "#{ENV['SITE_ROOT']}/game/#{slug}", 
                                :upload_method => "POST" }
end
