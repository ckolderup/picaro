# encoding: utf-8
require File.dirname(__FILE__) + '/../acceptance_helper'

describe "Playing Picaro/melee_island: " do
  before { play 'melee_island' }

  let(:use)       { find('#footer-use a') }
  let(:take)      { find('#footer-take a') }
  let(:take_menu) { find('#action-take') }
  let(:use_menu)  { find('#action-use') }

  let(:move_action)  { find "#header-move" }
  let(:compass_rose) { find('#move-compass') }
  let(:room_header)  { find('#header h2') }

  context "navigating around the game and combining items" do
    it "should work" do
      room_header.text.should == "LOOKOUT POINT"

      # The "Yourself" item has no look property, so there's no action menu item for it
      page.should have_no_selector action_link_selector('look', 'self')
      # But you need to be able to use things on yourself
      page.should have_selector action_link_selector('use', 'self')


      move_action.click
      click_compass_direction 'south'

      room_header.text.should == "SCUMM BAR TRAIL"
      move_action.click

      # this room has paths to the north, east and south.
      find('#move-compass-north')[:class].should be_empty
      find('#move-compass-east')[:class].should be_empty
      find('#move-compass-south')[:class].should be_empty
      find('#move-compass-west')[:class].should == "disabled"
      click_compass_direction 'east'

      move_action.click
      click_compass_direction 'east'
      room_header.text.should == "SCUMM BAR KITCHEN"

      use.click
      use_menu.should be_visible
      action_link('use', 'hunkOfMeat').click
      use_menu.should be_visible

      # using the hunk of meat on the pot of stew.
      action_link('use', 'potO%27Stew').click

      # the hunk of meat is gone, but the pot still exists
      page.should have_no_selector action_link_selector('use', 'hunkOfMeat')
      page.should have_selector action_link_selector('use', "potO%27Stew")

      # now we're holding a new item:  stewed meat
      action_link('use', 'stewedMeat').find('small').should have_content "(held)"

      move_action.click
      click_compass_direction 'west'
      room_header.text.should == "SCUMM BAR"
    end

  end

end