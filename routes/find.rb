get '/game/:slug' do
  game = Url.get(slug).game
  error 404 if game.nil?

  haml :game_detail, :game => game
end

get '/games/by/:username' do
  user = User.first(:username => username)
  games = Game.all(:author => user) 
  haml :game_list, :games => games
end

get '/games/recent' do
  versions = Version.all(:limit => 15, :order => [ :uploaded_at.desc ])
  haml :game_list, :games => versions.map {|v| v.game }
end

get '/game/new' do
  unless logged_in?
    flash[:error] = "You must be logged in to do that."
    redirect "/login?next=#{CGI.escape('/account')}"
  end

  haml :upload_game
end
