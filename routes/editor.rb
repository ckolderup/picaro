# Index
get '/editor/index' do
  force_login
  @games = Game.all conditions: {author: current_user}
  @games.reject! {|g| g.versions.nil? || g.versions.empty?}
  error 404 unless @games
  haml :"editor/index", :locals => { :title => "Games by #{current_user.display_name}", :games => @games.compact }
end

# New
get '/editor/new' do
  force_login

  game = Game.new
  version = Version.new game: @game
  version.title = 'A New Picaro Game'
  version.source = File.read(path_to_example_game(:my_first_picaro))
  haml :"editor/new", locals: {game: game, version: version}, layout: :"editor/layout"
end

# Create
post '/editor' do
  force_login

  game = Game.create author: current_user
  version = Version.new_from_yaml_and_game(params[:game][:source], game)
  url = Url.new(:title => version.title, :game => game)
  game.urls << url

  if game.save && version.save && url.save
    flash[:success] = "Your game is saved."
    redirect "/editor/#{game.id}"
  else
    flash[:error] = "There was a problem saving your game."
    haml :"editor/new", locals: {game: game, version: nil}, layout: :"editor/layout"
  end
end

# Edit
get '/editor/:game_id' do
  force_login

  if params[:testing]
    @game = Game.new
    @version = Version.new :source => File.read(path_to_example_game(params[:game_id]))
  else
    @game = Game.first(:conditions => { :author => current_user, :id => params[:game_id] })
    error 404 and return unless @game
    @version = @game.versions.first
  end
  error 404 unless @version
  haml :"editor/edit", layout: :"editor/layout", locals: {game: @game, version: @version}
end

# Update
put '/editor/:game_id' do
  force_login
  find_game
  @version = @game.versions.first

  if @version.update_from_yaml(params[:game][:source])
    flash[:success] = "Your game was updated."
    redirect "/editor/#{@game.id}"
  else
    flash[:error] = "There was a problem updating your game."
    haml :"editor/#{@game.id}", locals: {game: @game}, layout: :"editor/layout"
  end
end

get '/editor/:game_id/publish' do
  force_login
  find_game
  if @game.update published: !@game.published
    flash[:success] = "Your game has been published."
  else
    flash[:error] = "There was a problem publishing your game."
  end
  redirect '/games'
end

def find_game
  @game = Game.first :conditions => { :author => current_user, :id => params[:game_id] }
end

def path_to_example_game(game_id)
  File.join(File.dirname(__FILE__), '..', 'public', 'game_data', "#{game_id}.yaml")
end

