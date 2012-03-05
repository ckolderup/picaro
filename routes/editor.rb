get '/editor' do
  @game = File.read(File.join(File.dirname(__FILE__), '..', 'public', 'game_data', "#{params[:game_id]}.yaml"))
  haml :editor, :locals => {:game_yaml => @game}, :layout => :editor_layout
end