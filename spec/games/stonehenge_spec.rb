# encoding: utf-8
require File.dirname(__FILE__) + '/../acceptance_helper'

describe "Playing Picaro/stonehenge: " do
  before { play 'stonehenge' }

  let(:use)       { find('#footer-use a') }
  let(:take)      { find('#footer-take a') }
  let(:take_menu) { find('#action-take') }
  let(:use_menu)  { find('#action-use') }

  let(:move_action)  { find "#header-move" }
  let(:compass_rose) { find('#move-compass') }
  let(:room_header)  { find('#header h2') }

  it "has one room open to the north" do
    move_action.click
    compass_rose.should be_visible

    find('#move-compass-north')[:class].should be_empty
    find('#move-compass-east')[:class].should == "disabled"
    find('#move-compass-south')[:class].should == "disabled"
    find('#move-compass-west')[:class].should == "disabled"
  end

  context "trying to use the leaf on the cauldron" do
    it "doesn't work when you're holding the rake" do
      take.click
      action_link('take', 'rake').click
      latest_update.should have_content 'You take the Rake.'

      use.click
      use_menu.should be_visible
      action_link('use', 'rake').click
      use_menu.should be_visible
      action_link('use', 'leaf').click

      # now we're holding the leaf and rake
      page.should have_no_selector action_link_selector('take', 'leaf')
      page.should have_no_selector action_link_selector('take', 'rake')

      move_action.click
      compass_rose.should be_visible
      find('#move-compass-north').click

      room_header.text.should == "STONEHENGE"
      latest_update.text.should match /Ancient power fills the air./

      use.click
      action_link('use', 'leaf').click
      action_link('use', 'cauldron').click

      latest_update.text.should match /Stonehenge bristles at your temerity, to wield a metal object in its presence./

      # we still hold the leaf and rake
      page.should have_selector action_link_selector('use', 'leaf')
      page.should have_selector action_link_selector('use', 'rake')
    end

    it "does work when you've dropped the rake" do
      take.click
      action_link('take', 'rake').click
      latest_update.should have_content 'You take the Rake.'

      use.click
      use_menu.should be_visible
      action_link('use', 'rake').click
      use_menu.should be_visible
      action_link('use', 'leaf').click

      # now we're holding the leaf and rake
      page.should have_no_selector action_link_selector('take', 'leaf')
      page.should have_no_selector action_link_selector('take', 'rake')

      use.click
      action_link('use', 'rake').click
      action_link('use', 'tree').click
      latest_update.text.should match /You lean the rake up against the tree./

      # the rake is in the room again
      page.should have_selector action_link_selector('take', 'rake')
      # not in our inventory
      page.should have_no_selector (action_link_selector('use', 'rake') + ' small')

      take_screenshot

      move_action.click
      compass_rose.should be_visible
      find('#move-compass-north').click

      room_header.text.should == "STONEHENGE"
      latest_update.text.should match /Ancient power fills the air./

      use.click
      action_link('use', 'leaf').click
      action_link('use', 'cauldron').click

      nth_latest_update(2).text.should match /The cauldron bubbles violently. The resulting potion cures scabies./
      ending_update.text.should == "This has been “Stonehenge Rising” by Anonymous."
    end


  end

end