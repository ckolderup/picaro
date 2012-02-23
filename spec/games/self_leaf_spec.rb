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
      latest_update.text.should match /You quaff the potion. You now have the ability to SEE THROUGH TIME./
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
      latest_update.text.should match /You quaff the potion. You now have the ability to SEE THROUGH TIME./
  	end
  end
end