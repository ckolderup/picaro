require File.dirname(__FILE__) + '/spec_helper'
disable :run

require 'capybara'
require 'capybara/dsl'

Capybara.register_driver :selenium do |app|
  Capybara::Selenium::Driver.new(app, :browser => :chrome)
end

require File.dirname(__FILE__) + '/../picaro'
Capybara.app = Picaro

RSpec.configure do |config|
  config.include Capybara::DSL
end

# Helpers
def play game_id
  visit '/play/' + game_id.to_s
end

def signin email, password
  visit '/'
  # within('#sign-in') do
    fill_in 'email', :with => email
    fill_in 'password', :with => password
    click 'Sign in'
  # end
end

def selector string
  find :css, string
end