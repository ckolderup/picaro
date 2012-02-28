get '/' do
  haml :index
end

get '/play/:game_id' do
  if File.exist?(Picaro.public_folder + '/game_data/' + params[:game_id].to_s + '.json') || File.exist?(Picaro.public_folder + '/game_data/yaml/' + params[:game_id].to_s + '.yaml')
    @game_id = params[:game_id]
  end
  erb :play
end

get '/games/:game_id' do
  begin
	  yaml = YAML.load File.read(Picaro.public_folder + '/game_data/yaml/' + params[:game_id].to_s + '.yaml')
  rescue
  	  yaml = YAML.load File.read(Picaro.public_folder + '/game_data/' + params[:game_id].to_s + '.json')
  end
  yaml.to_json
end
