require File.dirname(__FILE__) + '/acceptance_helper'

describe Picaro do
  before do
    Capybara.current_driver = Capybara.javascript_driver # :selenium by default
  end

  context 'the application root' do
    it "should help a man see about a horse" do
      visit '/'
      selector('body').text.should match /You have plenty of room for a horse/
    end
  end

  context '/play', :js => true, :type => :request do
    it "looking at the Leaf updates the game" do
      play '/leaf'
      page.has_selector?("#footer-look").should be_true

      click_on 'Look'
      find('#action-look.ui-action').should be_visible
      click_on 'Leaf'

      find('#game p.new').should have_content('It seems rather far away.')
    end
  end
end