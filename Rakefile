require 'rubygems'
require 'rspec'

require 'capybara'
require 'capybara/rspec'

require 'rspec/core/rake_task'

require './spec/spec_helper'

desc "Run all examples"
RSpec::Core::RakeTask.new do |task|
  task.rspec_opts = ["-c", "-f progress", "-r ./spec/spec_helper.rb"]
  task.pattern    = 'spec/**/*_spec.rb'
end

task :default => [:spec]