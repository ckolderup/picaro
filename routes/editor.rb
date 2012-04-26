get '/editor/new' do
  @game = "---\n"
  haml :editor, :locals => {:game_yaml => @game}, :layout => :editor_layout
end

get '/editor/:game_id' do
  @game = if params[:testing]
    Game.new :source => File.read(File.join(File.dirname(__FILE__), '..', 'public', 'game_data', "#{params[:game_id]}.yaml"))
  else
    Game.first :conditions => { :author => current_user, :id => params[:game_id] }
  end
  error 404 unless @game
  haml :editor, :locals => {:game_yaml => @game.source}, :layout => :editor_layout
end

post '/editor' do
  @game = Game.new(params[:game])
  @game.author = current_user
  if @game.save
    flash[:success] = "Your game is saved."
    redirect "/editor/#{@game.id}"
  end
end