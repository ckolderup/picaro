get '/' do
  haml :index
end

get '/play/:game_id' do
  @game_id = params[:game_id]
  erb :play
end

get '/games/:game_id' do
  data = params[:testing] ? test_game_data(params[:game_id]) : game_data(params[:game_id])
  if data
    yaml = YAML.load data
    yaml.to_json
  end
end
