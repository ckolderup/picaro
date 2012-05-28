get '/' do
  haml :index
end

get '/play/:game_id' do
  @game_id = params[:game_id]
  data = params[:testing] ? test_game_data(@game_id) : game_data(@game_id)
  if data
    yaml = YAML.load data
    @game_source = yaml.to_json
  end
  erb :play
end

get '/docs' do
  haml :docs
end
