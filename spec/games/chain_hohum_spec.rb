require File.dirname(__FILE__) + '/../acceptance_helper'

describe "Playing Picaro/chain_hohum: " do
  before { play 'chain_hohum' }

  let(:use)       { find('#footer-use a') }
  let(:take)      { find('#footer-take a') }
  let(:take_menu) { find('#action-take') }
  let(:use_menu)  { find('#action-use') }

  context "using an item on another item" do
    it "replaces the two items with a new one" do
      take.click
      action_link('take', 'sunglasses').click

      # Sunglasses are taken
      page.should have_no_selector action_link_selector('take', 'sunglasses')
      page.should have_selector action_link_selector('use', 'sunglasses')

      # jackalope is still waitin' for the takin'
      take.click
      action_link('take', 'jacques%27oLope').should be_visible

      use.click
      action_link('use', 'sunglasses').click
      use_menu.should be_visible
      action_link('use', 'jacques%27oLope').click

      use.click

      # The jackalope in your inventory is now a cool jackalope
      action_link('use', 'coolJackalope').should be_visible
      action_link('use', 'coolJackalope').find('small').should have_content "(held)"

      # The formerly separate items are gone
      page.should have_no_selector action_link_selector('use', 'sunglasses')
      page.should have_no_selector action_link_selector('use', 'jackalope')

      # The second "after" event printed its message
      latest_update.should have_content 'Nothing that cool ever happened again. You died a sad man.'
    end
  end

end