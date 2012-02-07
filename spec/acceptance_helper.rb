require File.dirname(__FILE__) + '/spec_helper'
disable :run

require 'capybara'
require 'capybara/dsl'
require File.dirname(__FILE__) + '/../picaro'

Capybara.register_driver :selenium do |app|
  Capybara::Selenium::Driver.new(app, :browser => :chrome)
end

Capybara.default_driver = :selenium
Capybara.default_wait_time = 2
Capybara.app = Picaro

RSpec.configure do |config|
  config.include Capybara::DSL
end

class Capybara::Node::Element
  def invisible?
    wait_until { !base.visible? }
  end
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

def take_screenshot
  # page.driver.browser.save_screenshot("./selenium_snapshot.png")
  save_and_open_page
end