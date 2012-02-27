require 'json'
require 'yaml'

filename = 'public/game_data/hohum.json'
converted_filename = 'public/game_data/yaml/hohum.yaml'

f = File.read filename
j = JSON.parse f
y = j.to_yaml

File.open converted_filename, 'w' do |new_f|
	y.each_line do |l| 
		puts l
		new_f << l
	end
end
