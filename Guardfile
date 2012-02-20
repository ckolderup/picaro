# A sample Guardfile
# More info at https://github.com/guard/guard#readme

# guard 'coffeescript',
#   :input => 'app/player',
#   :output => 'public/js',
#   :bare => true #because we are already wrapping files with Require.js, no need for CS wrapper

guard 'coffeescript', :output => 'public/js', :bare => true do
  watch(%r{app/player/(.+\.coffee)})
  watch(%r{spec/coffeescript/(.+\.coffee)})
end
