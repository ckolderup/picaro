# encoding: utf-8
require File.dirname(__FILE__) + '/../acceptance_helper'

describe "Playing Picaro/chain_hohum: " do
  before { play 'chain_hohum' }

  let(:use)       { find('#footer-use a') }
  let(:look)       { find('#footer-look a') }
  let(:take)      { find('#footer-take a') }
  let(:attack)    { find('#footer-attack a') }

  let(:take_menu) { find('#action-take') }
  let(:use_menu)  { find('#action-use') }
  let(:attack_menu)  { find('#action-attack') }

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

      # A series of unfortunate events: combining items triggers a message and then triggers an end game event.
      nth_latest_update(3).text.should match /You place the sunglasses on the jackalopes face. Hey, cool Jackalope./
      nth_latest_update(2).text.should match /Nothing that cool ever happened again. You died a sad man./
      ending_update.text.should match /This has been “Chain Hohum” by Casey Kolderup/u
    end
  end

  context "attack the attackable" do
    it "displays messages as hitpoints count down" do
      attack.click
      action_link('attack', 'jacques%27oLope').click
      latest_update.text.should match /Jackalopes are endangered- what kind of person ARE you\?/

      [ /The sunglasses fall to the floor./,
        /You dent the sunglasses./,
        /You crack the sunglasses/,
        /You destroy the sunglasses!/,
      ].each do |message|
        attack.click
        action_link('attack', 'sunglasses').click

        latest_update.text.should match message
      end

      # The sunglasses have been destroyed
      look.click
      page.should have_no_selector action_link_selector('look', 'sunglasses')

      # But the Jackalope? He's fine.
      look.click
      page.should have_selector action_link_selector('use', 'jacques%27oLope')
    end
  end

end
