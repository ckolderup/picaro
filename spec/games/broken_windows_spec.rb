require File.dirname(__FILE__) + '/../acceptance_helper'

describe "Playing Picaro/broken_windows: " do
  before { play 'broken_windows' }

  let(:use)       { find('#footer-use a') }
  let(:take)      { find('#footer-take a') }
  let(:take_menu) { find('#action-take') }
  let(:use_menu)  { find('#action-use') }


  context "using an item on another item" do
    it "replaces the two items with a new one" do
      take.click
      take_screenshot
      action_link('take', 'sunglasses').click

      # Sunglasses are taken
      page.should have_no_selector action_link_selector('take', 'sunglasses')
      page.should have_selector action_link_selector('use', 'sunglasses')

      # jackalope is still waitin' for the takin'
      take.click
      take_screenshot
      action_link('take', 'jackalope').should be_visible

      use.click
      action_link('use', 'sunglasses').click
      use_menu.should be_visible
      action_link('use', 'jackalope').click

      use.click
      # The jackalope in your inventory is now a cool jackalope
      action_link('use', 'coolJackalope').should be_visible
      action_link('use', 'coolJackalope').find('small').should have_content "(held)"

      # The formerly separate items are gone
      page.should have_no_selector action_link_selector('use', 'sunglasses')
      page.should have_no_selector action_link_selector('use', 'jackalope')
    end

  #
  # context "looking at an item with a look counter" do
  #   it "shows new updates each time" do
  #     latest_update.should have_content 'You see a Rake and a Leaf.'
  #
  #     take.click
  #     action_link('take', 'rake').click
  #     latest_update.should have_content 'You take the Rake.'
  #
  #     take.click
  #     action_link('take', 'leaf').click
  #     latest_update.should have_content "You can't take the Leaf."
  #
  #     use.click
  #     use_menu.should be_visible
  #     action_link('use', 'rake').click
  #     use_menu.should be_visible
  #
  #     #using the rake on the leaf
  #     action_link('use', 'leaf').click
  #
  #     # the events fire too fast to catch all of them as the latest update... perhaps implement a brief wait in game code?
  #     older_updates.any? {|node| node.text == 'You take the Leaf.'}.should be_true
  #     older_updates.any? {|node| node.text == "You're able to catch the leaf on one of the rake's rusty tines and bring it on down."}.should be_true
  #     latest_update.should have_content('Using the leaf, you cure scabies.')
  #
  #     page.should have_no_selector action_link_selector('take', 'leaf')
  #     page.should have_no_selector action_link_selector('take', 'rake')
  #   end
  end

end