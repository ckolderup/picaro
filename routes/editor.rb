# Index
get '/editor/index' do
  @games = Game.all conditions: {author: current_user}
  haml :"editor/index", :locals => { :title => "Editorstyles", :games => @games }
end

# New
get '/editor/new' do
  @game = Game.new
  @version = Version.new(game: @game)
  @version.title = 'A New Picaro Game'
  @version.source = File.read(path_to_example_game(:my_first_picaro))
  haml :"editor/new", locals: {game: @game, version: @version}, layout: :"editor/layout"
end

# Create
post '/editor' do
  @game = Game.create author: current_user
  @version = Version.create_from_yaml_and_game(params[:game][:source], @game)

  if @game.save && @version.save
    flash[:success] = "Your game is saved."
    redirect "/editor/#{@game.id}"
  else
    flash[:error] = "There was a problem saving your game."
    haml :"editor/new", locals: {game: @game}, layout: :"editor/layout"
  end
end

# Edit
get '/editor/:game_id' do
  if params[:testing]
    @game = Game.new
    @version = Version.new :source => File.read(path_to_example_game(params[:game_id]))
  else
    @game = Game.first(:conditions => { :author => current_user, :id => params[:game_id] })
    @version = @game.versions.first
  end
  error 404 unless @version

  haml :"editor/edit", layout: :"editor/layout", locals: {game: @game, version: @version}
end

# Update
put '/editor/:game_id' do
  @game = Game.first :conditions => { :author => current_user, :id => params[:game_id] }
  @version = @game.versions.first
  if @version.update(:source => params[:game][:source])
    flash[:success] = "Your game was updated."
    redirect "/editor/#{@game.id}"
  else
    flash[:error] = "There was a problem updating your game."
    haml :"editor/#{@game.id}", locals: {game: @game}, layout: :"editor/layout"
  end
end

def path_to_example_game(game_id)
  File.join(File.dirname(__FILE__), '..', 'public', 'game_data', "#{game_id}.yaml")
end

