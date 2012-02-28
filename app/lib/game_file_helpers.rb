module Sinatra
  module GameFileHelpers

    def game_data(game_id)
      if File.exist? game_file_path(game_id, 'yaml')
        File.read game_file_path(game_id, 'yaml')
      elsif File.exist? game_file_path(game_id, 'json')
        File.read game_file_path(game_id, 'json')
      end
    end

    def game_file_path(game_id, format = 'yaml')
      Picaro.public_folder + '/game_data/' + params[:game_id].to_s + '.' + format
    end

  end

  helpers GameFileHelpers

end