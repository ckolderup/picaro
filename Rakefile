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

desc "Start up Guard for coffeescript development"
task :guard do
  system('bundle exec guard')
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
task :run do
    Rake::Task["rackup"].execute
    Rake::Task["guard"].execute
    Rake::Task["rackdown"].execute
end

task :default => [:spec]
