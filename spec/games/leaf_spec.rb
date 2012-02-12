require File.dirname(__FILE__) + '/../acceptance_helper'

describe "Playing Picaro/leaf" do

  before { play '/leaf' }

  let(:look)      { find('#footer-look a') }
  let(:use)       { find('#footer-use a') }
  let(:take)      { find('#footer-take a') }

  let(:look_menu) { find('#action-look') }
  let(:take_menu) { find('#action-take') }
  let(:use_menu)  { find('#action-use') }


  describe "looking" do
    it "updates the game text and closes the menu" do
      look_menu.should be_invisible
      look.click
      look_menu.should be_visible

      action_link('look', 'leaf').click
      latest_update.should have_content 'It seems rather far away.'

      look.click
      action_link('look', 'rake').click
      latest_update.should have_content 'The rake is a bit rusty.'
    end
  end

  describe "taking" do
    context "the rake" do
      it "updates the game text and removes it from the take menu" do
        take_menu.should be_invisible
        take.click

        take_menu.should be_visible
        action_link('take', 'rake').click
        latest_update.should have_content('You take the Rake.')

        take.click
        page.should_not have_selector action_link_selector('take', 'rake')
      end
    end
  end

  describe "using" do
    context "the rake on the leaf" do

      it "tells the player why the leaf can't be taken, leaving it in the take menu" do
        latest_update.should have_content 'You see a Leaf, a Rake and a The Autumn.'

        take.click
        action_link('take', 'leaf').click
        latest_update.should have_content("You can't take the Leaf. You're not tall enough.")

        take.click
        action_link('take', 'leaf').should be_visible
        action_link('take', 'autumn').should be_visible

        take_menu.should be_visible
        action_link('take', 'autumn').click

        take_screenshot
        latest_update.should have_content("You can't take the The Autumn")
      end

      it "is possible after taking the rake" do
        latest_update.should have_content 'You see a Leaf, a Rake and a The Autumn.'

        take.click
        action_link("take", "rake").click

        latest_update.should have_content 'You take the Rake.'
        page.should have_no_selector action_link_selector('take', 'rake') # they done took the rake

        take.click
        action_link('take', 'leaf').click

        latest_update.should have_content 'You take the Leaf.'
        page.should have_no_selector action_link_selector('take', 'leaf')
      end
    end
  end

end