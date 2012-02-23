require 'rubygems'
require 'rspec'

require 'capybara'
require 'capybara/rspec'

require 'rspec/core/rake_task'

require './spec/spec_helper'

def pid_file
  File.expand_path('./tmp/rackup.pid')
end

desc "Run all examples"
RSpec::Core::RakeTask.new do |task|
  task.rspec_opts = ["-c", "-f progress", "-r ./spec/spec_helper.rb"]
  task.pattern    = 'spec/**/*_spec.rb'
end

desc "Start up Guard for CoffeeScript compilation of app/player & spec/coffeescript files"
task :guard do
  system('bundle exec guard')
end

desc "Compile CoffeeScript files in app/player into public/js"
task :compile_coffee do
  system 'coffee --bare --compile --output public/js app/player'
end

desc "Use Require.js optimizer to concat and minify JavaScript files in public/js"
task :uglify do
  system 'node node_modules/.bin/r.js -o public/js/app.build.js'
end

desc "Compile CS and build JS bundle. Could someday do CSS (and possible spriting?) too"
task :bundle_static_assets => [:compile_coffee, :uglify]

task :deploy do
  system 'git checkout release'
  system 'git merge master'
  Rake::Task["bundle_static_assets"].execute
  system 'git add public/js'
  system 'git commit -m "automated deploy"'
  system 'git push -f heroku release:master'
  system 'git checkout master'
end

desc "Start up local Sinatra app with environment variables on localhost:9292"
task :rackup do
  system("source ./env.sh && bundle exec rackup -D --pid #{pid_file}")
end

desc "Shut down rack server"
task :rackdown do
  Process.kill("KILL", IO.read(pid_file).to_i)
  File.delete(pid_file)
end

desc "Start up a development server"
task :run => [:rackup, :guard, :rackdown]

task :default => [:spec]
