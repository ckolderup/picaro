# encoding: utf-8
require File.dirname(__FILE__) + '/../acceptance_helper'

describe "Playing Picaro/leaf" do
  before { play 'self_leaf'}

  let(:use)       { find('#footer-use a') }
  let(:take)      { find('#footer-take a') }

  describe "using the leaf and potion on yourself" do
    it "fires events as expected" do
      use.click
      action_link('use', 'self').should be_visible

      take.click
      action_link('take', 'leaf').click
      latest_update.should have_content("You take the Leaf.")

      use.click
      action_link('use', 'leaf').click
      action_link('use', 'self').click
      latest_update.text.should match /You rub the leaf all over your face/

	    use.click
      action_link('use', 'potion').click
      action_link('use', 'self').click
      nth_latest_update(2).text.should match /You quaff the potion. You now have the ability to SEE THROUGH TIME./
      ending_update.text.should match /This has been “Leaf Thyself” by Patrick Ewing/
    end
  end

  describe "looking at the Compass repeatedly" do
    let(:look) { find('#footer-look a') }

    it "changes its Look property, and then name" do
      look.click
      action_link('look', 'compass').text.should match /Compass/

      action_link('look', 'compass').click
      latest_update.text.should match /cased in a tarnished silver/

      look.click
      action_link('look', 'compass').click
      latest_update.text.should match /it appears the compass may be hollow/

      look.click
      action_link('look', 'compass').click
      latest_update.text.should match /open the compass and discover a small quantity/

      page.find_link 'Reddish Powder'
    end
  end


  describe "removing an object" do
  	it "displays a message and removes the object from Inventory and the room" do
      take.click
      action_link('take', 'leaf').click
      latest_update.should have_content("You take the Leaf.")

      use.click
      page.should have_selector (action_link_selector('use', 'leaf') + ' small') # its in the inventory

      action_link('use', 'leaf').click
      action_link('use', 'potion').click
      latest_update.text.should match /The leaf dissolves in the flask/

      # It's gone!
      use.click
      page.should have_no_selector (action_link_selector('use', 'leaf') + ' small')
      page.should have_no_selector (action_link_selector('use', 'leaf'))
      page.should have_no_selector (action_link_selector('take', 'leaf'))
      page.should have_no_selector (action_link_selector('look', 'leaf'))
      page.should have_selector (action_link_selector('look', 'potion'))

      # the game is still winnable
      use.click
      action_link('use', 'potion').click
      action_link('use', 'self').click
      nth_latest_update(2).text.should match /You quaff the potion. You now have the ability to SEE THROUGH TIME./
      ending_update.text.should match /This has been “Leaf Thyself” by Patrick Ewing/
  	end
  end
end