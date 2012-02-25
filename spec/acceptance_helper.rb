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
    wait_until { !base.visible? } || wait_until { !base.visible? }
  end

  def visible?
    wait_until { base.visible? } || wait_until { base.visible? }
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

def older_updates
  all('#game p.old')
end

def latest_update
  find '#game p.new'
end

def action_link_selector actionId, itemId
  "a[data-action-id='#{actionId}-#{itemId}']"
end

def action_link actionId, itemId
  find action_link_selector(actionId, itemId)
end

def click_compass_direction direction
  direction_element = find('#move-compass-' + direction.to_s + ' a')
  direction_element.should be_visible
  direction_element[:class].should_not match /disabled/
  direction_element.click
end

def take_screenshot
  page.driver.browser.save_screenshot("./screenie.png")
  # save_and_open_page
end