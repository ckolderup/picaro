require 'json'
require 'yaml'
module Sinatra
  module YAMLizer
    # yaml_parses_yaml = YAML.load File.read('public/game_data/yaml/hohum.yaml')
    # yaml_parses_json = YAML.load File.read('public/game_data/hohum.json')
    # json_parses_json = JSON.parse File.read('public/game_data/hohum.json')

    # puts "So compatible!!!!" if f1 == f2 and f2 == f3

    filename = 'public/game_data/broken_windows.json'
    converted_filename = 'public/game_data/broken_windows.yaml'

    f = File.read filename
    j = JSON.parse f
    y = j.to_yaml

    File.open converted_filename, 'w' do |new_f|
      y.each_line do |l| 
        puts l
        new_f << l
      end
    end
  end
end