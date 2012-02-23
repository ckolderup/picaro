get '/' do
  haml :index
end

get '/play/:game_id' do
  if File.exist?(Picaro.public_folder + '/game_data/' + params[:game_id].to_s + '.json')
    game_id = params[:game_id]
  end
  haml :play, :layout => false, :locals => { :game_id => game_id }
end
